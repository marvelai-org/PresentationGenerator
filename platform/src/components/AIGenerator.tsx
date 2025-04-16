import React, { useState } from 'react';
import { 
  generateOutline, 
  generateSlides, 
  OutlineGeneratorInput,
  SlideGeneratorInput
} from '../services/aiService';
import useAIProgress from '../hooks/useAIProgress';
import AIProgressBar from './AIProgressBar';
import serviceRegistry from '../services/serviceRegistry';

/**
 * Example component demonstrating the usage of AI service with progress tracking
 */
const AIGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [numSlides, setNumSlides] = useState(5);
  const [instructionalLevel, setInstructionalLevel] = useState('intermediate');
  const [slides, setSlides] = useState<any[]>([]);
  const [outlineComplete, setOutlineComplete] = useState(false);
  const [slidesComplete, setSlidesComplete] = useState(false);
  
  // Use our progress hook for tracking generation progress
  const { 
    progress, 
    updateProgress, 
    resetProgress, 
    setError,
    isInProgress
  } = useAIProgress();

  // Get list of available providers for UI display
  const availableProviders = serviceRegistry.getAvailableProviders();

  // Update service preferences
  const [prioritizeQuality, setPrioritizeQuality] = useState(true);
  const handleQualityToggle = () => {
    setPrioritizeQuality(!prioritizeQuality);
    serviceRegistry.updatePreferences({
      prioritizeQuality: !prioritizeQuality,
      prioritizeSpeed: prioritizeQuality // Inverse relationship
    });
  };

  const handleGenerateOutline = async () => {
    if (isInProgress) return;
    
    resetProgress();
    setOutlineComplete(false);
    setSlidesComplete(false);
    setSlides([]);

    try {
      const input: OutlineGeneratorInput = {
        topic,
        n_slides: numSlides,
        instructional_level: instructionalLevel
      };

      const result = await generateOutline(input, updateProgress);
      
      if (result.status === 'success') {
        setOutlineComplete(true);
        setSlides(result.slides.map((title, index) => ({ 
          id: index + 1, 
          title 
        })));
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleGenerateSlides = async () => {
    if (isInProgress || !outlineComplete || slides.length === 0) return;
    
    resetProgress();
    setSlidesComplete(false);

    try {
      const input: SlideGeneratorInput = {
        slides_titles: slides.map(slide => slide.title),
        topic,
        instructional_level: instructionalLevel
      };

      const result = await generateSlides(input, updateProgress);
      
      if (result.status === 'success') {
        setSlidesComplete(true);
        setSlides(result.slides);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Presentation Generator</h1>
      
      {/* Service provider info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Available AI Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableProviders.map(provider => (
            <div 
              key={provider.name} 
              className="p-3 bg-white rounded-md border"
            >
              <div className="font-medium">{provider.name}</div>
              <div className="text-sm text-gray-600">
                {Object.entries(provider.capabilities)
                  .filter(([key, value]) => value === true)
                  .map(([key]) => key.replace(/generate|Support/g, ''))
                  .join(', ')}
              </div>
            </div>
          ))}
        </div>
        
        {/* Quality/Speed preference toggle */}
        <div className="mt-4">
          <label className="flex items-center cursor-pointer">
            <div className="mr-3 text-sm font-medium">
              Prioritize: {prioritizeQuality ? 'Quality' : 'Speed'}
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={prioritizeQuality}
                onChange={handleQualityToggle}
              />
              <div className={`block w-14 h-8 rounded-full ${
                prioritizeQuality ? 'bg-blue-500' : 'bg-gray-400'
              }`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                prioritizeQuality ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
          </label>
        </div>
      </div>
      
      {/* Input form */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter presentation topic"
            className="w-full p-2 border rounded"
            disabled={isInProgress}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Number of Slides</label>
          <input
            type="number"
            value={numSlides}
            onChange={(e) => setNumSlides(parseInt(e.target.value) || 5)}
            min={1}
            max={20}
            className="w-full p-2 border rounded"
            disabled={isInProgress}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={instructionalLevel}
            onChange={(e) => setInstructionalLevel(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isInProgress}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateOutline}
            disabled={isInProgress || !topic}
            className={`px-4 py-2 rounded font-medium ${
              isInProgress || !topic
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Generate Outline
          </button>
          
          <button
            onClick={handleGenerateSlides}
            disabled={isInProgress || !outlineComplete}
            className={`px-4 py-2 rounded font-medium ${
              isInProgress || !outlineComplete
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Generate Slide Content
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <AIProgressBar progress={progress} className="bg-white rounded-lg shadow" />
      
      {/* Results */}
      {slides.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {slidesComplete ? 'Generated Slides' : 'Outline'}
          </h2>
          
          <div className="space-y-4">
            {slides.map((slide) => (
              <div key={slide.id} className="p-3 border rounded">
                <h3 className="font-medium">{slide.title}</h3>
                
                {slidesComplete && slide.content && (
                  <div className="mt-2 text-sm">
                    <p>{slide.content}</p>
                    
                    {slide.bullets && slide.bullets.length > 0 && (
                      <ul className="list-disc pl-5 mt-2">
                        {slide.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator; 
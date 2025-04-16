import React, { useState } from 'react';
import { useAutoRecovery } from '@/hooks/useAutoRecovery';
import { useVersionHistoryDialog } from '@/components/dialogs/VersionHistoryDialog';
import { usePersistedStore } from '@/store/index';

/**
 * Example component demonstrating how to use auto-recovery during complex
 * operations like presentation generation.
 */
export function GenerationWithRecovery() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoRecovery = useAutoRecovery();
  const { dialog, openVersionHistory } = useVersionHistoryDialog();
  const currentPresentationId = usePersistedStore(state => state.currentPresentationId);
  
  // This example simulates a lengthy generation process with potential for failure
  const generatePresentation = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Start recovery tracking
      autoRecovery.startOperation('presentation generation');
      
      // Simulate the generation process
      for (let i = 0; i <= 10; i++) {
        // Wait for a moment
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update progress
        setProgress(i * 10);
        
        // Create recovery points at key milestones
        if (i % 3 === 0) {
          await autoRecovery.createRecoveryPoint(`Generation progress ${i * 10}%`);
        }
        
        // Simulate a random error (20% chance)
        if (Math.random() < 0.2 && i > 0 && i < 9) {
          throw new Error('Generation failed at step ' + i);
        }
      }
      
      // End recovery tracking (success)
      autoRecovery.endOperation(true);
      
      // Complete
      setProgress(100);
    } catch (error) {
      console.error('Generation failed:', error);
      
      // End recovery tracking (failure)
      autoRecovery.endOperation(false);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Example of using withRecovery to wrap an async function
  const handleButtonClick = autoRecovery.withRecovery(
    generatePresentation,
    'manual presentation generation'
  );
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Presentation Generation Example</h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Generation Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handleButtonClick}
          disabled={isGenerating || !currentPresentationId}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate with Recovery'}
        </button>
        
        <button
          onClick={() => openVersionHistory(currentPresentationId)}
          disabled={!currentPresentationId}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          View Version History
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {!currentPresentationId && (
          <p>⚠️ Please select a presentation first to enable generation</p>
        )}
        <p>
          This example demonstrates using automatic recovery points during a complex
          operation. The generation has a 20% chance of failing at each step.
        </p>
      </div>
      
      {/* Render the version history dialog */}
      {dialog}
    </div>
  );
} 
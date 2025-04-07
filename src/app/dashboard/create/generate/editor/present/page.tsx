"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

// Sample slide data (same as in editor)
const sampleSlides = [
  {
    id: 1,
    title: "Can We REALLY Stop Climate Change?",
    subtitle: "The future of our planet is at stake. Let's explore the science, the impacts, and the potential solutions to climate change.",
    author: "Talha Sabri",
    editedTime: "about 1 month ago",
    image: "/images/earth.jpg",
    backgroundColor: "#1a0e2e",
    gradient: "linear-gradient(90deg, #ff5e62, #ff9966)",
    textColor: "#ff758c"
  },
  {
    id: 2,
    title: "The Science: Understanding the Greenhouse Effect",
    content: [
      "Greenhouse gases like carbon dioxide trap heat in our atmosphere",
      "Human activities, particularly burning fossil fuels, increase these gases",
      "This warming effect is causing global temperature rise"
    ],
    backgroundColor: "#1a0e2e" 
  },
  {
    id: 3,
    title: "Current Impacts: What We're Already Seeing",
    content: [
      "Rising sea levels threatening coastal communities",
      "More frequent and intense extreme weather events",
      "Disruption of ecosystems and biodiversity loss",
      "Agricultural challenges and food security risks"
    ],
    backgroundColor: "#1a0e2e"
  },
  {
    id: 4,
    title: "Projections: Scenarios and Their Implications",
    content: [
      "Best case: Limiting warming to 1.5°C requires immediate action",
      "Business as usual: 3-4°C warming with catastrophic consequences",
      "Tipping points could trigger irreversible changes",
      "Economic costs increase dramatically with delay"
    ],
    backgroundColor: "#1a0e2e"
  },
  {
    id: 5,
    title: "Solutions: Addressing the Challenge",
    content: [
      "Transition to renewable energy sources",
      "Improve energy efficiency across sectors",
      "Develop carbon capture technologies",
      "Protect and restore natural carbon sinks"
    ],
    backgroundColor: "#1a0e2e"
  },
  {
    id: 6,
    title: "Policy Approaches: Government Action",
    content: [
      "Carbon pricing mechanisms",
      "Regulatory standards for emissions",
      "Investment in clean technology research",
      "International cooperation and climate agreements"
    ],
    backgroundColor: "#1a0e2e"
  },
  {
    id: 7,
    title: "Individual Impact: What Can We Do?",
    content: [
      "Reduce personal carbon footprint",
      "Advocate for climate policies",
      "Support sustainable businesses",
      "Community engagement and education"
    ],
    backgroundColor: "#1a0e2e"
  },
  {
    id: 8,
    title: "Path Forward: Challenges and Opportunities",
    content: [
      "Balancing economic development with environmental protection",
      "Ensuring just transition for vulnerable communities",
      "Technological innovation as both challenge and opportunity",
      "Building resilience while pursuing mitigation"
    ],
    backgroundColor: "#1a0e2e"
  }
];

export default function PresentationPage() {
  const router = useRouter();
  const [slides] = useState(sampleSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [mouseIdle, setMouseIdle] = useState(false);
  
  const currentSlide = slides[currentSlideIndex];
  
  // Hide controls after 3 seconds of mouse inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      setMouseIdle(false);
      setControlsVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setMouseIdle(true);
        setControlsVisible(false);
      }, 3000);
    };
    
    window.addEventListener('mousemove', resetTimer);
    resetTimer();
    
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      clearTimeout(timer);
    };
  }, []);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        navigateToSlide(Math.min(currentSlideIndex + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateToSlide(Math.max(currentSlideIndex - 1, 0));
      } else if (e.key === 'Escape') {
        router.push('/dashboard/create/generate/editor');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length, router]);
  
  const navigateToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);
  
  const exitPresentation = () => {
    router.push('/dashboard/create/generate/editor');
  };
  
  return (
    <div 
      className="w-full h-screen bg-black overflow-hidden relative"
      onClick={() => {
        if (currentSlideIndex < slides.length - 1) {
          navigateToSlide(currentSlideIndex + 1);
        }
      }}
    >
      {/* Slide Content */}
      <div className="w-full h-full">
        {currentSlideIndex === 0 ? (
          // Title slide
          <div 
            className="w-full h-full bg-[#1a0e2e] flex" 
            style={{ 
              backgroundImage: `url(/climate-earth.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex-1 flex flex-col justify-center p-16">
              <h1 className="text-5xl font-bold mb-6 text-[#ff758c]">
                Can We REALLY Stop Climate Change?
              </h1>
              <p className="text-xl text-white mb-12">
                The future of our planet is at stake. Let's explore the science, the impacts, and the potential solutions to climate change.
              </p>
              <div className="flex items-center mt-auto">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  TS
                </div>
                <div className="ml-4">
                  <div className="text-white">by Talha Sabri</div>
                  <div className="text-gray-400 text-sm">Last edited about 1 month ago</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Content slides
          <div className="w-full h-full bg-[#1a0e2e] flex">
            <div className="flex-1 flex flex-col p-12">
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {currentSlide.title}
              </h2>
              <ul className="text-white text-xl space-y-6 list-disc pl-8">
                {currentSlide.content?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls (only visible when mouse is active) */}
      {controlsVisible && (
        <>
          {/* Exit Button */}
          <Button 
            isIconOnly
            variant="flat" 
            className="text-white bg-black/50 absolute top-4 right-4 z-10"
            onPress={exitPresentation}
          >
            <Icon icon="material-symbols:close" width={24} />
          </Button>
          
          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/60 rounded-full px-4 py-2 z-10">
            <Button 
              isIconOnly
              variant="flat" 
              className="text-white"
              isDisabled={currentSlideIndex === 0}
              onPress={(e) => {
                e.stopPropagation();
                navigateToSlide(Math.max(0, currentSlideIndex - 1));
              }}
            >
              <Icon icon="material-symbols:arrow-back" width={24} />
            </Button>
            
            <span className="text-white">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            
            <Button 
              isIconOnly
              variant="flat" 
              className="text-white"
              isDisabled={currentSlideIndex === slides.length - 1}
              onPress={(e) => {
                e.stopPropagation();
                navigateToSlide(Math.min(slides.length - 1, currentSlideIndex + 1));
              }}
            >
              <Icon icon="material-symbols:arrow-forward" width={24} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 
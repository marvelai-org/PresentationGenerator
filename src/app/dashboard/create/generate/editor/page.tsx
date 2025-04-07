"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sample slide data
const sampleSlides = [
  {
    id: 1,
    title: "Can We REALLY Stop Climate Change?",
    subtitle:
      "The future of our planet is at stake. Let's explore the science, the impacts, and the potential solutions to climate change.",
    author: "Talha Sabri",
    editedTime: "about 1 month ago",
    image: "/images/earth.jpg",
    backgroundColor: "#1a0e2e",
    gradient: "linear-gradient(90deg, #ff5e62, #ff9966)",
    textColor: "#ff758c",
  },
  {
    id: 2,
    title: "The Science: Understanding the Greenhouse Effect",
    content: [
      "Greenhouse gases like carbon dioxide trap heat in our atmosphere",
      "Human activities, particularly burning fossil fuels, increase these gases",
      "This warming effect is causing global temperature rise",
    ],
    backgroundColor: "#1a0e2e",
  },
  {
    id: 3,
    title: "Current Impacts: What We're Already Seeing",
    content: [
      "Rising sea levels threatening coastal communities",
      "More frequent and intense extreme weather events",
      "Disruption of ecosystems and biodiversity loss",
      "Agricultural challenges and food security risks",
    ],
    backgroundColor: "#1a0e2e",
  },
  {
    id: 4,
    title: "Projections: Scenarios and Their Implications",
    content: [
      "Best case: Limiting warming to 1.5°C requires immediate action",
      "Business as usual: 3-4°C warming with catastrophic consequences",
      "Tipping points could trigger irreversible changes",
      "Economic costs increase dramatically with delay",
    ],
    backgroundColor: "#1a0e2e",
  },
  {
    id: 5,
    title: "Solutions: Addressing the Challenge",
    content: [
      "Transition to renewable energy sources",
      "Improve energy efficiency across sectors",
      "Develop carbon capture technologies",
      "Protect and restore natural carbon sinks",
    ],
    backgroundColor: "#1a0e2e",
  },
  {
    id: 6,
    title: "Policy Approaches: Government Action",
    content: [
      "Carbon pricing mechanisms",
      "Regulatory standards for emissions",
      "Investment in clean technology research",
      "International cooperation and climate agreements",
    ],
    backgroundColor: "#1a0e2e",
  },
  {
    id: 7,
    title: "Individual Impact: What Can We Do?",
    content: [
      "Reduce personal carbon footprint",
      "Advocate for climate policies",
      "Support sustainable businesses",
      "Community engagement and education",
    ],
    backgroundColor: "#1a0e2e",
  },
  {
    id: 8,
    title: "Path Forward: Challenges and Opportunities",
    content: [
      "Balancing economic development with environmental protection",
      "Ensuring just transition for vulnerable communities",
      "Technological innovation as both challenge and opportunity",
      "Building resilience while pursuing mitigation",
    ],
    backgroundColor: "#1a0e2e",
  },
];

export default function PresentationEditorPage() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSlidePanel, setShowSlidePanel] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  const currentSlide = sampleSlides[currentSlideIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        navigateToSlide(Math.min(currentSlideIndex + 1, sampleSlides.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        navigateToSlide(Math.max(currentSlideIndex - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, sampleSlides.length]);

  const navigateToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (editorRef.current?.requestFullscreen) {
        editorRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePresent = () => {
    router.push("/dashboard/create/generate/editor/present");
  };

  return (
    <div
      ref={editorRef}
      className="flex flex-col h-screen bg-black overflow-hidden"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center p-2 bg-black border-b border-gray-800">
        <Button
          isIconOnly
          className="text-gray-400"
          size="sm"
          variant="light"
          onPress={() => router.push("/dashboard/create/generate/outline")}
        >
          <Icon icon="material-symbols:arrow-back" width={20} />
        </Button>

        <div className="text-gray-400 text-sm ml-2 truncate max-w-xs">
          Can We REALLY Stop Climate Change?
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            isIconOnly
            className="text-gray-400"
            size="sm"
            variant="light"
          >
            <Icon icon="material-symbols:color-lens" width={20} />
          </Button>

          <Button
            isIconOnly
            className="text-gray-400"
            size="sm"
            variant="light"
          >
            <Icon icon="material-symbols:share" width={20} />
          </Button>

          <Button
            className="bg-indigo-600 text-white"
            color="primary"
            startContent={
              <Icon icon="material-symbols:play-arrow" width={20} />
            }
            onPress={handlePresent}
          >
            Present
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide Thumbnails Panel */}
        {showSlidePanel && (
          <div className="w-48 bg-black border-r border-gray-800 overflow-y-auto flex-shrink-0">
            <div className="p-2 space-y-2">
              {sampleSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={`rounded overflow-hidden cursor-pointer relative w-full text-left ${currentSlideIndex === index ? "ring-2 ring-indigo-600" : ""}`}
                  onClick={() => navigateToSlide(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigateToSlide(index);
                    }
                  }}
                >
                  <div className="absolute top-1 left-2 text-xs text-white bg-black/50 px-1 rounded">
                    {index + 1}
                  </div>

                  <div className="h-24 bg-[#1a0e2e] p-2 text-center flex flex-col justify-center">
                    {index === 0 ? (
                      <>
                        <div className="text-[#ff758c] text-xs font-bold">
                          Can We REALLY Stop Climate Change?
                        </div>
                        <div className="text-white text-[8px] mt-1">
                          The future of our planet is at stake...
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-white text-xs font-bold truncate">
                          {slide.title}
                        </div>
                        <div className="text-gray-300 text-[8px] mt-1">
                          <ul className="list-disc list-inside">
                            {slide.content?.slice(0, 2).map((item, i) => (
                              <li key={i} className="truncate">
                                {item}
                              </li>
                            ))}
                            {(slide.content?.length || 0) > 2 && <li>...</li>}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Slide Preview */}
        <div className="flex-1 bg-[#191919] overflow-auto relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <Button
              isIconOnly
              className="text-gray-400"
              size="sm"
              variant="light"
              onPress={() => setShowSlidePanel(!showSlidePanel)}
            >
              {showSlidePanel ? (
                <Icon icon="material-symbols:chevron-left" width={20} />
              ) : (
                <Icon icon="material-symbols:chevron-right" width={20} />
              )}
            </Button>
          </div>

          <div className="flex justify-center items-center min-h-full p-8">
            <div className="w-full max-w-5xl aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
              {currentSlideIndex === 0 ? (
                // Title slide
                <div
                  className="w-full h-full bg-[#1a0e2e] flex"
                  style={{
                    backgroundImage: `url(/climate-earth.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="flex-1 flex flex-col justify-center p-16">
                    <h1 className="text-5xl font-bold mb-6 text-[#ff758c]">
                      Can We REALLY Stop Climate Change?
                    </h1>
                    <p className="text-xl text-white mb-12">
                      The future of our planet is at stake. Let&apos;s explore 
                      the science, the impacts, and the potential solutions to 
                      climate change.
                    </p>
                    <div className="flex items-center mt-auto">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        TS
                      </div>
                      <div className="ml-4">
                        <div className="text-white">by Talha Sabri</div>
                        <div className="text-gray-400 text-sm">
                          Last edited about 1 month ago
                        </div>
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
          </div>

          {/* Slide Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-4 py-1">
            <Button
              isIconOnly
              className="text-gray-400"
              isDisabled={currentSlideIndex === 0}
              size="sm"
              variant="light"
              onPress={() =>
                navigateToSlide(Math.max(0, currentSlideIndex - 1))
              }
            >
              <Icon icon="material-symbols:arrow-back" width={20} />
            </Button>

            <span className="text-gray-300 text-sm">
              {currentSlideIndex + 1} / {sampleSlides.length}
            </span>

            <Button
              isIconOnly
              className="text-gray-400"
              isDisabled={currentSlideIndex === sampleSlides.length - 1}
              size="sm"
              variant="light"
              onPress={() =>
                navigateToSlide(
                  Math.min(sampleSlides.length - 1, currentSlideIndex + 1),
                )
              }
            >
              <Icon icon="material-symbols:arrow-forward" width={20} />
            </Button>
          </div>

          {/* Right Toolbar */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 bg-black/30 p-1 rounded-lg">
            <Tooltip content="Image" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:image" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Text" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:format-text" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Theme" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:color-lens" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Fullscreen" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
                onPress={toggleFullscreen}
              >
                <Icon
                  icon={
                    isFullscreen
                      ? "material-symbols:fullscreen-exit"
                      : "material-symbols:fullscreen"
                  }
                  width={20}
                />
              </Button>
            </Tooltip>

            <Tooltip content="Help" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:help" width={20} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

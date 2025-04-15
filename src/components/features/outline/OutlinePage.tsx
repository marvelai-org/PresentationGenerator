'use client';

import React, { useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
  DragStartEvent,
  DragOverEvent,
  Over,
  DragCancelEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { OutlineProvider, useOutline } from './context/';
import { ThemeProvider, useThemeContext } from './context/';
import { ThemeSelectionModal } from './modals/ThemeSelectionModal/';
import { ImageSourceModal } from './modals/ImageSourceModal/';
import { AIModelModal } from './modals/AIModelModal/';
import SortableSlideCard from './components/SortableSlideCard';
import AddCardButton from './components/AddCardButton';
import DropIndicator from './components/DropIndicator';

export interface OutlinePageProps {
  // Any props needed
}

// The main outline content component that uses the context
function OutlineContent() {
  const {
    slides,
    activeId,
    recentlyDroppedId,
    isLoading,
    error,
    addSlide,
    addSlideAt,
    deleteSlide,
    updateSlide,
    reorderSlides,
    setActiveId,
    setRecentlyDroppedId,
  } = useOutline();

  const [over, setOver] = useState<Over | null>(null);
  const [activeIndicatorIndex, setActiveIndicatorIndex] = useState(-1);
  const [dragStatus, setDragStatus] = useState<string>('idle');

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Needs to move 8px before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    console.log(`Drag started: active=${active.id}`);
    setActiveId(Number(active.id));
    setDragStatus('dragging');
  };

  // Handle drag over event
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    setOver(over);

    if (over) {
      // Calculate which indicator should be active
      // If over a slide, find its index
      const overSlideIndex = slides.findIndex(slide => slide.id === over.id);

      // Set active indicator based on position
      if (overSlideIndex !== -1) {
        setActiveIndicatorIndex(overSlideIndex);
      }
    }
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log(`Drag ended: active=${active.id}, over=${over?.id || 'none'}`);
    setDragStatus('idle');

    if (over && active.id !== over.id) {
      reorderSlides(Number(active.id), Number(over.id));
    }

    // Clear drag states
    setTimeout(() => {
      setActiveId(null);
      setOver(null);
      setActiveIndicatorIndex(-1);
    }, 10);
  };

  // Handle drag cancel event
  const handleDragCancel = (event: DragCancelEvent) => {
    console.log('Drag cancelled', event);
    setActiveId(null);
    setOver(null);
    setDragStatus('idle');
    setActiveIndicatorIndex(-1);
  };

  // Show loading state if data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <Icon className="text-primary" icon="material-symbols:refresh" width={32} />
          </div>
          <p className="text-gray-300">Generating your outline...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-danger">
          <Icon icon="material-symbols:error-outline" width={48} />
        </div>
        <h3 className="text-xl font-semibold text-danger mb-2">Error</h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <Button
          color="primary"
          onPress={() => (window.location.href = '/dashboard/create/generate')}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // No slides yet
  if (slides.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-300 mb-4">
          No slides created yet. Add your first slide to get started.
        </p>
        <Button
          color="primary"
          startContent={<Icon icon="material-symbols:add" />}
          onPress={addSlide}
        >
          Add First Slide
        </Button>
      </div>
    );
  }

  // Helper function to determine which indicator should be active
  const getActiveIndicatorIndex = () => {
    if (!activeId || !over) return -1;

    const activeIndex = slides.findIndex(slide => slide.id === Number(activeId));
    const overIndex = slides.findIndex(slide => slide.id === Number(over.id));

    if (activeIndex < overIndex) {
      return overIndex; // Show indicator below the over item
    } else {
      return overIndex; // Show indicator above the over item
    }
  };

  return (
    <div className="outline-section relative">
      <DndContext
        collisionDetection={closestCenter}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        <div className="space-y-1 relative">
          <SortableContext
            items={slides.map(slide => slide.id)}
            strategy={verticalListSortingStrategy}
          >
            {slides.map((slide, index) => (
              <React.Fragment key={slide.id}>
                {index === 0 && <AddCardButton index={0} onClick={() => addSlideAt(0)} />}
                <SortableSlideCard
                  recentlyDroppedId={recentlyDroppedId}
                  slide={slide}
                  onContentChange={updateSlide}
                  onDelete={deleteSlide}
                />
                <AddCardButton index={index + 1} onClick={() => addSlideAt(index + 1)} />
                {activeId !== null && index === activeIndicatorIndex && (
                  <DropIndicator isActive={true} />
                )}
              </React.Fragment>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}

// Customize Section Component
function CustomizeSection() {
  const { selectedTheme, openThemeModal } = useThemeContext();
  const [textDensity, setTextDensity] = useState('Medium');
  const [imageSource, setImageSource] = useState('ai');
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const [aiModel, setAiModel] = useState('Flux Fast 1.1');
  const [showAiModelModal, setShowAiModelModal] = useState(false);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-white">Customize your presentation</h2>
      <div className="main-panel px-4 py-4 rounded-xl mb-6 bg-[#1C1C1E] border border-[#38383A]">
        {/* Themes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-white">Themes</h3>
            <Button
              className="text-gray-300"
              size="sm"
              startContent={<Icon className="text-gray-300" icon="material-symbols:visibility" />}
              variant="light"
              onPress={openThemeModal}
            >
              View more
            </Button>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Use one of our popular themes below or view more
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Theme previews would go here */}
            <div className="bg-[#232324] rounded-lg h-24 flex items-center justify-center">
              <p className="text-gray-400">Theme preview (current: {selectedTheme.name})</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="font-medium mb-2 text-white">Content</h3>
          <p className="text-gray-400 text-sm mb-4">
            Adjust text and image styles for your presentation
          </p>

          {/* Text Density */}
          <div className="mb-6">
            <p className="text-sm mb-2 text-gray-300">Amount of text per card</p>
            <div className="flex gap-2">
              <Button
                className={
                  textDensity === 'Brief' ? 'bg-primary text-white' : 'bg-[#232324] text-gray-300'
                }
                onPress={() => setTextDensity('Brief')}
              >
                Brief
              </Button>
              <Button
                className={
                  textDensity === 'Medium' ? 'bg-primary text-white' : 'bg-[#232324] text-gray-300'
                }
                onPress={() => setTextDensity('Medium')}
              >
                Medium
              </Button>
              <Button
                className={
                  textDensity === 'Detailed'
                    ? 'bg-primary text-white'
                    : 'bg-[#232324] text-gray-300'
                }
                onPress={() => setTextDensity('Detailed')}
              >
                Detailed
              </Button>
            </div>
          </div>

          {/* Image Source */}
          <div className="mb-4">
            <p className="text-sm mb-2 text-gray-300">Image source</p>
            <Button
              fullWidth
              className="justify-between bg-[#232324] text-gray-300 border-[#38383A]"
              onPress={() => setShowImageSourceModal(true)}
            >
              {imageSource}
              <Icon className="text-gray-400" icon="material-symbols:keyboard-arrow-down" />
            </Button>
          </div>

          {/* AI Image Model */}
          {(imageSource === 'ai' || imageSource === 'automatic') && (
            <div className="mb-4">
              <p className="text-sm mb-2 text-gray-300">AI image model</p>
              <Button
                fullWidth
                className="justify-between bg-[#232324] text-gray-300 border-[#38383A]"
                onPress={() => setShowAiModelModal(true)}
              >
                {aiModel}
                <Icon className="text-gray-400" icon="material-symbols:keyboard-arrow-down" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ImageSourceModal
        imageModelId={imageSource === 'ai' ? 'dall-e-3' : ''}
        imageSource={imageSource}
        isOpen={showImageSourceModal}
        setImageModelId={() => {}}
        setImageSource={setImageSource}
        onApply={() => {
          localStorage.setItem('imageSource', imageSource);
        }}
        onClose={() => setShowImageSourceModal(false)}
      />

      <AIModelModal
        isOpen={showAiModelModal}
        selectedModel={aiModel}
        onClose={() => setShowAiModelModal(false)}
        onModelSelect={model => setAiModel(model)}
      />
    </>
  );
}

// Header Component
function OutlineHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get('prompt') || '');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [tempPrompt, setTempPrompt] = useState('');

  const handlePromptFocus = () => {
    setTempPrompt(prompt);
    setIsEditingPrompt(true);
  };

  const handleCancelPromptEdit = () => {
    setPrompt(tempPrompt);
    setIsEditingPrompt(false);
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handlePromptSave = () => {
    // Save prompt to localStorage
    localStorage.setItem('lastPrompt', prompt);
    setIsEditingPrompt(false);
  };

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button
            isIconOnly
            aria-label="Back to dashboard"
            className="text-gray-300 hover:text-white"
            variant="light"
          >
            <Icon icon="material-symbols:arrow-back" width={24} />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">Create Presentation Outline</h1>

          {isEditingPrompt ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                className="bg-[#232324] text-white px-2 py-1 rounded border border-[#38383A] text-sm w-full"
                type="text"
                value={prompt}
                onChange={e => handlePromptChange(e.target.value)}
              />
              <Button className="text-primary" size="sm" variant="light" onPress={handlePromptSave}>
                Save
              </Button>
              <Button
                className="text-gray-300"
                size="sm"
                variant="light"
                onPress={handleCancelPromptEdit}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div
              className="text-gray-400 text-sm flex items-center gap-1 cursor-pointer hover:text-gray-300"
              onClick={handlePromptFocus}
            >
              <span>{prompt || 'No prompt specified'}</span>
              <Icon icon="material-symbols:edit" width={16} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="text-gray-300"
          startContent={<Icon icon="material-symbols:refresh" width={20} />}
          variant="light"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}

// Footer with Generate Button
function GenerateButton() {
  const { generatePresentation } = useOutline();
  const { slides, isLoading } = useOutline();
  const [credits, setCredits] = useState(100);

  return (
    <div className="max-w-5xl mx-auto flex justify-between items-center">
      <div className="flex items-center text-default-500">
        <Icon className="mr-2" icon="material-symbols:toll" />
        <span>{credits} credits</span>
        <Tooltip content="Information about credits">
          <Button isIconOnly size="sm" variant="light">
            <Icon icon="material-symbols:info" />
          </Button>
        </Tooltip>
      </div>
      <div className="text-default-500">{slides.length} cards total</div>
      <Button
        color="primary"
        isDisabled={isLoading || slides.length === 0}
        size="lg"
        startContent={<Icon icon="material-symbols:magic-button" />}
        onPress={generatePresentation}
      >
        Generate
      </Button>
    </div>
  );
}

// Main OutlinePage Component
export default function OutlinePage({}: OutlinePageProps) {
  return (
    <ThemeProvider>
      <OutlineProvider>
        <OutlinePageContent />
      </OutlineProvider>
    </ThemeProvider>
  );
}

// Content Component that uses context hooks
function OutlinePageContent() {
  const { showThemeModal, closeThemeModal, themes, selectedTheme, selectTheme } = useThemeContext();

  return (
    <div className="bg-[#121212] min-h-screen">
      {/* Header/Navigation Bar */}
      <div className="bg-[#1C1C1E] border-b border-[#38383A] py-3 px-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto">
          <OutlineHeader />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Outline Section */}
        <h2 className="text-xl font-semibold mb-4 text-white">Outline</h2>
        <div className="main-panel px-4 py-4 rounded-xl mb-6 bg-[#1C1C1E] border border-[#38383A]">
          <OutlineContent />
        </div>

        {/* Customization Section */}
        <CustomizeSection />

        {/* Theme Selection Modal */}
        <ThemeSelectionModal
          isOpen={showThemeModal}
          selectedTheme={selectedTheme}
          themes={themes}
          onClose={closeThemeModal}
          onThemeSelect={selectTheme}
        />
      </div>

      {/* Footer with Generate Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background z-10 border-t border-content2">
        <GenerateButton />
      </div>

      {/* Help Button */}
      <Button
        isIconOnly
        aria-label="Help"
        className="fixed bottom-20 right-6 z-10 bg-primary text-white"
        radius="full"
      >
        <Icon className="text-xl" icon="material-symbols:help" />
      </Button>

      {/* Extra space for scrolling */}
      <div className="h-32 mb-20" />
    </div>
  );
}

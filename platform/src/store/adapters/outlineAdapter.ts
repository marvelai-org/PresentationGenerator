import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePersistedStore } from '../index';
import { shallow } from 'zustand/shallow';

// Import the types from the existing context
import type { SlideContent } from '@/components/features/outline/types/slide';

/**
 * An adapter hook that mimics the existing OutlineContext API
 * This allows for a gradual migration of components to the new store
 */
export function useOutlineAdapter() {
  // Get the current state from the store
  // We'll map this to match the OutlineContext interface
  const {
    presentations,
    currentPresentationId,
    isLoading,
    error,
    createPresentation,
    updatePresentation,
    deletePresentation,
    setLoading,
    setError,
  } = usePersistedStore(
    (state) => ({
      presentations: state.presentations,
      currentPresentationId: state.currentPresentationId,
      isLoading: state.isLoading,
      error: state.error,
      createPresentation: state.createPresentation,
      updatePresentation: state.updatePresentation,
      deletePresentation: state.deletePresentation,
      setLoading: state.setLoading,
      setError: state.setError,
    }),
    shallow
  );

  // Local state for drag-and-drop operations
  const [activeId, setActiveId] = useState<number | null>(null);
  const [recentlyDroppedId, setRecentlyDroppedId] = useState<number | null>(null);

  // Extract the current presentation or use empty slides array
  const currentPresentation = useMemo(
    () => (currentPresentationId ? presentations[currentPresentationId] : null),
    [presentations, currentPresentationId]
  );

  // Convert the current presentation's data to the expected format
  // In the old context, this was an array of SlideContent
  const slides = useMemo<SlideContent[]>(() => {
    if (!currentPresentation) return [];

    // Extract slides from presentation metadata or storage
    // This would need to be adjusted based on how you store slide data
    // For now, we'll return an empty array or mock data
    return [
      {
        id: 1,
        title: currentPresentation.title,
        bullets: ['Sample bullet point'],
      },
    ];
  }, [currentPresentation]);

  // Implement the methods expected by components using OutlineContext
  const setSlides = useCallback(
    (newSlides: SlideContent[]) => {
      if (!currentPresentationId) {
        // Create a new presentation if none exists
        const id = createPresentation('New Presentation');
        
        // Here we would update the slides for this presentation
        // This would be implemented in a future SlideSlice
      } else {
        // Update slides for the current presentation
        // This would be implemented in a future SlideSlice
      }
    },
    [currentPresentationId, createPresentation]
  );

  const addSlide = useCallback(() => {
    // Add a slide to the current presentation
    // This would be implemented in a future SlideSlice
    
    // For now, we'll just make a placeholder implementation
    const newSlides = [...slides, {
      id: slides.length + 1,
      title: 'New Slide',
      bullets: ['Add your content here'],
    }];
    
    setSlides(newSlides);
  }, [slides, setSlides]);

  const addSlideAt = useCallback((index: number) => {
    // Add a slide at a specific index
    // This would be implemented in a future SlideSlice
    
    // Placeholder implementation
    const newSlides = [...slides];
    newSlides.splice(index, 0, {
      id: slides.length + 1,
      title: 'New Slide',
      bullets: ['Add your content here'],
    });
    
    setSlides(newSlides);
  }, [slides, setSlides]);

  const deleteSlide = useCallback((id: number) => {
    // Delete a slide with the given id
    // This would be implemented in a future SlideSlice
    
    // Placeholder implementation
    const newSlides = slides.filter(slide => slide.id !== id);
    setSlides(newSlides);
  }, [slides, setSlides]);

  const updateSlide = useCallback((id: number, title: string, bullets: string[]) => {
    // Update a slide with the given id
    // This would be implemented in a future SlideSlice
    
    // Placeholder implementation
    const newSlides = slides.map(slide =>
      slide.id === id ? { ...slide, title, bullets } : slide
    );
    
    setSlides(newSlides);
  }, [slides, setSlides]);

  const reorderSlides = useCallback((activeId: number, overId: number) => {
    // Reorder slides by moving activeId over overId
    // This would be implemented in a future SlideSlice
    
    // Placeholder implementation
    const oldIndex = slides.findIndex(slide => slide.id === activeId);
    const newIndex = slides.findIndex(slide => slide.id === overId);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    const newSlides = [...slides];
    const [removed] = newSlides.splice(oldIndex, 1);
    newSlides.splice(newIndex, 0, removed);
    
    setSlides(newSlides);
    setRecentlyDroppedId(activeId);
  }, [slides, setSlides]);

  // Save to localStorage like the original context
  const saveToLocalStorage = useCallback(() => {
    try {
      // Save the outline for backward compatibility
      localStorage.setItem('presentationOutline', JSON.stringify(slides));
      
      // Save complete settings object like the original context
      const settings = {
        outline: slides,
        theme: currentPresentation?.theme || {},
        textDensity: currentPresentation?.settings?.textDensity || 'Medium',
        imageSource: currentPresentation?.settings?.imageSource || 'AI images',
        aiModel: currentPresentation?.settings?.aiModel || 'Flux Fast',
      };
      
      localStorage.setItem('presentationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving presentation data to localStorage:', error);
    }
  }, [slides, currentPresentation]);

  // Generate presentation method (navigate to editor)
  const generatePresentation = useCallback(() => {
    // Save data to localStorage first
    saveToLocalStorage();
    
    // Navigate to editor page (same as original implementation)
    window.location.href = '/dashboard/create/editor';
  }, [saveToLocalStorage]);

  // Provide the same interface as the original OutlineContext
  return {
    slides,
    activeId,
    recentlyDroppedId,
    isLoading,
    error,
    setSlides,
    addSlide,
    addSlideAt,
    deleteSlide,
    updateSlide,
    reorderSlides,
    setActiveId,
    setRecentlyDroppedId,
    setLoading,
    setError,
    saveToLocalStorage,
    generatePresentation,
  };
} 
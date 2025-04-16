'use client';

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Slide, SlideContentItem } from '../types';
import { createEmptySlide, addElement, removeElement, updateElement } from '../utils/editorUtils';

interface UseSlideManagementProps {
  initialSlides?: Slide[];
  onChange?: (slides: Slide[]) => void;
  onSave?: (slides: Slide[]) => void;
}

interface UseSlideManagementReturn {
  slides: Slide[];
  currentSlideIndex: number;
  currentSlide: Slide | null;

  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;

  addSlide: () => void;
  duplicateSlide: (slideId: number) => void;
  removeSlide: (slideId: number) => void;
  updateSlide: (slideId: number, updates: Partial<Slide>) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;

  // Element management
  addElementToSlide: (slideId: number, element: SlideContentItem) => void;
  removeElementFromSlide: (slideId: number, elementId: string) => void;
  updateElementInSlide: (
    slideId: number,
    elementId: string,
    updates: Partial<SlideContentItem>
  ) => void;

  // Utility functions
  saveSlides: () => void;
}

const useSlideManagement = ({
  initialSlides = [],
  onChange,
  onSave,
}: UseSlideManagementProps = {}): UseSlideManagementReturn => {
  const [slides, setSlides] = useState<Slide[]>(() => {
    if (initialSlides.length > 0) return initialSlides;

    // Create a default slide if no slides are provided
    return [
      {
        id: 1,
        title: 'Title Slide',
        subtitle: 'Subtitle',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        content: [
          {
            id: uuidv4(),
            type: 'text',
            value: 'Click to edit title',
            x: 100,
            y: 150,
            width: 600,
            height: 80,
            style: {
              color: '#000000',
              backgroundColor: 'transparent',
              zIndex: 10,
            },
          },
          {
            id: uuidv4(),
            type: 'text',
            value: 'Click to edit subtitle',
            x: 100,
            y: 250,
            width: 600,
            height: 50,
            style: {
              color: '#666666',
              backgroundColor: 'transparent',
              zIndex: 10,
            },
          },
        ],
      },
    ];
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Get the current slide based on index
  const currentSlide = slides[currentSlideIndex] || null;

  // Call onChange whenever slides change
  useEffect(() => {
    if (onChange) {
      onChange(slides);
    }
  }, [slides, onChange]);

  // Add a new slide
  const addSlide = useCallback(() => {
    setSlides(prev => {
      const newSlide = createEmptySlide(prev);

      return [...prev, newSlide];
    });

    // Move to the new slide
    setCurrentSlideIndex(slides.length);
  }, [slides.length]);

  // Duplicate a slide
  const duplicateSlide = useCallback((slideId: number) => {
    setSlides(prev => {
      const slideIndex = prev.findIndex(slide => slide.id === slideId);

      if (slideIndex === -1) return prev;

      const slideToDuplicate = prev[slideIndex];
      const newSlideId = Math.max(0, ...prev.map(s => s.id)) + 1;

      // Create deep copy of the slide
      const newSlide: Slide = {
        ...JSON.parse(JSON.stringify(slideToDuplicate)),
        id: newSlideId,
        title: `${slideToDuplicate.title} (Copy)`,
      };

      // Insert the new slide after the original
      const newSlides = [...prev];

      newSlides.splice(slideIndex + 1, 0, newSlide);

      // Set current slide to the new duplicate
      setTimeout(() => {
        setCurrentSlideIndex(slideIndex + 1);
      }, 0);

      return newSlides;
    });
  }, []);

  // Remove a slide
  const removeSlide = useCallback(
    (slideId: number) => {
      setSlides(prev => {
        if (prev.length <= 1) {
          // Don't remove the last slide
          return prev;
        }

        const slideIndex = prev.findIndex(slide => slide.id === slideId);

        if (slideIndex === -1) return prev;

        const newSlides = prev.filter(slide => slide.id !== slideId);

        // Adjust current slide index if needed
        if (currentSlideIndex >= slideIndex && currentSlideIndex > 0) {
          setTimeout(() => {
            setCurrentSlideIndex(prevIndex => Math.max(0, prevIndex - 1));
          }, 0);
        }

        return newSlides;
      });
    },
    [currentSlideIndex]
  );

  // Update a slide
  const updateSlide = useCallback((slideId: number, updates: Partial<Slide>) => {
    setSlides(prev => prev.map(slide => (slide.id === slideId ? { ...slide, ...updates } : slide)));
  }, []);

  // Reorder slides
  const reorderSlides = useCallback(
    (fromIndex: number, toIndex: number) => {
      setSlides(prev => {
        const newSlides = [...prev];
        const [movedSlide] = newSlides.splice(fromIndex, 1);

        newSlides.splice(toIndex, 0, movedSlide);

        // Adjust current slide index to follow the moved slide
        if (fromIndex === currentSlideIndex) {
          setTimeout(() => {
            setCurrentSlideIndex(toIndex);
          }, 0);
        }

        return newSlides;
      });
    },
    [currentSlideIndex]
  );

  // Add an element to a slide
  const addElementToSlide = useCallback((slideId: number, element: SlideContentItem) => {
    setSlides(prev =>
      prev.map(slide => (slide.id === slideId ? addElement(slide, element) : slide))
    );
  }, []);

  // Remove an element from a slide
  const removeElementFromSlide = useCallback((slideId: number, elementId: string) => {
    setSlides(prev =>
      prev.map(slide => (slide.id === slideId ? removeElement(slide, elementId) : slide))
    );
  }, []);

  // Update an element in a slide
  const updateElementInSlide = useCallback(
    (slideId: number, elementId: string, updates: Partial<SlideContentItem>) => {
      setSlides(prev =>
        prev.map(slide => (slide.id === slideId ? updateElement(slide, elementId, updates) : slide))
      );
    },
    []
  );

  // Save slides
  const saveSlides = useCallback(() => {
    if (onSave) {
      onSave(slides);
    }
  }, [slides, onSave]);

  return {
    slides,
    currentSlideIndex,
    currentSlide,
    setSlides,
    setCurrentSlideIndex,
    addSlide,
    duplicateSlide,
    removeSlide,
    updateSlide,
    reorderSlides,
    addElementToSlide,
    removeElementFromSlide,
    updateElementInSlide,
    saveSlides,
  };
};

export default useSlideManagement;

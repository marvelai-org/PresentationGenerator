import { useState, useCallback } from 'react';

import { SlideContent } from '../types';
import { updateSlideNumbers } from '../utils/slideFormatter';

/**
 * Default content for a new slide
 */
const DEFAULT_NEW_SLIDE_CONTENT = '<h2>New slide</h2><ul><li>New bullet point</li></ul>';

/**
 * Hook for managing slides CRUD operations
 *
 * @param {SlideContent[]} initialSlides Optional initial slides
 * @returns Object with slides state and slide management functions
 */
export function useSlideManagement(initialSlides: SlideContent[] = []) {
  const [slides, setSlides] = useState<SlideContent[]>(initialSlides);

  /**
   * Add a new slide at the end of the slides array
   */
  const addNewSlide = useCallback(() => {
    setSlides(prevSlides => {
      const updatedSlides = [
        ...prevSlides,
        {
          id: prevSlides.length + 1,
          content: DEFAULT_NEW_SLIDE_CONTENT,
        },
      ];

      return updatedSlides;
    });
  }, []);

  /**
   * Add a new slide at a specific index position
   *
   * @param {number} index Index position to insert the new slide
   */
  const addNewSlideAt = useCallback((index: number) => {
    setSlides(prevSlides => {
      const newSlides = [...prevSlides];

      newSlides.splice(index, 0, {
        id: 0, // Temporary ID that will be updated
        content: DEFAULT_NEW_SLIDE_CONTENT,
      });

      return updateSlideNumbers(newSlides);
    });
  }, []);

  /**
   * Delete a slide by its ID
   *
   * @param {number} id ID of the slide to delete
   */
  const deleteSlide = useCallback((id: number) => {
    setSlides(prevSlides => {
      const updatedSlides = prevSlides.filter(slide => slide.id !== id);

      return updateSlideNumbers(updatedSlides);
    });
  }, []);

  /**
   * Update the content of a slide
   *
   * @param {number} id ID of the slide to update
   * @param {string} content New content for the slide
   */
  const handleContentChange = useCallback((id: number, content: string) => {
    setSlides(prevSlides =>
      prevSlides.map(slide => (slide.id === id ? { ...slide, content } : slide))
    );
  }, []);

  /**
   * Update the order of slides after a drag-and-drop operation
   *
   * @param {number} oldIndex Original index of the dragged slide
   * @param {number} newIndex New index where the slide was dropped
   * @returns {SlideContent[]} Updated and renumbered slides array
   */
  const reorderSlides = useCallback(
    (oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return slides;

      setSlides(prevSlides => {
        const newSlides = [...prevSlides];
        const [movedItem] = newSlides.splice(oldIndex, 1);

        newSlides.splice(newIndex, 0, movedItem);

        return updateSlideNumbers(newSlides);
      });
    },
    [slides]
  );

  /**
   * Set entirely new slides array (used when loading from API)
   *
   * @param {SlideContent[]} newSlides New slides array
   */
  const setNewSlides = useCallback((newSlides: SlideContent[]) => {
    setSlides(updateSlideNumbers(newSlides));
  }, []);

  /**
   * Find a slide by its ID
   *
   * @param {number} id ID of the slide to find
   * @returns {SlideContent | undefined} Found slide or undefined
   */
  const findSlideById = useCallback(
    (id: number) => {
      return slides.find(slide => slide.id === id);
    },
    [slides]
  );

  return {
    slides,
    addNewSlide,
    addNewSlideAt,
    deleteSlide,
    handleContentChange,
    reorderSlides,
    setSlides: setNewSlides,
    findSlideById,
  };
}

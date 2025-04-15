import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import { SlideContent } from '../types';

/**
 * Hook for managing drag and drop functionality for slides
 *
 * @param {Object} options - Configuration options
 * @param {function} options.reorderSlides - Function to update slide order
 * @returns {Object} Object containing drag and drop state and handlers
 */
export function useDragAndDrop({
  reorderSlides,
}: {
  reorderSlides: (oldIndex: number, newIndex: number) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  /**
   * Handle the start of a drag operation
   *
   * @param {DragStartEvent} event - Drag start event
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    // Set the active ID to the ID of the slide being dragged
    setActiveId(event.active.id as string);
  }, []);

  /**
   * Handle the end of a drag operation
   *
   * @param {DragEndEvent} event - Drag end event
   * @param {SlideContent[]} slides - Current slides array
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent, slides: SlideContent[]) => {
      const { active, over } = event;

      // Reset the active ID
      setActiveId(null);

      // If there's no over target or the active and over IDs are the same, do nothing
      if (!over || active.id === over.id) {
        return;
      }

      // Find the indices of the source and destination slides
      const oldIndex = slides.findIndex(slide => slide.id === active.id);
      const newIndex = slides.findIndex(slide => slide.id === over.id);

      // If either slide is not found, do nothing
      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      // Reorder the slides
      reorderSlides(oldIndex, newIndex);
    },
    [reorderSlides]
  );

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
  };
}

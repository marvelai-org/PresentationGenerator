/**
 * CSS style for the highlight animation
 * Creates a pulsing effect on cards that have been recently dropped
 */
export const highlightAnimationStyle = `
  @keyframes highlight-pulse {
    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); border-color: rgba(99, 102, 241, 0.7); }
    70% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); border-color: rgba(99, 102, 241, 0.3); }
    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); border-color: rgba(99, 102, 241, 0); }
  }
  
  .highlight-animation {
    animation: highlight-pulse 1.5s ease-out forwards;
    border: 2px solid rgba(99, 102, 241, 0.7);
  }
`;

/**
 * Get active indicator index for drag and drop operations
 *
 * @param activeId - ID of the active (dragged) element
 * @param over - Information about the element being hovered over
 * @param slides - Array of slides
 * @returns The index where the indicator should appear, or -1 if not applicable
 */
export const getActiveIndicatorIndex = (
  activeId: number | null,
  over: { id: any; data?: { current?: { sortable?: { index?: number } } } } | null,
  slides: any[]
): number => {
  if (!activeId || !over) return -1;

  // Extract the needed information
  const overIndex = over.data?.current?.sortable?.index;

  // Determine the correct indicator position
  if (!Number.isInteger(overIndex)) return -1;

  // Return the index where the indicator should appear
  return overIndex as number;
};

/**
 * Apply a fade effect to an element
 *
 * @param element - Element to apply the fade effect to
 * @param duration - Duration of the fade effect in milliseconds
 */
export const applyFadeEffect = (element: HTMLElement | null, duration: number = 300): void => {
  if (!element) return;

  element.classList.add('opacity-50', 'transition-opacity');
  setTimeout(() => {
    element.classList.remove('opacity-50', 'transition-opacity');
  }, duration);
};

/**
 * Default highlight duration in milliseconds
 */
export const DEFAULT_HIGHLIGHT_DURATION = 1500;

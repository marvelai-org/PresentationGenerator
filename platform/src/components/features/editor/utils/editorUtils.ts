import { v4 as uuidv4 } from 'uuid';

import { Slide, SlideContentItem } from '../types';

/**
 * Finds an element by ID in a slide
 */
export const findElementById = (slide: Slide, id: string): SlideContentItem | undefined => {
  return slide.content.find(item => item.id === id);
};

/**
 * Creates a new empty slide with unique ID
 */
export const createEmptySlide = (slides: Slide[]): Slide => {
  const newSlideId = Math.max(0, ...slides.map(slide => slide.id)) + 1;

  return {
    id: newSlideId,
    title: 'New Slide',
    backgroundColor: '#ffffff',
    content: [],
    textColor: '#000000',
  };
};

/**
 * Creates a new shape element
 */
export const createShape = (type: string, x: number, y: number): SlideContentItem => {
  return {
    id: uuidv4(),
    type: 'shape',
    value: type,
    x,
    y,
    width: 200,
    height: 200,
    style: {
      backgroundColor: '#3498db',
      borderColor: '#2980b9',
      borderWidth: 0,
      borderStyle: 'solid',
      rotation: 0,
      opacity: 1,
      zIndex: 10,
    },
  };
};

/**
 * Creates a new text element
 */
export const createTextElement = (x: number, y: number): SlideContentItem => {
  return {
    id: uuidv4(),
    type: 'text',
    value: 'Click to edit text',
    x,
    y,
    width: 300,
    height: 100,
    style: {
      color: '#000000',
      backgroundColor: 'transparent',
      zIndex: 10,
    },
  };
};

/**
 * Creates a new image element
 */
export const createImageElement = (url: string, x: number, y: number): SlideContentItem => {
  return {
    id: uuidv4(),
    type: 'image',
    value: '',
    imageUrl: url,
    x,
    y,
    width: 400,
    height: 300,
    style: {
      zIndex: 5,
      opacity: 1,
      rotation: 0,
    },
  };
};

/**
 * Duplicates a slide
 */
export const duplicateSlide = (slide: Slide): Slide => {
  return {
    ...JSON.parse(JSON.stringify(slide)),
    id: Date.now(), // Generate a new unique ID
    title: `${slide.title} (Copy)`,
  };
};

/**
 * Reorders slides after drag and drop
 */
export const reorderSlides = (slides: Slide[], startIndex: number, endIndex: number): Slide[] => {
  const result = Array.from(slides);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Updates an element within a slide
 */
export const updateElement = (
  slide: Slide,
  elementId: string,
  updates: Partial<SlideContentItem>
): Slide => {
  return {
    ...slide,
    content: slide.content.map(item => (item.id === elementId ? { ...item, ...updates } : item)),
  };
};

/**
 * Adjusts z-index to bring an element to front
 */
export const bringElementToFront = (slide: Slide, elementId: string): Slide => {
  // Find the highest z-index in the slide
  const highestZIndex = Math.max(...slide.content.map(item => item.style?.zIndex || 0));

  return updateElement(slide, elementId, {
    style: {
      ...slide.content.find(i => i.id === elementId)?.style,
      zIndex: highestZIndex + 1,
    },
  });
};

/**
 * Adjusts z-index to send an element to back
 */
export const sendElementToBack = (slide: Slide, elementId: string): Slide => {
  // Find the lowest z-index in the slide
  const lowestZIndex = Math.min(...slide.content.map(item => item.style?.zIndex || 0));

  return updateElement(slide, elementId, {
    style: {
      ...slide.content.find(i => i.id === elementId)?.style,
      zIndex: lowestZIndex - 1,
    },
  });
};

/**
 * Removes an element from a slide
 */
export const removeElement = (slide: Slide, elementId: string): Slide => {
  return {
    ...slide,
    content: slide.content.filter(item => item.id !== elementId),
  };
};

/**
 * Adds an element to a slide
 */
export const addElement = (slide: Slide, element: SlideContentItem): Slide => {
  return {
    ...slide,
    content: [...slide.content, element],
  };
};

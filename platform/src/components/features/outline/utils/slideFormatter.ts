import { SlideContent } from '../types';

/**
 * Updates slide numbers to be sequential after any change
 *
 * @param slides - Array of SlideContent objects
 * @returns Array of SlideContent objects with sequential IDs
 */
export const updateSlideNumbers = (slides: SlideContent[]): SlideContent[] => {
  return slides.map((slide, index) => ({
    ...slide,
    id: index + 1,
  }));
};

/**
 * Get slide count from slide count parameter string (e.g., "8 cards")
 *
 * @param slideCountParam - String representing slide count
 * @param defaultCount - Default count to use if parsing fails
 * @returns Number of slides
 */
export const getNumSlidesFromParam = (
  slideCountParam: string,
  defaultCount: number = 8
): number => {
  return parseInt(slideCountParam.split(' ')[0]) || defaultCount;
};

/**
 * Find a slide by ID in an array of slides
 *
 * @param slides - Array of SlideContent objects
 * @param id - ID of the slide to find
 * @returns The found slide or undefined if not found
 */
export const findSlideById = (slides: SlideContent[], id: number): SlideContent | undefined => {
  return slides.find(slide => slide.id === id);
};

/**
 * Extract the title from slide HTML content
 *
 * @param content - HTML slide content
 * @param defaultTitle - Default title to return if extraction fails
 * @returns Extracted title
 */
export const extractSlideTitle = (
  content: string,
  defaultTitle: string = 'Slide Title'
): string => {
  return content.match(/<h2>(.*?)<\/h2>/)?.[1] || defaultTitle;
};

/**
 * Extract bullet points from slide HTML content
 *
 * @param content - HTML slide content
 * @returns Array of bullet point text
 */
export const extractSlideBullets = (content: string): string[] => {
  const bulletMatches = content.match(/<li>(.*?)<\/li>/g) || [];

  return bulletMatches.map(item => item.replace(/<li>(.*?)<\/li>/, '$1'));
};

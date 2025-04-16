/**
 * Enhanced Fallback Mechanisms
 * Builds on the existing content adaptation utilities to provide
 * more sophisticated fallback strategies
 */

import { 
  ContentType, 
  getRandomPlaceholder, 
  getContentByTags 
} from './defaultContentLibrary';

import { createFallbackContent } from './contentAdaptation';

export interface FallbackOptions {
  strategy: 'random' | 'similarTags' | 'contextual' | 'empty';
  tags?: string[];
  context?: string;
  defaultText?: string;
  fallbackImageUrl?: string;
  addPlaceholderMessage?: boolean;
}

/**
 * Generates a more sophisticated fallback content based on specified strategy
 * @param expectedType The content type that is expected
 * @param actualContent The actual content that needs fallback handling
 * @param options Configuration options for fallback generation
 */
export function generateFallbackContent(
  expectedType: ContentType,
  actualContent: any,
  options: FallbackOptions
): any {
  // If content is already of correct type, return it untouched
  if (isContentTypeMatch(actualContent, expectedType)) {
    return actualContent;
  }
  
  // If content is null or undefined, handle based on strategy
  if (actualContent === null || actualContent === undefined) {
    return generateEmptyContentFallback(expectedType, options);
  }
  
  // For mismatched types, use appropriate conversion strategy
  switch (options.strategy) {
    case 'random':
      return getRandomPlaceholder(expectedType);
      
    case 'similarTags':
      return generateTagBasedFallback(expectedType, options.tags || []);
      
    case 'contextual':
      return generateContextualFallback(expectedType, actualContent, options.context || '');
      
    case 'empty':
    default:
      return generateEmptyContentFallback(expectedType, options);
  }
}

/**
 * Checks if content matches the expected type
 */
function isContentTypeMatch(content: any, expectedType: ContentType): boolean {
  switch (expectedType) {
    case 'text':
      return typeof content === 'string';
      
    case 'list':
      return Array.isArray(content);
      
    case 'image':
      return typeof content === 'string' && isImageUrl(content);
      
    case 'chart':
      return typeof content === 'object' && 
             content !== null && 
             'type' in content && 
             'data' in content;
      
    case 'video':
      return typeof content === 'string' && isVideoUrl(content);
      
    case 'shape':
      return typeof content === 'string' && 
             ['rectangle', 'circle', 'rounded'].includes(content);
             
    default:
      return false;
  }
}

/**
 * Checks if a string is an image URL or data URL
 */
function isImageUrl(str: string): boolean {
  return (
    /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(str) ||
    /^(https?:\/\/.*\.(jpeg|jpg|gif|png|svg|webp))/i.test(str) ||
    /^data:image\/(jpeg|jpg|gif|png|svg\+xml|webp);base64,/.test(str)
  );
}

/**
 * Checks if a string is a video URL
 */
function isVideoUrl(str: string): boolean {
  return (
    /\.(mp4|webm|ogg|mov)$/i.test(str) ||
    /^(https?:\/\/.*\.(mp4|webm|ogg|mov))/i.test(str) ||
    /^(https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com))/i.test(str) ||
    /^(https?:\/\/.*\/embed\/)/i.test(str)
  );
}

/**
 * Generates fallback based on tags
 */
function generateTagBasedFallback(
  type: ContentType, 
  tags: string[]
): any {
  if (tags.length === 0) {
    return getRandomPlaceholder(type);
  }
  
  const matches = getContentByTags(tags, type);
  
  if (matches.length > 0) {
    // Get a random match from the tag-filtered content
    const randomIndex = Math.floor(Math.random() * matches.length);
    return matches[randomIndex].content;
  }
  
  // Fallback to random if no tag matches
  return getRandomPlaceholder(type);
}

/**
 * Generates contextual fallback by analyzing the original content
 */
function generateContextualFallback(
  expectedType: ContentType,
  actualContent: any,
  context: string
): any {
  // Extract potential tags from content or context
  const extractedTags: string[] = [];
  
  // From string content
  if (typeof actualContent === 'string') {
    // Extract keywords from content
    const keywords = extractKeywords(actualContent);
    extractedTags.push(...keywords);
  }
  
  // From array content (like lists)
  if (Array.isArray(actualContent)) {
    // Get keywords from each list item
    actualContent.forEach(item => {
      if (typeof item === 'string') {
        const keywords = extractKeywords(item);
        extractedTags.push(...keywords);
      }
    });
  }
  
  // From context string if provided
  if (context) {
    const contextKeywords = extractKeywords(context);
    extractedTags.push(...contextKeywords);
  }
  
  // Use the extracted tags to find relevant content
  if (extractedTags.length > 0) {
    return generateTagBasedFallback(expectedType, extractedTags);
  }
  
  // If no meaningful tags extracted, fall back to random
  return getRandomPlaceholder(expectedType);
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  // Remove punctuation and convert to lowercase
  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words
  const words = cleaned.split(/\s+/).filter(word => word.length > 3);
  
  // Remove common words
  const commonWords = [
    'this', 'that', 'these', 'those', 'with', 'from', 'your', 'have', 'what', 'when', 'where', 'will',
    'about', 'which', 'their', 'there', 'would', 'could', 'should', 'been', 'other'
  ];
  
  return words
    .filter(word => !commonWords.includes(word))
    .slice(0, 5); // Only use top 5 keywords
}

/**
 * Generates empty content fallback with optional placeholder message
 */
function generateEmptyContentFallback(
  type: ContentType,
  options: FallbackOptions
): any {
  if (!options.addPlaceholderMessage) {
    // Simple empty fallback based on type
    switch (type) {
      case 'text':
        return options.defaultText || '';
      case 'list':
        return [];
      case 'image':
        return options.fallbackImageUrl || '';
      case 'chart':
        return { type: 'bar', data: { labels: [], datasets: [] } };
      case 'video':
        return '';
      case 'shape':
        return 'rectangle';
    }
  }
  
  // Generate fallbacks with placeholder indicators
  switch (type) {
    case 'text':
      return options.defaultText || 'Placeholder text';
      
    case 'list':
      return ['Placeholder item 1', 'Placeholder item 2', 'Placeholder item 3'];
      
    case 'image':
      // Base64 encoded SVG placeholder
      return options.fallbackImageUrl || 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==';
      
    case 'chart':
      return {
        type: 'bar',
        data: {
          labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
          datasets: [{
            label: 'Placeholder Data',
            data: [12, 19, 8, 15],
            backgroundColor: '#cccccc'
          }]
        }
      };
      
    case 'video':
      return '';
      
    case 'shape':
      return 'rectangle';
      
    default:
      return null;
  }
}

/**
 * Fallback that tries various strategies in sequence until one is successful
 */
export function cascadingFallback(
  expectedType: ContentType,
  actualContent: any,
  context?: string,
  tags?: string[]
): any {
  // First check if content is already valid for the type
  if (isContentTypeMatch(actualContent, expectedType)) {
    return actualContent;
  }
  
  // Try context-based fallback first if context is available
  if (context) {
    const contextualFallback = generateFallbackContent(expectedType, actualContent, {
      strategy: 'contextual',
      context,
      addPlaceholderMessage: false
    });
    
    if (isContentTypeMatch(contextualFallback, expectedType)) {
      return contextualFallback;
    }
  }
  
  // Try tag-based fallback if tags are available
  if (tags && tags.length > 0) {
    const tagBasedFallback = generateFallbackContent(expectedType, actualContent, {
      strategy: 'similarTags',
      tags,
      addPlaceholderMessage: false
    });
    
    if (isContentTypeMatch(tagBasedFallback, expectedType)) {
      return tagBasedFallback;
    }
  }
  
  // Fall back to random content from the library
  const randomFallback = generateFallbackContent(expectedType, actualContent, {
    strategy: 'random',
    addPlaceholderMessage: false
  });
  
  if (isContentTypeMatch(randomFallback, expectedType)) {
    return randomFallback;
  }
  
  // If all else fails, use the base fallback mechanism
  const baseFallback = createFallbackContent(actualContent, { type: expectedType, position: { x: 0, y: 0, width: 0, height: 0 } });
  
  return baseFallback;
}

export default {
  generateFallbackContent,
  cascadingFallback,
  isContentTypeMatch
}; 
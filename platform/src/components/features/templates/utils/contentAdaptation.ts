/**
 * Utilities for adapting content between different formats and types
 * Enables smart conversion of content to fit different slot types
 */

type ContentType = 'text' | 'image' | 'chart' | 'video' | 'shape' | 'list';

/**
 * Adapts content to the specified slot type, performing conversions as needed
 */
export const adaptContentToSlot = (content: any, targetType: ContentType): any => {
  // Handle null or undefined content
  if (content === null || content === undefined) {
    return getDefaultContentForType(targetType);
  }

  // Text content adaptation
  if (typeof content === 'string') {
    switch (targetType) {
      case 'text':
        return content;
      case 'list':
        // Convert text to list items
        return content
          .split(/\r?\n/)
          .filter(line => line.trim())
          .map(line => line.trim().replace(/^[-*•]\s*/, ''));
      case 'image':
        // Check if string is image URL
        return isImageUrl(content) ? content : null;
      default:
        return content;
    }
  }
  
  // Array content adaptation
  if (Array.isArray(content)) {
    switch (targetType) {
      case 'list':
        return content;
      case 'text':
        return content.join('\n');
      default:
        return content;
    }
  }
  
  // Object content adaptation
  if (typeof content === 'object') {
    // Handle chart data, complex objects, etc.
    return content;
  }
  
  return content;
};

/**
 * Checks if a string is likely an image URL
 */
const isImageUrl = (str: string): boolean => {
  // Basic check for image file extensions or protocols
  return (
    /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(str) ||
    /^(https?:\/\/.*\.(jpeg|jpg|gif|png|svg|webp))/i.test(str) ||
    /^data:image\/(jpeg|jpg|gif|png|svg\+xml|webp);base64,/.test(str)
  );
};

/**
 * Provides default content for a given content type
 */
export const getDefaultContentForType = (type: ContentType): any => {
  switch (type) {
    case 'text':
      return '';
    case 'list':
      return ['Item 1', 'Item 2', 'Item 3'];
    case 'image':
      return ''; // Empty string for image placeholder
    case 'chart':
      return { type: 'bar', data: [] };
    case 'video':
      return '';
    case 'shape':
      return 'rectangle';
    default:
      return '';
  }
};

/**
 * Estimates the dimensions needed for the given content
 */
export const estimateContentDimensions = (
  content: any, 
  type: ContentType,
  style: Partial<CSSStyleDeclaration> = {}
): { width: number; height: number } => {
  // Default dimensions
  const defaultDimensions = { width: 200, height: 100 };
  
  switch (type) {
    case 'text':
      // Estimate based on text length and font size
      const text = typeof content === 'string' ? content : String(content);
      const fontSize = parseInt(style.fontSize as string || '16', 10);
      const charsPerLine = Math.floor(defaultDimensions.width / (fontSize * 0.6));
      const lines = Math.ceil(text.length / charsPerLine);
      return {
        width: defaultDimensions.width,
        height: Math.max(defaultDimensions.height, lines * fontSize * 1.5)
      };
      
    case 'list':
      // Estimate based on number of items
      const items = Array.isArray(content) ? content : [content];
      const itemHeight = parseInt(style.fontSize as string || '16', 10) * 1.5;
      return {
        width: defaultDimensions.width,
        height: items.length * itemHeight + 20 // Add padding
      };
      
    case 'image':
      // Default image dimensions
      return { width: 300, height: 200 };
      
    case 'chart':
      // Charts need more space
      return { width: 400, height: 300 };
      
    case 'video':
      // Videos are typically in 16:9 ratio
      return { width: 400, height: 225 };
      
    case 'shape':
      // Default shape dimensions
      return { width: 100, height: 100 };
      
    default:
      return defaultDimensions;
  }
};

/**
 * Determines if the content will likely overflow its container
 */
export const willContentOverflow = (
  content: any,
  type: ContentType,
  containerWidth: number,
  containerHeight: number,
  style: Partial<CSSStyleDeclaration> = {}
): boolean => {
  const dimensions = estimateContentDimensions(content, type, style);
  return dimensions.width > containerWidth || dimensions.height > containerHeight;
};

/**
 * Truncates content to fit in its container
 */
export const truncateContentToFit = (
  content: any,
  type: ContentType,
  maxLength: number
): any => {
  if (typeof content === 'string') {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  }
  
  if (Array.isArray(content)) {
    // Truncate array to a maximum number of items
    const maxItems = Math.floor(maxLength / 20); // Rough estimate
    return content.length > maxItems 
      ? [...content.slice(0, maxItems), '...'] 
      : content;
  }
  
  return content;
}; 
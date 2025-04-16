import { TemplateSlot } from '../components/features/templates/types/TemplateTypes';

/**
 * Estimates the dimensions of text content based on font properties and slot width
 */
export function estimateContentDimensions(
  content: string,
  fontFamily: string = 'Arial',
  fontSize: number = 16,
  lineHeight: number = 1.5,
  slotWidth: number = 400
): { width: number; height: number } {
  if (!content) {
    return { width: 0, height: 0 };
  }

  // Create a hidden div to measure text dimensions
  const measurer = document.createElement('div');
  measurer.style.position = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.height = 'auto';
  measurer.style.width = `${slotWidth}px`;
  measurer.style.fontFamily = fontFamily;
  measurer.style.fontSize = `${fontSize}px`;
  measurer.style.lineHeight = `${lineHeight}`;
  measurer.style.whiteSpace = 'pre-wrap';
  measurer.textContent = content;
  
  document.body.appendChild(measurer);
  
  // Get computed dimensions
  const height = measurer.offsetHeight;
  const width = Math.min(measurer.offsetWidth, slotWidth);
  
  // Clean up
  document.body.removeChild(measurer);
  
  return { width, height };
}

/**
 * Determines if content will overflow the available slot dimensions
 */
export function willContentOverflow(
  content: string | any[] | Record<string, any>,
  slot: TemplateSlot,
  extraPadding: number = 20
): boolean {
  if (!content) return false;
  
  let formattedContent = '';
  
  // Process different content types
  if (typeof content === 'string') {
    formattedContent = content;
  } else if (Array.isArray(content)) {
    formattedContent = content.join('\n• ');
    if (formattedContent) {
      formattedContent = '• ' + formattedContent;
    }
  } else if (typeof content === 'object') {
    formattedContent = JSON.stringify(content, null, 2);
  }
  
  // Get slot dimensions
  const slotWidth = slot.position.width;
  const slotHeight = slot.position.height;
  
  // Get font properties from slot
  const fontSize = slot.style?.fontSize || 16;
  const fontFamily = slot.style?.fontFamily || 'Arial';
  const lineHeight = slot.style?.lineHeight || 1.5;
  
  // Estimate content dimensions
  const { width, height } = estimateContentDimensions(
    formattedContent,
    fontFamily,
    fontSize,
    lineHeight,
    slotWidth - extraPadding
  );
  
  return height > (slotHeight - extraPadding);
}

/**
 * Adapts content to fit within slot dimensions by truncating if necessary
 */
export function adaptContentToFit(
  content: string | any[] | Record<string, any>,
  slot: TemplateSlot,
  options = { addEllipsis: true }
): string | any[] | Record<string, any> {
  if (!willContentOverflow(content, slot)) {
    return content;
  }
  
  if (typeof content === 'string') {
    // Handle string content by truncating
    const fontSize = slot.style?.fontSize || 16;
    const fontFamily = slot.style?.fontFamily || 'Arial';
    const lineHeight = slot.style?.lineHeight || 1.5;
    const slotWidth = slot.position.width;
    const slotHeight = slot.position.height;
    
    // Approximate characters per line
    const charWidth = fontSize * 0.6; // Rough estimate
    const charsPerLine = Math.floor((slotWidth - 40) / charWidth);
    
    // Approximate lines that fit
    const lineHeightPx = fontSize * lineHeight;
    const maxLines = Math.floor((slotHeight - 40) / lineHeightPx);
    
    // Estimate max characters
    const maxChars = charsPerLine * maxLines;
    
    // Truncate
    if (content.length > maxChars && options.addEllipsis) {
      return content.substring(0, maxChars - 3) + '...';
    }
    
    return content.substring(0, maxChars);
  }
  
  if (Array.isArray(content)) {
    // Handle array content by reducing items
    const fontSize = slot.style?.fontSize || 16;
    const lineHeight = slot.style?.lineHeight || 1.5;
    const slotHeight = slot.position.height;
    
    // Approximate lines that fit
    const lineHeightPx = fontSize * lineHeight;
    const maxLines = Math.floor((slotHeight - 40) / lineHeightPx);
    
    // Keep only the number of items that fit
    if (content.length > maxLines) {
      const truncated = content.slice(0, maxLines - 1);
      if (options.addEllipsis) {
        return [...truncated, '...'];
      }
      return truncated;
    }
  }
  
  return content;
}

/**
 * Converts content to a different format if appropriate
 * For example, turns text with bullet points into an array
 */
export function autoFormatContent(
  content: string | any[] | Record<string, any>,
  targetType: 'text' | 'list' | 'image'
): string | any[] | Record<string, any> {
  if (!content) return content;
  
  // Text to list conversion
  if (targetType === 'list' && typeof content === 'string') {
    // Check for bullet-like structure
    const bulletRegex = /^[-•*]\s+/gm;
    const numberRegex = /^\d+[.)]\s+/gm;
    
    if (bulletRegex.test(content) || numberRegex.test(content)) {
      // Split by newlines and remove bullet symbols
      const lines = content.split('\n')
        .map(line => line.replace(bulletRegex, '').replace(numberRegex, '').trim())
        .filter(line => line.length > 0);
      
      return lines;
    }
    
    // Check for lines with short phrases that could be list items
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length > 1 && lines.every(line => line.length < 100)) {
      return lines;
    }
  }
  
  // List to text conversion
  if (targetType === 'text' && Array.isArray(content)) {
    return '• ' + content.join('\n• ');
  }
  
  // Object to string
  if (targetType === 'text' && typeof content === 'object' && !Array.isArray(content)) {
    return JSON.stringify(content, null, 2);
  }
  
  return content;
}

/**
 * Creates a fallback when content doesn't match the expected type
 */
export function createFallbackContent(
  content: any,
  targetSlot: TemplateSlot
): any {
  if (!content) return null;
  
  const slotType = targetSlot.type;
  
  // Handle missing image
  if (slotType === 'image' && typeof content !== 'string') {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==';
  }
  
  // Handle non-text for text slot
  if (slotType === 'text' && typeof content !== 'string') {
    if (Array.isArray(content)) {
      return content.join('\n');
    } else if (typeof content === 'object') {
      return JSON.stringify(content, null, 2);
    } else {
      return String(content);
    }
  }
  
  // Handle non-array for list slot
  if (slotType === 'list' && !Array.isArray(content)) {
    if (typeof content === 'string') {
      // Try to convert string to list
      return autoFormatContent(content, 'list');
    } else {
      return ['No list items available'];
    }
  }
  
  return content;
}

/**
 * Adapt content to responsive rules based on screen size
 */
export function applyResponsiveAdaptation(
  content: any,
  slot: TemplateSlot,
  screenWidth: number,
  screenHeight: number
): any {
  if (!slot.adaptiveRules?.responsivePositions) {
    return content;
  }
  
  // Find appropriate responsive position
  const responsivePositions = slot.adaptiveRules.responsivePositions;
  let appliedPosition = null;
  
  for (const breakpoint of Object.keys(responsivePositions).sort((a, b) => Number(b) - Number(a))) {
    if (screenWidth <= Number(breakpoint)) {
      appliedPosition = responsivePositions[breakpoint];
    }
  }
  
  if (!appliedPosition) {
    return content;
  }
  
  // Adapt content based on new position dimensions
  if (typeof content === 'string' && content.length > 100) {
    const originalWidth = slot.position.width;
    const newWidth = appliedPosition.width;
    
    // If new width is significantly smaller, truncate long text
    if (newWidth < originalWidth * 0.7) {
      return adaptContentToFit(content, {
        ...slot,
        position: appliedPosition
      });
    }
  }
  
  // For lists, reduce items on smaller screens
  if (Array.isArray(content)) {
    const originalHeight = slot.position.height;
    const newHeight = appliedPosition.height;
    
    if (newHeight < originalHeight * 0.8 && content.length > 3) {
      return content.slice(0, Math.max(2, Math.floor(content.length * newHeight / originalHeight)));
    }
  }
  
  return content;
} 
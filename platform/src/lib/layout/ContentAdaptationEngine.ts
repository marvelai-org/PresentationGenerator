/**
 * ContentAdaptationEngine - Adapts content to available space and layout constraints
 * 
 * This engine works with the ConstraintLayoutEngine to dynamically adjust content
 * to fit available space while preserving the most important information.
 */

import { LayoutElement, ContentConstraint } from './ConstraintLayoutEngine';
import { Position } from '@/components/features/templates/utils/positioningUtils';
import { willContentOverflow, estimateContentDimensions, truncateContentToFit } from '@/components/features/templates/utils/contentAdaptation';

// Content priority levels for determining what to keep when space is limited
export enum ContentPriority {
  CRITICAL = 10,    // Must keep (e.g., headings, key points)
  HIGH = 8,         // Very important (e.g., key data, primary content)
  MEDIUM = 5,       // Important but can be shortened (e.g., descriptions)
  LOW = 3,          // Supporting content (e.g., examples, details)
  OPTIONAL = 1      // Can be removed entirely if needed (e.g., decorative elements)
}

// Strategies for dealing with overflow
export type OverflowStrategy = 
  | 'truncate'      // Cut off excess content with ellipsis
  | 'scale'         // Reduce font size to fit
  | 'reflow'        // Reflow content to use more space (e.g., wrap text)
  | 'reposition'    // Move elements to make room
  | 'resize'        // Change dimensions of element
  | 'simplify'      // Remove formatting, simplify content
  | 'redistribute'  // Move content to other slides
  | 'omit';         // Remove entirely

// Content element with metadata for adaptation
export interface AdaptableContent {
  id: string;
  type: 'text' | 'image' | 'list' | 'chart' | 'video' | 'table';
  content: any;
  priority: ContentPriority;
  allowedStrategies: OverflowStrategy[];
  minRequired?: number; // Minimum required elements (for lists) or characters (for text)
  isStructured?: boolean; // Whether content has internal structure to preserve
}

/**
 * Engine for adapting content to fit available space
 */
export class ContentAdaptationEngine {
  private elements: Map<string, AdaptableContent> = new Map();
  private positions: Map<string, Position> = new Map();
  private fontSizeByType: Map<string, {min: number, max: number}> = new Map();
  
  constructor() {
    // Set default font size ranges for different element types
    this.fontSizeByType.set('title', { min: 24, max: 42 });
    this.fontSizeByType.set('subtitle', { min: 18, max: 32 });
    this.fontSizeByType.set('heading', { min: 18, max: 32 });
    this.fontSizeByType.set('text', { min: 14, max: 24 });
    this.fontSizeByType.set('list', { min: 14, max: 24 });
  }
  
  /**
   * Adds content to be adapted
   */
  addContent(content: AdaptableContent, position: Position): this {
    this.elements.set(content.id, content);
    this.positions.set(content.id, position);
    return this;
  }
  
  /**
   * Adds multiple content elements at once
   */
  addContents(contents: AdaptableContent[], positions: Position[]): this {
    if (contents.length !== positions.length) {
      throw new Error('Contents and positions arrays must have the same length');
    }
    
    for (let i = 0; i < contents.length; i++) {
      this.addContent(contents[i], positions[i]);
    }
    
    return this;
  }
  
  /**
   * Sets custom font size range for an element type
   */
  setFontSizeRange(type: string, min: number, max: number): this {
    this.fontSizeByType.set(type, { min, max });
    return this;
  }
  
  /**
   * Performs content adaptation to fit all elements in their spaces
   * Returns a map of adapted content
   */
  adaptContent(): Map<string, any> {
    const result = new Map<string, any>();
    
    // First pass: Check which elements need adaptation
    const overflowElements: string[] = [];
    
    for (const [id, content] of this.elements.entries()) {
      const position = this.positions.get(id);
      
      if (!position) continue;
      
      // Check if content will overflow its space
      const willOverflow = this.checkContentOverflow(content, position);
      
      if (willOverflow) {
        overflowElements.push(id);
      } else {
        // No adaptation needed, use original content
        result.set(id, content.content);
      }
    }
    
    // Second pass: Adapt overflow elements in priority order
    // Sort by descending priority to handle high priority elements first
    const sortedOverflow = overflowElements
      .map(id => ({ id, priority: this.elements.get(id)!.priority }))
      .sort((a, b) => b.priority - a.priority)
      .map(item => item.id);
    
    for (const id of sortedOverflow) {
      const content = this.elements.get(id)!;
      const position = this.positions.get(id)!;
      
      // Apply best adaptation strategy
      const adaptedContent = this.applyBestStrategy(content, position);
      result.set(id, adaptedContent);
    }
    
    return result;
  }
  
  /**
   * Check if content will overflow its assigned space
   */
  private checkContentOverflow(content: AdaptableContent, position: Position): boolean {
    switch (content.type) {
      case 'text':
        return this.checkTextOverflow(content.content, position);
      case 'list':
        return this.checkListOverflow(content.content, position);
      case 'image':
        return this.checkImageOverflow(content.content, position);
      case 'table':
        return this.checkTableOverflow(content.content, position);
      default:
        // Default to using the general estimation method
        return willContentOverflow(
          content.content,
          content.type,
          position.width,
          position.height,
          {}
        );
    }
  }
  
  /**
   * Check if text content will overflow
   */
  private checkTextOverflow(text: string, position: Position): boolean {
    const fontSize = this.fontSizeByType.get('text')?.max || 24;
    const charsPerLine = Math.floor(position.width / (fontSize * 0.6));
    const lines = Math.ceil(text.length / charsPerLine);
    const textHeight = lines * fontSize * 1.2; // Line height factor of 1.2
    
    return textHeight > position.height;
  }
  
  /**
   * Check if a list will overflow
   */
  private checkListOverflow(list: string[], position: Position): boolean {
    const fontSize = this.fontSizeByType.get('list')?.max || 24;
    const itemHeight = fontSize * 1.5; // Include some spacing between items
    const totalHeight = list.length * itemHeight;
    
    return totalHeight > position.height;
  }
  
  /**
   * Check if an image will overflow
   */
  private checkImageOverflow(imageUrl: string, position: Position): boolean {
    // Since we can scale images, they overflow only if aspect ratio can't be maintained
    // For now, we'll assume images can always be made to fit
    return false;
  }
  
  /**
   * Check if a table will overflow
   */
  private checkTableOverflow(tableData: any, position: Position): boolean {
    // Estimate based on rows and columns
    if (tableData.rows && tableData.columns) {
      const rowHeight = 40; // Estimated height per row
      const totalHeight = (tableData.rows + 1) * rowHeight; // +1 for header
      
      return totalHeight > position.height;
    }
    
    return false;
  }
  
  /**
   * Apply the best adaptation strategy for the content
   */
  private applyBestStrategy(content: AdaptableContent, position: Position): any {
    // Filter to allowed strategies for this content
    const strategies = content.allowedStrategies;
    
    // Try strategies in order of preference
    for (const strategy of strategies) {
      const adaptedContent = this.applyStrategy(content, position, strategy);
      
      // Check if the adaptation worked
      if (adaptedContent && !this.checkContentOverflow(
        { ...content, content: adaptedContent },
        position
      )) {
        return adaptedContent;
      }
    }
    
    // If all strategies failed, apply most aggressive allowed strategy
    const lastResortStrategy = strategies[strategies.length - 1];
    return this.applyStrategy(content, position, lastResortStrategy);
  }
  
  /**
   * Apply a specific adaptation strategy
   */
  private applyStrategy(
    content: AdaptableContent,
    position: Position,
    strategy: OverflowStrategy
  ): any {
    switch (strategy) {
      case 'truncate':
        return this.truncateContent(content, position);
      
      case 'scale':
        return this.scaleContent(content, position);
      
      case 'reflow':
        return this.reflowContent(content, position);
      
      case 'simplify':
        return this.simplifyContent(content);
      
      case 'omit':
        return this.omitContent(content);
      
      // For strategies that require layout changes, return the original content
      // These will be handled at a higher level
      case 'reposition':
      case 'resize':
      case 'redistribute':
        return content.content;
      
      default:
        return content.content;
    }
  }
  
  /**
   * Truncates content to fit available space
   */
  private truncateContent(content: AdaptableContent, position: Position): any {
    switch (content.type) {
      case 'text':
        return this.truncateText(content.content, position, content.minRequired || 0);
      
      case 'list':
        return this.truncateList(content.content, position, content.minRequired || 0);
      
      default:
        return truncateContentToFit(content.content, content.type, 100);
    }
  }
  
  /**
   * Truncates text to fit available space
   */
  private truncateText(text: string, position: Position, minRequired: number): string {
    const fontSize = this.fontSizeByType.get('text')?.max || 24;
    const charsPerLine = Math.floor(position.width / (fontSize * 0.6));
    const maxLines = Math.floor(position.height / (fontSize * 1.2));
    const maxChars = charsPerLine * maxLines;
    
    // Ensure we keep at least the minimum required
    const keepChars = Math.max(minRequired, Math.min(text.length, maxChars - 3)); // -3 for ellipsis
    
    if (keepChars >= text.length) {
      return text;
    }
    
    // Try to truncate at a sentence or word boundary
    const truncated = text.substring(0, keepChars);
    
    // Try to find the last sentence ending
    const lastSentence = truncated.lastIndexOf('. ');
    if (lastSentence > keepChars * 0.7) { // If we can keep at least 70% of the text
      return truncated.substring(0, lastSentence + 1) + '...';
    }
    
    // Try to find the last word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    // Just truncate at the character level as a last resort
    return truncated + '...';
  }
  
  /**
   * Truncates a list to fit available space
   */
  private truncateList(list: string[], position: Position, minRequired: number): string[] {
    const fontSize = this.fontSizeByType.get('list')?.max || 24;
    const itemHeight = fontSize * 1.5;
    const maxItems = Math.floor(position.height / itemHeight);
    
    // Ensure we keep at least the minimum required
    const keepItems = Math.max(minRequired, Math.min(list.length, maxItems - 1)); // -1 for "more..." indicator
    
    if (keepItems >= list.length) {
      return list;
    }
    
    return [...list.slice(0, keepItems), '...'];
  }
  
  /**
   * Scales content to fit by reducing font size
   */
  private scaleContent(content: AdaptableContent, position: Position): any {
    // For text and lists, this means finding the right font size
    if (content.type === 'text' || content.type === 'list') {
      // We don't modify the content, just indicate it should be scaled
      // The actual scaling will happen in the CSS via adaptive rules
      return content.content;
    }
    
    // For images, compute a scaling factor
    if (content.type === 'image') {
      // Return the original URL, scaling will be handled by CSS
      return content.content;
    }
    
    // For other types, return as is
    return content.content;
  }
  
  /**
   * Reflows content to use space better
   */
  private reflowContent(content: AdaptableContent, position: Position): any {
    if (content.type !== 'text') {
      return content.content; // Only text can be reflowed
    }
    
    // For text, reflowing means possibly removing some whitespace and newlines
    // to let the content flow naturally within the container
    const text = content.content as string;
    
    // Remove extra whitespace and normalize line breaks
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }
  
  /**
   * Simplifies content by removing formatting and non-essential parts
   */
  private simplifyContent(content: AdaptableContent): any {
    switch (content.type) {
      case 'text':
        return this.simplifyText(content.content);
      
      case 'list':
        return this.simplifyList(content.content);
      
      case 'table':
        return this.simplifyTable(content.content);
      
      default:
        return content.content;
    }
  }
  
  /**
   * Simplifies text by removing formatting and keeping key sentences
   */
  private simplifyText(text: string): string {
    // Remove formatting markers like **bold**, *italic*, etc.
    let simplified = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic
      .replace(/__(.*?)__/g, '$1')     // Remove underline
      .replace(/~~(.*?)~~/g, '$1')     // Remove strikethrough
      .replace(/```(.*?)```/g, '$1')   // Remove code blocks
      .replace(/`(.*?)`/g, '$1');      // Remove inline code
    
    // Keep the first 1-2 sentences of each paragraph for very long texts
    if (simplified.length > 500) {
      const paragraphs = simplified.split(/\n\s*\n/);
      simplified = paragraphs.map(para => {
        const sentences = para.split(/(?<=[.!?])\s+/);
        if (sentences.length <= 2) return para;
        return sentences.slice(0, 2).join(' ');
      }).join('\n\n');
    }
    
    return simplified;
  }
  
  /**
   * Simplifies a list by shortening each item
   */
  private simplifyList(list: string[]): string[] {
    return list.map(item => {
      // Remove formatting and limit length
      const simplified = item
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/~~(.*?)~~/g, '$1');
      
      // If item is long, keep just the beginning
      if (simplified.length > 100) {
        const truncated = simplified.substring(0, 97) + '...';
        
        // Try to truncate at a word boundary
        const lastSpace = truncated.lastIndexOf(' ', 97);
        if (lastSpace > 60) { // If we can keep at least 60 chars
          return truncated.substring(0, lastSpace) + '...';
        }
        
        return truncated;
      }
      
      return simplified;
    });
  }
  
  /**
   * Simplifies a table by reducing columns or formatting
   */
  private simplifyTable(tableData: any): any {
    // Basic implementation - a real one would be more complex
    // and handle various table structures
    if (!tableData || !tableData.cells) {
      return tableData;
    }
    
    // Copy table data to avoid modifying the original
    const simplifiedTable = { ...tableData };
    
    // Limit columns if we have too many
    if (tableData.columns > 4) {
      simplifiedTable.columns = 4;
    }
    
    return simplifiedTable;
  }
  
  /**
   * Returns a placeholder for omitted content
   */
  private omitContent(content: AdaptableContent): any {
    // If we have a minimum required, return that minimum
    if (content.minRequired && content.minRequired > 0) {
      switch (content.type) {
        case 'text':
          if (typeof content.content === 'string' && content.content.length > content.minRequired) {
            // Keep just the beginning
            return content.content.substring(0, content.minRequired) + '...';
          }
          break;
        
        case 'list':
          if (Array.isArray(content.content) && content.content.length > content.minRequired) {
            // Keep just the first few items
            return content.content.slice(0, content.minRequired);
          }
          break;
      }
    }
    
    // For critical content, create a minimal placeholder
    if (content.priority === ContentPriority.CRITICAL) {
      switch (content.type) {
        case 'text':
          return '[Content omitted]';
        case 'list':
          return ['[List items omitted]'];
        case 'image':
          return ''; // Empty URL for placeholder image
        case 'table':
          return { rows: 0, columns: 0, cells: {} };
        default:
          return null;
      }
    }
    
    // For non-critical content, just return null or empty
    return null;
  }
}

export default ContentAdaptationEngine; 
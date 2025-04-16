/**
 * Automated Layout Generation System
 * 
 * This system provides constraint-based layout generation and content adaptation
 * for presentation templates. It dynamically adapts to content characteristics
 * while maintaining design principles.
 */

// Export all components of the layout system
export { default as ConstraintLayoutEngine } from './ConstraintLayoutEngine';
export { default as ContentAdaptationEngine } from './ContentAdaptationEngine';
export { default as LayoutOptimizer } from './LayoutOptimizer';

// Export types from individual components
export type { 
  Constraint,
  PositionConstraint,
  SizeConstraint,
  RelationshipConstraint,
  ContentConstraint,
  LayoutElement,
  LayoutSolution
} from './ConstraintLayoutEngine';

export type {
  AdaptableContent,
  OverflowStrategy
} from './ContentAdaptationEngine';

export { ContentPriority } from './ContentAdaptationEngine';

export type {
  DesignRuleViolation,
  LayoutEvaluation
} from './LayoutOptimizer';

// Main interface for the automated layout system
import ConstraintLayoutEngine from './ConstraintLayoutEngine';
import ContentAdaptationEngine, { ContentPriority, AdaptableContent } from './ContentAdaptationEngine';
import LayoutOptimizer from './LayoutOptimizer';
import { Position } from '@/components/features/templates/utils/positioningUtils';
import { TemplateSlot } from '@/components/features/templates/TemplateRegistry';
import { ContentRequirements } from '@/components/features/templates/layout/DynamicLayoutEngine';

export interface PositionConstraint {
  x?: number | { percentage: number };
  y?: number | { percentage: number };
  align?: 'start' | 'center' | 'end';
}

export interface SizeConstraint {
  width?: number | { percentage: number };
  height?: number | { percentage: number };
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspect?: number;
}

export interface Constraints {
  position?: PositionConstraint;
  size?: SizeConstraint;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  zIndex?: number;
}

export interface ConstraintElement {
  id: string;
  type: string;
  constraints: Constraints;
}

export interface ContentRequirements {
  textLength?: number;
  imageCount?: number;
  hasChart?: boolean;
  hasVideo?: boolean;
  hasLongText?: boolean;
  priority?: 'image' | 'text' | 'balanced';
  complexity?: 'simple' | 'normal' | 'complex';
  style?: 'formal' | 'casual' | 'creative';
}

/**
 * Main class that orchestrates the layout generation process
 */
export class AutomatedLayoutSystem {
  private layoutEngine: ConstraintLayoutEngine;
  private contentEngine: ContentAdaptationEngine;
  private optimizer: LayoutOptimizer;
  private canvasWidth: number;
  private canvasHeight: number;
  
  constructor(width: number = 800, height: number = 450) {
    this.layoutEngine = new ConstraintLayoutEngine(width, height);
    this.contentEngine = new ContentAdaptationEngine();
    this.optimizer = new LayoutOptimizer(this.layoutEngine);
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
  
  /**
   * Generates a template based on content requirements
   * @param content The content to create a layout for
   * @param requirements Additional content requirements
   */
  generateTemplate(
    content: Record<string, any>,
    requirements?: ContentRequirements
  ): TemplateSlot[] {
    // Set content requirements if provided
    if (requirements) {
      this.layoutEngine.setContentRequirements(requirements);
    }
    
    // Extract and analyze content
    const adaptableContent = this.prepareContentElements(content);
    
    // Add elements to the layout engine with constraints
    this.addElementsWithConstraints(adaptableContent);
    
    // Generate multiple layout variations
    this.optimizer.generateLayoutVariations(5);
    
    // Find the best layout
    const { layout, evaluation } = this.optimizer.findBestLayout();
    
    if (evaluation.score < 60) {
      console.warn('Generated layout has low quality score:', evaluation.score);
      console.warn('Design rule violations:', evaluation.violations);
      console.warn('Recommendations:', evaluation.recommendations);
    }
    
    // Update the layout engine with the best solution
    for (const [id, position] of layout.elements.entries()) {
      const element = this.layoutEngine['elements'].get(id);
      if (element) {
        element.position = position;
      }
    }
    
    // Adapt content to fit the layout
    this.adaptContentToLayout(adaptableContent, layout);
    
    // Generate the final template
    return this.layoutEngine.generateTemplate();
  }
  
  /**
   * Prepares content elements for layout generation
   */
  private prepareContentElements(content: Record<string, any>): Map<string, AdaptableContent> {
    const result = new Map<string, AdaptableContent>();
    
    // Process different content types
    for (const [key, value] of Object.entries(content)) {
      let type: 'text' | 'image' | 'list' | 'chart' | 'video' | 'table' = 'text';
      let priority = ContentPriority.MEDIUM;
      
      // Determine content type
      if (typeof value === 'string') {
        // Check if it's an image URL
        if (value.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) || 
            value.startsWith('data:image/')) {
          type = 'image';
        } else {
          type = 'text';
        }
      } else if (Array.isArray(value)) {
        type = 'list';
      } else if (typeof value === 'object' && value !== null) {
        if (value.rows && value.columns) {
          type = 'table';
        } else if (value.type === 'chart') {
          type = 'chart';
        }
      }
      
      // Determine priority based on key name
      if (key.includes('title') || key.includes('heading')) {
        priority = ContentPriority.CRITICAL;
      } else if (key.includes('main') || key.includes('primary')) {
        priority = ContentPriority.HIGH;
      } else if (key.includes('secondary') || key.includes('detail')) {
        priority = ContentPriority.LOW;
      } else if (key.includes('optional') || key.includes('decoration')) {
        priority = ContentPriority.OPTIONAL;
      }
      
      // Create adaptable content
      const adaptableContent: AdaptableContent = {
        id: key,
        type,
        content: value,
        priority,
        allowedStrategies: this.getAllowedStrategies(type, priority),
        minRequired: this.getMinimumRequired(type, priority)
      };
      
      result.set(key, adaptableContent);
      
      // Set content priority in the optimizer
      this.optimizer.setContentPriority(key, priority);
    }
    
    return result;
  }
  
  /**
   * Determines allowed adaptation strategies based on content type and priority
   */
  private getAllowedStrategies(
    type: 'text' | 'image' | 'list' | 'chart' | 'video' | 'table',
    priority: ContentPriority
  ): any[] {
    // Base strategies for all content
    const strategies = ['scale', 'reposition', 'resize'];
    
    // Add type-specific strategies
    switch (type) {
      case 'text':
        strategies.push('truncate', 'reflow', 'simplify');
        break;
      case 'list':
        strategies.push('truncate', 'simplify');
        break;
      case 'table':
        strategies.push('simplify');
        break;
      case 'image':
        strategies.push('resize');
        break;
    }
    
    // Add 'omit' only for low priority content
    if (priority <= ContentPriority.LOW) {
      strategies.push('omit');
    }
    
    return strategies;
  }
  
  /**
   * Determines minimum required content based on type and priority
   */
  private getMinimumRequired(
    type: 'text' | 'image' | 'list' | 'chart' | 'video' | 'table',
    priority: ContentPriority
  ): number {
    switch (type) {
      case 'text':
        // Minimum characters
        if (priority === ContentPriority.CRITICAL) return 100;
        if (priority === ContentPriority.HIGH) return 50;
        if (priority === ContentPriority.MEDIUM) return 20;
        return 0;
      
      case 'list':
        // Minimum items
        if (priority === ContentPriority.CRITICAL) return 3;
        if (priority === ContentPriority.HIGH) return 2;
        if (priority === ContentPriority.MEDIUM) return 1;
        return 0;
      
      default:
        return 0;
    }
  }
  
  /**
   * Adds elements to the layout engine with appropriate constraints
   */
  private addElementsWithConstraints(contentElements: Map<string, AdaptableContent>): void {
    // Initial positions for different element types
    const titlePosition: Position = { x: 100, y: 50, width: 600, height: 80 };
    const imagePosition: Position = { x: 100, y: 150, width: 300, height: 200 };
    const textPosition: Position = { x: 420, y: 150, width: 280, height: 200 };
    const listPosition: Position = { x: 100, y: 150, width: 600, height: 200 };
    
    // Track the next position for each type
    const nextPositions = {
      title: { ...titlePosition },
      image: { ...imagePosition },
      text: { ...textPosition },
      list: { ...listPosition },
      chart: { x: 100, y: 150, width: 400, height: 200 },
      video: { x: 100, y: 150, width: 400, height: 225 },
      table: { x: 100, y: 150, width: 600, height: 200 }
    };
    
    // Handle title first if present
    const titleElement = Array.from(contentElements.entries())
      .find(([id, content]) => 
        id.includes('title') && content.priority === ContentPriority.CRITICAL
      );
    
    if (titleElement) {
      const [id, content] = titleElement;
      
      // Add title element with high-priority position constraint
      this.layoutEngine.addElement({
        id,
        type: content.type,
        position: titlePosition,
        content: content.content,
        constraints: [
          {
            type: 'position',
            elementId: id,
            y: { min: 20, max: 100, preferred: 50 },
            priority: 10
          },
          {
            type: 'size',
            elementId: id,
            width: { min: 400, max: 700, preferred: 600 },
            height: { min: 60, max: 100, preferred: 80 },
            priority: 8
          }
        ]
      });
      
      // Adjust next positions to account for title
      Object.keys(nextPositions).forEach(key => {
        if (key !== 'title') {
          nextPositions[key as keyof typeof nextPositions].y = 
            titlePosition.y + titlePosition.height + 20;
        }
      });
      
      // Remove the title from contentElements so we don't process it again
      contentElements.delete(id);
    }
    
    // Sort remaining elements by priority (highest first)
    const sortedElements = Array.from(contentElements.entries())
      .sort((a, b) => b[1].priority - a[1].priority);
    
    // Add each content element with appropriate constraints
    for (const [id, content] of sortedElements) {
      const type = content.type;
      const position = { ...nextPositions[type] };
      
      // Create constraints based on content type and priority
      const constraints = this.createConstraints(id, type, content.priority);
      
      // Add the element
      this.layoutEngine.addElement({
        id,
        type,
        position,
        content: content.content,
        constraints
      });
      
      // Update next position for this type
      nextPositions[type].y += position.height + 20;
    }
    
    // Add spacing constraint to all elements
    this.layoutEngine.addSpacingConstraint(20);
  }
  
  /**
   * Creates appropriate constraints based on content type and priority
   */
  private createConstraints(
    elementId: string,
    type: 'text' | 'image' | 'list' | 'chart' | 'video' | 'table',
    priority: ContentPriority
  ): any[] {
    const constraints = [];
    
    // Add size constraints
    switch (type) {
      case 'text':
        constraints.push({
          type: 'size',
          elementId,
          width: { min: 200, max: 600, preferred: 400 },
          height: { min: 80, max: 300, preferred: 150 },
          priority: 7
        });
        break;
      
      case 'image':
        constraints.push({
          type: 'size',
          elementId,
          width: { min: 200, max: 400, preferred: 300 },
          height: { min: 150, max: 300, preferred: 200 },
          aspectRatio: 1.5, // 3:2 aspect ratio
          priority: 8
        });
        break;
      
      case 'list':
        constraints.push({
          type: 'size',
          elementId,
          width: { min: 300, max: 600, preferred: 500 },
          height: { min: 120, max: 300, preferred: 200 },
          priority: 6
        });
        break;
      
      case 'table':
        constraints.push({
          type: 'size',
          elementId,
          width: { min: 400, max: 700, preferred: 600 },
          height: { min: 150, max: 300, preferred: 200 },
          priority: 7
        });
        break;
      
      case 'chart':
        constraints.push({
          type: 'size',
          elementId,
          width: { min: 300, max: 600, preferred: 400 },
          height: { min: 200, max: 300, preferred: 250 },
          priority: 8
        });
        break;
    }
    
    // Add content constraint
    constraints.push({
      type: 'content',
      elementId,
      contentType: type,
      priority: priority
    });
    
    // For high priority elements, add position constraints to ensure visibility
    if (priority >= ContentPriority.HIGH) {
      constraints.push({
        type: 'position',
        elementId,
        y: { min: 50, max: 350 }, // Keep in the visible area
        priority: 9
      });
    }
    
    return constraints;
  }
  
  /**
   * Adapts content to fit the layout
   */
  private adaptContentToLayout(
    contentElements: Map<string, AdaptableContent>,
    layout: LayoutSolution
  ): void {
    // Add each content element and its position to the content engine
    for (const [id, content] of contentElements.entries()) {
      const position = layout.elements.get(id);
      
      if (position) {
        this.contentEngine.addContent(content, position);
      }
    }
    
    // Adapt content to fit
    const adaptedContent = this.contentEngine.adaptContent();
    
    // Update element content in the layout engine
    for (const [id, content] of adaptedContent.entries()) {
      const element = this.layoutEngine['elements'].get(id);
      
      if (element) {
        element.content = content;
      }
    }
  }

  /**
   * Create a layout based on content requirements
   */
  generateLayout(requirements: ContentRequirements): ConstraintElement[] {
    // Default layout for different content types
    if (requirements.hasChart) {
      return this.generateChartFocusedLayout(requirements);
    } else if (requirements.imageCount && requirements.imageCount > 0) {
      return this.generateImageTextLayout(requirements);
    } else {
      return this.generateTextFocusedLayout(requirements);
    }
  }
  
  /**
   * Create a layout focused on displaying a chart with supporting text
   */
  private generateChartFocusedLayout(requirements: ContentRequirements): ConstraintElement[] {
    const elements: ConstraintElement[] = [];
    
    // Chart area (takes 60-70% of the space)
    elements.push({
      id: 'chart',
      type: 'chart',
      constraints: {
        position: { 
          x: { percentage: 50 }, 
          y: { percentage: 45 },
          align: 'center'
        },
        size: { 
          width: { percentage: 70 }, 
          height: { percentage: 60 }
        },
        margin: { top: 20, bottom: 10 }
      }
    });
    
    // Title
    elements.push({
      id: 'title',
      type: 'text',
      constraints: {
        position: { 
          x: { percentage: 50 }, 
          y: { percentage: 10 },
          align: 'center'
        },
        size: { 
          width: { percentage: 90 },
          height: 60
        }
      }
    });
    
    // Description text
    elements.push({
      id: 'description',
      type: 'text',
      constraints: {
        position: { 
          x: { percentage: 50 }, 
          y: { percentage: 85 },
          align: 'center'
        },
        size: { 
          width: { percentage: 80 },
          height: 80
        }
      }
    });
    
    return elements;
  }
  
  /**
   * Create a layout with balanced image and text elements
   */
  private generateImageTextLayout(requirements: ContentRequirements): ConstraintElement[] {
    const elements: ConstraintElement[] = [];
    const imageCount = requirements.imageCount || 1;
    
    // Title
    elements.push({
      id: 'title',
      type: 'text',
      constraints: {
        position: { 
          x: { percentage: 50 }, 
          y: { percentage: 10 },
          align: 'center'
        },
        size: { 
          width: { percentage: 90 },
          height: 60
        }
      }
    });
    
    if (imageCount === 1) {
      // Single image + text layout
      
      // Image
      elements.push({
        id: 'image',
        type: 'image',
        constraints: {
          position: { 
            x: { percentage: 30 }, 
            y: { percentage: 50 }
          },
          size: { 
            width: { percentage: 45 }, 
            height: { percentage: 50 }
          }
        }
      });
      
      // Text
      elements.push({
        id: 'content',
        type: 'text',
        constraints: {
          position: { 
            x: { percentage: 70 }, 
            y: { percentage: 50 }
          },
          size: { 
            width: { percentage: 40 }, 
            height: { percentage: 50 }
          }
        }
      });
    } else {
      // Multiple images layout
      
      // Create a grid of images
      const columns = Math.min(3, imageCount);
      const imageWidth = 90 / columns;
      
      for (let i = 0; i < imageCount; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        
        elements.push({
          id: `image${i}`,
          type: 'image',
          constraints: {
            position: { 
              x: { percentage: 5 + col * imageWidth + imageWidth / 2 }, 
              y: { percentage: 40 + row * 30 }
            },
            size: { 
              width: { percentage: imageWidth - 5 }, 
              height: { percentage: 25 }
            }
          }
        });
      }
      
      // Add text at the bottom
      elements.push({
        id: 'content',
        type: 'text',
        constraints: {
          position: { 
            x: { percentage: 50 }, 
            y: { percentage: 85 }
          },
          size: { 
            width: { percentage: 90 }, 
            height: { percentage: 20 }
          }
        }
      });
    }
    
    return elements;
  }
  
  /**
   * Create a layout focused on text content
   */
  private generateTextFocusedLayout(requirements: ContentRequirements): ConstraintElement[] {
    const elements: ConstraintElement[] = [];
    
    // Text-focused layout
    
    // Title
    elements.push({
      id: 'title',
      type: 'text',
      constraints: {
        position: { 
          x: { percentage: 50 }, 
          y: { percentage: 15 },
          align: 'center'
        },
        size: { 
          width: { percentage: 90 },
          height: 80
        }
      }
    });
    
    // Main content
    elements.push({
      id: 'content',
      type: 'text',
      constraints: {
        position: { 
          x: { percentage: 50 }, 
          y: { percentage: 50 },
          align: 'center'
        },
        size: { 
          width: { percentage: 80 },
          height: { percentage: 50 }
        }
      }
    });
    
    // Optional subtitle or footer
    elements.push({
      id: 'footer',
      type: 'text',
      constraints: {
        position: { 
          x: { percentage: 50 }, 
          y: { percentage: 85 },
          align: 'center'
        },
        size: { 
          width: { percentage: 80 },
          height: 50
        }
      }
    });
    
    return elements;
  }
  
  /**
   * Analyze content to determine its requirements
   */
  analyzeContent(content: Record<string, any>): ContentRequirements {
    const requirements: ContentRequirements = {
      textLength: 0,
      imageCount: 0,
      hasChart: false,
      hasVideo: false,
      hasLongText: false,
      priority: 'balanced',
      complexity: 'normal',
      style: 'formal'
    };
    
    // Analyze each content piece
    Object.keys(content).forEach(key => {
      const value = content[key];
      
      if (typeof value === 'string') {
        // Text content
        const textLength = value.length;
        requirements.textLength = (requirements.textLength || 0) + textLength;
        
        if (textLength > 500) {
          requirements.hasLongText = true;
        }
      } else if (value && typeof value === 'object') {
        // Check for image/chart/video content
        if (value.type === 'image' || value.url?.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
          requirements.imageCount = (requirements.imageCount || 0) + 1;
        } else if (value.type === 'chart' || value.chartData) {
          requirements.hasChart = true;
        } else if (value.type === 'video' || value.url?.match(/\.(mp4|webm|ogg|youtube|vimeo)/i)) {
          requirements.hasVideo = true;
        }
      }
    });
    
    // Determine content priority
    if (requirements.imageCount && requirements.imageCount > 0 && (requirements.textLength || 0) < 200) {
      requirements.priority = 'image';
    } else if ((requirements.textLength || 0) > 500) {
      requirements.priority = 'text';
    }
    
    return requirements;
  }
  
  /**
   * Adjust an existing layout based on new dimensions
   */
  adjustLayoutForSize(
    elements: ConstraintElement[], 
    newWidth: number, 
    newHeight: number
  ): ConstraintElement[] {
    // Create a copy of elements to avoid mutation
    return elements.map(el => {
      const newElement = { ...el, constraints: { ...el.constraints } };
      
      // Adjust positions
      if (newElement.constraints.position) {
        // No specific adjustments needed as we use percentages
      }
      
      // Adjust sizes if they're absolute
      if (newElement.constraints.size) {
        const size = newElement.constraints.size;
        
        // Scale absolute width/height based on ratio
        if (typeof size.width === 'number') {
          const widthRatio = newWidth / this.canvasWidth;
          size.width = size.width * widthRatio;
        }
        
        if (typeof size.height === 'number') {
          const heightRatio = newHeight / this.canvasHeight;
          size.height = size.height * heightRatio;
        }
      }
      
      return newElement;
    });
  }
}

export default AutomatedLayoutSystem; 
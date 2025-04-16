/**
 * ConstraintLayoutEngine - Advanced layout generation system for presentations
 * 
 * This engine builds on the existing template utilities but adds constraint-based
 * positioning that can dynamically adapt to content characteristics.
 */

import { Position, PositioningOptions } from '@/components/features/templates/utils/positioningUtils';
import { ContentRequirements } from '@/components/features/templates/layout/DynamicLayoutEngine';
import { TemplateSlot } from '@/components/features/templates/TemplateRegistry';
import { estimateContentDimensions, willContentOverflow } from '@/components/features/templates/utils/contentAdaptation';
import { Constraints, ConstraintElement } from './index';

// Constraint types
export type Constraint = 
  | PositionConstraint
  | SizeConstraint
  | RelationshipConstraint
  | ContentConstraint;

// Position constraint keeps an element at a specific position or within bounds
export interface PositionConstraint {
  type: 'position';
  elementId: string;
  x?: number | { min: number; max: number; preferred?: number };
  y?: number | { min: number; max: number; preferred?: number };
  priority: number; // 1-10, higher means more important
}

// Size constraint defines width/height requirements
export interface SizeConstraint {
  type: 'size';
  elementId: string;
  width?: number | { min: number; max: number; preferred?: number };
  height?: number | { min: number; max: number; preferred?: number };
  aspectRatio?: number; // width/height ratio to maintain
  priority: number;
}

// Relationship constraint defines how elements relate to each other
export interface RelationshipConstraint {
  type: 'relationship';
  elements: string[]; // IDs of elements in the relationship
  relationship: 'leftOf' | 'rightOf' | 'above' | 'below' | 'alignTop' | 'alignBottom' | 'alignLeft' | 'alignRight' | 'alignCenter';
  distance?: number; // For spacing constraints
  priority: number;
}

// Content constraint adapts layout based on content characteristics
export interface ContentConstraint {
  type: 'content';
  elementId: string;
  contentType: 'text' | 'image' | 'list' | 'chart' | 'video' | 'table';
  minTextLength?: number;
  maxTextLength?: number;
  minItems?: number;
  maxItems?: number;
  priority: number;
}

// Layout element with position and constraints
export interface LayoutElement {
  id: string;
  type: 'text' | 'image' | 'list' | 'chart' | 'video' | 'table' | 'shape' | 'container';
  position: Position;
  content?: any;
  constraints: Constraint[];
  children?: LayoutElement[];
  parent?: string;
  bounds: CalculatedBounds;
}

// Layout solution represents a specific arrangement of elements
export interface LayoutSolution {
  elements: Map<string, Position>;
  score: number;
  overflowElements: string[];
  unusedSpace: number;
}

export interface CalculatedBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Constraint-based layout engine for dynamic template generation
 */
export class ConstraintLayoutEngine {
  private width: number;
  private height: number;
  private elements: Map<string, LayoutElement> = new Map();
  private globalConstraints: Constraint[] = [];
  private contentRequirements: ContentRequirements | null = null;
  
  constructor(width: number = 800, height: number = 450) {
    this.width = width;
    this.height = height;
  }
  
  /**
   * Sets the content requirements for this layout
   */
  setContentRequirements(requirements: ContentRequirements): this {
    this.contentRequirements = requirements;
    return this;
  }
  
  /**
   * Adds an element to the layout
   */
  addElement(element: LayoutElement): this {
    this.elements.set(element.id, element);
    return this;
  }
  
  /**
   * Adds a global constraint that applies to the entire layout
   */
  addGlobalConstraint(constraint: Constraint): this {
    this.globalConstraints.push(constraint);
    return this;
  }
  
  /**
   * Adds a spacing constraint between all elements
   */
  addSpacingConstraint(spacing: number, priority: number = 5): this {
    const elementIds = Array.from(this.elements.keys());
    
    // Add horizontal spacing constraints
    for (let i = 0; i < elementIds.length; i++) {
      for (let j = 0; j < elementIds.length; j++) {
        if (i !== j) {
          this.globalConstraints.push({
            type: 'relationship',
            elements: [elementIds[i], elementIds[j]],
            relationship: 'leftOf',
            distance: spacing,
            priority
          });
        }
      }
    }
    
    // Add vertical spacing constraints
    for (let i = 0; i < elementIds.length; i++) {
      for (let j = 0; j < elementIds.length; j++) {
        if (i !== j) {
          this.globalConstraints.push({
            type: 'relationship',
            elements: [elementIds[i], elementIds[j]],
            relationship: 'above',
            distance: spacing,
            priority
          });
        }
      }
    }
    
    return this;
  }
  
  /**
   * Solves the layout constraints and returns the optimal layout
   */
  solveLayout(): LayoutSolution {
    // Start with a baseline solution using greedy positioning
    let solution = this.generateBaselineSolution();
    
    // Apply iterative optimization to improve the layout
    solution = this.optimizeLayout(solution);
    
    return solution;
  }
  
  /**
   * Generates a template based on the solved layout
   */
  generateTemplate(): TemplateSlot[] {
    const solution = this.solveLayout();
    const slots: TemplateSlot[] = [];
    
    for (const [id, element] of this.elements.entries()) {
      const position = solution.elements.get(id);
      
      if (position) {
        // Create a template slot from the element and its solved position
        slots.push({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
          type: element.type as any,
          required: this.isElementRequired(element),
          position: {
            x: position.x,
            y: position.y,
            width: position.width,
            height: position.height
          },
          defaultContent: element.content || '',
          adaptiveRules: this.generateAdaptiveRules(element)
        });
      }
    }
    
    return slots;
  }
  
  /**
   * Determines if an element is required based on its constraints
   */
  private isElementRequired(element: LayoutElement): boolean {
    // Check content constraints for requirement level
    const contentConstraints = element.constraints.filter(c => 
      c.type === 'content'
    ) as ContentConstraint[];
    
    // Elements with high priority content constraints are considered required
    return contentConstraints.some(c => c.priority >= 7);
  }
  
  /**
   * Generates adaptive rules for the element based on its constraints
   */
  private generateAdaptiveRules(element: LayoutElement): any {
    const rules: any = {
      minFontSize: 14,
      maxFontSize: 36
    };
    
    // Set overflow behavior based on element type
    switch (element.type) {
      case 'text':
        rules.autoScale = true;
        rules.overflowBehavior = 'shrink';
        break;
      case 'list':
        rules.overflowBehavior = 'scroll';
        break;
      case 'image':
        rules.overflowBehavior = 'scale';
        break;
      default:
        rules.overflowBehavior = 'truncate';
    }
    
    // Generate responsive positions for different screen sizes
    rules.responsivePositions = {
      small: {
        x: Math.round(element.position.x * 0.5),
        y: Math.round(element.position.y * 0.5),
        width: Math.round(element.position.width * 0.5),
        height: Math.round(element.position.height * 0.5)
      },
      medium: element.position,
      large: {
        x: Math.round(element.position.x * 1.2),
        y: Math.round(element.position.y * 1.2),
        width: Math.round(element.position.width * 1.2),
        height: Math.round(element.position.height * 1.2)
      }
    };
    
    return rules;
  }
  
  /**
   * Generates a baseline solution using a greedy algorithm
   */
  private generateBaselineSolution(): LayoutSolution {
    const solution = new Map<string, Position>();
    const overflowElements: string[] = [];
    
    // Sort elements by priority (based on their highest priority constraint)
    const sortedElements = Array.from(this.elements.entries())
      .sort((a, b) => {
        const aMaxPriority = Math.max(...a[1].constraints.map(c => c.priority));
        const bMaxPriority = Math.max(...b[1].constraints.map(c => c.priority));
        return bMaxPriority - aMaxPriority;
      });
    
    // Assign positions starting with highest priority elements
    for (const [id, element] of sortedElements) {
      const position = this.findInitialPosition(element, solution);
      solution.set(id, position);
      
      // Check for overflow
      if (position.x + position.width > this.width || 
          position.y + position.height > this.height) {
        overflowElements.push(id);
      }
    }
    
    // Calculate score based on constraint satisfaction
    const score = this.evaluateLayout(solution);
    
    // Calculate unused space
    const unusedSpace = this.calculateUnusedSpace(solution);
    
    return {
      elements: solution,
      score,
      overflowElements,
      unusedSpace
    };
  }
  
  /**
   * Finds an initial position for an element considering existing elements
   */
  private findInitialPosition(element: LayoutElement, existingSolution: Map<string, Position>): Position {
    let position = { ...element.position };
    
    // Apply position constraints first
    const positionConstraints = element.constraints.filter(c => 
      c.type === 'position'
    ) as PositionConstraint[];
    
    if (positionConstraints.length > 0) {
      // Sort by priority
      const sorted = [...positionConstraints].sort((a, b) => b.priority - a.priority);
      const highest = sorted[0];
      
      // Apply exact position if specified
      if (typeof highest.x === 'number') position.x = highest.x;
      if (typeof highest.y === 'number') position.y = highest.y;
      
      // Apply range constraints
      if (typeof highest.x === 'object' && highest.x.preferred !== undefined) {
        position.x = highest.x.preferred;
      }
      
      if (typeof highest.y === 'object' && highest.y.preferred !== undefined) {
        position.y = highest.y.preferred;
      }
    }
    
    // Apply size constraints
    const sizeConstraints = element.constraints.filter(c => 
      c.type === 'size'
    ) as SizeConstraint[];
    
    if (sizeConstraints.length > 0) {
      // Sort by priority
      const sorted = [...sizeConstraints].sort((a, b) => b.priority - a.priority);
      const highest = sorted[0];
      
      // Apply exact sizes if specified
      if (typeof highest.width === 'number') position.width = highest.width;
      if (typeof highest.height === 'number') position.height = highest.height;
      
      // Apply range constraints
      if (typeof highest.width === 'object' && highest.width.preferred !== undefined) {
        position.width = highest.width.preferred;
      }
      
      if (typeof highest.height === 'object' && highest.height.preferred !== undefined) {
        position.height = highest.height.preferred;
      }
      
      // Maintain aspect ratio if specified
      if (highest.aspectRatio) {
        if (position.width && !position.height) {
          position.height = position.width / highest.aspectRatio;
        } else if (position.height && !position.width) {
          position.width = position.height * highest.aspectRatio;
        }
      }
    }
    
    // Check relationship constraints with existing elements
    const relationshipConstraints = element.constraints.filter(c => 
      c.type === 'relationship'
    ) as RelationshipConstraint[];
    
    for (const constraint of relationshipConstraints) {
      const otherElementId = constraint.elements.find(id => id !== element.id);
      
      if (otherElementId && existingSolution.has(otherElementId)) {
        const otherPosition = existingSolution.get(otherElementId)!;
        
        switch (constraint.relationship) {
          case 'rightOf':
            position.x = otherPosition.x + otherPosition.width + (constraint.distance || 10);
            break;
          case 'leftOf':
            position.x = otherPosition.x - position.width - (constraint.distance || 10);
            break;
          case 'below':
            position.y = otherPosition.y + otherPosition.height + (constraint.distance || 10);
            break;
          case 'above':
            position.y = otherPosition.y - position.height - (constraint.distance || 10);
            break;
          case 'alignTop':
            position.y = otherPosition.y;
            break;
          case 'alignBottom':
            position.y = otherPosition.y + otherPosition.height - position.height;
            break;
          case 'alignLeft':
            position.x = otherPosition.x;
            break;
          case 'alignRight':
            position.x = otherPosition.x + otherPosition.width - position.width;
            break;
          case 'alignCenter':
            position.x = otherPosition.x + (otherPosition.width - position.width) / 2;
            position.y = otherPosition.y + (otherPosition.height - position.height) / 2;
            break;
        }
      }
    }
    
    // Ensure element stays within bounds of slide
    position.x = Math.max(0, Math.min(this.width - position.width, position.x));
    position.y = Math.max(0, Math.min(this.height - position.height, position.y));
    
    return position;
  }
  
  /**
   * Optimizes the layout using simulated annealing or another algorithm
   */
  private optimizeLayout(initialSolution: LayoutSolution): LayoutSolution {
    let currentSolution = {
      elements: new Map(initialSolution.elements),
      score: initialSolution.score,
      overflowElements: [...initialSolution.overflowElements],
      unusedSpace: initialSolution.unusedSpace
    };
    
    let bestSolution = { ...currentSolution };
    const MAX_ITERATIONS = 100;
    
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      // Create a neighboring solution by slightly adjusting positions
      const neighbor = this.createNeighborSolution(currentSolution);
      
      // Evaluate the neighbor
      const neighborScore = this.evaluateLayout(neighbor.elements);
      neighbor.score = neighborScore;
      
      // Calculate overflow elements
      neighbor.overflowElements = this.findOverflowElements(neighbor.elements);
      
      // Calculate unused space
      neighbor.unusedSpace = this.calculateUnusedSpace(neighbor.elements);
      
      // Accept the neighbor if it's better
      if (neighbor.score > currentSolution.score || 
          (neighbor.score === currentSolution.score && 
           neighbor.overflowElements.length < currentSolution.overflowElements.length)) {
        currentSolution = neighbor;
        
        // Track the best solution seen so far
        if (neighbor.score > bestSolution.score || 
            (neighbor.score === bestSolution.score && 
             neighbor.overflowElements.length < bestSolution.overflowElements.length)) {
          bestSolution = neighbor;
        }
      }
    }
    
    return bestSolution;
  }
  
  /**
   * Creates a neighboring solution by making small adjustments
   */
  private createNeighborSolution(solution: LayoutSolution): LayoutSolution {
    const newElements = new Map(solution.elements);
    const elementIds = Array.from(newElements.keys());
    
    // Randomly select an element to adjust
    const randomIndex = Math.floor(Math.random() * elementIds.length);
    const elementId = elementIds[randomIndex];
    const position = { ...newElements.get(elementId)! };
    
    // Make a small random adjustment
    const adjustmentRange = 20;
    position.x += Math.floor(Math.random() * adjustmentRange) - adjustmentRange / 2;
    position.y += Math.floor(Math.random() * adjustmentRange) - adjustmentRange / 2;
    
    // Ensure the element stays within bounds
    position.x = Math.max(0, Math.min(this.width - position.width, position.x));
    position.y = Math.max(0, Math.min(this.height - position.height, position.y));
    
    newElements.set(elementId, position);
    
    return {
      elements: newElements,
      score: 0, // Will be calculated later
      overflowElements: [], // Will be calculated later
      unusedSpace: 0 // Will be calculated later
    };
  }
  
  /**
   * Evaluates the quality of a layout
   */
  private evaluateLayout(solution: Map<string, Position>): number {
    let score = 0;
    
    // Check constraint satisfaction
    for (const [id, element] of this.elements.entries()) {
      const position = solution.get(id);
      
      if (!position) continue;
      
      // Evaluate position constraints
      const positionConstraints = element.constraints.filter(c => 
        c.type === 'position'
      ) as PositionConstraint[];
      
      for (const constraint of positionConstraints) {
        // Check x position
        if (typeof constraint.x === 'number') {
          score += constraint.priority * (1 - Math.min(1, Math.abs(position.x - constraint.x) / 50));
        } else if (constraint.x) {
          if (position.x >= constraint.x.min && position.x <= constraint.x.max) {
            score += constraint.priority;
          }
        }
        
        // Check y position
        if (typeof constraint.y === 'number') {
          score += constraint.priority * (1 - Math.min(1, Math.abs(position.y - constraint.y) / 50));
        } else if (constraint.y) {
          if (position.y >= constraint.y.min && position.y <= constraint.y.max) {
            score += constraint.priority;
          }
        }
      }
      
      // Evaluate size constraints
      const sizeConstraints = element.constraints.filter(c => 
        c.type === 'size'
      ) as SizeConstraint[];
      
      for (const constraint of sizeConstraints) {
        // Check width
        if (typeof constraint.width === 'number') {
          score += constraint.priority * (1 - Math.min(1, Math.abs(position.width - constraint.width) / 50));
        } else if (constraint.width) {
          if (position.width >= constraint.width.min && position.width <= constraint.width.max) {
            score += constraint.priority;
          }
        }
        
        // Check height
        if (typeof constraint.height === 'number') {
          score += constraint.priority * (1 - Math.min(1, Math.abs(position.height - constraint.height) / 50));
        } else if (constraint.height) {
          if (position.height >= constraint.height.min && position.height <= constraint.height.max) {
            score += constraint.priority;
          }
        }
        
        // Check aspect ratio
        if (constraint.aspectRatio) {
          const currentRatio = position.width / position.height;
          const ratioDifference = Math.abs(currentRatio - constraint.aspectRatio) / constraint.aspectRatio;
          score += constraint.priority * (1 - Math.min(1, ratioDifference));
        }
      }
    }
    
    // Evaluate relationship constraints
    for (const constraint of this.globalConstraints.filter(c => c.type === 'relationship') as RelationshipConstraint[]) {
      if (constraint.elements.length < 2) continue;
      
      const position1 = solution.get(constraint.elements[0]);
      const position2 = solution.get(constraint.elements[1]);
      
      if (!position1 || !position2) continue;
      
      switch (constraint.relationship) {
        case 'rightOf':
          if (position1.x > position2.x + position2.width) {
            score += constraint.priority;
          }
          break;
        case 'leftOf':
          if (position1.x + position1.width < position2.x) {
            score += constraint.priority;
          }
          break;
        case 'below':
          if (position1.y > position2.y + position2.height) {
            score += constraint.priority;
          }
          break;
        case 'above':
          if (position1.y + position1.height < position2.y) {
            score += constraint.priority;
          }
          break;
        case 'alignTop':
          score += constraint.priority * (1 - Math.min(1, Math.abs(position1.y - position2.y) / 20));
          break;
        case 'alignBottom':
          const bottom1 = position1.y + position1.height;
          const bottom2 = position2.y + position2.height;
          score += constraint.priority * (1 - Math.min(1, Math.abs(bottom1 - bottom2) / 20));
          break;
        case 'alignLeft':
          score += constraint.priority * (1 - Math.min(1, Math.abs(position1.x - position2.x) / 20));
          break;
        case 'alignRight':
          const right1 = position1.x + position1.width;
          const right2 = position2.x + position2.width;
          score += constraint.priority * (1 - Math.min(1, Math.abs(right1 - right2) / 20));
          break;
        case 'alignCenter':
          const centerX1 = position1.x + position1.width / 2;
          const centerX2 = position2.x + position2.width / 2;
          const centerY1 = position1.y + position1.height / 2;
          const centerY2 = position2.y + position2.height / 2;
          
          score += constraint.priority * (1 - Math.min(1, Math.abs(centerX1 - centerX2) / 20));
          score += constraint.priority * (1 - Math.min(1, Math.abs(centerY1 - centerY2) / 20));
          break;
      }
    }
    
    // Evaluate overall layout aesthetics
    score += this.evaluateAesthetics(solution);
    
    return score;
  }
  
  /**
   * Evaluates the aesthetic quality of the layout
   */
  private evaluateAesthetics(solution: Map<string, Position>): number {
    let score = 0;
    
    // Check for overlapping elements (heavily penalize)
    const overlaps = this.checkForOverlaps(solution);
    score -= overlaps * 20;
    
    // Check for too much unused space
    const unusedSpace = this.calculateUnusedSpace(solution);
    score -= unusedSpace / 10000;
    
    // Check for alignment along common axes (reward)
    score += this.evaluateAlignment(solution) * 5;
    
    // Check for balanced distribution
    score += this.evaluateBalance(solution) * 10;
    
    return score;
  }
  
  /**
   * Finds elements that overflow the slide boundaries
   */
  private findOverflowElements(solution: Map<string, Position>): string[] {
    const overflowElements: string[] = [];
    
    for (const [id, position] of solution.entries()) {
      if (position.x < 0 || 
          position.y < 0 || 
          position.x + position.width > this.width || 
          position.y + position.height > this.height) {
        overflowElements.push(id);
      }
    }
    
    return overflowElements;
  }
  
  /**
   * Checks for overlapping elements
   */
  private checkForOverlaps(solution: Map<string, Position>): number {
    let overlaps = 0;
    const positions = Array.from(solution.entries());
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [id1, pos1] = positions[i];
        const [id2, pos2] = positions[j];
        
        if (this.doPositionsOverlap(pos1, pos2)) {
          overlaps++;
        }
      }
    }
    
    return overlaps;
  }
  
  /**
   * Checks if two positions overlap
   */
  private doPositionsOverlap(pos1: Position, pos2: Position): boolean {
    return !(
      pos1.x + pos1.width <= pos2.x ||
      pos2.x + pos2.width <= pos1.x ||
      pos1.y + pos1.height <= pos2.y ||
      pos2.y + pos2.height <= pos1.y
    );
  }
  
  /**
   * Calculates the unused space in the layout
   */
  private calculateUnusedSpace(solution: Map<string, Position>): number {
    let totalElementArea = 0;
    
    for (const position of solution.values()) {
      totalElementArea += position.width * position.height;
    }
    
    const totalArea = this.width * this.height;
    return totalArea - totalElementArea;
  }
  
  /**
   * Evaluates alignment of elements along common axes
   */
  private evaluateAlignment(solution: Map<string, Position>): number {
    const positions = Array.from(solution.values());
    const xPositions = new Set<number>();
    const yPositions = new Set<number>();
    const rightEdges = new Set<number>();
    const bottomEdges = new Set<number>();
    
    // Collect all the coordinates
    for (const pos of positions) {
      xPositions.add(pos.x);
      yPositions.add(pos.y);
      rightEdges.add(pos.x + pos.width);
      bottomEdges.add(pos.y + pos.height);
    }
    
    // Count alignments
    let alignmentCount = 0;
    
    for (const pos of positions) {
      if (xPositions.has(pos.x)) alignmentCount++;
      if (yPositions.has(pos.y)) alignmentCount++;
      if (rightEdges.has(pos.x + pos.width)) alignmentCount++;
      if (bottomEdges.has(pos.y + pos.height)) alignmentCount++;
    }
    
    return alignmentCount;
  }
  
  /**
   * Evaluates the visual balance of the layout
   */
  private evaluateBalance(solution: Map<string, Position>): number {
    const positions = Array.from(solution.values());
    
    // Find the center of mass
    let totalArea = 0;
    let centerX = 0;
    let centerY = 0;
    
    for (const pos of positions) {
      const area = pos.width * pos.height;
      totalArea += area;
      centerX += (pos.x + pos.width / 2) * area;
      centerY += (pos.y + pos.height / 2) * area;
    }
    
    if (totalArea > 0) {
      centerX /= totalArea;
      centerY /= totalArea;
    }
    
    // Ideal center is the middle of the slide
    const idealX = this.width / 2;
    const idealY = this.height / 2;
    
    // Calculate distance from ideal center (normalized by slide dimensions)
    const distanceX = Math.abs(centerX - idealX) / this.width;
    const distanceY = Math.abs(centerY - idealY) / this.height;
    
    // A perfect balance would be 1, worst would be 0
    return 1 - (distanceX + distanceY) / 2;
  }

  /**
   * Calculate the actual bounds for a set of constraint elements
   */
  calculateLayout(elements: ConstraintElement[]): LayoutElement[] {
    return elements.map(element => ({
      ...element,
      bounds: this.calculateElementBounds(element.constraints)
    }));
  }
  
  /**
   * Calculate bounds for a single element based on its constraints
   */
  calculateElementBounds(constraints: Constraints): CalculatedBounds {
    const bounds: CalculatedBounds = {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height
    };
    
    // Calculate size first
    if (constraints.size) {
      // Width
      if (constraints.size.width !== undefined) {
        if (typeof constraints.size.width === 'number') {
          bounds.width = constraints.size.width;
        } else if (constraints.size.width.percentage !== undefined) {
          bounds.width = (constraints.size.width.percentage / 100) * this.width;
        }
      }
      
      // Height
      if (constraints.size.height !== undefined) {
        if (typeof constraints.size.height === 'number') {
          bounds.height = constraints.size.height;
        } else if (constraints.size.height.percentage !== undefined) {
          bounds.height = (constraints.size.height.percentage / 100) * this.height;
        }
      }
      
      // Apply min/max constraints
      if (constraints.size.minWidth !== undefined) {
        bounds.width = Math.max(bounds.width, constraints.size.minWidth);
      }
      
      if (constraints.size.minHeight !== undefined) {
        bounds.height = Math.max(bounds.height, constraints.size.minHeight);
      }
      
      if (constraints.size.maxWidth !== undefined) {
        bounds.width = Math.min(bounds.width, constraints.size.maxWidth);
      }
      
      if (constraints.size.maxHeight !== undefined) {
        bounds.height = Math.min(bounds.height, constraints.size.maxHeight);
      }
      
      // Aspect ratio
      if (constraints.size.aspect !== undefined && constraints.size.aspect > 0) {
        // If both dimensions are specified, honor the width and adjust height
        if (constraints.size.width !== undefined && constraints.size.height !== undefined) {
          bounds.height = bounds.width / constraints.size.aspect;
        }
        // If only width is specified, calculate height
        else if (constraints.size.width !== undefined) {
          bounds.height = bounds.width / constraints.size.aspect;
        }
        // If only height is specified, calculate width
        else if (constraints.size.height !== undefined) {
          bounds.width = bounds.height * constraints.size.aspect;
        }
      }
    }
    
    // Calculate position after size to account for alignment
    if (constraints.position) {
      // Calculate X position
      if (constraints.position.x !== undefined) {
        if (typeof constraints.position.x === 'number') {
          bounds.x = constraints.position.x;
        } else if (constraints.position.x.percentage !== undefined) {
          bounds.x = (constraints.position.x.percentage / 100) * this.width;
        }
        
        // Apply alignment if specified
        if (constraints.position.align) {
          switch (constraints.position.align) {
            case 'start':
              // No adjustment needed, already at start
              break;
            case 'center':
              bounds.x -= bounds.width / 2;
              break;
            case 'end':
              bounds.x -= bounds.width;
              break;
          }
        }
      }
      
      // Calculate Y position
      if (constraints.position.y !== undefined) {
        if (typeof constraints.position.y === 'number') {
          bounds.y = constraints.position.y;
        } else if (constraints.position.y.percentage !== undefined) {
          bounds.y = (constraints.position.y.percentage / 100) * this.height;
        }
        
        // Apply alignment if specified (assuming Y alignment follows same logic as X)
        if (constraints.position.align) {
          switch (constraints.position.align) {
            case 'start':
              // No adjustment needed, already at start
              break;
            case 'center':
              bounds.y -= bounds.height / 2;
              break;
            case 'end':
              bounds.y -= bounds.height;
              break;
          }
        }
      }
    }
    
    // Apply margin
    if (constraints.margin !== undefined) {
      if (typeof constraints.margin === 'number') {
        // Uniform margin
        bounds.x += constraints.margin;
        bounds.y += constraints.margin;
        bounds.width -= constraints.margin * 2;
        bounds.height -= constraints.margin * 2;
      } else {
        // Individual margins
        if (constraints.margin.left !== undefined) {
          bounds.x += constraints.margin.left;
          bounds.width -= constraints.margin.left;
        }
        
        if (constraints.margin.right !== undefined) {
          bounds.width -= constraints.margin.right;
        }
        
        if (constraints.margin.top !== undefined) {
          bounds.y += constraints.margin.top;
          bounds.height -= constraints.margin.top;
        }
        
        if (constraints.margin.bottom !== undefined) {
          bounds.height -= constraints.margin.bottom;
        }
      }
    }
    
    // Ensure bounds are within canvas
    bounds.x = Math.max(0, Math.min(this.width - bounds.width, bounds.x));
    bounds.y = Math.max(0, Math.min(this.height - bounds.height, bounds.y));
    
    // Ensure positive dimensions
    bounds.width = Math.max(1, bounds.width);
    bounds.height = Math.max(1, bounds.height);
    
    return bounds;
  }
  
  /**
   * Set new canvas dimensions and recalculate if needed
   */
  setCanvasDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
  
  /**
   * Check if two elements overlap
   */
  elementsOverlap(a: CalculatedBounds, b: CalculatedBounds): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }
  
  /**
   * Calculate overlap area between two elements
   */
  calculateOverlapArea(a: CalculatedBounds, b: CalculatedBounds): number {
    if (!this.elementsOverlap(a, b)) {
      return 0;
    }
    
    const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    
    return overlapX * overlapY;
  }
  
  /**
   * Resolve overlaps by adjusting element positions
   */
  resolveOverlaps(elements: LayoutElement[]): LayoutElement[] {
    const result = [...elements];
    
    // Sort by z-index (if available) or by order in array
    result.sort((a, b) => {
      const zIndexA = a.constraints.zIndex ?? 0;
      const zIndexB = b.constraints.zIndex ?? 0;
      return zIndexA - zIndexB;
    });
    
    // Check each pair of elements for overlap
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        if (this.elementsOverlap(result[i].bounds, result[j].bounds)) {
          // Resolve overlap by moving the higher z-index element
          this.adjustElementPosition(result[j], result[i]);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Adjust element position to avoid overlap
   */
  private adjustElementPosition(element: LayoutElement, obstacle: LayoutElement): void {
    // Calculate the overlap area in different directions
    const bounds = element.bounds;
    
    // Try moving in different directions and choose the one with least movement
    const moves = [
      { dx: obstacle.bounds.x + obstacle.bounds.width - bounds.x, dy: 0 }, // Move right
      { dx: obstacle.bounds.x - (bounds.x + bounds.width), dy: 0 }, // Move left
      { dx: 0, dy: obstacle.bounds.y + obstacle.bounds.height - bounds.y }, // Move down
      { dx: 0, dy: obstacle.bounds.y - (bounds.y + bounds.height) } // Move up
    ];
    
    // Find the move with the smallest magnitude
    let bestMove = moves[0];
    let bestDistance = Math.sqrt(bestMove.dx * bestMove.dx + bestMove.dy * bestMove.dy);
    
    for (let i = 1; i < moves.length; i++) {
      const distance = Math.sqrt(moves[i].dx * moves[i].dx + moves[i].dy * moves[i].dy);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMove = moves[i];
      }
    }
    
    // Apply the move
    bounds.x += bestMove.dx;
    bounds.y += bestMove.dy;
    
    // Ensure the element stays within canvas bounds
    bounds.x = Math.max(0, Math.min(this.width - bounds.width, bounds.x));
    bounds.y = Math.max(0, Math.min(this.height - bounds.height, bounds.y));
  }
}

export default ConstraintLayoutEngine; 
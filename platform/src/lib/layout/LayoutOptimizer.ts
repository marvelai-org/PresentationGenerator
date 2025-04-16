/**
 * LayoutOptimizer - Evaluates and scores different layout arrangements
 * 
 * This optimizer works with the ConstraintLayoutEngine to find the best 
 * layout for a given set of content and constraints.
 */

import { LayoutElement, LayoutSolution, ConstraintLayoutEngine } from './ConstraintLayoutEngine';
import { Position } from '@/components/features/templates/utils/positioningUtils';
import { ContentPriority } from './ContentAdaptationEngine';

// Scoring weights for different aspects of layout quality
interface ScoringWeights {
  readability: number;   // How easy the content is to read (spacing, font sizes)
  visualBalance: number; // Visual balance and distribution of elements
  hierarchy: number;     // How well the information hierarchy is preserved
  whitespace: number;    // Appropriate use of whitespace
  alignment: number;     // Alignment of elements with each other
  overflow: number;      // Penalty for content overflow
}

// Default scoring weights
const DEFAULT_WEIGHTS: ScoringWeights = {
  readability: 1.5,
  visualBalance: 1.0,
  hierarchy: 1.2,
  whitespace: 0.8,
  alignment: 1.0,
  overflow: 2.0 // Heavy penalty for overflow
};

// Design rule violation types
export type DesignRuleViolation = 
  | 'overflow'           // Content exceeds boundaries
  | 'crowding'           // Elements too close together
  | 'poorAlignment'      // Elements not properly aligned
  | 'inconsistentSpacing' // Spacing between elements is inconsistent
  | 'poorContrast'       // Insufficient contrast for readability
  | 'hierarchyViolation'; // Important elements not properly emphasized

// Layout evaluation result
export interface LayoutEvaluation {
  score: number;           // Overall score (0-100)
  categoryScores: Record<keyof ScoringWeights, number>; // Scores by category
  violations: DesignRuleViolation[]; // Design rule violations
  recommendations: string[]; // Suggestions for improvement
}

/**
 * Optimizes layouts by evaluating and scoring different arrangements
 */
export class LayoutOptimizer {
  private weights: ScoringWeights;
  private layoutEngine: ConstraintLayoutEngine;
  private candidateLayouts: LayoutSolution[] = [];
  private fallbackLayouts: LayoutSolution[] = [];
  private contentPriorities: Map<string, ContentPriority> = new Map();
  
  constructor(
    layoutEngine: ConstraintLayoutEngine,
    weights: Partial<ScoringWeights> = {}
  ) {
    this.layoutEngine = layoutEngine;
    this.weights = { ...DEFAULT_WEIGHTS, ...weights };
  }
  
  /**
   * Sets the priority of a content element
   */
  setContentPriority(elementId: string, priority: ContentPriority): this {
    this.contentPriorities.set(elementId, priority);
    return this;
  }
  
  /**
   * Adds a candidate layout to evaluate
   */
  addCandidateLayout(layout: LayoutSolution): this {
    this.candidateLayouts.push(layout);
    return this;
  }
  
  /**
   * Adds a fallback layout to use if no candidate meets requirements
   */
  addFallbackLayout(layout: LayoutSolution): this {
    this.fallbackLayouts.push(layout);
    return this;
  }
  
  /**
   * Generates multiple layout variations to evaluate
   */
  generateLayoutVariations(count: number = 5): this {
    // Start with the base solution from the constraint engine
    const baseSolution = this.layoutEngine.solveLayout();
    this.addCandidateLayout(baseSolution);
    
    // Generate variations by adjusting constraints and solving again
    for (let i = 0; i < count - 1; i++) {
      const variation = this.createLayoutVariation(i);
      this.addCandidateLayout(variation);
    }
    
    return this;
  }
  
  /**
   * Creates a layout variation by adjusting constraints
   */
  private createLayoutVariation(variationIndex: number): LayoutSolution {
    // This is a placeholder implementation
    // In a real implementation, we would modify the constraint engine's
    // constraints and then solve again
    
    // For now, just return a slightly modified version of the first layout
    const baseSolution = this.candidateLayouts[0];
    
    if (!baseSolution) {
      // If no base solution exists, generate one
      return this.layoutEngine.solveLayout();
    }
    
    // Create a copy of the elements Map
    const elements = new Map(baseSolution.elements);
    
    // Modify some positions slightly
    for (const [id, position] of elements.entries()) {
      // Apply a small random offset based on the variation index
      const offsetX = (variationIndex % 3) * 10 - 15; // Range: -15 to +15
      const offsetY = Math.floor(variationIndex / 3) * 10 - 15; // Range: -15 to +15
      
      elements.set(id, {
        ...position,
        x: Math.max(0, position.x + offsetX),
        y: Math.max(0, position.y + offsetY)
      });
    }
    
    // Calculate new score and other properties
    return {
      elements,
      score: baseSolution.score - (variationIndex * 0.1), // Slightly reduce score
      overflowElements: [...baseSolution.overflowElements],
      unusedSpace: baseSolution.unusedSpace
    };
  }
  
  /**
   * Evaluates all candidate layouts and returns the best one
   */
  findBestLayout(): { layout: LayoutSolution; evaluation: LayoutEvaluation } {
    if (this.candidateLayouts.length === 0) {
      this.generateLayoutVariations();
    }
    
    let bestLayout = this.candidateLayouts[0];
    let bestEvaluation = this.evaluateLayout(bestLayout);
    
    // Evaluate all candidate layouts
    for (let i = 1; i < this.candidateLayouts.length; i++) {
      const layout = this.candidateLayouts[i];
      const evaluation = this.evaluateLayout(layout);
      
      if (evaluation.score > bestEvaluation.score) {
        bestLayout = layout;
        bestEvaluation = evaluation;
      }
    }
    
    // If best layout has critical violations, try fallbacks
    if (this.hasCriticalViolations(bestEvaluation) && this.fallbackLayouts.length > 0) {
      let bestFallback = this.fallbackLayouts[0];
      let bestFallbackEval = this.evaluateLayout(bestFallback);
      
      // Find the best fallback
      for (let i = 1; i < this.fallbackLayouts.length; i++) {
        const fallback = this.fallbackLayouts[i];
        const evaluation = this.evaluateLayout(fallback);
        
        if (evaluation.score > bestFallbackEval.score) {
          bestFallback = fallback;
          bestFallbackEval = evaluation;
        }
      }
      
      // If the fallback is significantly better in terms of critical violations,
      // use it instead
      if (!this.hasCriticalViolations(bestFallbackEval) || 
          bestFallbackEval.score > bestEvaluation.score * 0.8) {
        return { layout: bestFallback, evaluation: bestFallbackEval };
      }
    }
    
    return { layout: bestLayout, evaluation: bestEvaluation };
  }
  
  /**
   * Determines if an evaluation has critical violations
   */
  private hasCriticalViolations(evaluation: LayoutEvaluation): boolean {
    // Consider overflow a critical violation
    return evaluation.violations.includes('overflow');
  }
  
  /**
   * Evaluates a layout and returns a detailed evaluation
   */
  evaluateLayout(layout: LayoutSolution): LayoutEvaluation {
    // Initialize category scores
    const categoryScores: Record<keyof ScoringWeights, number> = {
      readability: 0,
      visualBalance: 0,
      hierarchy: 0,
      whitespace: 0,
      alignment: 0,
      overflow: 0
    };
    
    // Initialize violations list
    const violations: DesignRuleViolation[] = [];
    
    // Initialize recommendations
    const recommendations: string[] = [];
    
    // Evaluate readability
    categoryScores.readability = this.evaluateReadability(layout);
    
    // Evaluate visual balance
    categoryScores.visualBalance = this.evaluateVisualBalance(layout);
    
    // Evaluate information hierarchy
    categoryScores.hierarchy = this.evaluateHierarchy(layout);
    
    // Evaluate whitespace
    categoryScores.whitespace = this.evaluateWhitespace(layout);
    
    // Evaluate alignment
    categoryScores.alignment = this.evaluateAlignment(layout);
    
    // Check for overflow
    categoryScores.overflow = this.evaluateOverflow(layout);
    
    // Add violations based on low category scores
    if (categoryScores.readability < 60) {
      violations.push('poorContrast');
      recommendations.push('Increase spacing between text elements to improve readability');
    }
    
    if (categoryScores.whitespace < 50) {
      violations.push('crowding');
      recommendations.push('Add more whitespace between elements to reduce crowding');
    }
    
    if (categoryScores.alignment < 60) {
      violations.push('poorAlignment');
      recommendations.push('Improve alignment of elements along common axes');
    }
    
    if (categoryScores.overflow < 80) {
      violations.push('overflow');
      recommendations.push('Content is overflowing its container - consider reducing content or increasing container size');
    }
    
    if (categoryScores.hierarchy < 70) {
      violations.push('hierarchyViolation');
      recommendations.push('Ensure important elements have visual prominence through size and position');
    }
    
    // Calculate weighted score
    let totalWeights = 0;
    let weightedSum = 0;
    
    for (const category in categoryScores) {
      const typedCategory = category as keyof ScoringWeights;
      const weight = this.weights[typedCategory];
      totalWeights += weight;
      weightedSum += categoryScores[typedCategory] * weight;
    }
    
    const score = Math.round(weightedSum / totalWeights);
    
    return {
      score,
      categoryScores,
      violations,
      recommendations
    };
  }
  
  /**
   * Evaluates the readability of a layout
   */
  private evaluateReadability(layout: LayoutSolution): number {
    let score = 100;
    
    // Check text elements for appropriate size and spacing
    // This is a simplified implementation
    const elements = Array.from(layout.elements.entries());
    const textElements = elements.filter(([id, _]) => id.includes('text') || id.includes('title'));
    
    // Penalize for small text elements
    for (const [id, position] of textElements) {
      // Assume smaller than 200px width for text is hard to read
      if (position.width < 200) {
        score -= (200 - position.width) / 4;
      }
      
      // Assume text elements that are too narrow are hard to read
      if (position.width < position.height / 3) {
        score -= 10;
      }
    }
    
    // Penalize for overlapping text elements
    for (let i = 0; i < textElements.length; i++) {
      for (let j = i + 1; j < textElements.length; j++) {
        const [id1, pos1] = textElements[i];
        const [id2, pos2] = textElements[j];
        
        if (this.doPositionsOverlap(pos1, pos2)) {
          score -= 30; // Major readability issue
        }
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Evaluates the visual balance of a layout
   */
  private evaluateVisualBalance(layout: LayoutSolution): number {
    let score = 100;
    const positions = Array.from(layout.elements.values());
    
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
    
    // Calculate distance from ideal center (assume slide is 800×450)
    const idealX = 400;
    const idealY = 225;
    
    const offsetX = Math.abs(centerX - idealX);
    const offsetY = Math.abs(centerY - idealY);
    
    // Penalize for being off-center
    score -= (offsetX / 4) + (offsetY / 2);
    
    // Check for uneven distribution of elements
    const leftCount = positions.filter(p => p.x + p.width / 2 < idealX).length;
    const rightCount = positions.filter(p => p.x + p.width / 2 >= idealX).length;
    const topCount = positions.filter(p => p.y + p.height / 2 < idealY).length;
    const bottomCount = positions.filter(p => p.y + p.height / 2 >= idealY).length;
    
    // Penalize for uneven distribution
    score -= Math.abs(leftCount - rightCount) * 5;
    score -= Math.abs(topCount - bottomCount) * 5;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Evaluates the information hierarchy of a layout
   */
  private evaluateHierarchy(layout: LayoutSolution): number {
    let score = 100;
    
    // Get all elements with their positions
    const elements = Array.from(layout.elements.entries());
    
    // Check if higher priority elements have visual prominence
    for (const [id1, pos1] of elements) {
      for (const [id2, pos2] of elements) {
        if (id1 === id2) continue;
        
        const priority1 = this.contentPriorities.get(id1) || ContentPriority.MEDIUM;
        const priority2 = this.contentPriorities.get(id2) || ContentPriority.MEDIUM;
        
        // If element 1 has higher priority but element 2 has more visual prominence,
        // penalize the score
        if (priority1 > priority2) {
          const area1 = pos1.width * pos1.height;
          const area2 = pos2.width * pos2.height;
          
          // Higher priority elements should generally be larger
          if (area1 < area2 * 0.8) {
            score -= 10 * (priority1 - priority2);
          }
          
          // Higher priority elements should be higher in the layout
          if (pos1.y > pos2.y + pos2.height) {
            score -= 5 * (priority1 - priority2);
          }
        }
      }
    }
    
    // Check if the title (if any) is at the top
    const titleElement = elements.find(([id, _]) => id.includes('title'));
    if (titleElement) {
      const [_, titlePos] = titleElement;
      
      // Title should generally be at the top
      if (titlePos.y > 100) {
        score -= 20;
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Evaluates the use of whitespace in a layout
   */
  private evaluateWhitespace(layout: LayoutSolution): number {
    let score = 100;
    
    // Calculate total slide area (assume 800×450)
    const totalArea = 800 * 450;
    
    // Calculate total element area
    let elementArea = 0;
    for (const position of layout.elements.values()) {
      elementArea += position.width * position.height;
    }
    
    // Calculate whitespace percentage
    const whitespacePercent = (totalArea - elementArea) / totalArea * 100;
    
    // Ideal whitespace is around 30-40%
    if (whitespacePercent < 20) {
      score -= (20 - whitespacePercent) * 2; // Too crowded
    } else if (whitespacePercent > 60) {
      score -= (whitespacePercent - 60); // Too empty
    }
    
    // Check for minimum spacing between elements
    const positions = Array.from(layout.elements.values());
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const pos1 = positions[i];
        const pos2 = positions[j];
        
        // Calculate the minimum distance between elements
        const distance = this.calculateMinDistance(pos1, pos2);
        
        // Penalize for elements that are too close together
        if (distance < 10) {
          score -= (10 - distance) * 2;
        }
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Evaluates the alignment of elements in a layout
   */
  private evaluateAlignment(layout: LayoutSolution): number {
    let score = 100;
    
    const positions = Array.from(layout.elements.values());
    const xCoordinates = new Set<number>();
    const yCoordinates = new Set<number>();
    const rightEdges = new Set<number>();
    const bottomEdges = new Set<number>();
    
    // Collect all x, y coordinates and edges
    for (const pos of positions) {
      xCoordinates.add(pos.x);
      yCoordinates.add(pos.y);
      rightEdges.add(pos.x + pos.width);
      bottomEdges.add(pos.y + pos.height);
    }
    
    // Count alignments
    let alignmentCount = 0;
    let totalPossibleAlignments = positions.length * 4; // Each element can align on 4 edges
    
    for (const pos of positions) {
      if (xCoordinates.has(pos.x)) alignmentCount++;
      if (yCoordinates.has(pos.y)) alignmentCount++;
      if (rightEdges.has(pos.x + pos.width)) alignmentCount++;
      if (bottomEdges.has(pos.y + pos.height)) alignmentCount++;
    }
    
    // Calculate alignment percentage
    const alignmentPercent = (alignmentCount / totalPossibleAlignments) * 100;
    
    // Score based on alignment percentage
    if (alignmentPercent < 50) {
      score -= (50 - alignmentPercent);
    }
    
    // Check for near-misses in alignment
    for (const pos of positions) {
      // Check for x coordinate near-misses
      for (const x of xCoordinates) {
        if (Math.abs(pos.x - x) <= 5 && pos.x !== x) {
          score -= 5; // Penalize near-misses
        }
      }
      
      // Check for y coordinate near-misses
      for (const y of yCoordinates) {
        if (Math.abs(pos.y - y) <= 5 && pos.y !== y) {
          score -= 5;
        }
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Evaluates content overflow in a layout
   */
  private evaluateOverflow(layout: LayoutSolution): number {
    const score = 100 - (layout.overflowElements.length * 25);
    return Math.max(0, score);
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
   * Calculates the minimum distance between two elements
   */
  private calculateMinDistance(pos1: Position, pos2: Position): number {
    // If elements overlap, distance is 0
    if (this.doPositionsOverlap(pos1, pos2)) {
      return 0;
    }
    
    // Calculate horizontal and vertical distances
    let dx = 0;
    let dy = 0;
    
    // Horizontal distance
    if (pos1.x + pos1.width < pos2.x) {
      dx = pos2.x - (pos1.x + pos1.width); // pos1 is to the left of pos2
    } else if (pos2.x + pos2.width < pos1.x) {
      dx = pos1.x - (pos2.x + pos2.width); // pos2 is to the left of pos1
    }
    
    // Vertical distance
    if (pos1.y + pos1.height < pos2.y) {
      dy = pos2.y - (pos1.y + pos1.height); // pos1 is above pos2
    } else if (pos2.y + pos2.height < pos1.y) {
      dy = pos1.y - (pos2.y + pos2.height); // pos2 is above pos1
    }
    
    // Return the minimum of the two distances
    if (dx === 0) return dy;
    if (dy === 0) return dx;
    return Math.min(dx, dy);
  }
}

export default LayoutOptimizer; 
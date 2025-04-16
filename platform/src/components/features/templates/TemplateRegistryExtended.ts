/**
 * Extended Template Registry that integrates the automated layout system
 * into the existing template registry.
 */

import templateRegistry, { 
  TemplateRegistration, 
  TemplateSlot 
} from './TemplateRegistry';
import AutomatedLayoutSystem from '@/lib/layout';
import { ContentRequirements } from './layout/DynamicLayoutEngine';
import { Template } from './components/Template';
import React from 'react';
import DynamicTemplate from './components/DynamicTemplate';

/**
 * Extension of the template registry with automated layout generation capabilities
 */
class TemplateRegistryExtended {
  private layoutSystem: AutomatedLayoutSystem;
  private dynamicTemplates: Map<string, TemplateRegistration> = new Map();
  
  constructor() {
    this.layoutSystem = new AutomatedLayoutSystem();
  }
  
  /**
   * Gets the base template registry
   */
  getBaseRegistry() {
    return templateRegistry;
  }
  
  /**
   * Registers a template in the base registry
   */
  register(template: TemplateRegistration): void {
    templateRegistry.register(template);
  }
  
  /**
   * Gets a template by type
   */
  getTemplate(type: string): TemplateRegistration | undefined {
    // First check dynamic templates
    if (this.dynamicTemplates.has(type)) {
      return this.dynamicTemplates.get(type);
    }
    
    // Then check the base registry
    return templateRegistry.getTemplate(type);
  }
  
  /**
   * Gets all registered templates
   */
  getAllTemplates(): TemplateRegistration[] {
    const baseTemplates = templateRegistry.getAllTemplates();
    const dynamicTemplatesList = Array.from(this.dynamicTemplates.values());
    
    return [...baseTemplates, ...dynamicTemplatesList];
  }
  
  /**
   * Gets templates by category
   */
  getTemplatesByCategory(category: string): TemplateRegistration[] {
    const baseTemplates = templateRegistry.getTemplatesByCategory(category);
    const dynamicTemplates = Array.from(this.dynamicTemplates.values())
      .filter(t => t.category === category);
    
    return [...baseTemplates, ...dynamicTemplates];
  }
  
  /**
   * Gets all template types (IDs)
   */
  getTemplateIds(): string[] {
    const baseTemplateIds = this.getAllTemplates().map(t => t.type);
    const dynamicTemplateIds = Array.from(this.dynamicTemplates.keys());
    
    return [...baseTemplateIds, ...dynamicTemplateIds];
  }
  
  /**
   * Generates a template dynamically based on content
   */
  generateTemplate(
    content: Record<string, any>,
    requirements?: ContentRequirements,
    options?: {
      name?: string;
      description?: string;
      category?: string;
    }
  ): string {
    // Generate a unique ID for this dynamic template
    const id = `dynamic-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    try {
      // Generate template slots using the layout system
      const templateSlots = this.layoutSystem.generateTemplate(content, requirements);
      
      // Create the template registration
      const template: TemplateRegistration = {
        type: id,
        name: options?.name || 'Dynamic Template',
        description: options?.description || 'Automatically generated template',
        component: DynamicTemplate,
        thumbnail: '',
        defaultData: content,
        slots: templateSlots,
        category: options?.category || 'Dynamic Templates'
      };
      
      // Register it in our dynamic templates map
      this.dynamicTemplates.set(id, template);
      
      // Return the template ID
      return id;
    } catch (error) {
      console.error('Failed to generate dynamic template:', error);
      return '';
    }
  }
  
  /**
   * Removes a dynamic template
   */
  removeDynamicTemplate(id: string): boolean {
    return this.dynamicTemplates.delete(id);
  }
  
  /**
   * Gets all dynamic templates
   */
  getDynamicTemplates(): TemplateRegistration[] {
    return Array.from(this.dynamicTemplates.values());
  }
  
  /**
   * Clears all dynamic templates
   */
  clearDynamicTemplates(): void {
    this.dynamicTemplates.clear();
  }
  
  /**
   * Checks if a template exists
   */
  hasTemplate(type: string): boolean {
    return this.dynamicTemplates.has(type) || !!templateRegistry.getTemplate(type);
  }
  
  /**
   * Generates and returns the best template for given content
   */
  getBestTemplateForContent(
    content: Record<string, any>,
    additionalRequirements?: ContentRequirements
  ): string {
    // Analyze content to determine its characteristics
    const requirements = this.analyzeContentRequirements(content, additionalRequirements);
    
    // Try to find a matching template in the registry
    const baseTemplates = this.getAllTemplates();
    
    // Score each template based on how well it matches the requirements
    const scoredTemplates = baseTemplates.map(template => {
      const score = this.scoreTemplateForRequirements(template, requirements);
      return { template, score };
    });
    
    // Sort by score descending
    scoredTemplates.sort((a, b) => b.score - a.score);
    
    // If we have a good match (score > 70), use that template
    if (scoredTemplates.length > 0 && scoredTemplates[0].score > 70) {
      return scoredTemplates[0].template.type;
    }
    
    // Otherwise, generate a custom template
    return this.generateTemplate(content, requirements, {
      name: 'Auto-generated Template',
      description: 'Tailored for this specific content',
      category: 'Dynamic Templates'
    });
  }
  
  /**
   * Analyzes content to determine its requirements
   */
  private analyzeContentRequirements(
    content: Record<string, any>,
    additionalRequirements?: ContentRequirements
  ): ContentRequirements {
    // Initialize requirements
    const requirements: ContentRequirements = {
      hasTitle: false,
      hasImages: false,
      imageCount: 0,
      textLength: 'medium',
      contentType: 'text',
      primaryContent: null
    };
    
    // Check for title
    const titleKey = Object.keys(content).find(key => 
      key.includes('title') || key.includes('heading')
    );
    
    if (titleKey) {
      requirements.hasTitle = true;
      requirements.title = content[titleKey];
    }
    
    // Check for images
    const imageKeys = Object.keys(content).filter(key => {
      const value = content[key];
      return typeof value === 'string' && (
        value.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) !== null || 
        value.startsWith('data:image/')
      );
    });
    
    if (imageKeys.length > 0) {
      requirements.hasImages = true;
      requirements.imageCount = imageKeys.length;
      
      // Set primary content to first image if no other primary content
      if (!requirements.primaryContent && imageKeys.length > 0) {
        requirements.primaryContent = content[imageKeys[0]];
      }
    }
    
    // Check for text content
    const textKeys = Object.keys(content).filter(key => {
      const value = content[key];
      return typeof value === 'string' && 
        key !== titleKey && 
        !imageKeys.includes(key);
    });
    
    if (textKeys.length > 0) {
      // Find the longest text
      const longestTextKey = textKeys.reduce((a, b) => 
        (content[a]?.length || 0) > (content[b]?.length || 0) ? a : b
      );
      
      // Set as primary content if no other primary content
      if (!requirements.primaryContent) {
        requirements.primaryContent = content[longestTextKey];
      }
      
      // Determine text length
      const text = content[longestTextKey] as string;
      if (text.length < 100) {
        requirements.textLength = 'short';
      } else if (text.length < 500) {
        requirements.textLength = 'medium';
      } else {
        requirements.textLength = 'long';
      }
    }
    
    // Check for list content
    const listKeys = Object.keys(content).filter(key => 
      Array.isArray(content[key]) && content[key].length > 0
    );
    
    if (listKeys.length > 0) {
      requirements.contentType = 'list';
      
      // Set as primary content if no other primary content
      if (!requirements.primaryContent) {
        requirements.primaryContent = content[listKeys[0]];
      }
    }
    
    // If we have both text and lists, set as mixed
    if (textKeys.length > 0 && listKeys.length > 0) {
      requirements.contentType = 'mixed';
    }
    
    // Override with any additional requirements
    if (additionalRequirements) {
      return { ...requirements, ...additionalRequirements };
    }
    
    return requirements;
  }
  
  /**
   * Scores a template based on how well it matches the requirements
   */
  private scoreTemplateForRequirements(
    template: TemplateRegistration,
    requirements: ContentRequirements
  ): number {
    let score = 0;
    
    // Check for title slot
    const hasTitle = template.slots.some(slot => 
      slot.id === 'title' || slot.name.toLowerCase() === 'title'
    );
    
    if (requirements.hasTitle && hasTitle) {
      score += 20;
    } else if (!requirements.hasTitle && !hasTitle) {
      score += 10;
    }
    
    // Check for image slots
    const imageSlots = template.slots.filter(slot => slot.type === 'image');
    
    if (requirements.hasImages && imageSlots.length > 0) {
      score += 20;
      
      // Bonus if template has right number of image slots
      if (imageSlots.length === requirements.imageCount) {
        score += 15;
      } else if (imageSlots.length >= requirements.imageCount) {
        score += 10;
      }
    } else if (!requirements.hasImages && imageSlots.length === 0) {
      score += 15;
    }
    
    // Check for content type
    const textSlots = template.slots.filter(slot => slot.type === 'text');
    const listSlots = template.slots.filter(slot => slot.type === 'list');
    
    if (requirements.contentType === 'text' && textSlots.length > 0) {
      score += 20;
      
      // Check for text length
      if (requirements.textLength === 'long' && 
          textSlots.some(slot => (slot.adaptiveRules?.overflowBehavior === 'scroll' || 
                                 slot.adaptiveRules?.overflowBehavior === 'shrink'))) {
        score += 15;
      }
    } else if (requirements.contentType === 'list' && listSlots.length > 0) {
      score += 25;
    } else if (requirements.contentType === 'mixed' && 
              textSlots.length > 0 && listSlots.length > 0) {
      score += 30;
    }
    
    return score;
  }
}

// Create and export a singleton instance
export const extendedRegistry = new TemplateRegistryExtended();

// Export as default
export default extendedRegistry; 
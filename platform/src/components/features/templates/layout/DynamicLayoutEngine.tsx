import React, { useState, useEffect } from 'react';
import { Template } from '../components/Template';
import { templateRegistry } from '../index';
import TemplateFactory from './TemplateFactory';
import { willContentOverflow, estimateContentDimensions } from '../utils/contentAdaptation';

// Interfaces
export interface ContentRequirements {
  hasTitle: boolean;
  hasImages: boolean;
  imageCount: number;
  textLength: 'short' | 'medium' | 'long';
  contentType: 'text' | 'list' | 'mixed';
  primaryContent: any;
  secondaryContent?: any;
  title?: string;
}

export interface DynamicLayoutEngineProps {
  content: Record<string, any>;
  onTemplateSelect?: (templateId: string) => void;
  onGenerateTemplate?: (slots: any[]) => void;
  width?: number;
  height?: number;
}

/**
 * Analyzes content to determine its characteristics
 */
export function analyzeContent(content: Record<string, any>): ContentRequirements {
  // Initialize default requirements
  const requirements: ContentRequirements = {
    hasTitle: false,
    hasImages: false,
    imageCount: 0,
    textLength: 'medium',
    contentType: 'text',
    primaryContent: null,
  };
  
  // Check for title
  if (content.title) {
    requirements.hasTitle = true;
    requirements.title = content.title;
  }
  
  // Check for images
  const imageKeys = Object.keys(content).filter(key => 
    typeof content[key] === 'string' && 
    (content[key].match(/\.(jpeg|jpg|gif|png|svg|webp)$/) !== null || 
     content[key].startsWith('data:image/'))
  );
  
  if (imageKeys.length > 0) {
    requirements.hasImages = true;
    requirements.imageCount = imageKeys.length;
    
    // If we have one main image, set it as primary content
    if (imageKeys.length === 1) {
      requirements.primaryContent = content[imageKeys[0]];
    }
  }
  
  // Check for text content and determine its length
  const textKeys = Object.keys(content).filter(key => 
    typeof content[key] === 'string' && 
    key !== 'title' && 
    !imageKeys.includes(key)
  );
  
  if (textKeys.length > 0) {
    // Use the longest text as the primary content if no image
    if (!requirements.primaryContent) {
      const longestKey = textKeys.reduce((a, b) => 
        content[a].length > content[b].length ? a : b
      );
      requirements.primaryContent = content[longestKey];
      
      // Determine text length
      const textLength = content[longestKey].length;
      if (textLength < 100) {
        requirements.textLength = 'short';
      } else if (textLength < 500) {
        requirements.textLength = 'medium';
      } else {
        requirements.textLength = 'long';
      }
    } else {
      // If we already have an image as primary, use the longest text as secondary
      const longestKey = textKeys.reduce((a, b) => 
        content[a].length > content[b].length ? a : b
      );
      requirements.secondaryContent = content[longestKey];
    }
  }
  
  // Check for list content
  const listKeys = Object.keys(content).filter(key => 
    Array.isArray(content[key]) && content[key].length > 0
  );
  
  if (listKeys.length > 0) {
    requirements.contentType = 'list';
    
    // If no primary content yet, use the first list
    if (!requirements.primaryContent) {
      requirements.primaryContent = content[listKeys[0]];
    } else if (!requirements.secondaryContent) {
      requirements.secondaryContent = content[listKeys[0]];
    }
  }
  
  // If we have both text and list, mark as mixed
  if (textKeys.length > 0 && listKeys.length > 0) {
    requirements.contentType = 'mixed';
  }
  
  return requirements;
}

/**
 * Recommends the best template based on content requirements
 */
export function recommendTemplate(
  requirements: ContentRequirements,
  availableTemplates: string[]
): string {
  // Default template if nothing matches
  let bestMatch = 'ContentSlide';
  let highestScore = 0;
  
  // Score each template based on how well it matches the requirements
  for (const templateId of availableTemplates) {
    let score = 0;
    const template = templateRegistry.getTemplate(templateId);
    
    if (!template) continue;
    
    // Check available slots against content requirements
    const hasImageSlot = template.slots.some(slot => slot.type === 'image');
    const hasTitleSlot = template.slots.some(slot => slot.id === 'title');
    const hasListSlot = template.slots.some(slot => slot.type === 'list');
    const contentSlots = template.slots.filter(slot => slot.type === 'text' && slot.id !== 'title');
    
    // Score based on title
    if (requirements.hasTitle && hasTitleSlot) {
      score += 5;
    } else if (!requirements.hasTitle && !hasTitleSlot) {
      score += 3;
    }
    
    // Score based on images
    if (requirements.hasImages && hasImageSlot) {
      score += 10;
      
      // Bonus if the template can fit all images
      const imageSlots = template.slots.filter(slot => slot.type === 'image');
      if (imageSlots.length >= requirements.imageCount) {
        score += 5;
      }
    } else if (!requirements.hasImages && !hasImageSlot) {
      score += 3;
    }
    
    // Score based on content type
    if (requirements.contentType === 'list' && hasListSlot) {
      score += 10;
    } else if (requirements.contentType === 'text' && contentSlots.length > 0) {
      score += 8;
      
      // Bonus if there's enough space for the text
      if (requirements.textLength === 'long' && 
          contentSlots.some(slot => slot.adaptiveRules?.overflowBehavior === 'scroll')) {
        score += 5;
      } else if (requirements.textLength === 'medium' && contentSlots.length >= 1) {
        score += 3;
      } else if (requirements.textLength === 'short') {
        score += 2;
      }
    } else if (requirements.contentType === 'mixed' && 
              hasListSlot && contentSlots.length > 0) {
      score += 15; // Best score for a template that can handle mixed content
    }
    
    // Update best match if this template has a higher score
    if (score > highestScore) {
      highestScore = score;
      bestMatch = templateId;
    }
  }
  
  return bestMatch;
}

/**
 * DynamicLayoutEngine component
 * Analyzes content and suggests optimal templates or generates new ones
 */
export const DynamicLayoutEngine: React.FC<DynamicLayoutEngineProps> = ({
  content,
  onTemplateSelect,
  onGenerateTemplate,
  width = 800,
  height = 450
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [suggestedTemplate, setSuggestedTemplate] = useState<string | null>(null);
  const [contentRequirements, setContentRequirements] = useState<ContentRequirements | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<any[] | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  // Analyze content when it changes
  useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      const requirements = analyzeContent(content);
      setContentRequirements(requirements);
      
      // Get all available templates
      const availableTemplates = templateRegistry.getTemplateIds();
      
      // Recommend a template
      const recommendation = recommendTemplate(requirements, availableTemplates);
      setSuggestedTemplate(recommendation);
      setShowSuggestion(true);
      
      // Generate a custom template
      const factory = new TemplateFactory(width, height);
      const newTemplate = factory.createDynamicTemplate({
        hasTitle: requirements.hasTitle,
        hasImages: requirements.hasImages,
        imageCount: requirements.imageCount,
        textLength: requirements.textLength,
        contentType: requirements.contentType === 'list' ? 'bullets' : 
                    requirements.contentType === 'mixed' ? 'mixed' : 'text'
      });
      
      setGeneratedTemplate(newTemplate);
    }
  }, [content, width, height]);
  
  // Apply suggested template
  const applyTemplate = () => {
    if (suggestedTemplate) {
      setSelectedTemplate(suggestedTemplate);
      setShowSuggestion(false);
      if (onTemplateSelect) {
        onTemplateSelect(suggestedTemplate);
      }
    }
  };
  
  // Apply generated template
  const applyGeneratedTemplate = () => {
    if (generatedTemplate && onGenerateTemplate) {
      onGenerateTemplate(generatedTemplate);
      setShowSuggestion(false);
    }
  };
  
  // Dismiss suggestion
  const dismissSuggestion = () => {
    setShowSuggestion(false);
  };
  
  // Map content to template slots
  const mapContentToTemplate = () => {
    if (!selectedTemplate || !contentRequirements) return {};
    
    const template = templateRegistry.getTemplate(selectedTemplate);
    if (!template) return {};
    
    const mappedContent: Record<string, any> = {};
    
    // Map title if available
    if (contentRequirements.hasTitle && contentRequirements.title) {
      const titleSlot = template.slots.find(slot => slot.id === 'title');
      if (titleSlot) {
        mappedContent[titleSlot.id] = contentRequirements.title;
      }
    }
    
    // Map primary content
    if (contentRequirements.primaryContent) {
      // Find appropriate slot based on content type
      let primarySlotId: string | null = null;
      
      if (contentRequirements.hasImages && contentRequirements.imageCount > 0) {
        // It's an image, find image slot
        const imageSlot = template.slots.find(slot => slot.type === 'image');
        if (imageSlot) primarySlotId = imageSlot.id;
      } else if (contentRequirements.contentType === 'list') {
        // It's a list, find list slot
        const listSlot = template.slots.find(slot => slot.type === 'list');
        if (listSlot) primarySlotId = listSlot.id;
      } else {
        // It's text, find main content slot
        const contentSlots = template.slots.filter(
          slot => slot.type === 'text' && slot.id !== 'title'
        );
        if (contentSlots.length > 0) primarySlotId = contentSlots[0].id;
      }
      
      if (primarySlotId) {
        mappedContent[primarySlotId] = contentRequirements.primaryContent;
      }
    }
    
    // Map secondary content if available
    if (contentRequirements.secondaryContent) {
      const usedSlots = Object.keys(mappedContent);
      // Find an unused slot of appropriate type
      let secondarySlotId: string | null = null;
      
      const potentialSlots = template.slots.filter(
        slot => !usedSlots.includes(slot.id) && 
        (contentRequirements.contentType === 'list' ? 
          slot.type === 'list' : slot.type === 'text')
      );
      
      if (potentialSlots.length > 0) {
        secondarySlotId = potentialSlots[0].id;
      }
      
      if (secondarySlotId) {
        mappedContent[secondarySlotId] = contentRequirements.secondaryContent;
      }
    }
    
    return mappedContent;
  };
  
  // If no content, render nothing
  if (!content || Object.keys(content).length === 0) {
    return null;
  }
  
  return (
    <div className="dynamic-layout-engine">
      {showSuggestion && suggestedTemplate && (
        <div className="template-suggestion">
          <p>Suggested template: {suggestedTemplate}</p>
          <div className="template-actions">
            <button onClick={applyTemplate}>Use this template</button>
            <button onClick={applyGeneratedTemplate}>Use custom template</button>
            <button onClick={dismissSuggestion}>Dismiss</button>
          </div>
        </div>
      )}
      
      {selectedTemplate && (
        <Template 
          templateId={selectedTemplate} 
          content={mapContentToTemplate()} 
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default DynamicLayoutEngine; 
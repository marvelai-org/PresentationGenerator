import { Slide, SlideContentItem } from '../EditorContainer';
import templateRegistry, { TemplateRegistration, TemplateSlot } from '../../../features/templates/TemplateRegistry';

/**
 * Adapts a template from the TemplateRegistry into a slide format
 * for use in the editor.
 */
export function templateToSlide(templateId: string): Slide | null {
  const template = templateRegistry.getTemplate(templateId as any);
  
  if (!template) {
    console.warn(`Template ${templateId} not found in registry`);
    return null;
  }
  
  // Create base slide from template
  const slide: Slide = {
    id: Date.now(),
    title: template.name,
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [],
    templateId: templateId,
    templateData: { ...template.defaultData }
  };
  
  // Convert template slots to slide content items
  template.slots.forEach(slot => {
    const contentItem = slotToContentItem(slot, template.defaultData?.[slot.id]);
    if (contentItem) {
      slide.content.push(contentItem);
    }
  });
  
  return slide;
}

/**
 * Converts a template slot to a slide content item
 */
function slotToContentItem(slot: TemplateSlot, defaultContent: any): SlideContentItem | null {
  // Map template slot types to slide content types
  const typeMap: Record<string, SlideContentItem['type']> = {
    'text': 'text',
    'image': 'image',
    'chart': 'chart',
    'video': 'video',
    'shape': 'shape',
    'list': 'text', // Convert list to text with bullet points
  };
  
  const contentType = typeMap[slot.type] || 'text';
  
  // Process content based on type
  let processedContent = defaultContent;
  
  // For lists, convert array to bullet points if needed
  if (slot.type === 'list' && Array.isArray(defaultContent)) {
    processedContent = defaultContent.map(item => `• ${item}`).join('\n');
  }
  
  return {
    id: `content-${slot.id}-${Date.now()}`,
    type: contentType,
    value: processedContent || slot.defaultContent || '',
    x: slot.position.x,
    y: slot.position.y,
    style: {
      width: slot.position.width,
      height: slot.position.height
    }
  };
}

/**
 * Get preview data for a template 
 */
export function getTemplatePreview(templateId: string): {
  thumbnail?: string;
  name: string;
  description: string;
} {
  const template = templateRegistry.getTemplate(templateId as any);
  
  if (!template) {
    return {
      name: 'Unknown Template',
      description: 'Template not found',
    };
  }
  
  return {
    thumbnail: template.thumbnail,
    name: template.name,
    description: template.description,
  };
}

export default {
  templateToSlide,
  getTemplatePreview,
}; 
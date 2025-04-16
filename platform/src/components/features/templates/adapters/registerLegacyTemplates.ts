import { SlideLayout } from '@/store/slices/slides';
import templateRegistry from '../TemplateRegistry';
import LegacyTemplateAdapter, { convertLegacyLayoutToSlots } from './LegacyTemplateAdapter';

// Import slide layouts from your existing store
import { slideLayouts } from '@/store/slices/slides';

/**
 * Registers all existing slide layouts as templates in the new system
 * This allows using the legacy layouts with the new template components
 */
export const registerLegacyTemplates = () => {
  // Get all layout types from your existing implementation
  const layoutTypes = Object.keys(slideLayouts) as SlideLayout[];
  
  // Map layout types to human-readable names
  const layoutNames: Record<SlideLayout, string> = {
    'title': 'Title Slide',
    'content': 'Content Slide',
    'title-content': 'Title with Content',
    'image': 'Image Only',
    'title-image': 'Title with Image',
    'image-content': 'Image with Content',
    'content-image': 'Content with Image',
    'two-columns': 'Two Columns',
    'quote': 'Quote Slide',
    'blank': 'Blank Slide'
  };
  
  // Map layout types to descriptions
  const layoutDescriptions: Record<SlideLayout, string> = {
    'title': 'A slide with a title and subtitle for presentation covers',
    'content': 'A simple slide with content only',
    'title-content': 'A slide with a title and content area below',
    'image': 'A slide with a full image',
    'title-image': 'A slide with a title and image below',
    'image-content': 'A slide with an image on the left and content on the right',
    'content-image': 'A slide with content on the left and an image on the right',
    'two-columns': 'A slide with two equal columns of content',
    'quote': 'A slide designed for quotes with author attribution',
    'blank': 'An empty slide with no predefined elements'
  };
  
  // Register each layout as a template
  layoutTypes.forEach(layoutType => {
    const elements = slideLayouts[layoutType];
    
    templateRegistry.register({
      type: `legacy-${layoutType}`,
      name: layoutNames[layoutType] || `Legacy ${layoutType}`,
      description: layoutDescriptions[layoutType] || `Legacy ${layoutType} slide layout`,
      component: props => LegacyTemplateAdapter({
        ...props,
        layoutType,
        elements
      }),
      defaultData: {},
      slots: convertLegacyLayoutToSlots(layoutType, elements),
      category: 'Legacy Layouts'
    });
  });
};

export default registerLegacyTemplates; 
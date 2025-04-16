import templateRegistry from './TemplateRegistry';
import TitleSlide from './components/TitleSlide';
import ContentSlide from './components/ContentSlide';
import ImageContentSlide from './components/ImageContentSlide';
import registerLegacyTemplates from './adapters/registerLegacyTemplates';

// Register all templates
templateRegistry.register({
  type: 'title',
  name: 'Title Slide',
  description: 'A slide with a title and subtitle',
  component: TitleSlide,
  defaultData: {
    title: 'Presentation Title',
    subtitle: 'Subtitle goes here',
  },
  slots: [
    {
      id: 'title',
      name: 'Title',
      type: 'text',
      required: true,
      position: { x: 120, y: 180, width: 600, height: 120 },
      defaultContent: 'Presentation Title',
      adaptiveRules: {
        minFontSize: 32,
        maxFontSize: 64,
        autoScale: true,
        overflowBehavior: 'shrink',
      }
    },
    {
      id: 'subtitle',
      name: 'Subtitle',
      type: 'text',
      required: false,
      position: { x: 160, y: 320, width: 520, height: 60 },
      defaultContent: 'Subtitle or Author',
      adaptiveRules: {
        minFontSize: 18,
        maxFontSize: 32,
        overflowBehavior: 'truncate',
      }
    }
  ],
  category: 'Basic'
});

templateRegistry.register({
  type: 'content',
  name: 'Content Slide',
  description: 'A slide with a title and content area',
  component: ContentSlide,
  defaultData: {
    title: 'Slide Title',
    content: 'Content goes here...',
  },
  slots: [
    {
      id: 'title',
      name: 'Title',
      type: 'text',
      required: true,
      position: { x: 60, y: 40, width: 680, height: 80 },
      defaultContent: 'Slide Title',
      adaptiveRules: {
        minFontSize: 24,
        maxFontSize: 42,
        autoScale: true,
        overflowBehavior: 'shrink',
      }
    },
    {
      id: 'content',
      name: 'Content',
      type: 'text',
      required: true,
      position: { x: 60, y: 140, width: 680, height: 340 },
      defaultContent: 'Content goes here...',
      adaptiveRules: {
        minFontSize: 16,
        maxFontSize: 28,
        overflowBehavior: 'scroll',
      }
    }
  ],
  category: 'Basic'
});

templateRegistry.register({
  type: 'image-content',
  name: 'Image & Content',
  description: 'A slide with an image and content side by side',
  component: ImageContentSlide,
  defaultData: {
    title: 'Slide Title',
    image: '',
    content: 'Content next to image',
  },
  slots: [
    {
      id: 'title',
      name: 'Title',
      type: 'text',
      required: true,
      position: { x: 60, y: 40, width: 680, height: 60 },
      defaultContent: 'Slide Title',
      adaptiveRules: {
        minFontSize: 24,
        maxFontSize: 42,
        autoScale: true,
        overflowBehavior: 'shrink',
      }
    },
    {
      id: 'image',
      name: 'Image',
      type: 'image',
      required: false,
      position: { x: 60, y: 120, width: 300, height: 300 },
      defaultContent: '',
    },
    {
      id: 'content',
      name: 'Content',
      type: 'text',
      required: true,
      position: { x: 400, y: 120, width: 340, height: 300 },
      defaultContent: 'Content next to image',
      adaptiveRules: {
        minFontSize: 16,
        maxFontSize: 28,
        overflowBehavior: 'scroll',
      }
    }
  ],
  category: 'Content with Media'
});

// Register legacy templates
try {
  registerLegacyTemplates();
} catch (error) {
  console.warn('Error registering legacy templates:', error);
}

// Export components for direct use
export { default as Template } from './Template';
export { default as ContentSlot } from './slots/ContentSlot';
export { default as LegacyTemplateAdapter } from './adapters/LegacyTemplateAdapter';
export { default as TemplatePreview } from './demo/TemplatePreview';

// Export the registry for use in other parts of the application
export default templateRegistry; 
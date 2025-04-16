'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  Button,
  Tabs,
  Tab,
  Slider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@heroui/react';

// Update the Slide and SlideContentItem interfaces to include all needed properties
interface SlideStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
}

interface SlideContentItem {
  id: string;
  type: 'image' | 'table' | 'video' | 'text' | 'shape' | 'chart' | 'list';
  value: string | string[];
  x: number;
  y: number;
  width: number;
  height: number;
  style?: SlideStyle;
}

interface Slide {
  id: number;
  title: string;
  backgroundColor: string;
  content: SlideContentItem[];
  subtitle?: string;
  author?: string;
  editedTime?: string;
  image?: string;
  gradient?: string;
  textColor: string;
  shapes?: any[];
}

// Import components without the conflicting TemplateType
import {
  TwoColumnWithTitle,
  TitleWithBulletsAndImage,
} from '@/components/features/application/editor/templates';

// Define local templates for the preview page
const slideTemplates: Record<string, Partial<Slide>> = {
  title: {
    title: 'Presentation Title',
    subtitle: 'Your subtitle goes here',
    backgroundColor: '#1a0e2e',
    gradient: 'linear-gradient(135deg, #1a0e2e 0%, #433b7c 100%)',
    textColor: '#ffffff',
    content: [
      {
        id: 'title-1',
        type: 'text',
        value: 'Presentation Title',
        x: 100,
        y: 150,
        width: 600,
        height: 80,
      },
      {
        id: 'subtitle-1',
        type: 'text',
        value: 'Your subtitle goes here',
        x: 100,
        y: 250,
        width: 600,
        height: 50,
      },
    ],
  },
  blankCard: {
    title: 'Blank Slide',
    backgroundColor: '#1a0e2e',
    gradient: 'linear-gradient(135deg, #1a0e2e 0%, #433b7c 100%)',
    textColor: '#ffffff',
    content: [],
  },
  imageAndText: {
    title: 'Image and Text',
    backgroundColor: '#1a0e2e',
    gradient: 'linear-gradient(135deg, #1a0e2e 0%, #433b7c 100%)',
    textColor: '#ffffff',
    content: [
      {
        id: 'image-1',
        type: 'image',
        value: 'image placeholder',
        x: 50,
        y: 120,
        width: 300,
        height: 200,
      },
      {
        id: 'text-1',
        type: 'text',
        value: 'Text description here',
        x: 400,
        y: 120,
        width: 300,
        height: 200,
      },
    ],
  },
  // Add more templates as needed
};

// Use the same TemplateType from useSlideManagement
type TemplateType =
  | 'title'
  | 'textAndImage'
  | 'bulletList'
  | 'blankCard'
  | 'imageAndText'
  | 'twoColumns'
  | 'twoColumnWithHeading'
  | 'threeColumns'
  | 'threeColumnWithHeading'
  | 'fourColumns'
  | 'titleWithBullets'
  | 'titleWithBulletsAndImage'
  | 'accentLeft'
  | 'accentRight'
  | 'accentTop'
  | 'accentRightFit'
  | 'accentLeftFit'
  | 'accentBackground'
  | 'twoImageColumns'
  | 'threeImageColumns'
  | 'fourImageColumns'
  | 'imagesWithText'
  | 'imageGallery'
  | 'teamPhotos'
  | 'textBoxes'
  | 'timeline'
  | 'largeBulletList'
  | 'iconsWithText'
  | 'smallIconsWithText'
  | 'arrows'
  | 'modernTwoColumnWithTitle'
  | 'modernTitleWithBulletsAndImage';

const LayoutsPreviewPage = () => {
  const [slides, setSlides] = React.useState<Slide[]>([]);
  // Instead of using useSlideManagement as a hook, directly reference the templates
  const [scale, setScale] = React.useState(1);
  const [selectedTemplateType, setSelectedTemplateType] = React.useState<TemplateType | null>(null);
  const [templateError, setTemplateError] = React.useState<string | null>(null);
  // Add state for fullscreen preview
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);
  const [fullscreenTemplate, setFullscreenTemplate] = React.useState<{
    type: TemplateType | null;
    isReactComponent: boolean;
  }>({
    type: null,
    isReactComponent: false,
  });

  // Group templates by category
  const templateCategories = {
    'Basic Layouts': [
      'title',
      'blankCard',
      'textAndImage',
      'imageAndText',
      'twoColumns',
      'twoColumnWithHeading',
      'threeColumns',
      'threeColumnWithHeading',
      'fourColumns',
      'titleWithBullets',
      'titleWithBulletsAndImage',
      'bulletList',
    ],
    'Modern Layouts': ['modernTwoColumnWithTitle', 'modernTitleWithBulletsAndImage'],
    'Card Layouts': [
      'accentLeft',
      'accentRight',
      'accentTop',
      'accentRightFit',
      'accentLeftFit',
      'accentBackground',
    ],
    'Image Layouts': [
      'twoImageColumns',
      'threeImageColumns',
      'fourImageColumns',
      'imagesWithText',
      'imageGallery',
      'teamPhotos',
    ],
    'Collections & Sequences': [
      'textBoxes',
      'timeline',
      'largeBulletList',
      'iconsWithText',
      'smallIconsWithText',
      'arrows',
    ],
  };

  // Function to add a slide from template
  const addSlideFromTemplate = (templateType: TemplateType) => {
    const template = slideTemplates[templateType];

    if (!template) return;

    // Create a new slide with required fields and template values
    const newSlide: Slide = {
      id: Date.now(),
      title: template.title || 'New Slide',
      backgroundColor: template.backgroundColor || '#1a0e2e',
      content: template.content || [],
      subtitle: template.subtitle,
      author: template.author,
      editedTime: template.editedTime,
      image: template.image,
      gradient: template.gradient,
      textColor: template.textColor || '#ffffff',
      shapes: template.shapes,
    };

    setSlides([...slides, newSlide]);
  };

  // Function to open fullscreen preview
  const openFullscreenPreview = (templateType: TemplateType, isReactComponent: boolean = false) => {
    setFullscreenTemplate({ type: templateType, isReactComponent });
    setIsFullscreenOpen(true);
  };

  // Function to close fullscreen preview
  const closeFullscreenPreview = () => {
    setIsFullscreenOpen(false);
  };

  // Check if templates are properly defined
  React.useEffect(() => {
    if (!slideTemplates || Object.keys(slideTemplates).length === 0) {
      setTemplateError('Template definitions are missing or not properly loaded');
    } else {
      // Verify each template exists
      let missingTemplates: string[] = [];

      Object.values(templateCategories)
        .flat()
        .forEach(template => {
          if (!slideTemplates[template as string]) {
            missingTemplates.push(template as string);
          }
        });

      if (missingTemplates.length > 0) {
        setTemplateError(`Some templates are missing: ${missingTemplates.join(', ')}`);
      }
    }
  }, [slideTemplates]);

  // Check if slideTemplates is defined early in the render
  if (!slideTemplates) {
    return (
      <div className="bg-gray-900 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Slide Layout Preview</h1>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-2">Error Loading Templates</h2>
          <p className="text-white">
            Unable to access slide templates. The hook may not be returning the slideTemplates
            object.
          </p>
          <Link className="mt-4 inline-block" href="/dashboard">
            <Button color="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render content item properly with error handling
  const renderContentItem = (item: SlideContentItem, template: Partial<Slide>) => {
    if (!item) return null;

    try {
      switch (item.type) {
        case 'text':
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                color: item.style?.color || template.textColor || '#FFFFFF',
                backgroundColor: item.style?.backgroundColor || 'transparent',
                border: item.style?.borderColor ? `1px solid ${item.style.borderColor}` : 'none',
                transform: item.style?.rotation ? `rotate(${item.style.rotation}deg)` : 'none',
                opacity: item.style?.opacity || 1,
                zIndex: item.style?.zIndex || 1,
                fontSize: '14px',
                overflow: 'hidden',
              }}
            >
              {item.value}
            </div>
          );
        case 'image':
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                backgroundColor: '#666',
                border: '1px dashed #999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: item.style?.rotation ? `rotate(${item.style.rotation}deg)` : 'none',
                opacity: item.style?.opacity || 1,
                zIndex: item.style?.zIndex || 1,
              }}
            >
              <span className="text-sm text-white">Image</span>
            </div>
          );
        case 'shape':
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                backgroundColor: item.style?.backgroundColor || '#444',
                border: item.style?.borderColor ? `1px solid ${item.style.borderColor}` : 'none',
                borderRadius: item.value === 'circle' ? '50%' : '0',
                transform: item.style?.rotation ? `rotate(${item.style.rotation}deg)` : 'none',
                opacity: item.style?.opacity || 1,
                zIndex: item.style?.zIndex || 1,
              }}
            />
          );
        case 'list':
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                color: item.style?.color || template.textColor || '#FFFFFF',
                fontSize: '14px',
              }}
            >
              <ul className="list-disc pl-5">
                {typeof item.value === 'string'
                  ? item.value.split('\\n').map((line, i) => <li key={i}>{line}</li>)
                  : Array.isArray(item.value)
                    ? item.value.map((line, i) => <li key={i}>{line}</li>)
                    : null}
              </ul>
            </div>
          );
        default:
          return (
            <div key={item.id} className="text-red-500 text-xs">
              Unknown item type: {item.type}
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering content item:', error);

      return (
        <div key={item.id} className="text-red-500 text-xs">
          Error rendering item
        </div>
      );
    }
  };

  const renderTemplatePreview = (templateType: TemplateType) => {
    // Check if templateType is valid
    if (!templateType) {
      return (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-2">Unknown Template</h3>
          <div className="w-full h-64 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
            <p className="text-red-400">Template type is undefined</p>
          </div>
        </div>
      );
    }

    // Check if template exists
    const template = slideTemplates[templateType];

    if (!template) {
      return (
        <div key={templateType} className="mb-8">
          <h3 className="text-lg font-bold text-white mb-2">{templateType}</h3>
          <div className="w-full h-64 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
            <p className="text-red-400">Template definition not found</p>
          </div>
        </div>
      );
    }

    const isSelected = selectedTemplateType === templateType;

    return (
      <div key={templateType} className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">{templateType}</h3>
          <div className="flex gap-2">
            <Button color="default" size="sm" onClick={() => openFullscreenPreview(templateType)}>
              Preview Fullscreen
            </Button>
            <Button
              color={isSelected ? 'success' : 'primary'}
              size="sm"
              onClick={() => setSelectedTemplateType(isSelected ? null : templateType)}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
        <div
          className={`w-full h-64 rounded-lg overflow-hidden relative border ${isSelected ? 'border-green-500 border-2' : 'border-gray-700'}`}
          style={{
            background: template.gradient || template.backgroundColor || '#000000',
            color: template.textColor || '#FFFFFF',
          }}
        >
          {template.content?.map((item: SlideContentItem) => renderContentItem(item, template))}
          {!template.content || template.content.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400">No content defined for this template</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  // Render a single template in detail view
  const renderDetailedTemplate = () => {
    if (!selectedTemplateType) return null;

    const template = slideTemplates[selectedTemplateType];

    if (!template) {
      return (
        <div className="mt-8 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Error: Template not found</h2>
          <p className="text-white">
            The selected template &quot;{selectedTemplateType}&quot; is not properly defined.
          </p>
          <Button
            className="mt-4"
            color="danger"
            variant="flat"
            onClick={() => setSelectedTemplateType(null)}
          >
            Close
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold text-white mb-4">{selectedTemplateType}</h2>

          <div className="mb-4">
            <label className="text-white block mb-2" id="scale-slider-label">
              Scale: {scale.toFixed(1)}x
            </label>
            <Slider
              aria-labelledby="scale-slider-label"
              className="max-w-md"
              value={scale}
              onChange={(value: number | number[]) => {
                if (typeof value === 'number') {
                  setScale(value);
                } else if (Array.isArray(value)) {
                  setScale(value[0] as number);
                }
              }}
            />
          </div>

          <div
            className="mx-auto rounded-lg overflow-hidden relative border border-gray-700"
            style={{
              background: template.gradient || template.backgroundColor || '#000000',
              color: template.textColor || '#FFFFFF',
              width: `${800 * scale}px`,
              height: `${450 * scale}px`,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
            }}
          >
            {template.content?.map((item: SlideContentItem) => renderContentItem(item, template))}
            {!template.content || template.content.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">No content defined for this template</p>
              </div>
            ) : null}
          </div>
        </div>

        <Button color="danger" variant="flat" onClick={() => setSelectedTemplateType(null)}>
          Close Detail View
        </Button>
      </div>
    );
  };

  // Add fullscreen preview content renderer
  const renderFullscreenPreview = () => {
    if (!fullscreenTemplate.type) return null;

    if (fullscreenTemplate.isReactComponent) {
      switch (fullscreenTemplate.type) {
        case 'modernTwoColumnWithTitle':
          return <TwoColumnWithTitle />;
        case 'modernTitleWithBulletsAndImage':
          return <TitleWithBulletsAndImage />;
        default:
          return <div className="text-center text-white">Component not found</div>;
      }
    } else {
      // For data templates
      const template = slideTemplates[fullscreenTemplate.type];

      if (!template) {
        return <div className="text-center text-white">Template not found</div>;
      }

      return (
        <div
          className="w-full h-full rounded-lg overflow-hidden relative"
          style={{
            background: template.gradient || template.backgroundColor || '#000000',
            padding: '20px',
          }}
        >
          {template.title && (
            <h2
              style={{
                color: template.textColor || '#FFFFFF',
                position: 'absolute',
                top: '20px',
                left: '20px',
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {template.title}
            </h2>
          )}

          {template.subtitle && (
            <h3
              style={{
                color: template.textColor || '#FFFFFF',
                position: 'absolute',
                top: '60px',
                left: '20px',
                margin: 0,
                fontSize: '18px',
                opacity: 0.8,
              }}
            >
              {template.subtitle}
            </h3>
          )}

          {template.content?.map((item: SlideContentItem) => renderContentItem(item, template))}
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Slide Layout Previews</h1>

      <div className="mb-8">
        <Link className="inline-block" href="/dashboard">
          <Button color="default">Back to Dashboard</Button>
        </Link>
      </div>

      {templateError && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Template Loading Error</h2>
          <p className="text-white">{templateError}</p>
        </div>
      )}

      <Tabs aria-label="Layout preview options">
        <Tab key="data-templates" title="Data Templates">
          <div className="mt-6">
            <div className="mb-6">
              <label className="text-white font-bold mb-2 block" id="preview-scale-label">
                Preview Scale:
              </label>
              <div className="max-w-md">
                <Slider
                  aria-labelledby="preview-scale-label"
                  className="my-2"
                  value={scale}
                  onChange={(value: number | number[]) => {
                    if (typeof value === 'number') {
                      setScale(value);
                    } else if (Array.isArray(value)) {
                      setScale(value[0] as number);
                    }
                  }}
                />
                <div className="text-white">{(scale * 100).toFixed(0)}%</div>
              </div>
            </div>

            {selectedTemplateType ? (
              <div className="bg-gray-800 p-4 rounded-lg mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Selected: {selectedTemplateType}
                  </h2>
                  <Button
                    color="primary"
                    onClick={() => {
                      addSlideFromTemplate(selectedTemplateType);
                      // Alert user that template was added to slides
                      alert(`Template "${selectedTemplateType}" added to your slides!`);
                    }}
                  >
                    Add to Slides
                  </Button>
                </div>
                <div className="bg-gray-950 p-4 rounded-lg">{renderDetailedTemplate()}</div>
              </div>
            ) : null}

            {Object.entries(templateCategories).map(([category, templateTypes]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {templateTypes.map(templateType =>
                    renderTemplatePreview(templateType as TemplateType)
                  )}
                </div>
              </div>
            ))}
          </div>
        </Tab>

        <Tab key="react-components" title="React Component Templates">
          <div className="mt-6 grid grid-cols-1 gap-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Modern Two Column with Title</h2>
                <Button
                  color="default"
                  onClick={() => openFullscreenPreview('modernTwoColumnWithTitle', true)}
                >
                  Preview Fullscreen
                </Button>
              </div>
              <Card className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: '100%',
                    height: '500px',
                  }}
                >
                  <TwoColumnWithTitle />
                </div>
              </Card>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Title with Bullets and Image</h2>
                <Button
                  color="default"
                  onClick={() => openFullscreenPreview('modernTitleWithBulletsAndImage', true)}
                >
                  Preview Fullscreen
                </Button>
              </div>
              <Card className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: '100%',
                    height: '500px',
                  }}
                >
                  <TitleWithBulletsAndImage />
                </div>
              </Card>
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Fullscreen Preview Modal */}
      <Modal isOpen={isFullscreenOpen} size="full" onClose={closeFullscreenPreview}>
        <ModalContent>
          <ModalHeader className="flex justify-between items-center bg-gray-900 border-b border-gray-800 py-4">
            <h2 className="text-xl font-bold text-white">
              Fullscreen Preview: {fullscreenTemplate.type}
            </h2>
            <Button color="danger" onClick={closeFullscreenPreview}>
              Close
            </Button>
          </ModalHeader>
          <ModalBody className="p-0 bg-gray-950 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {renderFullscreenPreview()}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LayoutsPreviewPage;

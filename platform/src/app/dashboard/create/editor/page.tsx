// src/app/dashboard/create/editor/page.tsx
'use client';

import * as React from 'react';
import { Spinner } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useTheme } from '../../../hooks/useTheme';

import { EditorContainer, ErrorBoundary } from '@/components/features/editor';

// Define the types inline to avoid import issues
interface SlideContentItem {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'table' | 'video';
  value: string;
  x: number;
  y: number;
  style?: {
    color?: string;
    [key: string]: any;
  };
}

interface Slide {
  id: number;
  title: string;
  backgroundColor: string;
  textColor: string;
  content: SlideContentItem[];
}

interface OutlineSlide {
  id: number;
  title: string;
  bullets: string[];
}

// Define the format stored by the outline page
interface SavedSlideContent {
  id: number;
  content: string; // HTML content with <h2> and <ul><li> tags
  image_url?: string | null;
}

interface PresentationSettings {
  outline: OutlineSlide[] | SavedSlideContent[];
  theme: any;
  textDensity: string;
  imageSource: string;
  aiModel: string;
}

// Convert from the saved HTML content format to the expected OutlineSlide format
const convertSavedContentToOutlineSlides = (savedSlides: SavedSlideContent[]): OutlineSlide[] => {
  return savedSlides.map(slide => {
    // Create a DOM parser to extract content from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(slide.content, 'text/html');
    
    // Extract the title from h2
    const titleElement = doc.querySelector('h2');
    const title = titleElement ? titleElement.textContent || 'Untitled Slide' : 'Untitled Slide';
    
    // Extract bullets from li elements
    const bulletElements = doc.querySelectorAll('li');
    const bullets = Array.from(bulletElements).map(li => li.textContent || '').filter(Boolean);
    
    return {
      id: slide.id,
      title,
      bullets
    };
  });
};

// Convert outline slides to editor slides format
const convertOutlineToEditorSlides = (outlineSlides: OutlineSlide[]): Slide[] => {
  return outlineSlides.map(slide => {
    // Ensure bullets exists, default to empty array if not
    const bullets = Array.isArray(slide.bullets) ? slide.bullets : [];

    const bulletContent: SlideContentItem[] = bullets.map((bullet, index) => ({
      id: `bullet-${index}`,
      type: 'text',
      value: bullet,
      x: 50,
      y: 150 + index * 40, // Stack bullets vertically
      style: {
        color: '#000000',
      },
    }));

    const titleContent: SlideContentItem = {
      id: 'title',
      type: 'text',
      value: slide.title || 'Untitled Slide', // Add safety for undefined title
      x: 50,
      y: 50,
      style: {
        color: '#000000',
      },
    };

    return {
      id: slide.id || Date.now(), // Add safety for undefined id
      title: slide.title || 'Untitled Slide',
      backgroundColor: '#ffffff',
      content: [titleContent, ...bulletContent],
      textColor: '#000000',
    };
  });
};

// Safe JSON parse function with error handling
const safeJsonParse = (jsonString: string | null, fallback: any = null) => {
  if (!jsonString) return fallback;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);

    return fallback;
  }
};

export default function EditorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const { theme, loading: themeLoading } = useTheme();

  React.useEffect(() => {
    // Convert outline to editor format and save to localStorage
    const savedSettings = localStorage.getItem('presentationSettings');
    const savedOutline = localStorage.getItem('presentationOutline');

    try {
      let outlineSlides: OutlineSlide[] = [];

      if (savedSettings || savedOutline) {
        if (savedSettings) {
          const parsedSettings = safeJsonParse(savedSettings);

          if (parsedSettings && Array.isArray(parsedSettings.outline)) {
            // Check if we have HTML content format or already in OutlineSlide format
            const firstSlide = parsedSettings.outline[0] || {};
            if (typeof firstSlide.content === 'string' && firstSlide.content.includes('<h2>')) {
              // It's in the SavedSlideContent format, convert it
              outlineSlides = convertSavedContentToOutlineSlides(parsedSettings.outline as SavedSlideContent[]);
            } else if (firstSlide.title && Array.isArray(firstSlide.bullets)) {
              // It's already in OutlineSlide format
              outlineSlides = parsedSettings.outline as OutlineSlide[];
            }
          }
        } else if (savedOutline) {
          const parsedOutline = safeJsonParse(savedOutline);

          if (Array.isArray(parsedOutline)) {
            // Check the format of the saved outline
            const firstSlide = parsedOutline[0] || {};
            if (typeof firstSlide.content === 'string' && firstSlide.content.includes('<h2>')) {
              // It's in the SavedSlideContent format, convert it
              outlineSlides = convertSavedContentToOutlineSlides(parsedOutline as SavedSlideContent[]);
            } else if (firstSlide.title && Array.isArray(firstSlide.bullets)) {
              // It's already in OutlineSlide format
              outlineSlides = parsedOutline as OutlineSlide[];
            }
          }
        }

        // Safety check - ensure slides is an array
        if (!Array.isArray(outlineSlides) || outlineSlides.length === 0) {
          console.warn('Slides data is not a valid array, using default slide');
          outlineSlides = [
            {
              id: 1,
              title: 'Welcome to Your Presentation',
              bullets: [
                'Click to edit this text',
                'Add your content here',
                'You can add more slides using the sidebar',
              ],
            },
          ];
        }
      } else {
        // If no slides were found, create a default starter slide
        outlineSlides = [
          {
            id: 1,
            title: 'Welcome to Your Presentation',
            bullets: [
              'Click to edit this text',
              'Add your content here',
              'You can add more slides using the sidebar',
            ],
          },
        ];
      }

      // Convert and save slides in editor format
      const editorSlides = convertOutlineToEditorSlides(outlineSlides);

      setSlides(editorSlides);

      localStorage.setItem('editor_slides', JSON.stringify(editorSlides));
      console.log('Saved editor slides to localStorage:', editorSlides);

      // Clean up outline data to prevent confusion
      localStorage.removeItem('presentationOutline');
      localStorage.removeItem('presentationSettings');
    } catch (error) {
      console.error('Error converting outline to editor format:', error);

      // Create a default slide as fallback in case of error
      const defaultSlide: Slide = {
        id: 1,
        title: 'Welcome to Your Presentation',
        backgroundColor: '#ffffff',
        content: [
          {
            id: 'title',
            type: 'text',
            value: 'Welcome to Your Presentation',
            x: 50,
            y: 50,
            style: { color: '#000000' },
          },
          {
            id: 'bullet-0',
            type: 'text',
            value: 'Something went wrong with loading your slides',
            x: 50,
            y: 150,
            style: { color: '#000000' },
          },
        ],
        textColor: '#000000',
      };

      setSlides([defaultSlide]);
      localStorage.setItem('editor_slides', JSON.stringify([defaultSlide]));
    }

    setIsLoading(false);
  }, []);

  if (isLoading || themeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="primary" size="lg" />
        <p className="ml-4 text-xl">Loading your presentation...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <EditorContainer initialSlides={slides} />
    </ErrorBoundary>
  );
}

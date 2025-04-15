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

interface PresentationSettings {
  outline: OutlineSlide[];
  theme: any;
  textDensity: string;
  imageSource: string;
  aiModel: string;
}

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
      let slides: OutlineSlide[] = [];

      if (savedSettings || savedOutline) {
        if (savedSettings) {
          const parsedSettings = safeJsonParse(savedSettings);

          if (parsedSettings && Array.isArray(parsedSettings.outline)) {
            slides = parsedSettings.outline;
          }
        } else if (savedOutline) {
          const parsedOutline = safeJsonParse(savedOutline);

          if (Array.isArray(parsedOutline)) {
            slides = parsedOutline;
          }
        }

        // Safety check - ensure slides is an array
        if (!Array.isArray(slides)) {
          console.warn('Slides data is not an array, using empty array');
          slides = [];
        }
      }

      // If no slides were found, create a default starter slide
      if (slides.length === 0) {
        slides = [
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
      const editorSlides = convertOutlineToEditorSlides(slides);

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

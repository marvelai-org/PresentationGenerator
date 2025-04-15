// src/components/features/application/editor/hooks/useSlideManagement.tsx
import { useState, useCallback, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';

import { Slide, SlideContentItem } from '../EditorContainer';

// Define slide templates for quick creation
export type TemplateType =
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

interface SlideTemplates {
  [key: string]: Partial<Slide>;
}

// Export the slideTemplates so other components can import it directly
export const slideTemplates: SlideTemplates = {
  title: {
    title: 'Presentation Title',
    subtitle: 'Your subtitle goes here',
    author: 'Your Name',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [],
  },
  textAndImage: {
    title: 'Text & Image',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Main point goes here',
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Supporting detail goes here',
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
      },
    ],
  },
  bulletList: {
    title: 'Bullet Points',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'First bullet point',
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Second bullet point',
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Third bullet point',
      },
      {
        id: 'content-4',
        type: 'text',
        value: 'Fourth bullet point',
      },
    ],
  },

  // Basic Layouts - New Templates
  blankCard: {
    title: 'Blank Card',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [],
  },

  imageAndText: {
    title: 'Image and Text',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 50,
        y: 150,
        width: 300,
        height: 200,
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Text description here',
        x: 400,
        y: 150,
        width: 300,
      },
    ],
  },

  twoColumns: {
    title: 'Two Columns',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Column 1 content goes here. Add your text in this area.',
        x: 50,
        y: 150,
        width: 320,
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Column 2 content goes here. Add your text in this area.',
        x: 430,
        y: 150,
        width: 320,
      },
    ],
  },

  twoColumnWithHeading: {
    title: 'Two Column with Heading',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Section heading',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Column 1 content goes here. Add your text in this area.',
        x: 50,
        y: 180,
        width: 320,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Column 2 content goes here. Add your text in this area.',
        x: 430,
        y: 180,
        width: 320,
      },
    ],
  },

  threeColumns: {
    title: 'Three Columns',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Column 1 content goes here.',
        x: 50,
        y: 150,
        width: 210,
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Column 2 content goes here.',
        x: 295,
        y: 150,
        width: 210,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Column 3 content goes here.',
        x: 540,
        y: 150,
        width: 210,
      },
    ],
  },

  threeColumnWithHeading: {
    title: 'Three Column with Heading',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Section heading',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Column 1 content goes here.',
        x: 50,
        y: 180,
        width: 210,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Column 2 content goes here.',
        x: 295,
        y: 180,
        width: 210,
      },
      {
        id: 'content-4',
        type: 'text',
        value: 'Column 3 content goes here.',
        x: 540,
        y: 180,
        width: 210,
      },
    ],
  },

  fourColumns: {
    title: 'Four Columns',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Column 1',
        x: 50,
        y: 150,
        width: 150,
      },
      {
        id: 'content-2',
        type: 'text',
        value: 'Column 2',
        x: 230,
        y: 150,
        width: 150,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Column 3',
        x: 410,
        y: 150,
        width: 150,
      },
      {
        id: 'content-4',
        type: 'text',
        value: 'Column 4',
        x: 590,
        y: 150,
        width: 150,
      },
    ],
  },

  titleWithBullets: {
    title: 'Title with Bullets',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Section Title',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'text',
        value:
          '• First bullet point\n• Second bullet point\n• Third bullet point\n• Fourth bullet point\n• Fifth bullet point',
        x: 50,
        y: 180,
        width: 700,
      },
    ],
  },

  // Updated Two Column with Title template
  twoColumnWithTitle: {
    title: 'Two Column with Title',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Section Heading',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'rectangle',
        x: 50,
        y: 180,
        width: 320,
        height: 240,
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'rectangle',
        x: 390,
        y: 180,
        width: 320,
        height: 240,
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
        },
      },
      {
        id: 'content-4',
        type: 'text',
        value:
          'Column 1 content goes here. Add your text in this area. This column can contain key points, explanations, or important information.',
        x: 70,
        y: 200,
        width: 280,
        style: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
      {
        id: 'content-5',
        type: 'text',
        value:
          'Column 2 content goes here. Add your text in this area. Use this column to provide additional context, examples, or supporting details.',
        x: 410,
        y: 200,
        width: 280,
        style: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
    ],
  },

  // Updated Title with Bullets and Image template
  titleWithBulletsAndImage: {
    title: 'Title with Bullets and Image',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Title with bullets and image',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#ff7e5f', // Using a color similar to the gradient start
        },
      },
      {
        id: 'content-2',
        type: 'text',
        value:
          '• First key point that you want to emphasize\n• Second key point with important information\n• Third key point that adds value to your presentation\n• Fourth key point with supporting details',
        x: 50,
        y: 180,
        width: 400,
        style: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 480,
        y: 180,
        width: 280,
        height: 210,
        style: {
          opacity: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
        },
      },
    ],
  },

  // Card Layouts - New Templates
  accentLeft: {
    title: 'Accent Left',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'shape',
        value: 'rectangle',
        x: 50,
        y: 120,
        width: 200,
        height: 300,
        style: {
          backgroundColor: '#444444',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 75,
        y: 150,
        width: 150,
        height: 150,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Text content goes here. Add important information in this section.',
        x: 280,
        y: 150,
        width: 470,
      },
    ],
  },

  accentRight: {
    title: 'Accent Right',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'shape',
        value: 'rectangle',
        x: 550,
        y: 120,
        width: 200,
        height: 300,
        style: {
          backgroundColor: '#444444',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 575,
        y: 150,
        width: 150,
        height: 150,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Text content goes here. Add important information in this section.',
        x: 50,
        y: 150,
        width: 470,
      },
    ],
  },

  accentTop: {
    title: 'Accent Top',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'shape',
        value: 'rectangle',
        x: 50,
        y: 120,
        width: 700,
        height: 100,
        style: {
          backgroundColor: '#444444',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 75,
        y: 135,
        width: 70,
        height: 70,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Title or heading',
        x: 170,
        y: 135,
        width: 550,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-4',
        type: 'text',
        value: 'Main content goes here. Add your descriptive text in this section.',
        x: 50,
        y: 240,
        width: 700,
      },
    ],
  },

  accentRightFit: {
    title: 'Accent Right (Fitted)',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'shape',
        value: 'rectangle',
        x: 550,
        y: 120,
        width: 200,
        height: 300,
        style: {
          backgroundColor: '#444444',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 550,
        y: 120,
        width: 200,
        height: 300,
        style: {
          opacity: 0.7,
        },
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Text content goes here. Add important information in this section.',
        x: 50,
        y: 150,
        width: 470,
      },
    ],
  },

  accentLeftFit: {
    title: 'Accent Left (Fitted)',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'shape',
        value: 'rectangle',
        x: 50,
        y: 120,
        width: 200,
        height: 300,
        style: {
          backgroundColor: '#444444',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 50,
        y: 120,
        width: 200,
        height: 300,
        style: {
          opacity: 0.7,
        },
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Text content goes here. Add important information in this section.',
        x: 280,
        y: 150,
        width: 470,
      },
    ],
  },

  accentBackground: {
    title: 'Accent Background',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'shape',
        value: 'rectangle',
        x: 150,
        y: 100,
        width: 500,
        height: 350,
        style: {
          backgroundColor: '#444444',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 450,
        y: 150,
        width: 150,
        height: 150,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Title or heading',
        x: 200,
        y: 150,
        width: 400,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-4',
        type: 'text',
        value: 'Text content goes here. Add your main text in this area.',
        x: 200,
        y: 220,
        width: 220,
      },
    ],
  },

  // Image-focused layouts
  twoImageColumns: {
    title: '2 Image Columns',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 50,
        y: 150,
        width: 300,
        height: 200,
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 400,
        y: 150,
        width: 300,
        height: 200,
      },
      {
        id: 'content-3',
        type: 'text',
        value: 'Image 1 caption',
        x: 50,
        y: 360,
        width: 300,
      },
      {
        id: 'content-4',
        type: 'text',
        value: 'Image 2 caption',
        x: 400,
        y: 360,
        width: 300,
      },
    ],
  },

  threeImageColumns: {
    title: '3 Image Columns',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 50,
        y: 150,
        width: 200,
        height: 150,
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 275,
        y: 150,
        width: 200,
        height: 150,
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 500,
        y: 150,
        width: 200,
        height: 150,
      },
      {
        id: 'content-4',
        type: 'text',
        value: 'Image 1 caption',
        x: 50,
        y: 310,
        width: 200,
      },
      {
        id: 'content-5',
        type: 'text',
        value: 'Image 2 caption',
        x: 275,
        y: 310,
        width: 200,
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'Image 3 caption',
        x: 500,
        y: 310,
        width: 200,
      },
    ],
  },

  fourImageColumns: {
    title: '4 Image Columns',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 50,
        y: 150,
        width: 150,
        height: 120,
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 220,
        y: 150,
        width: 150,
        height: 120,
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 390,
        y: 150,
        width: 150,
        height: 120,
      },
      {
        id: 'content-4',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 560,
        y: 150,
        width: 150,
        height: 120,
      },
      {
        id: 'content-5',
        type: 'text',
        value: 'Caption 1',
        x: 50,
        y: 280,
        width: 150,
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'Caption 2',
        x: 220,
        y: 280,
        width: 150,
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Caption 3',
        x: 390,
        y: 280,
        width: 150,
      },
      {
        id: 'content-8',
        type: 'text',
        value: 'Caption 4',
        x: 560,
        y: 280,
        width: 150,
      },
    ],
  },

  imagesWithText: {
    title: 'Images with Text',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Section Title',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 50,
        y: 180,
        width: 200,
        height: 150,
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 275,
        y: 180,
        width: 200,
        height: 150,
      },
      {
        id: 'content-4',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 500,
        y: 180,
        width: 200,
        height: 150,
      },
      {
        id: 'content-5',
        type: 'text',
        value: 'Text description goes here. Add details about the images.',
        x: 50,
        y: 350,
        width: 700,
      },
    ],
  },

  imageGallery: {
    title: 'Image Gallery',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Gallery Title',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'rectangle',
        x: 200,
        y: 180,
        width: 400,
        height: 100,
        style: {
          backgroundColor: '#333333',
        },
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 220,
        y: 190,
        width: 80,
        height: 80,
      },
      {
        id: 'content-4',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 310,
        y: 190,
        width: 80,
        height: 80,
      },
      {
        id: 'content-5',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 400,
        y: 190,
        width: 80,
        height: 80,
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'Description of the image gallery or collection.',
        x: 50,
        y: 300,
        width: 700,
      },
    ],
  },

  teamPhotos: {
    title: 'Team Photos',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Our Team',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 100,
        y: 180,
        width: 100,
        height: 100,
        style: {
          opacity: 0.9,
        },
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 300,
        y: 180,
        width: 100,
        height: 100,
        style: {
          opacity: 0.9,
        },
      },
      {
        id: 'content-4',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 500,
        y: 180,
        width: 100,
        height: 100,
        style: {
          opacity: 0.9,
        },
      },
      {
        id: 'content-5',
        type: 'text',
        value: 'Team Member 1\nRole/Position',
        x: 75,
        y: 290,
        width: 150,
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'Team Member 2\nRole/Position',
        x: 275,
        y: 290,
        width: 150,
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Team Member 3\nRole/Position',
        x: 475,
        y: 290,
        width: 150,
      },
    ],
  },

  // Collections and sequences
  textBoxes: {
    title: 'Text Boxes',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Main Heading',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'rectangle',
        x: 50,
        y: 180,
        width: 200,
        height: 150,
        style: {
          backgroundColor: '#333333',
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'rectangle',
        x: 275,
        y: 180,
        width: 200,
        height: 150,
        style: {
          backgroundColor: '#333333',
        },
      },
      {
        id: 'content-4',
        type: 'shape',
        value: 'rectangle',
        x: 500,
        y: 180,
        width: 200,
        height: 150,
        style: {
          backgroundColor: '#333333',
        },
      },
      {
        id: 'content-5',
        type: 'text',
        value: 'Text box 1 content',
        x: 70,
        y: 200,
        width: 160,
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'Text box 2 content',
        x: 295,
        y: 200,
        width: 160,
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Text box 3 content',
        x: 520,
        y: 200,
        width: 160,
      },
    ],
  },

  timeline: {
    title: 'Timeline',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Timeline',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'line',
        x: 100,
        y: 200,
        width: 600,
        height: 2,
        style: {
          backgroundColor: '#555555',
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'circle',
        x: 100,
        y: 200,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-4',
        type: 'shape',
        value: 'circle',
        x: 300,
        y: 200,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-5',
        type: 'shape',
        value: 'circle',
        x: 500,
        y: 200,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-6',
        type: 'shape',
        value: 'circle',
        x: 700,
        y: 200,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Stage 1\n2020',
        x: 70,
        y: 230,
        width: 80,
      },
      {
        id: 'content-8',
        type: 'text',
        value: 'Stage 2\n2021',
        x: 270,
        y: 230,
        width: 80,
      },
      {
        id: 'content-9',
        type: 'text',
        value: 'Stage 3\n2022',
        x: 470,
        y: 230,
        width: 80,
      },
      {
        id: 'content-10',
        type: 'text',
        value: 'Stage 4\n2023',
        x: 670,
        y: 230,
        width: 80,
      },
    ],
  },

  largeBulletList: {
    title: 'Large Bullet List',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Main Points',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 180,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#555555',
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 230,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#555555',
        },
      },
      {
        id: 'content-4',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 280,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#555555',
        },
      },
      {
        id: 'content-5',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 330,
        width: 20,
        height: 20,
        style: {
          backgroundColor: '#555555',
        },
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'First important point goes here',
        x: 100,
        y: 180,
        width: 600,
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Second important point goes here',
        x: 100,
        y: 230,
        width: 600,
      },
      {
        id: 'content-8',
        type: 'text',
        value: 'Third important point goes here',
        x: 100,
        y: 280,
        width: 600,
      },
      {
        id: 'content-9',
        type: 'text',
        value: 'Fourth important point goes here',
        x: 100,
        y: 330,
        width: 600,
      },
    ],
  },

  iconsWithText: {
    title: 'Icons with Text',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Features Overview',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'star',
        x: 100,
        y: 180,
        width: 30,
        height: 30,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'star',
        x: 300,
        y: 180,
        width: 30,
        height: 30,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-4',
        type: 'shape',
        value: 'star',
        x: 500,
        y: 180,
        width: 30,
        height: 30,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-5',
        type: 'shape',
        value: 'star',
        x: 700,
        y: 180,
        width: 30,
        height: 30,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'Feature 1\nDescription',
        x: 80,
        y: 220,
        width: 120,
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Feature 2\nDescription',
        x: 280,
        y: 220,
        width: 120,
      },
      {
        id: 'content-8',
        type: 'text',
        value: 'Feature 3\nDescription',
        x: 480,
        y: 220,
        width: 120,
      },
      {
        id: 'content-9',
        type: 'text',
        value: 'Feature 4\nDescription',
        x: 680,
        y: 220,
        width: 120,
      },
    ],
  },

  smallIconsWithText: {
    title: 'Small Icons with Text',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Key Points',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 180,
        width: 15,
        height: 15,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 220,
        width: 15,
        height: 15,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-4',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 260,
        width: 15,
        height: 15,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-5',
        type: 'shape',
        value: 'circle',
        x: 70,
        y: 300,
        width: 15,
        height: 15,
        style: {
          backgroundColor: '#FFFFFF',
        },
      },
      {
        id: 'content-6',
        type: 'text',
        value: 'First important point with detailed description',
        x: 100,
        y: 178,
        width: 600,
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Second important point with detailed description',
        x: 100,
        y: 218,
        width: 600,
      },
      {
        id: 'content-8',
        type: 'text',
        value: 'Third important point with detailed description',
        x: 100,
        y: 258,
        width: 600,
      },
      {
        id: 'content-9',
        type: 'text',
        value: 'Fourth important point with detailed description',
        x: 100,
        y: 298,
        width: 600,
      },
    ],
  },

  arrows: {
    title: 'Arrows',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Process Flow',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'rectangle',
        x: 100,
        y: 200,
        width: 150,
        height: 80,
        style: {
          backgroundColor: '#333333',
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'arrow-right',
        x: 260,
        y: 220,
        width: 80,
        height: 40,
        style: {
          backgroundColor: '#555555',
        },
      },
      {
        id: 'content-4',
        type: 'shape',
        value: 'rectangle',
        x: 350,
        y: 200,
        width: 150,
        height: 80,
        style: {
          backgroundColor: '#333333',
        },
      },
      {
        id: 'content-5',
        type: 'shape',
        value: 'arrow-right',
        x: 510,
        y: 220,
        width: 80,
        height: 40,
        style: {
          backgroundColor: '#555555',
        },
      },
      {
        id: 'content-6',
        type: 'shape',
        value: 'rectangle',
        x: 600,
        y: 200,
        width: 150,
        height: 80,
        style: {
          backgroundColor: '#333333',
        },
      },
      {
        id: 'content-7',
        type: 'text',
        value: 'Step 1',
        x: 110,
        y: 215,
        width: 130,
      },
      {
        id: 'content-8',
        type: 'text',
        value: 'Step 2',
        x: 360,
        y: 215,
        width: 130,
      },
      {
        id: 'content-9',
        type: 'text',
        value: 'Step 3',
        x: 610,
        y: 215,
        width: 130,
      },
    ],
  },

  // Modernized Templates
  modernTwoColumnWithTitle: {
    title: 'Modern Two Column with Title',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Section Heading',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#FFFFFF',
        },
      },
      {
        id: 'content-2',
        type: 'shape',
        value: 'rectangle',
        x: 50,
        y: 180,
        width: 320,
        height: 240,
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
        },
      },
      {
        id: 'content-3',
        type: 'shape',
        value: 'rectangle',
        x: 390,
        y: 180,
        width: 320,
        height: 240,
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
        },
      },
      {
        id: 'content-4',
        type: 'text',
        value:
          'Column 1 content goes here. Add your text in this area. This column can contain key points, explanations, or important information.',
        x: 70,
        y: 200,
        width: 280,
        style: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
      {
        id: 'content-5',
        type: 'text',
        value:
          'Column 2 content goes here. Add your text in this area. Use this column to provide additional context, examples, or supporting details.',
        x: 410,
        y: 200,
        width: 280,
        style: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
    ],
  },

  modernTitleWithBulletsAndImage: {
    title: 'Modern Title with Bullets and Image',
    backgroundColor: '#000000',
    gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    textColor: '#FFFFFF',
    content: [
      {
        id: 'content-1',
        type: 'text',
        value: 'Title with bullets and image',
        x: 50,
        y: 120,
        width: 700,
        style: {
          color: '#ff7e5f', // Using a color similar to the gradient start
        },
      },
      {
        id: 'content-2',
        type: 'text',
        value:
          '• First key point that you want to emphasize\n• Second key point with important information\n• Third key point that adds value to your presentation\n• Fourth key point with supporting details',
        x: 50,
        y: 180,
        width: 400,
        style: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
      {
        id: 'content-3',
        type: 'image',
        value: '/placeholder-image.jpg',
        x: 480,
        y: 180,
        width: 280,
        height: 210,
        style: {
          opacity: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
        },
      },
    ],
  },
};

export default function useSlideManagement(
  slides: Slide[],
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>
): {
  currentSlideIndex: number;
  navigateToSlide: (index: number) => void;
  addNewSlide: () => void;
  addSlideFromTemplate: (templateType: TemplateType) => void;
  duplicateSlide: (index: number) => void;
  deleteSlide: (index: number) => void;
  moveSlideUp: (index: number) => void;
  moveSlideDown: (index: number) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  updateSlideContent: (slideId: number, contentId: string, value: string) => void;
  updateSlideTitle: (slideId: number, title: string) => void;
  removeContent: (slideId: number, contentId: string) => void;
  handleAddContent: (slideId: number) => void;
  slideTemplates: SlideTemplates;
} {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Save slides to localStorage whenever they change
  useEffect(() => {
    // Only save if we have actual slides with content
    if (slides && slides.length > 0) {
      try {
        console.log('Saving slides to editor_slides localStorage');
        localStorage.setItem('editor_slides', JSON.stringify(slides));

        // If we're editing slides, we should also update the generatedSlides
        // storage to ensure consistency between views
        if (localStorage.getItem('generatedSlides')) {
          localStorage.setItem('generatedSlides', JSON.stringify(slides));
        }
      } catch (error) {
        console.error('Error saving slides to localStorage:', error);
      }
    }
  }, [slides]);

  // Navigate to specific slide by index
  const navigateToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  // Add a new blank slide
  const addNewSlide = useCallback(() => {
    const newSlide: Slide = {
      id: Date.now(), // Generate unique ID
      title: 'New Slide',
      backgroundColor: '#000000',
      gradient: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
      textColor: '#FFFFFF',
      content: [],
    };

    const updatedSlides = [...slides, newSlide];

    setSlides(updatedSlides);
    // Navigate to the new slide
    navigateToSlide(updatedSlides.length - 1);
  }, [slides, setSlides, navigateToSlide]);

  // Add a slide from a template
  const addSlideFromTemplate = useCallback(
    (templateType: TemplateType) => {
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
        textColor: template.textColor,
        shapes: template.shapes,
      };

      const updatedSlides = [...slides, newSlide];

      setSlides(updatedSlides);
      navigateToSlide(updatedSlides.length - 1);
    },
    [slides, setSlides, navigateToSlide]
  );

  // Duplicate an existing slide
  const duplicateSlide = useCallback(
    (index: number) => {
      const slideToClone = slides[index];

      // Deep clone the slide
      const clonedSlide: Slide = {
        ...JSON.parse(JSON.stringify(slideToClone)),
        id: Date.now(), // Give the cloned slide a new ID
        title: `${slideToClone.title} (Copy)`,
      };

      // Insert the cloned slide after the original
      const updatedSlides = [...slides];

      updatedSlides.splice(index + 1, 0, clonedSlide);

      setSlides(updatedSlides);
      // Navigate to the cloned slide
      navigateToSlide(index + 1);
    },
    [slides, setSlides, navigateToSlide]
  );

  // Delete a slide
  const deleteSlide = useCallback(
    (index: number) => {
      if (slides.length <= 1) {
        // Don't allow deleting the last slide
        return;
      }

      // Create a copy without the slide to delete
      const updatedSlides = slides.filter((_, i) => i !== index);

      setSlides(updatedSlides);

      // Adjust current slide index if needed
      if (currentSlideIndex >= updatedSlides.length) {
        navigateToSlide(updatedSlides.length - 1);
      } else if (currentSlideIndex === index) {
        // If the deleted slide was the current one, stay at the same index (which is now a different slide)
        // or go to the previous one if this was the last slide
        navigateToSlide(Math.min(currentSlideIndex, updatedSlides.length - 1));
      }
    },
    [slides, currentSlideIndex, setSlides, navigateToSlide]
  );

  // Move a slide up in the order
  const moveSlideUp = useCallback(
    (index: number) => {
      if (index <= 0) return; // Can't move the first slide up

      const updatedSlides = [...slides];

      // Swap the slide with the one above it
      [updatedSlides[index - 1], updatedSlides[index]] = [
        updatedSlides[index],
        updatedSlides[index - 1],
      ];

      setSlides(updatedSlides);

      // Keep focus on the moved slide
      navigateToSlide(index - 1);
    },
    [slides, setSlides, navigateToSlide]
  );

  // Move a slide down in the order
  const moveSlideDown = useCallback(
    (index: number) => {
      if (index >= slides.length - 1) return; // Can't move the last slide down

      const updatedSlides = [...slides];

      // Swap the slide with the one below it
      [updatedSlides[index], updatedSlides[index + 1]] = [
        updatedSlides[index + 1],
        updatedSlides[index],
      ];

      setSlides(updatedSlides);

      // Keep focus on the moved slide
      navigateToSlide(index + 1);
    },
    [slides, setSlides, navigateToSlide]
  );

  // Handle drag and drop reordering
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        // Find the indices of the slides
        const oldIndex = slides.findIndex(slide => slide.id === active.id);
        const newIndex = slides.findIndex(slide => slide.id === over.id);

        // Reorder the slides
        const updatedSlides = [...slides];
        const [movedSlide] = updatedSlides.splice(oldIndex, 1);

        updatedSlides.splice(newIndex, 0, movedSlide);

        setSlides(updatedSlides);

        // Update current slide index to follow the moved slide
        if (currentSlideIndex === oldIndex) {
          navigateToSlide(newIndex);
        } else if (
          // If the current slide was between the old and new positions
          (oldIndex < currentSlideIndex && newIndex >= currentSlideIndex) ||
          (oldIndex > currentSlideIndex && newIndex <= currentSlideIndex)
        ) {
          // Adjust the current slide index to account for the shift
          navigateToSlide(oldIndex < newIndex ? currentSlideIndex - 1 : currentSlideIndex + 1);
        }
      }
    },
    [slides, currentSlideIndex, setSlides, navigateToSlide]
  );

  // Update a slide's content
  const updateSlideContent = useCallback(
    (slideId: number, contentId: string, value: string) => {
      const slidesCopy = [...slides];
      const slideIndex = slidesCopy.findIndex(s => s.id === slideId);

      if (slideIndex !== -1) {
        const contentIndex = slidesCopy[slideIndex].content.findIndex(
          item => item.id === contentId
        );

        if (contentIndex !== -1) {
          slidesCopy[slideIndex] = {
            ...slidesCopy[slideIndex],
            content: [...slidesCopy[slideIndex].content],
          };

          slidesCopy[slideIndex].content[contentIndex] = {
            ...slidesCopy[slideIndex].content[contentIndex],
            value,
          };

          setSlides(slidesCopy);
        }
      }
    },
    [slides, setSlides]
  );

  // Update a slide's title
  const updateSlideTitle = useCallback(
    (slideId: number, title: string) => {
      const slidesCopy = [...slides];
      const slideIndex = slidesCopy.findIndex(s => s.id === slideId);

      if (slideIndex !== -1) {
        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          title,
        };

        setSlides(slidesCopy);
      }
    },
    [slides, setSlides]
  );

  // Remove content from a slide
  const removeContent = useCallback(
    (slideId: number, contentId: string) => {
      const slidesCopy = [...slides];
      const slideIndex = slidesCopy.findIndex(s => s.id === slideId);

      if (slideIndex !== -1) {
        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          content: slidesCopy[slideIndex].content.filter(item => item.id !== contentId),
        };

        setSlides(slidesCopy);
      }
    },
    [slides, setSlides]
  );

  // Add content to a slide
  const handleAddContent = useCallback(
    (slideId: number) => {
      const slidesCopy = [...slides];
      const slideIndex = slidesCopy.findIndex(s => s.id === slideId);

      if (slideIndex !== -1) {
        const newContentItem: SlideContentItem = {
          id: `content-${Date.now()}`,
          type: 'text',
          value: 'New content',
        };

        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          content: [...slidesCopy[slideIndex].content, newContentItem],
        };

        setSlides(slidesCopy);
      }
    },
    [slides, setSlides]
  );

  return {
    currentSlideIndex,
    navigateToSlide,
    addNewSlide,
    addSlideFromTemplate,
    duplicateSlide,
    deleteSlide,
    moveSlideUp,
    moveSlideDown,
    handleDragEnd,
    updateSlideContent,
    updateSlideTitle,
    removeContent,
    handleAddContent,
    slideTemplates,
  };
}

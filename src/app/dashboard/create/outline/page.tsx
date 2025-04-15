'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Card,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Input,
  Tooltip,
  ButtonGroup,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  MeasuringStrategy,
  DragStartEvent,
  defaultDropAnimationSideEffects,
  DragOverEvent,
  Over,
  DragCancelEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Extension } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TipTapLink from '@tiptap/extension-link';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';

import { Theme } from '@/app/hooks/useTheme';

interface SlideContent {
  id: number;
  content: string; // Unified content instead of separate title and bullets
}

interface SortableSlideCardProps {
  slide: SlideContent;
  onDelete: (id: number) => void;
  onContentChange: (id: number, content: string) => void;
}

interface OutlineApiResponse {
  title: string;
  bullets: string[];
}

// Create a custom Document extension to enforce structure
const CustomDocument = Document.extend({
  content: 'heading block+',
});

// Create a custom keyboard extension for handling Enter and Backspace
const KeyboardShortcuts = Extension.create({
  name: 'keyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // When user presses Enter at end of title (h2), create a new bullet
      Enter: ({ editor }) => {
        // Check if cursor is at the end of a heading
        const { selection } = editor.state;
        const isAtEndOfHeading =
          selection.$head.parent.type.name === 'heading' &&
          selection.$head.parentOffset === selection.$head.parent.textContent.length;

        if (isAtEndOfHeading) {
          // If in heading and at the end, create or enter bullet list
          if (editor.can().chain().focus().toggleBulletList().run()) {
            editor.chain().focus().toggleBulletList().run();

            return true;
          }
        }

        return false;
      },
    };
  },
});

const UnifiedSlideEditor = ({
  content,
  onChange,
  placeholder,
}: {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Paragraph,
      Text,
      Heading.configure({
        levels: [2],
      }),
      BulletList,
      ListItem,
      Bold,
      Italic,
      Strike,
      TipTapLink,
      HardBreak,
      History,
      KeyboardShortcuts,
      Placeholder.configure({
        placeholder: placeholder || 'Title...\n\n• Bullet point...',
        showOnlyWhenEditable: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none w-full prose-sm prose-neutral dark:prose-invert focus:outline-none',
      },
      handleDOMEvents: {
        focus: () => {
          setIsFocused(true);

          return false;
        },
        blur: () => {
          setIsFocused(false);

          return false;
        },
      },
    },
    // Ensure empty content starts with a heading
    onCreate: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent('<h2></h2><ul><li></li></ul>');
      }
    },
  });

  // Handle initial content structure
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // If content is empty or doesn't contain a heading, restructure it
      if (!content || !content.includes('<h2>')) {
        const plainText = content.replace(/<[^>]*>/g, '').trim();

        if (plainText) {
          // If there's text content but no structure, convert it
          // Split by lines
          const lines = plainText.split('\n');
          const title = lines[0] || 'New slide';
          const bullets = lines.slice(1).filter(line => line.trim());

          let structuredContent = `<h2>${title}</h2>`;

          if (bullets.length > 0) {
            structuredContent += '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
          } else {
            structuredContent += '<ul><li></li></ul>';
          }

          editor.commands.setContent(structuredContent);
        } else {
          // If completely empty, set up with default structure
          editor.commands.setContent('<h2>New slide</h2><ul><li>New bullet point</li></ul>');
        }
      } else {
        // If it already has structure, just set it normally
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  // Add change handler to ensure structure after changes
  useEffect(() => {
    if (editor) {
      const handleChange = () => {
        // Check if structure is maintained
        const isStructured = editor.getHTML().includes('<h2>') && editor.getHTML().includes('<ul>');

        if (!isStructured && !editor.isEmpty) {
          // If structure lost but has content, attempt to restore it
          const plainText = editor.getText();

          if (plainText.trim()) {
            const lines = plainText.split('\n');
            const title = lines[0] || 'New slide';
            const bullets = lines.slice(1).filter(line => line.trim());

            let structuredContent = `<h2>${title}</h2>`;

            if (bullets.length > 0) {
              structuredContent += '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
            } else {
              structuredContent += '<ul><li></li></ul>';
            }

            // Only reset if significantly changed to avoid cursor jumping
            if (structuredContent.trim() !== editor.getHTML().trim()) {
              editor.commands.setContent(structuredContent);
            }
          }
        }
      };

      // Set up a debounced version to not interfere with typing
      const timeoutId = setTimeout(handleChange, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [editor]);

  return (
    <div className={`w-full slide-editor ${isFocused ? 'editor-focused' : ''}`}>
      <style global jsx>{`
        .slide-editor h2 {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .slide-editor ul {
          color: #ecedee;
          padding-left: 1rem;
          list-style-type: disc;
          margin-top: 0.25rem;
          margin-bottom: 0;
        }

        .slide-editor li {
          margin-bottom: 0.25rem;
          display: list-item;
        }

        .slide-editor li:last-child {
          margin-bottom: 0;
        }

        .editor-focused {
          /* Very subtle indication that the editor is focused */
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
};

const SortableSlideCard = ({
  slide,
  onDelete,
  onContentChange,
  recentlyDroppedId,
}: {
  slide: SlideContent;
  onDelete: (id: number) => void;
  onContentChange: (id: number, content: string) => void;
  recentlyDroppedId: number | null;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting, over } =
    useSortable({
      id: slide.id,
      transition: {
        duration: 200, // Reduced for more responsive feel
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition, // Disable transition during drag to avoid conflicts
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1, // Increased base z-index
    position: 'relative' as const,
  };

  const [isHovered, setIsHovered] = useState(false);

  // Calculate if this is the drop target
  const isOver = over?.id === slide.id;

  // Check if this card was recently dropped
  const wasRecentlyDropped = recentlyDroppedId === slide.id;

  // Log drag state for debugging
  useEffect(() => {
    if (isDragging) {
      console.log(`Dragging slide ${slide.id}, transform:`, transform);
    }
  }, [isDragging, slide.id, transform]);

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        opacity: 1,
        y: 0,
        scale: isOver ? 1.01 : 1,
      }}
      initial={{ opacity: 0, y: 10 }}
      style={style}
      transition={{ duration: 0.3 }}
      {...attributes}
      className={`relative group ${isDragging ? 'py-0' : 'py-0'}`} // Explicitly set zero padding
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`border border-transparent rounded-xl overflow-hidden transition-all duration-200 
          bg-[#323234] shadow-[0_2px_6px_rgba(0,0,0,0.15)]
          ${isDragging ? 'shadow-lg ring-1 ring-primary/20' : ''}
          ${isSorting && isOver ? 'border-primary/40 bg-primary/5' : ''}
          ${wasRecentlyDropped ? 'highlight-animation' : ''}
          ${isHovered ? 'shadow-md border-primary/40 scale-[1.005]' : ''}
        `}
      >
        <div className="flex items-stretch">
          <div
            className={`min-w-[4rem] w-16 flex-shrink-0 flex items-start justify-start pl-3 pr-3 pt-3 text-primary bg-[#2D2D2F] relative 
              ${isDragging ? 'cursor-grabbing bg-[#38383F]' : 'cursor-grab hover:bg-[#35353A]'} 
              transition-colors duration-150`}
            {...listeners} // Move listeners to entire container
          >
            {/* Drag handle indicator that appears on hover */}
            <div className="absolute left-1 top-3 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-150 z-10">
              <div className="flex items-center justify-start hover:text-primary transition-colors duration-150">
                <Icon icon="material-symbols:drag-indicator" width={18} />
              </div>
            </div>

            <div className="text-xl font-medium select-none text-center w-full">{slide.id}</div>
          </div>

          <div className="flex-1 py-3 px-4 cursor-text focus-within:ring-1 focus-within:ring-primary/30 focus-within:rounded flex items-start">
            <UnifiedSlideEditor
              content={slide.content}
              placeholder="Title...\n\n• Bullet point..."
              onChange={value => onContentChange(slide.id, value)}
            />
          </div>

          <div
            className={`p-2 flex items-start justify-center transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Tooltip content="Delete card" placement="top">
              <Button
                isIconOnly
                className="text-default-500 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20 cursor-pointer"
                variant="light"
                onPress={() => onDelete(slide.id)}
              >
                <Icon icon="material-symbols:delete-outline" width={20} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Adjust the AddCardButton component to reduce vertical space
const AddCardButton = ({ onClick, index }: { onClick: (index: number) => void; index: number }) => {
  return (
    <div className="relative h-3 my-0.5 group z-10 flex items-center hover:cursor-pointer">
      {/* Horizontal line that appears on hover */}
      <div className="absolute inset-x-0 h-[1px] bg-primary/30 opacity-0 group-hover:opacity-100 group-hover:bg-primary/70 transition-all duration-200" />

      {/* Centered button container that appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
        <Tooltip content="Add card" placement="top">
          <Button
            isIconOnly
            className="bg-primary text-white rounded-full shadow-sm scale-90 hover:scale-100 z-20
                      transition-all duration-200 w-6 h-6 min-w-0 flex items-center justify-center"
            size="sm"
            onPress={() => onClick(index)}
          >
            <Icon icon="material-symbols:add" width={14} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

async function generateOutline(
  topic: string,
  numSlides: number,
  style: string,
  language: string,
  themeId?: string,
  textDensity?: string,
  imageSource?: string,
  aiModel?: string
): Promise<OutlineApiResponse[]> {
  try {
    // In a real implementation, this would call your backend API
    // which would interface with your AI service
    const response = await fetch('/api/outline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        numSlides,
        style,
        language,
        themeId,
        textDensity,
        imageSource,
        aiModel,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate outline');
    }

    const data = await response.json();

    return data.slides as OutlineApiResponse[];
  } catch (error) {
    console.error('Error generating outline:', error);
    throw error;
  }
}

// Updated DropIndicator with better animation and visibility
const DropIndicator = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={`h-1 rounded-full my-0 bg-primary transition-all duration-150 ${
        isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      }`}
      style={{
        transformOrigin: 'center',
        transition: 'opacity 150ms ease, transform 150ms ease',
      }}
    />
  );
};

// Add this helper function to determine which indicator should be active
const getActiveIndicatorIndex = (
  activeId: number | null,
  over: Over | null,
  slides: SlideContent[]
) => {
  if (!activeId || !over) return -1;

  // Extract the needed information
  const overId = over.id;
  const overIndex = over.data?.current?.sortable?.index;

  // Determine the correct indicator position
  if (!Number.isInteger(overIndex)) return -1;

  // For clarity: return the index where the indicator should appear
  // If overIndex is 0, it means we're dropping at the top of the list
  // Otherwise, we're dropping after the item at (overIndex-1)
  return overIndex as number;
};

// Add this CSS style definition for the highlight animation with direct color values
// This animation creates a pulsing effect on cards that have been recently dropped
// to provide visual feedback to the user about where a card was moved to
// The highlight effect lasts for 10 seconds before being automatically cleared
const highlightAnimationStyle = `
  @keyframes highlight-pulse {
    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); border-color: rgba(99, 102, 241, 0.7); }
    70% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); border-color: rgba(99, 102, 241, 0.3); }
    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); border-color: rgba(99, 102, 241, 0); }
  }
  
  .highlight-animation {
    animation: highlight-pulse 1.5s ease-out forwards;
    border: 2px solid rgba(99, 102, 241, 0.7);
  }
`;

export default function OutlinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get parameters from URL query
  const [prompt, setPrompt] = useState(searchParams.get('prompt') || '');
  const [slideCountParam, setSlideCountParam] = useState(
    searchParams.get('slideCount') || '8 cards'
  );
  const [templateStyle, setTemplateStyle] = useState(searchParams.get('style') || 'Default');
  const [language, setLanguage] = useState(searchParams.get('language') || 'English (US)');

  // State for the generated outline
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for drag and drop - ensure consistent types
  const [activeId, setActiveId] = useState<number | null>(null);
  const [over, setOver] = useState<Over | null>(null);
  const [activeIndicatorIndex, setActiveIndicatorIndex] = useState(-1);
  const [dragStatus, setDragStatus] = useState<string>('idle');
  // Add state for recently dropped card
  const [recentlyDroppedId, setRecentlyDroppedId] = useState<number | null>(null);

  // State for prompt editing
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [tempPrompt, setTempPrompt] = useState('');

  // UI state
  const [credits, setCredits] = useState(100);
  const [textDensity, setTextDensity] = useState('Medium');
  const [imageSource, setImageSource] = useState('ai');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [aiModel, setAiModel] = useState('Flux Fast');
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [selectedModelPreview, setSelectedModelPreview] = useState<string | null>(null);

  // Setup DnD sensors with optimized configuration for better dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Lower distance threshold for easier drag initiation
      activationConstraint: {
        distance: 4, // Reduced from 8 for easier activation
        tolerance: 10, // Increased for better touch response
        delay: 50, // Small delay to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Improve drag handlers with better logging and error handling
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const dragId = active.id as number;

    console.log(`Drag started: slide ${dragId}`);

    setActiveId(dragId);
    setDragStatus('dragging');

    // Add haptic feedback if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25); // Reduced to a shorter pulse
      } catch (e) {
        // Silently ignore vibration errors
      }
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      console.log(`Drag over: active=${active.id}, over=${over?.id || 'none'}`);
      setOver(over);

      // Update the active indicator position
      const indicatorIndex = getActiveIndicatorIndex(active.id as number, over, slides);

      setActiveIndicatorIndex(indicatorIndex);

      console.log(`Active indicator at position: ${indicatorIndex}`);
    },
    [slides]
  );

  // Clear the highlight effect after 10 seconds (changed from 2 seconds)
  useEffect(() => {
    if (recentlyDroppedId !== null) {
      console.log(`Animation highlight started on slide ${recentlyDroppedId}`);
      const timeoutId = setTimeout(() => {
        console.log(`Animation highlight cleared from slide ${recentlyDroppedId}`);
        setRecentlyDroppedId(null);
      }, 10000); // Changed from 2000 to 10000 (10 seconds)

      return () => clearTimeout(timeoutId);
    }
  }, [recentlyDroppedId]);

  // Fix the handleDragEnd function
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    console.log(`Drag ended: active=${active.id}, over=${over?.id || 'none'}`);
    setDragStatus('idle');

    if (over && active.id !== over.id) {
      setSlides(items => {
        try {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);

          if (oldIndex === -1 || newIndex === -1) {
            console.error(`Invalid indices: oldIndex=${oldIndex}, newIndex=${newIndex}`);

            return items;
          }

          console.log(`Reordering: ${oldIndex} -> ${newIndex}`);

          // Track the slide being moved by saving a reference to its content
          const movedSlideContent = items[oldIndex].content;

          const reorderedSlides = arrayMove(items, oldIndex, newIndex);
          const updatedSlides = updateSlideNumbers(reorderedSlides);

          // Find the new slide ID after reordering and renumbering
          const movedSlide = updatedSlides.find(slide => slide.content === movedSlideContent);

          if (movedSlide) {
            console.log(`Highlighting slide with ID ${movedSlide.id} after move`);
            // Set the recently dropped card ID to the new ID of the moved slide
            setRecentlyDroppedId(movedSlide.id);
          } else {
            console.error('Could not find moved slide after reordering');
          }

          return updatedSlides;
        } catch (error) {
          console.error('Error during drag end:', error);

          return items; // Always return the original items on error
        }
      });
    }

    // Clear drag states with a small delay to allow animations to complete
    setTimeout(() => {
      setActiveId(null);
      setOver(null);
      setActiveIndicatorIndex(-1); // Clear the active indicator
    }, 10);
  }, []);

  const handleDragCancel = useCallback((event: DragCancelEvent) => {
    console.log('Drag cancelled', event);
    setActiveId(null);
    setOver(null);
    setDragStatus('idle');
    setActiveIndicatorIndex(-1); // Clear the active indicator
  }, []);

  // Enhanced image source options
  const imageSources = [
    {
      key: 'Automatic',
      name: 'Automatic',
      description: 'Automatically select best image type for each image',
      icon: 'material-symbols:auto-fix',
    },
    {
      key: 'AI images',
      name: 'AI images',
      description: 'Generate original images and graphics with AI',
      icon: 'material-symbols:auto-awesome',
    },
    {
      key: 'Stock photos',
      name: 'Stock photos',
      description: 'Search free high-resolution photos and backgrounds from Unsplash',
      icon: 'material-symbols:image',
    },
    {
      key: 'Web images',
      name: 'Web images',
      description: 'Search the internet for images',
      icon: 'material-symbols:public',
    },
    {
      key: 'Illustrations',
      name: 'Illustrations',
      description: 'Search for illustrations from Pictographic',
      icon: 'material-symbols:palette-outline',
    },
    {
      key: 'Animated GIFs',
      name: 'Animated GIFs',
      description: 'Search for fun animated GIFs from Giphy',
      icon: 'material-symbols:gif-box',
    },
    {
      key: 'Image placeholders',
      name: 'Image placeholders',
      description: 'Generate empty placeholders for your own images',
      icon: 'material-symbols:image-not-supported-outline',
      isNew: true,
    },
    {
      key: "Don't add images",
      name: "Don't add images",
      description: 'Create a presentation without images',
      icon: 'material-symbols:hide-image',
      isNew: true,
    },
  ];

  // Enhanced AI model options
  const aiModelOptions = {
    basic: [
      {
        key: 'Flux Fast 1.1',
        name: 'Flux Fast 1.1',
        provider: 'Black Forest Labs',
        description: 'Fast speed with bright, vivid colors',
        bestFor: ['Realistic styles', 'Colors'],
        speed: 4,
      },
      {
        key: 'Imagen 3 Fast',
        name: 'Imagen 3 Fast',
        provider: 'Google',
        description: "Google's fastest image generation model",
        bestFor: ['Accuracy', 'Speed'],
        speed: 4,
      },
    ],
    advanced: [
      {
        key: 'Flux Pro',
        name: 'Flux Pro',
        provider: 'Black Forest Labs',
        description: 'Premium quality with more detailed outputs',
        bestFor: ['Details', 'Composition'],
        speed: 3,
      },
      {
        key: 'Ideogram 2 Turbo',
        name: 'Ideogram 2 Turbo',
        provider: 'Ideogram',
        description: 'Fast generation with high quality',
        bestFor: ['Text integration', 'Concepts'],
        speed: 3,
      },
      {
        key: 'Imagen 3',
        name: 'Imagen 3',
        provider: 'Google',
        description: 'High-quality image generation from text',
        bestFor: ['Photorealism', 'Accuracy'],
        speed: 2,
      },
      {
        key: 'Leonardo Phoenix',
        name: 'Leonardo Phoenix',
        provider: 'Leonardo',
        description: 'High-detail image creation',
        bestFor: ['Artistic quality', 'Details'],
        speed: 2,
      },
    ],
    premium: [
      {
        key: 'DALL-E 3',
        name: 'DALL-E 3',
        provider: 'OpenAI',
        description: 'Powerful text-to-image capabilities',
        bestFor: ['Text accuracy', 'Creative concepts'],
        speed: 2,
      },
      {
        key: 'Flux Ultra',
        name: 'Flux Ultra',
        provider: 'Black Forest Labs',
        description: 'The highest quality generation',
        bestFor: ['Photorealism', 'Details'],
        speed: 1,
      },
      {
        key: 'Ideogram 2',
        name: 'Ideogram 2',
        provider: 'Ideogram',
        description: 'The most powerful model from Ideogram',
        bestFor: ['Text integration', 'Creativity'],
        speed: 2,
      },
      {
        key: 'Recraft',
        name: 'Recraft',
        provider: 'Recraft',
        description: 'Great for creative styles',
        bestFor: ['Artistic styles', 'Colors'],
        speed: 2,
      },
      {
        key: 'Recraft Vector Illustration',
        name: 'Recraft Vector Illustration',
        provider: 'Recraft',
        description: 'Great for line art and engravings',
        bestFor: ['Artistic styles', 'Text'],
        speed: 2,
      },
    ],
  };

  // Theme options
  const themes: Theme[] = [
    {
      id: 'vanilla',
      name: 'Vanilla',
      backgroundColor: '#FFF9C4',
      titleColor: '#000000',
      bodyColor: '#333333',
      linkColor: '#2563EB',
      isDark: false,
    },
    {
      id: 'daydream',
      name: 'Daydream',
      backgroundColor: '#E3F2FD',
      titleColor: '#1A365D',
      bodyColor: '#2D3748',
      linkColor: '#3182CE',
      isDark: false,
    },
    {
      id: 'chisel',
      name: 'Chisel',
      backgroundColor: '#F5F5F5',
      titleColor: '#1A202C',
      bodyColor: '#4A5568',
      linkColor: '#3182CE',
      isDark: false,
    },
    {
      id: 'wireframe',
      name: 'Wireframe',
      backgroundColor: '#ECEFF1',
      titleColor: '#263238',
      bodyColor: '#455A64',
      linkColor: '#2196F3',
      isDark: false,
    },
    {
      id: 'bee-happy',
      name: 'Bee Happy',
      backgroundColor: '#212121',
      titleColor: '#FFC107',
      bodyColor: '#E0E0E0',
      linkColor: '#FFC107',
      isDark: true,
    },
    {
      id: 'icebreaker',
      name: 'Icebreaker',
      backgroundColor: '#E1F5FE',
      titleColor: '#0288D1',
      bodyColor: '#0D47A1',
      linkColor: '#01579B',
      isDark: false,
    },
    {
      id: 'aurora',
      name: 'Aurora',
      backgroundColor: '#0F172A',
      titleColor: '#F5B0FF',
      bodyColor: '#E0E7FF',
      linkColor: '#A78BFA',
      isDark: true,
    },
    {
      id: 'velvet-tides',
      name: 'Velvet Tides',
      backgroundColor: '#1E1B4B',
      titleColor: '#FFFFFF',
      bodyColor: '#E0E7FF',
      linkColor: '#C7D2FE',
      isDark: true,
    },
    {
      id: 'alien',
      name: 'Alien',
      backgroundColor: '#022C22',
      titleColor: '#ECFDF5',
      bodyColor: '#D1FAE5',
      linkColor: '#34D399',
      isDark: true,
    },
    {
      id: 'cornflower',
      name: 'Cornflower',
      backgroundColor: '#EEF2FF',
      titleColor: '#4338CA',
      bodyColor: '#3730A3',
      linkColor: '#4F46E5',
      isDark: false,
    },
    {
      id: 'aurum',
      name: 'Aurum',
      backgroundColor: '#1A1A1A',
      titleColor: '#FFD700',
      bodyColor: '#E5E5E5',
      linkColor: '#FFD700',
      isDark: true,
    },
    {
      id: 'consultant',
      name: 'Consultant',
      backgroundColor: '#FFFFFF',
      titleColor: '#111827',
      bodyColor: '#374151',
      linkColor: '#2563EB',
      isDark: false,
    },
  ];

  // Theme state
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [themeFilter, setThemeFilter] = useState<string>('all');

  const [sourceText, setSourceText] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState<boolean>(false);
  const [imageModelId, setImageModelId] = useState<string>('dall-e-3');

  // Define highlightDuration as a constant at the beginning of the component
  const highlightDuration = 1500; // in milliseconds

  // Convert slide count to number
  const getNumSlides = () => {
    return parseInt(slideCountParam.split(' ')[0]) || 8;
  };

  // Update slide numbers to be sequential after any change
  const updateSlideNumbers = (slides: SlideContent[]): SlideContent[] => {
    return slides.map((slide, index) => ({
      ...slide,
      id: index + 1,
    }));
  };

  // Generate the outline on page load if we have a prompt
  useEffect(() => {
    if (prompt) {
      setIsLoading(true);

      const fetchOutline = async () => {
        try {
          const numSlides = parseInt(slideCountParam.split(' ')[0], 10);
          const outlineData: OutlineApiResponse[] = await generateOutline(
            prompt,
            numSlides,
            templateStyle,
            language
          );

          const formattedSlides: SlideContent[] = outlineData.map((slide, index) => {
            // Convert old format to new unified format
            const bulletPoints = slide.bullets.map(bullet => `<li>${bullet}</li>`).join('');
            const content = `<h2>${slide.title}</h2><ul>${bulletPoints}</ul>`;

            return {
              id: index + 1,
              content: content,
            };
          });

          setSlides(formattedSlides);

          // Clear any previous errors
          setError(null);
        } catch (err) {
          console.error('Error in fetchOutline:', err);
          setError('Failed to generate outline. Please try again.');

          // Fallback to empty slides if there's an error
          setSlides([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOutline();
    } else if (!prompt) {
      // If no prompt, redirect back to generate page
      router.push('/dashboard/create/generate');
    }
  }, [prompt, slideCountParam, templateStyle, language, router]);

  // First, we'll update the useEffect to load the previously selected theme from local storage
  useEffect(() => {
    // Try to load the selected theme from localStorage
    const savedThemeId = localStorage.getItem('selectedThemeId');

    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);

      if (savedTheme) {
        setSelectedTheme(savedTheme);
      }
    }

    // Also load the last used prompt if it exists and current prompt is empty
    const savedPrompt = localStorage.getItem('lastPrompt');

    if (savedPrompt && !prompt) {
      setPrompt(savedPrompt);
    }
  }, [prompt]);

  const deleteSlide = (id: number) => {
    setSlides(prevSlides => {
      const updatedSlides = prevSlides.filter(slide => slide.id !== id);

      return updateSlideNumbers(updatedSlides);
    });
  };

  const addNewSlide = () => {
    setSlides(prevSlides => {
      const updatedSlides = [
        ...prevSlides,
        {
          id: prevSlides.length + 1,
          content: '<h2>New slide</h2><ul><li>New bullet point</li></ul>',
        },
      ];

      return updatedSlides;
    });
  };

  const addNewSlideAt = (index: number) => {
    setSlides(prevSlides => {
      const newSlides = [...prevSlides];

      newSlides.splice(index, 0, {
        id: 0, // Temporary ID that will be updated
        content: '<h2>New slide</h2><ul><li>New bullet point</li></ul>',
      });

      return updateSlideNumbers(newSlides);
    });
  };

  const handleContentChange = (id: number, content: string) => {
    setSlides(slides.map(slide => (slide.id === id ? { ...slide, content } : slide)));
  };

  // Update the theme selection handling to save to localStorage with proper typing
  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedThemeId', theme.id);
  };

  // Modify the handleGeneratePresentation function to include all settings
  const handleGeneratePresentation = () => {
    // Save all presentation data to localStorage
    const presentationSettings = {
      outline: slides,
      theme: selectedTheme,
      textDensity,
      imageSource,
      aiModel,
    };

    localStorage.setItem('presentationSettings', JSON.stringify(presentationSettings));
    localStorage.setItem('presentationOutline', JSON.stringify(slides));
    localStorage.setItem('presentationTheme', JSON.stringify(selectedTheme));

    // Navigate to the editor page
    router.push('/dashboard/create/editor');
  };

  // Modify refreshPrompt to use the current prompt
  const refreshPrompt = () => {
    setIsLoading(true);
    setIsEditingPrompt(false);

    // Apply a visual effect to the entire outline section to indicate regeneration
    const outlineSection = document.querySelector('.outline-section');

    if (outlineSection) {
      outlineSection.classList.add('opacity-50', 'transition-opacity');
      setTimeout(() => {
        outlineSection.classList.remove('opacity-50', 'transition-opacity');
      }, 300);
    }

    const fetchOutline = async () => {
      try {
        const numSlides = parseInt(slideCountParam.split(' ')[0], 10);
        const outlineData: OutlineApiResponse[] = await generateOutline(
          prompt,
          numSlides,
          templateStyle,
          language,
          selectedTheme.id,
          textDensity,
          imageSource,
          aiModel
        );

        const formattedSlides: SlideContent[] = outlineData.map((slide, index) => {
          // Convert old format to new unified format
          const bulletPoints = slide.bullets.map(bullet => `<li>${bullet}</li>`).join('');
          const content = `<h2>${slide.title}</h2><ul>${bulletPoints}</ul>`;

          return {
            id: index + 1,
            content: content,
          };
        });

        setSlides(formattedSlides);

        // Clear any previous errors
        setError(null);

        // Save the updated prompt to localStorage so it persists
        localStorage.setItem('lastPrompt', prompt);
      } catch (err) {
        console.error('Error refreshing outline:', err);
        setError('Failed to refresh outline. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOutline();
  };

  // Handler for starting to edit the prompt
  const handlePromptFocus = () => {
    setTempPrompt(prompt);
    setIsEditingPrompt(true);
  };

  // Handler for canceling prompt edit
  const handleCancelPromptEdit = () => {
    setPrompt(tempPrompt);
    setIsEditingPrompt(false);
  };

  // Function to get the current model details
  const getCurrentModelDetails = () => {
    const modelKey = selectedModelPreview || aiModel;

    return (
      aiModelOptions.basic.find(m => m.key === modelKey) ||
      aiModelOptions.advanced.find(m => m.key === modelKey) ||
      aiModelOptions.premium.find(m => m.key === modelKey)
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-4 apple-dark">
      {/* Add the style tag for highlight animation */}
      <style global jsx>
        {highlightAnimationStyle}
      </style>

      {/* Header section styled like screenshots 2 and 3 */}
      <div className="flex flex-col items-center mb-6 mt-4">
        {/* Back button shown on the left */}
        <div className="w-full flex justify-between items-center mb-8">
          <Button
            className="text-gray-300 hover:bg-[#28282A]/50"
            startContent={<Icon icon="material-symbols:arrow-back" />}
            variant="light"
            onPress={() => router.push('/dashboard/create')}
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Generate</h1>
          <div className="w-[72px]" /> {/* Empty div to balance the layout */}
        </div>

        {/* Options row */}
        <div className="flex justify-center w-full gap-4 mb-6">
          <div className="flex items-center mr-2">
            <span className="text-gray-300 text-lg">Prompt</span>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button
                className="bg-[#1C1C1E] border-1 border-[#38383A] min-w-[120px] text-gray-300"
                endContent={<Icon icon="material-symbols:expand-more" />}
                variant="flat"
              >
                {slideCountParam}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Card Count"
              onAction={key => setSlideCountParam(key.toString())}
            >
              <DropdownItem key="4 cards">4 cards</DropdownItem>
              <DropdownItem key="8 cards">8 cards</DropdownItem>
              <DropdownItem key="9 cards">9 cards</DropdownItem>
              <DropdownItem key="12 cards">12 cards</DropdownItem>
              <DropdownItem key="16 cards">16 cards</DropdownItem>
              <DropdownItem key="20 cards">20 cards</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button
                className="bg-[#1C1C1E] border-1 border-[#38383A] min-w-[120px] text-gray-300"
                endContent={<Icon icon="material-symbols:expand-more" />}
                variant="flat"
              >
                {templateStyle}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Template Style"
              onAction={key => setTemplateStyle(key.toString())}
            >
              <DropdownItem key="Default">Default</DropdownItem>
              <DropdownItem key="Basic">Basic</DropdownItem>
              <DropdownItem key="Academic">Academic</DropdownItem>
              <DropdownItem key="Professional">Professional</DropdownItem>
              <DropdownItem key="Creative">Creative</DropdownItem>
              <DropdownItem key="Modern">Modern</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button
                className="bg-[#1C1C1E] border-1 border-[#38383A] min-w-[120px] text-gray-300"
                endContent={<Icon icon="material-symbols:expand-more" />}
                variant="flat"
              >
                {language}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Language" onAction={key => setLanguage(key.toString())}>
              <DropdownItem key="English (US)">English (US)</DropdownItem>
              <DropdownItem key="English (UK)">English (UK)</DropdownItem>
              <DropdownItem key="Spanish">Spanish</DropdownItem>
              <DropdownItem key="French">French</DropdownItem>
              <DropdownItem key="German">German</DropdownItem>
              <DropdownItem key="Italian">Italian</DropdownItem>
              <DropdownItem key="Portuguese">Portuguese</DropdownItem>
              <DropdownItem key="Chinese">Chinese</DropdownItem>
              <DropdownItem key="Japanese">Japanese</DropdownItem>
              <DropdownItem key="Korean">Korean</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="w-full mb-6">
          <Card className="p-1 bg-[#1C1C1E] border-1 border-[#38383A]">
            <Input
              classNames={{
                base: 'w-full',
                input: 'text-lg py-2 min-h-[50px] text-gray-300',
              }}
              endContent={
                <Tooltip content="Regenerate outline" placement="bottom">
                  <Button
                    isIconOnly
                    className="text-gray-300"
                    isDisabled={isLoading}
                    variant="light"
                    onPress={() => {
                      if (prompt.trim()) {
                        refreshPrompt();
                      }
                    }}
                  >
                    {isLoading ? (
                      <Spinner color="default" size="sm" />
                    ) : (
                      <Icon icon="material-symbols:refresh" width={20} />
                    )}
                  </Button>
                </Tooltip>
              }
              size="lg"
              value={prompt}
              variant="flat"
              onChange={e => setPrompt(e.target.value)}
              onFocus={handlePromptFocus}
            />
          </Card>
        </div>

        {/* Generate/Cancel buttons - only show when editing prompt */}
        {isEditingPrompt && (
          <div className="flex justify-center gap-4 mt-2">
            <Button
              className="bg-[#1C1C1E] border-1 border-[#38383A] px-8 text-gray-300"
              variant="flat"
              onPress={handleCancelPromptEdit}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-b from-[#2B2B2D] to-[#242426] px-8 text-white border-1 border-[#38383A]"
              isDisabled={isLoading || !prompt.trim()}
              onPress={refreshPrompt}
            >
              Generate outline
            </Button>
          </div>
        )}
      </div>

      {/* Outline Section */}
      <h2 className="text-xl font-semibold mb-4 text-white">Outline</h2>

      {/* Main content - apply Apple-like theme styling */}
      <div className="main-panel px-4 py-4 rounded-xl mb-6 bg-[#1C1C1E] border border-[#38383A]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner color="default" size="lg" />
            <p className="mt-4 text-gray-300">Generating your outline...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-danger">Error: {error}</p>
            <Button
              className="mt-4 bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white border-1 border-[#38383A]"
              onPress={refreshPrompt}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            {/* Slide Outline Cards with Drag and Drop */}
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              sensors={sensors}
              onDragCancel={handleDragCancel}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              measuring={{
                droppable: {
                  strategy: MeasuringStrategy.Always
                },
              }}
              // Only apply vertical constraint, not other modifiers that might interfere
              onDragStart={handleDragStart}
            >
              <SortableContext
                items={slides.map(slide => slide.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-0.5 mb-8 outline-section">
                  {slides.length === 0 ? (
                    <div className="p-8 bg-[#232324] border border-dashed border-[#38383A] text-center rounded-lg">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Icon
                          className="text-4xl text-gray-400"
                          icon="material-symbols:slideshow"
                        />
                        <p className="text-gray-300">
                          No slides yet. Create your first slide below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Top drop indicator - only shown when dropping at position 0 */}
                      <DropIndicator isActive={activeIndicatorIndex === 0} />

                      {slides.map((slide, index) => (
                        <React.Fragment key={`slide-container-${slide.id}`}>
                          <SortableSlideCard
                            key={slide.id}
                            recentlyDroppedId={recentlyDroppedId}
                            slide={slide}
                            onContentChange={handleContentChange}
                            onDelete={deleteSlide}
                          />
                          {/* Between-slides indicator - only shown when dropping after this slide */}
                          <div className="relative -mt-px">
                            <DropIndicator isActive={activeIndicatorIndex === index + 1} />
                            {index < slides.length - 1 && (
                              <AddCardButton
                                index={index + 1}
                                onClick={() => addNewSlideAt(index + 1)}
                              />
                            )}
                          </div>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>
              </SortableContext>

              <DragOverlay
                adjustScale={false} // Changed to false to prevent scaling issues
                dropAnimation={{
                  duration: 200, // Reduced duration
                  easing: 'cubic-bezier(0.2, 0, 0.1, 1)',
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                      active: {
                        opacity: '0.5',
                      },
                    },
                  }),
                }}
              >
                {activeId ? (
                  <div
                    className="rounded-xl overflow-hidden shadow-xl border border-primary/30"
                    style={{
                      width: '100%',
                      opacity: 0.95,
                      backgroundColor: '#232324',
                    }}
                  >
                    <div className="flex items-stretch">
                      <div className="min-w-[4rem] w-16 flex-shrink-0 flex items-start justify-start pl-3 pr-3 pt-3 text-primary bg-[#2D2D2F]">
                        <div className="text-xl font-medium select-none text-center w-full">
                          {slides.find(slide => slide.id === activeId)?.id}
                        </div>
                      </div>

                      <div className="flex-1 p-3">
                        {/* Format content properly to avoid raw HTML */}
                        <div className="slide-editor-preview w-full">
                          <div className="slide-title text-white text-lg font-semibold mb-1">
                            {slides
                              .find(slide => slide.id === activeId)
                              ?.content.match(/<h2>(.*?)<\/h2>/)?.[1] || 'Slide Title'}
                          </div>
                          <div className="slide-bullets text-gray-300 text-sm">
                            <ul className="list-disc pl-5">
                              {slides
                                .find(slide => slide.id === activeId)
                                ?.content.match(/<li>(.*?)<\/li>/g)
                                ?.map((item, i) => {
                                  const content = item.replace(/<li>(.*?)<\/li>/, '$1');

                                  return content ? (
                                    <li key={i} className="mb-1">
                                      {content.length > 60
                                        ? `${content.substring(0, 60)}...`
                                        : content}
                                    </li>
                                  ) : null;
                                })
                                .filter(Boolean)
                                .slice(0, 3) || [<li key="empty">New bullet point</li>]}
                              {(slides
                                .find(slide => slide.id === activeId)
                                ?.content.match(/<li>(.*?)<\/li>/g)?.length || 0) > 3 && (
                                <li key="more" className="text-gray-500">
                                  ...
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {/* Add Card Button */}
            {!isLoading && (
              <div className="mb-8">
                <Button
                  fullWidth
                  className="border border-dashed border-[#38383A] hover:border-gray-400/50 py-4 bg-[#1C1C1E] hover:bg-[#232324] transition-colors"
                  startContent={
                    <Icon className="text-gray-300" icon="material-symbols:add-circle" width={18} />
                  }
                  variant="flat"
                  onPress={addNewSlide}
                >
                  <span className="text-gray-300">Add card</span>
                </Button>
              </div>
            )}

            {/* Cards Count */}
            {!isLoading && slides.length > 0 && (
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <span className="text-gray-400">{slides.length} cards total</span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">300/20000</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Customize Section */}
      {!isLoading && slides.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-white">Customize your presentation</h2>
          <div className="main-panel px-4 py-4 rounded-xl mb-6 bg-[#1C1C1E] border border-[#38383A]">
            {/* Themes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-white">Themes</h3>
                <Button
                  className="text-gray-300"
                  size="sm"
                  startContent={
                    <Icon className="text-gray-300" icon="material-symbols:visibility" />
                  }
                  variant="light"
                  onPress={() => setShowThemeModal(true)}
                >
                  View more
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Use one of our popular themes below or view more
              </p>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {themes.slice(0, 6).map(theme => (
                  <Card
                    key={theme.id}
                    isPressable
                    className={`p-0 overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                      selectedTheme.id === theme.id
                        ? 'ring-1 ring-white/30 shadow-md'
                        : 'border border-[#38383A]/50'
                    }`}
                    style={{ backgroundColor: '#232324' }}
                    onPress={() => handleThemeSelect(theme)}
                  >
                    <div className="flex flex-col">
                      <div
                        className="p-4 relative"
                        style={{
                          backgroundColor: '#2C2C2E',
                          color: '#F2F2F2',
                        }}
                      >
                        <div
                          className="w-full h-1 absolute top-0 left-0 right-0"
                          style={{
                            backgroundColor: theme.isDark ? theme.linkColor : theme.titleColor,
                          }}
                        />
                        <div className="font-semibold mb-1 text-white">Title</div>
                        <div className="text-xs text-white opacity-80">
                          Body & <span style={{ color: theme.linkColor }}>link</span>
                        </div>
                        {selectedTheme.id === theme.id && (
                          <div className="absolute top-2 right-2 text-white/80 bg-[#232324] rounded-full p-0.5">
                            <Icon icon="material-symbols:check-circle" width={18} />
                          </div>
                        )}
                      </div>
                      <div className="text-center text-sm py-2 bg-[#28282A] text-white/90">
                        {theme.name}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              <h3 className="font-medium mb-2 text-white">Content</h3>
              <p className="text-gray-400 text-sm mb-4">
                Adjust text and image styles for your presentation
              </p>

              {/* Text Density */}
              <div className="mb-6">
                <p className="text-sm mb-2 text-gray-300">Amount of text per card</p>
                <ButtonGroup className="w-full" variant="flat">
                  <Button
                    className={
                      textDensity === 'Brief'
                        ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white flex-1 border-[#38383A]'
                        : 'bg-[#232324] text-gray-300 flex-1 border-[#38383A]'
                    }
                    onPress={() => setTextDensity('Brief')}
                  >
                    <Icon className="mr-2" icon="material-symbols:format-list-bulleted" />
                    Brief
                  </Button>
                  <Button
                    className={
                      textDensity === 'Medium'
                        ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white flex-1 border-[#38383A]'
                        : 'bg-[#232324] text-gray-300 flex-1 border-[#38383A]'
                    }
                    onPress={() => setTextDensity('Medium')}
                  >
                    <Icon className="mr-2" icon="material-symbols:format-list-bulleted" />
                    Medium
                  </Button>
                  <Button
                    className={
                      textDensity === 'Detailed'
                        ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white flex-1 border-[#38383A]'
                        : 'bg-[#232324] text-gray-300 flex-1 border-[#38383A]'
                    }
                    onPress={() => setTextDensity('Detailed')}
                  >
                    <Icon className="mr-2" icon="material-symbols:format-list-bulleted" />
                    Detailed
                  </Button>
                </ButtonGroup>
              </div>

              {/* Image Source */}
              <div className="mb-4">
                <p className="text-sm mb-2 text-gray-300">Image source</p>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      fullWidth
                      className="justify-between bg-[#232324] text-gray-300 border-[#38383A]"
                      endContent={
                        <Icon
                          className="text-gray-400"
                          icon={
                            showImageOptions
                              ? 'material-symbols:keyboard-arrow-up'
                              : 'material-symbols:keyboard-arrow-down'
                          }
                        />
                      }
                      startContent={
                        <Icon className="text-gray-400" icon="material-symbols:image" />
                      }
                      variant="flat"
                      onPress={() => setShowImageSourceModal(true)}
                    >
                      {imageSource}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Image Source"
                    className="w-full max-w-[400px]"
                    selectedKeys={[imageSource]}
                    selectionMode="single"
                    onAction={key => setImageSource(key.toString())}
                  >
                    {imageSources.map(source => (
                      <DropdownItem
                        key={source.key}
                        endContent={
                          source.isNew && (
                            <span className="bg-[#38383A] text-gray-300 text-xs py-0.5 px-1.5 rounded-full">
                              NEW
                            </span>
                          )
                        }
                        startContent={<Icon className="text-gray-400" icon={source.icon} />}
                      >
                        <div>
                          <div>{source.name}</div>
                          <div className="text-xs text-gray-400">{source.description}</div>
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>

              {/* AI Image Model - only show if AI images is selected */}
              {(imageSource === 'ai' || imageSource === 'automatic') && (
                <div className="mb-4">
                  <p className="text-sm mb-2 text-gray-300">AI image model</p>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        fullWidth
                        className="justify-between bg-[#232324] text-gray-300 border-[#38383A]"
                        endContent={
                          <Icon
                            className="text-gray-400"
                            icon={
                              showModelOptions
                                ? 'material-symbols:keyboard-arrow-up'
                                : 'material-symbols:keyboard-arrow-down'
                            }
                          />
                        }
                        startContent={
                          aiModel.includes('Flux') ? (
                            <Icon
                              className="text-gray-400"
                              icon="heroicons:cube-transparent"
                              width={18}
                            />
                          ) : aiModel.includes('Imagen') ? (
                            <Icon className="text-gray-400" icon="ri:star-fill" width={18} />
                          ) : aiModel.includes('Ideogram') ? (
                            <Icon className="text-gray-400" icon="ri:rhythm-fill" width={18} />
                          ) : aiModel.includes('Leonardo') ? (
                            <Icon className="text-gray-400" icon="ri:user-fill" width={18} />
                          ) : aiModel.includes('DALL') ? (
                            <Icon className="text-gray-400" icon="ri:shape-fill" width={18} />
                          ) : aiModel.includes('Recraft') ? (
                            <Icon className="text-gray-400" icon="ri:shape-2-fill" width={18} />
                          ) : (
                            <Icon
                              className="text-gray-400"
                              icon="material-symbols:auto-awesome"
                              width={18}
                            />
                          )
                        }
                        variant="flat"
                        onPress={() => setShowModelOptions(!showModelOptions)}
                      >
                        {aiModel}
                      </Button>
                    </DropdownTrigger>

                    <DropdownMenu
                      aria-label="AI Image Model"
                      className="w-full max-w-[400px]"
                      selectedKeys={[aiModel]}
                      selectionMode="single"
                      onAction={key => {
                        setSelectedModelPreview(key.toString());
                        setAiModel(key.toString());
                      }}
                    >
                      <DropdownSection title="Basic models">
                        {aiModelOptions.basic.map(model => (
                          <DropdownItem
                            key={model.key}
                            endContent={
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400">{model.provider}</span>
                                {aiModel === model.key && (
                                  <Icon
                                    className="text-gray-400 ml-1"
                                    icon="material-symbols:check"
                                    width={16}
                                  />
                                )}
                              </div>
                            }
                            startContent={
                              <div className="flex items-center justify-center w-8 h-8">
                                {model.key.includes('Flux') ? (
                                  <Icon
                                    className="text-gray-400"
                                    icon="heroicons:cube-transparent"
                                  />
                                ) : model.key.includes('Imagen') ? (
                                  <Icon className="text-gray-400" icon="ri:star-fill" />
                                ) : (
                                  <Icon
                                    className="text-gray-400"
                                    icon="material-symbols:auto-awesome"
                                  />
                                )}
                              </div>
                            }
                          >
                            {model.name}
                          </DropdownItem>
                        ))}
                      </DropdownSection>

                      <DropdownSection showDivider title="Advanced models">
                        {aiModelOptions.advanced.map(model => (
                          <DropdownItem
                            key={model.key}
                            endContent={
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-[#38383A] text-gray-300 px-1.5 py-0.5 rounded-full">
                                  PLUS
                                </span>
                                <span className="text-xs text-gray-400">{model.provider}</span>
                                {aiModel === model.key && (
                                  <Icon
                                    className="text-gray-400 ml-1"
                                    icon="material-symbols:check"
                                    width={16}
                                  />
                                )}
                              </div>
                            }
                            startContent={
                              <div className="flex items-center justify-center w-8 h-8">
                                {model.key.includes('Flux') ? (
                                  <Icon
                                    className="text-gray-400"
                                    icon="heroicons:cube-transparent"
                                  />
                                ) : model.key.includes('Ideogram') ? (
                                  <Icon className="text-gray-400" icon="ri:rhythm-fill" />
                                ) : model.key.includes('Imagen') ? (
                                  <Icon className="text-gray-400" icon="ri:star-fill" />
                                ) : model.key.includes('Leonardo') ? (
                                  <Icon className="text-gray-400" icon="ri:user-fill" />
                                ) : (
                                  <Icon
                                    className="text-gray-400"
                                    icon="material-symbols:auto-awesome"
                                  />
                                )}
                              </div>
                            }
                          >
                            {model.name}
                          </DropdownItem>
                        ))}
                      </DropdownSection>

                      <DropdownSection title="Premium models">
                        {aiModelOptions.premium.map(model => (
                          <DropdownItem
                            key={model.key}
                            endContent={
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-[#38383A] text-gray-300 px-1.5 py-0.5 rounded-full">
                                  PRO
                                </span>
                                <span className="text-xs text-gray-400">{model.provider}</span>
                                {aiModel === model.key && (
                                  <Icon
                                    className="text-gray-400 ml-1"
                                    icon="material-symbols:check"
                                    width={16}
                                  />
                                )}
                              </div>
                            }
                            startContent={
                              <div className="flex items-center justify-center w-8 h-8">
                                {model.key.includes('DALL-E') ? (
                                  <Icon className="text-gray-400" icon="ri:shape-fill" />
                                ) : model.key.includes('Flux') ? (
                                  <Icon
                                    className="text-gray-400"
                                    icon="heroicons:cube-transparent"
                                  />
                                ) : model.key.includes('Ideogram') ? (
                                  <Icon className="text-gray-400" icon="ri:rhythm-fill" />
                                ) : model.key.includes('Recraft') ? (
                                  <Icon className="text-gray-400" icon="ri:shape-2-fill" />
                                ) : (
                                  <Icon
                                    className="text-gray-400"
                                    icon="material-symbols:auto-awesome"
                                  />
                                )}
                              </div>
                            }
                          >
                            {model.name}
                          </DropdownItem>
                        ))}
                      </DropdownSection>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Theme Selection Modal */}
      <Modal
        hideCloseButton
        classNames={{
          backdrop: 'bg-[#00000099] backdrop-blur-sm',
          base: 'border-0 shadow-xl bg-[#1C1C1E]',
          header: 'border-b border-[#38383A]',
          body: 'p-0',
          footer: 'border-t border-[#38383A]',
          closeButton: 'hover:bg-white/5',
        }}
        isOpen={showThemeModal}
        size="5xl"
        onClose={() => setShowThemeModal(false)}
      >
        <ModalContent>
          {onClose => (
            <div className="flex flex-col h-[85vh] apple-dark">
              <div className="flex justify-between items-center p-6 border-b border-[#38383A]">
                <div>
                  <h2 className="text-xl font-bold text-white">All themes</h2>
                  <p className="text-gray-400 text-sm">View and select from all themes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    className="rounded-full text-gray-300 hover:bg-[#28282A]/50"
                    variant="light"
                    onPress={onClose}
                  >
                    <Icon icon="material-symbols:close" width={20} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-5 h-full">
                {/* Left panel - Theme Browser */}
                <div className="col-span-2 border-r border-[#38383A] overflow-auto p-6 bg-[#1C1C1E]">
                  <div className="mb-4">
                    <Input
                      className="mb-4 bg-[#232324] text-gray-300 border-[#38383A]"
                      placeholder="Search for a theme"
                      size="sm"
                      startContent={
                        <Icon className="text-gray-400" icon="material-symbols:search" />
                      }
                    />

                    <div className="flex gap-2 mb-6 overflow-x-auto">
                      <Button
                        className={
                          themeFilter === 'all'
                            ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                            : 'bg-[#232324] text-gray-300 border-[#38383A]'
                        }
                        radius="full"
                        size="sm"
                        variant={themeFilter === 'all' ? 'solid' : 'flat'}
                        onPress={() => setThemeFilter('all')}
                      >
                        All
                      </Button>
                      <Button
                        className={
                          themeFilter === 'dark'
                            ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                            : 'bg-[#232324] text-gray-300 border-[#38383A]'
                        }
                        radius="full"
                        size="sm"
                        variant={themeFilter === 'dark' ? 'solid' : 'flat'}
                        onPress={() => setThemeFilter('dark')}
                      >
                        Dark
                      </Button>
                      <Button
                        className={
                          themeFilter === 'light'
                            ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                            : 'bg-[#232324] text-gray-300 border-[#38383A]'
                        }
                        radius="full"
                        size="sm"
                        variant={themeFilter === 'light' ? 'solid' : 'flat'}
                        onPress={() => setThemeFilter('light')}
                      >
                        Light
                      </Button>
                      <Button
                        className={
                          themeFilter === 'professional'
                            ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                            : 'bg-[#232324] text-gray-300 border-[#38383A]'
                        }
                        radius="full"
                        size="sm"
                        variant={themeFilter === 'professional' ? 'solid' : 'flat'}
                        onPress={() => setThemeFilter('professional')}
                      >
                        Professional
                      </Button>
                      <Button
                        className={
                          themeFilter === 'colorful'
                            ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                            : 'bg-[#232324] text-gray-300 border-[#38383A]'
                        }
                        radius="full"
                        size="sm"
                        variant={themeFilter === 'colorful' ? 'solid' : 'flat'}
                        onPress={() => setThemeFilter('colorful')}
                      >
                        Colorful
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {themes
                      .filter(theme => {
                        if (themeFilter === 'all') return true;
                        if (themeFilter === 'dark') return theme.isDark;
                        if (themeFilter === 'light') return !theme.isDark;

                        // Additional filters could be implemented here
                        return true;
                      })
                      .map(theme => (
                        <Card
                          key={theme.id}
                          isPressable
                          className={`p-0 overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                            selectedTheme.id === theme.id
                              ? 'ring-1 ring-white/30 shadow-md'
                              : 'border border-[#38383A]/50'
                          }`}
                          shadow="none"
                          style={{ backgroundColor: '#232324' }}
                          onPress={() => handleThemeSelect(theme)}
                        >
                          <div className="flex flex-col h-full">
                            <div
                              className="p-4 relative"
                              style={{
                                backgroundColor: '#2C2C2E',
                                color: '#F2F2F2',
                              }}
                            >
                              <div
                                className="w-full h-1 absolute top-0 left-0 right-0"
                                style={{
                                  backgroundColor: theme.isDark
                                    ? theme.linkColor
                                    : theme.titleColor,
                                }}
                              />
                              <div className="font-semibold text-white">Title</div>
                              <div className="text-xs text-white opacity-80">
                                Body & <span style={{ color: theme.linkColor }}>link</span>
                              </div>
                            </div>
                            <div className="relative text-center text-xs py-2 px-1 bg-[#28282A] text-white/90">
                              {selectedTheme.id === theme.id && (
                                <Icon
                                  className="absolute left-1.5 top-1/2 -translate-y-1/2 text-white/80"
                                  icon="material-symbols:check"
                                  width={14}
                                />
                              )}
                              <span className={selectedTheme.id === theme.id ? 'ml-3' : ''}>
                                {theme.name}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Right panel - Theme Preview */}
                <div className="col-span-3 overflow-auto">
                  <div
                    className="h-full flex flex-col"
                    style={{
                      backgroundColor: selectedTheme.backgroundColor,
                      color: selectedTheme.bodyColor,
                    }}
                  >
                    <div className="flex-1 overflow-auto p-6">
                      <div className="max-w-2xl mx-auto">
                        <div className="mb-2 text-sm opacity-70">Hello 👋</div>

                        <h1
                          className="text-4xl font-bold mb-6"
                          style={{ color: selectedTheme.titleColor }}
                        >
                          This is a theme preview
                        </h1>

                        <div className="space-y-4 mb-8">
                          <p>
                            This is body text. You can change your fonts, colors and images later in
                            the theme editor. You can also create your own custom branded theme.
                          </p>

                          <p>
                            <a href="#" style={{ color: selectedTheme.linkColor }}>
                              This is a link
                            </a>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div
                            className="p-4 rounded-lg"
                            style={{
                              backgroundColor: selectedTheme.isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.05)',
                            }}
                          >
                            <p>This is a smart layout: it acts as a text box.</p>
                          </div>
                          <div
                            className="p-4 rounded-lg"
                            style={{
                              backgroundColor: selectedTheme.isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.05)',
                            }}
                          >
                            <p>You can get these by typing /smart</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            style={{
                              backgroundColor: selectedTheme.linkColor,
                              color: selectedTheme.backgroundColor,
                            }}
                          >
                            Primary button
                          </Button>
                          <Button
                            style={{
                              borderColor: selectedTheme.linkColor,
                              color: selectedTheme.linkColor,
                            }}
                            variant="bordered"
                          >
                            Secondary button
                          </Button>
                        </div>

                        <div className="mt-12 text-sm opacity-70">
                          <p>
                            This is body text. You can change your fonts, colors and images later in
                            the theme editor. You can also create your own custom branded theme.
                            What's more, you can create multiple themes and switch between them at
                            any time.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex justify-end gap-2 border-t border-[#38383A] bg-[#1C1C1E]">
                      <Button className="text-gray-300" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white border-[#38383A]"
                        onPress={() => {
                          // Apply the selected theme, save it, and close modal
                          localStorage.setItem('selectedThemeId', selectedTheme.id);
                          onClose();
                        }}
                      >
                        Select theme
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Image Selection Modal */}
      <Modal
        classNames={{
          backdrop: 'bg-[#00000099] backdrop-blur-sm',
          base: 'border-0 shadow-xl bg-[#1C1C1E]',
          header: 'border-b border-[#38383A]',
          body: 'p-6',
          footer: 'border-t border-[#38383A]',
          closeButton: 'hover:bg-white/5',
        }}
        isOpen={showImageSourceModal}
        onClose={() => setShowImageSourceModal(false)}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="border-b border-[#38383A] text-white">
                Select image source
              </ModalHeader>
              <ModalBody className="apple-dark">
                <RadioGroup
                  className="space-y-3"
                  value={imageSource}
                  onValueChange={setImageSource}
                >
                  <div className="space-y-1">
                    <Radio
                      classNames={{
                        base: 'inline-flex max-w-md cursor-pointer items-center data-[selected=true]:border-gray-400 border-2 border-[#38383A] rounded-lg gap-4 p-4 hover:bg-[#28282A] transition-colors data-[selected=true]:bg-[#28282A]',
                        label: 'text-white',
                      }}
                      value="unsplash"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-base text-white">Unsplash</p>
                        <p className="text-sm text-gray-400">High quality free stock photos</p>
                      </div>
                    </Radio>
                  </div>

                  <div className="space-y-1">
                    <Radio
                      classNames={{
                        base: 'inline-flex max-w-md cursor-pointer items-center data-[selected=true]:border-gray-400 border-2 border-[#38383A] rounded-lg gap-4 p-4 hover:bg-[#28282A] transition-colors data-[selected=true]:bg-[#28282A]',
                        label: 'text-white',
                      }}
                      value="pexels"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-base text-white">Pexels</p>
                        <p className="text-sm text-gray-400">Free stock photos and videos</p>
                      </div>
                    </Radio>
                  </div>

                  <div className="space-y-1">
                    <Radio
                      classNames={{
                        base: 'inline-flex max-w-md cursor-pointer items-center data-[selected=true]:border-gray-400 border-2 border-[#38383A] rounded-lg gap-4 p-4 hover:bg-[#28282A] transition-colors data-[selected=true]:bg-[#28282A]',
                        label: 'text-white',
                      }}
                      value="ai"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-base text-white">AI images</p>
                        <p className="text-sm text-gray-400">
                          Generate AI images based on slide content
                        </p>
                      </div>
                    </Radio>
                  </div>

                  <div className="space-y-1">
                    <Radio
                      classNames={{
                        base: 'inline-flex max-w-md cursor-pointer items-center data-[selected=true]:border-gray-400 border-2 border-[#38383A] rounded-lg gap-4 p-4 hover:bg-[#28282A] transition-colors data-[selected=true]:bg-[#28282A]',
                        label: 'text-white',
                      }}
                      value="automatic"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-base text-white">Automatic</p>
                        <p className="text-sm text-gray-400">
                          Use the best source for each slide automatically
                        </p>
                      </div>
                    </Radio>
                  </div>
                </RadioGroup>

                {(imageSource === 'ai' || imageSource === 'automatic') && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      AI image model
                    </label>
                    <Select
                      className="w-full bg-[#232324] text-gray-300 border-[#38383A]"
                      classNames={{
                        trigger: 'bg-[#232324] data-[hover=true]:bg-[#28282A] border-[#38383A]',
                        listbox: 'bg-[#232324] text-gray-300',
                        popoverContent: 'bg-[#232324] border-[#38383A]',
                      }}
                      label="Select model"
                      selectedKeys={new Set([imageModelId])}
                      onChange={e => setImageModelId(e.target.value)}
                    >
                      <SelectItem key="dall-e-3" className="text-gray-300">
                        DALL-E 3
                      </SelectItem>
                      <SelectItem key="stable-diffusion" className="text-gray-300">
                        Stable Diffusion
                      </SelectItem>
                      <SelectItem key="midjourney" className="text-gray-300">
                        Midjourney
                      </SelectItem>
                    </Select>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-[#38383A]">
                <Button className="text-gray-300" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white border-[#38383A]"
                  onPress={() => {
                    onClose();
                    // Save the image source preference
                    localStorage.setItem('imageSource', imageSource);
                    localStorage.setItem('imageModelId', imageModelId);
                  }}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Footer with Generate Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background z-10 border-t border-content2">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center text-default-500">
            <Icon className="mr-2" icon="material-symbols:toll" />
            <span>{credits} credits</span>
            <Tooltip content="Information about credits">
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="material-symbols:info" />
              </Button>
            </Tooltip>
          </div>
          <div className="text-default-500">{slides.length} cards total</div>
          <Button
            color="primary"
            isDisabled={isLoading || slides.length === 0}
            size="lg"
            startContent={<Icon icon="material-symbols:magic-button" />}
            onPress={handleGeneratePresentation}
          >
            Generate
          </Button>
        </div>
      </div>

      {/* Help Button */}
      <Button
        isIconOnly
        aria-label="Help"
        className="fixed bottom-20 right-6 z-10 bg-primary text-white"
        radius="full"
      >
        <Icon className="text-xl" icon="material-symbols:help" />
      </Button>

      {/* Extra space for scrolling */}
      <div className="h-32 mb-20" />
    </div>
  );
}

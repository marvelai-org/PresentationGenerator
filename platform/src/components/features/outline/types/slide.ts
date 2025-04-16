/**
 * Basic slide content type
 * Contains an ID and HTML content
 */
export interface SlideContent {
  id: number;
  content?: string; // Unified content as HTML including title and bullet points
  title?: string; // Optional title field for the slide
  bullets?: string[]; // Array of bullet points for outline view
}

/**
 * SlideContentItem represents a more detailed slide structure
 * Used in the editor for more control over individual elements
 */
export interface SlideContentItem {
  id: string;
  type: 'heading' | 'bulletPoint' | 'image' | 'code';
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Slide represents a complete slide with all metadata
 */
export interface Slide {
  id: number;
  title: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  content: SlideContentItem[];
  notes?: string;
  transitionType?: string;
  created?: string;
  updated?: string;
}

/**
 * Props for the SortableSlideCard component
 */
export interface SortableSlideCardProps {
  /** The slide data */
  slide: SlideContent;
  /** Callback for when a slide is deleted */
  onDelete: (id: number) => void;
  /** Callback for when slide content changes */
  onContentChange: (id: number, content: string) => void;
  /** ID of the slide that was most recently dropped (for highlighting) */
  recentlyDroppedId: number | null;
}

/**
 * Props for the UnifiedSlideEditor component
 */
export interface UnifiedSlideEditorProps {
  /** HTML content for the editor */
  content: string;
  /** Callback for when content changes */
  onChange: (value: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
}

/**
 * Props for the AddCardButton component
 */
export interface AddCardButtonProps {
  /** Callback for when the button is clicked */
  onClick: (index: number) => void;
  /** Index position where the new card should be inserted */
  index: number;
}

/**
 * Props for the DropIndicator component
 */
export interface DropIndicatorProps {
  /** Whether the indicator is active (visible) */
  isActive: boolean;
}

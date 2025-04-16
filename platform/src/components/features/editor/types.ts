import { TableData } from '@/types/editor';

// Basic slide content item
export interface SlideContentItem {
  id: string;
  type: string;
  value: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  style?: {
    color?: string;
    borderColor?: string;
    backgroundColor?: string;
    borderStyle?: string;
    borderWidth?: number;
    rotation?: number;
    opacity?: number;
    zIndex?: number;
  };
  tableData?: TableData;
  embedData?: EmbedData;
  imageUrl?: string;
}

// Slide structure
export interface Slide {
  id: number;
  title: string;
  backgroundColor: string;
  content: SlideContentItem[];
  subtitle?: string;
  author?: string;
  editedTime?: string;
  image?: string;
  gradient?: string;
  textColor?: string;
  shapes?: SlideContentItem[];
}

// Embed data structure
export interface EmbedData {
  type: string;
  url: string;
  html?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  provider?: string;
  aspectRatio?: number;
}

// Common Props
export interface EditorProps {
  presentationId?: string;
}

export interface SlideEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
  elementId?: string;
  initialFocus?: boolean;
}

export interface EditableSlideProps {
  slide: Slide;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (contentId: string, value: string) => void;
  onAddContent: () => void;
  onRemoveContent: (contentId: string) => void;
  onShapeSelect?: (shape: SlideContentItem | null) => void;
  onUpdateShape?: (shapeId: string, properties: Partial<SlideContentItem>) => void;
  onTableSelect?: (table: SlideContentItem | null) => void;
  onUpdateTable?: (tableId: string, tableData: TableData) => void;
  onEmbedSelect?: (embed: SlideContentItem | null) => void;
}

export interface SortableSlideProps {
  id: number;
  index: number;
  slide: Slide;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

// Theme and style related types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

// Modal state types
export interface EditorModalState {
  isMediaSelectorOpen: boolean;
  isShapeSelectorOpen: boolean;
  isTableSelectorOpen: boolean;
  isEmbedSelectorOpen: boolean;
  isCommandMenuOpen: boolean;
}

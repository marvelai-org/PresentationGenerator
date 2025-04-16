/**
 * Type definitions for the presentation editor
 * This file contains shared interfaces and types used across multiple editor components
 */

/**
 * Interface for a table cell
 */
export interface TableCell {
  id: string;
  content: string;
  rowspan?: number;
  colspan?: number;
  style?: {
    backgroundColor?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    borderTop?: string;
    borderRight?: string;
    borderBottom?: string;
    borderLeft?: string;
  };
}

/**
 * Interface for table data structure
 */
export interface TableData {
  rows: number;
  columns: number;
  cells: Record<string, TableCell>;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasHeaderColumn?: boolean;
  alternatingRows?: boolean;
  style?: {
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
    bodyBackgroundColor?: string;
    bodyTextColor?: string;
    footerBackgroundColor?: string;
    footerTextColor?: string;
    width?: number | string;
    height?: number | string;
  };
}

/**
 * Interface for table options when creating a new table
 */
export interface TableOptions {
  rows: number;
  columns: number;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasHeaderColumn?: boolean;
  alternatingRows?: boolean;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  bodyBackgroundColor?: string;
  bodyTextColor?: string;
  footerBackgroundColor?: string;
  footerTextColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
}

/**
 * Interface for embedded content data
 */
export interface EmbedData {
  id: string;
  type: string; // 'youtube', 'vimeo', 'loom', 'spotify', 'custom', etc.
  url: string;
  title: string;
  thumbnailUrl: string;
  embedHtml?: string;
  width: number;
  height: number;
  aspectRatio: string;
}

/**
 * Interface for a single content item within a slide
 */
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
}

/**
 * Interface for a full slide
 */
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

/**
 * Utility type for slide templates
 */
export type TemplateType =
  // Basic layouts
  | 'title'
  | 'textAndImage'
  | 'bulletList'
  | 'blankCard'
  | 'imageAndText'
  | 'textAndImage'
  | 'twoColumns'
  | 'twoColumnWithHeading'
  | 'threeColumns'
  | 'threeColumnWithHeading'
  | 'fourColumns'
  | 'titleWithBullets'
  | 'titleWithBulletsAndImage'

  // Card layouts
  | 'accentLeft'
  | 'accentRight'
  | 'accentTop'
  | 'accentRightFit'
  | 'accentLeftFit'
  | 'accentBackground'

  // Image-focused layouts
  | 'twoImageColumns'
  | 'threeImageColumns'
  | 'fourImageColumns'
  | 'imagesWithText'
  | 'imageGallery'
  | 'teamPhotos'

  // Collections and sequences
  | 'textBoxes'
  | 'timeline'
  | 'largeBulletList'
  | 'iconsWithText'
  | 'smallIconsWithText'
  | 'arrows';

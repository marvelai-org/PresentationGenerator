import { z } from 'zod';

/**
 * Zod schemas for the presentation editor
 * Provides runtime validation for editor-related types
 */

// Table Cell Schema
export const tableCellStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  color: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  fontWeight: z.enum(['normal', 'bold']).optional(),
  fontStyle: z.enum(['normal', 'italic']).optional(),
  textDecoration: z.enum(['none', 'underline']).optional(),
  borderTop: z.string().optional(),
  borderRight: z.string().optional(),
  borderBottom: z.string().optional(),
  borderLeft: z.string().optional(),
});

export const tableCellSchema = z.object({
  id: z.string(),
  content: z.string(),
  rowspan: z.number().optional(),
  colspan: z.number().optional(),
  style: tableCellStyleSchema.optional(),
});

// Table Style Schema
export const tableStyleSchema = z.object({
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
  borderStyle: z.string().optional(),
  headerBackgroundColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  bodyBackgroundColor: z.string().optional(),
  bodyTextColor: z.string().optional(),
  footerBackgroundColor: z.string().optional(),
  footerTextColor: z.string().optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
});

// Table Data Schema
export const tableDataSchema = z.object({
  rows: z.number(),
  columns: z.number(),
  cells: z.record(z.string(), tableCellSchema),
  hasHeader: z.boolean().optional(),
  hasFooter: z.boolean().optional(),
  hasHeaderColumn: z.boolean().optional(),
  alternatingRows: z.boolean().optional(),
  style: tableStyleSchema.optional(),
});

// Table Options Schema
export const tableOptionsSchema = z.object({
  rows: z.number(),
  columns: z.number(),
  hasHeader: z.boolean().optional(),
  hasFooter: z.boolean().optional(),
  hasHeaderColumn: z.boolean().optional(),
  alternatingRows: z.boolean().optional(),
  headerBackgroundColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  bodyBackgroundColor: z.string().optional(),
  bodyTextColor: z.string().optional(),
  footerBackgroundColor: z.string().optional(),
  footerTextColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
  borderStyle: z.string().optional(),
});

// Embed Data Schema
export const embedDataSchema = z.object({
  id: z.string(),
  type: z.string(),
  url: z.string().url(),
  title: z.string(),
  thumbnailUrl: z.string().url(),
  embedHtml: z.string().optional(),
  width: z.number(),
  height: z.number(),
  aspectRatio: z.string(),
});

// Slide Content Item Style Schema
export const slideContentItemStyleSchema = z.object({
  color: z.string().optional(),
  borderColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderStyle: z.string().optional(),
  borderWidth: z.number().optional(),
  rotation: z.number().optional(),
  opacity: z.number().optional(),
  zIndex: z.number().optional(),
});

// Base Slide Content Item Schema
const baseSlideContentItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  value: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  style: slideContentItemStyleSchema.optional(),
});

// Slide Content Item Discriminated Union
export const slideContentItemSchema = z.discriminatedUnion('type', [
  // Text content item
  baseSlideContentItemSchema.extend({
    type: z.literal('text'),
  }),
  
  // Image content item
  baseSlideContentItemSchema.extend({
    type: z.literal('image'),
  }),
  
  // Table content item
  baseSlideContentItemSchema.extend({
    type: z.literal('table'),
    tableData: tableDataSchema,
  }),
  
  // Embed content item
  baseSlideContentItemSchema.extend({
    type: z.literal('embed'),
    embedData: embedDataSchema,
  }),
  
  // Bullet list content item
  baseSlideContentItemSchema.extend({
    type: z.literal('bulletList'),
  }),
  
  // Shape content item
  baseSlideContentItemSchema.extend({
    type: z.literal('shape'),
    shapeType: z.enum(['rectangle', 'circle', 'triangle', 'line', 'arrow']),
  }),
  
  // Chart content item
  baseSlideContentItemSchema.extend({
    type: z.literal('chart'),
    chartType: z.enum(['bar', 'line', 'pie', 'scatter', 'area']),
    chartData: z.record(z.any()),
  }),
]);

// Template Type Schema
export const templateTypeSchema = z.enum([
  // Basic layouts
  'title',
  'textAndImage',
  'bulletList',
  'blankCard',
  'imageAndText',
  'twoColumns',
  'twoColumnWithHeading',
  'threeColumns',
  'threeColumnWithHeading',
  'fourColumns',
  'titleWithBullets',
  'titleWithBulletsAndImage',
  // Card layouts
  'accentLeft',
  'accentRight',
  'accentTop',
  'accentRightFit',
  'accentLeftFit',
  'accentBackground',
  // Image-focused layouts
  'twoImageColumns',
  'threeImageColumns',
  'fourImageColumns',
  'imagesWithText',
  'imageGallery',
  'teamPhotos',
  // Collections and sequences
  'textBoxes',
  'timeline',
  'largeBulletList',
  'iconsWithText',
  'smallIconsWithText',
  'arrows',
]);

// Slide Schema
export const slideSchema = z.object({
  id: z.number(),
  title: z.string(),
  backgroundColor: z.string(),
  content: z.array(slideContentItemSchema),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  editedTime: z.string().optional(),
  image: z.string().optional(),
  gradient: z.string().optional(),
  textColor: z.string().optional(),
  shapes: z.array(slideContentItemSchema).optional(),
});

// Export type definitions derived from Zod schemas
export type TableCellStyle = z.infer<typeof tableCellStyleSchema>;
export type TableCell = z.infer<typeof tableCellSchema>;
export type TableStyle = z.infer<typeof tableStyleSchema>;
export type TableData = z.infer<typeof tableDataSchema>;
export type TableOptions = z.infer<typeof tableOptionsSchema>;
export type EmbedData = z.infer<typeof embedDataSchema>;
export type SlideContentItemStyle = z.infer<typeof slideContentItemStyleSchema>;
export type SlideContentItem = z.infer<typeof slideContentItemSchema>;
export type TemplateType = z.infer<typeof templateTypeSchema>;
export type Slide = z.infer<typeof slideSchema>; 
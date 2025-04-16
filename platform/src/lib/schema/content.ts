import { z } from 'zod';

/**
 * Enhanced schema definitions with discriminated unions
 * This file demonstrates more complex type relationships
 */

// Base content schema with shared properties
const baseContentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// ------------- TEXT CONTENT TYPES -------------

/**
 * Text content formatting schema
 */
export const textFormattingSchema = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  superscript: z.boolean().optional(),
  subscript: z.boolean().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right', 'justify']).optional(),
  fontSize: z.number().optional(),
  fontFamily: z.string().optional(),
});

/**
 * Heading content
 */
export const headingContentSchema = baseContentSchema.extend({
  type: z.literal('heading'),
  level: z.number().int().min(1).max(6),
  text: z.string(),
  formatting: textFormattingSchema.optional(),
});

/**
 * Paragraph content
 */
export const paragraphContentSchema = baseContentSchema.extend({
  type: z.literal('paragraph'),
  text: z.string(),
  formatting: textFormattingSchema.optional(),
});

/**
 * List content
 */
export const listContentSchema = baseContentSchema.extend({
  type: z.literal('list'),
  style: z.enum(['bullet', 'numbered', 'check']),
  items: z.array(z.object({
    text: z.string(),
    formatting: textFormattingSchema.optional(),
    indent: z.number().int().min(0).max(5).optional(),
  })),
});

// ------------- MEDIA CONTENT TYPES -------------

/**
 * Image content
 */
export const imageContentSchema = baseContentSchema.extend({
  type: z.literal('image'),
  url: z.string().url(),
  altText: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  aspectRatio: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']).optional(),
});

/**
 * Video content
 */
export const videoContentSchema = baseContentSchema.extend({
  type: z.literal('video'),
  source: z.enum(['youtube', 'vimeo', 'custom']),
  url: z.string().url(),
  title: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  aspectRatio: z.string().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  muted: z.boolean().optional(),
});

/**
 * Audio content
 */
export const audioContentSchema = baseContentSchema.extend({
  type: z.literal('audio'),
  url: z.string().url(),
  title: z.string(),
  artist: z.string().optional(),
  album: z.string().optional(),
  duration: z.number().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  controls: z.boolean().optional(),
});

// ------------- INTERACTIVE CONTENT TYPES -------------

/**
 * Form element type
 */
export const formElementSchema = z.discriminatedUnion('elementType', [
  z.object({
    elementType: z.literal('text'),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    defaultValue: z.string().optional(),
    validation: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
    }).optional(),
  }),
  z.object({
    elementType: z.literal('textarea'),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    rows: z.number().optional(),
    defaultValue: z.string().optional(),
  }),
  z.object({
    elementType: z.literal('select'),
    label: z.string(),
    options: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })),
    required: z.boolean().optional(),
    defaultValue: z.string().optional(),
  }),
  z.object({
    elementType: z.literal('checkbox'),
    label: z.string(),
    defaultChecked: z.boolean().optional(),
  }),
  z.object({
    elementType: z.literal('radio'),
    label: z.string(),
    options: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })),
    defaultValue: z.string().optional(),
  }),
]);

/**
 * Form content
 */
export const formContentSchema = baseContentSchema.extend({
  type: z.literal('form'),
  title: z.string(),
  description: z.string().optional(),
  elements: z.array(formElementSchema),
  submitLabel: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
  submitAction: z.object({
    type: z.enum(['email', 'webhook', 'custom']),
    destination: z.string(),
  }),
});

/**
 * Chart type
 */
export const chartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(z.object({
    label: z.string(),
    data: z.array(z.number()),
    backgroundColor: z.union([z.string(), z.array(z.string())]).optional(),
    borderColor: z.union([z.string(), z.array(z.string())]).optional(),
  })),
});

/**
 * Chart content
 */
export const chartContentSchema = baseContentSchema.extend({
  type: z.literal('chart'),
  chartType: z.enum(['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'scatter', 'bubble']),
  data: chartDataSchema,
  options: z.record(z.string(), z.any()).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  aspectRatio: z.string().optional(),
});

// ------------- COMBINED CONTENT TYPES -------------

/**
 * Combined content schema using discriminated union
 */
export const contentSchema = z.discriminatedUnion('type', [
  headingContentSchema,
  paragraphContentSchema,
  listContentSchema,
  imageContentSchema,
  videoContentSchema,
  audioContentSchema,
  formContentSchema,
  chartContentSchema,
]);

/**
 * Content container schema
 */
export const contentContainerSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  contents: z.array(contentSchema),
  layout: z.enum(['standard', 'grid', 'masonry', 'carousel']).optional(),
  settings: z.object({
    maxWidth: z.string().optional(),
    padding: z.string().optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
  }).optional(),
});

// ------------- TYPE EXPORTS -------------

export type TextFormatting = z.infer<typeof textFormattingSchema>;
export type HeadingContent = z.infer<typeof headingContentSchema>;
export type ParagraphContent = z.infer<typeof paragraphContentSchema>;
export type ListContent = z.infer<typeof listContentSchema>;
export type ImageContent = z.infer<typeof imageContentSchema>;
export type VideoContent = z.infer<typeof videoContentSchema>;
export type AudioContent = z.infer<typeof audioContentSchema>;
export type FormElement = z.infer<typeof formElementSchema>;
export type FormContent = z.infer<typeof formContentSchema>;
export type ChartData = z.infer<typeof chartDataSchema>;
export type ChartContent = z.infer<typeof chartContentSchema>;
export type Content = z.infer<typeof contentSchema>;
export type ContentContainer = z.infer<typeof contentContainerSchema>; 
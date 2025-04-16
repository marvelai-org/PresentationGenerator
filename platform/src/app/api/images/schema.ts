import { z } from 'zod';

/**
 * Schema for a slide requiring image generation
 */
export const slideForImageSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  template: z.string().default('standard'),
  image_prompt: z.string().optional(),
  bullet_points: z.array(z.string()).optional(),
});

/**
 * Request schema for generating images
 */
export const generateImagesRequestSchema = z.object({
  slides: z.array(slideForImageSchema).min(1, "At least one slide is required"),
});

/**
 * Schema for a generated image result
 */
export const generatedImageSchema = z.object({
  slide_index: z.number().int().nonnegative(),
  image_url: z.string().url(),
  alt_text: z.string(),
  prompt_used: z.string().optional(),
});

/**
 * Response schema for image generation
 */
export const generateImagesResponseSchema = z.object({
  images: z.array(generatedImageSchema),
});

// Export TypeScript types derived from schemas
export type SlideForImage = z.infer<typeof slideForImageSchema>;
export type GenerateImagesRequest = z.infer<typeof generateImagesRequestSchema>;
export type GeneratedImage = z.infer<typeof generatedImageSchema>;
export type GenerateImagesResponse = z.infer<typeof generateImagesResponseSchema>; 
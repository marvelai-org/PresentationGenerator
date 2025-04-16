import { z } from 'zod';

/**
 * Request schema for generating slides content
 */
export const generateSlidesRequestSchema = z.object({
  slides_titles: z.array(z.string()).min(1, "At least one slide title is required"),
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  instructional_level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  lang: z.string().min(2).max(10).default("en"),
});

/**
 * Schema for a single slide in the response
 */
export const slideResponseSchema = z.object({
  title: z.string(),
  template: z.string(),
  content: z.string(),
  bullet_points: z.array(z.string()).optional(),
  image_prompt: z.string().optional(),
});

/**
 * Response schema for slide generation
 */
export const generateSlidesResponseSchema = z.object({
  slides: z.array(slideResponseSchema),
});

// Export TypeScript types derived from schemas
export type GenerateSlidesRequest = z.infer<typeof generateSlidesRequestSchema>;
export type SlideResponse = z.infer<typeof slideResponseSchema>;
export type GenerateSlidesResponse = z.infer<typeof generateSlidesResponseSchema>; 
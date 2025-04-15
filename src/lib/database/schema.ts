import { z } from 'zod';

/**
 * Schema definitions for database tables
 * Used for validation and type checking
 */

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().optional(),
  avatar_url: z.string().url().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  bio: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Presentation Schema
export const PresentationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_private: z.boolean().default(true),
  slides: z.array(z.any()).optional().nullable(),
  template_id: z.string().optional().nullable(),
  cover_image_url: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

export type Presentation = z.infer<typeof PresentationSchema>;

// Slide Schema
export const SlideSchema = z.object({
  id: z.string().uuid(),
  presentation_id: z.string().uuid(),
  index: z.number().int().nonnegative(),
  content: z.record(z.any()).optional().nullable(),
  layout: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Slide = z.infer<typeof SlideSchema>;

// Template Schema
export const TemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  preview_image_url: z.string().url().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_default: z.boolean().default(false),
  styles: z.record(z.any()).optional().nullable(),
});

export type Template = z.infer<typeof TemplateSchema>;

/**
 * SQL for creating the necessary tables in Supabase
 */
export const createPresentationsTableSQL = `
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_private BOOLEAN NOT NULL DEFAULT true,
  slides JSONB,
  template_id UUID,
  cover_image_url TEXT,
  tags TEXT[]
);

-- Add indexes
CREATE INDEX IF NOT EXISTS presentations_user_id_idx ON presentations(user_id);
CREATE INDEX IF NOT EXISTS presentations_updated_at_idx ON presentations(updated_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own presentations
CREATE POLICY "Users can view their own presentations"
ON presentations FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own presentations
CREATE POLICY "Users can insert their own presentations"
ON presentations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own presentations
CREATE POLICY "Users can update their own presentations"
ON presentations FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own presentations
CREATE POLICY "Users can delete their own presentations"
ON presentations FOR DELETE
USING (auth.uid() = user_id);
`;

// Function to validate presentation data from Supabase
export function validatePresentation(data: unknown): Presentation | null {
  try {
    return PresentationSchema.parse(data);
  } catch (error) {
    console.error('Invalid presentation data:', error);
    return null;
  }
}

// Function to validate user profile data from Supabase
export function validateUserProfile(data: unknown): UserProfile | null {
  try {
    return UserProfileSchema.parse(data);
  } catch (error) {
    console.error('Invalid user profile data:', error);
    return null;
  }
} 
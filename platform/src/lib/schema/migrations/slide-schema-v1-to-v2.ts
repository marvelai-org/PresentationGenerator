import { z } from 'zod';
import { createVersionedSchema, migrateSchema } from '../migration';

/**
 * Example of schema migration - Slide Schema v1 to v2
 * This file demonstrates how to handle schema evolution over time
 */

// ========== Version 1 of the Slide Schema ==========
export const slideSchemaV1 = z.object({
  id: z.number(),
  title: z.string(),
  backgroundColor: z.string(),
  content: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      value: z.string(),
      x: z.number().optional(),
      y: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
  ),
  subtitle: z.string().optional(),
});

export const slideSchemaVersionV1 = createVersionedSchema('1.0.0', slideSchemaV1);
export type SlideV1 = z.infer<typeof slideSchemaV1>;

// ========== Version 2 of the Slide Schema ==========
// New features added:
// 1. Added textColor property
// 2. Added gradient property
// 3. Added author property
// 4. Enhanced content items with style property
export const slideSchemaV2 = z.object({
  id: z.number(),
  title: z.string(),
  backgroundColor: z.string(),
  content: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      value: z.string(),
      x: z.number().optional(),
      y: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      // New style property in V2
      style: z.object({
        color: z.string().optional(),
        borderColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        borderStyle: z.string().optional(),
        borderWidth: z.number().optional(),
        rotation: z.number().optional(),
        opacity: z.number().optional(),
        zIndex: z.number().optional(),
      }).optional(),
    })
  ),
  subtitle: z.string().optional(),
  // New properties in V2
  author: z.string().optional(),
  textColor: z.string().optional(),
  gradient: z.string().optional(),
  editedTime: z.string().datetime().optional(),
});

export const slideSchemaVersionV2 = createVersionedSchema('2.0.0', slideSchemaV2);
export type SlideV2 = z.infer<typeof slideSchemaV2>;

/**
 * Migrate slide data from V1 to V2 schema
 */
export function migrateSlideV1toV2(slideV1: SlideV1): SlideV2 {
  // Custom transformations for V1 to V2 migration
  const transformations = {
    // Add default text color based on background color
    'backgroundColor': (bgColor: string) => {
      // Simple transformation to add a default textColor based on backgroundColor
      // In a real app, this would be more sophisticated
      const isDark = bgColor.toLowerCase() === '#000000' || bgColor.toLowerCase() === 'black';
      return bgColor; // Keep the original backgroundColor
    }
  };
  
  // Perform the migration
  const result = migrateSchema(
    slideV1, 
    slideSchemaVersionV1, 
    slideSchemaVersionV2,
    {
      transformations,
      debug: true
    }
  );
  
  // Handle migration errors
  if (!result.success || !result.data) {
    console.error('Failed to migrate slide from V1 to V2:', result.error);
    
    // Fallback: manually construct a V2 slide with required fields
    return {
      id: slideV1.id,
      title: slideV1.title,
      backgroundColor: slideV1.backgroundColor,
      content: slideV1.content.map(item => ({
        ...item,
        style: {}
      })),
      subtitle: slideV1.subtitle,
      // Default values for new fields
      textColor: '#333333',
      gradient: undefined,
      author: undefined,
      editedTime: new Date().toISOString(),
    };
  }
  
  // Add some default values not handled by the migration
  const migratedSlide = result.data;
  
  // Default textColor if not set by transformation
  if (!migratedSlide.textColor) {
    const isDark = migratedSlide.backgroundColor.toLowerCase() === '#000000' || 
                  migratedSlide.backgroundColor.toLowerCase() === 'black';
    migratedSlide.textColor = isDark ? '#ffffff' : '#333333';
  }
  
  // Set edit time
  if (!migratedSlide.editedTime) {
    migratedSlide.editedTime = new Date().toISOString();
  }
  
  return migratedSlide;
}

/**
 * Usage example:
 * 
 * // Legacy slide data in V1 format
 * const legacySlide: SlideV1 = {
 *   id: 1,
 *   title: "Introduction",
 *   backgroundColor: "#ffffff",
 *   content: [
 *     { id: "content1", type: "text", value: "Hello World", x: 10, y: 20 }
 *   ],
 *   subtitle: "Getting Started"
 * };
 * 
 * // Migrate to V2
 * const migratedSlide = migrateSlideV1toV2(legacySlide);
 * console.log(migratedSlide);
 */ 
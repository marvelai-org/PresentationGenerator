/**
 * Schema and validation utilities index
 * This file exports all schema-related functionality from a central location
 */

// Zod schemas
export * from './editor';
export * from './content';

// Migration utilities
export * from './migration';

// Database schemas
export { 
  UserProfileSchema,
  PresentationSchema,
  SlideSchema,
  TemplateSchema,
  validatePresentation,
  validateUserProfile,
  validateSlide,
  validateTemplate
} from '../database/schema';

// Specific schemas for API endpoints
export * from '@/app/api/slides/schema';
export * from '@/app/api/images/schema';

// Versioned schemas and migrations
export * from './migrations/slide-schema-v1-to-v2';

// Form validation - re-export for convenience
export { 
  validateData,
  validateRequest,
  safeParse,
  validatePartial
} from '../validation';

// Validation error types
export type { ValidationError } from '../validation';

// Validation middleware
export {
  withValidation,
  withQueryValidation
} from '../middlewares/withValidation';

/**
 * Type utilities for schemas
 */

import { z } from 'zod';

/**
 * Extract the inferred type from a Zod schema
 */
export type InferSchema<T extends z.ZodType> = z.infer<T>;

/**
 * Create a partial version of a schema type
 */
export type PartialSchema<T extends z.ZodType> = Partial<z.infer<T>>;

/**
 * Create an array version of a schema type
 */
export type ArraySchema<T extends z.ZodType> = z.infer<T>[];

/**
 * Create a schema with required ID field
 */
export type WithId<T> = T & { id: string };

/**
 * Create a schema with timestamps
 */
export type WithTimestamps<T> = T & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

/**
 * Create schema with both ID and timestamps
 */
export type WithIdAndTimestamps<T> = WithId<WithTimestamps<T>>;

/**
 * Create a deep partial type
 */
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T; 
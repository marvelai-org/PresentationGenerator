import { z } from 'zod';

/**
 * Validation helpers for handling data at application boundaries
 */

// Standard error message format
export interface ValidationError {
  message: string;
  path?: string[];
  errors?: Record<string, string>;
}

/**
 * Validates data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns An object with success flag and either validated data or errors
 */
export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: ValidationError } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      let message = 'Validation error';
      let path: string[] | undefined;
      
      err.errors.forEach((e) => {
        const key = e.path.join('.');
        errors[key] = e.message;
        // Use the first error as the main message
        if (!path) {
          message = e.message;
          path = e.path;
        }
      });
      
      return { 
        success: false, 
        error: { 
          message, 
          path, 
          errors 
        } 
      };
    }
    
    return { 
      success: false, 
      error: { 
        message: 'Unknown validation error' 
      } 
    };
  }
}

/**
 * Validates request data in an API handler
 * 
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns An object with success flag and either validated data or errors
 */
export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: ValidationError; status: number } {
  const result = validateData(schema, data);
  
  if (!result.success) {
    return {
      ...result,
      status: 400 // Bad Request
    };
  }
  
  return result;
}

/**
 * Safe parse for Zod schemas with typed error handling
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns An object with success flag and either validated data or formatted errors
 */
export function safeParse<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: ValidationError } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    let message = 'Validation error';
    let path: string[] | undefined;
    
    result.error.errors.forEach((e) => {
      const key = e.path.join('.');
      errors[key] = e.message;
      // Use the first error as the main message
      if (!path) {
        message = e.message;
        path = e.path;
      }
    });
    
    return { 
      success: false, 
      error: { 
        message, 
        path, 
        errors 
      } 
    };
  }
  
  return { success: true, data: result.data };
}

/**
 * Validates partial data against a Zod schema
 * Useful for validating updates where only some fields are present
 * 
 * @param schema The Zod schema to validate against
 * @param data The partial data to validate
 * @returns An object with success flag and either validated data or errors
 */
export function validatePartial<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: Partial<z.infer<T>> } | { success: false; error: ValidationError } {
  // Create a partial version of the schema
  const partialSchema = schema.partial();
  return validateData(partialSchema, data);
} 
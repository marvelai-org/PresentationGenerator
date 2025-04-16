import { z } from 'zod';

/**
 * Schema migration utilities
 * These utilities help handle schema evolution over time
 */

/**
 * Options for schema migration
 */
export interface MigrationOptions {
  /**
   * Whether to remove extra fields not defined in the schema
   * @default true
   */
  stripExtraFields?: boolean;
  
  /**
   * Whether to fill missing fields with default values
   * @default true
   */
  fillDefaults?: boolean;
  
  /**
   * Custom transformations to apply during migration
   */
  transformations?: Record<string, (value: any) => any>;
  
  /**
   * Whether to log migration issues
   * @default false
   */
  debug?: boolean;
}

/**
 * Default migration options
 */
const defaultOptions: Required<MigrationOptions> = {
  stripExtraFields: true,
  fillDefaults: true,
  transformations: {},
  debug: false,
};

/**
 * A version tag for schema migrations
 * Allows tracking which version of a schema was used
 */
export interface SchemaVersion<T> {
  version: string;
  schema: z.ZodType<T>;
}

/**
 * Create a versioned schema
 * 
 * @param version Version identifier (e.g., "1.0.0")
 * @param schema The Zod schema
 * @returns A schema version object
 */
export function createVersionedSchema<T>(
  version: string,
  schema: z.ZodType<T>
): SchemaVersion<T> {
  return {
    version,
    schema,
  };
}

/**
 * Result of a migration operation
 */
export interface MigrationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  changes?: Array<{
    path: string[];
    type: 'added' | 'removed' | 'transformed';
    before?: any;
    after?: any;
  }>;
}

/**
 * Migrate data from one schema version to another
 * 
 * @param data The data to migrate
 * @param fromSchema The source schema version
 * @param toSchema The target schema version
 * @param options Migration options
 * @returns Migration result with success flag and transformed data or error
 */
export function migrateSchema<T, U>(
  data: T,
  fromSchema: SchemaVersion<T>,
  toSchema: SchemaVersion<U>,
  options: MigrationOptions = {}
): MigrationResult<U> {
  const opts = { ...defaultOptions, ...options };
  const changes: MigrationResult<U>['changes'] = [];
  
  try {
    // First validate that the input data matches the source schema
    fromSchema.schema.parse(data);
    
    // Clone the data to avoid mutations
    let migratedData = JSON.parse(JSON.stringify(data));
    
    // Get target schema shape to understand its structure
    // This is a workaround as Zod doesn't expose schema structure directly
    const dummyData = toSchema.schema.safeParse({});
    const targetShape = !dummyData.success 
      ? extractShapeFromError(dummyData.error)
      : {};
    
    // Apply transformations
    if (opts.transformations) {
      for (const [path, transformer] of Object.entries(opts.transformations)) {
        const pathParts = path.split('.');
        
        // Get the value at the path
        let value = getNestedValue(migratedData, pathParts);
        
        if (value !== undefined) {
          // Transform the value
          const newValue = transformer(value);
          
          // Set the transformed value
          setNestedValue(migratedData, pathParts, newValue);
          
          changes.push({
            path: pathParts,
            type: 'transformed',
            before: value,
            after: newValue,
          });
        }
      }
    }
    
    // Strip extra fields if configured
    if (opts.stripExtraFields) {
      migratedData = stripExtraFields(migratedData, targetShape, [], changes);
    }
    
    // Fill default values if configured
    if (opts.fillDefaults) {
      migratedData = fillDefaultValues(migratedData, toSchema.schema, [], changes);
    }
    
    // Validate the migrated data against the target schema
    const result = toSchema.schema.safeParse(migratedData);
    
    if (!result.success) {
      if (opts.debug) {
        console.error('Migration validation failed:', result.error);
      }
      return {
        success: false,
        error: 'Failed to validate migrated data against target schema',
        changes,
      };
    }
    
    return {
      success: true,
      data: result.data,
      changes,
    };
  } catch (error) {
    if (opts.debug) {
      console.error('Migration error:', error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown migration error',
      changes,
    };
  }
}

/**
 * Extract shape information from Zod error
 * This is a helper function to understand schema structure from errors
 */
function extractShapeFromError(error: z.ZodError): Record<string, any> {
  const shape: Record<string, any> = {};
  
  for (const issue of error.errors) {
    if (issue.path.length > 0) {
      const [first, ...rest] = issue.path;
      if (rest.length === 0) {
        shape[first] = true;
      } else {
        shape[first] = shape[first] || {};
        let current = shape[first];
        for (let i = 0; i < rest.length - 1; i++) {
          const key = rest[i];
          current[key] = current[key] || {};
          current = current[key];
        }
        current[rest[rest.length - 1]] = true;
      }
    }
  }
  
  return shape;
}

/**
 * Get a nested value from an object using a path
 */
function getNestedValue(obj: any, path: string[]): any {
  let current = obj;
  
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * Set a nested value in an object using a path
 */
function setNestedValue(obj: any, path: string[], value: any): void {
  if (path.length === 0) return;
  
  let current = obj;
  
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[path[path.length - 1]] = value;
}

/**
 * Strip fields not in the target schema
 */
function stripExtraFields(
  data: any,
  shape: Record<string, any>,
  path: string[] = [],
  changes: MigrationResult<any>['changes'] = []
): any {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map((item, index) => 
      stripExtraFields(item, shape, [...path, index.toString()], changes)
    );
  }
  
  const result: Record<string, any> = {};
  
  // Copy fields that exist in the shape
  for (const key of Object.keys(shape)) {
    if (key in data) {
      const nestedShape = shape[key] === true ? {} : shape[key];
      result[key] = stripExtraFields(
        data[key],
        nestedShape,
        [...path, key],
        changes
      );
    }
  }
  
  // Track removed fields
  for (const key of Object.keys(data)) {
    if (!(key in shape) && data[key] !== undefined) {
      changes.push({
        path: [...path, key],
        type: 'removed',
        before: data[key],
      });
    }
  }
  
  return result;
}

/**
 * Fill in default values from the schema
 */
function fillDefaultValues(
  data: any,
  schema: z.ZodType<any>,
  path: string[] = [],
  changes: MigrationResult<any>['changes'] = []
): any {
  // This is a simplified implementation
  // For full default value handling, you would need to analyze the schema
  // and extract default values, which is complex with Zod's internal structure
  
  // Here we're just creating a dummy object with all undefined values
  // and seeing what Zod fills in with defaults
  const template = createTemplateFromData(data);
  const defaultsResult = schema.safeParse(template);
  
  if (!defaultsResult.success) {
    return data;
  }
  
  const defaults = defaultsResult.data;
  return mergeWithDefaults(data, defaults, path, changes);
}

/**
 * Create a template object matching the structure of data but with undefined values
 */
function createTemplateFromData(data: any): any {
  if (data === null || typeof data !== 'object') {
    return undefined;
  }
  
  if (Array.isArray(data)) {
    return data.map(createTemplateFromData);
  }
  
  const result: Record<string, any> = {};
  
  for (const key of Object.keys(data)) {
    if (typeof data[key] === 'object' && data[key] !== null) {
      result[key] = createTemplateFromData(data[key]);
    } else {
      result[key] = undefined;
    }
  }
  
  return result;
}

/**
 * Merge data with defaults
 */
function mergeWithDefaults(
  data: any,
  defaults: any,
  path: string[] = [],
  changes: MigrationResult<any>['changes'] = []
): any {
  if (data === null || defaults === null || typeof data !== 'object' || typeof defaults !== 'object') {
    return data;
  }
  
  if (Array.isArray(data) && Array.isArray(defaults)) {
    return data.map((item, index) => 
      mergeWithDefaults(item, defaults[index], [...path, index.toString()], changes)
    );
  }
  
  const result = { ...data };
  
  // Add missing fields with default values
  for (const key of Object.keys(defaults)) {
    if (!(key in result)) {
      result[key] = defaults[key];
      changes.push({
        path: [...path, key],
        type: 'added',
        after: defaults[key],
      });
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = mergeWithDefaults(
        result[key],
        defaults[key],
        [...path, key],
        changes
      );
    }
  }
  
  return result;
} 
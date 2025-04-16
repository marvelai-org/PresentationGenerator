import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateRequest } from '../validation';

type RouteHandler<T> = (
  req: NextRequest, 
  validatedData: T
) => Promise<NextResponse> | NextResponse;

/**
 * Middleware for validating request bodies with Zod schemas
 * 
 * @param schema Zod schema to validate against
 * @param handler Route handler function that receives validated data
 * @returns API route handler with validation
 */
export function withValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: RouteHandler<z.infer<T>>
) {
  return async function validatedRoute(req: NextRequest) {
    try {
      const body = await req.json();
      const validatedData = schema.parse(body);
      
      return handler(req, validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Validation failed', 
            details: error.format() 
          }, 
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request' 
        }, 
        { status: 400 }
      );
    }
  };
}

/**
 * Middleware for validating URL query parameters with Zod schemas
 * 
 * @param schema Zod schema to validate query parameters against
 * @param handler Route handler function that receives validated query params
 * @returns API route handler with query validation
 */
export function withQueryValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: RouteHandler<z.infer<T>>
) {
  return async function validatedQueryRoute(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const queryParams: Record<string, string> = {};
      
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      
      const validatedData = schema.parse(queryParams);
      
      return handler(req, validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Query validation failed', 
            details: error.format() 
          }, 
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters' 
        }, 
        { status: 400 }
      );
    }
  };
}

/**
 * Middleware for validating both request body and query parameters
 * 
 * @param bodySchema Schema for validating request body
 * @param querySchema Schema for validating query parameters
 * @param handler Route handler that receives validated body and query params
 * @returns API route handler with full validation
 */
export function withFullValidation<
  B extends z.ZodTypeAny,
  Q extends z.ZodTypeAny
>(
  bodySchema: B,
  querySchema: Q,
  handler: (
    req: NextRequest, 
    validatedBody: z.infer<B>, 
    validatedQuery: z.infer<Q>
  ) => Promise<NextResponse> | NextResponse
) {
  return async function validatedFullRoute(req: NextRequest) {
    try {
      // Validate query parameters
      const url = new URL(req.url);
      const queryParams: Record<string, string> = {};
      
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      
      const validatedQuery = querySchema.parse(queryParams);
      
      // Validate body
      const body = await req.json();
      const validatedBody = bodySchema.parse(body);
      
      return handler(req, validatedBody, validatedQuery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Validation failed', 
            details: error.format() 
          }, 
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request' 
        }, 
        { status: 400 }
      );
    }
  };
}

/**
 * Example usage:
 * 
 * // Define a schema for the request body
 * const createUserSchema = z.object({
 *   name: z.string().min(2),
 *   email: z.string().email(),
 *   age: z.number().min(18).optional(),
 * });
 * 
 * // Use the validation middleware
 * export const POST = withValidation(
 *   createUserSchema,
 *   async (req, validData) => {
 *     // validData is typed and validated
 *     const { name, email, age } = validData;
 *     
 *     // Create the user
 *     const user = await db.users.create({ name, email, age });
 *     
 *     return NextResponse.json({ user });
 *   }
 * );
 */ 
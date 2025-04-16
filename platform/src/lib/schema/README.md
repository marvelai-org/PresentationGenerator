# Schema Validation and Type Safety

This directory contains a complete implementation of schema validation and type safety features for the Presentation Generator application.

## Overview

The implementation provides comprehensive schema validation and type safety across all data boundaries:

1. **API routes** - Validate request and response data
2. **Forms** - Validate user inputs with immediate feedback
3. **Database operations** - Ensure data matches expected schema
4. **State management** - Type-safe application state

## Features

### 1. Zod Schemas

- Comprehensive schema definitions for all entity types
- Runtime validation of data structures
- Strongly-typed TypeScript interfaces derived from schemas

### 2. Validation Utilities

- `validateData()` - General purpose data validation
- `validateRequest()` - Specific validation for API requests
- `safeParse()` - Type-safe parsing with structured error handling
- `validatePartial()` - Validate partial data objects for updates

### 3. Schema Migrations

- Tools for managing schema evolution over time
- Version tracking for schemas
- Data migration between schema versions
- Transformation functions for complex migrations

### 4. Form Validation

- React hooks for Zod-based form validation
- Form components with built-in validation
- Real-time feedback as users type
- Accessibility-focused error presentation

### 5. API Route Validation

- Middleware for automatic request validation
- Type-safe route handlers with validated data
- Query parameter validation
- Response validation to ensure contract compliance

### 6. Discriminated Unions

- Type-safe handling of different content types
- Runtime validation of union members
- Comprehensive error messages for invalid data

## Usage Examples

### 1. Defining a Schema

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "editor", "viewer"]),
  createdAt: z.string().datetime(),
});

// TypeScript type derived from schema
export type User = z.infer<typeof userSchema>;
```

### 2. Validating API Requests

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withValidation } from '@/lib/middlewares/withValidation';
import { userSchema } from './schema';

export const POST = withValidation(
  userSchema,
  async (req, validData) => {
    // validData is typed and validated - safe to use
    const user = await db.users.create(validData);
    return NextResponse.json({ user });
  }
);
```

### 3. Using Form Validation

```tsx
import { z } from 'zod';
import { useZodForm, FormInput } from '@/components/forms';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function LoginForm() {
  const { formData, errors, handleSubmit, updateField } = useZodForm(
    loginSchema,
    {
      onSubmit: async (data) => {
        await login(data);
      }
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        name="email"
        label="Email"
        value={formData.email || ''}
        onChange={(value) => updateField('email', value)}
        errors={errors.email}
        type="email"
      />

      <FormInput
        name="password"
        label="Password"
        value={formData.password || ''}
        onChange={(value) => updateField('password', value)}
        errors={errors.password}
        type="password"
      />

      <button type="submit">Login</button>
    </form>
  );
}
```

### 4. Using Schema Migrations

```typescript
import { migrateSchema } from '@/lib/schema/migration';
import { slideSchemaVersionV1, slideSchemaVersionV2 } from '@/lib/schema/migrations/slide-schema-v1-to-v2';

// Migrate data from v1 to v2
const legacyData = { /* old data structure */ };

const result = migrateSchema(
  legacyData,
  slideSchemaVersionV1,
  slideSchemaVersionV2,
  {
    transformations: {
      // Custom transformations for specific fields
      'backgroundColor': (color) => {
        return color === 'black' ? '#000000' : color;
      }
    }
  }
);

if (result.success) {
  // Use the migrated data
  const updatedData = result.data;
  console.log('Migration changes:', result.changes);
} else {
  console.error('Migration failed:', result.error);
}
```

### 5. Using Discriminated Unions

```typescript
import { contentSchema } from '@/lib/schema/content';

function renderContent(rawData: unknown) {
  try {
    // Validate and parse the content
    const content = contentSchema.parse(rawData);
    
    // Type-safe handling based on content type
    switch (content.type) {
      case 'heading':
        return <h1>{content.text}</h1>;
      
      case 'paragraph':
        return <p>{content.text}</p>;
      
      case 'image':
        return <img src={content.url} alt={content.altText} />;
      
      // TypeScript ensures all cases are handled
    }
  } catch (error) {
    console.error('Invalid content data:', error);
    return <div>Error: Could not render content</div>;
  }
}
```

## Files Overview

- `editor.ts` - Schemas for the presentation editor
- `content.ts` - Advanced content type schemas with discriminated unions
- `migration.ts` - Schema migration utilities
- `validation.ts` - Core validation functions
- `form-validation.tsx` - Form validation hooks and utilities
- `middlewares/withValidation.ts` - API validation middleware

## Contributing

When adding new features to the application, follow these guidelines:

1. Define Zod schemas for any new data structures
2. Use schema validation at all data boundaries (API, forms, etc.)
3. Derive TypeScript types from schemas using `z.infer<typeof schema>`
4. Create appropriate migration utilities for schema changes
5. Use the form validation hooks for new forms
6. Document any complex validation requirements

## Best Practices

1. **Schema-First Development**: Define schemas before implementing features
2. **Single Source of Truth**: Derive TypeScript types from Zod schemas
3. **Boundary Validation**: Validate data at all application boundaries
4. **Clear Error Messages**: Provide helpful error messages for validation failures
5. **Graceful Degradation**: Handle validation errors gracefully in the UI 
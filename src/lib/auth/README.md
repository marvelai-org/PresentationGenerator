# Supabase Authentication Implementation

This directory contains the Supabase authentication implementation for our Next.js application, which is designed to work seamlessly in both development and CI/CD environments without requiring real credentials.

## Files Overview

- `supabase-client.ts`: Client-side implementation (safe for client components)
- `supabase-server.ts`: Server-side implementation (for server components and API routes)
- `README.md`: This documentation file

## Usage Guidelines

### In Client Components

For client components, use the `createClientSupabaseClient` function:

```tsx
"use client";

import { createClientSupabaseClient } from "@/lib/auth/supabase-client";

export default function MyClientComponent() {
  const supabase = createClientSupabaseClient();
  
  // Use supabase here...
}
```

### In Server Components

For server components, use the `createServerSupabaseClient` function:

```tsx
import { createServerSupabaseClient } from "@/lib/auth/supabase-server";

export default async function MyServerComponent() {
  const supabase = createServerSupabaseClient();
  
  // Use supabase here...
}
```

### In API Route Handlers

For API route handlers, use the `createRouteSupabaseClient` function:

```tsx
import { createRouteSupabaseClient } from "@/lib/auth/supabase-server";

export async function GET() {
  const supabase = createRouteSupabaseClient();
  
  // Use supabase here...
}
```

## Mock Client Implementation

The implementation includes a robust mock client that:

1. Returns predictable responses for auth operations
2. Logs warnings when being used
3. Mimics the shape and interface of the real Supabase client
4. Handles all methods used throughout the application

### Mock Database Support

The client now includes a comprehensive mock database implementation that:

1. Provides in-memory data storage with localStorage persistence in browsers
2. Implements Supabase's query builder pattern (select, insert, update, delete)
3. Supports filtering, ordering, and pagination
4. Includes seed data for initial application state

For detailed information about the mock database implementation, see the README in the `/src/lib/storage` directory.

### Enabling Debug Mode

To see detailed logging of all database operations, set the following environment variable:

```
NEXT_PUBLIC_MOCK_DEBUG=true
```

### Resetting Mock Data

For testing purposes, you can reset the mock database to its initial state:

```typescript
const supabase = createClientSupabaseClient();
(supabase as any).resetMockData(); // Cast to any to access this mock-only method
```

## Environment Variables

For local development and production, you'll need to set the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

In CI/CD environments or without these variables, the system will automatically use the mock implementation.

## CI/CD Configuration

No real credentials are required for CI/CD. The implementation automatically detects CI environments (via the `CI_ENVIRONMENT` variable) and uses the mock client.

## Adding Custom Functionality

When extending the Supabase client functionality:

1. Add new methods to both the real client implementation and the mock client
2. Keep the interface identical between mock and real implementations
3. Update this README with any new usage patterns 
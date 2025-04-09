# CI/CD Authentication Strategy for Supabase

This document describes how authentication and database operations are handled in the CI/CD pipeline for this project.

## Mock Implementation Strategy

Our application uses Supabase for authentication and database operations, but we need to ensure builds and tests can run in CI environments without exposing real credentials.

### How it Works

1. **Environment Detection**:

   - The application checks for the presence of a `CI_ENVIRONMENT` variable
   - When set to `true`, the application automatically uses mock implementations

2. **Separate Client and Server Implementation**:
   We've implemented a clean separation between client and server Supabase clients:

   - Client-side: `src/lib/auth/supabase-client.ts` - Safe for client components
   - Server-side: `src/lib/auth/supabase-server.ts` - For server components and API routes
   - Storage utilities: `src/lib/storage/mock-storage.ts` - For database operations

   Each has both real and mock implementations that match the Supabase interface.

3. **Next.js Configuration**:

   - The `next.config.js` file includes special handling for CI environments
   - It sets default environment variables if they're missing
   - It configures enhanced build caching through the custom cache handler

4. **CI Workflow**:
   - The GitHub Actions workflow automatically:
     - Sets global environment variables including `CI_ENVIRONMENT=true`
     - Uses placeholder Supabase values for mock authentication
     - Leverages improved caching for faster builds

### For Local Development

If you're working locally without Supabase credentials:

```bash
# Copy the example environment file
cp .env.example .env

# Add the CI environment flag to use mock authentication and database
echo "CI_ENVIRONMENT=true" >> .env

# Optional: Enable debug logging for mock database operations
echo "NEXT_PUBLIC_MOCK_DEBUG=true" >> .env
```

### Authentication and Database Flow in CI

1. During CI/CD runs, the `CI_ENVIRONMENT=true` flag is set globally
2. When Supabase client initialization is attempted:
   - The code checks for the CI flag or missing credentials
   - If detected, mock clients are used instead of real ones
   - Authentication checks in middleware and layouts are bypassed
   - Database operations use in-memory storage with mock data
3. For protected routes, the authentication check is skipped in CI mode
4. Build processes can run successfully without real credentials

## Handling Different Client Types

### Server Components

For server components, use the `createServerSupabaseClient` function:

```tsx
// In a server component
import { createServerSupabaseClient } from "@/lib/auth/supabase-server";

export default async function MyServerComponent() {
  const supabase = createServerSupabaseClient();

  // Use supabase here for auth and database operations
  const { data } = await supabase.from("users").select();
}
```

### Client Components

For client components, use the `createClientSupabaseClient` function:

```tsx
// In a client component
"use client";
import { createClientSupabaseClient } from "@/lib/auth/supabase-client";

export default function MyClientComponent() {
  const supabase = createClientSupabaseClient();

  // Use supabase here for auth and database operations
  const fetchData = async () => {
    const { data } = await supabase.from("presentations").select();
    // Process data...
  };
}
```

### Route Handlers

For API routes, use the `createRouteSupabaseClient` function:

```tsx
// In an API route handler
import { createRouteSupabaseClient } from "@/lib/auth/supabase-server";

export async function GET() {
  const supabase = createRouteSupabaseClient();

  // Use supabase here for auth and database operations
  const { data } = await supabase.from("presentations").select();
  return Response.json({ data });
}
```

## Mock Database Implementation

The mock database implementation provides:

1. **In-memory data storage** with localStorage persistence in browsers
2. **Supabase-compatible API** that matches the real client's interface
3. **Seed data** for basic application testing
4. **Debug logging** to track database operations

### Supported Database Operations

```typescript
// Query data
const { data } = await supabase
  .from("presentations")
  .select()
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

// Insert data
const { data, error } = await supabase
  .from("presentations")
  .insert({ title: "New Presentation", user_id: userId });

// Update data
const { data, error } = await supabase
  .from("presentations")
  .update({ title: "Updated Title" })
  .eq("id", presentationId);

// Delete data
const { error } = await supabase
  .from("presentations")
  .delete()
  .eq("id", presentationId);
```

### Debug Mode

To enable detailed operation logging, set the environment variable:

```
NEXT_PUBLIC_MOCK_DEBUG=true
```

This will show all database operations in the console.

## Extending the Mock Clients

If you need to extend the mock clients with additional functionality:

1. Open the appropriate file in `src/lib/auth/` or `src/lib/storage/`
2. Add new methods to both the mock client implementations and update interfaces
3. If adding new tables, update the MockDatabase interface in `mock-storage.ts`
4. Ensure your changes maintain compatibility with the real Supabase client interface

## Troubleshooting

### Common Issues

1. **Build failures related to server/client components**:

   - Ensure client components import from `supabase-client.ts`
   - Ensure server components import from `supabase-server.ts`
   - Never import `cookies` from "next/headers" in client components

2. **Authentication errors during prerendering**:

   - Make sure static page generation has access to mock clients
   - Check for middleware or layout components that might be blocking access

3. **Missing tables or database functionality**:
   - Check if the table is defined in the seed data
   - Verify that the operation is supported in the mock implementation
   - Enable debug mode to see the actual operations being performed

### Debugging Tips

Add temporary logging to see which client is being used:

```typescript
console.log(
  "Client type:",
  process.env.CI_ENVIRONMENT === "true" ? "🔶 MOCK" : "✅ REAL",
  "in",
  typeof window !== "undefined" ? "BROWSER" : "SERVER",
);

// Reset mock data if needed
if (process.env.CI_ENVIRONMENT === "true") {
  (supabase as any).resetMockData();
}
```

---

For any questions about this strategy, please open an issue on GitHub.

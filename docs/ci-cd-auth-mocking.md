# CI/CD Authentication Strategy for Supabase

This document describes how authentication is handled in the CI/CD pipeline for this project.

## Mock Authentication Strategy

Our application uses Supabase for authentication, but we need to ensure builds and tests can run in CI environments without exposing real credentials.

### How it Works

1. **Environment Detection**: 
   - The application checks for the presence of a `CI_ENVIRONMENT` variable
   - When set to `true`, the application automatically uses mock authentication

2. **Comprehensive Mock Clients**:
   We've implemented mock versions of all Supabase client types:
   
   - Browser Client: `src/lib/auth/supabase.ts`
   - Server Component Client: `src/lib/auth/supabase-client.ts`
   - Client Component Client: `src/lib/auth/supabase-client.ts`
   - Route Handler Client: `src/lib/auth/supabase-client.ts`
   - Middleware Client: `src/middleware.ts`
   
   Each mock client implements the necessary methods with safe default responses.

3. **Next.js Configuration**:
   - The `next.config.js` file includes special handling for CI environments
   - It sets default environment variables if they're missing
   - It configures the build process to handle authentication gracefully

4. **CI Workflow**:
   - The GitHub Actions workflow automatically:
     - Sets global environment variables including `CI_ENVIRONMENT=true`
     - Creates a `.env` file from `.env.example`
     - Sets placeholder Supabase values
     - Uses enhanced error reporting for build failures

### For Local Development

If you're working locally without Supabase credentials:

```bash
# Copy the example environment file
cp .env.example .env

# Add the CI environment flag to use mock authentication
echo "CI_ENVIRONMENT=true" >> .env
```

### Authentication Flow in CI

1. During CI/CD runs, the `CI_ENVIRONMENT=true` flag is set globally
2. When Supabase client initialization is attempted:
   - The code checks for the CI flag or missing credentials
   - If detected, mock clients are used instead of real ones
   - Authentication checks in middleware and layouts are bypassed
3. For protected routes, the authentication check is skipped in CI mode
4. Build processes can run successfully without real credentials

## Handling Different Client Types

### Server Components

For server components, we use a custom `createServerComponentClient` that returns a mock client in CI:

```typescript
// src/lib/auth/supabase-client.ts
export function createServerComponentClient() {
  if (process.env.CI_ENVIRONMENT === 'true') {
    // Return mock client
  }
  // Return real client
}
```

### Client Components

Similarly, we provide a `createClientComponentClient` for browser environments:

```typescript
// src/lib/auth/supabase-client.ts
export function createClientComponentClient() {
  if (process.env.CI_ENVIRONMENT === 'true') {
    // Return mock client
  }
  // Return real client
}
```

### Route Handlers and Middleware

For API routes and middleware, we provide appropriate wrappers:

```typescript
// src/middleware.ts
// Custom middleware client with CI detection
```

## Extending the Mock Clients

If you need to extend the mock clients with additional functionality:

1. Open the appropriate file in `src/lib/auth/`
2. Add new methods or enhance existing ones in the mock client implementation
3. Ensure your changes maintain compatibility with the real Supabase client interface

## Troubleshooting

### Common Issues

1. **Build failures in CI**:
   - Check that all pages using Supabase are importing the custom clients
   - Ensure no direct imports from `@supabase/auth-helpers-nextjs`

2. **Authentication errors during prerendering**:
   - Make sure static page generation has access to mock clients
   - Check for middleware or layout components that might be blocking access

### Debugging Tips

Add temporary logging to see which client is being used:

```typescript
console.log('Client type:', process.env.CI_ENVIRONMENT === 'true' ? 'MOCK' : 'REAL');
```

---

For any questions about this strategy, please open an issue on GitHub. 
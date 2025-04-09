# CI/CD Authentication Strategy for Supabase

This document describes how authentication is handled in the CI/CD pipeline for this project.

## Mock Authentication Strategy

Our application uses Supabase for authentication, but we need to ensure builds and tests can run in CI environments without exposing real credentials.

### How it Works

1. **Environment Detection**: 
   - The application checks for the presence of a `CI_ENVIRONMENT` variable
   - When set to `true`, the application automatically uses mock authentication

2. **Mock Client Implementation**:
   - Located in `src/lib/auth/supabase.ts`
   - Implements stubs for all Supabase auth methods
   - Returns empty/null values that allow the app to build and run without errors

3. **CI Workflow**:
   - The GitHub Actions workflow automatically:
     - Creates a `.env` file from `.env.example`
     - Sets placeholder Supabase values
     - Sets `CI_ENVIRONMENT=true`

### For Local Development

If you're working locally without Supabase credentials:

```bash
# Copy the example environment file
cp .env.example .env

# Add the CI environment flag to use mock authentication
echo "CI_ENVIRONMENT=true" >> .env
```

### Testing Authentication Flows

When writing tests for authentication flows:

1. The mock client will always return successful responses but with null user data
2. You should design tests to account for both authenticated and unauthenticated states
3. For comprehensive testing, consider using a dedicated test Supabase project with controlled test data

## Extending the Mock Client

If you need to extend the mock client with additional functionality:

1. Open `src/lib/auth/supabase.ts`
2. Add new methods or enhance existing ones in the `createMockClient` function
3. Ensure your changes maintain compatibility with the real Supabase client interface

---

For any questions about this strategy, please open an issue on GitHub. 
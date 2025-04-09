# Mock Database Implementation for Supabase

This directory contains the mock database implementation for our Supabase integration, allowing developers to work with the application without requiring real Supabase credentials.

## Overview

The mock database system provides:

1. **In-memory data storage** with persistence options
2. **API-compatible mock client** that mimics Supabase's client interface
3. **Automatic fallback** when credentials are missing
4. **Browser localStorage persistence** for client-side state preservation

## How It Works

### Storage Layer (`mock-storage.ts`)

The base storage layer provides:
- In-memory data storage for both server and client environments
- Browser localStorage persistence when available
- CRUD operations on tables
- Seed data for initial application state

### Client Integration (`supabase-client.ts`)

The enhanced mock client:
- Implements Supabase's query builder pattern
- Provides support for filters, ordering, and pagination
- Automatically activates when credentials are missing
- Includes debug logging for troubleshooting

## Usage

### Normal Application Usage

No changes are needed in your application code. Simply use the `createClientSupabaseClient` function as usual:

```typescript
import { createClientSupabaseClient } from "@/lib/auth/supabase-client";

function MyComponent() {
  const supabase = createClientSupabaseClient();
  
  // Use supabase as normal
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('presentations')
      .select()
      .order('created_at', { ascending: false });
      
    // Handle data...
  };
}
```

### Debug Mode

To enable detailed operation logging, set the environment variable:

```
NEXT_PUBLIC_MOCK_DEBUG=true
```

This will show all database operations in the console.

### Resetting Mock Data

For testing purposes, you can reset the mock database to its initial state:

```typescript
const supabase = createClientSupabaseClient();
(supabase as any).resetMockData(); // Cast to any to access this mock-only method
```

## Supported Operations

### Querying Data

```typescript
// Basic select
const { data } = await supabase.from('presentations').select();

// Filtering
const { data } = await supabase
  .from('presentations')
  .select()
  .eq('user_id', userId);

// Sorting and limiting
const { data } = await supabase
  .from('presentations')
  .select()
  .order('created_at', { ascending: false })
  .limit(10);

// Single record
const { data } = await supabase
  .from('presentations')
  .select()
  .eq('id', presentationId)
  .single();
```

### Modifying Data

```typescript
// Insert
const { data, error } = await supabase
  .from('presentations')
  .insert({
    title: 'New Presentation',
    description: 'Created with mock client',
    user_id: 'mock-user-1'
  });

// Update
const { data, error } = await supabase
  .from('presentations')
  .update({ title: 'Updated Title' })
  .eq('id', presentationId);

// Delete
const { error } = await supabase
  .from('presentations')
  .delete()
  .eq('id', presentationId);
```

## Mock Database Schema

The initial seed data includes:

- `users` - User accounts
- `presentations` - Presentation metadata
- `slides` - Individual slides within presentations

You can extend the schema by adding new tables to the `initialData` object in `mock-storage.ts`.

## Limitations

The mock implementation has some limitations:

1. Foreign key constraints are not enforced
2. Complex queries with joins are not supported
3. RPC functions are not implemented
4. Server-side storage operations are limited to in-memory

These limitations are acceptable for development and testing purposes, but the mock should not be used in production environments.

## Extending

To add support for additional tables or operations:

1. Update the `MockDatabase` interface in `mock-storage.ts`
2. Add any necessary seed data to `initialData`
3. If needed, add special handling for complex operations in the mock client implementation

## Troubleshooting

If you encounter issues with the mock database:

1. Enable debug mode to see all operations
2. Check browser console for warnings and errors
3. Try resetting the mock data if you suspect data corruption
4. For persistence issues in browsers, check localStorage access 
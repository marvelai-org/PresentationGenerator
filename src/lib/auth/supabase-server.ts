import { cookies } from 'next/headers';
import {
  createServerComponentClient as supabaseCreateServerComponentClient,
  createRouteHandlerClient as supabaseCreateRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs';

import { Database } from '@/types/supabase';

// Basic mock client implementation for server-side
const createMockServerClient = () => {
  console.warn('Using mock Supabase server client - some functionality will be limited');

  return {
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: null,
        error: { message: 'Mock server client' },
      }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        single: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  };
};

// Check if we should use mock client
const shouldUseMockClient = () => {
  const isCI = process.env.CI_ENVIRONMENT === 'true';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return isCI || !supabaseUrl || !supabaseKey;
};

/**
 * Creates a Supabase client for Server Components
 *
 * This function should only be used in server components or server functions
 * as it relies on the `cookies()` function from next/headers
 */
export async function createServerSupabaseClient() {
  try {
    if (shouldUseMockClient()) {
      console.info(
        process.env.CI_ENVIRONMENT === 'true'
          ? '🔶 Using mock server client in CI environment'
          : '⚠️ Missing Supabase credentials, using mock server client'
      );

      return createMockServerClient() as unknown as ReturnType<
        typeof supabaseCreateServerComponentClient<Database>
      >;
    }

    // Make sure to properly handle cookies in an async context
    const cookieStore = cookies();

    return supabaseCreateServerComponentClient<Database>({
      cookies: () => cookieStore,
    });
  } catch (error) {
    console.warn('⚠️ Supabase server client creation error:', error);

    return createMockServerClient() as unknown as ReturnType<
      typeof supabaseCreateServerComponentClient<Database>
    >;
  }
}

/**
 * Creates a Supabase client for Route Handlers
 *
 * This function should only be used in route handlers as it relies on the
 * `cookies()` function from next/headers
 */
export async function createRouteSupabaseClient() {
  try {
    if (shouldUseMockClient()) {
      console.info(
        process.env.CI_ENVIRONMENT === 'true'
          ? '🔶 Using mock route handler in CI environment'
          : '⚠️ Missing Supabase credentials, using mock route handler'
      );

      return createMockServerClient() as unknown as ReturnType<
        typeof supabaseCreateRouteHandlerClient<Database>
      >;
    }

    // Make sure to properly handle cookies in an async context
    const cookieStore = cookies();

    return supabaseCreateRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
  } catch (error) {
    console.warn('⚠️ Supabase route handler creation error:', error);

    return createMockServerClient() as unknown as ReturnType<
      typeof supabaseCreateRouteHandlerClient<Database>
    >;
  }
}

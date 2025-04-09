import { cookies } from 'next/headers';
import { 
  createServerComponentClient as originalCreateServerComponentClient,
  createClientComponentClient as originalCreateClientComponentClient,
  createRouteHandlerClient as originalCreateRouteHandlerClient
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Basic mock client implementation
const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({ 
        data: { user: null }, 
        error: null 
      }),
      getSession: async () => ({ 
        data: { session: null }, 
        error: null 
      }),
      signInWithPassword: async () => ({
        data: null,
        error: { message: "Mock client" }
      }),
      signInWithOtp: async () => ({
        data: null,
        error: null
      }),
      signUp: async () => ({
        data: { user: null },
        error: null
      }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({
        data: { user: null },
        error: null
      }),
      resetPasswordForEmail: async () => ({
        data: {},
        error: null
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
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

// Server Component Client
export function createServerComponentClient(options?: any) {
  try {
    if (shouldUseMockClient()) {
      console.info(process.env.CI_ENVIRONMENT === 'true'
        ? 'Using mock server client in CI environment'
        : 'Missing Supabase credentials, using mock server client');
      return createMockClient() as ReturnType<typeof originalCreateServerComponentClient<Database>>;
    }
    
    return originalCreateServerComponentClient<Database>(options || { cookies });
  } catch (error) {
    console.warn('Supabase server client creation error:', error);
    return createMockClient() as ReturnType<typeof originalCreateServerComponentClient<Database>>;
  }
}

// Client Component Client
export function createClientComponentClient(options?: any) {
  try {
    if (shouldUseMockClient()) {
      console.info(process.env.CI_ENVIRONMENT === 'true'
        ? 'Using mock client component in CI environment'
        : 'Missing Supabase credentials, using mock client component');
      return createMockClient() as ReturnType<typeof originalCreateClientComponentClient<Database>>;
    }
    
    return originalCreateClientComponentClient<Database>(options);
  } catch (error) {
    console.warn('Supabase client component creation error:', error);
    return createMockClient() as ReturnType<typeof originalCreateClientComponentClient<Database>>;
  }
}

// Route Handler Client
export function createRouteHandlerClient(options?: any) {
  try {
    if (shouldUseMockClient()) {
      console.info(process.env.CI_ENVIRONMENT === 'true'
        ? 'Using mock route handler in CI environment'
        : 'Missing Supabase credentials, using mock route handler');
      return createMockClient() as ReturnType<typeof originalCreateRouteHandlerClient<Database>>;
    }
    
    return originalCreateRouteHandlerClient<Database>(options);
  } catch (error) {
    console.warn('Supabase route handler creation error:', error);
    return createMockClient() as ReturnType<typeof originalCreateRouteHandlerClient<Database>>;
  }
} 
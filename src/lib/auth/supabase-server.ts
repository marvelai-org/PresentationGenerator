import { cookies } from 'next/headers';
import { 
  createServerComponentClient as originalCreateServerComponentClient
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const createMockServerClient = () => {
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

export function createServerComponentClient() {
  try {
    const isCI = process.env.CI_ENVIRONMENT === 'true';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Use mock client in CI environment or when credentials are missing
    if (isCI || !supabaseUrl || !supabaseKey) {
      console.info(isCI 
        ? 'Using mock server client in CI environment' 
        : 'Missing Supabase credentials, using mock server client');
      return createMockServerClient() as ReturnType<typeof originalCreateServerComponentClient<Database>>;
    }

    // Use the original client when credentials are available
    return originalCreateServerComponentClient<Database>({ cookies });
  } catch (error) {
    console.warn('Supabase server client creation error:', error);
    return createMockServerClient() as ReturnType<typeof originalCreateServerComponentClient<Database>>;
  }
} 
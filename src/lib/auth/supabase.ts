// src/lib/auth/supabase.ts
import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/types/supabase"; // You might need to create this type

// Mock client for build time or when environment variables are missing
const createMockClient = () => {
  return {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: null, error: { message: "Mock client" } }),
      signInWithOtp: () => Promise.resolve({ data: null, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
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

export const createClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return createMockClient() as unknown as ReturnType<
        typeof createBrowserClient<Database>
      >;
    }

    return createBrowserClient<Database>(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn("Supabase client creation error:", error);

    return createMockClient() as unknown as ReturnType<
      typeof createBrowserClient<Database>
    >;
  }
};

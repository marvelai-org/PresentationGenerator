'use client';
import type { User, Session } from '@supabase/supabase-js';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { createClientSupabaseClient } from '@/lib/auth/supabase-client';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isFirstTimeUser: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  signUp: (credentials: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add function to set up database
const setupDatabase = async () => {
  try {
    const response = await fetch('/api/setup-database', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to set up database:', await response.text());
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, error };
  }
};

// Add function to check if a user is a first-time user
const checkFirstTimeUser = async (supabase: any) => {
  try {
    const { data, error } = await supabase
      .from('presentations')
      .select('count')
      .limit(1);
      
    if (error) {
      // Table might not exist yet, or query failed
      return true;
    }
    
    return !data || data.length === 0;
  } catch (error) {
    console.error('Error checking first-time user status:', error);
    return true; // Assume first-time user on error
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);

  const supabase = createClientSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);
      
      // If we have a session, check if database needs to be set up
      if (session) {
        // Set up database if needed
        await setupDatabase();
        
        // Check if this is a first-time user
        const firstTimeUser = await checkFirstTimeUser(supabase);
        setIsFirstTimeUser(firstTimeUser);
        
        // If first-time user, set localStorage flag
        if (firstTimeUser) {
          localStorage.setItem('isFirstTimeUser', 'true');
        }
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // After successful login, set up database
        await setupDatabase();
        
        // Check if first-time user
        const firstTimeUser = await checkFirstTimeUser(supabase);
        setIsFirstTimeUser(firstTimeUser);
        
        router.refresh();
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name?: string;
  }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          },
        },
      });

      if (!error) {
        // After successful signup, set up database
        await setupDatabase();
        
        // Mark as first-time user
        setIsFirstTimeUser(true);
        localStorage.setItem('isFirstTimeUser', 'true');
        
        router.refresh();
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  const value = {
    isAuthenticated,
    user,
    session,
    isFirstTimeUser,
    login,
    logout,
    signUp,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

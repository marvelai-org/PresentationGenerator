// src/app/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/auth/supabase-server';

export default async function HomePage() {
  // Check if the user is authenticated
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // If authenticated, redirect to dashboard
    if (session) {
      redirect('/dashboard');
    } else {
      // If not authenticated, redirect to login
      redirect('/login');
    }
  } catch (error) {
    // If there's an error, default to login page
    redirect('/login');
  }
}

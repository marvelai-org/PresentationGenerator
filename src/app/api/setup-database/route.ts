import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/auth/supabase-server';

/**
 * API route to set up the necessary database tables in Supabase
 * This should be called during the onboarding process or when a new user signs up
 * 
 * Example usage:
 * const response = await fetch('/api/setup-database', { method: 'POST' });
 * const data = await response.json();
 */
export async function POST() {
  try {
    const supabase = await createRouteSupabaseClient();
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. You must be logged in to set up the database.'
        }, 
        { status: 401 }
      );
    }
    
    // First check if presentations table already exists
    const { error: checkError } = await supabase
      .from('presentations')
      .select('count')
      .limit(1);
    
    if (!checkError) {
      // Table already exists
      return NextResponse.json({ 
        success: true, 
        message: 'Tables already exist.'
      });
    }
    
    // The tables don't exist yet. This is expected for new users.
    // The database tables should be created through Supabase migrations or direct DB setup
    // This API route should only be used to check if the user has access to the required tables

    // Check if user profile exists and create if needed
    // Create user profile if it doesn't exist
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .limit(1);
      
    if (!profileError && (!existingProfile || existingProfile.length === 0)) {
      // Profile table exists but user doesn't have a profile yet, create one
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (user) {
        await supabase.from('user_profiles').insert({
          user_id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Database tables are not set up. Please set up your Supabase project with the required tables.',
      details: `Run the SQL setup scripts in your Supabase project SQL editor. Refer to the documentation for more information.`
    }, { status: 404 });
  } catch (error) {
    console.error('Server error during database setup:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error during database setup.', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Also handle GET requests to check database status
export async function GET() {
  try {
    const supabase = await createRouteSupabaseClient();
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. You must be logged in to check database status.'
        }, 
        { status: 401 }
      );
    }
    
    // Check if presentations table exists
    const { data, error } = await supabase
      .from('presentations')
      .select('count')
      .limit(1);
      
    if (error) {
      // Table likely doesn't exist
      return NextResponse.json({
        success: false,
        exists: false,
        message: 'Database tables need to be created.',
        details: error.message
      });
    }
    
    return NextResponse.json({
      success: true,
      exists: true,
      message: 'Database tables already set up.'
    });
  } catch (error) {
    console.error('Server error checking database status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error checking database status.', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 
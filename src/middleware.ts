// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Create a response early so we can modify headers
  const res = NextResponse.next();

  // Initialize Supabase client
  const supabase = createMiddlewareClient({ req, res });

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no session and the user is trying to access a protected route
  if (!session && req.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      }),
      {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // If the user is authenticated and tries to access login or signup pages
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If there's no session and the user is trying to access a protected page
  // Exclude login, signup, callback, reset-password, and forgot-password pages from protection
  const publicPaths = ['/login', '/signup', '/callback', '/reset-password', '/forgot-password', '/', '/confirmation', '/_next/'];
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path) || req.nextUrl.pathname === path);
  
  if (!session && !isPublicPath) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
    '/api/:path*',
    '/dashboard/:path*',
    '/projects/:path*',
    '/documents/:path*',
    '/conversations/:path*',
  ],
};
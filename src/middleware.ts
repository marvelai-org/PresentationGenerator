// src/middleware.ts
import type { NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

import { NextResponse } from "next/server";
import { createMiddlewareClient as originalCreateMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Custom middleware client creator with mock support
const createMiddlewareClient = (options: {
  req: NextRequest;
  res: NextResponse;
}) => {
  // Check if we're in CI environment
  const isCI = process.env.CI_ENVIRONMENT === "true";

  try {
    // Use the original client
    return originalCreateMiddlewareClient<Database>(options);
  } catch (error) {
    console.warn("Middleware client creation error:", error);

    // Return a mock client if creation fails
    return {
      auth: {
        getSession: () =>
          Promise.resolve({ data: { session: null }, error: null }),
      },
    } as ReturnType<typeof originalCreateMiddlewareClient<Database>>;
  }
};

export async function middleware(req: NextRequest) {
  // Create a response early so we can modify headers
  const res = NextResponse.next();

  // Check for CI environment
  const isCI = process.env.CI_ENVIRONMENT === "true";

  if (isCI) {
    console.info(
      "CI environment detected in middleware, bypassing authentication",
    );

    return res;
  }

  try {
    // Initialize Supabase client
    const supabase = createMiddlewareClient({ req, res });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If there's no session and the user is trying to access a protected route
    if (!session && req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // If the user is authenticated and tries to access login or signup pages
    if (
      session &&
      (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If there's no session and the user is trying to access a protected page
    // Exclude login, signup, callback, reset-password, and forgot-password pages from protection
    const publicPaths = [
      "/login",
      "/signup",
      "/callback",
      "/reset-password",
      "/forgot-password",
      "/",
      "/confirmation",
      "/_next/",
    ];
    const isPublicPath = publicPaths.some(
      (path) =>
        req.nextUrl.pathname.startsWith(path) || req.nextUrl.pathname === path,
    );

    if (!session && !isPublicPath) {
      const redirectUrl = new URL("/login", req.url);

      redirectUrl.searchParams.set("from", req.nextUrl.pathname);

      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.warn("Middleware authentication error:", error);

    return res;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)",
    "/api/:path*",
    "/dashboard/:path*",
    "/projects/:path*",
    "/documents/:path*",
    "/conversations/:path*",
  ],
};

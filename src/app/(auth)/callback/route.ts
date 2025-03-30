import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { rateLimiterByIP } from "@/lib/utils/rate-limiter";

// Required for static export
export const dynamic = "force-static";
export const revalidate = false;

// Rate limit adapter for App Router
const checkRateLimit = (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  return rateLimiterByIP(ip, 10);
};

export async function GET(request: NextRequest) {
  // Check rate limit
  if (!checkRateLimit(request)) {
    console.warn(
      `Rate limit exceeded for auth callback: ${request.headers.get("x-forwarded-for")}`,
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TOO_MANY_REQUESTS",
          message: "Rate limit exceeded",
        },
      },
      { status: 429 },
    );
  }

  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const supabase = createRouteHandlerClient({ cookies: () => cookies() });

      await supabase.auth.exchangeCodeForSession(code);

      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(
        new URL("/login?error=missing_code", request.url),
      );
    }
  } catch (error) {
    // Redirect to error page or login with error message
    return NextResponse.redirect(
      new URL(
        "/login?error=" +
          (error instanceof Error ? error.message : "callback_failed"),
        request.url,
      ),
    );
  }
}

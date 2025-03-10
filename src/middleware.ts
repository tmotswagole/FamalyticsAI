import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  USER_COOKIE,
  LAST_ACTIVE_COOKIE,
  ADMIN_USER_TIMEOUT,
  REGULAR_USER_TIMEOUT,
} from "./lib/auth-cookies";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // If user is logged in and cookie exists, check for timeout
  const userCookie = req.cookies.get(USER_COOKIE);
  const lastActiveCookie = req.cookies.get(LAST_ACTIVE_COOKIE);

  if (session && userCookie && lastActiveCookie) {
    const userData = JSON.parse(userCookie.value);
    const lastActive = parseInt(lastActiveCookie.value, 10);
    const now = Date.now();

    // Check timeout based on user role
    const timeoutDuration =
      userData.role === "SYSADMIN" ? ADMIN_USER_TIMEOUT : REGULAR_USER_TIMEOUT;

    if (now - lastActive > timeoutDuration) {
      // Session has timed out, sign out the user
      await supabase.auth.signOut();

      // Create a new response that redirects to sign-in
      const timeoutResponse = NextResponse.redirect(
        new URL("/sign-in?timeout=true", req.url),
      );

      // Clear the cookies
      timeoutResponse.cookies.delete(USER_COOKIE);
      timeoutResponse.cookies.delete(LAST_ACTIVE_COOKIE);

      return timeoutResponse;
    }

    // Update last active time for non-static requests
    if (!req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
      res.cookies.set({
        name: LAST_ACTIVE_COOKIE,
        value: Date.now().toString(),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        sameSite: "lax",
      });
    }
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/polar/webhook (webhook endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook).*)",
  ],
};

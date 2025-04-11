import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./utils/supabase/middleware";
import {
  USER_COOKIE,
  USER_ROLE_COOKIE,
  ORGANIZATION_COOKIE,
  USER_SUBSCRIPTION_COOKIE,
  LAST_ACTIVE_COOKIE,
  ADMIN_USER_TIMEOUT,
  REGULAR_USER_TIMEOUT,
} from "@/lib/constants";
import { Arcjet } from "./utils/arcjet/router";

/**
 * Middleware function to handle user session management, timeout logic, bot protection, and Shield WAF integration.
 *
 * @param {NextRequest} req - The incoming request object from Next.js.
 * @returns {Promise<NextResponse>} - The response object, potentially modified with cookies or redirects.
 */
export async function middleware(req: NextRequest) {
  try {
    // Apply bot protection to block malicious or automated requests.
    await applyBotProtection(req);

    // Apply Web Application Firewall (WAF) rules to filter out harmful requests.
    await applyWAF(req);

    // Create a Supabase client and extend the response object with enhanced cookie handling.
    const { supabase, response: res } = createClient(req);
    extendResponseCookies(req, res);

    // Handle user session management, including timeout logic and cookie updates.
    await handleSessionManagement(req, res, supabase);

    return res;
  } catch (error) {
    // Log the error and return a 403 response for blocked or failed requests.
    console.error(
      "Middleware error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Request blocked or an internal error occurred." },
      { status: 403 }
    );
  }
}

/**
 * Applies bot protection using Arcjet's verification mechanism.
 *
 * @param {NextRequest} req - The incoming request object.
 * @throws {Error} - Throws an error if the request is identified as a bot.
 */
async function applyBotProtection(req: NextRequest) {
  const botProtectionResult = await Arcjet.verifyBotProtection(req);
  if (!botProtectionResult.success) {
    throw new Error(
      `Request blocked by Arcjet bot protection: ${botProtectionResult.reason}`
    );
  }
}

/**
 * Applies Shield WAF (Web Application Firewall) rules to the request.
 *
 * @param {NextRequest} req - The incoming request object.
 * @throws {Error} - Throws an error if the request violates WAF rules.
 */
async function applyWAF(req: NextRequest) {
  const wafResult = await Arcjet.applyShieldWAF(req);
  if (!wafResult.success) {
    throw new Error(`Request blocked by Shield WAF: ${wafResult.reason}`);
  }
}

/**
 * Extends the response object with enhanced cookie handling capabilities.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {NextResponse} res - The response object to be extended.
 */
function extendResponseCookies(req: NextRequest, res: NextResponse) {
  const extendedCookies = {
    ...res.cookies,
    /**
     * Retrieves all cookies from the request.
     * @returns {Array<{name: string, value: string}>} - An array of cookie objects.
     */
    getAll() {
      return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
    },
    /**
     * Sets multiple cookies on both the request and response objects.
     * @param {Array<{name: string, value: string, options?: Record<string, unknown>}>} cookiesToSet - The cookies to set.
     */
    setAll(
      cookiesToSet: Array<{
        name: string;
        value: string;
        options?: Record<string, unknown>;
      }>
    ): void {
      cookiesToSet.forEach(({ name, value, options }) => {
        req.cookies.set(name, value);
        res.cookies.set(name, value, options);
      });
    },
  };

  // Override the cookies property of the response object with the extended cookies.
  Object.defineProperty(res, "cookies", {
    value: extendedCookies,
    writable: false,
  });
}

/**
 * Handles user session management, including timeout logic and cookie updates.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {NextResponse} res - The response object.
 * @param {any} supabase - The Supabase client instance.
 * @throws {NextResponse} - Throws a redirect response if the session times out.
 */
async function handleSessionManagement(
  req: NextRequest,
  res: NextResponse,
  supabase: any
) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Error retrieving session: ${error.message}`);
  }

  const userRoleCookie = req.cookies.get(USER_ROLE_COOKIE);
  const lastActiveCookie = req.cookies.get(LAST_ACTIVE_COOKIE);

  if (session && userRoleCookie && lastActiveCookie) {
    const userRoleData = JSON.parse(userRoleCookie.value);
    const lastActive = parseInt(lastActiveCookie.value, 10);
    const now = Date.now();

    // Determine the timeout duration based on the user's role.
    const timeoutDuration =
      userRoleData.role === "SYSADMIN"
        ? ADMIN_USER_TIMEOUT
        : REGULAR_USER_TIMEOUT;

    // If the session has timed out, sign out the user and redirect to the sign-in page.
    if (now - lastActive > timeoutDuration) {
      await supabase.auth.signOut();

      const timeoutResponse = NextResponse.redirect(
        new URL("/sign-in?timeout=true", req.url)
      );

      // Delete all relevant cookies upon timeout.
      timeoutResponse.cookies.delete(USER_COOKIE);
      timeoutResponse.cookies.delete(LAST_ACTIVE_COOKIE);
      timeoutResponse.cookies.delete(USER_ROLE_COOKIE);
      timeoutResponse.cookies.delete(ORGANIZATION_COOKIE);
      timeoutResponse.cookies.delete(USER_SUBSCRIPTION_COOKIE);

      throw timeoutResponse;
    }

    // Update the last active timestamp for non-static file requests.
    if (!req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
      res.cookies.set({
        name: LAST_ACTIVE_COOKIE,
        value: Date.now().toString(),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "lax",
      });
    }
  }
}

/**
 * Configuration object to specify the paths where the middleware should be applied.
 * The matcher excludes certain paths such as static files, public files, and webhook endpoints.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/payments/webhook (webhook endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook).*)",
  ],
};

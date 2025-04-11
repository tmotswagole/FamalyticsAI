import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Create Supabase client
  const { supabase, response } = createClient(request);

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    const {
      data: { session: newSession },
    } = await supabase.auth.refreshSession();
    if (newSession) {
      response.headers.set("Set-Cookie", newSession.access_token);
    }
  }
  // Define protected admin routes
  const adminRoutes = ["/admin", "/admin/dashboard"];
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Handle unauthenticated users trying to access admin routes
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Handle authenticated users
  if (session) {
    // If user is SYSADMIN trying to access non-admin routes, redirect to admin dashboard
    if (session.user.role === "SYSADMIN" && !isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // If regular user tries to access admin routes, redirect to home
    if (isAdminRoute && session.user.role !== "SYSADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Return the original response for all other cases
  return response;
}

/**
 * Creates a Supabase client instance configured for server-side usage.
 * This function also manages cookies for authentication and session persistence.
 *
 * @param {NextRequest} request - The incoming HTTP request object from Next.js.
 * @returns {Object} - An object containing:
 *   - `supabase`: The initialized Supabase client.
 *   - `response`: A NextResponse object that can be used to send updated cookies back to the client.
 *
 * Usage:
 * Call this function in your middleware or API routes to initialize a Supabase client
 * and manage cookies seamlessly.
 */
export const createClient = (request: NextRequest) => {
  // Initialize a NextResponse object to handle response modifications (e.g., setting cookies).
  let response = NextResponse.next({
    request: {
      headers: request.headers, // Pass through the headers from the incoming request.
    },
  });

  // Create a Supabase client instance using environment variables for configuration.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase anonymous key.
    {
      cookies: {
        /**
         * Retrieves the value of a cookie by its name.
         *
         * @param {string} name - The name of the cookie to retrieve.
         * @returns {string | undefined} - The value of the cookie, or undefined if not found.
         */
        get(name: string) {
          return request.cookies.get(name)?.value; // Access the cookie from the request.
        },

        /**
         * Sets a cookie with the specified name, value, and options.
         *
         * @param {string} name - The name of the cookie to set.
         * @param {string} value - The value of the cookie.
         * @param {CookieOptions} options - Additional options for the cookie (e.g., maxAge, path).
         */
        set(name: string, value: string, options: CookieOptions) {
          // Update the request's cookies.
          request.cookies.set({
            name,
            value,
            ...options,
          });

          // Update the response to include the new cookie.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        /**
         * Removes a cookie by setting its value to an empty string and applying removal options.
         *
         * @param {string} name - The name of the cookie to remove.
         * @param {CookieOptions} options - Additional options for the cookie removal (e.g., path).
         */
        remove(name: string, options: CookieOptions) {
          // Update the request's cookies to reflect the removal.
          request.cookies.set({
            name,
            value: "", // Set the cookie value to an empty string.
            ...options,
          });

          // Update the response to reflect the removal of the cookie.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "", // Set the cookie value to an empty string.
            ...options,
          });
        },
      },
    }
  );

  // Return the Supabase client and the updated response object.
  return { supabase, response };
};

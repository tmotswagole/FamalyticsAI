import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Creates a Supabase client instance configured for server-side usage in API routes.
 * This function also manages cookies for authentication and session persistence.
 *
 * @param {NextApiRequest} request - The incoming HTTP request object from a Next.js API route.
 * @param {NextApiResponse} response - The outgoing HTTP response object from a Next.js API route.
 * @returns {Object} - An object containing:
 *   - `supabase`: The initialized Supabase client.
 *   - `response`: A NextApiResponse object that can be used to send updated cookies back to the client.
 *
 * Usage:
 * Call this function in your API routes to initialize a Supabase client
 * and manage cookies seamlessly.
 */
export const createClient = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    // Validate environment variables
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      response.status(500).json({
        status: "error",
        message: "Supabase environment variables are not properly configured.",
      });
      return;
    }

    // Create a Supabase client instance using environment variables for configuration.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL, // Supabase project URL.
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // Supabase anonymous key.
      {
        cookies: {
          /**
           * Retrieves the value of a cookie by its name.
           *
           * @param {string} name - The name of the cookie to retrieve.
           * @returns {string | undefined} - The value of the cookie, or undefined if not found.
           */
          get(name: string) {
            const cookies = Object.fromEntries(
              (request.headers.cookie || "").split("; ").map((cookie) => {
                const [key, ...values] = cookie.split("=");
                return [key, values.join("=")];
              })
            );
            return cookies[name]; // Access the cookie from the parsed cookies.
          },

          /**
           * Sets a cookie with the specified name, value, and options.
           *
           * @param {string} name - The name of the cookie to set.
           * @param {string} value - The value of the cookie.
           * @param {CookieOptions} options - Additional options for the cookie (e.g., maxAge, path).
           */
          set(name: string, value: string, options: CookieOptions) {
            response.setHeader(
              "Set-Cookie",
              `${name}=${value}; Path=${options.path || "/"}; Max-Age=${options.maxAge || ""}`
            );
          },

          /**
           * Removes a cookie by setting its value to an empty string and applying removal options.
           *
           * @param {string} name - The name of the cookie to remove.
           * @param {CookieOptions} options - Additional options for the cookie removal (e.g., path).
           */
          remove(name: string, options: CookieOptions) {
            response.setHeader(
              "Set-Cookie",
              `${name}=; Path=${options.path || "/"}; Max-Age=0`
            );
          },
        },
      }
    );

    // Return the Supabase client and the response object.
    return { supabase, response };
  } catch (error) {
    // Handle unexpected errors
    response.status(500).json({
      status: "error",
      message:
        "An unexpected error occurred while creating the Supabase client.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

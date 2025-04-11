import type { NextApiRequest, NextApiResponse } from "next";
import {
  setUserCookie,
  getUserFromCookie,
  clearUserCookies,
  updateLastActive,
  checkSessionTimeout,
} from "@/app/auth-cookies";
import { Arcjet } from "@/utils/arcjet/router";

/**
 * @swagger
 * /api/auth/user:
 *   post:
 *     summary: Set user authentication cookie
 *     description: Creates or updates the user authentication cookie with provided user data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User cookie set successfully
 *       400:
 *         description: Invalid request or missing user data
 *       500:
 *         description: Server error while setting cookie
 *
 *   get:
 *     summary: Get user data from cookie
 *     description: Retrieves the currently authenticated user's data from cookies
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       404:
 *         description: No user data found in cookies
 *       500:
 *         description: Server error while retrieving cookie
 *
 *   delete:
 *     summary: Clear user authentication cookies
 *     description: Removes all user-related authentication cookies (logout)
 *     responses:
 *       200:
 *         description: Cookies cleared successfully
 *       500:
 *         description: Server error while clearing cookies
 */
export default async function handleUserRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const rateLimit = await Arcjet.enforceRateLimitingWithTime(req, 1000); // 1 second rate limit
    if (!rateLimit.success) {
      return res.status(429).json({ error: rateLimit.reason });
    }

    switch (req.method) {
      case "POST":
        // Set user cookie
        if (!req.body.user) {
          return res.status(400).json({ error: "User object is required" });
        }
        await setUserCookie(req.body.user);
        return res.status(200).json({ success: true });

      case "GET": {
        // Get user from cookie
        const user = await getUserFromCookie();
        if (!user) {
          return res.status(404).json({ error: "No user data found" });
        }
        return res.status(200).json(user);
      }

      case "PUT":
        // Update last active timestamp
        await updateLastActive();
        return res.status(200).json({ success: true });

      case "DELETE":
        // Clear all user cookies
        await clearUserCookies();
        return res.status(200).json({ success: true });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("User cookie error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

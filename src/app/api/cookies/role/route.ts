import type { NextApiRequest, NextApiResponse } from "next";
import { setUserRoleCookie, getUserRoleFromCookie } from "@/app/auth-cookies";
import { Arcjet } from "@/utils/arcjet/router";

/**
 * @swagger
 * /api/auth/role:
 *   post:
 *     summary: Set user role cookie
 *     description: Stores the user's role information in a secure cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRole'
 *     responses:
 *       200:
 *         description: Role cookie set successfully
 *       400:
 *         description: Invalid role data provided
 *       500:
 *         description: Server error while setting role
 *
 *   get:
 *     summary: Get user role from cookie
 *     description: Retrieves the user's role information from cookies
 *     responses:
 *       200:
 *         description: Role data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       404:
 *         description: No role data found
 *       500:
 *         description: Server error while retrieving role
 */
export default async function handleRoleRequest(
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
        if (!req.body.role) {
          return res.status(400).json({ error: "Role data is required" });
        }
        await setUserRoleCookie(req.body);
        return res.status(200).json({ success: true });

      case "GET": {
        const role = await getUserRoleFromCookie();
        if (!role) {
          return res.status(404).json({ error: "No role data found" });
        }
        return res.status(200).json(role);
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Role cookie error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

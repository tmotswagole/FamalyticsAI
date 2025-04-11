import type { NextApiRequest, NextApiResponse } from "next";
import { checkSessionTimeout } from "@/app/auth-cookies";
import { LAST_ACTIVE_COOKIE } from "@/lib/constants";
import { Arcjet } from "@/utils/arcjet/router";

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Check session timeout status
 *     description: Verifies if the current user session has timed out based on last activity
 *     responses:
 *       200:
 *         description: Session status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timedOut:
 *                   type: boolean
 *                   description: Whether the session has timed out
 *                 lastActive:
 *                   type: number
 *                   format: timestamp
 *                   description: Last active timestamp if available
 *       500:
 *         description: Server error while checking session
 */
export default async function handleSessionRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const rateLimit = await Arcjet.enforceRateLimitingWithTime(req, 1000); // 1 second rate limit
    if (!rateLimit.success) {
      return res.status(429).json({ error: rateLimit.reason });
    }

    const timedOut = await checkSessionTimeout();
    const lastActiveCookie = req.cookies[LAST_ACTIVE_COOKIE];
    const lastActive = lastActiveCookie ? parseInt(lastActiveCookie, 10) : null;

    return res.status(200).json({ timedOut, lastActive });
  } catch (error) {
    console.error("Session check error:", error);
    return res.status(500).json({
      error: "Failed to check session status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

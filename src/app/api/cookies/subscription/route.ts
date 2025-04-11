import type { NextApiRequest, NextApiResponse } from "next";
import {
  setUserSubscriptionCookie,
  getUserSubscriptionFromCookie,
} from "@/app/auth-cookies";
import { Arcjet } from "@/utils/arcjet/router";

/**
 * @swagger
 * /api/auth/subscription:
 *   post:
 *     summary: Set subscription cookie
 *     description: Stores user subscription data in a secure cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: Subscription cookie set successfully
 *       400:
 *         description: Invalid subscription data provided
 *       500:
 *         description: Server error while setting subscription
 *
 *   get:
 *     summary: Get subscription from cookie
 *     description: Retrieves subscription data from cookies
 *     responses:
 *       200:
 *         description: Subscription data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: No subscription data found
 *       500:
 *         description: Server error while retrieving subscription
 */
export default async function handleSubscriptionRequest(
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
        if (!req.body.id) {
          return res.status(400).json({ error: "Subscription ID is required" });
        }
        await setUserSubscriptionCookie(req.body);
        return res.status(200).json({ success: true });

      case "GET": {
        const subscription = await getUserSubscriptionFromCookie();
        if (!subscription) {
          return res.status(404).json({ error: "No subscription data found" });
        }
        return res.status(200).json(subscription);
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Subscription cookie error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

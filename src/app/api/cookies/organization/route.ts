import type { NextApiRequest, NextApiResponse } from "next";
import {
  setOrganizationCookie,
  getOrganizationFromCookie,
} from "@/app/auth-cookies";
import { Arcjet } from "@/utils/arcjet/router";

/**
 * @swagger
 * /api/auth/organization:
 *   post:
 *     summary: Set organization cookie
 *     description: Stores organization data in a secure cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       200:
 *         description: Organization cookie set successfully
 *       400:
 *         description: Invalid organization data provided
 *       500:
 *         description: Server error while setting organization data
 *
 *   get:
 *     summary: Get organization from cookie
 *     description: Retrieves organization data from cookies
 *     responses:
 *       200:
 *         description: Organization data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: No organization data found
 *       500:
 *         description: Server error while retrieving organization data
 */
export default async function handleOrganizationRequest(
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
        if (!req.body.name) {
          return res
            .status(400)
            .json({ error: "Organization name is required" });
        }
        await setOrganizationCookie(req.body);
        return res.status(200).json({ success: true });

      case "GET": {
        const organization = await getOrganizationFromCookie();
        if (!organization) {
          return res.status(404).json({ error: "No organization data found" });
        }
        return res.status(200).json(organization);
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Organization cookie error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

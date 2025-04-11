import type { NextApiRequest, NextApiResponse } from "next";
import {
  setUserCookie,
  getUserFromCookie,
  clearUserCookies,
  updateLastActive,
  checkSessionTimeout,
  setUserRoleCookie,
  getUserRoleFromCookie,
  setOrganizationCookie,
  getOrganizationFromCookie,
  setUserSubscriptionCookie,
  getUserSubscriptionFromCookie,
} from "@/app/auth-cookies";

export async function handleUserRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      if (!req.body.user) {
        return res.status(400).json({ error: "User object is required" });
      }
      await setUserCookie(req.body.user);
      return res.status(200).json({ success: true });

    case "GET": {
      const user = await getUserFromCookie();
      if (!user) {
        return res.status(404).json({ error: "No user data found" });
      }
      return res.status(200).json(user);
    }

    case "PUT":
      await updateLastActive();
      return res.status(200).json({ success: true });

    case "DELETE":
      await clearUserCookies();
      return res.status(200).json({ success: true });

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function handleRoleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
}

export async function handleOrganizationRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      if (!req.body.organization) {
        return res.status(400).json({ error: "Organization data is required" });
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
}

export async function handleSubscriptionRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      if (!req.body.subscription) {
        return res.status(400).json({ error: "Subscription data is required" });
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
}

export async function handleSessionTimeoutRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const isSessionTimedOut = await checkSessionTimeout();
    return res.status(200).json({ sessionTimedOut: isSessionTimedOut });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

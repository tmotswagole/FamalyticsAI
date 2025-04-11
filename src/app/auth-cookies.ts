"use server";

import { cookies } from "next/headers";
import { User } from "@supabase/supabase-js";
import {
  USER_COOKIE,
  LAST_ACTIVE_COOKIE,
  USER_ROLE_COOKIE,
  ORGANIZATION_COOKIE,
  USER_SUBSCRIPTION_COOKIE,
  REGULAR_USER_TIMEOUT,
  ADMIN_USER_TIMEOUT,
} from "@/lib/constants";

// Set user data in cookies (excluding sensitive information)
type UserData = {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  app_metadata: Record<string, any>;
  email: string;
  last_active: number;
};

type UserRole = {
  role: string;
};

type Subscription = {
  id: string;
  user_id: string | null;
  stripe_id: string | null;
  price_id: string | null;
  stripe_price_id: string | null;
  currency: string | null;
  interval: string | null;
  status: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  amount: number | null;
  started_at: number | null;
  ends_at: number | null;
  ended_at: number | null;
  canceled_at: number | null;
  customer_cancellation_reason: string | null;
  customer_cancellation_comment: string | null;
  metadata: Record<string, any> | null;
  custom_field_data: Record<string, any> | null;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
};

type Organization = {
  name: string;
  created_at: string;
  subscription_tier: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  settings: Record<string, any> | null;
};

// Helper function to handle cookie operations
const setCookie = async (name: string, value: string) => {
  cookies().set({
    name,
    value,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });
};

// Set user data in cookies
export const setUserCookie = async (user: User): Promise<void> => {
  if (!user) throw new Error("User object is required");

  const userData: UserData = {
    id: user.id,
    role: user.role ?? "",
    created_at: user.created_at ?? "",
    updated_at: user.updated_at ?? "",
    app_metadata: user.app_metadata,
    email: user.email ?? "",
    last_active: Date.now(),
  };

  await setCookie(USER_COOKIE, JSON.stringify(userData));
  await setCookie(LAST_ACTIVE_COOKIE, Date.now().toString());
};

// Update the last active timestamp
export const updateLastActive = async () => {
  await setCookie(LAST_ACTIVE_COOKIE, Date.now().toString());
};

// Get user data from cookie
export const getUserFromCookie = async (): Promise<UserData | null> => {
  const userCookie = cookies().get(USER_COOKIE);
  if (!userCookie?.value) return null;

  try {
    return JSON.parse(userCookie.value) as UserData;
  } catch (error) {
    console.error("Failed to parse user cookie:", error);
    return null;
  }
};

// Clear user cookies on logout
export const clearUserCookies = async () => {
  const cookieNames = [
    USER_COOKIE,
    LAST_ACTIVE_COOKIE,
    USER_ROLE_COOKIE,
    ORGANIZATION_COOKIE,
    USER_SUBSCRIPTION_COOKIE,
  ];

  cookieNames.forEach((name) => cookies().delete(name));
};

// Check if user session has timed out
export const checkSessionTimeout = async (): Promise<boolean> => {
  const userRole = await getUserRoleFromCookie();
  const lastActiveCookie = cookies().get(LAST_ACTIVE_COOKIE);

  if (!userRole || !lastActiveCookie?.value) return true;

  try {
    const lastActive = parseInt(lastActiveCookie.value, 10);
    const now = Date.now();
    const timeoutDuration =
      userRole.role === "SYSADMIN" ? ADMIN_USER_TIMEOUT : REGULAR_USER_TIMEOUT;

    return now - lastActive > timeoutDuration;
  } catch (error) {
    console.error("Failed to check session timeout:", error);
    return true;
  }
};

// Set user role in cookies
export const setUserRoleCookie = async (role: UserRole) => {
  await setCookie(USER_ROLE_COOKIE, JSON.stringify(role));
};

// Get user role from cookies
export const getUserRoleFromCookie = async (): Promise<UserRole | null> => {
  const roleCookie = cookies().get(USER_ROLE_COOKIE);
  if (!roleCookie?.value) return null;

  try {
    return JSON.parse(roleCookie.value) as UserRole;
  } catch (error) {
    console.error("Failed to parse role cookie:", error);
    return null;
  }
};

// Set organization data in cookies
export const setOrganizationCookie = async (organization: Organization) => {
  await setCookie(ORGANIZATION_COOKIE, JSON.stringify(organization));
};

// Get organization data from cookies
export const getOrganizationFromCookie =
  async (): Promise<Organization | null> => {
    const organizationCookie = cookies().get(ORGANIZATION_COOKIE);
    if (!organizationCookie?.value) return null;

    try {
      return JSON.parse(organizationCookie.value) as Organization;
    } catch (error) {
      console.error("Failed to parse organization cookie:", error);
      return null;
    }
  };

// Set user subscription data in cookies
export const setUserSubscriptionCookie = async (subscription: Subscription) => {
  await setCookie(USER_SUBSCRIPTION_COOKIE, JSON.stringify(subscription));
};

// Get user subscription data from cookies
export const getUserSubscriptionFromCookie =
  async (): Promise<Subscription | null> => {
    const subscriptionCookie = cookies().get(USER_SUBSCRIPTION_COOKIE);
    if (!subscriptionCookie?.value) return null;

    try {
      return JSON.parse(subscriptionCookie.value) as Subscription;
    } catch (error) {
      console.error("Failed to parse subscription cookie:", error);
      return null;
    }
  };

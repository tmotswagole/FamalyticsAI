import { cookies } from "next/headers";
import { User } from "@supabase/supabase-js";

// Cookie names
export const USER_COOKIE = "famalytics_user";
export const LAST_ACTIVE_COOKIE = "famalytics_last_active";
export const USER_ROLE_COOKIE = "famalytics_user_role";
export const ORGANIZATION_COOKIE = "famalytics_organization";
export const USER_SUBSCRIPTION_COOKIE = "famalytics_user_subscription";

// Timeout durations in milliseconds
export const REGULAR_USER_TIMEOUT = 5 * 60 * 60 * 1000; // 5 hours
export const ADMIN_USER_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

// Set user data in cookies (excluding sensitive information)
type UserData = {
  id: string;
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

export function setUserCookie(user: User) {
  if (!user) return;

  const User: UserData = {
    id: user.id,
    email: user.email || "",
    last_active: Date.now(),
  };

  // Set the user cookie
  cookies().set({
    name: USER_COOKIE,
    value: JSON.stringify(User),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });

  // Set last active time
  cookies().set({
    name: LAST_ACTIVE_COOKIE,
    value: Date.now().toString(),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });
}

// Update the last active timestamp
export function updateLastActive() {
  cookies().set({
    name: LAST_ACTIVE_COOKIE,
    value: Date.now().toString(),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });
}

// Get user data from cookie
export function getUserFromCookie(): UserData | null {
  const userCookie = cookies().get(USER_COOKIE);
  if (!userCookie?.value) return null;

  try {
    return JSON.parse(userCookie.value) as UserData;
  } catch (error) {
    return null;
  }
}

// Clear user cookies on logout
export function clearUserCookies() {
  cookies().delete(USER_COOKIE);
  cookies().delete(LAST_ACTIVE_COOKIE);
}

// Check if user session has timed out
export function checkSessionTimeout(): boolean {
  const userRole = getUserRoleFromCookie();
  const lastActiveCookie = cookies().get(LAST_ACTIVE_COOKIE);

  if (!userRole || !lastActiveCookie?.value) return true;

  const lastActive = parseInt(lastActiveCookie.value, 10);
  const now = Date.now();
  const timeoutDuration =
    userRole.role === "SYSADMIN" ? ADMIN_USER_TIMEOUT : REGULAR_USER_TIMEOUT;

  return now - lastActive > timeoutDuration;
}

// Set user role in cookies
export function setUserRoleCookie(role: UserRole) {
  cookies().set({
    name: USER_ROLE_COOKIE,
    value: JSON.stringify(role),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });
}

// Get user role from cookies
export function getUserRoleFromCookie(): UserRole | null {
  const roleCookie = cookies().get(USER_ROLE_COOKIE);
  if (!roleCookie?.value) return null;

  try {
    return JSON.parse(roleCookie.value) as UserRole;
  } catch (error) {
    return null;
  }
}

// Set organization data in cookies
export function setOrganizationCookie(organization: Organization) {
  cookies().set({
    name: ORGANIZATION_COOKIE,
    value: JSON.stringify(organization),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });
}

// Get organization data from cookies
export function getOrganizationFromCookie(): Organization | null {
  const organizationCookie = cookies().get(ORGANIZATION_COOKIE);
  if (!organizationCookie?.value) return null;

  try {
    return JSON.parse(organizationCookie.value) as Organization;
  } catch (error) {
    return null;
  }
}

// Set user subscription data in cookies
export function setUserSubscriptionCookie(subscription: Subscription) {
  cookies().set({
    name: USER_SUBSCRIPTION_COOKIE,
    value: JSON.stringify(subscription),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });
}

// Get user subscription data from cookies
export function getUserSubscriptionFromCookie(): Subscription | null {
  const subscriptionCookie = cookies().get(USER_SUBSCRIPTION_COOKIE);
  if (!subscriptionCookie?.value) return null;

  try {
    return JSON.parse(subscriptionCookie.value) as Subscription;
  } catch (error) {
    return null;
  }
}

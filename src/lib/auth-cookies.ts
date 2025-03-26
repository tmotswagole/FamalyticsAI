import { cookies } from "next/headers";
import { User } from "@supabase/supabase-js";

// Cookie names
export const USER_COOKIE = "famalytics_user";
export const LAST_ACTIVE_COOKIE = "famalytics_last_active";

// Timeout durations in milliseconds
export const REGULAR_USER_TIMEOUT = 5 * 60 * 60 * 1000; // 5 hours
export const ADMIN_USER_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

// Set user data in cookies (excluding sensitive information)
type UserData = {
  id: string;
  email: string;
  role?: string;
  last_active: number;
};

export function setUserCookie(user: User) {
  if (!user) return;

  // Create a safe version of user data (no sensitive info)
  const User: UserData = {
    id: user.id,
    email: user.email || "",
    role: user.role,
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
  const user = getUserFromCookie();
  const lastActiveCookie = cookies().get(LAST_ACTIVE_COOKIE);

  if (!user || !lastActiveCookie?.value) return true;

  const lastActive = parseInt(lastActiveCookie.value, 10);
  const now = Date.now();
  const timeoutDuration =
    user.role === "SYSADMIN" ? ADMIN_USER_TIMEOUT : REGULAR_USER_TIMEOUT;

  return now - lastActive > timeoutDuration;
}

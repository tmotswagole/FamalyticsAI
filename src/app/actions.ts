"use server";

import { createClient } from "../../supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  setUserCookie,
  clearUserCookies,
  setUserRoleCookie,
  setOrganizationCookie,
  setUserSubscriptionCookie,
} from "@/lib/auth-cookies";

interface Subscription {
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
}

interface Organization {
  name: string;
  created_at: string;
  subscription_tier: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  settings: Record<string, any> | null;
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        user_id: user.id,
        name: fullName,
        email: email,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        // Error handling without console.error
      }
    } catch (err) {
      // Error handling without console.error
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link."
  );
};

async function getUserData(user: any, supabase: any) {
  const { data: userData } = await supabase
    .from("auth.users")
    .select("role")
    .eq("user_id", user.id)
    .single();
  return userData;
}

async function getUserOrganizations(user: any, supabase: any) {
  const { data: organization_id } = await supabase
    .from("user_organizations")
    .select("organization_id")
    .eq("user_id", user.id);
  return organization_id;
}

async function getOrganizationInfo(organization_id: string, supabase: any) {
  // Use organization_id to query organizations table
  const { data: organization } = await supabase
    .from("organizations")
    .select(
      "name, created_at, subscription_tier, subscription_status, stripe_customer_id, settings"
    )
    .eq("id", organization_id)
    .single();

  return organization;
}

async function getUserSubscription(user: any, supabase: any) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();
  return subscription;
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (!user) {
    return redirect("/sign-up");
  }

  const userData = await getUserData(user, supabase);

  if (userData?.role === "SYSADMIN") {
    setUserCookie(user);
    setUserCookie(userData.role);
    return redirect("/admin/dashboard");
  } else if (userData?.role === "CLIENTADMIN") {
    setUserCookie(user);
    setUserRoleCookie(userData.role);

    const userOrganizations = await getUserOrganizations(user, supabase);

    if (!userOrganizations || userOrganizations.length === 0) {
      return redirect("/success/create-organization");
    }

    const organizationInfo = await getOrganizationInfo(
      userOrganizations[0].organization_id,
      supabase
    );

    setOrganizationCookie(organizationInfo);

    const userSubscription = await getUserSubscription(user, supabase);

    if (!userSubscription) {
      return redirect("/pricing");
    }

    setUserSubscriptionCookie(userSubscription);
    return redirect("/dashboard");
  } else if (userData?.role === "OBSERVER") {
    setUserCookie(user);
    setUserRoleCookie(userData.role);
    return redirect("/dashboard/observer");
  }

  return encodedRedirect("error", "/sign-in", "Invalid user role");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed"
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard/reset-password",
    "Password updated successfully! You can now use your new password to sign in."
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear user cookies on logout
  clearUserCookies();

  return redirect("/sign-in");
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) {
    return false;
  }

  return !!subscription;
};

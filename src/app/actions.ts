import "server-only";
// import { createClient } from "../../supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Arcjet } from "@/utils/arcjet/router";
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

export const signUpAction = async (
  formData: FormData,
  request: NextRequest
) => {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("full_name")?.toString() || "";

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;
    const res = middlewareResponse.response;

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    if (!rateLimitValidation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: rateLimitValidation.reason || "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    // Validate email format
    const emailValidation = await Arcjet.validateEmail(
      new Request("", { headers: { "x-user-email": email || "" } })
    );
    if (!emailValidation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: emailValidation.reason || "Invalid email address",
        },
        { status: 400 }
      );
    }

    // Protect signup form
    const signupValidation = await Arcjet.protectSignupForm(
      new Request("", { body: JSON.stringify({ username: email, password }) })
    );
    if (!signupValidation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: signupValidation.reason || "Invalid signup data",
        },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${headers().get("origin")}/auth/callback`,
        data: {
          full_name: fullName,
          email: email,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 400 }
      );
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
          throw new Error(updateError.message);
        }
      } catch (err) {
        throw new Error("Failed to update user information.");
      }
    }

    return NextResponse.json(
      {
        status: "success",
        message:
          "Thanks for signing up! Please check your email for a verification link.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    const res = createClient(request).response;
    return NextResponse.json(
      {
        status: "error",
        message: err.message || "An error occurred during signup.",
      },
      { status: 500 }
    );
  }
};

export const signInAction = async (
  formData: FormData,
  request: NextRequest
) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;
    const res = middlewareResponse.response;

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    if (!rateLimitValidation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: rateLimitValidation.reason || "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.redirect(new URL("/sign-up", res.url));
    }

    const userData = await getUserData(user, supabase);
    setUserCookie(user);
    setUserRoleCookie(userData.role);

    if (userData?.role === "SYSADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", res.url));
    } else if (userData?.role === "CLIENTADMIN") {
      const userOrganizations = await getUserOrganizations(user, supabase);

      if (!userOrganizations || userOrganizations.length === 0) {
        return NextResponse.redirect(
          new URL("/success/create-organization", res.url)
        );
      }

      const organizationInfo = await getOrganizationInfo(
        userOrganizations[0].organization_id,
        supabase
      );

      setOrganizationCookie(organizationInfo);

      const userSubscription = await getUserSubscription(user.id, supabase);

      if (!userSubscription) {
        return NextResponse.redirect(new URL("/success/make-payment", res.url));
      }

      setUserSubscriptionCookie(userSubscription);
      return NextResponse.redirect(new URL("/dashboard", res.url));
    } else if (userData?.role === "OBSERVER") {
      return NextResponse.redirect(new URL("/dashboard/observer", res.url));
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Invalid user role",
      },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: err.message || "An error occurred during sign-in.",
      },
      { status: 500 }
    );
  }
};

export const forgotPasswordAction = async (
  formData: FormData,
  request: NextRequest
) => {
  try {
    const email = formData.get("email")?.toString();

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;
    const res = middlewareResponse.response;
    const origin = headers().get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    if (!rateLimitValidation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: rateLimitValidation.reason || "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
    });

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Could not reset password.",
        },
        { status: 400 }
      );
    }

    if (callbackUrl) {
      return redirect(callbackUrl);
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Check your email for a link to reset your password.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message:
          err.message || "An error occurred while resetting the password.",
      },
      { status: 500 }
    );
  }
};

export const resetPasswordAction = async (
  formData: FormData,
  request: NextRequest
) => {
  try {
    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;
    const res = middlewareResponse.response;

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    if (!rateLimitValidation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: rateLimitValidation.reason || "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          status: "error",
          message: "Password and confirm password are required",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          status: "error",
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Password update failed.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message:
          "Password updated successfully! You can now use your new password to sign in.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message:
          err.message || "An error occurred while updating the password.",
      },
      { status: 500 }
    );
  }
};

export const signOutAction = async (request: NextRequest, supabase: any) => {
  await supabase.auth.signOut();

  // Clear user cookies on logout
  clearUserCookies();

  return redirect("/sign-in");
};

/**
 * Methods to query the database and find user specific information.
 * These methods are used to retrieve user data, organizations, and subscription information.
 */
export const checkUserSubscription = async (
  userId: string,
  request: NextRequest
) => {
  try {
    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;

    const subscription = await getUserSubscription(userId, supabase);

    return subscription;
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message:
          err.message || "An error occurred while checking the subscription.",
      },
      { status: 500 }
    );
  }
};

export const checkUserOrganizations = async (
  userId: string,
  request: NextRequest
) => {
  try {
    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;

    const organizationInfo = await getOrganizationInfo(userId, supabase);

    return !!organizationInfo;
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message:
          err.message || "An error occurred while checking user organizations.",
      },
      { status: 500 }
    );
  }
};

export const checkUserExists = async (userId: string, request: NextRequest) => {
  try {
    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;

    const { data: user, error } = await supabase
      .from("auth.users")
      .select("id")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return false;
    }

    return true;
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message:
          err.message || "An error occurred while checking user existence.",
      },
      { status: 500 }
    );
  }
};

/**
 * Methods to query the database and find user specific information.
 * These methods are used to retrieve user data, organizations, and subscription information.
 */
async function getUserData(user: any, supabase: any) {
  try {
    const { data: userData } = await supabase
      .from("auth.users")
      .select("role")
      .eq("id", user.id)
      .single();
    return userData;
  } catch (err: any) {
    throw new Error(
      err.message || "An error occurred while fetching user data."
    );
  }
}

async function getUserOrganizations(user: any, supabase: any) {
  try {
    const { data: userOrgs } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", user.id);
    return userOrgs;
  } catch (err: any) {
    throw new Error(
      err.message || "An error occurred while fetching user organizations."
    );
  }
}

async function getUserSubscription(userId: any, supabase: any) {
  try {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();
    return subscription;
  } catch (err: any) {
    throw new Error(
      err.message || "An error occurred while fetching user subscription."
    );
  }
}

async function getOrganizationInfo(user_id: string, supabase: any) {
  try {
    // Query user_organizations to get organization_id
    const { data: userOrg } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", user_id)
      .single();

    if (!userOrg) {
      return null;
    }

    // Use organization_id to query organizations table
    const { data: organization } = await supabase
      .from("organizations")
      .select(
        "name, created_at, subscription_tier, subscription_status, stripe_customer_id, settings"
      )
      .eq("id", userOrg.organization_id)
      .single();

    return organization;
  } catch (err: any) {
    throw new Error(
      err.message || "An error occurred while fetching organization info."
    );
  }
}

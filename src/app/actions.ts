import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Arcjet } from "@/utils/arcjet/router";
import {
  setUserCookie,
  clearUserCookies,
  setUserRoleCookie,
  setOrganizationCookie,
  setUserSubscriptionCookie,
} from "@/app/auth-cookies";

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

type UserRole = {
  role: string;
};

export const signUpAction = async (
  formData: FormData,
  request: NextRequest
) => {
  try {
    console.log(
      "[signUpAction] Received formData:",
      Object.fromEntries(formData.entries())
    );

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("full_name")?.toString() || "";

    console.log("[signUpAction] Extracted email:", email);
    console.log("[signUpAction] Extracted password:", password);
    console.log("[signUpAction] Extracted full name:", fullName);

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;
    const response = middlewareResponse.response;

    console.log("[signUpAction] Middleware response:", middlewareResponse);
    console.log("[signUpAction] Middleware response headers:", headers());
    console.log(
      "[signUpAction] Middleware response cookies:",
      response.cookies
    );
    console.log("[signUpAction] Middleware response URL:", response.url);
    console.log(
      "[signUpAction] Middleware response origin:",
      headers().get("origin")
    );
    console.log("[signUpAction] Middleware response nextUrl:", response.url);

    console.log("[signUpAction] Middleware client created.");

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    console.log(
      "[signUpAction] Rate limit validation result:",
      rateLimitValidation
    );

    if (!rateLimitValidation.success) {
      console.log("[signUpAction] Rate limit exceeded.");
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
    console.log("[signUpAction] Email validation result:", emailValidation);

    if (!emailValidation.success) {
      console.log("[signUpAction] Invalid email address.");
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
    console.log("[signUpAction] Signup validation result:", signupValidation);

    if (!signupValidation.success) {
      console.log("[signUpAction] Invalid signup data.");
      return NextResponse.json(
        {
          status: "error",
          message: signupValidation.reason || "Invalid signup data",
        },
        { status: 400 }
      );
    }

    if (!email || !password) {
      console.log("[signUpAction] Missing email or password.");
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

    console.log("[signUpAction] Supabase sign-up result:", { user, error });

    if (error) {
      console.log("[signUpAction] Sign-up error:", error.message);
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
        console.log("[signUpAction] Inserting user into database.");
        const { error: updateError } = await supabase.from("users").insert({
          id: user.id,
          user_id: user.id,
          name: fullName,
          email: email,
          token_identifier: user.id,
          created_at: new Date().toISOString(),
        });

        if (updateError) {
          console.log(
            "[signUpAction] Database insertion error:",
            updateError.message
          );
          throw new Error(updateError.message);
        }
      } catch (err) {
        console.log("[signUpAction] Failed to update user information.");
        throw new Error("Failed to update user information.");
      }
    }

    console.log("[signUpAction] Sign-up successful.");
    return NextResponse.json(
      {
        status: "success",
        message:
          "Thanks for signing up! Please check your email for a verification link.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("[signUpAction] Error occurred:", err.message);
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
    console.log(
      "[signInAction] Received formData:",
      Object.fromEntries(formData.entries())
    );

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("[signInAction] Extracted email:", email);
    console.log("[signInAction] Extracted password:", password);

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;
    const response = middlewareResponse.response;

    console.log("[signInAction] Middleware response:", middlewareResponse);

    console.log("[signInAction] Middleware client created.");

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    console.log(
      "[signInAction] Rate limit validation result:",
      rateLimitValidation
    );

    if (!rateLimitValidation.success) {
      console.log("[signInAction] Rate limit exceeded.");
      return NextResponse.json(
        {
          status: "error",
          message: rateLimitValidation.reason || "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    const {
      data: { user: rawUser },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const user = rawUser
      ? {
          id: rawUser.id,
          role: rawUser.role,
          email: rawUser.email,
          created_at: rawUser.created_at,
          updated_at: rawUser.updated_at,
          app_metadata: rawUser.app_metadata || {},
          user_metadata: rawUser.user_metadata || {},
          aud: rawUser.aud || "",
        }
      : null;

    console.log("[signInAction] Mapped user object:", user);

    if (error) {
      console.log("[signInAction] Sign-in error:", error.message);
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 400 }
      );
    }

    if (!user) {
      console.log("[signInAction] No user found, redirecting to sign-up.");
      return NextResponse.redirect(new URL("/sign-up", request.nextUrl.origin));
    }

    setUserCookie(user);
    console.log("[signInAction] User cookie set.");

    const userRole: UserRole = { role: user?.role ?? "" };

    setUserRoleCookie(userRole);
    console.log("[signInAction] User role cookie set:", userRole);

    if (user.role === "SYSADMIN") {
      console.log("[signInAction] Redirecting SYSADMIN to admin dashboard.");

      return redirect("/admin/dashboard");
    } else if (user.role === "CLIENTADMIN") {
      const userOrganizations = await getUserOrganizations(user, supabase);
      console.log(
        "[signInAction] Retrieved user organizations:",
        userOrganizations
      );

      if (!userOrganizations || userOrganizations.length === 0) {
        console.log(
          "[signInAction] No organizations found, redirecting to create organization."
        );
        return redirect("/success/create-organization");
      }

      const organizationInfo = await getOrganizationInfo(
        userOrganizations[0].organization_id,
        supabase
      );
      console.log(
        "[signInAction] Retrieved organization info:",
        organizationInfo
      );

      setOrganizationCookie(organizationInfo);
      console.log("[signInAction] Organization cookie set.");

      const userSubscription = await getUserSubscription(user.id, supabase);
      console.log(
        "[signInAction] Retrieved user subscription:",
        userSubscription
      );

      if (!userSubscription) {
        console.log(
          "[signInAction] No subscription found, redirecting to make payment."
        );
        return redirect("/success/make-payment");
      }

      setUserSubscriptionCookie(userSubscription);
      console.log("[signInAction] User subscription cookie set.");

      console.log("[signInAction] Redirecting CLIENTADMIN to dashboard.");
      return redirect("/dashboard");
    } else if (user.role === "OBSERVER") {
      console.log("[signInAction] Redirecting OBSERVER to observer dashboard.");
      return redirect("/dashboard/observer");
    }

    console.log("[signInAction] Invalid user role:", user.role);
    return NextResponse.json(
      {
        status: "error",
        message: "Invalid user role",
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.log("[signInAction] Error occurred:", err.message);
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
    console.log(
      "[forgotPasswordAction] Received formData:",
      Object.fromEntries(formData.entries())
    );

    const email = formData.get("email")?.toString();
    const callbackUrl = formData.get("callbackUrl")?.toString();

    console.log("[forgotPasswordAction] Extracted email:", email);
    console.log("[forgotPasswordAction] Extracted callbackUrl:", callbackUrl);

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;
    const origin = headers().get("origin");

    console.log("[forgotPasswordAction] Middleware client created.");

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    console.log(
      "[forgotPasswordAction] Rate limit validation result:",
      rateLimitValidation
    );

    if (!rateLimitValidation.success) {
      console.log("[forgotPasswordAction] Rate limit exceeded.");
      return NextResponse.json(
        {
          status: "error",
          message: rateLimitValidation.reason || "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    if (!email) {
      console.log("[forgotPasswordAction] Missing email.");
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

    console.log("[forgotPasswordAction] Supabase reset password result:", {
      error,
    });

    if (error) {
      console.log(
        "[forgotPasswordAction] Reset password error:",
        error.message
      );
      return NextResponse.json(
        {
          status: "error",
          message: "Could not reset password.",
        },
        { status: 400 }
      );
    }

    if (callbackUrl) {
      console.log(
        "[forgotPasswordAction] Redirecting to callbackUrl:",
        callbackUrl
      );
      return redirect(callbackUrl);
    }

    console.log(
      "[forgotPasswordAction] Reset password email sent successfully."
    );
    return NextResponse.json(
      {
        status: "success",
        message: "Check your email for a link to reset your password.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("[forgotPasswordAction] Error occurred:", err.message);
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
    console.log(
      "[resetPasswordAction] Received formData:",
      Object.fromEntries(formData.entries())
    );

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log("[resetPasswordAction] Extracted password:", password);
    console.log(
      "[resetPasswordAction] Extracted confirmPassword:",
      confirmPassword
    );

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;

    console.log("[resetPasswordAction] Middleware client created.");

    // Enforce rate limiting
    const rateLimitValidation = await Arcjet.enforceRateLimiting(request);
    console.log(
      "[resetPasswordAction] Rate limit validation result:",
      rateLimitValidation
    );

    if (!rateLimitValidation.success) {
      console.log("[resetPasswordAction] Rate limit exceeded.");
      return NextResponse.json(
        {
          status: "error",
          message: rateLimitValidation.reason || "Rate limit exceeded",
        },
        { status: 429 }
      );
    }

    if (!password || !confirmPassword) {
      console.log("[resetPasswordAction] Missing password or confirmPassword.");
      return NextResponse.json(
        {
          status: "error",
          message: "Password and confirm password are required",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      console.log("[resetPasswordAction] Passwords do not match.");
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

    console.log("[resetPasswordAction] Supabase update password result:", {
      error,
    });

    if (error) {
      console.log(
        "[resetPasswordAction] Password update error:",
        error.message
      );
      return NextResponse.json(
        {
          status: "error",
          message: "Password update failed.",
        },
        { status: 400 }
      );
    }

    console.log("[resetPasswordAction] Password updated successfully.");
    return NextResponse.json(
      {
        status: "success",
        message:
          "Password updated successfully! You can now use your new password to sign in.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("[resetPasswordAction] Error occurred:", err.message);
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

export const signOutAction = async (request: NextRequest) => {
  console.log("[signOutAction] Received request:", request);
  console.log("[signOutAction] Headers:", headers());

  const middlewareResponse = createClient(request);
  console.log("[signOutAction] Middleware response:", middlewareResponse);
  console.log("[signOutAction] Middleware response headers:", headers());
  console.log("[signOutAction] Middleware response cookies:", request.cookies);
  console.log("[signOutAction] Middleware response URL:", request.url);
  console.log(
    "[signOutAction] Middleware response origin:",
    headers().get("origin")
  );
  console.log("[signOutAction] Middleware response nextUrl:", request.nextUrl);

  const supabase = middlewareResponse.supabase;
  const res = middlewareResponse.response;
  console.log("[signOutAction] Middleware client created.");

  console.log("[signOutAction] Signing out user.");

  await supabase.auth.signOut();

  console.log("[signOutAction] Clearing user cookies.");
  clearUserCookies();

  console.log("[signOutAction] Redirecting to sign-in page.");
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
    console.log(
      "[checkUserSubscription] Checking subscription for userId:",
      userId
    );

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;

    const subscription = await getUserSubscription(userId, supabase);

    console.log(
      "[checkUserSubscription] Retrieved subscription:",
      subscription
    );
    return subscription;
  } catch (err: any) {
    console.log("[checkUserSubscription] Error occurred:", err.message);
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
    console.log(
      "[checkUserOrganizations] Checking organizations for userId:",
      userId
    );

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;

    const organizationInfo = await getOrganizationInfo(userId, supabase);

    console.log(
      "[checkUserOrganizations] Retrieved organization info:",
      organizationInfo
    );
    return !!organizationInfo;
  } catch (err: any) {
    console.log("[checkUserOrganizations] Error occurred:", err.message);
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
    console.log("[checkUserExists] Checking existence for userId:", userId);

    const middlewareResponse = createClient(request);
    const supabase = middlewareResponse.supabase;

    const { data: user, error } = await supabase
      .from("auth.users")
      .select("id")
      .eq("id", userId)
      .single();

    console.log("[checkUserExists] Supabase query result:", { user, error });

    if (error || !user) {
      console.log("[checkUserExists] User does not exist.");
      return false;
    }

    console.log("[checkUserExists] User exists.");
    return true;
  } catch (err: any) {
    console.log("[checkUserExists] Error occurred:", err.message);
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
    console.log("[getUserData] Fetching data for user:", user);

    const { data: userData } = await supabase
      .from("auth.users")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("[getUserData] Retrieved user data:", userData);
    return userData;
  } catch (err: any) {
    console.log("[getUserData] Error occurred:", err.message);
    throw new Error(
      err.message || "An error occurred while fetching user data."
    );
  }
}

async function getUserOrganizations(user: any, supabase: any) {
  try {
    console.log(
      "[getUserOrganizations] Fetching organizations for user:",
      user
    );

    const { data: userOrgs } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", user.id);

    console.log(
      "[getUserOrganizations] Retrieved user organizations:",
      userOrgs
    );
    return userOrgs;
  } catch (err: any) {
    console.log("[getUserOrganizations] Error occurred:", err.message);
    throw new Error(
      err.message || "An error occurred while fetching user organizations."
    );
  }
}

async function getUserSubscription(userId: any, supabase: any) {
  try {
    console.log(
      "[getUserSubscription] Fetching subscription for userId:",
      userId
    );

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    console.log("[getUserSubscription] Retrieved subscription:", subscription);
    return subscription;
  } catch (err: any) {
    console.log("[getUserSubscription] Error occurred:", err.message);
    throw new Error(
      err.message || "An error occurred while fetching user subscription."
    );
  }
}

async function getOrganizationInfo(user_id: string, supabase: any) {
  try {
    console.log(
      "[getOrganizationInfo] Fetching organization info for user_id:",
      user_id
    );

    // Query user_organizations to get organization_id
    const { data: userOrg } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", user_id)
      .single();

    console.log("[getOrganizationInfo] Retrieved user organization:", userOrg);

    if (!userOrg) {
      console.log("[getOrganizationInfo] No organization found for user.");
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

    console.log(
      "[getOrganizationInfo] Retrieved organization info:",
      organization
    );
    return organization;
  } catch (err: any) {
    console.log("[getOrganizationInfo] Error occurred:", err.message);
    throw new Error(
      err.message || "An error occurred while fetching organization info."
    );
  }
}

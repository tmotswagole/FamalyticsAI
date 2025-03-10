import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Check if this is a new user verification (not password reset)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check user role
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("role")
        .eq("user_id", user.id)
        .single();

      // If user is a system admin, redirect to admin dashboard
      if (!userError && userData?.role === "SYSADMIN") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", requestUrl.origin),
        );
      }

      // If user is a client admin
      if (!userError && userData?.role === "CLIENTADMIN") {
        // Check if user has an organization
        const { data: userOrgs } = await supabase
          .from("user_organizations")
          .select("organization_id")
          .eq("user_id", user.id);

        if (!userOrgs || userOrgs.length === 0) {
          // No organization, redirect to organization creation
          return NextResponse.redirect(
            new URL(
              redirect_to || "/success/create-organization",
              requestUrl.origin,
            ),
          );
        }

        // Check if user has an active subscription
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (!subscription) {
          // No active subscription, redirect to pricing
          return NextResponse.redirect(
            new URL(redirect_to || "/pricing", requestUrl.origin),
          );
        }
      }
      // else if (!userError && userData?.role === "OBSERVER") {
      //   // For regular users, check if they have an organization
      //   const { data: userOrgs } = await supabase
      //     .from("user_organizations")
      //     .select("organization_id")
      //     .eq("user_id", user.id);

      //   // If no organization, redirect to pricing page for payment
      //   if (!userOrgs || userOrgs.length === 0) {
      //     return NextResponse.redirect(new URL("/pricing", requestUrl.origin));
      //   }
      // }
    }
  }

  // URL to redirect to after sign in process completes
  // const redirectTo = redirect_to || "/dashboard";
  // return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

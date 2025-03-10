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
      // Check if user is a system admin
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!userError && userData?.role === "SYSADMIN") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", requestUrl.origin),
        );
      }

      // For non-admin users, check if they have an organization
      const { data: userOrgs } = await supabase
        .from("user_organizations")
        .select("organization_id")
        .eq("user_id", user.id);

      // If no organization, redirect to pricing page for payment
      if (!userOrgs || userOrgs.length === 0) {
        return NextResponse.redirect(new URL("/pricing", requestUrl.origin));
      }
    }
  }

  // URL to redirect to after sign in process completes
  const redirectTo = redirect_to || "/dashboard";
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

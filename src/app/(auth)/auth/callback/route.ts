import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";
import { setUserCookie } from "@/lib/auth-cookies";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect_to = requestUrl.searchParams.get("redirect_to");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const user = await getUser(supabase);
    if (user) {
      const redirectResponse = await handleUserRedirect(
        user,
        supabase,
        requestUrl
      );
      if (redirectResponse) {
        return redirectResponse;
      }
    }
  }

  const redirectTo = redirect_to ?? "/dashboard";
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

async function getUser(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

async function handleUserRedirect(user: any, supabase: any, requestUrl: URL) {
  const userData = await getUserData(user, supabase);
  setUserCookie(user, userData?.role);

  if (userData?.role === "SYSADMIN") {
    return NextResponse.redirect(
      new URL("/admin/dashboard", requestUrl.origin)
    );
  }

  if (userData?.role === "CLIENTADMIN") {
    return handleClientAdminRedirect(user, supabase, requestUrl);
  }
}

async function getUserData(user: any, supabase: any) {
  const { data: userData } = await supabase
    .from("auth.users")
    .select("role")
    .eq("user_id", user.id)
    .single();
  return userData;
}

async function handleClientAdminRedirect(
  user: any,
  supabase: any,
  requestUrl: URL
) {
  const userOrgs = await getUserOrganizations(user, supabase);
  if (!userOrgs || userOrgs.length === 0) {
    return NextResponse.redirect(
      new URL("/success/create-organization", requestUrl.origin)
    );
  }

  const subscription = await getUserSubscription(user, supabase);
  if (!subscription) {
    return NextResponse.redirect(new URL("/pricing", requestUrl.origin));
  }
}

async function getUserOrganizations(user: any, supabase: any) {
  const { data: userOrgs } = await supabase
    .from("user_organizations")
    .select("organization_id")
    .eq("user_id", user.id);
  return userOrgs;
}

async function getUserSubscription(user: any, supabase: any) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();
  return subscription;
}

async function getOrganizationInfo(user_id: string, supabase: any) {
  const { data: organizations } = await supabase
    .from("organizations")
    .select("*")
    .in(
      "id",
      supabase
        .from("user_organizations")
        .select("organization_id")
        .eq("user_id", user_id)
    );
  return organizations;
}

async function getUserInfo(user_id: string, supabase: any) {
  const { data: userInfo } = await supabase
    .from("admin.users")
    .select("*")
    .eq("id", user_id)
    .single();
  return userInfo;
}

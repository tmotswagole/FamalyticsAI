import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import {
  getAllSocialMediaEngagement,
  getFacebookEngagement,
  getTwitterEngagement,
  getInstagramEngagement,
  getLinkedInEngagement,
  type SocialMediaCredentials,
  type EngagementMetrics,
} from "@/lib/social-media";
import { analyzeSentiment } from "@/lib/openai";

/**
 * GET handler - fetch social media accounts
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");
    const platform = searchParams.get("platform");

    if (!organizationId) {
      return NextResponse.json(
        { error: "organization_id is required" },
        { status: 400 },
      );
    }

    // Verify user has access to this organization
    const { data: userOrg, error: userOrgError } = await supabase
      .from("auth.users")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", organizationId)
      .single();

    if (userOrgError || !userOrg) {
      return NextResponse.json(
        { error: "You do not have access to this organization" },
        { status: 403 },
      );
    }

    // Build query for social media accounts
    let query = supabase
      .from("social_media_accounts")
      .select("*")
      .eq("organization_id", organizationId);

    if (platform) {
      query = query.eq("platform", platform);
    }

    const { data: accounts, error: accountsError } = await query;

    if (accountsError) {
      return NextResponse.json(
        { error: accountsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

/**
 * POST handler - add a new social media account
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { organization_id, platform, credentials, name, username } = body;

    if (!organization_id || !platform || !credentials || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify user has admin access to this organization
    const { data: userOrg, error: userOrgError } = await supabase
      .from("auth.users")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", organization_id)
      .single();

    if (
      userOrgError ||
      !userOrg ||
      !["CLIENTADMIN", "SYSADMIN"].includes(userOrg.role)
    ) {
      return NextResponse.json(
        { error: "You do not have permission to add social media accounts" },
        { status: 403 },
      );
    }

    // Encrypt sensitive credentials before storing
    const encryptedCredentials = JSON.stringify(credentials);

    // Insert the new account
    const { data: newAccount, error: insertError } = await supabase
      .from("social_media_accounts")
      .insert({
        organization_id,
        platform,
        name,
        username: username || "",
        credentials: encryptedCredentials,
        last_synced: null,
        is_active: true,
        created_by: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Return the new account without sensitive credentials
    const safeAccount = { ...newAccount, credentials: undefined };
    return NextResponse.json(safeAccount);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

// This function has been moved to the engagement route file

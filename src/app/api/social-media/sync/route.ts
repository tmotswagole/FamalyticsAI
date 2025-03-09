import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

/**
 * POST handler - trigger a manual sync of social media data
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

    // Get request body
    const body = await request.json();
    const { organization_id, account_id } = body;

    if (!organization_id) {
      return NextResponse.json(
        { error: "organization_id is required" },
        { status: 400 },
      );
    }

    // Verify user has access to this organization
    const { data: userOrg, error: userOrgError } = await supabase
      .from("user_organizations")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", organization_id)
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
      .select("id")
      .eq("organization_id", organization_id)
      .eq("is_active", true);

    if (account_id) {
      query = query.eq("id", account_id);
    }

    const { data: accounts, error: accountsError } = await query;

    if (accountsError) {
      return NextResponse.json(
        { error: accountsError.message },
        { status: 500 },
      );
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json(
        { error: "No active social media accounts found" },
        { status: 404 },
      );
    }

    // Invoke the edge function to sync social media data
    const accountIds = accounts.map((a) => a.id);
    const { data: functionResponse, error: functionError } =
      await supabase.functions.invoke("sync-social-media", {
        body: { account_ids: accountIds },
      });

    if (functionError) {
      return NextResponse.json(
        { error: functionError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Social media sync initiated",
      accounts_processed: accountIds.length,
      result: functionResponse,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

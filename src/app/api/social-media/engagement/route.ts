import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import {
  getAllSocialMediaEngagement,
  type SocialMediaCredentials,
} from "@/lib/social-media";
import { analyzeSentiment } from "@/lib/openai";

/**
 * GET handler - fetch social media engagement metrics
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
    const accountId = searchParams.get("account_id");
    const platform = searchParams.get("platform");
    const daysBack = parseInt(searchParams.get("days") || "30", 10);
    const analyzeSentiments = searchParams.get("analyze_sentiment") === "true";

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
      .eq("organization_id", organizationId)
      .eq("is_active", true);

    if (accountId) {
      query = query.eq("id", accountId);
    }

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

    if (!accounts || accounts.length === 0) {
      return NextResponse.json([]);
    }

    // Prepare credentials for each account
    const credentials: SocialMediaCredentials[] = accounts.map((account) => {
      const decryptedCredentials = JSON.parse(account.credentials);
      return {
        platform: account.platform,
        ...decryptedCredentials,
      };
    });

    // Fetch engagement metrics from all accounts
    const engagementMetrics = await getAllSocialMediaEngagement(
      credentials,
      daysBack,
    );

    // Analyze sentiment if requested
    if (analyzeSentiments && engagementMetrics.length > 0) {
      for (let i = 0; i < engagementMetrics.length; i++) {
        if (engagementMetrics[i].content) {
          try {
            const sentimentResult = await analyzeSentiment(
              engagementMetrics[i].content,
            );
            engagementMetrics[i].sentiment = {
              score: sentimentResult.sentiment_score,
              label: sentimentResult.sentiment_label,
            };
          } catch (error) {
            console.error(
              `Error analyzing sentiment for post ${engagementMetrics[i].postId}:`,
              error,
            );
          }
        }
      }
    }

    // Update last_synced timestamp for accounts
    const now = new Date().toISOString();
    await supabase
      .from("social_media_accounts")
      .update({ last_synced: now })
      .in(
        "id",
        accounts.map((a) => a.id),
      );

    return NextResponse.json(engagementMetrics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

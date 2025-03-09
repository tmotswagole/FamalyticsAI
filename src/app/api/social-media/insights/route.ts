import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

/**
 * GET handler - fetch social media insights and aggregated metrics
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
    const daysBack = parseInt(searchParams.get("days") || "30", 10);

    if (!organizationId) {
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
      .eq("organization_id", organizationId)
      .single();

    if (userOrgError || !userOrg) {
      return NextResponse.json(
        { error: "You do not have access to this organization" },
        { status: 403 },
      );
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startDateStr = startDate.toISOString();

    // Build query for social media posts
    let query = supabase
      .from("social_media_posts")
      .select(
        `
        id, platform, post_date, likes, comments, shares, views, 
        sentiment_score, sentiment_label,
        social_media_accounts!inner(name)
      `,
      )
      .eq("organization_id", organizationId)
      .gte("post_date", startDateStr)
      .order("post_date", { ascending: false });

    if (platform && platform !== "all") {
      query = query.eq("platform", platform);
    }

    const { data: posts, error: postsError } = await query;

    if (postsError) {
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }

    // Calculate insights
    const insights = calculateInsights(posts, daysBack);

    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

/**
 * Calculate insights from social media posts
 */
function calculateInsights(posts: any[], daysBack: number) {
  if (!posts || posts.length === 0) {
    return {
      totalPosts: 0,
      totalEngagement: 0,
      averageEngagementPerPost: 0,
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
      platformDistribution: {},
      engagementTrends: [],
      topPerformingPosts: [],
    };
  }

  // Calculate total metrics
  const totalPosts = posts.length;
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalViews = 0;

  // Sentiment distribution
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

  // Platform distribution
  const platformCounts: Record<string, number> = {};

  // Engagement by day
  const engagementByDay: Record<
    string,
    { date: string; engagement: number; posts: number }
  > = {};

  // Process each post
  posts.forEach((post) => {
    // Add to totals
    totalLikes += post.likes || 0;
    totalComments += post.comments || 0;
    totalShares += post.shares || 0;
    totalViews += post.views || 0;

    // Add to sentiment counts
    if (post.sentiment_label) {
      sentimentCounts[post.sentiment_label as keyof typeof sentimentCounts]++;
    } else {
      sentimentCounts.neutral++;
    }

    // Add to platform counts
    platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;

    // Add to engagement by day
    const postDate = new Date(post.post_date);
    const dateStr = postDate.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!engagementByDay[dateStr]) {
      engagementByDay[dateStr] = { date: dateStr, engagement: 0, posts: 0 };
    }

    const postEngagement =
      (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
    engagementByDay[dateStr].engagement += postEngagement;
    engagementByDay[dateStr].posts += 1;
  });

  // Calculate total engagement
  const totalEngagement = totalLikes + totalComments + totalShares;
  const averageEngagementPerPost =
    totalPosts > 0 ? totalEngagement / totalPosts : 0;

  // Convert sentiment counts to percentages
  const sentimentDistribution = {
    positive:
      totalPosts > 0 ? (sentimentCounts.positive / totalPosts) * 100 : 0,
    neutral: totalPosts > 0 ? (sentimentCounts.neutral / totalPosts) * 100 : 0,
    negative:
      totalPosts > 0 ? (sentimentCounts.negative / totalPosts) * 100 : 0,
  };

  // Convert platform counts to percentages
  const platformDistribution: Record<string, number> = {};
  Object.entries(platformCounts).forEach(([platform, count]) => {
    platformDistribution[platform] =
      totalPosts > 0 ? (count / totalPosts) * 100 : 0;
  });

  // Fill in missing dates in the engagement trend
  const engagementTrends: Array<{
    date: string;
    engagement: number;
    posts: number;
  }> = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysBack);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    engagementTrends.push(
      engagementByDay[dateStr] || { date: dateStr, engagement: 0, posts: 0 },
    );
  }

  // Sort engagement trends by date
  engagementTrends.sort((a, b) => a.date.localeCompare(b.date));

  // Find top performing posts (by total engagement)
  const topPerformingPosts = [...posts]
    .map((post) => ({
      id: post.id,
      platform: post.platform,
      accountName: post.social_media_accounts?.name,
      date: post.post_date,
      engagement: (post.likes || 0) + (post.comments || 0) + (post.shares || 0),
      sentiment: post.sentiment_label,
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  return {
    totalPosts,
    totalEngagement,
    averageEngagementPerPost,
    engagementBreakdown: {
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
      views: totalViews,
    },
    sentimentDistribution,
    platformDistribution,
    engagementTrends,
    topPerformingPosts,
    rawCounts: {
      sentiment: sentimentCounts,
      platforms: platformCounts,
    },
  };
}

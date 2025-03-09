// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface SocialMediaCredentials {
  platform: "facebook" | "twitter" | "instagram" | "linkedin";
  accessToken: string;
  accessSecret?: string;
  pageId?: string;
  groupId?: string;
  username?: string;
}

interface EngagementMetrics {
  platform: string;
  postId: string;
  postUrl: string;
  postDate: string;
  content: string;
  likes: number;
  shares: number;
  comments: number;
  views?: number;
  impressions?: number;
  reach?: number;
  engagement?: number;
  engagementRate?: number;
  sentiment?: {
    score: number;
    label: string;
  };
  metadata?: Record<string, any>;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get all active social media accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("social_media_accounts")
      .select("*")
      .eq("is_active", true);

    if (accountsError) {
      throw new Error(`Error fetching accounts: ${accountsError.message}`);
    }

    if (!accounts || accounts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active social media accounts found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const results = [];

    // Process each account
    for (const account of accounts) {
      try {
        // Decrypt credentials
        const credentials: SocialMediaCredentials = JSON.parse(
          account.credentials,
        );
        credentials.platform = account.platform;

        // Fetch engagement data from the appropriate platform
        const engagementData = await fetchPlatformEngagement(credentials);

        if (engagementData.length > 0) {
          // Store posts in the database
          const { data: insertedPosts, error: insertError } = await supabase
            .from("social_media_posts")
            .upsert(
              engagementData.map((post) => ({
                account_id: account.id,
                organization_id: account.organization_id,
                platform: post.platform,
                post_id: post.postId,
                post_url: post.postUrl,
                post_date: post.postDate,
                content: post.content,
                likes: post.likes,
                comments: post.comments,
                shares: post.shares,
                views: post.views,
                impressions: post.impressions,
                reach: post.reach,
                engagement: post.engagement,
                engagement_rate: post.engagementRate,
                sentiment_score: post.sentiment?.score,
                sentiment_label: post.sentiment?.label,
                metadata: post.metadata,
                updated_at: new Date().toISOString(),
              })),
              { onConflict: "platform,post_id" },
            );

          if (insertError) {
            throw new Error(`Error inserting posts: ${insertError.message}`);
          }

          // Update account last_synced timestamp
          await supabase
            .from("social_media_accounts")
            .update({ last_synced: new Date().toISOString() })
            .eq("id", account.id);

          results.push({
            account_id: account.id,
            platform: account.platform,
            posts_synced: engagementData.length,
            status: "success",
          });
        } else {
          results.push({
            account_id: account.id,
            platform: account.platform,
            posts_synced: 0,
            status: "no_data",
          });
        }
      } catch (error) {
        console.error(`Error processing account ${account.id}:`, error);
        results.push({
          account_id: account.id,
          platform: account.platform,
          status: "error",
          error: error.message,
        });
      }
    }

    // Log the cron job execution
    await supabase.from("cron_logs").insert({
      job_name: "sync-social-media",
      status: "completed",
      details: results,
      executed_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        accounts_processed: accounts.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error syncing social media data:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

/**
 * Fetch engagement data from the appropriate platform
 */
async function fetchPlatformEngagement(
  credentials: SocialMediaCredentials,
  daysBack: number = 30,
): Promise<EngagementMetrics[]> {
  switch (credentials.platform) {
    case "facebook":
      return await getFacebookEngagement(credentials, daysBack);
    case "twitter":
      return await getTwitterEngagement(credentials, daysBack);
    case "instagram":
      return await getInstagramEngagement(credentials, daysBack);
    case "linkedin":
      return await getLinkedInEngagement(credentials, daysBack);
    default:
      throw new Error(`Unsupported platform: ${credentials.platform}`);
  }
}

/**
 * Facebook API integration
 */
async function getFacebookEngagement(
  credentials: SocialMediaCredentials,
  daysBack: number = 30,
): Promise<EngagementMetrics[]> {
  try {
    const { accessToken, pageId, groupId } = credentials;

    if (!accessToken) {
      throw new Error("Facebook access token is required");
    }

    if (!pageId && !groupId) {
      throw new Error("Either pageId or groupId is required for Facebook");
    }

    const since = Math.floor(Date.now() / 1000) - daysBack * 24 * 60 * 60;
    const endpoint = pageId
      ? `https://graph.facebook.com/v18.0/${pageId}/posts`
      : `https://graph.facebook.com/v18.0/${groupId}/feed`;

    const response = await fetch(
      `${endpoint}?fields=id,message,created_time,permalink_url,likes.summary(true),comments.summary(true),shares&since=${since}&access_token=${accessToken}`,
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API error: ${error.error.message}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((post: any) => ({
      platform: "facebook",
      postId: post.id,
      postUrl: post.permalink_url,
      postDate: post.created_time,
      content: post.message || "",
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
      metadata: {
        rawData: post,
      },
    }));
  } catch (error) {
    console.error("Error fetching Facebook engagement:", error);
    throw error;
  }
}

/**
 * Twitter/X API integration
 */
async function getTwitterEngagement(
  credentials: SocialMediaCredentials,
  daysBack: number = 30,
): Promise<EngagementMetrics[]> {
  try {
    const { accessToken, accessSecret, username } = credentials;

    if (!accessToken || !accessSecret) {
      throw new Error("Twitter access token and secret are required");
    }

    if (!username) {
      throw new Error("Twitter username is required");
    }

    // Twitter API v2 endpoint
    const endpoint = `https://api.twitter.com/2/users/by/username/${username}/tweets`;

    // Calculate date for filtering
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startTime = startDate.toISOString();

    const response = await fetch(
      `${endpoint}?start_time=${startTime}&tweet.fields=created_at,public_metrics,text&expansions=attachments.media_keys&media.fields=url`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twitter API error: ${error.detail || error.title}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((tweet: any) => ({
      platform: "twitter",
      postId: tweet.id,
      postUrl: `https://twitter.com/${username}/status/${tweet.id}`,
      postDate: tweet.created_at,
      content: tweet.text,
      likes: tweet.public_metrics?.like_count || 0,
      shares: tweet.public_metrics?.retweet_count || 0,
      comments: tweet.public_metrics?.reply_count || 0,
      views: tweet.public_metrics?.impression_count || 0,
      metadata: {
        rawData: tweet,
      },
    }));
  } catch (error) {
    console.error("Error fetching Twitter engagement:", error);
    throw error;
  }
}

/**
 * Instagram API integration
 */
async function getInstagramEngagement(
  credentials: SocialMediaCredentials,
  daysBack: number = 30,
): Promise<EngagementMetrics[]> {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("Instagram access token is required");
    }

    if (!pageId) {
      throw new Error("Instagram Business account ID is required");
    }

    // First, get the Instagram Business Account ID from the Facebook Page
    const accountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`,
    );

    if (!accountResponse.ok) {
      const error = await accountResponse.json();
      throw new Error(`Instagram API error: ${error.error.message}`);
    }

    const accountData = await accountResponse.json();
    const instagramAccountId = accountData.instagram_business_account?.id;

    if (!instagramAccountId) {
      throw new Error(
        "No Instagram Business account found for this Facebook Page",
      );
    }

    // Now get the media from the Instagram Business Account
    const since = Math.floor(Date.now() / 1000) - daysBack * 24 * 60 * 60;
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,caption,permalink,timestamp,like_count,comments_count,media_url&since=${since}&access_token=${accessToken}`,
    );

    if (!mediaResponse.ok) {
      const error = await mediaResponse.json();
      throw new Error(`Instagram API error: ${error.error.message}`);
    }

    const mediaData = await mediaResponse.json();

    if (!mediaData.data || !Array.isArray(mediaData.data)) {
      return [];
    }

    return mediaData.data.map((post: any) => ({
      platform: "instagram",
      postId: post.id,
      postUrl: post.permalink,
      postDate: post.timestamp,
      content: post.caption || "",
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      shares: 0, // Instagram doesn't provide shares count via API
      metadata: {
        mediaUrl: post.media_url,
        rawData: post,
      },
    }));
  } catch (error) {
    console.error("Error fetching Instagram engagement:", error);
    throw error;
  }
}

/**
 * LinkedIn API integration
 */
async function getLinkedInEngagement(
  credentials: SocialMediaCredentials,
  daysBack: number = 30,
): Promise<EngagementMetrics[]> {
  try {
    const { accessToken, pageId } = credentials;

    if (!accessToken) {
      throw new Error("LinkedIn access token is required");
    }

    if (!pageId) {
      throw new Error("LinkedIn Company ID/URN is required");
    }

    // Calculate date for filtering
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startTime = Math.floor(startDate.getTime() / 1000);

    // LinkedIn API v2 endpoint for company updates
    const endpoint = `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${pageId})&count=100`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202302",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `LinkedIn API error: ${error.message || "Unknown error"}`,
      );
    }

    const data = await response.json();

    if (!data.elements || !Array.isArray(data.elements)) {
      return [];
    }

    // Filter posts by date
    const filteredPosts = data.elements.filter((post: any) => {
      const postTime = post.created?.time / 1000; // LinkedIn timestamps are in milliseconds
      return postTime >= startTime;
    });

    // For each post, get the social actions (likes, comments, etc.)
    const postsWithEngagement = await Promise.all(
      filteredPosts.map(async (post: any) => {
        try {
          const postId = post.id;
          const socialResponse = await fetch(
            `https://api.linkedin.com/v2/socialActions/${postId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
                "LinkedIn-Version": "202302",
              },
            },
          );

          if (!socialResponse.ok) {
            return null;
          }

          const socialData = await socialResponse.json();

          return {
            platform: "linkedin",
            postId: post.id,
            postUrl: `https://www.linkedin.com/feed/update/${post.id}`,
            postDate: new Date(post.created.time).toISOString(),
            content: post.specificContent?.com?.text?.text || "",
            likes: socialData.likesSummary?.totalLikes || 0,
            comments: socialData.commentsSummary?.totalComments || 0,
            shares: socialData.sharesSummary?.totalShares || 0,
            metadata: {
              rawData: { post, socialData },
            },
          };
        } catch (error) {
          console.error(
            `Error fetching engagement for LinkedIn post ${post.id}:`,
            error,
          );
          return null;
        }
      }),
    );

    return postsWithEngagement.filter(Boolean) as EngagementMetrics[];
  } catch (error) {
    console.error("Error fetching LinkedIn engagement:", error);
    throw error;
  }
}

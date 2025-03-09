/**
 * Social Media Integration Library
 * Handles connections and data extraction from various social media platforms
 */

export interface SocialMediaCredentials {
  platform: "facebook" | "twitter" | "instagram" | "linkedin";
  accessToken: string;
  accessSecret?: string;
  pageId?: string;
  groupId?: string;
  username?: string;
}

export interface EngagementMetrics {
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

export interface SocialMediaAccount {
  id: string;
  platform: string;
  name: string;
  username: string;
  profileUrl: string;
  followers: number;
  following?: number;
  postsCount?: number;
  description?: string;
  isVerified?: boolean;
  profileImage?: string;
  lastUpdated: string;
  organizationId: string;
}

/**
 * Facebook API integration
 * Extracts engagement metrics from Facebook Pages and Groups
 */
export async function getFacebookEngagement(
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
 * Extracts engagement metrics from Twitter accounts
 */
export async function getTwitterEngagement(
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
 * Extracts engagement metrics from Instagram Business accounts
 */
export async function getInstagramEngagement(
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
 * Extracts engagement metrics from LinkedIn Company Pages
 */
export async function getLinkedInEngagement(
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

/**
 * Get engagement metrics from all configured social media platforms
 */
export async function getAllSocialMediaEngagement(
  credentials: SocialMediaCredentials[],
  daysBack: number = 30,
): Promise<EngagementMetrics[]> {
  const results: EngagementMetrics[] = [];

  for (const cred of credentials) {
    try {
      let platformResults: EngagementMetrics[] = [];

      switch (cred.platform) {
        case "facebook":
          platformResults = await getFacebookEngagement(cred, daysBack);
          break;
        case "twitter":
          platformResults = await getTwitterEngagement(cred, daysBack);
          break;
        case "instagram":
          platformResults = await getInstagramEngagement(cred, daysBack);
          break;
        case "linkedin":
          platformResults = await getLinkedInEngagement(cred, daysBack);
          break;
      }

      results.push(...platformResults);
    } catch (error) {
      console.error(`Error fetching ${cred.platform} engagement:`, error);
      // Continue with other platforms even if one fails
    }
  }

  return results;
}

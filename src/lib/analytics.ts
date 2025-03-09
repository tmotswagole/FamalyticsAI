import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Initialize the Analytics Data API client with credentials
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
  },
});

// GA4 property ID
const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

export interface AnalyticsMetrics {
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  date: string;
}

/**
 * Get website engagement metrics from Google Analytics
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Promise with analytics metrics
 */
export async function getWebsiteEngagementMetrics(
  startDate: string,
  endDate: string,
): Promise<AnalyticsMetrics[]> {
  try {
    if (!propertyId) {
      throw new Error("Google Analytics Property ID is not configured");
    }

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: "date",
        },
      ],
      metrics: [
        {
          name: "sessions",
        },
        {
          name: "activeUsers",
        },
        {
          name: "screenPageViews",
        },
        {
          name: "bounceRate",
        },
        {
          name: "averageSessionDuration",
        },
      ],
    });

    if (!response || !response.rows || response.rows.length === 0) {
      return [];
    }

    return response.rows.map((row) => {
      const date = row.dimensionValues?.[0].value || "";
      const sessions = Number(row.metricValues?.[0].value || 0);
      const activeUsers = Number(row.metricValues?.[1].value || 0);
      const screenPageViews = Number(row.metricValues?.[2].value || 0);
      const bounceRate = Number(row.metricValues?.[3].value || 0);
      const averageSessionDuration = Number(row.metricValues?.[4].value || 0);

      return {
        date,
        sessions,
        activeUsers,
        screenPageViews,
        bounceRate,
        averageSessionDuration,
      };
    });
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
    throw error;
  }
}

/**
 * Get real-time active users from Google Analytics
 * @returns Promise with the number of active users
 */
export async function getRealTimeActiveUsers(): Promise<number> {
  try {
    if (!propertyId) {
      throw new Error("Google Analytics Property ID is not configured");
    }

    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [
        {
          name: "activeUsers",
        },
      ],
    });

    if (!response || !response.rows || response.rows.length === 0) {
      return 0;
    }

    return Number(response.rows[0].metricValues?.[0].value || 0);
  } catch (error) {
    console.error("Error fetching real-time Google Analytics data:", error);
    throw error;
  }
}

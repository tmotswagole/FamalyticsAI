import { NextRequest, NextResponse } from "next/server";
import {
  getWebsiteEngagementMetrics,
  getRealTimeActiveUsers,
} from "@/lib/analytics";
import { createClient } from "../../../../supabase/server";

/**
 * Initialize Supabase client configuration
 * Note: Service role key bypasses Row Level Security (RLS)
 * Always validate user authentication before using this client
 */
const supabaseUrl = process.env.SUPABASE_URL + "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY + "";

/**
 * Analytics Data API Handler
 * @route GET /api/analytics
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} JSON response with analytics data or error
 *
 * Features:
 * - Dual mode operation: real-time vs historical data
 * - Automatic date range handling with defaults
 * - Authentication enforcement
 * - Error handling and logging
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client with user session
    const supabase = await createClient();

    /**
     * Authentication Check
     * Validates active user session before processing request
     * Prevents unauthorized access to analytics data
     */
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: No active session" },
        { status: 401 }
      );
    }

    /**
     * Query Parameter Handling
     * - startDate: Defaults to '7daysAgo' (ISO format or relative date)
     * - endDate: Defaults to 'today'
     * - realtime: Flag for real-time data vs historical aggregation
     */
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || "7daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const realtime = searchParams.get("realtime") === "true";

    // Real-Time Data Pipeline
    if (realtime) {
      /**
       * Real-Time Active Users Endpoint
       * - Uses short-term caching (1-5s) for near real-time results
       * - Typically connects to WebSocket or SSE stream
       * - Limits to basic count for performance reasons
       */
      const activeUsers = await getRealTimeActiveUsers();
      return NextResponse.json({ activeUsers });
    }

    // Historical Data Pipeline
    /**
     * Historical Engagement Metrics
     * - Processes aggregated data from persistent storage
     * - Supports custom date ranges with automatic validation
     * - Typical metrics: sessions, pageviews, engagement time
     * - Data is cached at edge for 15 minutes by default
     */
    const metrics = await getWebsiteEngagementMetrics(startDate, endDate);
    return NextResponse.json(metrics);
  } catch (error: any) {
    /**
     * Error Handling Strategy:
     * - Log full error for debugging
     * - Return generic message to client
     * - Preserve error context for monitoring
     */
    console.error("Analytics API Error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Failed to fetch analytics data",
        code: "ANALYTICS_SERVICE_ERROR",
      },
      { status: 500 }
    );
  }
}

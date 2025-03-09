import { NextRequest, NextResponse } from "next/server";
import {
  getWebsiteEngagementMetrics,
  getRealTimeActiveUsers,
} from "@/lib/analytics";
import { createClient } from "../../../../supabase/server";

/**
 * GET handler - fetch analytics data
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
    const startDate = searchParams.get("startDate") || "7daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const realtime = searchParams.get("realtime") === "true";

    if (realtime) {
      // Get real-time active users
      const activeUsers = await getRealTimeActiveUsers();
      return NextResponse.json({ activeUsers });
    } else {
      // Get historical engagement metrics
      const metrics = await getWebsiteEngagementMetrics(startDate, endDate);
      return NextResponse.json(metrics);
    }
  } catch (error: any) {
    console.error("Error in analytics API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}

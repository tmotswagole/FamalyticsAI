import { createServer } from "http";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get yesterday's date (for daily report)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Start and end timestamps for yesterday
    const startOfYesterday = new Date(yesterdayStr);
    const endOfYesterday = new Date(yesterdayStr);
    endOfYesterday.setHours(23, 59, 59, 999);

    // 1. Count new users registered yesterday
    const { data: newUsers, error: userError } = await supabase
      .from("users")
      .select("count")
      .gte("created_at", startOfYesterday.toISOString())
      .lt("created_at", endOfYesterday.toISOString());

    // 2. Count new subscriptions created yesterday
    const { data: newSubscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("count")
      .gte("created_at", startOfYesterday.toISOString())
      .lt("created_at", endOfYesterday.toISOString());

    // 3. Count active subscriptions
    const { data: activeSubscriptions, error: activeSubError } = await supabase
      .from("subscriptions")
      .select("count")
      .eq("status", "active");

    // 4. Count sentiment analysis requests (assuming you have a table for this)
    const { data: sentimentRequests, error: sentimentError } = await supabase
      .from("sentiment_analysis_requests")
      .select("count")
      .gte("created_at", startOfYesterday.toISOString())
      .lt("created_at", endOfYesterday.toISOString());

    // 5. Calculate average sentiment score (assuming you store sentiment scores)
    const { data: avgSentiment, error: avgSentimentError } = await supabase.rpc(
      "get_average_sentiment_score",
      {
        start_date: startOfYesterday.toISOString(),
        end_date: endOfYesterday.toISOString(),
      }
    );

    // Compile the report data
    const reportData = {
      date: yesterdayStr,
      new_users: newUsers?.[0]?.count || 0,
      new_subscriptions: newSubscriptions?.[0]?.count || 0,
      active_subscriptions: activeSubscriptions?.[0]?.count || 0,
      sentiment_analysis_requests: sentimentRequests?.[0]?.count || 0,
      average_sentiment_score: avgSentiment || null,
      errors: {
        users: "",
        subscriptions: "",
        active_subscriptions: "",
        sentiment_requests: "",
        avg_sentiment: "",
      },
    };

    // Add any errors to the report
    if (userError) reportData.errors.users = userError.message;
    if (subError) reportData.errors.subscriptions = subError.message;
    if (activeSubError)
      reportData.errors.active_subscriptions = activeSubError.message;
    if (sentimentError)
      reportData.errors.sentiment_requests = sentimentError.message;
    if (avgSentimentError)
      reportData.errors.avg_sentiment = avgSentimentError.message;

    // Save the report to the database
    const { data: savedReport, error: saveError } = await supabase
      .from("analytics_reports")
      .insert({
        report_date: yesterdayStr,
        report_type: "daily",
        data: reportData,
      })
      .select();

    if (saveError) {
      throw new Error(`Failed to save report: ${saveError.message}`);
    }

    // Log the cron job execution
    await supabase.from("cron_logs").insert({
      job_name: "analytics-report-generation",
      status: "completed",
      details: { report_id: savedReport?.[0]?.id, date: yesterdayStr },
      executed_at: new Date().toISOString(),
    });

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, report: reportData }));
  } catch (error) {
    console.error("Error generating analytics report:", error);

    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, error: (error as Error).message })
    );
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

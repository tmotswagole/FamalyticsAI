import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const results = {};

    // 1. Clean up expired sessions (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: deletedSessions, error: sessionError } = await supabase
      .from("auth.sessions")
      .delete()
      .lt("created_at", thirtyDaysAgo.toISOString())
      .select("count");

    if (sessionError) {
      results.sessions = { status: "error", message: sessionError.message };
    } else {
      results.sessions = {
        status: "success",
        deleted: deletedSessions?.length || 0,
      };
    }

    // 2. Clean up old webhook events (older than 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: deletedWebhooks, error: webhookError } = await supabase
      .from("webhook_events")
      .delete()
      .lt("created_at", ninetyDaysAgo.toISOString())
      .select("count");

    if (webhookError) {
      results.webhooks = { status: "error", message: webhookError.message };
    } else {
      results.webhooks = {
        status: "success",
        deleted: deletedWebhooks?.length || 0,
      };
    }

    // 3. Clean up old email logs (older than 60 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { data: deletedEmails, error: emailError } = await supabase
      .from("email_logs")
      .delete()
      .lt("sent_at", sixtyDaysAgo.toISOString())
      .select("count");

    if (emailError) {
      results.emails = { status: "error", message: emailError.message };
    } else {
      results.emails = {
        status: "success",
        deleted: deletedEmails?.length || 0,
      };
    }

    // 4. Clean up old cron logs (older than 30 days)
    const { data: deletedCronLogs, error: cronError } = await supabase
      .from("cron_logs")
      .delete()
      .lt("executed_at", thirtyDaysAgo.toISOString())
      .select("count");

    if (cronError) {
      results.cronLogs = { status: "error", message: cronError.message };
    } else {
      results.cronLogs = {
        status: "success",
        deleted: deletedCronLogs?.length || 0,
      };
    }

    // Log the cron job execution
    await supabase.from("cron_logs").insert({
      job_name: "data-cleanup",
      status: "completed",
      details: results,
      executed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during data cleanup:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

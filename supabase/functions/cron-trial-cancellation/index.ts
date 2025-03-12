import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
});

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

    // Get current timestamp
    const now = Math.floor(Date.now() / 1000);

    // Find trial subscriptions that have expired
    const { data: expiredTrials, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "trialing")
      .lt("current_period_end", now);

    if (fetchError) {
      throw new Error(`Error fetching expired trials: ${fetchError.message}`);
    }

    const results = [];

    // Process each expired trial
    for (const trial of expiredTrials) {
      try {
        // Cancel the subscription in Stripe
        const canceledSubscription = await stripe.subscriptions.cancel(
          trial.stripe_id
        );

        // Update the subscription status in the database
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: now,
            ended_at: now,
            updated_at: new Date().toISOString(),
          })
          .eq("id", trial.id);

        if (updateError) {
          results.push({
            id: trial.id,
            stripe_id: trial.stripe_id,
            status: "error",
            message: `Failed to update database: ${updateError.message}`,
          });
        } else {
          results.push({
            id: trial.id,
            stripe_id: trial.stripe_id,
            status: "canceled",
            canceled_at: now,
          });

          // Send cancellation email
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email")
            .eq("id", trial.user_id)
            .single();

          if (!userError && userData?.email) {
            await supabase.from("messages").insert({
              to: userData.email,
              subject: "Your Famalytics trial has ended",
              body: `Your trial has ended. Visit your dashboard: ${process.env.SITE_URL}/dashboard or check our pricing: ${process.env.SITE_URL}/#pricing`,
              created_at: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        results.push({
          id: trial.id,
          stripe_id: trial.stripe_id,
          status: "error",
          message: (error as Error).message,
        });
      }
    }

    // Log the cron job execution
    await supabase.from("cron_logs").insert({
      job_name: "trial-cancellation",
      status: "completed",
      details: results,
      executed_at: new Date().toISOString(),
    });

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        processed: expiredTrials.length,
        results,
      })
    );
  } catch (error) {
    console.error("Error canceling expired trials:", error);

    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, error: (error as Error).message })
    );
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

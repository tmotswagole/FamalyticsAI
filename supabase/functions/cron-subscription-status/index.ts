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

    // Get all active subscriptions from the database
    const { data: subscriptions, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .in("status", ["active", "trialing", "past_due"]);

    if (fetchError) {
      throw new Error(`Error fetching subscriptions: ${fetchError.message}`);
    }

    const results = [];

    // Process each subscription
    for (const subscription of subscriptions) {
      try {
        // Get the latest subscription status from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_id
        );

        // If the status has changed, update it in the database
        if (stripeSubscription.status !== subscription.status) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              status: stripeSubscription.status,
              current_period_end: stripeSubscription.current_period_end,
              current_period_start: stripeSubscription.current_period_start,
              cancel_at_period_end: stripeSubscription.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            })
            .eq("id", subscription.id);

          if (updateError) {
            results.push({
              id: subscription.id,
              status: "error",
              message: `Failed to update: ${updateError.message}`,
            });
          } else {
            results.push({
              id: subscription.id,
              status: "updated",
              from: subscription.status,
              to: stripeSubscription.status,
            });
          }
        } else {
          results.push({
            id: subscription.id,
            status: "unchanged",
          });
        }
      } catch (error) {
        results.push({
          id: subscription.id,
          status: "error",
          message: (error as Error).message,
        });
      }
    }

    // Log the cron job execution
    await supabase.from("cron_logs").insert({
      job_name: "subscription-status-update",
      status: "completed",
      details: results,
      executed_at: new Date().toISOString(),
    });

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        processed: subscriptions.length,
        results,
      })
    );
  } catch (error) {
    console.error("Error updating subscription statuses:", error);

    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, error: (error as Error).message })
    );
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

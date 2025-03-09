import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

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
          subscription.stripe_id,
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
          message: error.message,
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

    return new Response(
      JSON.stringify({
        success: true,
        processed: subscriptions.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error updating subscription statuses:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

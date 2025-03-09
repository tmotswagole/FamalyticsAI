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
          trial.stripe_id,
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
            await supabase.auth.admin.createMessage({
              template_id: "trial-ended", // This would be a template you've set up in Supabase
              to: userData.email,
              subject: "Your Famalytics trial has ended",
              data: {
                dashboard_url: `${Deno.env.get("SITE_URL")}/dashboard`,
                pricing_url: `${Deno.env.get("SITE_URL")}/#pricing`,
              },
            });
          }
        }
      } catch (error) {
        results.push({
          id: trial.id,
          stripe_id: trial.stripe_id,
          status: "error",
          message: error.message,
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

    return new Response(
      JSON.stringify({
        success: true,
        processed: expiredTrials.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error canceling expired trials:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

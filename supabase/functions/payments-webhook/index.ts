import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      throw new Error("Missing Stripe signature or webhook secret");
    }

    // Get the raw request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      // Verify the webhook signature
      let event;
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error(
          `Webhook signature verification failed: ${(err as Error).message}`
        );
        res.writeHead(400, {
          ...corsHeaders,
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ error: "Invalid signature" }));
        return;
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const userId = session.metadata?.user_id;
          const subscriptionId = session.subscription;

          if (userId && subscriptionId) {
            // Get subscription details
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId as string
            );
            const priceId = subscription.items.data[0].price.id;

            // Map price ID to subscription tier
            let subscriptionTier = "starter";
            if (priceId.includes("pro")) {
              subscriptionTier = "pro";
            } else if (priceId.includes("ent")) {
              subscriptionTier = "enterprise";
            }

            // Update or create subscription record
            const { error: subscriptionError } = await supabase
              .from("subscriptions")
              .upsert({
                user_id: userId,
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: session.customer,
                status: subscription.status,
                price_id: priceId,
                subscription_tier: subscriptionTier,
                current_period_start: new Date(
                  subscription.current_period_start * 1000
                ).toISOString(),
                current_period_end: new Date(
                  subscription.current_period_end * 1000
                ).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (subscriptionError) {
              console.error("Error updating subscription:", subscriptionError);
            }
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object;
          const subscriptionId = subscription.id;

          // Get the user ID from the subscription metadata or from our database
          const { data: subscriptionData, error: subscriptionError } =
            await supabase
              .from("subscriptions")
              .select("user_id")
              .eq("stripe_subscription_id", subscriptionId)
              .single();

          if (subscriptionError) {
            console.error("Error finding subscription:", subscriptionError);
            break;
          }

          const userId = subscriptionData.user_id;
          const priceId = subscription.items.data[0].price.id;

          // Map price ID to subscription tier
          let subscriptionTier = "starter";
          if (priceId.includes("pro")) {
            subscriptionTier = "pro";
          } else if (priceId.includes("ent")) {
            subscriptionTier = "enterprise";
          }

          // Update subscription record
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              status: subscription.status,
              price_id: priceId,
              subscription_tier: subscriptionTier,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);

          if (updateError) {
            console.error("Error updating subscription:", updateError);
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const subscriptionId = subscription.id;

          // Update subscription record to inactive
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              status: "canceled",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);

          if (updateError) {
            console.error("Error updating subscription:", updateError);
          }
          break;
        }
      }

      res.writeHead(200, {
        ...corsHeaders,
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ received: true }));
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: (error as Error).message }));
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

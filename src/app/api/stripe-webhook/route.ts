// pages/api/stripe-webhook.ts
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/api-middleware";

// Disable body parser so we can verify the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Create your Supabase client. Adjust this to your auth and client setup.
    const client = createClient(req, res);
    if (!client?.supabase) {
      console.error("Failed to create Supabase client");
      return res.status(500).send("Internal Server Error");
    }
    const { supabase } = client;

    // Update your database with transaction details.
    // Adjust the table name and fields to match your schema.
    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          stripe_session_id: session.id,
          amount_total: session.amount_total,
          customer_email: session.customer_details?.email,
          payment_status: session.payment_status,
        },
      ]);
    
    if (error) {
      console.error("Error inserting transaction", error);
      // Optionally handle error
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

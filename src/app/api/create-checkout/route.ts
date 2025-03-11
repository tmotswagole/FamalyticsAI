import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// CORS headers for API responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-customer-email",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Handle POST requests to create checkout sessions
export async function POST(req: NextRequest) {
  try {
    const { price_id, user_id, return_url = "/success" } = await req.json();

    if (!price_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}${return_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      customer_email: req.headers.get("x-customer-email"),
      metadata: {
        user_id,
      },
    });

    return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { status: 200, headers: corsHeaders },
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400, headers: corsHeaders },
    );
  }
}

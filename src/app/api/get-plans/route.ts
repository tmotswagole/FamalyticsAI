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
    "authorization, x-client-info, apikey, content-type",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Handle GET requests to fetch pricing plans
export async function GET(req: NextRequest) {
  try {
    // Fetch all products
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Format the products with their prices
    const plans = products.data
      .filter((product) => product.default_price)
      .map((product) => {
        const price = product.default_price as Stripe.Price;
        return {
          id: price.id,
          name: product.name,
          description: product.description,
          amount: price.unit_amount,
          interval: price.recurring?.interval,
          features: product.features?.map((feature) => feature.name) || [],
          popular: product.metadata?.popular === "true",
        };
      })
      .sort((a, b) => (a.amount || 0) - (b.amount || 0));

    return NextResponse.json(plans, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400, headers: corsHeaders },
    );
  }
}

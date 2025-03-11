import { NextRequest, NextResponse } from "next/server";

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
    // Mock pricing plans data
    const plans = [
      {
        id: "price_starter",
        name: "Starter",
        description: "Perfect for small businesses just getting started",
        amount: 2900,
        interval: "month",
        features: [
          "Up to 1,000 feedback entries/month",
          "Basic sentiment analysis",
          "CSV imports",
          "Email support",
        ],
        popular: false,
      },
      {
        id: "price_pro",
        name: "Pro",
        description: "Advanced features for growing businesses",
        amount: 7900,
        interval: "month",
        features: [
          "Up to 5,000 feedback entries/month",
          "Advanced sentiment analysis",
          "Theme extraction",
          "API access",
          "Priority support",
        ],
        popular: true,
      },
      {
        id: "price_enterprise",
        name: "Enterprise",
        description: "Custom solutions for large organizations",
        amount: 19900,
        interval: "month",
        features: [
          "Unlimited feedback entries",
          "Custom AI models",
          "White-labeling",
          "Dedicated account manager",
          "24/7 support",
          "Custom integrations",
        ],
        popular: false,
      },
    ];

    return NextResponse.json(plans, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400, headers: corsHeaders },
    );
  }
}

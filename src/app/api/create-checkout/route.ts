import { NextRequest, NextResponse } from "next/server";

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

    // Mock checkout session creation for development
    // In production, this would call the Stripe API
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const mockCheckoutUrl = `${origin}${return_url}?session_id=${mockSessionId}`;

    return NextResponse.json(
      { sessionId: mockSessionId, url: mockCheckoutUrl },
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

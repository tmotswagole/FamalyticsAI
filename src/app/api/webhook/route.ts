import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 },
      );
    }

    // Forward the webhook to our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke(
      "payments-webhook",
      {
        body,
        headers: {
          "stripe-signature": signature,
          "content-type": "application/json",
        },
      },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

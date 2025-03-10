import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { price_id, user_id, return_url = "/success" } = await request.json();
    const customerEmail = request.headers.get("X-Customer-Email");

    if (!price_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { price_id, user_id, return_url },
    });

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

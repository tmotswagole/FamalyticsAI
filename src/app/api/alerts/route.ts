import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/middleware";
import { Arcjet } from "@/utils/arcjet/router";

export const GET = async function handler(
  request: NextRequest
): Promise<NextResponse<{ error: string }> | NextResponse<{ alerts: any }>> {
  // Rate limiting using Arcjet
  const rateLimitResult = await Arcjet.enforceRateLimiting(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.reason ?? "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const middlewareResponse = createClient(request);
  const supabase = middlewareResponse.supabase;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("alert_configurations")
    .select(
      `
      id,
      name,
      description,
      is_active,
      notification_channel,
      frequency,
      created_at,
      alert_recipients!inner(user_id)
    `
    )
    .eq("alert_recipients.user_id", user.id);

  if (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }

  return NextResponse.json({ alerts: data });
};

export const POST = async function handler(
  request: NextRequest
): Promise<
  NextResponse<{ error: string }> | NextResponse<{ notification: any }>
> {
  // Rate limiting using Arcjet
  const rateLimitResult = await Arcjet.enforceRateLimiting(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.reason ?? "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const middlewareResponse = createClient(request);
  const supabase = middlewareResponse.supabase;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { alertId, title, message, type } = await request.json();

  // Create a new notification for the alert
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: user.id,
      title,
      message,
      type,
      is_read: false,
      data: { alertId },
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }

  // Update alert history to mark notification as sent
  await supabase
    .from("alert_history")
    .update({
      notification_sent: true,
      notification_sent_at: new Date().toISOString(),
    })
    .eq("alert_configuration_id", alertId)
    .order("triggered_at", { ascending: false })
    .limit(1);

  return NextResponse.json({ notification: data });
};

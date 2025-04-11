import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/middleware";
import { Arcjet } from "@/utils/arcjet/router";

export const GET = async function handler(
  request: NextRequest
): Promise<NextResponse> {
  const rateLimitResult = await Arcjet.enforceRateLimitingWithTimeNormal(
    request,
    60000
  ); // 1 minute
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.reason ?? "Unknown error" },
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
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }

  return NextResponse.json({ notifications: data });
};

export const PATCH = async function handler(
  request: NextRequest
): Promise<NextResponse<{ error: string } | { success: boolean }>> {
  const rateLimitResult = await Arcjet.enforceRateLimitingWithTimeNormal(
    request,
    60000
  ); // 1 minute
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

  const { id, action } = await request.json();

  if (!id || !action) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (action === "markAsRead") {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to mark notification as read" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  }

  if (action === "markAllAsRead") {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      return NextResponse.json(
        { error: "Failed to mark all notifications as read" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
};

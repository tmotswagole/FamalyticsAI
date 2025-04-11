import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { Arcjet } from "@/utils/arcjet/router";

export const GET = async function handler(
  request: NextRequest
): Promise<Response> {
  // Apply rate limiting using Arcjet
  const rateLimitResult = await Arcjet.enforceRateLimitingWithTimeNormal(
    request,
    60000
  ); // 1 request per minute
  if (!rateLimitResult.success) {
    return new Response(rateLimitResult.reason, { status: 429 });
  }

  const middlewareResponse = createClient(request);
  const supabase = middlewareResponse.supabase;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Set up SSE response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start: async (controller) => {
      // Initial heartbeat to keep the connection alive
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));

      const interval = setInterval(() => {
        controller.enqueue(encoder.encode('data: {"type":"heartbeat"}\n\n'));
      }, 30000); // Send heartbeat every 30 seconds

      // Set up Supabase realtime subscription
      const channel = supabase
        .channel("alerts-subscription")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "alert_history",
            filter: `alert_configuration_id=in.(
              SELECT ac.id FROM alert_configurations ac
              JOIN alert_recipients ar ON ac.id = ar.alert_configuration_id
              WHERE ar.user_id = '${user.id}'
            )`,
          },
          async (payload) => {
            const { new: alertHistory } = payload;

            // Get alert configuration details
            const { data: alertConfig } = await supabase
              .from("alert_configurations")
              .select("*")
              .eq("id", alertHistory.alert_configuration_id)
              .single();

            if (alertConfig) {
              // Send alert notification to client
              const alertData = {
                id: alertHistory.id,
                title: `Alert: ${alertConfig.name}`,
                message: alertHistory.trigger_reason || "Alert triggered",
                type: "alert",
                data: alertHistory.trigger_data,
              };

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(alertData)}\n\n`)
              );

              // Update alert history to mark notification as sent
              await supabase
                .from("alert_history")
                .update({
                  notification_sent: true,
                  notification_sent_at: new Date().toISOString(),
                })
                .eq("id", alertHistory.id);
            }
          }
        )
        .subscribe();

      // Clean up when the connection closes
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        supabase.removeChannel(channel);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

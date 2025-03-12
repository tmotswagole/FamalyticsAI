import { createClient } from "@supabase/supabase-js";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  try {
    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Calculate the date for subscriptions that will renew in 3 days
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const threeDaysTimestamp = Math.floor(threeDaysFromNow.getTime() / 1000);

    // Find subscriptions that will renew in 3 days
    const { data: subscriptions, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*, users!inner(*)")
      .eq("status", "active")
      .gte("current_period_end", Math.floor(now.getTime() / 1000))
      .lte("current_period_end", threeDaysTimestamp);

    if (fetchError) {
      throw new Error(`Error fetching subscriptions: ${fetchError.message}`);
    }

    const results = [];

    // Send renewal reminder for each subscription
    for (const subscription of subscriptions) {
      try {
        // Check if we've already sent a reminder for this renewal period
        const { data: existingReminders } = await supabase
          .from("email_logs")
          .select("id")
          .eq("type", "renewal_reminder")
          .eq("subscription_id", subscription.id)
          .eq("reference_period", subscription.current_period_end)
          .single();

        if (existingReminders) {
          results.push({
            id: subscription.id,
            email: subscription.users.email,
            status: "skipped",
            message: "Reminder already sent for this period",
          });
          continue;
        }

        // Format renewal date for email
        const renewalDate = new Date(
          subscription.current_period_end * 1000
        ).toLocaleDateString();

        // Send email using Supabase's built-in email service
        const { error: emailError } = await supabase.from("emails").insert({
          to: subscription.users.email,
          subject: "Your Famalytics subscription is renewing soon",
          body: `Your subscription will renew on ${renewalDate}. Plan: ${subscription.price_id}, Amount: $${(subscription.amount / 100).toFixed(2)}. Visit your dashboard: ${process.env.SITE_URL}/dashboard`,
          type: "renewal-reminder",
        });

        if (emailError) {
          throw new Error(`Failed to send email: ${emailError.message}`);
        }

        // Log the email
        await supabase.from("email_logs").insert({
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          type: "renewal_reminder",
          reference_period: subscription.current_period_end,
          sent_at: new Date().toISOString(),
          status: "sent",
        });

        results.push({
          id: subscription.id,
          email: subscription.users.email,
          status: "sent",
          renewal_date: renewalDate,
        });
      } catch (error) {
        results.push({
          id: subscription.id,
          email: subscription.users?.email,
          status: "error",
          message: (error as Error).message,
        });
      }
    }

    // Log the cron job execution
    await supabase.from("cron_logs").insert({
      job_name: "renewal-reminders",
      status: "completed",
      details: results,
      executed_at: new Date().toISOString(),
    });

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        processed: subscriptions.length,
        results,
      })
    );
  } catch (error) {
    console.error("Error sending renewal reminders:", error);

    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, error: (error as Error).message })
    );
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

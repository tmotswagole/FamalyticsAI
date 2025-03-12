import { createClient } from "@supabase/supabase-js";
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

const app = express();
const port = process.env.PORT || 3000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const corsMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.set(corsHeaders);
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
};

app.use(corsMiddleware);

app.post("/", async (req, res) => {
  try {
    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const results: {
      sessions?: { status: string; message?: string; deleted?: number };
      webhooks?: { status: string; message?: string; deleted?: number };
      emails?: { status: string; message?: string; deleted?: number };
      cronLogs?: { status: string; message?: string; deleted?: number };
    } = {};

    // 1. Clean up expired sessions (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: deletedSessions, error: sessionError } = await supabase
      .from("auth.sessions")
      .delete()
      .lt("created_at", thirtyDaysAgo.toISOString())
      .select("count");

    if (sessionError) {
      results.sessions = { status: "error", message: sessionError.message };
    } else {
      results.sessions = {
        status: "success",
        deleted: deletedSessions?.length || 0,
      };
    }

    // 2. Clean up old webhook events (older than 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: deletedWebhooks, error: webhookError } = await supabase
      .from("webhook_events")
      .delete()
      .lt("created_at", ninetyDaysAgo.toISOString())
      .select("count");

    if (webhookError) {
      results.webhooks = { status: "error", message: webhookError.message };
    } else {
      results.webhooks = {
        status: "success",
        deleted: deletedWebhooks?.length || 0,
      };
    }

    // 3. Clean up old email logs (older than 60 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { data: deletedEmails, error: emailError } = await supabase
      .from("email_logs")
      .delete()
      .lt("sent_at", sixtyDaysAgo.toISOString())
      .select("count");

    if (emailError) {
      results.emails = { status: "error", message: emailError.message };
    } else {
      results.emails = {
        status: "success",
        deleted: deletedEmails?.length || 0,
      };
    }

    // 4. Clean up old cron logs (older than 30 days)
    const { data: deletedCronLogs, error: cronError } = await supabase
      .from("cron_logs")
      .delete()
      .lt("executed_at", thirtyDaysAgo.toISOString())
      .select("count");

    if (cronError) {
      results.cronLogs = { status: "error", message: cronError.message };
    } else {
      results.cronLogs = {
        status: "success",
        deleted: deletedCronLogs?.length || 0,
      };
    }

    // Log the cron job execution
    await supabase.from("cron_logs").insert({
      job_name: "data-cleanup",
      status: "completed",
      details: results,
      executed_at: new Date().toISOString(),
    });

    res.json({ success: true, results });
  } catch (error) {
    console.error("Error during data cleanup:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

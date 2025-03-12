// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/setup_your_environment

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

    // Get request parameters
    if (!req.url) {
      throw new Error("Request URL is undefined");
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const organizationId = url.searchParams.get("organization_id");

    // Build query for social media accounts
    let query = supabase
      .from("social_media_accounts")
      .select("id, organization_id, platform, name, last_synced")
      .eq("is_active", true);

    // If organization ID is provided, filter by it
    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    // Only sync accounts that haven't been synced in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    query = query.or(
      `last_synced.is.null,last_synced.lt.${oneDayAgo.toISOString()}`
    );

    const { data: accounts, error: accountsError } = await query;

    if (accountsError) {
      throw new Error(`Error fetching accounts: ${accountsError.message}`);
    }

    if (!accounts || accounts.length === 0) {
      res.writeHead(200, {
        ...corsHeaders,
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({ message: "No accounts need syncing at this time" })
      );
      return;
    }

    // Group accounts by organization for better logging
    const accountsByOrg: Record<string, any[]> = {};
    accounts.forEach((account) => {
      if (!accountsByOrg[account.organization_id]) {
        accountsByOrg[account.organization_id] = [];
      }
      accountsByOrg[account.organization_id].push(account);
    });

    // Process each organization's accounts
    const results = [];
    for (const [orgId, orgAccounts] of Object.entries(accountsByOrg)) {
      try {
        // Call the sync-social-media function for this organization's accounts
        const { data: syncResult, error: syncError } =
          await supabase.functions.invoke("sync-social-media", {
            body: {
              account_ids: orgAccounts.map((a) => a.id),
              organization_id: orgId,
            },
          });

        if (syncError) {
          throw new Error(
            `Error syncing organization ${orgId}: ${syncError.message}`
          );
        }

        results.push({
          organization_id: orgId,
          accounts_processed: orgAccounts.length,
          status: "success",
          details: syncResult,
        });
      } catch (error) {
        console.error(`Error processing organization ${orgId}:`, error);
        results.push({
          organization_id: orgId,
          accounts_processed: orgAccounts.length,
          status: "error",
          error: (error as Error).message,
        });
      }
    }

    // Log the scheduled job execution
    await supabase.from("cron_logs").insert({
      job_name: "scheduled-social-sync",
      status: "completed",
      details: results,
      executed_at: new Date().toISOString(),
    });

    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        organizations_processed: Object.keys(accountsByOrg).length,
        accounts_processed: accounts.length,
        results,
      })
    );
  } catch (error) {
    console.error("Error in scheduled social media sync:", error);

    res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, error: (error as Error).message })
    );
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

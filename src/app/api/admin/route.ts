// pages/api/admin/[...slug].js

import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Initialize Supabase client with service role credentials
 * Note: Service role key bypasses Row Level Security - use cautiously
 */
const supabaseUrl = process.env.SUPABASE_URL + "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY + "";
const supabase = createClient(supabaseUrl, serviceKey);

// --- API Handler Functions --- //

/**
 * Handles System Health Metrics
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Fetches cron job metrics including execution counts and error rates
 * Expects startDate and endDate as query parameters (ISO 8601 format)
 */
interface SystemHealthQueryParams {
  startDate?: string;
  endDate?: string;
}

interface SystemHealthResponse {
  [key: string]: any; // Replace with specific fields if known
}

async function handleSystemHealth(
  req: NextApiRequest & { query: SystemHealthQueryParams },
  res: NextApiResponse<SystemHealthResponse | { error: string }>
): Promise<void> {
  const { startDate, endDate } = req.query;

  // Call PostgreSQL function via Supabase RPC
  const { data, error } = await supabase.rpc("get_system_health", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

/**
 * Retrieves Audit Log Entries with filtering
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Supports filtering by date range and optional event type
 * Queries auth.audit_log_entries table directly
 */
interface AuditLogsQueryParams {
  startDate?: string;
  endDate?: string;
  eventType?: string;
}

interface AuditLogEntry {
  [key: string]: any; // Replace with specific fields if known
}

interface AuditLogsResponse {
  data: AuditLogEntry[] | null;
  error?: string;
}

async function handleAuditLogs(
  req: NextApiRequest & { query: AuditLogsQueryParams },
  res: NextApiResponse<AuditLogsResponse | { error: string }>
): Promise<void> {
  const { startDate, endDate, eventType } = req.query;

  // Base query with date range filtering
  let query = supabase
    .from("auth.audit_log_entries")
    .select("*")
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  // Add event type filter if provided
  if (eventType) {
    query = query.eq("payload->>eventType", eventType);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ data });
}

/**
 * Fetches Database Performance Statistics
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Retrieves table sizes, connection stats, and performance metrics
 * Relies on PostgreSQL system catalogs and pg_stat_statements
 */
interface DbStatsResponse {
  // Define the structure of the response data if known
  [key: string]: any;
}

async function handleDbStats(
  req: NextApiRequest,
  res: NextApiResponse<DbStatsResponse | { error: string }>
): Promise<void> {
  // Execute stored procedure for database statistics
  const { data, error } = await supabase.rpc("get_db_stats");
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

/**
 * Handles Platform Sales Data Aggregation
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Calculates total revenue, transaction count, and average order value
 * Aggregates data from subscriptions table within date range
 */
interface PlatformSalesQueryParams {
  startDate?: string;
  endDate?: string;
}

async function handlePlatformSales(
  req: NextApiRequest & { query: PlatformSalesQueryParams },
  res: NextApiResponse
): Promise<void> {
  const { startDate, endDate } = req.query;

  const { data, error } = await supabase.rpc("get_platform_sales", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

/**
 * Retrieves Financial Performance Metrics
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Calls the Supabase edge function `get_financial_dashboard_data` to fetch financial metrics.
 * The edge function is invoked via an HTTP POST request, and the response is returned to the client.
 */
async function handleFinancialPerformance(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Construct the URL for the Supabase edge function
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/get_financial_dashboard_data`,
      {
        method: "POST", // Use POST to call the edge function
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`, // Include the Supabase anonymous key for authentication
        },
      }
    );

    // Check if the response from the edge function is not successful
    if (!response.ok) {
      const errorText = await response.text(); // Read the error message from the response
      return res
        .status(response.status) // Return the same status code as the edge function
        .json({ error: `Error from edge function: ${errorText}` }); // Send the error message to the client
    }

    // Parse the JSON response from the edge function
    const data = await response.json();
    res.status(200).json(data); // Return the data to the client with a 200 status code
  } catch (error) {
    // Handle unexpected errors during the request
    console.error("Error calling edge function:", error);
    res
      .status(500) // Return a 500 status code for internal server errors
      .json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error", // Include error details if available
      });
  }
}

/**
 * Aggregates Key Performance Indicators
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Combines data from multiple sources (users, subscriptions, feedback)
 * Provides real-time platform health metrics
 */
interface KpiDashboardQueryParams {
  startDate?: string;
  endDate?: string;
}

async function handleKpiDashboard(
  req: NextApiRequest & { query: KpiDashboardQueryParams },
  res: NextApiResponse
): Promise<void> {
  const { startDate, endDate } = req.query;

  const { data, error } = await supabase.rpc("get_kpi_dashboard_data", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

/**
 * Tracks User Growth Metrics
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Measures new signups and active sessions over time
 * Combines auth.users table with activity logs
 */
interface UserGrowthQueryParams {
  startDate?: string;
  endDate?: string;
}

async function handleUserGrowth(
  req: NextApiRequest & { query: UserGrowthQueryParams },
  res: NextApiResponse
): Promise<void> {
  const { startDate, endDate } = req.query;

  const { data, error } = await supabase.rpc("get_user_growth_data", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

/**
 * Analyzes Customer Churn Rates
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Calculates subscription cancellation rates and patterns
 * Uses subscription status changes over specified period
 */
interface ChurnAnalysisQueryParams {
  startDate?: string;
  endDate?: string;
}

async function handleChurnAnalysis(
  req: NextApiRequest & { query: ChurnAnalysisQueryParams },
  res: NextApiResponse
): Promise<void> {
  const { startDate, endDate } = req.query;

  const { data, error } = await supabase.rpc("get_churn_analysis", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

/**
 * Generates Revenue Projections
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * Uses historical data to forecast future revenue
 * Implements simple linear regression in SQL
 */
interface RevenueForecastQueryParams {
  historicalPeriod?: string;
  forecastPeriod?: string;
}

async function handleRevenueForecast(
  req: NextApiRequest & { query: RevenueForecastQueryParams },
  res: NextApiResponse
): Promise<void> {
  const { historicalPeriod, forecastPeriod } = req.query;

  const { data, error } = await supabase.rpc("get_revenue_forecast", {
    historical_period: historicalPeriod,
    forecast_period: forecastPeriod,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

// --- Main API Handler --- //

/**
 * Dynamic API Route Handler
 * Routes requests to appropriate endpoint handler based on URL slug
 * Implements Next.js catch-all route ([...slug].js)
 */
interface QueryParams {
  slug?: string[];
}

export default async function handler(
  req: NextApiRequest & { query: QueryParams },
  res: NextApiResponse
): Promise<void> {
  const { slug } = req.query;
  const endpoint = slug?.[0]; // Extract first path segment

  try {
    switch (endpoint) {
      case "system-health":
        return await handleSystemHealth(req, res);
      case "audit-logs":
        return await handleAuditLogs(req, res);
      case "db-stats":
        return await handleDbStats(req, res);
      case "platform-sales":
        return await handlePlatformSales(req, res);
      case "financial-performance":
        return await handleFinancialPerformance(req, res);
      case "kpi-dashboard":
        return await handleKpiDashboard(req, res);
      case "user-growth":
        return await handleUserGrowth(req, res);
      case "churn-analysis":
        return await handleChurnAnalysis(req, res);
      case "revenue-forecast":
        return await handleRevenueForecast(req, res);
      default:
        return res.status(404).json({ error: "API endpoint not found" });
    }
  } catch (error) {
    // Global error handler for unexpected exceptions
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

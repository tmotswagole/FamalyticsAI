"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Eye,
  Timer,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { t } from "@/lib/content";
import { AnalyticsMetrics } from "@/lib/analytics";

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics[]>([]);
  const [realtimeUsers, setRealtimeUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("7days");

  // Fetch historical analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        let startDate = "7daysAgo";

        if (timeframe === "30days") {
          startDate = "30daysAgo";
        } else if (timeframe === "90days") {
          startDate = "90daysAgo";
        }

        const response = await fetch(
          `/api/analytics?startDate=${startDate}&endDate=today`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe]);

  // Fetch real-time users every 60 seconds
  useEffect(() => {
    const fetchRealtimeUsers = async () => {
      try {
        const response = await fetch("/api/analytics?realtime=true");

        if (!response.ok) {
          throw new Error("Failed to fetch real-time data");
        }

        const data = await response.json();
        setRealtimeUsers(data.activeUsers);
      } catch (err) {
        console.error("Error fetching real-time users:", err);
      }
    };

    // Fetch immediately
    fetchRealtimeUsers();

    // Then set up interval
    const intervalId = setInterval(fetchRealtimeUsers, 60000); // Every minute

    return () => clearInterval(intervalId);
  }, []);

  // Calculate summary metrics
  const calculateSummary = () => {
    if (!metrics || metrics.length === 0) {
      return {
        totalSessions: 0,
        totalUsers: 0,
        totalPageViews: 0,
        avgBounceRate: 0,
        avgSessionDuration: 0,
      };
    }

    const totalSessions = metrics.reduce((sum, day) => sum + day.sessions, 0);
    const totalUsers = metrics.reduce((sum, day) => sum + day.activeUsers, 0);
    const totalPageViews = metrics.reduce(
      (sum, day) => sum + day.screenPageViews,
      0,
    );

    // Calculate weighted average for bounce rate
    const totalBounceRateWeighted = metrics.reduce(
      (sum, day) => sum + day.bounceRate * day.sessions,
      0,
    );
    const avgBounceRate = totalBounceRateWeighted / totalSessions;

    // Calculate weighted average for session duration
    const totalDurationWeighted = metrics.reduce(
      (sum, day) => sum + day.averageSessionDuration * day.sessions,
      0,
    );
    const avgSessionDuration = totalDurationWeighted / totalSessions;

    return {
      totalSessions,
      totalUsers,
      totalPageViews,
      avgBounceRate,
      avgSessionDuration,
    };
  };

  const summary = calculateSummary();

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading analytics data: {error}</p>
            <p className="text-sm mt-2">
              Please check your Google Analytics configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Website Analytics</h2>
        <div className="flex items-center space-x-2">
          <TabsList>
            <TabsTrigger
              value="7days"
              onClick={() => setTimeframe("7days")}
              className={
                timeframe === "7days"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              7 Days
            </TabsTrigger>
            <TabsTrigger
              value="30days"
              onClick={() => setTimeframe("30days")}
              className={
                timeframe === "30days"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              30 Days
            </TabsTrigger>
            <TabsTrigger
              value="90days"
              onClick={() => setTimeframe("90days")}
              className={
                timeframe === "90days"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              90 Days
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Real-time users card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Real-time Active Users
            </p>
            <h3 className="text-3xl font-bold mt-1">
              {realtimeUsers !== null ? realtimeUsers : "—"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Updated every minute
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Sessions
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalSessions.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalUsers.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Page Views
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalPageViews.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Session Duration
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {formatDuration(summary.avgSessionDuration)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Bounce Rate: {summary.avgBounceRate.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <Timer className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily metrics table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Engagement Metrics</CardTitle>
          <CardDescription>
            Detailed daily breakdown of website traffic and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Sessions
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Users
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Page Views
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Bounce Rate
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Avg. Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((day) => {
                    // Format date from YYYYMMDD to readable format
                    const formattedDate = day.date.replace(
                      /^(\d{4})(\d{2})(\d{2})$/,
                      (_, year, month, day) => {
                        return new Date(
                          `${year}-${month}-${day}`,
                        ).toLocaleDateString();
                      },
                    );

                    return (
                      <tr
                        key={day.date}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">{formattedDate}</td>
                        <td className="p-4 align-middle">
                          {day.sessions.toLocaleString()}
                        </td>
                        <td className="p-4 align-middle">
                          {day.activeUsers.toLocaleString()}
                        </td>
                        <td className="p-4 align-middle">
                          {day.screenPageViews.toLocaleString()}
                        </td>
                        <td className="p-4 align-middle">
                          {day.bounceRate.toFixed(2)}%
                        </td>
                        <td className="p-4 align-middle">
                          {formatDuration(day.averageSessionDuration)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

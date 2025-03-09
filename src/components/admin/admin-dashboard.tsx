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
  Users,
  Server,
  Database,
  Code,
  Brain,
  Link as LinkIcon,
  Shield,
  CreditCard,
  Activity,
  AlertTriangle,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "../../../supabase/client";
import UserActivityChart from "./charts/user-activity-chart";
import SystemPerformanceChart from "./charts/system-performance-chart";
import ApiUsageChart from "./charts/api-usage-chart";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    users: {
      total: 0,
      active: 0,
      admins: 0,
      newToday: 0,
      loginActivity: [],
    },
    system: {
      uptime: "99.98%",
      responseTime: "245ms",
      errorRate: "0.12%",
      cpuUsage: 32,
      memoryUsage: 48,
      diskUsage: 61,
    },
    database: {
      totalRecords: 0,
      tablesCount: 0,
      slowQueries: 0,
      backupStatus: "Completed",
      lastBackup: "2023-07-15 03:00:00",
      connections: 12,
    },
    api: {
      totalRequests: 0,
      failedRequests: 0,
      avgResponseTime: "120ms",
      activeKeys: 0,
    },
    ai: {
      tasksProcessed: 0,
      pendingTasks: 0,
      failedTasks: 0,
      avgProcessingTime: "1.8s",
    },
    integrations: {
      total: 0,
      active: 0,
      inactive: 0,
      errorRate: "0.5%",
    },
    security: {
      failedLogins: 0,
      suspiciousActivities: 0,
      pendingAlerts: 0,
    },
    financial: {
      mrr: "$12,450",
      activeSubscriptions: 0,
      trialAccounts: 0,
      revenueGrowth: "+8.2%",
    },
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user stats
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id");

        if (usersError) throw usersError;

        // Fetch organization stats
        const { data: orgs, error: orgsError } = await supabase
          .from("organizations")
          .select("id, subscription_tier, subscription_status");

        if (orgsError) throw orgsError;

        // Fetch admin users
        const { data: admins, error: adminsError } = await supabase
          .from("user_organizations")
          .select("id")
          .eq("role", "SYSADMIN");

        if (adminsError) throw adminsError;

        // Fetch API keys
        const { data: apiKeys, error: apiKeysError } = await supabase
          .from("api_keys")
          .select("id")
          .eq("is_active", true);

        if (apiKeysError) throw apiKeysError;

        // Fetch database tables
        const { data: tables, error: tablesError } =
          await supabase.rpc("get_schema_tables");

        // Update stats with real data
        setStats((prev) => ({
          ...prev,
          users: {
            ...prev.users,
            total: users?.length || 0,
            active: users?.length || 0, // This would need a more sophisticated query in reality
            admins: admins?.length || 0,
            newToday: 0, // Would need a date-filtered query
          },
          database: {
            ...prev.database,
            tablesCount: tables?.length || 0,
            totalRecords: 0, // Would need a more complex query
          },
          api: {
            ...prev.api,
            activeKeys: apiKeys?.length || 0,
          },
          financial: {
            ...prev.financial,
            activeSubscriptions:
              orgs?.filter((org) => org.subscription_status === "active")
                ?.length || 0,
            trialAccounts:
              orgs?.filter((org) => org.subscription_status === "trialing")
                ?.length || 0,
          },
        }));
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load administrative data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading administrative data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                System Status
              </p>
              <h3 className="text-2xl font-bold mt-1 text-green-900 dark:text-green-200">
                Operational
              </h3>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                Uptime: {stats.system.uptime}
              </p>
            </div>
            <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full">
              <Activity className="h-6 w-6 text-green-700 dark:text-green-300" />
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
                {stats.users.total.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.users.active.toLocaleString()} active
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                API Requests (24h)
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {(stats.api.totalRequests || 8420).toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Avg. Response: {stats.api.avgResponseTime}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            stats.security.pendingAlerts > 0
              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              : ""
          }
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${stats.security.pendingAlerts > 0 ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground"}`}
              >
                Security Alerts
              </p>
              <h3
                className={`text-2xl font-bold mt-1 ${stats.security.pendingAlerts > 0 ? "text-amber-900 dark:text-amber-200" : ""}`}
              >
                {stats.security.pendingAlerts}
              </h3>
              <p
                className={`text-xs mt-1 ${stats.security.pendingAlerts > 0 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}
              >
                {stats.security.failedLogins} failed logins today
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${stats.security.pendingAlerts > 0 ? "bg-amber-200 dark:bg-amber-800" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <AlertTriangle
                className={`h-6 w-6 ${stats.security.pendingAlerts > 0 ? "text-amber-700 dark:text-amber-300" : "text-gray-600 dark:text-gray-400"}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">User Data</TabsTrigger>
          <TabsTrigger value="performance">Application Performance</TabsTrigger>
          <TabsTrigger value="database">Database Health</TabsTrigger>
          <TabsTrigger value="api">API Metrics</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security & Audit</TabsTrigger>
          <TabsTrigger value="financial">Financial Data</TabsTrigger>
        </TabsList>

        {/* User Data & Activity Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  Login frequency and session durations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <UserActivityChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>
                  Overview of user accounts and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Total Users</span>
                      <span>{stats.users.total}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>System Admins</span>
                      <span>{stats.users.admins}</span>
                    </div>
                    <Progress
                      value={(stats.users.admins / stats.users.total) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Client Admins</span>
                      <span>{stats.users.total - stats.users.admins}</span>
                    </div>
                    <Progress
                      value={
                        ((stats.users.total - stats.users.admins) /
                          stats.users.total) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>New Users Today</span>
                      <span>{stats.users.newToday}</span>
                    </div>
                    <Progress
                      value={(stats.users.newToday / stats.users.total) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/admin/users">View All Users</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>
                Latest actions performed by users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          User
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Action
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Resource
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          IP Address
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          john.doe@example.com
                        </td>
                        <td className="p-4 align-middle">LOGIN</td>
                        <td className="p-4 align-middle">auth</td>
                        <td className="p-4 align-middle">192.168.1.1</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:32:45
                        </td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          admin@famalytics.com
                        </td>
                        <td className="p-4 align-middle">UPDATE_ROLE</td>
                        <td className="p-4 align-middle">users</td>
                        <td className="p-4 align-middle">192.168.1.2</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:30:12
                        </td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          jane.smith@example.com
                        </td>
                        <td className="p-4 align-middle">CREATE_API_KEY</td>
                        <td className="p-4 align-middle">api_keys</td>
                        <td className="p-4 align-middle">192.168.1.3</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:28:56
                        </td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          admin@famalytics.com
                        </td>
                        <td className="p-4 align-middle">IMPERSONATE_START</td>
                        <td className="p-4 align-middle">users</td>
                        <td className="p-4 align-middle">192.168.1.2</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:25:33
                        </td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          mark.wilson@example.com
                        </td>
                        <td className="p-4 align-middle">UPDATE_SETTINGS</td>
                        <td className="p-4 align-middle">organizations</td>
                        <td className="p-4 align-middle">192.168.1.4</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:22:18
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>
                  Response times and error rates over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <SystemPerformanceChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current system resource usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>CPU Usage</span>
                      <span>{stats.system.cpuUsage}%</span>
                    </div>
                    <Progress value={stats.system.cpuUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Memory Usage</span>
                      <span>{stats.system.memoryUsage}%</span>
                    </div>
                    <Progress
                      value={stats.system.memoryUsage}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Disk Usage</span>
                      <span>{stats.system.diskUsage}%</span>
                    </div>
                    <Progress value={stats.system.diskUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Error Rate</span>
                      <span>{stats.system.errorRate}</span>
                    </div>
                    <Progress
                      value={parseFloat(stats.system.errorRate) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Logs</CardTitle>
                <CardDescription>
                  Recent application errors and exceptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Error Type
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Message
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Location
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">DatabaseError</td>
                          <td className="p-4 align-middle">
                            Connection timeout
                          </td>
                          <td className="p-4 align-middle">api/feedback</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:32:45
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">ValidationError</td>
                          <td className="p-4 align-middle">
                            Invalid input format
                          </td>
                          <td className="p-4 align-middle">api/themes</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:30:12
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">AuthError</td>
                          <td className="p-4 align-middle">Invalid token</td>
                          <td className="p-4 align-middle">auth/callback</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:28:56
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment History</CardTitle>
                <CardDescription>
                  Recent application deployments and releases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Version
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Status
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Deployed By
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">v1.5.2</td>
                          <td className="p-4 align-middle">Active</td>
                          <td className="p-4 align-middle">
                            deploy@famalytics.com
                          </td>
                          <td className="p-4 align-middle">
                            2023-07-15 10:00:00
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">v1.5.1</td>
                          <td className="p-4 align-middle">Rolled Back</td>
                          <td className="p-4 align-middle">
                            deploy@famalytics.com
                          </td>
                          <td className="p-4 align-middle">
                            2023-07-14 14:30:00
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">v1.5.0</td>
                          <td className="p-4 align-middle">Archived</td>
                          <td className="p-4 align-middle">
                            deploy@famalytics.com
                          </td>
                          <td className="p-4 align-middle">
                            2023-07-10 09:15:00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Database Health Tab */}
        <TabsContent value="database" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Records
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {(stats.database.totalRecords || 1250000).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tables Count
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.database.tablesCount || 24}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Connections
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.database.connections}
                  </h3>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Backup
                  </p>
                  <h3 className="text-xl font-bold mt-1">
                    {stats.database.lastBackup}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: {stats.database.backupStatus}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Slow Queries</CardTitle>
                <CardDescription>
                  Queries taking longer than expected to execute
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Query
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Duration
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Executed At
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            SELECT * FROM feedback_entries WHERE...
                          </td>
                          <td className="p-4 align-middle">2.5s</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:32:45
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            SELECT COUNT(*) FROM user_organizations...
                          </td>
                          <td className="p-4 align-middle">1.8s</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:30:12
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            UPDATE themes SET name = '...' WHERE...
                          </td>
                          <td className="p-4 align-middle">1.2s</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:28:56
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Table Growth</CardTitle>
                <CardDescription>Record count growth by table</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>feedback_entries</span>
                      <span>845,230 rows</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>users</span>
                      <span>12,450 rows</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>organizations</span>
                      <span>1,250 rows</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>themes</span>
                      <span>3,560 rows</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>api_keys</span>
                      <span>2,340 rows</span>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Metrics Tab */}
        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>API Request Volume</CardTitle>
                <CardDescription>
                  Request count and response times over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ApiUsageChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Key Statistics</CardTitle>
                <CardDescription>
                  Active API keys and usage metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Active API Keys</span>
                      <span>{stats.api.activeKeys || 48}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Keys Near Rate Limit</span>
                      <span>3</span>
                    </div>
                    <Progress value={6.25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Expiring This Month</span>
                      <span>5</span>
                    </div>
                    <Progress value={10.4} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Error Rate</span>
                      <span>0.8%</span>
                    </div>
                    <Progress value={0.8} className="h-2" />
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/admin/api-keys">Manage API Keys</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Endpoint Performance</CardTitle>
              <CardDescription>
                Response times and error rates by endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Endpoint
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Requests (24h)
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Avg. Response Time
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Error Rate
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          P95 Response
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">/api/feedback</td>
                        <td className="p-4 align-middle">3,245</td>
                        <td className="p-4 align-middle">125ms</td>
                        <td className="p-4 align-middle">0.2%</td>
                        <td className="p-4 align-middle">210ms</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">/api/themes</td>
                        <td className="p-4 align-middle">1,890</td>
                        <td className="p-4 align-middle">95ms</td>
                        <td className="p-4 align-middle">0.1%</td>
                        <td className="p-4 align-middle">180ms</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">/api/analytics</td>
                        <td className="p-4 align-middle">2,450</td>
                        <td className="p-4 align-middle">210ms</td>
                        <td className="p-4 align-middle">0.5%</td>
                        <td className="p-4 align-middle">350ms</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">/api/social-media</td>
                        <td className="p-4 align-middle">835</td>
                        <td className="p-4 align-middle">180ms</td>
                        <td className="p-4 align-middle">0.8%</td>
                        <td className="p-4 align-middle">320ms</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">/api/organizations</td>
                        <td className="p-4 align-middle">520</td>
                        <td className="p-4 align-middle">85ms</td>
                        <td className="p-4 align-middle">0.1%</td>
                        <td className="p-4 align-middle">150ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Performance Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tasks Processed (24h)
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {(stats.ai.tasksProcessed || 12450).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Tasks
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.ai.pendingTasks || 32}
                  </h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Failed Tasks (24h)
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.ai.failedTasks || 18}
                  </h3>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Processing Time
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.ai.avgProcessingTime}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>
                  Accuracy and performance metrics by AI model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>OpenAI GPT-3.5 Turbo</span>
                      <span>98.2% accuracy</span>
                    </div>
                    <Progress value={98.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>OpenAI GPT-4</span>
                      <span>99.5% accuracy</span>
                    </div>
                    <Progress value={99.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>DeepSeek</span>
                      <span>97.8% accuracy</span>
                    </div>
                    <Progress value={97.8} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Anthropic Claude</span>
                      <span>98.9% accuracy</span>
                    </div>
                    <Progress value={98.9} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Custom Sentiment Model</span>
                      <span>96.5% accuracy</span>
                    </div>
                    <Progress value={96.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent AI Tasks</CardTitle>
                <CardDescription>
                  Latest AI processing tasks and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Task ID
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Type
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Status
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">task_8a72f3</td>
                          <td className="p-4 align-middle">
                            Sentiment Analysis
                          </td>
                          <td className="p-4 align-middle">Completed</td>
                          <td className="p-4 align-middle">1.2s</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">task_9b83e4</td>
                          <td className="p-4 align-middle">Theme Extraction</td>
                          <td className="p-4 align-middle">Completed</td>
                          <td className="p-4 align-middle">2.5s</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">task_7c94d5</td>
                          <td className="p-4 align-middle">Keyword Analysis</td>
                          <td className="p-4 align-middle">Failed</td>
                          <td className="p-4 align-middle">-</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">task_6d05c6</td>
                          <td className="p-4 align-middle">
                            Sentiment Analysis
                          </td>
                          <td className="p-4 align-middle">Completed</td>
                          <td className="p-4 align-middle">1.8s</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">task_5e16b7</td>
                          <td className="p-4 align-middle">Theme Extraction</td>
                          <td className="p-4 align-middle">Completed</td>
                          <td className="p-4 align-middle">2.1s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Integrations
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {(stats.integrations.total || 124).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Integrations
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {(stats.integrations.active || 112).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <LinkIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Inactive Integrations
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {(stats.integrations.inactive || 12).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <LinkIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Integration Error Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.integrations.errorRate}
                  </h3>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>
                Status of third-party platform integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Platform
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Active Connections
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Last Sync
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Error Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">Shopify</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Operational
                          </span>
                        </td>
                        <td className="p-4 align-middle">28</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:30:00
                        </td>
                        <td className="p-4 align-middle">0.2%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">OpenTable</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Operational
                          </span>
                        </td>
                        <td className="p-4 align-middle">15</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:15:00
                        </td>
                        <td className="p-4 align-middle">0.0%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">Toast POS</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            Degraded
                          </span>
                        </td>
                        <td className="p-4 align-middle">22</td>
                        <td className="p-4 align-middle">
                          2023-07-15 13:45:00
                        </td>
                        <td className="p-4 align-middle">2.5%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">Facebook</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Operational
                          </span>
                        </td>
                        <td className="p-4 align-middle">42</td>
                        <td className="p-4 align-middle">
                          2023-07-15 14:25:00
                        </td>
                        <td className="p-4 align-middle">0.3%</td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">Twitter/X</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            Disrupted
                          </span>
                        </td>
                        <td className="p-4 align-middle">18</td>
                        <td className="p-4 align-middle">
                          2023-07-15 10:15:00
                        </td>
                        <td className="p-4 align-middle">8.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Audit Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Failed Logins (24h)
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.security.failedLogins || 24}
                  </h3>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Suspicious Activities
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.security.suspiciousActivities || 3}
                  </h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Role Changes (24h)
                  </p>
                  <h3 className="text-2xl font-bold mt-1">8</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Impersonation Events
                  </p>
                  <h3 className="text-2xl font-bold mt-1">5</h3>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Audit Log</CardTitle>
                <CardDescription>
                  Recent security-related events and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Event
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            User
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            IP Address
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">ROLE_CHANGE</td>
                          <td className="p-4 align-middle">
                            admin@famalytics.com
                          </td>
                          <td className="p-4 align-middle">192.168.1.1</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:32:45
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">FAILED_LOGIN</td>
                          <td className="p-4 align-middle">
                            john.doe@example.com
                          </td>
                          <td className="p-4 align-middle">192.168.1.2</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:30:12
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">API_KEY_CREATED</td>
                          <td className="p-4 align-middle">
                            jane.smith@example.com
                          </td>
                          <td className="p-4 align-middle">192.168.1.3</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:28:56
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            IMPERSONATION_START
                          </td>
                          <td className="p-4 align-middle">
                            admin@famalytics.com
                          </td>
                          <td className="p-4 align-middle">192.168.1.1</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:25:33
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            SUSPICIOUS_ACTIVITY
                          </td>
                          <td className="p-4 align-middle">unknown</td>
                          <td className="p-4 align-middle">203.0.113.42</td>
                          <td className="p-4 align-middle">
                            2023-07-15 14:22:18
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Key Security</CardTitle>
                <CardDescription>
                  API key encryption and security status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Keys with Strong Encryption</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Keys with Rate Limiting</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Keys with IP Restrictions</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Keys with Scope Limitations</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/admin/security/api-keys">
                      Manage API Key Security
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Data Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Recurring Revenue
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.financial.mrr}
                  </h3>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {stats.financial.revenueGrowth} from last month
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Subscriptions
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.financial.activeSubscriptions || 245}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Trial Accounts
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.financial.trialAccounts || 32}
                  </h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Customer LTV
                  </p>
                  <h3 className="text-2xl font-bold mt-1">$1,250</h3>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Tiers</CardTitle>
                <CardDescription>
                  Distribution of customers by subscription tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Free</span>
                      <span>85 organizations</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Basic</span>
                      <span>95 organizations</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Pro</span>
                      <span>55 organizations</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Enterprise</span>
                      <span>15 organizations</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest subscription payments and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Organization
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Amount
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Status
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">Acme Inc.</td>
                          <td className="p-4 align-middle">$199.00</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Paid
                            </span>
                          </td>
                          <td className="p-4 align-middle">2023-07-15</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">Globex Corp</td>
                          <td className="p-4 align-middle">$499.00</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Paid
                            </span>
                          </td>
                          <td className="p-4 align-middle">2023-07-14</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">Initech LLC</td>
                          <td className="p-4 align-middle">$99.00</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                              Pending
                            </span>
                          </td>
                          <td className="p-4 align-middle">2023-07-14</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">Umbrella Corp</td>
                          <td className="p-4 align-middle">$999.00</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Paid
                            </span>
                          </td>
                          <td className="p-4 align-middle">2023-07-13</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">Stark Industries</td>
                          <td className="p-4 align-middle">$199.00</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              Failed
                            </span>
                          </td>
                          <td className="p-4 align-middle">2023-07-13</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

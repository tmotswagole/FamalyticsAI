import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/admin-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function AdminLogsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is a system admin
  const { data: userOrg, error: userOrgError } = await supabase
    .from("user_organizations")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userOrgError || !userOrg || userOrg.role !== "SYSADMIN") {
    return redirect("/dashboard");
  }

  // Fetch system logs (this would be a real implementation in a production app)
  const mockLogs = [
    {
      id: "log_1",
      timestamp: "2023-07-15T14:32:45Z",
      level: "ERROR",
      source: "api/feedback",
      message: "Database connection timeout",
      user_id: "user_123",
      ip_address: "192.168.1.1",
    },
    {
      id: "log_2",
      timestamp: "2023-07-15T14:30:12Z",
      level: "INFO",
      source: "auth",
      message: "User login successful",
      user_id: "user_456",
      ip_address: "192.168.1.2",
    },
    {
      id: "log_3",
      timestamp: "2023-07-15T14:28:56Z",
      level: "WARNING",
      source: "api/themes",
      message: "Rate limit approaching for organization",
      user_id: "user_789",
      ip_address: "192.168.1.3",
    },
    {
      id: "log_4",
      timestamp: "2023-07-15T14:25:33Z",
      level: "ERROR",
      source: "api/analytics",
      message: "Failed to process analytics data",
      user_id: "user_123",
      ip_address: "192.168.1.1",
    },
    {
      id: "log_5",
      timestamp: "2023-07-15T14:22:18Z",
      level: "INFO",
      source: "cron",
      message: "Scheduled task completed successfully",
      user_id: "system",
      ip_address: "127.0.0.1",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground mt-2">
            Monitor application logs, errors, and system events
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="cron">Cron Jobs</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Search logs..." className="w-[300px]" />
            <Button variant="outline">Search</Button>
          </div>
          <Button variant="outline">Export Logs</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Logs</CardTitle>
            <CardDescription>
              Recent system events, errors, and application logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => {
                  const timestamp = new Date(log.timestamp).toLocaleString();
                  const level = log.level;

                  return (
                    <TableRow key={log.id}>
                      <TableCell>{timestamp}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            level === "ERROR"
                              ? "destructive"
                              : level === "WARNING"
                                ? "warning"
                                : "default"
                          }
                        >
                          {level}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {log.message}
                      </TableCell>
                      <TableCell>{log.user_id}</TableCell>
                      <TableCell>{log.ip_address}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

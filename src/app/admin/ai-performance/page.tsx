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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, AlertTriangle, Activity } from "lucide-react";

export default async function AdminAIPerformancePage() {
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

  // Mock AI task data
  const mockTasks = [
    {
      id: "task_8a72f3",
      type: "Sentiment Analysis",
      status: "Completed",
      duration: "1.2s",
      model: "OpenAI GPT-3.5 Turbo",
      created_at: "2023-07-15T14:32:45Z",
      organization_id: "org_123",
    },
    {
      id: "task_9b83e4",
      type: "Theme Extraction",
      status: "Completed",
      duration: "2.5s",
      model: "OpenAI GPT-4",
      created_at: "2023-07-15T14:30:12Z",
      organization_id: "org_456",
    },
    {
      id: "task_7c94d5",
      type: "Keyword Analysis",
      status: "Failed",
      duration: "-",
      model: "DeepSeek",
      created_at: "2023-07-15T14:28:56Z",
      organization_id: "org_123",
    },
    {
      id: "task_6d05c6",
      type: "Sentiment Analysis",
      status: "Completed",
      duration: "1.8s",
      model: "Anthropic Claude",
      created_at: "2023-07-15T14:25:33Z",
      organization_id: "org_789",
    },
    {
      id: "task_5e16b7",
      type: "Theme Extraction",
      status: "Completed",
      duration: "2.1s",
      model: "OpenAI GPT-3.5 Turbo",
      created_at: "2023-07-15T14:22:18Z",
      organization_id: "org_123",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Performance</h1>
          <p className="text-muted-foreground mt-2">
            Monitor AI task processing, model performance, and usage metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tasks Processed (24h)
                </p>
                <h3 className="text-2xl font-bold mt-1">12,450</h3>
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
                <h3 className="text-2xl font-bold mt-1">32</h3>
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
                <h3 className="text-2xl font-bold mt-1">18</h3>
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
                <h3 className="text-2xl font-bold mt-1">1.8s</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tasks">AI Tasks</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage by Organization</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Tasks</CardTitle>
                <CardDescription>
                  Latest AI processing tasks and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTasks.map((task) => {
                      const timestamp = new Date(
                        task.created_at,
                      ).toLocaleString();
                      const status = task.status;

                      return (
                        <TableRow key={task.id}>
                          <TableCell className="font-mono text-xs">
                            {task.id}
                          </TableCell>
                          <TableCell>{task.type}</TableCell>
                          <TableCell>{task.model}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                status === "Completed"
                                  ? "success"
                                  : status === "Processing"
                                    ? "default"
                                    : status === "Pending"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>{task.duration}</TableCell>
                          <TableCell>{timestamp}</TableCell>
                          <TableCell>{task.organization_id}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>
                  Accuracy and performance metrics by AI model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">OpenAI GPT-3.5 Turbo</span>
                      <span>98.2% accuracy</span>
                    </div>
                    <Progress value={98.2} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>5,230 tasks processed</span>
                      <span>Avg. time: 1.2s</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">OpenAI GPT-4</span>
                      <span>99.5% accuracy</span>
                    </div>
                    <Progress value={99.5} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>2,180 tasks processed</span>
                      <span>Avg. time: 2.8s</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">DeepSeek</span>
                      <span>97.8% accuracy</span>
                    </div>
                    <Progress value={97.8} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>1,850 tasks processed</span>
                      <span>Avg. time: 1.5s</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Anthropic Claude</span>
                      <span>98.9% accuracy</span>
                    </div>
                    <Progress value={98.9} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>2,340 tasks processed</span>
                      <span>Avg. time: 2.1s</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">
                        Custom Sentiment Model
                      </span>
                      <span>96.5% accuracy</span>
                    </div>
                    <Progress value={96.5} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>850 tasks processed</span>
                      <span>Avg. time: 0.8s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Usage</CardTitle>
                <CardDescription>AI task usage by organization</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Tasks (24h)</TableHead>
                      <TableHead>Tasks (30d)</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Avg. Duration</TableHead>
                      <TableHead>Most Used Model</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Acme Inc.</TableCell>
                      <TableCell>3,245</TableCell>
                      <TableCell>78,920</TableCell>
                      <TableCell>99.2%</TableCell>
                      <TableCell>1.5s</TableCell>
                      <TableCell>GPT-3.5 Turbo</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Globex Corp</TableCell>
                      <TableCell>2,180</TableCell>
                      <TableCell>52,450</TableCell>
                      <TableCell>98.7%</TableCell>
                      <TableCell>1.8s</TableCell>
                      <TableCell>GPT-4</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Initech LLC</TableCell>
                      <TableCell>1,850</TableCell>
                      <TableCell>42,320</TableCell>
                      <TableCell>97.5%</TableCell>
                      <TableCell>1.6s</TableCell>
                      <TableCell>Claude</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Umbrella Corp</TableCell>
                      <TableCell>2,340</TableCell>
                      <TableCell>56,780</TableCell>
                      <TableCell>99.1%</TableCell>
                      <TableCell>1.7s</TableCell>
                      <TableCell>GPT-3.5 Turbo</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Stark Industries</TableCell>
                      <TableCell>2,835</TableCell>
                      <TableCell>68,450</TableCell>
                      <TableCell>98.9%</TableCell>
                      <TableCell>1.9s</TableCell>
                      <TableCell>GPT-4</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

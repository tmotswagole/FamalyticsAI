import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SentimentChart from "@/components/sentiment-chart";
import ThemeDistribution from "@/components/theme-distribution";
import {
  BarChart3,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { t } from "@/lib/content";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  // Check user role
  const { data: userData, error: userError } = await supabase
    .from("auth.users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  // If user is a system admin, redirect to admin dashboard
  if (!userError && userData?.role === "SYSADMIN") {
    return redirect("/admin/dashboard");
  }

  // If user is a client admin
  if (!userError && userData?.role === "CLIENTADMIN") {
    // Check if user has an organization
    const { data: userOrgs } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", user.id);

    if (!userOrgs || userOrgs.length === 0) {
      // No organization, redirect to organization creation
      return redirect("/success/create-organization");
    }

    // Check if user has an active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!subscription) {
      // No active subscription, redirect to pricing
      return redirect("/pricing");
    }
  }

  // Get user's organizations
  const { data: userOrgs } = await supabase
    .from("auth.users")
    .select("organization_id, organizations(id, name)")
    .eq("user_id", user.id);

  if (!userOrgs || userOrgs.length === 0) {
    // In a real app, you'd redirect to an organization creation page
    // For now, we'll just show a message
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <main className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h1 className="text-2xl font-bold mb-4">Welcome to Famalytics</h1>
            <p className="text-muted-foreground mb-6">
              You don't have any organizations yet.
            </p>
            <p>
              You would be redirected to create an organization in the full app.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Use the first organization for now (in a real app, you'd let the user select)
  const organizationId = userOrgs[0].organization_id;
  const organizationName =
    userOrgs[0].organizations && userOrgs[0].organizations[0]
      ? userOrgs[0].organizations[0].name
      : "Your Organization";

  // Mock data for the dashboard
  // In a real app, this would come from the database
  const sentimentData = [
    { date: "2023-06-01", positive: 45, neutral: 30, negative: 25 },
    { date: "2023-06-02", positive: 50, neutral: 25, negative: 25 },
    { date: "2023-06-03", positive: 55, neutral: 25, negative: 20 },
    { date: "2023-06-04", positive: 60, neutral: 20, negative: 20 },
    { date: "2023-06-05", positive: 65, neutral: 20, negative: 15 },
    { date: "2023-06-06", positive: 60, neutral: 25, negative: 15 },
    { date: "2023-06-07", positive: 70, neutral: 20, negative: 10 },
  ];

  const themeData = [
    { name: "Product Quality", count: 120 },
    { name: "Customer Service", count: 80 },
    { name: "Delivery", count: 60 },
    { name: "Website/App", count: 40 },
    { name: "Pricing", count: 30 },
  ];

  const recentAlerts = [
    {
      id: "1",
      title: "Negative Sentiment Spike",
      description:
        "Detected a 15% increase in negative sentiment related to Customer Service",
      date: "2023-06-07",
      severity: "high",
    },
    {
      id: "2",
      title: "New Theme Emerging",
      description:
        "'Mobile App Performance' is becoming a significant theme in recent feedback",
      date: "2023-06-06",
      severity: "medium",
    },
    {
      id: "3",
      title: "Sentiment Threshold Alert",
      description:
        "Product Quality sentiment dropped below your set threshold of -0.2",
      date: "2023-06-05",
      severity: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {organizationName} {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("dashboard.overview")}
          </p>
        </div>

        {/* Date Range Selector - This would be a client component in a real app */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("dashboard.dateRange")}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.totalFeedback")}
                </p>
                <h3 className="text-2xl font-bold mt-1">330</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ↑ 12% from last week
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.positiveSentiment")}
                </p>
                <h3 className="text-2xl font-bold mt-1">65%</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ↑ 5% from last week
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.negativeSentiment")}
                </p>
                <h3 className="text-2xl font-bold mt-1">15%</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ↓ 3% from last week
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.activeAlerts")}
                </p>
                <h3 className="text-2xl font-bold mt-1">3</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  1 {t("dashboard.highPriority")}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              {t("dashboard.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="sentiment">
              {t("dashboard.tabs.sentiment")}
            </TabsTrigger>
            <TabsTrigger value="themes">
              {t("dashboard.tabs.themes")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SentimentChart data={sentimentData} height={350} />
              </div>
              <div>
                <ThemeDistribution data={themeData} height={350} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.recentAlerts")}</CardTitle>
                <CardDescription>
                  {t("dashboard.alertsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start space-x-4 p-3 rounded-md bg-muted/50"
                    >
                      <div
                        className={`p-2 rounded-full ${alert.severity === "high" ? "bg-red-100" : alert.severity === "medium" ? "bg-yellow-100" : "bg-blue-100"}`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 ${alert.severity === "high" ? "text-red-600" : alert.severity === "medium" ? "text-yellow-600" : "text-blue-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{alert.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {alert.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("chart.sentiment.title")}</CardTitle>
                <CardDescription>
                  {t("chart.sentiment.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentChart data={sentimentData} height={400} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("chart.sentimentBySource.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Source breakdown chart would appear here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("chart.sentimentByTheme.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Theme sentiment chart would appear here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("chart.themes.title")}</CardTitle>
                <CardDescription>
                  {t("chart.themes.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeDistribution data={themeData} height={400} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("chart.themeTrends.title")}</CardTitle>
                <CardDescription>
                  {t("chart.themeTrends.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Theme trends chart would appear here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("chart.keywords.title")}</CardTitle>
                <CardDescription>
                  {t("chart.keywords.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Keyword cloud visualization would appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

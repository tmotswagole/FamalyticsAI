import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Website Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor website traffic and user engagement metrics
          </p>
        </div>

        <AnalyticsDashboard />
      </main>
    </div>
  );
}

import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/admin-dashboard";
import AdminNavbar from "@/components/admin/admin-navbar";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            System Administration
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor system performance, user activity, and application health
          </p>
        </div>

        <AdminDashboard />
      </main>
    </div>
  );
}

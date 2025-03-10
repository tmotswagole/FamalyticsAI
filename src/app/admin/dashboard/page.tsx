import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/admin-dashboard";
import AdminNavbar from "@/components/admin/admin-navbar";

export default async function AdminDashboardPage() {
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
    .from("auth.users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userOrg || userOrg.role !== "SYSADMIN") {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
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

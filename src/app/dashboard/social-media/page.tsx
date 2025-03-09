import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import SocialMediaDashboard from "@/components/social-media-dashboard";

export default async function SocialMediaPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's organizations
  const { data: userOrgs } = await supabase
    .from("user_organizations")
    .select("organization_id, organizations(id, name)")
    .eq("user_id", user.id);

  if (!userOrgs || userOrgs.length === 0) {
    // User has no organizations, redirect to create one
    return redirect("/dashboard");
  }

  // Use the first organization for now (in a real app, you'd let the user select)
  const organizationId = userOrgs[0].organization_id;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Social Media Engagement
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor engagement metrics and sentiment across your social media
            channels
          </p>
        </div>

        <SocialMediaDashboard organizationId={organizationId} />
      </main>
    </div>
  );
}

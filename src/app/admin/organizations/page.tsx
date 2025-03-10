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

export default async function AdminOrganizationsPage() {
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

  if (userOrgError || !userOrg || userOrg.role !== "SYSADMIN") {
    return redirect("/dashboard");
  }

  // Fetch organizations with their subscription info
  const { data: organizations, error: orgsError } = await supabase
    .from("organizations")
    .select(
      "id, name, created_at, subscription_tier, subscription_status, user_organizations(user_id)",
    )
    .order("created_at", { ascending: false });

  if (orgsError) {
    console.error("Error fetching organizations:", orgsError);
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage client organizations and their subscriptions
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search organizations..."
              className="w-[300px]"
            />
            <Button variant="outline">Search</Button>
          </div>
          <Button>Add New Organization</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Organizations</CardTitle>
            <CardDescription>
              A list of all client organizations with their subscription status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Subscription Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations?.map((org) => {
                  const userCount = org.user_organizations?.length || 0;
                  const created = new Date(org.created_at).toLocaleDateString();
                  const subscriptionStatus =
                    org.subscription_status || "inactive";
                  const subscriptionTier = org.subscription_tier || "free";

                  return (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>{userCount}</TableCell>
                      <TableCell className="capitalize">
                        {subscriptionTier}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subscriptionStatus === "active"
                              ? "success"
                              : subscriptionStatus === "trialing"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {subscriptionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{created}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
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

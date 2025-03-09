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

export default async function AdminUsersPage() {
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

  // Fetch users with their roles
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(
      "id, email, created_at, last_sign_in_at, user_organizations(role, organization_id, organizations(name))",
    )
    .order("created_at", { ascending: false });

  if (usersError) {
    console.error("Error fetching users:", usersError);
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input placeholder="Search users..." className="w-[300px]" />
            <Button variant="outline">Search</Button>
          </div>
          <Button>Add New User</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A list of all users in the system with their roles and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => {
                  const userOrg = user.user_organizations?.[0] || {};
                  const role = userOrg.role || "N/A";
                  const orgName = userOrg.organizations?.name || "N/A";
                  const lastLogin = user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : "Never";
                  const created = new Date(
                    user.created_at,
                  ).toLocaleDateString();
                  const isActive = !!user.last_sign_in_at;

                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            role === "SYSADMIN"
                              ? "destructive"
                              : role === "CLIENTADMIN"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {role}
                        </Badge>
                      </TableCell>
                      <TableCell>{orgName}</TableCell>
                      <TableCell>{created}</TableCell>
                      <TableCell>{lastLogin}</TableCell>
                      <TableCell>
                        <Badge variant={isActive ? "success" : "outline"}>
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Impersonate
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

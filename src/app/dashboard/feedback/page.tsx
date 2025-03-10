import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardNavbar from "@/components/dashboard-navbar";
import FeedbackForm from "@/components/feedback-form";
import CSVUpload from "@/components/csv-upload";
import { Separator } from "@/components/ui/separator";
import { t } from "@/lib/content";

export default async function FeedbackPage() {
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
    .from("auth.users")
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
            {t("feedback.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("feedback.description")}
          </p>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="add">{t("feedback.tabs.add")}</TabsTrigger>
            <TabsTrigger value="import">
              {t("feedback.tabs.import")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FeedbackForm organizationId={organizationId} />

              <Card>
                <CardHeader>
                  <CardTitle>{t("feedback.tips.title")}</CardTitle>
                  <CardDescription>
                    {t("feedback.tips.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">
                      {t("feedback.tips.specific.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("feedback.tips.specific.description")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">
                      {t("feedback.tips.context.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("feedback.tips.context.description")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">
                      {t("feedback.tips.natural.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("feedback.tips.natural.description")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("feedback.import.title")}</CardTitle>
                <CardDescription>
                  {t("feedback.import.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUpload
                  organizationId={organizationId}
                  onUploadComplete={(results) => {
                    // This would be handled client-side
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        {/* This would be a client component in a real implementation */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("feedback.recent.title")}</h2>
            <div className="flex gap-2">
              {/* These would be functional in a client component */}
              <select className="px-3 py-2 border rounded-md text-sm">
                <option value="all">{t("feedback.filter.allSources")}</option>
                <option value="manual_entry">
                  {t("feedback.filter.manualEntry")}
                </option>
                <option value="csv_import">
                  {t("feedback.filter.csvImport")}
                </option>
                <option value="api">{t("feedback.filter.api")}</option>
              </select>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option value="all">{t("feedback.filter.allSentiment")}</option>
                <option value="positive">
                  {t("feedback.filter.positive")}
                </option>
                <option value="neutral">{t("feedback.filter.neutral")}</option>
                <option value="negative">
                  {t("feedback.filter.negative")}
                </option>
              </select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {t("feedback.table.feedback")}
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {t("feedback.table.source")}
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {t("feedback.table.date")}
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          {t("feedback.table.sentiment")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          This is a placeholder for feedback data that would be
                          loaded dynamically.
                        </td>
                        <td className="p-4 align-middle">manual_entry</td>
                        <td className="p-4 align-middle">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Positive
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          Another placeholder for feedback data.
                        </td>
                        <td className="p-4 align-middle">csv_import</td>
                        <td className="p-4 align-middle">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Neutral
                          </span>
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          A third placeholder for feedback data.
                        </td>
                        <td className="p-4 align-middle">api</td>
                        <td className="p-4 align-middle">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Negative
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/middleware";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const getClientIp = (request: NextRequest): string | null => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",").map((ip) => ip.trim())[0];
    if (ip) return ip;
  }

  return (
    request.headers.get("cf-connecting-ip") || // Cloudflare
    request.headers.get("x-real-ip") || // Nginx Reverse Proxy
    request.ip ||
    null
  );
};

export default async function ResetPassword(
  props: Readonly<{
    searchParams: Promise<Message>;
  }>
) {
  const searchParams = await props.searchParams;

  // Safely retrieve the current URL
  const currentUrl =
    typeof window !== "undefined" ? new URL(window.location.href) : null;

  if (!currentUrl) {
    throw new Error("Unable to retrieve the current URL.");
  }

  // Create a NextRequest object
  const request = new NextRequest(currentUrl.toString(), {
    headers: {
      cookie: document.cookie,
    },
  });

  const supabase = createClient(request).supabase;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <DashboardNavbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--background))] px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
          <form
            className="flex flex-col space-y-6"
            action={async (formData) => {
              await resetPasswordAction(formData, request);
            }}
            method="POST"
          >
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
                Reset password
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Please enter your new password below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[hsl(var(--foreground))]"
                >
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="New password"
                  required
                  className="w-full bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-[hsl(var(--foreground))]"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                  className="w-full bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                  minLength={8}
                />
              </div>
            </div>

            <SubmitButton
              pendingText="Resetting password..."
              className="w-full bg-[hsl(var(--button-bg))] text-[hsl(var(--button-primary))]"
            >
              Reset password
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </div>
      </div>
    </div>
  );
}

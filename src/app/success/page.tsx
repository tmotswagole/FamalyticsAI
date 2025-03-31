"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SuccessPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUserOrganization = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user has an organization already
        const { data: userOrgs } = await supabase
          .from("user_organizations")
          .select("organization_id")
          .eq("user_id", user.id);

        // If no organization, redirect to create organization page
        if (!userOrgs || userOrgs.length === 0) {
          router.push("/success/create-organization");
          return;
        }
      }
    };

    // Short delay to ensure payment processing is complete
    const timer = setTimeout(() => {
      checkUserOrganization();
    }, 1500);

    return () => clearTimeout(timer);
  }, [router, supabase]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--background))] p-4">
      <Card className="w-full max-w-md bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-[hsl(var(--success))]" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Thank you for your purchase. Your payment has been processed
            successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-[hsl(var(--muted-foreground))]">
            Setting up your account...
          </p>
          <div className="animate-pulse h-2 w-24 bg-[hsl(var(--muted))] rounded"></div>
        </CardContent>
      </Card>
    </main>
  );
}

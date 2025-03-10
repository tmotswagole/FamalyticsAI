import { redirect } from "next/navigation";
import { checkUserSubscription } from "@/app/actions";
import { createClient } from "../../supabase/server";

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredTier?: string;
}

export async function SubscriptionCheck({
  children,
  redirectTo = "/pricing",
  requiredTier = "starter",
}: SubscriptionCheckProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user has an active subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, subscription_tier")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  // Define tier levels for comparison
  const tierLevels: Record<string, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
  };

  // Check if the user's tier meets the required tier
  const hasValidSubscription =
    subscription &&
    tierLevels[subscription.subscription_tier] >= tierLevels[requiredTier];

  if (!hasValidSubscription) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}

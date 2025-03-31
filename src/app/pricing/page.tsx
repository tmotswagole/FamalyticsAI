import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../supabase/server";

export default async function Pricing() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user has an organization already to determine redirect URL
  let redirectUrl = "/success";
  if (user) {
    const { data: userOrgs } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", user.id);

    // If user already has an organization, they're upgrading
    if (userOrgs && userOrgs.length > 0) {
      redirectUrl = "/dashboard";
    }
  }

  // Use mock data directly instead of fetching from API
  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for small businesses just getting started",
      amount: 2900,
      interval: "month",
      features: [
        "Up to 1,000 feedback entries/month",
        "Basic sentiment analysis",
        "CSV imports",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced features for growing businesses",
      amount: 7900,
      interval: "month",
      features: [
        "Up to 5,000 feedback entries/month",
        "Advanced sentiment analysis",
        "Theme extraction",
        "API access",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      amount: 19900,
      interval: "month",
      features: [
        "Unlimited feedback entries",
        "Custom AI models",
        "White-labeling",
        "Dedicated account manager",
        "24/7 support",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-[hsl(var(--foreground))]">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))]">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans?.map((item: any) => (
            <PricingCard
              key={item.id}
              item={item}
              user={user}
              redirectUrl={redirectUrl}
            />
          ))}
        </div>
      </div>
    </>
  );
}

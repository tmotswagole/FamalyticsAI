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

  // Get plans from Supabase function
  const { data: plans, error } = await supabase.functions.invoke("get-plans");

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
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

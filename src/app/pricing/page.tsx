import Head from "next/head";
import Navbar from "@/components/navbar";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { checkUserOrganizations } from "../actions";
import StripePricingWrapper from "@/components/stripe-pricing-wrapper";

export default async function Pricing() {
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

  const createClientResponse = createClient(request);
  const supabase = createClientResponse.supabase;
  const res = createClientResponse.response;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user has an organization already to determine redirect URL
  let redirectUrl = "/success";
  if (user) {
    const userOrgsCheck = await checkUserOrganizations(user.id, request);
    if (!userOrgsCheck) {
      return NextResponse.redirect(
        new URL("/success/create-organization", res.url)
      );
    }
  }

  return (
    <>
      <Head>
        {/* Stripe pricing table script */}
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </Head>
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

        {/* Insert the Stripe pricing table */}
        <div className="mb-16">
          <StripePricingWrapper />
        </div>
      </div>
    </>
  );
}

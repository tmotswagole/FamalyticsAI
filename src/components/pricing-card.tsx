"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function PricingCard({
  item,
  user,
  redirectUrl = "/success",
  className,
}: {
  item: any;
  user: User | null;
  redirectUrl?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  // Handle checkout process
  const handleCheckout = async () => {
    setLoading(true);

    try {
      if (!user) {
        // Redirect to login if user is not authenticated
        window.location.href = "/sign-in?redirect=pricing";
        return;
      }

      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Customer-Email": user.email || "",
        },
        body: JSON.stringify({
          price_id: item.id,
          user_id: user.id,
          return_url: redirectUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`w-[350px] relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 ${item.popular ? "border-2 border-blue-300 shadow-xl scale-105" : "border border-blue-400"}`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-black">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-black">
            ${item?.amount / 100}
          </span>
          <span className="text-black">/{item?.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="relative">
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-6 text-lg font-medium ${className}`}
        >
          {loading ? "Processing..." : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  );
}

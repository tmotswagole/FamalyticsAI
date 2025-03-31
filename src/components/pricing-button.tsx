"use client";

import React from "react";

interface Item {
  id: string;
  popular: boolean;
}

interface User {
  id: string;
}

interface PricingButtonProps {
  item: Item;
  user?: User;
}

export default function PricingButton({ item, user }: PricingButtonProps) {
  const handleClick = () => {
    window.location.href = user
      ? `/api/create-checkout?plan_id=${item.id}&user_id=${user.id}`
      : "/sign-in?redirect=pricing";
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 rounded-md font-medium transition-colors ${
        item.popular
          ? "bg-button-secondary text-foreground transition-transform hover:opacity-75 hover:scale-[1.01]"
          : "bg-primary-foreground text-foreground transition-transform hover:opacity-75 hover:scale-[1.01]"
      }`}
    >
      Get Started
    </button>
  );
}

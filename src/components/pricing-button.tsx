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
      ? `/api/create-checkout?price_id=${item.id}&user_id=${user.id}`
      : "/sign-in?redirect=pricing";
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 rounded-md font-medium transition-colors ${
        item.popular
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      Get Started
    </button>
  );
}

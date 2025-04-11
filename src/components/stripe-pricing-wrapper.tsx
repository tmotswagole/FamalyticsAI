"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromCookie } from "@/app/auth-cookies";

export default function StripePricingWrapper() {
  const router = useRouter();

  useEffect(() => {
    const pricingTable = document.querySelector("stripe-pricing-table");
    if (!pricingTable) return;

    const handleClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const user = getUserFromCookie();
      if (!user) {
        // Prevent default behavior and redirect if not logged in.
        mouseEvent.preventDefault();
        router.push("/login");
      }
    };

    pricingTable.addEventListener("click", handleClick);
    return () => {
      pricingTable.removeEventListener("click", handleClick);
    };
  }, [router]);

  return (
    <stripe-pricing-table
      pricing-table-id="prctbl_1R715yQFWkis4Zoitlud3N2s"
      publishable-key="pk_test_51QryZnQFWkis4ZoiZ44FtcHcwmJZEur6I6tmQ1gO8EDRMQfkmAZ5JA6iw1OczbyntFDVUdG8Vp75Tt77fEOHUm7k00VMnOaWXS"
    ></stripe-pricing-table>
  );
}

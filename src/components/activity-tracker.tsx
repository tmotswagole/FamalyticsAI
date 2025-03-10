"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";

// This component tracks user activity and updates the last active timestamp
export default function ActivityTracker() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Update last active time when component mounts or route changes
    const updateLastActive = async () => {
      try {
        // Update last active cookie via API call
        await fetch("/api/auth/update-activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Failed to update activity status", error);
      }
    };

    updateLastActive();

    // Set up event listeners for user activity
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];

    let activityTimeout: NodeJS.Timeout;

    const handleUserActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(updateLastActive, 60000); // Update at most once per minute
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Clean up event listeners
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearTimeout(activityTimeout);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}

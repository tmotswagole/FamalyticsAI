"use client";

import { useState, useEffect, useCallback } from "react";
import { NextRequest } from "next/server";
import { Notification } from "@/types/notificationts";
import { createClient } from "@/utils/supabase/middleware";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUrl =
    typeof window !== "undefined"
      ? new URL(window.location.href)
      : "localhost:3000";
  const middlewareResponse = createClient(
    new NextRequest(currentUrl.toString(), {
      headers: {
        cookie: document.cookie,
      },
    })
  );
  const supabase = middlewareResponse.supabase;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        console.error("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data as Notification[]);

      // Count unread notifications
      const count = data.filter((n: Notification) => !n.is_read).length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error in markAsRead:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        console.error("User not authenticated");
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.user.id)
        .eq("is_read", false);

      if (error) {
        console.error("Error marking all notifications as read:", error);
        return;
      }

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      setUnreadCount(0);
    } catch (error) {
      console.error("Error in markAllAsRead:", error);
    }
  };

  // Set up realtime subscription for new notifications
  useEffect(() => {
    fetchNotifications();

    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          // Update notifications list
          setNotifications((prev) => [newNotification, ...prev]);

          // Update unread count
          if (!newNotification.is_read) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchNotifications, supabase]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}

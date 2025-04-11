"use client";

import { useState } from "react";
import { Notification } from "@/types/notificationts";
import { formatDistanceToNow } from "date-fns";
import { Bell, Mail, BellRing, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/app/hooks/useNotifications";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { markAsRead } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case "email":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "browser":
        return <Bell className="h-5 w-5 text-green-500" />;
      case "push":
        return <BellRing className="h-5 w-5 text-purple-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setExpanded(!expanded);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-b border-gray-100 last:border-b-0 ${
        notification.is_read ? "bg-white" : "bg-blue-50"
      }`}
    >
      <button
        onClick={handleClick}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-100"
            >
              <p className="text-sm text-gray-600">{notification.message}</p>
              {notification.data && (
                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(notification.data, null, 2)}
                </pre>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
}

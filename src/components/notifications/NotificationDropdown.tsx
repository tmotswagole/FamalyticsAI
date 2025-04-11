"use client";

import { useRef, useEffect } from "react";
import { Notification } from "@/types/notificationts";
import NotificationItem from "./NotificationItem";
import { motion } from "framer-motion";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  notifications,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Notifications</h3>
        <button
          onClick={onMarkAllAsRead}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 text-center">
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

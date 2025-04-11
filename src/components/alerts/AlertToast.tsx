"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  Bell,
  Mail,
  BellRing,
  CheckCircle,
} from "lucide-react";

interface AlertToastProps {
  id: string;
  title: string;
  message: string;
  type: "email" | "browser" | "push" | "alert" | "success";
  duration?: number;
  onClose: (id: string) => void;
}

export default function AlertToast({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
}: AlertToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getIcon = () => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5 text-white" />;
      case "browser":
        return <Bell className="h-5 w-5 text-white" />;
      case "push":
        return <BellRing className="h-5 w-5 text-white" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-white" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />;
      default:
        return <Bell className="h-5 w-5 text-white" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "email":
        return "bg-blue-500";
      case "browser":
        return "bg-green-500";
      case "push":
        return "bg-purple-500";
      case "alert":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-lg shadow-lg overflow-hidden max-w-md w-full"
        >
          <div
            className={`${getBackgroundColor()} px-4 py-2 flex items-center`}
          >
            <div className="flex-shrink-0 mr-2">{getIcon()}</div>
            <div className="flex-1 text-white">
              <p className="font-medium">{title}</p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
              className="ml-2 text-white opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="bg-white px-4 py-3">
            <p className="text-gray-700 text-sm">{message}</p>
          </div>
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`h-1 ${getBackgroundColor()} opacity-70`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AlertToast from './AlertToast';
import { motion, AnimatePresence } from 'framer-motion';

type Alert = {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'browser' | 'push' | 'alert' | 'success';
};

export default function AlertManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    setPortalRoot(document.getElementById('alert-portal'));
  }, []);
  
  useEffect(() => {
    // Subscribe to alert events from the server
    const eventSource = new EventSource('/api/alerts/subscribe');
    
    eventSource.onmessage = (event) => {
      const alertData = JSON.parse(event.data);
      setAlerts((prevAlerts) => [...prevAlerts, { 
        ...alertData,
        id: Math.random().toString(36).substring(2, 9)
      }]);
    };
    
    return () => {
      eventSource.close();
    };
  }, []);
  
  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };
  
  if (!portalRoot) return null;
  
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-4 w-full max-w-md">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            layout
            transition={{ duration: 0.2 }}
          >
            <AlertToast
              id={alert.id}
              title={alert.title}
              message={alert.message}
              type={alert.type}
              onClose={removeAlert}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    portalRoot
  );
}
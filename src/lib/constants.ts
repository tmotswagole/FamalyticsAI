// Color constants
export const COLORS = {
  primary: "#00ffff",
  secondary: "#eaecc6",
  background: "#f8fafc",
  text: "#1e293b",
  border: "#e2e8f0",
  positive: "#10b981",
  neutral: "#6b7280",
  negative: "#ef4444",
};

// User roles
export const USER_ROLES = {
  SYSADMIN: "SYSADMIN",
  CLIENTADMIN: "CLIENTADMIN",
  OBSERVER: "OBSERVER",
};

// Sentiment labels
export const SENTIMENT_LABELS = {
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
};

// Alert frequencies
export const ALERT_FREQUENCIES = {
  IMMEDIATE: "immediate",
  DAILY: "daily",
  WEEKLY: "weekly",
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: "email",
  IN_APP: "in_app",
};

// Notification types
export const NOTIFICATION_TYPES = {
  ALERT: "alert",
  SYSTEM: "system",
  INFO: "info",
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  BASIC: "starter",
  PRO: "pro",
  ENTERPRISE: "enterprise",
};

// Subscription statuses
export const SUBSCRIPTION_STATUSES = {
  ACTIVE: "active",
  TRIALING: "trialing",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  ISO: "yyyy-MM-dd",
};

// API endpoints
export const API_ENDPOINTS = {
  FEEDBACK: "/api/feedback",
  THEMES: "/api/themes",
  ALERTS: "/api/alerts",
  REPORTS: "/api/reports",
  ORGANIZATIONS: "/api/organizations",
  USERS: "/api/users",
  INTEGRATIONS: "/api/integrations",
  NOTIFICATIONS: "/api/notifications",
};

// OpenAI models
export const OPENAI_MODELS = {
  GPT_3_5_TURBO: "gpt-3.5-turbo",
  GPT_4: "gpt-4",
};

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;

// Chart colors
export const CHART_COLORS = [
  "#00ffff", // Primary
  "#eaecc6", // Secondary
  "#10b981", // Positive
  "#6b7280", // Neutral
  "#ef4444", // Negative
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#84cc16", // Lime
];

// This file contains all text content used in the application
// It supports multiple languages with a type-safe structure

type ContentKey = string;
type Language = "en" | "es" | "fr" | "de" | "ja";

interface ContentDictionary {
  [key: ContentKey]: string;
}

interface LocalizedContent {
  [key: string]: ContentDictionary;
}

// Default language
let currentLanguage: Language = "en";

// Content dictionary for all supported languages
export const content: LocalizedContent = {
  en: {
    // Common
    "app.name": "Famalytics",
    "app.tagline": "AI-Powered Customer Sentiment Analysis",
    "app.description":
      "Monitor, analyze, and respond to customer feedback across multiple channels using advanced AI technology.",

    // Navigation
    "nav.features": "Features",
    "nav.howItWorks": "How It Works",
    "nav.pricing": "Pricing",
    "nav.dashboard": "Dashboard",
    "nav.signIn": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.signOut": "Sign Out",

    // Auth
    "auth.signIn": "Sign in",
    "auth.signUp": "Sign up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgotPassword": "Forgot Password?",
    "auth.resetPassword": "Reset Password",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.sendResetLink": "Send Reset Link",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Overview of customer sentiment and feedback trends",
    "dashboard.dateRange": "Last 7 days",
    "dashboard.totalFeedback": "Total Feedback",
    "dashboard.positiveSentiment": "Positive Sentiment",
    "dashboard.negativeSentiment": "Negative Sentiment",
    "dashboard.activeAlerts": "Active Alerts",
    "dashboard.highPriority": "high priority",
    "dashboard.tabs.overview": "Overview",
    "dashboard.tabs.sentiment": "Sentiment Analysis",
    "dashboard.tabs.themes": "Theme Analysis",
    "dashboard.recentAlerts": "Recent Alerts",
    "dashboard.alertsDescription":
      "Notifications based on your alert configurations",

    // Feedback Management
    "feedback.title": "Feedback Management",
    "feedback.description":
      "Add new feedback entries or import them from a CSV file.",
    "feedback.tabs.add": "Add Feedback",
    "feedback.tabs.import": "Import from CSV",
    "feedback.form.title": "Add New Feedback",
    "feedback.form.text": "Feedback Text",
    "feedback.form.source": "Source",
    "feedback.form.date": "Date",
    "feedback.form.sourcePlaceholder": "e.g., Email, Phone, Survey",
    "feedback.form.textPlaceholder": "Enter customer feedback here...",
    "feedback.form.submit": "Submit Feedback",
    "feedback.form.submitting": "Submitting...",
    "feedback.form.success": "Feedback submitted successfully!",
    "feedback.tips.title": "Tips for Quality Feedback",
    "feedback.tips.description":
      "Follow these guidelines to get the most accurate sentiment analysis",
    "feedback.tips.specific.title": "Be Specific",
    "feedback.tips.specific.description":
      "Include specific details about the product, service, or experience to get better theme categorization.",
    "feedback.tips.context.title": "Include Context",
    "feedback.tips.context.description":
      "Mention when and where the feedback is from to help with trend analysis.",
    "feedback.tips.natural.title": "Use Natural Language",
    "feedback.tips.natural.description":
      "Write feedback as it would naturally be given for the most accurate sentiment scoring.",
    "feedback.import.title": "Import Feedback from CSV",
    "feedback.import.description":
      "Upload a CSV file containing customer feedback data",
    "feedback.recent.title": "Recent Feedback",
    "feedback.table.feedback": "Feedback",
    "feedback.table.source": "Source",
    "feedback.table.date": "Date",
    "feedback.table.sentiment": "Sentiment",
    "feedback.filter.allSources": "All Sources",
    "feedback.filter.manualEntry": "Manual Entry",
    "feedback.filter.csvImport": "CSV Import",
    "feedback.filter.api": "API",
    "feedback.filter.allSentiment": "All Sentiment",
    "feedback.filter.positive": "Positive",
    "feedback.filter.neutral": "Neutral",
    "feedback.filter.negative": "Negative",

    // CSV Upload
    "csv.dropzone": "Drag & drop a CSV file here",
    "csv.dropActive": "Drop the CSV file here",
    "csv.selectFile": "Select CSV File",
    "csv.uploading": "Uploading...",
    "csv.requirements": "CSV Format Requirements:",
    "csv.req.textContent":
      "Must include a text_content column with feedback text",
    "csv.req.source": "Optional source column for feedback source",
    "csv.req.date": "Optional feedback_date column in ISO format (YYYY-MM-DD)",

    // Landing Page
    "landing.hero.title": "AI-Powered Customer Sentiment Analysis",
    "landing.hero.description":
      "Understand what your customers are really saying. Famalytics analyzes feedback across all channels to help you make data-driven decisions.",
    "landing.hero.getStarted": "Get Started Free",
    "landing.hero.viewPricing": "View Pricing",
    "landing.hero.feature1": "Multi-channel analysis",
    "landing.hero.feature2": "Real-time sentiment tracking",
    "landing.hero.feature3": "Customizable alerts",
    "landing.features.title": "Comprehensive Sentiment Analysis",
    "landing.features.description":
      "Famalytics helps businesses monitor, analyze, and respond to customer feedback across multiple channels using advanced AI technology.",
    "landing.howItWorks.title": "How Famalytics Works",
    "landing.howItWorks.description":
      "Our platform makes it easy to understand what your customers are really saying",
    "landing.howItWorks.step1.title": "1. Import Your Data",
    "landing.howItWorks.step1.description":
      "Upload customer feedback from multiple sources or connect via API",
    "landing.howItWorks.step2.title": "2. AI Analysis",
    "landing.howItWorks.step2.description":
      "Our AI automatically scores sentiment and identifies key themes",
    "landing.howItWorks.step3.title": "3. Actionable Insights",
    "landing.howItWorks.step3.description":
      "View trends, set alerts, and export reports to improve customer satisfaction",
    "landing.stats.faster": "Faster Insight Discovery",
    "landing.stats.satisfaction": "Customer Satisfaction Improvement",
    "landing.stats.monitoring": "Sentiment Monitoring",
    "landing.useCases.title": "Who Benefits from Famalytics",
    "landing.useCases.description":
      "Our platform is designed for businesses that value customer feedback",
    "landing.useCases.support.title": "Customer Support Teams",
    "landing.useCases.support.description":
      "Identify recurring issues and track sentiment trends across support channels",
    "landing.useCases.support.benefit1":
      "Reduce response time to negative feedback",
    "landing.useCases.support.benefit2":
      "Prioritize issues based on sentiment impact",
    "landing.useCases.product.title": "Product Teams",
    "landing.useCases.product.description":
      "Understand how customers feel about specific product features",
    "landing.useCases.product.benefit1":
      "Extract feature-specific feedback automatically",
    "landing.useCases.product.benefit2":
      "Track sentiment changes after product updates",
    "landing.cta.title": "Ready to Understand Your Customers Better?",
    "landing.cta.description":
      "Start analyzing customer sentiment across all your channels today.",
    "landing.cta.button": "Get Started Free",

    // Charts
    "chart.sentiment.title": "Sentiment Trends",
    "chart.sentiment.description":
      "Track sentiment changes over time across all feedback channels",
    "chart.themes.title": "Theme Distribution",
    "chart.themes.description": "Breakdown of feedback by theme categories",
    "chart.themeTrends.title": "Theme Trends",
    "chart.themeTrends.description": "How themes have evolved over time",
    "chart.keywords.title": "Keyword Cloud",
    "chart.keywords.description": "Most common keywords in your feedback",
    "chart.sentimentBySource.title": "Sentiment by Source",
    "chart.sentimentByTheme.title": "Sentiment by Theme",
    "chart.noData": "No theme data available",

    // Analytics
    "analytics.title": "Website Analytics",
    "analytics.description":
      "Monitor website traffic and user engagement metrics",
    "analytics.realTimeUsers": "Real-time Active Users",
    "analytics.updatedEveryMinute": "Updated every minute",
    "analytics.totalSessions": "Total Sessions",
    "analytics.totalUsers": "Total Users",
    "analytics.pageViews": "Page Views",
    "analytics.avgSessionDuration": "Avg. Session Duration",
    "analytics.bounceRate": "Bounce Rate",
    "analytics.dailyMetrics": "Daily Engagement Metrics",
    "analytics.dailyDescription":
      "Detailed daily breakdown of website traffic and engagement",
    "analytics.loading": "Loading analytics data...",
    "analytics.error": "Error loading analytics data",
    "analytics.checkConfig":
      "Please check your Google Analytics configuration.",
    "analytics.date": "Date",
    "analytics.sessions": "Sessions",
    "analytics.users": "Users",
    "analytics.duration": "Avg. Duration",
    "analytics.7days": "7 Days",
    "analytics.30days": "30 Days",
    "analytics.90days": "90 Days",
    "analytics.nav": "Analytics",
    "analytics.configError": "Google Analytics Property ID is not configured",
    "analytics.fetchError": "Failed to fetch analytics data",
    "analytics.realtimeError": "Failed to fetch real-time data",
    "analytics.unknownError": "An unknown error occurred",
    "analytics.unauthorized": "Unauthorized",
    "analytics.apiError": "Error in analytics API",
    "analytics.noData": "No analytics data available",
    "analytics.apiSuccess": "Analytics data fetched successfully",
    "analytics.apiRealtimeSuccess":
      "Real-time analytics data fetched successfully",
    "analytics.apiHistoricalSuccess":
      "Historical analytics data fetched successfully",
    "analytics.apiHistoricalError": "Failed to fetch historical analytics data",
    "analytics.apiRealtimeError": "Failed to fetch real-time analytics data",
    "analytics.apiConfigError": "Google Analytics configuration error",
    "analytics.apiAuthError": "Google Analytics authentication error",
    "analytics.apiPermissionError": "Google Analytics permission error",
    "analytics.apiRateLimitError": "Google Analytics rate limit exceeded",
    "analytics.apiInvalidRequestError":
      "Invalid request to Google Analytics API",
    "analytics.apiServerError": "Google Analytics server error",
    "analytics.apiNetworkError": "Network error while fetching analytics data",
    "analytics.apiTimeoutError": "Timeout while fetching analytics data",
    "analytics.apiUnknownError": "Unknown error while fetching analytics data",
    "analytics.apiMissingPropertyId": "Google Analytics Property ID is missing",
    "analytics.apiMissingCredentials":
      "Google Analytics credentials are missing",
    "analytics.apiInvalidCredentials":
      "Google Analytics credentials are invalid",
    "analytics.apiInvalidPropertyId": "Google Analytics Property ID is invalid",
    "analytics.apiInvalidDateRange":
      "Invalid date range for Google Analytics API",
    "analytics.apiInvalidMetrics": "Invalid metrics for Google Analytics API",
    "analytics.apiInvalidDimensions":
      "Invalid dimensions for Google Analytics API",
    "analytics.apiInvalidParameters":
      "Invalid parameters for Google Analytics API",
    "analytics.apiMissingParameters":
      "Missing parameters for Google Analytics API",

    // Theme names
    "theme.productQuality": "Product Quality",
    "theme.customerService": "Customer Service",
    "theme.delivery": "Delivery",
    "theme.website": "Website/App",
    "theme.pricing": "Pricing",

    // Settings
    "settings.appearance": "Appearance",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.theme.system": "System",
    "settings.language": "Language",
  },

  // Spanish translations
  es: {
    // Common
    "app.name": "Famalytics",
    "app.tagline": "Análisis de Sentimiento de Clientes Impulsado por IA",
    "app.description":
      "Monitorea, analiza y responde a los comentarios de los clientes en múltiples canales utilizando tecnología avanzada de IA.",

    // Navigation
    "nav.features": "Características",
    "nav.howItWorks": "Cómo Funciona",
    "nav.pricing": "Precios",
    "nav.dashboard": "Panel",
    "nav.signIn": "Iniciar Sesión",
    "nav.signUp": "Registrarse",
    "nav.signOut": "Cerrar Sesión",

    // Auth
    "auth.signIn": "Iniciar sesión",
    "auth.signUp": "Registrarse",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.forgotPassword": "¿Olvidó su contraseña?",
    "auth.resetPassword": "Restablecer contraseña",
    "auth.noAccount": "¿No tiene una cuenta?",
    "auth.haveAccount": "¿Ya tiene una cuenta?",
    "auth.sendResetLink": "Enviar enlace de restablecimiento",

    // Dashboard
    "dashboard.title": "Panel",
    "dashboard.overview":
      "Resumen de tendencias de sentimiento y comentarios de clientes",
    "dashboard.dateRange": "Últimos 7 días",
    "dashboard.totalFeedback": "Total de Comentarios",
    "dashboard.positiveSentiment": "Sentimiento Positivo",
    "dashboard.negativeSentiment": "Sentimiento Negativo",
    "dashboard.activeAlerts": "Alertas Activas",
    "dashboard.highPriority": "alta prioridad",
    "dashboard.tabs.overview": "Resumen",
    "dashboard.tabs.sentiment": "Análisis de Sentimiento",
    "dashboard.tabs.themes": "Análisis de Temas",
    "dashboard.recentAlerts": "Alertas Recientes",
    "dashboard.alertsDescription":
      "Notificaciones basadas en sus configuraciones de alerta",

    // Add more Spanish translations as needed
  },

  // French translations
  fr: {
    // Common
    "app.name": "Famalytics",
    "app.tagline": "Analyse de Sentiment Client Alimentée par l'IA",
    "app.description":
      "Surveillez, analysez et répondez aux commentaires des clients sur plusieurs canaux grâce à une technologie d'IA avancée.",

    // Navigation
    "nav.features": "Fonctionnalités",
    "nav.howItWorks": "Comment ça Marche",
    "nav.pricing": "Tarifs",
    "nav.dashboard": "Tableau de Bord",
    "nav.signIn": "Se Connecter",
    "nav.signUp": "S'inscrire",
    "nav.signOut": "Se Déconnecter",

    // Auth
    "auth.signIn": "Se connecter",
    "auth.signUp": "S'inscrire",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "auth.resetPassword": "Réinitialiser le mot de passe",
    "auth.noAccount": "Vous n'avez pas de compte ?",
    "auth.haveAccount": "Vous avez déjà un compte ?",
    "auth.sendResetLink": "Envoyer le lien de réinitialisation",

    // Dashboard
    "dashboard.title": "Tableau de Bord",
    "dashboard.overview":
      "Aperçu des tendances de sentiment et de feedback client",
    "dashboard.dateRange": "7 derniers jours",
    "dashboard.totalFeedback": "Total des Commentaires",
    "dashboard.positiveSentiment": "Sentiment Positif",
    "dashboard.negativeSentiment": "Sentiment Négatif",
    "dashboard.activeAlerts": "Alertes Actives",
    "dashboard.highPriority": "haute priorité",
    "dashboard.tabs.overview": "Vue d'ensemble",
    "dashboard.tabs.sentiment": "Analyse de Sentiment",
    "dashboard.tabs.themes": "Analyse Thématique",
    "dashboard.recentAlerts": "Alertes Récentes",
    "dashboard.alertsDescription":
      "Notifications basées sur vos configurations d'alerte",

    // Add more French translations as needed
  },

  // German translations
  de: {
    // Common
    "app.name": "Famalytics",
    "app.tagline": "KI-gestützte Kundenstimmungsanalyse",
    "app.description":
      "Überwachen, analysieren und reagieren Sie auf Kundenfeedback über mehrere Kanäle mit Hilfe fortschrittlicher KI-Technologie.",

    // Navigation
    "nav.features": "Funktionen",
    "nav.howItWorks": "Wie es Funktioniert",
    "nav.pricing": "Preise",
    "nav.dashboard": "Dashboard",
    "nav.signIn": "Anmelden",
    "nav.signUp": "Registrieren",
    "nav.signOut": "Abmelden",

    // Auth
    "auth.signIn": "Anmelden",
    "auth.signUp": "Registrieren",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.resetPassword": "Passwort zurücksetzen",
    "auth.noAccount": "Haben Sie kein Konto?",
    "auth.haveAccount": "Haben Sie bereits ein Konto?",
    "auth.sendResetLink": "Link zum Zurücksetzen senden",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Überblick über Kundenstimmungs- und Feedback-Trends",
    "dashboard.dateRange": "Letzte 7 Tage",
    "dashboard.totalFeedback": "Gesamtes Feedback",
    "dashboard.positiveSentiment": "Positive Stimmung",
    "dashboard.negativeSentiment": "Negative Stimmung",
    "dashboard.activeAlerts": "Aktive Warnungen",
    "dashboard.highPriority": "hohe Priorität",
    "dashboard.tabs.overview": "Überblick",
    "dashboard.tabs.sentiment": "Stimmungsanalyse",
    "dashboard.tabs.themes": "Themenanalyse",
    "dashboard.recentAlerts": "Aktuelle Warnungen",
    "dashboard.alertsDescription":
      "Benachrichtigungen basierend auf Ihren Warnungskonfigurationen",

    // Add more German translations as needed
  },

  // Japanese translations
  ja: {
    // Common
    "app.name": "Famalytics",
    "app.tagline": "AI搭載の顧客感情分析",
    "app.description":
      "高度なAI技術を使用して、複数のチャネルにわたる顧客フィードバックを監視、分析、対応します。",

    // Navigation
    "nav.features": "機能",
    "nav.howItWorks": "仕組み",
    "nav.pricing": "料金",
    "nav.dashboard": "ダッシュボード",
    "nav.signIn": "ログイン",
    "nav.signUp": "登録",
    "nav.signOut": "ログアウト",

    // Auth
    "auth.signIn": "ログイン",
    "auth.signUp": "登録",
    "auth.email": "メール",
    "auth.password": "パスワード",
    "auth.forgotPassword": "パスワードをお忘れですか？",
    "auth.resetPassword": "パスワードのリセット",
    "auth.noAccount": "アカウントをお持ちでないですか？",
    "auth.haveAccount": "すでにアカウントをお持ちですか？",
    "auth.sendResetLink": "リセットリンクを送信",

    // Dashboard
    "dashboard.title": "ダッシュボード",
    "dashboard.overview": "顧客の感情とフィードバックの傾向の概要",
    "dashboard.dateRange": "過去7日間",
    "dashboard.totalFeedback": "フィードバック総数",
    "dashboard.positiveSentiment": "ポジティブな感情",
    "dashboard.negativeSentiment": "ネガティブな感情",
    "dashboard.activeAlerts": "有効なアラート",
    "dashboard.highPriority": "高優先度",
    "dashboard.tabs.overview": "概要",
    "dashboard.tabs.sentiment": "感情分析",
    "dashboard.tabs.themes": "テーマ分析",
    "dashboard.recentAlerts": "最近のアラート",
    "dashboard.alertsDescription": "アラート設定に基づく通知",

    // Add more Japanese translations as needed
  },
};

/**
 * Set the current language for the application
 * @param language The language code to set
 */
export function setLanguage(language: Language): void {
  if (content[language]) {
    currentLanguage = language;
  } else {
    console.warn(`Language ${language} not supported, defaulting to English`);
    currentLanguage = "en";
  }
}

/**
 * Get the current language
 * @returns The current language code
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Get text content for the given key in the current language
 * @param key The content key
 * @param fallback Optional fallback text if the key is not found
 * @returns The localized text
 */
export function t(key: ContentKey, fallback?: string): string {
  const text = content[currentLanguage][key];
  if (!text) {
    // Try to get the English version as fallback
    const englishText = content["en"][key];
    if (englishText) return englishText;

    // If no English version, return the fallback or the key itself
    return fallback || key;
  }
  return text;
}

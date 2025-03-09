// This file contains all text content used in the application
// It can be extended to support multiple languages

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
    "analytics.apiInvalidResponse":
      "Invalid response from Google Analytics API",
    "analytics.apiEmptyResponse": "Empty response from Google Analytics API",
    "analytics.apiParsingError": "Error parsing Google Analytics API response",
    "analytics.apiProcessingError":
      "Error processing Google Analytics API response",
    "analytics.apiFormatError":
      "Error formatting Google Analytics API response",
    "analytics.apiValidationError":
      "Error validating Google Analytics API response",
    "analytics.apiTransformationError":
      "Error transforming Google Analytics API response",
    "analytics.apiMappingError": "Error mapping Google Analytics API response",
    "analytics.apiConversionError":
      "Error converting Google Analytics API response",
    "analytics.apiNormalizationError":
      "Error normalizing Google Analytics API response",
    "analytics.apiAggregationError":
      "Error aggregating Google Analytics API response",
    "analytics.apiCalculationError":
      "Error calculating Google Analytics API response",
    "analytics.apiSummaryError":
      "Error summarizing Google Analytics API response",
    "analytics.apiVisualizationError":
      "Error visualizing Google Analytics API response",
    "analytics.apiRenderingError":
      "Error rendering Google Analytics API response",
    "analytics.apiDisplayError":
      "Error displaying Google Analytics API response",
    "analytics.apiPresentationError":
      "Error presenting Google Analytics API response",
    "analytics.apiExportError": "Error exporting Google Analytics API response",
    "analytics.apiImportError": "Error importing Google Analytics API response",
    "analytics.apiSaveError": "Error saving Google Analytics API response",
    "analytics.apiLoadError": "Error loading Google Analytics API response",
    "analytics.apiStoreError": "Error storing Google Analytics API response",
    "analytics.apiRetrieveError":
      "Error retrieving Google Analytics API response",
    "analytics.apiFetchError": "Error fetching Google Analytics API response",
    "analytics.apiQueryError": "Error querying Google Analytics API response",
    "analytics.apiRequestError":
      "Error requesting Google Analytics API response",
    "analytics.apiResponseError": "Error in Google Analytics API response",
    "analytics.apiConnectionError": "Error connecting to Google Analytics API",
    "analytics.apiDisconnectionError":
      "Error disconnecting from Google Analytics API",
    "analytics.apiAuthenticationError":
      "Error authenticating with Google Analytics API",
    "analytics.apiAuthorizationError":
      "Error authorizing with Google Analytics API",
    "analytics.apiAccessError": "Error accessing Google Analytics API",
    "analytics.apiPermissionDeniedError":
      "Permission denied for Google Analytics API",
    "analytics.apiAccessDeniedError": "Access denied for Google Analytics API",
    "analytics.apiUnauthorizedError": "Unauthorized for Google Analytics API",
    "analytics.apiForbiddenError": "Forbidden for Google Analytics API",
    "analytics.apiNotFoundError": "Not found for Google Analytics API",
    "analytics.apiMethodNotAllowedError":
      "Method not allowed for Google Analytics API",
    "analytics.apiNotAcceptableError":
      "Not acceptable for Google Analytics API",
    "analytics.apiRequestTimeoutError":
      "Request timeout for Google Analytics API",
    "analytics.apiConflictError": "Conflict for Google Analytics API",
    "analytics.apiGoneError": "Gone for Google Analytics API",
    "analytics.apiLengthRequiredError":
      "Length required for Google Analytics API",
    "analytics.apiPreconditionFailedError":
      "Precondition failed for Google Analytics API",
    "analytics.apiPayloadTooLargeError":
      "Payload too large for Google Analytics API",
    "analytics.apiURITooLongError": "URI too long for Google Analytics API",
    "analytics.apiUnsupportedMediaTypeError":
      "Unsupported media type for Google Analytics API",
    "analytics.apiRangeNotSatisfiableError":
      "Range not satisfiable for Google Analytics API",
    "analytics.apiExpectationFailedError":
      "Expectation failed for Google Analytics API",
    "analytics.apiImATeapotError": "I'm a teapot for Google Analytics API",
    "analytics.apiMisdirectedRequestError":
      "Misdirected request for Google Analytics API",
    "analytics.apiUnprocessableEntityError":
      "Unprocessable entity for Google Analytics API",
    "analytics.apiLockedError": "Locked for Google Analytics API",
    "analytics.apiFailedDependencyError":
      "Failed dependency for Google Analytics API",
    "analytics.apiTooEarlyError": "Too early for Google Analytics API",
    "analytics.apiUpgradeRequiredError":
      "Upgrade required for Google Analytics API",
    "analytics.apiPreconditionRequiredError":
      "Precondition required for Google Analytics API",
    "analytics.apiTooManyRequestsError":
      "Too many requests for Google Analytics API",
    "analytics.apiRequestHeaderFieldsTooLargeError":
      "Request header fields too large for Google Analytics API",
    "analytics.apiUnavailableForLegalReasonsError":
      "Unavailable for legal reasons for Google Analytics API",
    "analytics.apiInternalServerError":
      "Internal server error for Google Analytics API",
    "analytics.apiNotImplementedError":
      "Not implemented for Google Analytics API",
    "analytics.apiBadGatewayError": "Bad gateway for Google Analytics API",
    "analytics.apiServiceUnavailableError":
      "Service unavailable for Google Analytics API",
    "analytics.apiGatewayTimeoutError":
      "Gateway timeout for Google Analytics API",
    "analytics.apiHTTPVersionNotSupportedError":
      "HTTP version not supported for Google Analytics API",
    "analytics.apiVariantAlsoNegotiatesError":
      "Variant also negotiates for Google Analytics API",
    "analytics.apiInsufficientStorageError":
      "Insufficient storage for Google Analytics API",
    "analytics.apiLoopDetectedError": "Loop detected for Google Analytics API",
    "analytics.apiNotExtendedError": "Not extended for Google Analytics API",
    "analytics.apiNetworkAuthenticationRequiredError":
      "Network authentication required for Google Analytics API",
    "analytics.apiNetworkConnectTimeoutError":
      "Network connect timeout for Google Analytics API",
    "analytics.apiNetworkReadTimeoutError":
      "Network read timeout for Google Analytics API",
    "analytics.apiNetworkWriteTimeoutError":
      "Network write timeout for Google Analytics API",
    "analytics.apiNetworkClosedError":
      "Network closed for Google Analytics API",
    "analytics.apiNetworkConnectError":
      "Network connect error for Google Analytics API",
    "analytics.apiNetworkReadError":
      "Network read error for Google Analytics API",
    "analytics.apiNetworkWriteError":
      "Network write error for Google Analytics API",
    "analytics.apiNetworkError": "Network error for Google Analytics API",
    "analytics.apiNetworkTimeoutError":
      "Network timeout for Google Analytics API",
    "analytics.apiNetworkConnectionError":
      "Network connection error for Google Analytics API",
    "analytics.apiNetworkConnectionTimeoutError":
      "Network connection timeout for Google Analytics API",
    "analytics.apiNetworkConnectionRefusedError":
      "Network connection refused for Google Analytics API",
    "analytics.apiNetworkConnectionResetError":
      "Network connection reset for Google Analytics API",
    "analytics.apiNetworkConnectionAbortedError":
      "Network connection aborted for Google Analytics API",
    "analytics.apiNetworkConnectionClosedError":
      "Network connection closed for Google Analytics API",
    "analytics.apiNetworkConnectionTimedOutError":
      "Network connection timed out for Google Analytics API",
    "analytics.apiNetworkConnectionFailedError":
      "Network connection failed for Google Analytics API",
    "analytics.apiNetworkConnectionLostError":
      "Network connection lost for Google Analytics API",
    "analytics.apiNetworkConnectionBrokenError":
      "Network connection broken for Google Analytics API",
    "analytics.apiNetworkConnectionInterruptedError":
      "Network connection interrupted for Google Analytics API",
    "analytics.apiNetworkConnectionTerminatedError":
      "Network connection terminated for Google Analytics API",
    "analytics.apiNetworkConnectionDroppedError":
      "Network connection dropped for Google Analytics API",
    "analytics.apiNetworkConnectionFailureError":
      "Network connection failure for Google Analytics API",
    "analytics.apiNetworkConnectionErrorError":
      "Network connection error for Google Analytics API",
    "analytics.apiNetworkConnectionProblemError":
      "Network connection problem for Google Analytics API",
    "analytics.apiNetworkConnectionIssueError":
      "Network connection issue for Google Analytics API",
    "analytics.apiNetworkConnectionTroubleError":
      "Network connection trouble for Google Analytics API",
    "analytics.apiNetworkConnectionDifficultyError":
      "Network connection difficulty for Google Analytics API",
    "analytics.apiNetworkConnectionChallengeError":
      "Network connection challenge for Google Analytics API",
    "analytics.apiNetworkConnectionObstacleError":
      "Network connection obstacle for Google Analytics API",
    "analytics.apiNetworkConnectionBarrierError":
      "Network connection barrier for Google Analytics API",
    "analytics.apiNetworkConnectionHurdleError":
      "Network connection hurdle for Google Analytics API",
    "analytics.apiNetworkConnectionImpedimentError":
      "Network connection impediment for Google Analytics API",
    "analytics.apiNetworkConnectionHindranceError":
      "Network connection hindrance for Google Analytics API",
    "analytics.apiNetworkConnectionBlockageError":
      "Network connection blockage for Google Analytics API",
    "analytics.apiNetworkConnectionBlockError":
      "Network connection block for Google Analytics API",
    "analytics.apiNetworkConnectionObstructionError":
      "Network connection obstruction for Google Analytics API",
    "analytics.apiNetworkConnectionInterferenceError":
      "Network connection interference for Google Analytics API",
    "analytics.apiNetworkConnectionDisruptionError":
      "Network connection disruption for Google Analytics API",
    "analytics.apiNetworkConnectionDisturbanceError":
      "Network connection disturbance for Google Analytics API",
    "analytics.apiNetworkConnectionInterruptionError":
      "Network connection interruption for Google Analytics API",
    "analytics.apiNetworkConnectionBreakError":
      "Network connection break for Google Analytics API",
    "analytics.apiNetworkConnectionSeveranceError":
      "Network connection severance for Google Analytics API",
    "analytics.apiNetworkConnectionCutError":
      "Network connection cut for Google Analytics API",
    "analytics.apiNetworkConnectionDisconnectionError":
      "Network connection disconnection for Google Analytics API",
    "analytics.apiNetworkConnectionSeparationError":
      "Network connection separation for Google Analytics API",
    "analytics.apiNetworkConnectionDetachmentError":
      "Network connection detachment for Google Analytics API",
    "analytics.apiNetworkConnectionDislocationError":
      "Network connection dislocation for Google Analytics API",
    "analytics.apiNetworkConnectionDisjunctionError":
      "Network connection disjunction for Google Analytics API",
    "analytics.apiNetworkConnectionDisunionError":
      "Network connection disunion for Google Analytics API",
    "analytics.apiNetworkConnectionDisassociationError":
      "Network connection disassociation for Google Analytics API",
    "analytics.apiNetworkConnectionDisengagementError":
      "Network connection disengagement for Google Analytics API",
    "analytics.apiNetworkConnectionDisconnectError":
      "Network connection disconnect for Google Analytics API",
    "analytics.apiNetworkConnectionDisconnectedError":
      "Network connection disconnected for Google Analytics API",
    "analytics.apiNetworkConnectionLostConnectionError":
      "Network connection lost connection for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectionError":
      "Network connection no connection for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectivityError":
      "Network connection no connectivity for Google Analytics API",
    "analytics.apiNetworkConnectionNoInternetError":
      "Network connection no internet for Google Analytics API",
    "analytics.apiNetworkConnectionNoNetworkError":
      "Network connection no network for Google Analytics API",
    "analytics.apiNetworkConnectionNoSignalError":
      "Network connection no signal for Google Analytics API",
    "analytics.apiNetworkConnectionNoServiceError":
      "Network connection no service for Google Analytics API",
    "analytics.apiNetworkConnectionNoCoverageError":
      "Network connection no coverage for Google Analytics API",
    "analytics.apiNetworkConnectionNoReceptionError":
      "Network connection no reception for Google Analytics API",
    "analytics.apiNetworkConnectionNoTransmissionError":
      "Network connection no transmission for Google Analytics API",
    "analytics.apiNetworkConnectionNoDataError":
      "Network connection no data for Google Analytics API",
    "analytics.apiNetworkConnectionNoPacketsError":
      "Network connection no packets for Google Analytics API",
    "analytics.apiNetworkConnectionNoTrafficError":
      "Network connection no traffic for Google Analytics API",
    "analytics.apiNetworkConnectionNoFlowError":
      "Network connection no flow for Google Analytics API",
    "analytics.apiNetworkConnectionNoStreamError":
      "Network connection no stream for Google Analytics API",
    "analytics.apiNetworkConnectionNoTransferError":
      "Network connection no transfer for Google Analytics API",
    "analytics.apiNetworkConnectionNoTransmitError":
      "Network connection no transmit for Google Analytics API",
    "analytics.apiNetworkConnectionNoReceiveError":
      "Network connection no receive for Google Analytics API",
    "analytics.apiNetworkConnectionNoSendError":
      "Network connection no send for Google Analytics API",
    "analytics.apiNetworkConnectionNoGetError":
      "Network connection no get for Google Analytics API",
    "analytics.apiNetworkConnectionNoPutError":
      "Network connection no put for Google Analytics API",
    "analytics.apiNetworkConnectionNoPostError":
      "Network connection no post for Google Analytics API",
    "analytics.apiNetworkConnectionNoDeleteError":
      "Network connection no delete for Google Analytics API",
    "analytics.apiNetworkConnectionNoPatchError":
      "Network connection no patch for Google Analytics API",
    "analytics.apiNetworkConnectionNoHeadError":
      "Network connection no head for Google Analytics API",
    "analytics.apiNetworkConnectionNoOptionsError":
      "Network connection no options for Google Analytics API",
    "analytics.apiNetworkConnectionNoTraceError":
      "Network connection no trace for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectError":
      "Network connection no connect for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectError":
      "Network connection no disconnect for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenError":
      "Network connection no open for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseError":
      "Network connection no close for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadError":
      "Network connection no read for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteError":
      "Network connection no write for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenError":
      "Network connection no listen for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptError":
      "Network connection no accept for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindError":
      "Network connection no bind for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindError":
      "Network connection no unbind for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToError":
      "Network connection no connect to for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromError":
      "Network connection no disconnect from for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToError":
      "Network connection no open to for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromError":
      "Network connection no close from for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromError":
      "Network connection no read from for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToError":
      "Network connection no write to for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnError":
      "Network connection no listen on for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromError":
      "Network connection no accept from for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToError":
      "Network connection no bind to for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromError":
      "Network connection no unbind from for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostError":
      "Network connection no connect to host for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostError":
      "Network connection no disconnect from host for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostError":
      "Network connection no open to host for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostError":
      "Network connection no close from host for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostError":
      "Network connection no read from host for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostError":
      "Network connection no write to host for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnPortError":
      "Network connection no listen on port for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostError":
      "Network connection no accept from host for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToPortError":
      "Network connection no bind to port for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromPortError":
      "Network connection no unbind from port for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortError":
      "Network connection no connect to host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortError":
      "Network connection no disconnect from host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortError":
      "Network connection no open to host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortError":
      "Network connection no close from host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortError":
      "Network connection no read from host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortError":
      "Network connection no write to host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortError":
      "Network connection no listen on host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortError":
      "Network connection no accept from host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortError":
      "Network connection no bind to host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortError":
      "Network connection no unbind from host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathError":
      "Network connection no connect to host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathError":
      "Network connection no disconnect from host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathError":
      "Network connection no open to host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathError":
      "Network connection no close from host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathError":
      "Network connection no read from host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathError":
      "Network connection no write to host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathError":
      "Network connection no listen on host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathError":
      "Network connection no accept from host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathError":
      "Network connection no bind to host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathError":
      "Network connection no unbind from host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryError":
      "Network connection no connect to host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryError":
      "Network connection no disconnect from host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryError":
      "Network connection no open to host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryError":
      "Network connection no close from host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryError":
      "Network connection no read from host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryError":
      "Network connection no write to host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryError":
      "Network connection no listen on host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryError":
      "Network connection no accept from host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryError":
      "Network connection no bind to host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryError":
      "Network connection no unbind from host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentError":
      "Network connection no connect to host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentError":
      "Network connection no disconnect from host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentError":
      "Network connection no open to host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentError":
      "Network connection no close from host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentError":
      "Network connection no read from host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentError":
      "Network connection no write to host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentError":
      "Network connection no listen on host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentError":
      "Network connection no accept from host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentError":
      "Network connection no bind to host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentError":
      "Network connection no unbind from host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserError":
      "Network connection no connect to host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserError":
      "Network connection no disconnect from host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserError":
      "Network connection no open to host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserError":
      "Network connection no close from host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserError":
      "Network connection no read from host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserError":
      "Network connection no write to host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserError":
      "Network connection no listen on host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserError":
      "Network connection no accept from host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserError":
      "Network connection no bind to host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserError":
      "Network connection no unbind from host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordError":
      "Network connection no connect to host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordError":
      "Network connection no disconnect from host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordError":
      "Network connection no open to host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordError":
      "Network connection no close from host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordError":
      "Network connection no read from host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordError":
      "Network connection no write to host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordError":
      "Network connection no listen on host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordError":
      "Network connection no accept from host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordError":
      "Network connection no bind to host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordError":
      "Network connection no unbind from host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no connect to host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no disconnect from host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no open to host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no close from host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no read from host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no write to host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no listen on host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no accept from host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no bind to host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no unbind from host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no connect to host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no disconnect from host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no open to host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no close from host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no read from host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no write to host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no listen on host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no accept from host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no bind to host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no unbind from host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no connect to host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no disconnect from host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no open to host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no close from host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no read from host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no write to host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no listen on host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no accept from host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no bind to host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no unbind from host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no connect to host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no open to host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no close from host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no read from host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no write to host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no listen on host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no accept from host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no bind to host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no unbind from host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no connect to host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no open to host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no close from host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no read from host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no write to host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no listen on host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no accept from host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no bind to host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user password for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user password scheme for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user password scheme host for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user password scheme host port for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user password scheme host port path for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user password scheme host port path query for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoUnbindFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentError":
      "Network connection no unbind from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment for Google Analytics API",
    "analytics.apiNetworkConnectionNoConnectToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no connect to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoDisconnectFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no disconnect from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoOpenToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no open to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoCloseFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no close from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoReadFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no read from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoWriteToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no write to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoListenOnHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no listen on host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoAcceptFromHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no accept from host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",
    "analytics.apiNetworkConnectionNoBindToHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserPasswordSchemeHostPortPathQueryFragmentUserError":
      "Network connection no bind to host port path query fragment user password scheme host port path query fragment user password scheme host port path query fragment user for Google Analytics API",

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
    "app.name": "Famalytics",
    "app.tagline": "Análisis de Sentimiento de Clientes Impulsado por IA",
    // Add more Spanish translations as needed
  },

  // French translations
  fr: {
    "app.name": "Famalytics",
    "app.tagline": "Analyse de Sentiment Client Alimentée par l'IA",
    // Add more French translations as needed
  },

  // German translations
  de: {
    "app.name": "Famalytics",
    "app.tagline": "KI-gestützte Kundenstimmungsanalyse",
    // Add more German translations as needed
  },

  // Japanese translations
  ja: {
    "app.name": "Famalytics",
    "app.tagline": "AI搭載の顧客感情分析",
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

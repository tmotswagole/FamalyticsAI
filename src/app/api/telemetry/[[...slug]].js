import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { maskSensitiveData } from "@/lib/security";

// Initialize Sentry if not already done
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
  });
}

/**
 * Polymorphic API endpoint for sending telemetry data to Sentry
 * Routes:
 * - /api/telemetry/error - Application errors
 * - /api/telemetry/api - API interaction logs
 * - /api/telemetry/auth - Authentication events
 * - /api/telemetry/feedback - Sentiment analysis events
 * - /api/telemetry/subscription - Subscription-related events
 * - /api/telemetry/performance - Performance metrics
 */
export async function POST(request, { params }) {
  try {
    const eventType = params?.slug?.[0] || "error";
    const body = await request.json();

    // Extract common metadata
    const { source, timestamp = new Date().toISOString() } = body;
    const metadata = {
      source,
      timestamp,
      environment: process.env.NODE_ENV,
    };

    switch (eventType) {
      case "error":
        return await handleErrorEvent(body, metadata);
      case "api":
        return await handleApiEvent(body, metadata);
      case "auth":
        return await handleAuthEvent(body, metadata);
      case "feedback":
        return await handleFeedbackEvent(body, metadata);
      case "subscription":
        return await handleSubscriptionEvent(body, metadata);
      case "performance":
        return await handlePerformanceEvent(body, metadata);
      default:
        return NextResponse.json(
          { error: `Unknown event type: ${eventType}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in telemetry endpoint:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to process telemetry data" },
      { status: 500 }
    );
  }
}

/**
 * Handle application errors
 */
async function handleErrorEvent(data, metadata) {
  const { message, stack, context = {}, user = {} } = data;

  // Mask any potentially sensitive data in the error context
  const sanitizedContext = maskSensitiveData(context);
  const sanitizedUser = maskUserData(user);

  Sentry.captureException(new Error(message), {
    tags: {
      errorType: context.type || "unknown",
      component: context.component || "unknown",
      ...metadata,
    },
    extra: {
      ...sanitizedContext,
      stack,
    },
    user: sanitizedUser,
  });

  return NextResponse.json({ success: true });
}

/**
 * Handle API call events
 */
async function handleApiEvent(data, metadata) {
  const {
    endpoint,
    method,
    statusCode,
    duration,
    request = {},
    response = {},
    error = null,
  } = data;

  // Mask sensitive data in request and response
  const sanitizedRequest = maskSensitiveData(request);
  const sanitizedResponse = maskSensitiveData(response);

  // Create a transaction for API calls
  const transaction = Sentry.startTransaction({
    name: `${method} ${endpoint}`,
    op: "http.client",
  });

  transaction.setData("request", sanitizedRequest);
  transaction.setData("response", sanitizedResponse);
  transaction.setData("statusCode", statusCode);
  transaction.setData("duration", duration);

  if (error) {
    transaction.setStatus("internal_error");
    transaction.setData("error", error);
  } else if (statusCode >= 400) {
    transaction.setStatus("failed");
  } else {
    transaction.setStatus("ok");
  }

  transaction.setTag("endpoint", endpoint);
  transaction.setTag("method", method);
  transaction.setTag("status", statusCode);
  Object.entries(metadata).forEach(([key, value]) => {
    transaction.setTag(key, value);
  });

  transaction.finish();

  return NextResponse.json({ success: true });
}

/**
 * Handle authentication events
 */
async function handleAuthEvent(data, metadata) {
  const {
    eventName,
    userId,
    success,
    method, // e.g., 'password', 'oauth', 'recovery'
    error = null,
    ip,
    userAgent,
  } = data;

  Sentry.captureMessage(`Auth: ${eventName}`, {
    level: success ? "info" : "warning",
    tags: {
      authEvent: eventName,
      authMethod: method,
      authSuccess: success,
      ...metadata,
    },
    extra: {
      error,
      ip,
      userAgent,
    },
    user: userId ? { id: userId } : undefined,
  });

  // If it's a failed authentication, we might want to add to breadcrumbs
  if (!success) {
    Sentry.addBreadcrumb({
      category: "auth",
      message: `Failed authentication attempt: ${eventName}`,
      level: "warning",
    });
  }

  return NextResponse.json({ success: true });
}

/**
 * Handle feedback and sentiment events
 */
async function handleFeedbackEvent(data, metadata) {
  const {
    feedbackId,
    organizationId,
    sentiment,
    themes = [],
    processingTime,
    source,
  } = data;

  Sentry.captureMessage("Feedback Processed", {
    level: "info",
    tags: {
      sentimentLabel: sentiment.label,
      feedbackSource: source,
      organizationId,
      ...metadata,
    },
    extra: {
      feedbackId,
      sentimentScore: sentiment.score,
      themes,
      processingTime,
    },
  });

  return NextResponse.json({ success: true });
}

/**
 * Handle subscription and billing events
 */
async function handleSubscriptionEvent(data, metadata) {
  const {
    eventType, // e.g., 'created', 'updated', 'canceled'
    organizationId,
    userId,
    subscriptionId,
    tier,
    status,
    paymentDetails = {},
  } = data;

  // Mask sensitive payment details
  const sanitizedPaymentDetails = maskPaymentData(paymentDetails);

  Sentry.captureMessage(`Subscription: ${eventType}`, {
    level: "info",
    tags: {
      subscriptionEvent: eventType,
      subscriptionTier: tier,
      subscriptionStatus: status,
      organizationId,
      ...metadata,
    },
    extra: {
      subscriptionId,
      paymentDetails: sanitizedPaymentDetails,
    },
    user: userId ? { id: userId } : undefined,
  });

  return NextResponse.json({ success: true });
}

/**
 * Handle performance metrics
 */
async function handlePerformanceEvent(data, metadata) {
  const { metricName, value, component, attributes = {} } = data;

  Sentry.captureMessage(`Performance: ${metricName}`, {
    level: "info",
    tags: {
      metricName,
      component,
      ...metadata,
    },
    extra: {
      value,
      ...attributes,
    },
  });

  return NextResponse.json({ success: true });
}

/**
 * Mask sensitive user data
 */
function maskUserData(userData) {
  if (!userData) return {};

  // Create a copy to avoid modifying the original
  const sanitized = { ...userData };

  // Only include fields we explicitly want to track
  return {
    id: sanitized.id,
    // Include organization info without IDs
    organization: sanitized.organization
      ? {
          name: sanitized.organization.name,
          subscription_tier: sanitized.organization.subscription_tier,
        }
      : undefined,
    // Don't include email, name, or other PII
  };
}

/**
 * Mask sensitive payment data
 */
function maskPaymentData(paymentData) {
  if (!paymentData) return {};

  const sanitized = { ...paymentData };

  // Mask credit card information
  if (sanitized.card) {
    if (sanitized.card.number) {
      sanitized.card.number = `****${sanitized.card.number.slice(-4)}`;
    }
    // Remove CVV entirely
    delete sanitized.card.cvc;
    delete sanitized.card.cvv;
    delete sanitized.card.securityCode;
  }

  return sanitized;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

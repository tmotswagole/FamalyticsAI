import { NextRequest } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * The `Arcjet` class provides a centralized and reusable implementation of various
 * security and validation mechanisms. By using static methods, this class ensures
 * that the logic can be accessed globally without the need to instantiate the class.
 *
 * Design Rationale:
 * - **Centralization**: All Arcjet-related functionalities (e.g., bot protection, WAF, rate limiting)
 *   are grouped into a single class for better organization and maintainability.
 * - **Reusability**: Static methods allow these functionalities to be reused across the application
 *   without creating multiple instances, reducing memory overhead.
 * - **Extensibility**: New methods can be added to the class as needed, making it easy to expand
 *   the security and validation features.
 * - **Separation of Concerns**: Each method is responsible for a specific task (e.g., bot detection,
 *   email validation), ensuring that the logic is modular and easy to test.
 */
export class Arcjet {
  /**
   * Verify if the request is from a bot based on the user-agent header.
   * This method checks the `user-agent` header of the incoming request for patterns
   * commonly associated with bots, crawlers, or spiders. If a match is found, the request
   * is flagged as originating from a bot.
   *
   * @param req - The incoming request object.
   * @returns {Promise<{ success: boolean; reason?: string }>}
   */
  static async verifyBotProtection(
    req: Request
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const userAgent = req.headers.get("user-agent") || "";
      if (/bot|crawler|spider/i.test(userAgent)) {
        return { success: false, reason: "Bot detected" };
      }
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        reason: err.message || "An error occurred during bot verification.",
      };
    }
  }

  /**
   * Apply Shield WAF to block malicious requests based on IP or other criteria.
   * This method simulates a Web Application Firewall (WAF) by inspecting the IP address
   * of the incoming request. If the IP matches a predefined blocked list (e.g., "192.168.0.1"),
   * the request is denied.
   *
   * @param req - The incoming request object.
   * @returns {Promise<{ success: boolean; reason?: string }>}
   */
  static async applyShieldWAF(
    req: Request
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const ip =
        req.headers.get("x-forwarded-for") || req.headers.get("remote-addr");
      if (ip === "192.168.0.1") {
        // Example blocked IP
        return { success: false, reason: "Blocked by WAF" };
      }
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        reason: err.message || "An error occurred during WAF application.",
      };
    }
  }

  /**
   * Enforce rate limiting to prevent abuse by limiting requests per IP.
   * This method tracks the timestamp of the last request made by each IP address.
   *
   * @param req - The incoming request object.
   * @returns {Promise<{ success: boolean; reason?: string }>}
   */
  static async enforceRateLimiting(
    req: Request
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const ip =
        req.headers.get("x-forwarded-for") ||
        req.headers.get("remote-addr") ||
        "unknown";
      const now = Date.now();
      const lastRequestTime = this.rateLimitMap.get(ip) || 0;

      if (now - lastRequestTime < 20000) {
        // 3 attempts per minute per IP
        return { success: false, reason: "Rate limit exceeded" };
      }

      this.rateLimitMap.set(ip, now);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        reason: err.message || "An error occurred during rate limiting.",
      };
    }
  }

  /**
   * Enforce rate limiting to prevent abuse by limiting requests per IP.
   * This method tracks the timestamp of the last request made by each IP address.
   * If a request is made within a restricted time window provided in seconds (e.g., less than 1 second),
   * the request is denied to enforce rate limiting.
   *
   * @param req - The incoming request object.
   * @param rateLimitTime - The time taken for the number of tries in seconds.
   * @returns {Promise<{ success: boolean; reason?: string }>}
   */
  static async enforceRateLimitingWithTime(
    req: NextApiRequest,
    rateLimitTime: number
  ): Promise<{ success: boolean; reason?: string }> {
    const ip =
      req.headers["x-forwarded-for"]?.toString() ||
      req.socket.remoteAddress ||
      "unknown";
    const now = Date.now();
    const lastRequestTime = this.rateLimitMap.get(ip) || 0;

    if (now - lastRequestTime < rateLimitTime) {
      // Number request (in milliseconds) per second provided from the call point.
      return { success: false, reason: "Rate limit exceeded" };
    }

    this.rateLimitMap.set(ip, now);
    return { success: true };
  }

  static async enforceRateLimitingWithTimeNormal(
    req: NextRequest,
    rateLimitTime: number
  ): Promise<{ success: boolean; reason?: string }> {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.ip ||
      "unknown";
    const now = Date.now();
    const lastRequestTime = this.rateLimitMap.get(ip) || 0;

    if (now - lastRequestTime < rateLimitTime) {
      // Number request (in milliseconds) per second provided from the call point.
      return { success: false, reason: "Rate limit exceeded" };
    }

    this.rateLimitMap.set(ip, now);
    return { success: true };
  }

  /**
   * Validate email addresses for proper format.
   * This method checks the `x-user-email` header of the incoming request to ensure
   * it contains a valid email address format. If the email is invalid or missing,
   * the request is flagged.
   *
   * @param req - The incoming request object.
   * @returns {Promise<{ success: boolean; reason?: string }>}
   */
  static async validateEmail(
    req: Request
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const email = req.headers.get("x-user-email");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, reason: "Invalid email address" };
      }
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        reason: err.message || "An error occurred during email validation.",
      };
    }
  }

  /**
   * Protect signup forms by ensuring required fields and password strength.
   * This method validates the JSON body of the incoming request to ensure that
   * required fields like `username` and `password` are present. Additionally, it
   * enforces a minimum password length (e.g., 8 characters) to enhance security.
   *
   * @param req - The incoming request object.
   * @returns {Promise<{ success: boolean; reason?: string }>}
   */
  static async protectSignupForm(
    req: Request
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const body = await req.json();
      if (!body.username || !body.password) {
        return { success: false, reason: "Missing required signup fields" };
      }
      if (body.password.length < 8) {
        return { success: false, reason: "Password too short" };
      }
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        reason:
          err.message || "An error occurred during signup form validation.",
      };
    }
  }

  /**
   * Detect sensitive information in the request body.
   * This method scans the text body of the incoming request for patterns that
   * match sensitive information, such as credit card numbers, SSNs, or passwords.
   * If such information is detected, the request is flagged.
   *
   * @param req - The incoming request object.
   * @returns {Promise<{ success: boolean; reason?: string }>}
   */
  static async detectSensitiveInfo(
    req: Request
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const body = await req.text();
      if (/credit card|ssn|password/i.test(body)) {
        return { success: false, reason: "Sensitive information detected" };
      }
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        reason:
          err.message ||
          "An error occurred during sensitive information detection.",
      };
    }
  }

  // Internal rate limit map to track requests per IP
  // This map stores the timestamp of the last request for each IP address.
  private static readonly rateLimitMap: Map<string, number> = new Map();
}

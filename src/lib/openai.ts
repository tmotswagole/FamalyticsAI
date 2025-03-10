/**
 * OpenAI Integration Library
 * Handles interactions with OpenAI API for sentiment analysis and other NLP tasks
 */

interface SentimentAnalysisResult {
  sentiment_score: number; // Range from -1 (negative) to 1 (positive)
  sentiment_label: "positive" | "neutral" | "negative";
  keywords: string[];
  themes?: string[];
  confidence: number;
}

/**
 * Analyze the sentiment of a text using OpenAI
 * @param text The text to analyze
 * @returns A sentiment analysis result object
 */
export async function analyzeSentiment(
  text: string,
): Promise<SentimentAnalysisResult> {
  try {
    // For now, we'll use a simple rule-based approach as a fallback
    // In a real implementation, this would call the OpenAI API

    // Simple keyword-based sentiment analysis
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "love",
      "happy",
      "best",
      "awesome",
      "fantastic",
      "wonderful",
      "perfect",
      "like",
      "enjoy",
      "thanks",
      "thank you",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "hate",
      "dislike",
      "worst",
      "poor",
      "disappointed",
      "disappointing",
      "frustrating",
      "useless",
      "problem",
      "issue",
      "complaint",
    ];

    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    let positiveCount = 0;
    let negativeCount = 0;

    // Count positive and negative words
    for (const word of words) {
      const cleanWord = word.replace(/[^a-z]/g, "");
      if (positiveWords.includes(cleanWord)) positiveCount++;
      if (negativeWords.includes(cleanWord)) negativeCount++;
    }

    // Extract potential keywords (words longer than 4 characters)
    const keywords = words
      .filter((word) => word.length > 4)
      .filter(
        (word) =>
          !positiveWords.includes(word) && !negativeWords.includes(word),
      )
      .map((word) => word.replace(/[^a-z]/g, ""))
      .filter((word) => word.length > 4)
      .slice(0, 5);

    // Calculate sentiment score
    const totalSentimentWords = positiveCount + negativeCount;
    let sentimentScore = 0;

    if (totalSentimentWords > 0) {
      sentimentScore = (positiveCount - negativeCount) / totalSentimentWords;
    }

    // Determine sentiment label
    let sentimentLabel: "positive" | "neutral" | "negative" = "neutral";
    if (sentimentScore > 0.2) sentimentLabel = "positive";
    else if (sentimentScore < -0.2) sentimentLabel = "negative";

    return {
      sentiment_score: sentimentScore,
      sentiment_label: sentimentLabel,
      keywords,
      confidence: Math.min(0.7, Math.abs(sentimentScore) + 0.3), // Simple confidence calculation
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    // Return a neutral sentiment as fallback
    return {
      sentiment_score: 0,
      sentiment_label: "neutral",
      keywords: [],
      confidence: 0.3,
    };
  }
}

/**
 * Extract themes from a text using OpenAI
 * @param text The text to analyze
 * @returns An array of theme names
 */
export async function extractThemes(text: string): Promise<string[]> {
  try {
    // For now, we'll use a simple rule-based approach as a fallback
    // In a real implementation, this would call the OpenAI API

    const themeKeywords = {
      product: [
        "product",
        "quality",
        "design",
        "feature",
        "functionality",
        "durability",
        "innovation",
        "performance",
        "efficiency",
        "reliability",
        "materials",
        "engineering",
        "craftsmanship",
        "aesthetics",
        "usability",
        "versatility",
        "packaging",
        "specification",
        "compatibility",
        "customization",
      ],
      service: [
        "service",
        "support",
        "staff",
        "representative",
        "agent",
        "customer service",
        "assistance",
        "responsiveness",
        "professionalism",
        "help",
        "solutions",
        "courteous",
        "friendly",
        "knowledgeable",
        "expert",
        "after-sales",
        "technical support",
        "customer care",
        "client service",
        "attentiveness",
        "satisfaction",
      ],
      delivery: [
        "delivery",
        "shipping",
        "package",
        "arrived",
        "late",
        "on time",
        "tracking",
        "courier",
        "dispatch",
        "fulfillment",
        "shipment",
        "logistics",
        "speed",
        "timeliness",
        "scheduling",
        "handling",
        "transit",
        "estimated delivery",
        "shipping cost",
        "delivery service",
        "order fulfillment",
        "drop-off",
        "arrival",
        "shipping status",
        "delivery date",
        "delivered",
        "dispatch time",
      ],
      price: [
        "price",
        "cost",
        "expensive",
        "cheap",
        "affordable",
        "value",
        "worth",
        "pricing",
        "rate",
        "budget",
        "inexpensive",
        "competitive",
        "economical",
        "reasonable",
        "discount",
        "savings",
        "investment",
        "price point",
        "cost-effective",
        "bargain",
        "premium",
        "affordability",
        "expense",
        "price comparison",
        "overpriced",
        "undervalued",
        "deal",
        "markup",
      ],
      usability: [
        "easy",
        "difficult",
        "intuitive",
        "user-friendly",
        "complicated",
        "simple",
        "confusing",
        "usability",
        "accessibility",
        "navigation",
        "efficiency",
        "learnability",
        "simplicity",
        "responsive",
        "ergonomic",
        "streamlined",
        "uncluttered",
        "logical",
        "seamless",
        "straightforward",
        "clear",
        "predictable",
        "manageable",
        "frictionless",
        "efficient",
        "interactive",
        "engaging",
        "familiar",
        "cognitive load",
      ],
      website: [
        "website",
        "app",
        "mobile",
        "interface",
        "navigation",
        "login",
        "checkout",
        "web app",
        "platform",
        "desktop",
        "responsive design",
        "user interface",
        "UI",
        "UX",
        "layout",
        "landing page",
        "homepage",
        "menu",
        "header",
        "footer",
        "dashboard",
        "webpage",
        "browser",
        "e-commerce",
        "online",
        "portal",
        "site",
        "CMS",
        "blog",
        "shopping cart",
        "search",
        "registration",
        "signup",
        "profile",
        "account",
        "page speed",
      ],
    };

    const lowerText = text.toLowerCase();
    const themeMatches: Record<string, number> = {};

    // Count theme keyword matches
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      themeMatches[theme] = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          themeMatches[theme]++;
        }
      }
    }

    // Return themes with at least one keyword match, sorted by match count
    return Object.entries(themeMatches)
      .filter(([_, count]) => count > 0)
      .sort(([_, countA], [__, countB]) => countB - countA)
      .map(([theme, _]) => theme);
  } catch (error) {
    console.error("Error extracting themes:", error);
    return [];
  }
}

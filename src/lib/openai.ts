import { OPENAI_MODELS } from "./constants";

type SentimentAnalysisResult = {
  sentiment_score: number;
  sentiment_label: string;
  keywords: string[];
};

/**
 * Analyzes text for sentiment and extracts keywords using OpenAI API
 * @param text The text to analyze
 * @returns Object containing sentiment score, label, and keywords
 */
export async function analyzeSentiment(
  text: string,
): Promise<SentimentAnalysisResult> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODELS.GPT_3_5_TURBO,
        messages: [
          {
            role: "system",
            content:
              'You are a sentiment analysis assistant. Analyze the provided text and return a JSON object with sentiment_score (number between -1 and 1), sentiment_label ("positive", "neutral", or "negative"), and keywords (array of up to 5 key topics or issues mentioned).',
          },
          {
            role: "user",
            content: `Analyze the following customer feedback for sentiment and key topics:\n\n"${text}"\n\nProvide a response in the following JSON format:\n{\n  "sentiment_score": [number between -1 and 1],\n  "sentiment_label": ["positive", "neutral", or "negative"],\n  "keywords": [array of up to 5 key topics or issues mentioned]\n}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      sentiment_score: result.sentiment_score,
      sentiment_label: result.sentiment_label,
      keywords: result.keywords,
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw error;
  }
}

/**
 * Categorizes feedback into themes using OpenAI API
 * @param text The feedback text to categorize
 * @param availableThemes Array of available themes to choose from
 * @returns Array of theme IDs with confidence scores
 */
export async function categorizeThemes(
  text: string,
  availableThemes: { id: string; name: string; description: string }[],
): Promise<{ theme_id: string; confidence_score: number }[]> {
  try {
    const themesDescription = availableThemes
      .map(
        (theme) => `- ${theme.name}: ${theme.description || "No description"}`,
      )
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODELS.GPT_3_5_TURBO,
        messages: [
          {
            role: "system",
            content:
              "You are a text classification assistant. Categorize the provided feedback into the most relevant themes from the list provided. Return a JSON array with theme_id and confidence_score (0-1) for each relevant theme.",
          },
          {
            role: "user",
            content: `Categorize the following customer feedback into the most relevant themes:\n\n"${text}"\n\nAvailable themes:\n${themesDescription}\n\nProvide a response in the following JSON format:\n[\n  {\n    "theme_id": "[theme id]",\n    "confidence_score": [number between 0 and 1]\n  }\n]\n\nOnly include themes that are relevant with a confidence score of at least 0.5. Sort by confidence score descending.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 250,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Map theme names to IDs
    return result.map((item: any) => ({
      theme_id: item.theme_id,
      confidence_score: item.confidence_score,
    }));
  } catch (error) {
    console.error("Error categorizing themes:", error);
    throw error;
  }
}

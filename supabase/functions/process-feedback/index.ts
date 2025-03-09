import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SentimentAnalysisResult {
  sentiment_score: number;
  sentiment_label: string;
  keywords: string[];
}

async function analyzeSentiment(
  text: string,
): Promise<SentimentAnalysisResult> {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY environment variable not set");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
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
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get unprocessed feedback entries
    const { data: unprocessedFeedback, error: fetchError } = await supabase
      .from("feedback_entries")
      .select("*")
      .eq("processed", false)
      .limit(10); // Process in batches

    if (fetchError) {
      throw new Error(
        `Error fetching unprocessed feedback: ${fetchError.message}`,
      );
    }

    if (!unprocessedFeedback || unprocessedFeedback.length === 0) {
      return new Response(
        JSON.stringify({ message: "No unprocessed feedback found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const results = [];

    // Process each feedback entry
    for (const feedback of unprocessedFeedback) {
      try {
        // Analyze sentiment
        const sentimentResult = await analyzeSentiment(feedback.text_content);

        // Update feedback with sentiment analysis results
        const { error: updateError } = await supabase
          .from("feedback_entries")
          .update({
            sentiment_score: sentimentResult.sentiment_score,
            sentiment_label: sentimentResult.sentiment_label,
            keywords: sentimentResult.keywords,
            processed: true,
          })
          .eq("id", feedback.id);

        if (updateError) {
          results.push({
            id: feedback.id,
            status: "error",
            message: `Failed to update: ${updateError.message}`,
          });
        } else {
          results.push({
            id: feedback.id,
            status: "processed",
            sentiment_score: sentimentResult.sentiment_score,
            sentiment_label: sentimentResult.sentiment_label,
            keywords: sentimentResult.keywords,
          });

          // Get available themes for this organization
          const { data: themes } = await supabase
            .from("themes")
            .select("id, name, description")
            .or(
              `organization_id.eq.${feedback.organization_id},is_system_generated.eq.true`,
            );

          if (themes && themes.length > 0) {
            // Categorize feedback into themes using keywords
            const keywordThemeMap: Record<string, string[]> = {
              product: ["Product Quality"],
              quality: ["Product Quality"],
              service: ["Customer Service"],
              support: ["Customer Service"],
              delivery: ["Delivery"],
              shipping: ["Delivery"],
              website: ["Website/App"],
              app: ["Website/App"],
              price: ["Pricing"],
              cost: ["Pricing"],
              value: ["Pricing"],
            };

            const matchedThemes = new Set<string>();

            // Match keywords to themes
            for (const keyword of sentimentResult.keywords) {
              const lowerKeyword = keyword.toLowerCase();

              // Check for direct matches in the map
              for (const [key, themeNames] of Object.entries(keywordThemeMap)) {
                if (lowerKeyword.includes(key)) {
                  themeNames.forEach((themeName) =>
                    matchedThemes.add(themeName),
                  );
                }
              }
            }

            // Create theme associations
            for (const themeName of matchedThemes) {
              const theme = themes.find((t) => t.name === themeName);
              if (theme) {
                await supabase.from("feedback_themes").insert({
                  feedback_id: feedback.id,
                  theme_id: theme.id,
                  confidence_score: 0.8, // Default confidence score
                });
              }
            }
          }

          // Check for alert conditions
          if (sentimentResult.sentiment_label === "negative") {
            // Get alert configurations for this organization
            const { data: alertConfigs } = await supabase
              .from("alert_configurations")
              .select("*")
              .eq("organization_id", feedback.organization_id)
              .eq("is_active", true);

            if (alertConfigs) {
              for (const config of alertConfigs) {
                // Check if sentiment threshold is triggered
                if (
                  config.sentiment_threshold &&
                  sentimentResult.sentiment_score <= config.sentiment_threshold
                ) {
                  // Create alert history entry
                  const { data: alertHistory } = await supabase
                    .from("alert_history")
                    .insert({
                      alert_configuration_id: config.id,
                      trigger_reason: "Negative sentiment threshold exceeded",
                      trigger_data: {
                        feedback_id: feedback.id,
                        sentiment_score: sentimentResult.sentiment_score,
                        sentiment_label: sentimentResult.sentiment_label,
                        text_content: feedback.text_content,
                      },
                      notification_sent: false,
                    })
                    .select()
                    .single();

                  // Create in-app notification for immediate alerts
                  if (
                    config.frequency === "immediate" &&
                    config.notification_channel?.includes("in_app")
                  ) {
                    // Get recipients
                    const { data: recipients } = await supabase
                      .from("alert_recipients")
                      .select("user_id")
                      .eq("alert_configuration_id", config.id);

                    if (recipients) {
                      for (const recipient of recipients) {
                        await supabase.from("notifications").insert({
                          user_id: recipient.user_id,
                          organization_id: feedback.organization_id,
                          title: "Negative Sentiment Alert",
                          message: `Negative feedback detected: "${feedback.text_content.substring(0, 100)}${feedback.text_content.length > 100 ? "..." : ""}"`,

                          type: "alert",
                          data: {
                            alert_history_id: alertHistory?.id,
                            feedback_id: feedback.id,
                          },
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        results.push({
          id: feedback.id,
          status: "error",
          message: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error processing feedback:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

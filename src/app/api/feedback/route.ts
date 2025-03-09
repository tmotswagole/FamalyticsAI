import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { analyzeSentiment } from "@/lib/openai";

// Helper to validate API key
async function validateApiKey(key: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("organization_id")
    .eq("key", key)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  // Update last used timestamp
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key", key);

  return data.organization_id;
}

// GET handler - fetch feedback entries
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const organizationId = searchParams.get("organization_id");
    const source = searchParams.get("source");
    const sentiment = searchParams.get("sentiment");
    const themeId = searchParams.get("theme_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("page_size") || "10");

    // Build query
    let query = supabase
      .from("feedback_entries")
      .select("*, feedback_themes(theme_id)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    // Apply filters
    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    if (source) {
      query = query.eq("source", source);
    }

    if (sentiment) {
      query = query.eq("sentiment_label", sentiment);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    if (themeId) {
      query = query.filter("feedback_themes.theme_id", "eq", themeId);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      meta: {
        total: count || 0,
        page,
        page_size: pageSize,
        total_pages: count ? Math.ceil(count / pageSize) : 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler - create new feedback entry
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Check for API key in header
    const apiKey = request.headers.get("x-api-key");
    let organizationId = body.organization_id;

    if (apiKey) {
      // Validate API key and get organization ID
      const validatedOrgId = await validateApiKey(apiKey);
      if (!validatedOrgId) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
      organizationId = validatedOrgId;
    } else {
      // If no API key, check if user is authenticated and has access to the organization
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!organizationId) {
        return NextResponse.json(
          { error: "organization_id is required" },
          { status: 400 },
        );
      }

      // Verify user has access to this organization
      const { data: userOrg } = await supabase
        .from("user_organizations")
        .select("role")
        .eq("user_id", user.id)
        .eq("organization_id", organizationId)
        .single();

      if (!userOrg) {
        return NextResponse.json(
          { error: "You do not have access to this organization" },
          { status: 403 },
        );
      }
    }

    // Validate required fields
    if (!body.text_content) {
      return NextResponse.json(
        { error: "text_content is required" },
        { status: 400 },
      );
    }

    // Prepare feedback entry
    const feedbackEntry = {
      organization_id: organizationId,
      text_content: body.text_content,
      source: body.source || "api",
      feedback_date: body.feedback_date || new Date().toISOString(),
      metadata: body.metadata || {},
      processed: false,
    };

    // Insert feedback entry
    const { data: newFeedback, error } = await supabase
      .from("feedback_entries")
      .insert(feedbackEntry)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process sentiment analysis if requested
    if (body.analyze_sentiment) {
      try {
        const sentimentResult = await analyzeSentiment(body.text_content);

        // Update feedback with sentiment analysis results
        await supabase
          .from("feedback_entries")
          .update({
            sentiment_score: sentimentResult.sentiment_score,
            sentiment_label: sentimentResult.sentiment_label,
            keywords: sentimentResult.keywords,
            processed: true,
          })
          .eq("id", newFeedback.id);

        // Return the feedback with sentiment analysis
        return NextResponse.json({
          ...newFeedback,
          sentiment_score: sentimentResult.sentiment_score,
          sentiment_label: sentimentResult.sentiment_label,
          keywords: sentimentResult.keywords,
          processed: true,
        });
      } catch (error: any) {
        // Return the feedback without sentiment analysis if it fails
        console.error("Sentiment analysis failed:", error);
        return NextResponse.json(newFeedback);
      }
    }

    return NextResponse.json(newFeedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT handler - update feedback entry
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 },
      );
    }

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the feedback entry to check organization access
    const { data: feedback } = await supabase
      .from("feedback_entries")
      .select("organization_id")
      .eq("id", id)
      .single();

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 },
      );
    }

    // Verify user has access to this organization
    const { data: userOrg } = await supabase
      .from("user_organizations")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", feedback.organization_id)
      .single();

    if (!userOrg || !["CLIENTADMIN", "SYSADMIN"].includes(userOrg.role)) {
      return NextResponse.json(
        { error: "You do not have permission to update this feedback" },
        { status: 403 },
      );
    }

    // Update feedback entry
    const { data: updatedFeedback, error } = await supabase
      .from("feedback_entries")
      .update({
        text_content: body.text_content,
        source: body.source,
        feedback_date: body.feedback_date,
        metadata: body.metadata,
        // Don't allow updating sentiment directly
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(updatedFeedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler - delete feedback entry
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 },
      );
    }

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the feedback entry to check organization access
    const { data: feedback } = await supabase
      .from("feedback_entries")
      .select("organization_id")
      .eq("id", id)
      .single();

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 },
      );
    }

    // Verify user has access to this organization
    const { data: userOrg } = await supabase
      .from("user_organizations")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", feedback.organization_id)
      .single();

    if (!userOrg || !["CLIENTADMIN", "SYSADMIN"].includes(userOrg.role)) {
      return NextResponse.json(
        { error: "You do not have permission to delete this feedback" },
        { status: 403 },
      );
    }

    // Delete related theme associations first
    await supabase.from("feedback_themes").delete().eq("feedback_id", id);

    // Delete feedback entry
    const { error } = await supabase
      .from("feedback_entries")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

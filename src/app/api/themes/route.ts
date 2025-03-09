import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET handler - fetch themes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const organizationId = searchParams.get("organization_id");
    const includeSystem = searchParams.get("include_system") === "true";

    // Build query
    let query = supabase.from("themes").select("*").order("name");

    if (organizationId) {
      // Include organization-specific themes and optionally system themes
      if (includeSystem) {
        query = query.or(
          `organization_id.eq.${organizationId},is_system_generated.eq.true`,
        );
      } else {
        query = query.eq("organization_id", organizationId);
      }
    } else if (includeSystem) {
      // Only include system themes if no organization specified
      query = query.eq("is_system_generated", true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler - create new theme
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    if (!body.organization_id) {
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
      .eq("organization_id", body.organization_id)
      .single();

    if (!userOrg || !["CLIENTADMIN", "SYSADMIN"].includes(userOrg.role)) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to create themes for this organization",
        },
        { status: 403 },
      );
    }

    // Check if theme with same name already exists for this organization
    const { data: existingTheme } = await supabase
      .from("themes")
      .select("id")
      .eq("name", body.name)
      .eq("organization_id", body.organization_id)
      .maybeSingle();

    if (existingTheme) {
      return NextResponse.json(
        { error: "A theme with this name already exists" },
        { status: 409 },
      );
    }

    // Create new theme
    const { data: newTheme, error } = await supabase
      .from("themes")
      .insert({
        name: body.name,
        description: body.description,
        organization_id: body.organization_id,
        is_system_generated: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newTheme);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT handler - update theme
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Theme ID is required" },
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

    // Get the theme to check organization access and system status
    const { data: theme } = await supabase
      .from("themes")
      .select("organization_id, is_system_generated")
      .eq("id", id)
      .single();

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    // Don't allow editing system-generated themes
    if (theme.is_system_generated) {
      return NextResponse.json(
        { error: "System-generated themes cannot be modified" },
        { status: 403 },
      );
    }

    // Verify user has access to this organization
    const { data: userOrg } = await supabase
      .from("user_organizations")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", theme.organization_id)
      .single();

    if (!userOrg || !["CLIENTADMIN", "SYSADMIN"].includes(userOrg.role)) {
      return NextResponse.json(
        { error: "You do not have permission to update this theme" },
        { status: 403 },
      );
    }

    // Check if new name conflicts with existing theme
    if (body.name) {
      const { data: existingTheme } = await supabase
        .from("themes")
        .select("id")
        .eq("name", body.name)
        .eq("organization_id", theme.organization_id)
        .neq("id", id)
        .maybeSingle();

      if (existingTheme) {
        return NextResponse.json(
          { error: "A theme with this name already exists" },
          { status: 409 },
        );
      }
    }

    // Update theme
    const { data: updatedTheme, error } = await supabase
      .from("themes")
      .update({
        name: body.name,
        description: body.description,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(updatedTheme);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler - delete theme
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Theme ID is required" },
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

    // Get the theme to check organization access and system status
    const { data: theme } = await supabase
      .from("themes")
      .select("organization_id, is_system_generated")
      .eq("id", id)
      .single();

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    // Don't allow deleting system-generated themes
    if (theme.is_system_generated) {
      return NextResponse.json(
        { error: "System-generated themes cannot be deleted" },
        { status: 403 },
      );
    }

    // Verify user has access to this organization
    const { data: userOrg } = await supabase
      .from("user_organizations")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", theme.organization_id)
      .single();

    if (!userOrg || !["CLIENTADMIN", "SYSADMIN"].includes(userOrg.role)) {
      return NextResponse.json(
        { error: "You do not have permission to delete this theme" },
        { status: 403 },
      );
    }

    // Check if theme is in use
    const { count } = await supabase
      .from("feedback_themes")
      .select("*", { count: "exact" })
      .eq("theme_id", id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          error:
            "This theme cannot be deleted because it is associated with feedback entries",
          count,
        },
        { status: 409 },
      );
    }

    // Delete theme
    const { error } = await supabase.from("themes").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

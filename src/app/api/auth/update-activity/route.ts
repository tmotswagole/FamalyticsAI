import { NextRequest, NextResponse } from "next/server";
import { updateLastActive } from "@/lib/auth-cookies";

export async function POST(request: NextRequest) {
  try {
    // Update the last active timestamp
    updateLastActive();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update activity" },
      { status: 500 },
    );
  }
}

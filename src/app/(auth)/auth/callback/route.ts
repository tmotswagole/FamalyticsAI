// import { createClient } from "../../../../../supabase/server";
import "server-only";
import { createClient } from "@/utils/supabase/middleware";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  const nextRequest = new NextRequest(request);
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // const supabase = await createClient();
    const middlewareResponse = createClient(nextRequest);
    const supabase = middlewareResponse.supabase;
    const res = middlewareResponse.response;
    await supabase.auth.exchangeCodeForSession(code);
  }
}

async function getUser(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

async function getUserData(user: any, supabase: any) {
  const { data: userData } = await supabase
    .from("auth.users")
    .select("role")
    .eq("user_id", user.id)
    .single();
  return userData;
}
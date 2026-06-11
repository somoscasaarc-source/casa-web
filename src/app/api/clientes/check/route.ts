import { NextResponse } from "next/server";
import { getServiceSupabase, supabaseConfigured } from "@/lib/supabase/server";

export async function GET(req: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const token = new URL(req.url).searchParams.get("token")?.trim();
  if (!token) return NextResponse.json({ error: "missing" }, { status: 400 });

  const svc = getServiceSupabase();
  const { data, error } = await svc
    .from("galleries")
    .select("id, is_active")
    .eq("access_token", token)
    .single();

  if (error || !data || !data.is_active) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

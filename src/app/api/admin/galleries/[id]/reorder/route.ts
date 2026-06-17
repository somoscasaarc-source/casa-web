import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase, supabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json() as { order: string[] };
  if (!Array.isArray(body.order)) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const svc = getServiceSupabase();

  // Update sort_order for each photo id in the given order
  const updates = body.order.map((photoId, index) =>
    svc.from("photos").update({ sort_order: index }).eq("id", photoId).eq("gallery_id", params.id),
  );

  const results = await Promise.all(updates);
  const errs = results.filter((r) => r.error);
  if (errs.length > 0) return NextResponse.json({ error: "partial_fail" }, { status: 500 });

  return NextResponse.json({ ok: true });
}

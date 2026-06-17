import { NextResponse } from "next/server";
import { getServiceSupabase, supabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { token: string } },
) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { photo_id } = await req.json();
  if (!photo_id) return NextResponse.json({ error: "photo_id_required" }, { status: 400 });

  const svc = getServiceSupabase();
  const { data: gallery } = await svc
    .from("galleries")
    .select("id")
    .eq("access_token", params.token)
    .single();

  if (!gallery) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const galleryId = (gallery as { id: string }).id;

  // Toggle: if already favorited, remove; otherwise add
  const { data: existing } = await svc
    .from("photo_favorites")
    .select("id")
    .eq("photo_id", photo_id)
    .eq("gallery_id", galleryId)
    .single();

  if (existing) {
    await svc.from("photo_favorites").delete().eq("id", (existing as { id: string }).id);
    return NextResponse.json({ favorited: false });
  } else {
    await svc.from("photo_favorites").insert({ photo_id, gallery_id: galleryId });
    return NextResponse.json({ favorited: true });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { token: string } },
) {
  if (!supabaseConfigured()) return NextResponse.json({ favorites: [] });

  const svc = getServiceSupabase();
  const { data: gallery } = await svc
    .from("galleries")
    .select("id")
    .eq("access_token", params.token)
    .single();

  if (!gallery) return NextResponse.json({ favorites: [] });

  const { data } = await svc
    .from("photo_favorites")
    .select("photo_id")
    .eq("gallery_id", (gallery as { id: string }).id);

  return NextResponse.json({ favorites: (data ?? []).map((f: { photo_id: string }) => f.photo_id) });
}

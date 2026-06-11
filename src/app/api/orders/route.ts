import { NextResponse } from "next/server";
import {
  getServiceSupabase,
  supabaseConfigured,
} from "@/lib/supabase/server";
import { createPreference, mercadopagoConfigured } from "@/lib/mercadopago";
import { PRODUCTOS } from "@/lib/tienda";

type Payload = { items?: { id: string; qty: number }[] };

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://casa-web-chi.vercel.app";

export async function POST(req: Request) {
  if (!mercadopagoConfigured() || !supabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = (await req.json()) as Payload;
  const itemsIn = body.items ?? [];
  if (itemsIn.length === 0)
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });

  const resolved = itemsIn
    .map((i) => {
      const p = PRODUCTOS.find((x) => x.id === i.id);
      if (!p) return null;
      return { p, qty: Math.max(1, Math.min(20, Math.floor(i.qty || 1))) };
    })
    .filter((x): x is { p: (typeof PRODUCTOS)[number]; qty: number } => Boolean(x));

  if (resolved.length === 0)
    return NextResponse.json({ error: "no_valid_items" }, { status: 400 });

  const total = resolved.reduce((s, r) => s + r.p.price * r.qty, 0);

  const svc = getServiceSupabase();
  const { data: order, error: oErr } = await svc
    .from("orders")
    .insert({
      items: resolved.map((r) => ({
        id: r.p.id,
        name: r.p.name,
        price: r.p.price,
        qty: r.qty,
      })),
      total,
      payment_status: "pending",
    })
    .select()
    .single();
  if (oErr || !order)
    return NextResponse.json({ error: oErr?.message ?? "order_create" }, { status: 500 });

  try {
    const pref = await createPreference({
      items: resolved.map((r) => ({
        title: r.p.name,
        quantity: r.qty,
        unit_price: r.p.price,
      })),
      external_reference: `order:${order.id}`,
      payer: { email: "" },
      back_urls: {
        success: `${BASE}/tienda/exito?o=${order.id}`,
        failure: `${BASE}/tienda/falla?o=${order.id}`,
        pending: `${BASE}/tienda/pendiente?o=${order.id}`,
      },
      notification_url: `${BASE}/api/mp/webhook`,
    });

    await svc
      .from("orders")
      .update({ payment_id: pref.id })
      .eq("id", order.id);

    return NextResponse.json({
      init_point: pref.init_point,
      order_id: order.id,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "mp_error" },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";
import { getPayment, mercadopagoConfigured } from "@/lib/mercadopago";
import {
  getServiceSupabase,
  supabaseConfigured,
} from "@/lib/supabase/server";

export async function POST(req: Request) {
  if (!mercadopagoConfigured() || !supabaseConfigured()) {
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? url.searchParams.get("topic");
  const id =
    url.searchParams.get("data.id") ??
    url.searchParams.get("id") ??
    (await req.json().catch(() => ({})))?.data?.id;

  if (type !== "payment" || !id) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const payment = await getPayment(String(id));
    const ref = payment.external_reference;
    if (!ref) return NextResponse.json({ ok: true, no_ref: true });

    const svc = getServiceSupabase();

    // Store orders (tienda + galería) use an "order:<id>" reference.
    if (ref.startsWith("order:")) {
      const orderId = ref.slice("order:".length);
      await svc
        .from("orders")
        .update({
          payment_id: String(payment.id),
          payment_status: payment.status,
        })
        .eq("id", orderId);
      return NextResponse.json({ ok: true, kind: "order" });
    }

    // Otherwise it's a reservation deposit (bookings).
    const bookingId = ref;
    await svc
      .from("bookings")
      .update({
        payment_id: String(payment.id),
        payment_status: payment.status,
      })
      .eq("id", bookingId);

    if (payment.status === "approved") {
      // mark event as deposit_paid
      const { data: b } = await svc
        .from("bookings")
        .select("event_id")
        .eq("id", bookingId)
        .single();
      if (b?.event_id) {
        await svc
          .from("events")
          .update({ status: "señado", deposit_paid: true })
          .eq("id", b.event_id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "webhook_error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

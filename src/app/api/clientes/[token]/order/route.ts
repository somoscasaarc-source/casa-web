import { NextResponse } from "next/server";
import { getServiceSupabase, supabaseConfigured } from "@/lib/supabase/server";
import { createPreference, mercadopagoConfigured } from "@/lib/mercadopago";
import { findShopProduct, formatARS } from "@/lib/gallery-shop";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casa-web-chi.vercel.app";

type Payload = {
  items?: { productId: string; qty: number; photoId?: string | null; photoName?: string | null }[];
  customer?: { name?: string; email?: string; phone?: string };
  shipping?: { street?: string; city?: string; zip?: string };
  notes?: string;
};

export async function POST(req: Request, { params }: { params: { token: string } }) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = (await req.json()) as Payload;
  const itemsIn = body.items ?? [];
  const customer = body.customer ?? {};
  const shipping = body.shipping ?? {};

  // Validate customer
  if (
    !customer.name ||
    !customer.email ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email) ||
    !customer.phone ||
    !shipping.street ||
    !shipping.city
  ) {
    return NextResponse.json({ error: "datos_incompletos" }, { status: 400 });
  }
  if (itemsIn.length === 0) {
    return NextResponse.json({ error: "pedido_vacio" }, { status: 400 });
  }

  const svc = getServiceSupabase();

  // Verify gallery exists + active
  const { data: gallery } = await svc
    .from("galleries")
    .select("id, title, is_active, clients ( name )")
    .eq("access_token", params.token)
    .single();

  if (!gallery || !(gallery as { is_active: boolean }).is_active) {
    return NextResponse.json({ error: "galeria_no_encontrada" }, { status: 404 });
  }
  const g = gallery as unknown as { id: string; title: string | null };

  // Resolve products server-side (never trust client prices)
  const resolved = itemsIn
    .map((i) => {
      const p = findShopProduct(i.productId);
      if (!p) return null;
      return {
        product: p,
        qty: Math.max(1, Math.min(20, Math.floor(i.qty || 1))),
        photoId: i.photoId ?? null,
        photoName: i.photoName ?? null,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  if (resolved.length === 0) {
    return NextResponse.json({ error: "sin_productos_validos" }, { status: 400 });
  }

  const total = resolved.reduce((s, r) => s + r.product.price * r.qty, 0);

  const orderItems = resolved.map((r) => ({
    id: r.product.id,
    name: r.product.name,
    kind: r.product.kind,
    price: r.product.price,
    qty: r.qty,
    photo_id: r.photoId,
    photo_name: r.photoName,
  }));

  // Insert order
  const { data: order, error: oErr } = await svc
    .from("orders")
    .insert({
      gallery_id: g.id,
      items: orderItems,
      total,
      payment_status: "pending",
      shipping_status: "pending",
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: {
        street: shipping.street,
        city: shipping.city,
        zip: shipping.zip ?? "",
      },
      notes: body.notes ?? "",
    })
    .select()
    .single();

  if (oErr || !order) {
    return NextResponse.json({ error: oErr?.message ?? "order_create_failed" }, { status: 500 });
  }
  const orderId = (order as { id: string }).id;

  // Notify admin by email (best-effort)
  await notifyAdmin({
    orderId,
    galleryTitle: g.title ?? "Galería",
    customer,
    shipping,
    notes: body.notes ?? "",
    items: orderItems,
    total,
  }).catch(() => {});

  // If MercadoPago is configured, create a payment preference
  if (mercadopagoConfigured()) {
    try {
      const pref = await createPreference({
        items: resolved.map((r) => ({
          title:
            r.product.name + (r.photoName ? ` — ${r.photoName}` : ""),
          quantity: r.qty,
          unit_price: r.product.price,
        })),
        external_reference: `order:${orderId}`,
        payer: { name: customer.name, email: customer.email },
        back_urls: {
          success: `${BASE}/clientes/${params.token}?pago=ok`,
          failure: `${BASE}/clientes/${params.token}?pago=falla`,
          pending: `${BASE}/clientes/${params.token}?pago=pendiente`,
        },
        notification_url: `${BASE}/api/mp/webhook`,
      });
      await svc.from("orders").update({ payment_id: pref.id }).eq("id", orderId);
      return NextResponse.json({ order_id: orderId, init_point: pref.init_point });
    } catch {
      // Payment provider failed — fall back to manual coordination
      return NextResponse.json({ order_id: orderId, manual: true });
    }
  }

  // No online payment configured → studio coordinates manually
  return NextResponse.json({ order_id: orderId, manual: true });
}

async function notifyAdmin(data: {
  orderId: string;
  galleryTitle: string;
  customer: { name?: string; email?: string; phone?: string };
  shipping: { street?: string; city?: string; zip?: string };
  notes: string;
  items: { name: string; qty: number; price: number; photo_name: string | null }[];
  total: number;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;
  const resendFrom = process.env.RESEND_FROM ?? "CASA <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? "somoscasa.ar@gmail.com";

  const rows = data.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${i.qty}× ${i.name}${
          i.photo_name ? `<br><span style="color:#9b8e85;font-size:12px">${i.photo_name}</span>` : ""
        }</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${formatARS(
          i.price * i.qty,
        )}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#f7f2e9;padding:24px;color:#1c1714">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border:1px solid #e7ddcd">
    <div style="font-family:Georgia,serif;letter-spacing:0.3em;font-size:16px;color:#1c1714">C A S A</div>
    <h2 style="font-family:Georgia,serif;font-weight:400;margin:18px 0 4px">Nuevo pedido de tienda</h2>
    <p style="color:#9b8e85;margin:0 0 20px;font-size:14px">Galería: ${data.galleryTitle} · #${data.orderId.slice(0, 8)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}
      <tr><td style="padding:10px 12px;font-weight:600">Total</td><td style="padding:10px 12px;text-align:right;font-weight:600">${formatARS(
        data.total,
      )}</td></tr>
    </table>
    <h3 style="font-family:Georgia,serif;font-weight:400;margin:24px 0 8px">Cliente</h3>
    <p style="margin:0;font-size:14px;line-height:1.6">
      ${data.customer.name}<br>
      ${data.customer.email} · ${data.customer.phone}<br>
      ${data.shipping.street}, ${data.shipping.city} ${data.shipping.zip ?? ""}
    </p>
    ${data.notes ? `<p style="margin:14px 0 0;font-size:13px;color:#9b8e85"><b>Notas:</b> ${data.notes}</p>` : ""}
  </div></body></html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: resendFrom,
      to: [adminEmail],
      subject: `Nuevo pedido — ${data.galleryTitle} · ${formatARS(data.total)}`,
      html,
    }),
  });
}

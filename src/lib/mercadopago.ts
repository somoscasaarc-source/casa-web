const MP_ACCESS = process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";

export function mercadopagoConfigured() {
  return Boolean(MP_ACCESS);
}

type PreferenceItem = {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: "ARS";
};

type PreferenceInput = {
  items: PreferenceItem[];
  external_reference: string;
  payer: { name?: string; email: string };
  back_urls: { success: string; failure: string; pending: string };
  notification_url?: string;
};

export async function createPreference(input: PreferenceInput) {
  if (!MP_ACCESS) throw new Error("mercadopago_not_configured");
  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MP_ACCESS}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: input.items.map((it) => ({
        ...it,
        currency_id: it.currency_id ?? "ARS",
      })),
      external_reference: input.external_reference,
      payer: input.payer,
      back_urls: input.back_urls,
      notification_url: input.notification_url,
      auto_return: "approved",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`mp_${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as {
    id: string;
    init_point: string;
    sandbox_init_point: string;
  };
}

export async function getPayment(paymentId: string) {
  if (!MP_ACCESS) throw new Error("mercadopago_not_configured");
  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: { Authorization: `Bearer ${MP_ACCESS}` },
    },
  );
  if (!res.ok) throw new Error(`mp_payment_${res.status}`);
  return (await res.json()) as {
    id: number;
    status: string;
    status_detail: string;
    external_reference: string | null;
    metadata?: Record<string, unknown>;
  };
}

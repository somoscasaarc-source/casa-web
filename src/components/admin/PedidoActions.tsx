"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const NEXT: Record<string, string> = {
  pending: "preparando",
  preparando: "enviado",
  enviado: "entregado",
};

export default function PedidoActions({
  orderId,
  shippingStatus,
}: {
  orderId: string;
  shippingStatus: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const next = NEXT[shippingStatus];
  if (!next) return <span className="label">Cerrado</span>;

  const update = async () => {
    setBusy(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ shipping_status: next }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  };

  return (
    <button
      className="btn btn-outline adm-row-btn"
      onClick={update}
      disabled={busy}
    >
      {busy ? "…" : `Marcar ${next}`}
    </button>
  );
}

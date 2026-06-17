"use client";

import { useState } from "react";

export default function SendGalleryButton({
  galleryId,
  clientEmail,
  clientName,
  alreadySent,
}: {
  galleryId: string;
  clientEmail: string;
  clientName: string | null;
  alreadySent: boolean;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    alreadySent ? "sent" : "idle"
  );

  const send = async () => {
    if (!confirm(`Enviar la galería a ${clientEmail}?`)) return;
    setState("sending");
    try {
      const res = await fetch(`/api/admin/galleries/${galleryId}/send`, { method: "POST" });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="adm-send-box">
      <div>
        <div className="label">Notificar al cliente</div>
        <div className="adm-send-email">{clientEmail}</div>
        {alreadySent && state === "sent" && (
          <div className="adm-send-hint">✓ Ya fue notificado — podés reenviar si querés.</div>
        )}
        {state === "error" && (
          <div className="adm-send-hint adm-send-err">Error al enviar. Revisá la clave de Resend.</div>
        )}
      </div>
      <button
        className={`btn ${state === "sent" && !alreadySent ? "btn-outline" : "btn-siena"}`}
        onClick={send}
        disabled={state === "sending"}
      >
        {state === "sending"
          ? "Enviando…"
          : state === "sent" && !alreadySent
          ? "✓ Enviado"
          : alreadySent
          ? "Reenviar galería"
          : `Enviar a ${clientName ?? "cliente"}`}
      </button>
    </div>
  );
}

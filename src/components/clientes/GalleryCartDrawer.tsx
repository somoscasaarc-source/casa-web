"use client";

import { useState } from "react";
import { formatARS } from "@/lib/gallery-shop";
import type { GalleryCartItem } from "./galleryCart";

type Step = "cart" | "checkout" | "done" | "redirect";

export default function GalleryCartDrawer({
  token,
  items,
  total,
  onClose,
  onRemove,
  onSetQty,
  onClear,
}: {
  token: string;
  items: GalleryCartItem[];
  total: number;
  onClose: () => void;
  onRemove: (lineId: string) => void;
  onSetQty: (lineId: string, qty: number) => void;
  onClear: () => void;
}) {
  const [step, setStep] = useState<Step>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    notes: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const valid =
    form.name.trim().length > 1 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) &&
    form.phone.trim().length > 5 &&
    form.street.trim().length > 2 &&
    form.city.trim().length > 1;

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/clientes/${token}/order`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            photoId: i.photoId,
            photoName: i.photoName,
          })),
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
          },
          shipping: {
            street: form.street.trim(),
            city: form.city.trim(),
            zip: form.zip.trim(),
          },
          notes: form.notes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No pudimos procesar el pedido.");
        setSubmitting(false);
        return;
      }
      if (data.init_point) {
        // MercadoPago configured → redirect to payment
        setStep("redirect");
        window.location.href = data.init_point;
        return;
      }
      // No online payment → order received, studio will coordinate
      onClear();
      setStep("done");
    } catch {
      setError("Error de conexión. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gcart-overlay" onClick={onClose}>
      <aside className="gcart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="gcart-head">
          <div className="label">
            {step === "checkout" ? "Tus datos de envío" : step === "done" ? "¡Pedido recibido!" : "Tu pedido"}
          </div>
          <button className="gcart-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {step === "done" ? (
          <div className="gcart-done">
            <div className="gcart-done-mark">✓</div>
            <h3 className="serif gcart-done-title">¡Gracias!</h3>
            <p className="gcart-done-body">
              Recibimos tu pedido. Te vamos a escribir por email o WhatsApp para coordinar el pago
              y la entrega. Cualquier duda, escribinos a somoscasa.ar@gmail.com.
            </p>
            <button className="btn btn-dark" onClick={onClose}>
              Volver a la galería
            </button>
          </div>
        ) : step === "redirect" ? (
          <div className="gcart-done">
            <p className="serif-italic gcart-done-body">Te estamos llevando al pago seguro…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="gcart-empty">
            <p className="serif-italic">Tu pedido está vacío.</p>
            <p className="gcart-empty-hint">
              Tocá “Pedir impresión” en cualquier foto para empezar.
            </p>
          </div>
        ) : (
          <>
            {/* Items */}
            <ul className="gcart-list">
              {items.map((i) => (
                <li key={i.lineId} className="gcart-item">
                  {i.photoThumb ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={i.photoThumb} alt="" className="gcart-thumb" />
                  ) : (
                    <div className="gcart-thumb gcart-thumb-album serif">Álbum</div>
                  )}
                  <div className="gcart-item-body">
                    <div className="gcart-item-name">{i.productName}</div>
                    {i.photoName && <div className="gcart-item-photo">{i.photoName}</div>}
                    <div className="gcart-item-price">{formatARS(i.price)} c/u</div>
                    {step === "cart" && (
                      <div className="gcart-qty">
                        <button onClick={() => onSetQty(i.lineId, i.qty - 1)} aria-label="Menos">
                          −
                        </button>
                        <span>{i.qty}</span>
                        <button onClick={() => onSetQty(i.lineId, i.qty + 1)} aria-label="Más">
                          +
                        </button>
                        <button className="gcart-remove" onClick={() => onRemove(i.lineId)}>
                          Quitar
                        </button>
                      </div>
                    )}
                    {step === "checkout" && (
                      <div className="gcart-item-qtystatic">Cantidad: {i.qty}</div>
                    )}
                  </div>
                  <div className="gcart-item-sub">{formatARS(i.price * i.qty)}</div>
                </li>
              ))}
            </ul>

            {/* Checkout form */}
            {step === "checkout" && (
              <div className="gcart-form">
                <div className="gcart-field">
                  <label>Nombre y apellido</label>
                  <input className="adm-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="gcart-field-row">
                  <div className="gcart-field">
                    <label>Email</label>
                    <input className="adm-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div className="gcart-field">
                    <label>Teléfono / WhatsApp</label>
                    <input className="adm-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                </div>
                <div className="gcart-field">
                  <label>Dirección de envío</label>
                  <input className="adm-input" placeholder="Calle y número" value={form.street} onChange={(e) => set("street", e.target.value)} />
                </div>
                <div className="gcart-field-row">
                  <div className="gcart-field">
                    <label>Ciudad</label>
                    <input className="adm-input" value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div className="gcart-field">
                    <label>Código postal</label>
                    <input className="adm-input" value={form.zip} onChange={(e) => set("zip", e.target.value)} />
                  </div>
                </div>
                <div className="gcart-field">
                  <label>Notas (opcional)</label>
                  <textarea className="adm-input" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                </div>
                {error && <div className="gcart-error">{error}</div>}
              </div>
            )}

            {/* Footer */}
            <div className="gcart-foot">
              <div className="gcart-total">
                <span className="label">Total</span>
                <span className="serif gcart-total-num">{formatARS(total)}</span>
              </div>
              {step === "cart" ? (
                <button className="btn btn-dark gcart-cta" onClick={() => setStep("checkout")}>
                  Continuar
                </button>
              ) : (
                <div className="gcart-checkout-actions">
                  <button className="btn btn-outline" onClick={() => setStep("cart")} disabled={submitting}>
                    Volver
                  </button>
                  <button className="btn btn-siena gcart-cta" onClick={submit} disabled={!valid || submitting}>
                    {submitting ? "Enviando…" : "Confirmar pedido"}
                  </button>
                </div>
              )}
              {step === "checkout" && !valid && (
                <p className="gcart-hint">Completá nombre, email, teléfono y dirección.</p>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

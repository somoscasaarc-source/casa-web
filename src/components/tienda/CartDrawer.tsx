"use client";

import { useState } from "react";
import { useCart } from "@/components/tienda/cart";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const checkout = async () => {
    if (cart.items.length === 0) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            id: i.id,
            qty: i.qty,
          })),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "no_create");
      }
      const j = await res.json();
      if (j?.init_point) {
        window.location.href = j.init_point as string;
        return;
      }
      throw new Error("no_init_point");
    } catch (e) {
      setErr(
        e instanceof Error
          ? `No pudimos iniciar el pago: ${e.message}`
          : "Error al iniciar el pago.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <header className="cart-head">
          <div className="label">Carrito</div>
          <button className="cart-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        {cart.items.length === 0 ? (
          <p className="serif-italic" style={{ color: "var(--ceniza)" }}>
            Todavía no sumaste nada.
          </p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.items.map((i) => (
                <li key={i.id} className="cart-item">
                  <div className="photo cart-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.thumb} alt={i.name} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="serif" style={{ fontSize: 18 }}>
                      {i.name}
                    </div>
                    <div className="label">
                      ARS{" "}
                      {i.price.toLocaleString("es-AR", {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div className="cart-qty">
                      <button
                        onClick={() => cart.setQty(i.id, i.qty - 1)}
                        aria-label="Menos"
                      >
                        −
                      </button>
                      <span>{i.qty}</span>
                      <button
                        onClick={() => cart.setQty(i.id, i.qty + 1)}
                        aria-label="Más"
                      >
                        +
                      </button>
                      <button
                        className="cart-remove"
                        onClick={() => cart.remove(i.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart-foot">
              <div className="cart-total">
                <span className="label">Total</span>
                <span className="serif" style={{ fontSize: 28 }}>
                  ARS{" "}
                  {cart.total.toLocaleString("es-AR", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              {err && <span className="cf-err">{err}</span>}
              <button
                className="btn btn-dark"
                onClick={checkout}
                disabled={busy}
              >
                {busy ? "Yendo a MercadoPago…" : "Pagar"}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

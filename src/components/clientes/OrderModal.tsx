"use client";

import { useState } from "react";
import {
  PRINT_PRODUCTS,
  ALBUM_PRODUCTS,
  formatARS,
  type ShopProduct,
} from "@/lib/gallery-shop";

export type OrderTarget =
  | { mode: "photo"; id: string; thumb: string; name: string | null }
  | { mode: "album" };

export default function OrderModal({
  target,
  onClose,
  onAdd,
}: {
  target: OrderTarget;
  onClose: () => void;
  onAdd: (
    product: ShopProduct,
    qty: number,
    photo?: { id: string; thumb: string; name: string | null } | null,
  ) => void;
}) {
  const products = target.mode === "album" ? ALBUM_PRODUCTS : PRINT_PRODUCTS;
  const [selected, setSelected] = useState<string>(products[0].id);
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.id === selected) ?? products[0];

  const handleAdd = () => {
    if (target.mode === "photo") {
      onAdd(product, qty, { id: target.id, thumb: target.thumb, name: target.name });
    } else {
      onAdd(product, qty, null);
    }
    onClose();
  };

  return (
    <div className="om-overlay" onClick={onClose}>
      <div className="om-card" onClick={(e) => e.stopPropagation()}>
        <button className="om-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="label">
          {target.mode === "album" ? "Pedir álbum de la boda" : "Pedir impresión"}
        </div>

        <div className="om-body">
          {/* Preview */}
          {target.mode === "photo" && (
            <div className="om-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={target.thumb} alt={target.name ?? ""} />
            </div>
          )}
          {target.mode === "album" && (
            <div className="om-preview om-preview-album">
              <span className="serif">Álbum</span>
            </div>
          )}

          {/* Product picker */}
          <div className="om-options">
            <div className="om-options-label label">Elegí el formato</div>
            <div className="om-radios">
              {products.map((p) => (
                <label
                  key={p.id}
                  className={`om-radio ${selected === p.id ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="format"
                    checked={selected === p.id}
                    onChange={() => setSelected(p.id)}
                  />
                  <span className="om-radio-main">
                    <span className="om-radio-name">{p.name}</span>
                    <span className="om-radio-blurb">{p.blurb}</span>
                  </span>
                  <span className="om-radio-price">{formatARS(p.price)}</span>
                </label>
              ))}
            </div>

            {/* Quantity */}
            <div className="om-qty-row">
              <span className="label">Cantidad</span>
              <div className="om-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Más">
                  +
                </button>
              </div>
            </div>

            <button className="btn btn-dark om-add" onClick={handleAdd}>
              Agregar al pedido · {formatARS(product.price * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

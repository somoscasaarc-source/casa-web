"use client";

import { useMemo, useState } from "react";
import { CATEGORIAS, type Producto } from "@/lib/tienda";
import { useCart } from "@/components/tienda/cart";
import CartDrawer from "@/components/tienda/CartDrawer";

export default function TiendaCatalog({ products }: { products: Producto[] }) {
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]["id"]>("todos");
  const [open, setOpen] = useState(false);
  const cart = useCart();

  const items = useMemo(
    () => (cat === "todos" ? products : products.filter((p) => p.category === cat)),
    [products, cat],
  );

  return (
    <>
      <div className="pf-bar">
        <div className="wrap pf-bar-inner">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              className={`pf-pill ${cat === c.id ? "is-active" : ""}`}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
          <button
            className="pf-pill"
            onClick={() => setOpen(true)}
            style={{ marginLeft: "auto" }}
          >
            🛒 Carrito ({cart.totalItems})
          </button>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="tienda-grid">
            {items.map((p) => (
              <article key={p.id} className="td-card">
                <div className="photo" style={{ aspectRatio: "4 / 5" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.thumb} alt={p.name} loading="lazy" />
                </div>
                <div className="td-body">
                  <h3 className="serif td-name">{p.name}</h3>
                  <p className="td-blurb">{p.blurb}</p>
                  <div className="td-foot">
                    <span className="td-price">
                      ARS{" "}
                      {p.price.toLocaleString("es-AR", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <button
                      className="btn btn-outline td-btn"
                      onClick={() => {
                        cart.add(p);
                        setOpen(true);
                      }}
                    >
                      Sumar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

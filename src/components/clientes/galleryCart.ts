"use client";

import { useEffect, useState, useCallback } from "react";
import type { ShopProduct } from "@/lib/gallery-shop";

export type GalleryCartItem = {
  /** Identificador único de la línea (producto + foto). */
  lineId: string;
  productId: string;
  productName: string;
  kind: ShopProduct["kind"];
  price: number;
  qty: number;
  /** null para álbumes (toda la boda). */
  photoId: string | null;
  photoThumb: string | null;
  photoName: string | null;
};

function keyFor(token: string) {
  return `casa-gallery-cart-${token}`;
}

function read(token: string): GalleryCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(keyFor(token)) ?? "[]");
  } catch {
    return [];
  }
}

function write(token: string, items: GalleryCartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keyFor(token), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("casa:gallery-cart"));
}

export function useGalleryCart(token: string) {
  const [items, setItems] = useState<GalleryCartItem[]>([]);

  useEffect(() => {
    setItems(read(token));
    const onChange = () => setItems(read(token));
    window.addEventListener("casa:gallery-cart", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("casa:gallery-cart", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [token]);

  const add = useCallback(
    (
      product: ShopProduct,
      qty: number,
      photo?: { id: string; thumb: string; name: string | null } | null,
    ) => {
      const photoId = photo?.id ?? null;
      const lineId = `${product.id}__${photoId ?? "boda"}`;
      const next = [...read(token)];
      const existing = next.find((i) => i.lineId === lineId);
      if (existing) {
        existing.qty += qty;
      } else {
        next.push({
          lineId,
          productId: product.id,
          productName: product.name,
          kind: product.kind,
          price: product.price,
          qty,
          photoId,
          photoThumb: photo?.thumb ?? null,
          photoName: photo?.name ?? null,
        });
      }
      write(token, next);
    },
    [token],
  );

  const remove = useCallback(
    (lineId: string) => write(token, read(token).filter((i) => i.lineId !== lineId)),
    [token],
  );

  const setQty = useCallback(
    (lineId: string, qty: number) => {
      if (qty < 1) return write(token, read(token).filter((i) => i.lineId !== lineId));
      write(token, read(token).map((i) => (i.lineId === lineId ? { ...i, qty } : i)));
    },
    [token],
  );

  const clear = useCallback(() => write(token, []), [token]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return { items, add, remove, setQty, clear, totalItems, total };
}

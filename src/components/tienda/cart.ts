"use client";

import { useEffect, useState } from "react";
import type { Producto } from "@/lib/tienda";

const KEY = "casa-cart-v1";

type CartItem = {
  id: string;
  name: string;
  price: number;
  thumb: string;
  qty: number;
};

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("casa:cart"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener("casa:cart", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("casa:cart", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = (p: Producto) => {
    const next = [...read()];
    const existing = next.find((i) => i.id === p.id);
    if (existing) existing.qty += 1;
    else
      next.push({
        id: p.id,
        name: p.name,
        price: p.price,
        thumb: p.thumb,
        qty: 1,
      });
    write(next);
  };

  const remove = (id: string) => write(read().filter((i) => i.id !== id));

  const setQty = (id: string, qty: number) => {
    if (qty < 1) return remove(id);
    write(read().map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clear = () => write([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return { items, add, remove, setQty, clear, totalItems, total };
}

"use client";

import { useCallback, useState } from "react";
import Lightbox from "./Lightbox";

type Item = { id: string; title: string; sub: string; src: string };

export default function PortfolioGrid({ items }: { items: Item[] }) {
  const [lb, setLb] = useState<number | null>(null);

  const nav = useCallback(
    (d: number) => {
      setLb((i) => (i == null ? i : (i + d + items.length) % items.length));
    },
    [items.length],
  );

  return (
    <>
      <div className="pf-masonry">
        {items.map((it, i) => (
          <button
            key={it.id}
            className="pf-tile"
            onClick={() => setLb(i)}
            aria-label={`${it.title} — ${it.sub}`}
          >
            <div className="photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.title} loading="lazy" />
            </div>
            <div className="pf-tile-over">
              <span className="serif pf-tile-title">{it.title}</span>
              <span className="label" style={{ color: "var(--pergamino)" }}>
                {it.sub}
              </span>
            </div>
          </button>
        ))}
      </div>
      <Lightbox
        items={items}
        index={lb}
        onClose={() => setLb(null)}
        onNav={nav}
      />
    </>
  );
}

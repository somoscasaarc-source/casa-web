"use client";

import { useEffect } from "react";

type Item = { src: string; title?: string; sub?: string };

export default function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: Item[];
  index: number | null;
  onClose: () => void;
  onNav: (delta: number) => void;
}) {
  useEffect(() => {
    if (index == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNav]);

  if (index == null) return null;
  const it = items[index];

  return (
    <div className="lb" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Cerrar">
        ✕
      </button>
      <button
        className="lb-arrow lb-prev"
        onClick={(e) => {
          e.stopPropagation();
          onNav(-1);
        }}
        aria-label="Anterior"
      >
        ←
      </button>
      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={it.src} alt={it.title ?? ""} key={it.src} />
        {(it.title || it.sub) && (
          <div className="lb-meta">
            {it.title && <span className="serif lb-title">{it.title}</span>}
            {it.sub && (
              <span className="label" style={{ color: "var(--ceniza)" }}>
                {it.sub}
              </span>
            )}
          </div>
        )}
      </div>
      <button
        className="lb-arrow lb-next"
        onClick={(e) => {
          e.stopPropagation();
          onNav(1);
        }}
        aria-label="Siguiente"
      >
        →
      </button>
      <div className="lb-count mono">
        {index + 1} / {items.length}
      </div>
    </div>
  );
}

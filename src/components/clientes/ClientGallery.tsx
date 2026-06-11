"use client";

import Link from "next/link";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";

export type PhotoWithUrl = {
  id: string;
  url: string;
  original_filename: string | null;
};

export default function ClientGallery({
  token,
  title,
  eventDate,
  photos,
}: {
  token: string;
  title: string;
  eventDate: string | null;
  photos: PhotoWithUrl[];
}) {
  const [lb, setLb] = useState<number | null>(null);

  const items = photos.map((p) => ({
    src: p.url,
    title: undefined,
    sub: p.original_filename ?? undefined,
  }));

  const nav = (d: number) =>
    setLb((i) => (i == null ? i : (i + d + photos.length) % photos.length));

  const downloadAll = async () => {
    window.location.href = `/api/clientes/${token}/zip`;
  };

  return (
    <main className="gal">
      <header className="gal-head">
        <Link href="/" className="wordmark gal-mark" aria-label="CASA">
          CASA
        </Link>
        <span className="gal-head-c label">Galería privada</span>
        <div className="gal-head-r">
          <Link href="/" className="gal-logout">
            Salir
          </Link>
        </div>
      </header>

      <div className="gal-title-bar">
        <div className="wrap gal-title-inner">
          <h1 className="serif gal-title">{title}</h1>
          {eventDate && (
            <span className="gal-date">
              {new Date(eventDate).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="gal-empty serif-italic">
          Tu galería se está armando. Volvé en unos días.
        </div>
      ) : (
        <div className="gal-grid">
          {photos.map((p, i) => (
            <div key={p.id} className="gal-cell">
              <button
                className="gal-cell-btn"
                onClick={() => setLb(i)}
                aria-label={`Foto ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.original_filename ?? ""} loading="lazy" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="gal-bar">
          <div className="gal-bar-count">
            <span className="gal-bar-num">{photos.length}</span> fotos
          </div>
          <div className="gal-bar-actions">
            <button
              className="btn btn-dark gal-bar-btn"
              onClick={downloadAll}
            >
              Descargar todo (ZIP)
            </button>
          </div>
        </div>
      )}

      <Lightbox
        items={items}
        index={lb}
        onClose={() => setLb(null)}
        onNav={nav}
      />
    </main>
  );
}

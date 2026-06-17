"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type Collection = { id: string; name: string; sort_order: number };

export default function AdminCollections({
  galleryId,
  initial,
}: {
  galleryId: string;
  initial: Collection[];
}) {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>(initial);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const add = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/admin/galleries/${galleryId}/collections`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), sort_order: collections.length }),
      });
      if (res.ok) {
        const { collection } = await res.json();
        setCollections((prev) => [...prev, collection]);
        setNewName("");
        router.refresh();
      }
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Borrar esta colección? Las fotos no se borran.")) return;
    const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  };

  const rename = async (id: string, name: string) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
    await fetch(`/api/admin/collections/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
  };

  return (
    <section className="adm-colls">
      <div className="label adm-settings-title">Colecciones</div>
      <p className="adm-settings-hint" style={{ marginBottom: 16 }}>
        Agrupá las fotos en colecciones (ej: Ceremonia, Fiesta, Retratos). El cliente puede filtrar por cada una.
      </p>

      {collections.length > 0 && (
        <ul className="adm-coll-list">
          {collections.map((c) => (
            <li key={c.id} className="adm-coll-item">
              <input
                className="adm-input adm-coll-input"
                value={c.name}
                onChange={(e) => setCollections((prev) => prev.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))}
                onBlur={(e) => rename(c.id, e.target.value)}
              />
              <button
                className="adm-pg-btn adm-pg-del"
                onClick={() => remove(c.id)}
                title="Borrar colección"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="adm-coll-add">
        <input
          type="text"
          className="adm-input"
          placeholder="Nueva colección (ej: Ceremonia)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          style={{ flex: 1 }}
        />
        <button className="btn btn-outline" onClick={add} disabled={adding || !newName.trim()}>
          {adding ? "…" : "+ Agregar"}
        </button>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState, type FormEvent } from "react";

type Pkg = { id: string; name: string; blurb: string };

export default function ReservaForm({
  packages,
  depositAmount,
}: {
  packages: Pkg[];
  depositAmount: number;
}) {
  const [f, setF] = useState({
    nombre: "",
    email: "",
    tel: "",
    eventoTipo: "boda" as "boda" | "quince",
    eventoFecha: "",
    paquete: packages[1]?.id ?? packages[0]?.id ?? "",
    notas: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set =
    <K extends keyof typeof f>(k: K) =>
    (v: (typeof f)[K]) =>
      setF((p) => ({ ...p, [k]: v }));

  const selected = useMemo(
    () => packages.find((p) => p.id === f.paquete),
    [packages, f.paquete],
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(f),
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

  return (
    <form className="cf" onSubmit={submit} noValidate>
      <div className="label cf-eyebrow">Seña · 40%</div>

      <label className="cf-field">
        <span className="cf-label label">Nombre completo</span>
        <input
          className="cf-input"
          value={f.nombre}
          onChange={(e) => set("nombre")(e.target.value)}
          required
        />
      </label>

      <label className="cf-field">
        <span className="cf-label label">Email</span>
        <input
          className="cf-input"
          type="email"
          value={f.email}
          onChange={(e) => set("email")(e.target.value)}
          required
        />
      </label>

      <label className="cf-field">
        <span className="cf-label label">Teléfono</span>
        <input
          className="cf-input"
          type="tel"
          value={f.tel}
          onChange={(e) => set("tel")(e.target.value)}
        />
      </label>

      <label className="cf-field">
        <span className="cf-label label">Paquete elegido</span>
        <div className="cf-select-wrap">
          <select
            className="cf-input cf-select"
            value={f.paquete}
            onChange={(e) => set("paquete")(e.target.value)}
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span className="cf-select-chev" aria-hidden>▾</span>
        </div>
        {selected && (
          <span className="label" style={{ marginTop: 6 }}>
            {selected.blurb}
          </span>
        )}
      </label>

      <label className="cf-field">
        <span className="cf-label label">Tipo de evento</span>
        <div className="cf-select-wrap">
          <select
            className="cf-input cf-select"
            value={f.eventoTipo}
            onChange={(e) => set("eventoTipo")(e.target.value as "boda" | "quince")}
          >
            <option value="boda">Boda</option>
            <option value="quince">Quince</option>
          </select>
          <span className="cf-select-chev" aria-hidden>▾</span>
        </div>
      </label>

      <label className="cf-field">
        <span className="cf-label label">Fecha del evento</span>
        <input
          className="cf-input"
          type="date"
          value={f.eventoFecha}
          onChange={(e) => set("eventoFecha")(e.target.value)}
          required
        />
      </label>

      <label className="cf-field">
        <span className="cf-label label">Notas (opcional)</span>
        <textarea
          className="cf-input cf-textarea"
          rows={3}
          value={f.notas}
          onChange={(e) => set("notas")(e.target.value)}
          placeholder="Locación, cantidad de invitados, qué te imaginás…"
        />
      </label>

      <div
        style={{
          border: "1px solid var(--ceniza-line)",
          padding: "20px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div className="label">Seña a pagar</div>
          <div className="serif" style={{ fontSize: 28, marginTop: 4 }}>
            ARS{" "}
            {depositAmount.toLocaleString("es-AR", {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
        <span className="label" style={{ textAlign: "right" }}>
          MercadoPago · Pago seguro
        </span>
      </div>

      {err && <span className="cf-err">{err}</span>}
      <button type="submit" className="btn btn-dark cf-submit" disabled={busy}>
        {busy ? "Redirigiendo a MercadoPago…" : "Pagar seña y reservar"}
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ClientesLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const c = code.trim();
    if (!c) {
      setError("Ingresá el código que te enviamos.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    // Phase 2: route to /clientes/[token]. For now we show a friendly notice.
    setError(
      "Las galerías privadas se habilitan próximamente. Mientras tanto, escribinos y te las enviamos por mail.",
    );
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <main className="cl-login">
      <Link href="/" className="wordmark cl-back" aria-label="Volver a CASA">
        CASA
      </Link>

      <div className={`cl-card ${shake ? "shake" : ""}`}>
        <div className="wordmark cl-card-mark">CASA</div>
        <h1 className="serif cl-card-title">Área de clientes</h1>
        <p className="cl-card-sub">
          Ingresá el código privado que recibiste por mail.
        </p>

        <form className="cl-form" onSubmit={submit} noValidate>
          <input
            className={`cl-input ${error ? "cl-input-err" : ""}`}
            type="text"
            placeholder="CÓDIGO DE ACCESO"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            autoFocus
          />
          {error && <span className="cl-err">{error}</span>}
          <button type="submit" className="btn btn-dark cl-submit">
            Entrar
          </button>
        </form>

        <p className="label cl-hint">
          ¿No tenés código?{" "}
          <Link href="/contacto" style={{ color: "var(--siena)" }}>
            Escribinos
          </Link>
          .
        </p>

        <p className="cl-foot">
          Las galerías están protegidas. Solo podés acceder con tu link privado.
        </p>
      </div>
    </main>
  );
}

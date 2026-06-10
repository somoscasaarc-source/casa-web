import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { IMG, PILARES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros — CASA",
  description:
    "Samuel Gutiérrez y CASA, estudio audiovisual en Villa Crespo. Editorial, documental, cálido.",
};

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pg-hero">
          <div className="wrap">
            <Reveal>
              <div className="label">Nosotros</div>
              <h1 className="serif pg-hero-title">La cámara como testigo.</h1>
            </Reveal>
          </div>
        </section>

        {/* About — split */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "5fr 6fr",
                gap: 60,
                alignItems: "start",
              }}
              className="nos-split"
            >
              <Reveal>
                <div className="photo" style={{ aspectRatio: "4 / 5" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG.samuel} alt="Samuel trabajando" loading="lazy" />
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div style={{ paddingTop: 40 }}>
                  <div className="label">Samuel Gutiérrez</div>
                  <h2
                    className="serif"
                    style={{
                      fontSize: 44,
                      lineHeight: 1.05,
                      margin: "16px 0 28px",
                    }}
                  >
                    Soy filmmaker y fotógrafo. Trabajo desde Villa Crespo.
                  </h2>
                  <p className="body" style={{ color: "var(--ceniza)", marginBottom: 20 }}>
                    CASA nació para registrar bodas y quinces como
                    se viven, no como se posan. Equipos chicos, atención completa,
                    y un trato que no se siente profesional —se siente cercano.
                  </p>
                  <p className="body" style={{ color: "var(--ceniza)" }}>
                    Antes de empezar a disparar, charlamos. Conocer a la familia,
                    la pareja, los gestos chicos: eso es lo que después se ve en
                    el material. Lo demás es oficio.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Pilares */}
        <section className="section" style={{ background: "var(--pergamino)", paddingTop: 0 }}>
          <div className="wrap">
            <Reveal>
              <div className="label">Filosofía</div>
              <h2
                className="serif"
                style={{
                  fontSize: 52,
                  lineHeight: 1.04,
                  margin: "14px 0 80px",
                  maxWidth: 760,
                }}
              >
                Tres pilares. No los movemos.
              </h2>
            </Reveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 48,
                borderTop: "1px solid var(--ceniza-line)",
                paddingTop: 56,
              }}
              className="pilares-grid"
            >
              {PILARES.map((p, i) => (
                <Reveal key={p.n} delay={i * 90}>
                  <div>
                    <div
                      className="serif"
                      style={{ fontSize: 52, color: "var(--siena)", lineHeight: 1 }}
                    >
                      {p.n}
                    </div>
                    <h3
                      className="serif"
                      style={{ fontSize: 26, margin: "20px 0 16px", lineHeight: 1.2 }}
                    >
                      {p.title}
                    </h3>
                    <p className="body" style={{ color: "var(--ceniza)", fontSize: 15 }}>
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-final center">
          <div className="wrap">
            <Reveal>
              <h2 className="serif cta-title">Hablemos.</h2>
              <p className="cta-sub">
                Contanos tu fecha y armamos la cobertura juntos.
              </p>
              <Link href="/contacto" className="btn btn-dark cta-btn">
                Quiero consultar
              </Link>
            </Reveal>
            <p className="label" style={{ marginTop: 40 }}>
              o escribinos a{" "}
              <a href={`mailto:${SITE.email}`} style={{ color: "var(--siena)" }}>
                {SITE.email}
              </a>
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

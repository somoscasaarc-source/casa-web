import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PackageCard from "@/components/PackageCard";
import EditorialGallery from "@/components/EditorialGallery";
import FAQ from "@/components/FAQ";
import { FAQ_QUINCES, GALLERY_QUINCES, PACKAGES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quinces — CASA",
  description:
    "Fotografía y video para quinceañeras en Buenos Aires. Editorial, sin coreografía vacía.",
};

export default function QuincesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pg-hero">
          <div className="wrap">
            <Reveal>
              <div className="label">Quinces</div>
              <h1 className="serif pg-hero-title">Quince años, en su luz.</h1>
              <p className="serif-italic pg-hero-sub">
                Sin coreografía vacía. Solo tu historia.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <Reveal>
              <EditorialGallery photos={GALLERY_QUINCES} />
            </Reveal>
          </div>
        </section>

        <section className="section svc-brief" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="svc-brief-head">
              <Reveal>
                <div className="label">Paquetes</div>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="serif svc-brief-title">
                  Tres formas de contar tu quince.
                </h2>
              </Reveal>
            </div>

            <div className="pk-grid">
              {PACKAGES.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <PackageCard pkg={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section sv-custom">
          <div className="wrap">
            <Reveal className="sv-custom-inner">
              <div className="label">A medida</div>
              <h2 className="serif sv-custom-title">
                Cada quince es distinto.
              </h2>
              <p className="body sv-custom-body">
                Sumamos una sesión preliminar, una segunda cámara, un álbum
                impreso o lo que te imagines. Lo armamos juntos.
              </p>
              <div className="sv-custom-actions">
                <Link href="/contacto" className="btn btn-dark">
                  Armemos tu paquete
                </Link>
                <a
                  className="link-arrow"
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hablemos por WhatsApp <span className="arr">→</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <Reveal>
              <div className="label">FAQ</div>
              <h2
                className="serif"
                style={{ fontSize: 48, lineHeight: 1.05, margin: "14px 0 60px" }}
              >
                Lo que nos preguntan seguido.
              </h2>
            </Reveal>
            <Reveal>
              <FAQ items={FAQ_QUINCES} />
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

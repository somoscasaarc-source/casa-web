import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PackageCard from "@/components/PackageCard";
import EditorialGallery from "@/components/EditorialGallery";
import { GALLERY, PACKAGES, SITE, TESTIMONIALS } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero — wordmark composition, no full-bleed image */}
        <section className="hero hero--noimg">
          <div className="hero-content">
            <div className="hero-inner">
              <div className="label hero-eyebrow">{SITE.city}</div>

              <h1 className="wordmark hero-mark">CASA</h1>

              <div className="rule hero-rule" />

              <p className="serif-italic hero-tag">{SITE.tagline}</p>

              <p className="hero-disc">Fotografía · Video · Bodas · Quinceañeras</p>

              <div className="hero-actions">
                <Link href="/bodas" className="btn btn-dark">Ver bodas</Link>
                <Link href="/contacto" className="btn btn-siena">Reservar fecha</Link>
              </div>
            </div>

            <div className="hero-scroll">
              <span className="label">Scroll</span>
              <span className="hero-scroll-line" aria-hidden />
            </div>
          </div>
        </section>

        {/* Qué hacemos */}
        <section className="about--text">
          <div className="wrap" style={{ display: "flex" }}>
            <Reveal className="about-inner">
              <div className="label">Qué hacemos</div>
              <h2 className="serif about-title">
                Bodas y quinces, contadas como se viven.
              </h2>
              <p className="body about-body">
                Somos un estudio audiovisual chico, con base en Villa Crespo.
                Filmamos y fotografiamos bodas y quinceañeras con un enfoque
                editorial y documental. Cuidamos la luz, los gestos y el ritmo.
                Lo demás —si te divertís, si bailás, si llorás— ya lo trae el día.
              </p>
              <Link href="/nosotros" className="link-arrow">
                Conocenos <span className="arr">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Editorial gallery */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal>
              <div className="label" style={{ marginBottom: 18 }}>
                Trabajos recientes
              </div>
              <h2
                className="serif pf-prev-title"
                style={{ color: "var(--ebano)", marginBottom: 80 }}
              >
                Una historia por contar.
              </h2>
            </Reveal>
            <Reveal>
              <EditorialGallery photos={GALLERY} />
            </Reveal>
            <Reveal className="center">
              <Link
                href="/bodas"
                className="link-arrow"
                style={{ color: "var(--siena)" }}
              >
                Ver más trabajos <span className="arr">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Paquetes */}
        <section className="section svc-brief">
          <div className="wrap">
            <div className="svc-brief-head">
              <Reveal>
                <div className="label">Servicios</div>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="serif svc-brief-title">
                  Tres formas de trabajar juntos.
                </h2>
              </Reveal>
            </div>

            <div className="pk-grid">
              {PACKAGES.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <PackageCard
                    pkg={{
                      ...p,
                      features: (p.homeFeatures ?? p.features).slice(0, 4),
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* A medida */}
        <section className="section sv-custom">
          <div className="wrap">
            <Reveal className="sv-custom-inner">
              <div className="label">A medida</div>
              <h2 className="serif sv-custom-title">Cada historia es distinta.</h2>
              <p className="body sv-custom-body">
                Además de nuestros paquetes, podés armar tu propia experiencia a
                medida. Sumamos servicios sueltos —una sesión de pareja, un
                getting ready, drone, un álbum impreso— y armamos la cobertura
                exacta que tu boda o tu quince necesita. Contanos qué te imaginás.
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

        {/* Testimonial */}
        <section className="quote">
          <div className="wrap">
            <div className="quote-inner">
              <span className="quote-mark serif">&ldquo;</span>
              <Reveal>
                <p className="serif-italic quote-text">
                  {TESTIMONIALS[0].quote}
                </p>
                <p className="quote-attr">— {TESTIMONIALS[0].attr}</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="section cta-final center">
          <div className="wrap">
            <Reveal>
              <h2 className="serif cta-title">¿Tenés fecha?</h2>
              <p className="cta-sub">
                Recibimos consultas para 2026 y 2027.
              </p>
              <Link href="/contacto" className="btn btn-dark cta-btn">
                Reservar mi fecha
              </Link>
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

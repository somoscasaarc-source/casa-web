import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft-top">
        <div>
          <div className="wordmark ft-mark">CASA</div>
          <div className="serif-italic ft-tag">{SITE.tagline}</div>
        </div>

        <nav className="ft-cols">
          <div className="ft-col">
            <div className="label ft-h">Estudio</div>
            <Link href="/portfolio" className="ft-link">Portfolio</Link>
            <Link href="/servicios" className="ft-link">Servicios</Link>
            <Link href="/bodas" className="ft-link">Bodas</Link>
            <Link href="/nosotros" className="ft-link">About</Link>
            <Link href="/contacto" className="ft-link">Contacto</Link>
            <Link href="/clientes" className="ft-link">Área de clientes</Link>
          </div>
          <div className="ft-col">
            <div className="label ft-h">Contacto</div>
            <a className="ft-link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a className="ft-link" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp · {SITE.whatsappRaw}
            </a>
            <span className="ft-link ft-static">{SITE.city}</span>
          </div>
          <div className="ft-col">
            <div className="label ft-h">Seguinos</div>
            <a className="ft-link" href={SITE.instagram} target="_blank" rel="noopener noreferrer">
              Instagram · {SITE.instagramHandle}
            </a>
          </div>
        </nav>
      </div>

      <div className="ft-bottom">
        <span>© {new Date().getFullYear()} CASA Audiovisual Studio</span>
        <span>{SITE.city} · Argentina</span>
      </div>
    </footer>
  );
}

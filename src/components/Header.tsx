"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`hdr ${scrolled ? "hdr-scrolled" : ""}`}>
      <div className="hdr-inner">
        <Link href="/" className="hdr-mark wordmark" aria-label="CASA — inicio">
          CASA
        </Link>

        <nav className="hdr-nav" aria-label="Principal">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`hdr-link ${pathname?.startsWith(n.href) ? "is-active" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link href="/clientes" className="hdr-client btn btn-outline">
          ÁREA DE CLIENTES
        </Link>

        <button
          className={`hdr-burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`hdr-drawer ${menuOpen ? "open" : ""}`}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="hdr-drawer-link">
            {n.label}
          </Link>
        ))}
        <Link
          href="/clientes"
          className="btn btn-outline"
          style={{ marginTop: 24 }}
        >
          ÁREA DE CLIENTES
        </Link>
      </div>
    </header>
  );
}

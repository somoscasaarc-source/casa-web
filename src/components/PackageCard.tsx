import Link from "next/link";

type Pkg = {
  id: string;
  name: string;
  blurb: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

export default function PackageCard({ pkg }: { pkg: Pkg }) {
  return (
    <div className={`fsc ${pkg.highlight ? "fsc-hl" : ""}`}>
      {pkg.badge && <div className="fsc-badge">{pkg.badge}</div>}
      <div className="fsc-name label">{pkg.name}</div>
      <p className="fsc-blurb serif-italic">{pkg.blurb}</p>
      <div className="fsc-line" />
      <div className="fsc-incl label">Qué incluye</div>
      <ul className="fsc-feats">
        {pkg.features.map((f, i) => (
          <li key={i}>
            <span className="fsc-dot" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/contacto"
        className={`btn ${pkg.highlight ? "btn-siena" : "btn-outline"} fsc-btn`}
      >
        Consultá tu presupuesto
      </Link>
    </div>
  );
}

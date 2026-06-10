/* Asymmetric 12-col editorial grid using the `eg-*` classes from globals.css.
   Pass 6 photos; placement cycles through 6 grid areas. */

type Photo = { src: string; alt: string };

const AREAS = ["eg-a", "eg-b", "eg-c", "eg-d", "eg-e", "eg-f"] as const;

export default function EditorialGallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="eg-grid">
      {photos.slice(0, 6).map((p, i) => (
        <div key={i} className={`photo ${AREAS[i]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.alt} loading="lazy" />
        </div>
      ))}
    </div>
  );
}

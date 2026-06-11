import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSupabase, supabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import AdminTopbar from "@/components/admin/AdminTopbar";

type GalleryRow = {
  id: string;
  title: string | null;
  access_token: string;
  is_active: boolean;
  created_at: string;
  clients: { name: string | null; email: string } | null;
  events: { date: string | null; type: string | null } | null;
  photos: { count: number }[];
};

export default async function AdminHome() {
  if (!supabaseConfigured()) {
    return (
      <main className="cl-login">
        <div className="cl-card">
          <div className="wordmark cl-card-mark">CASA</div>
          <h1 className="serif cl-card-title">Admin</h1>
          <p className="cl-card-sub">
            Falta configurar Supabase. Agregá <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> y{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> en Vercel.
          </p>
        </div>
      </main>
    );
  }

  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  if (!isAdmin(user.email)) {
    return (
      <main className="cl-login">
        <div className="cl-card">
          <div className="wordmark cl-card-mark">CASA</div>
          <h1 className="serif cl-card-title">Sin acceso</h1>
          <p className="cl-card-sub">
            Tu cuenta no está autorizada como admin.
          </p>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("galleries")
    .select(
      `id, title, access_token, is_active, created_at,
       clients ( name, email ),
       events ( date, type ),
       photos ( count )`,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const galleries: GalleryRow[] = (data as unknown as GalleryRow[]) ?? [];

  return (
    <>
      <AdminTopbar email={user.email ?? ""} />
      <main className="adm-main">
        <div className="wrap">
          <header className="adm-head">
            <div>
              <div className="label">Admin · Galerías</div>
              <h1 className="serif adm-title">Tus galerías</h1>
            </div>
            <Link href="/admin/galerias/nueva" className="btn btn-dark">
              Nueva galería
            </Link>
          </header>

          {error && (
            <p className="cl-err">
              No pudimos cargar las galerías: {error.message}
            </p>
          )}

          {galleries.length === 0 ? (
            <div className="adm-empty">
              <p className="serif-italic" style={{ fontSize: 24 }}>
                Todavía no creaste ninguna galería.
              </p>
              <Link
                href="/admin/galerias/nueva"
                className="link-arrow"
                style={{ marginTop: 16 }}
              >
                Crear la primera <span className="arr">→</span>
              </Link>
            </div>
          ) : (
            <ul className="adm-list">
              {galleries.map((g) => {
                const count = g.photos?.[0]?.count ?? 0;
                return (
                  <li key={g.id} className="adm-row">
                    <div>
                      <div className="serif adm-row-title">
                        {g.title ??
                          g.clients?.name ??
                          g.clients?.email ??
                          "Galería sin título"}
                      </div>
                      <div className="label adm-row-meta">
                        {g.clients?.email} ·{" "}
                        {count} fotos ·{" "}
                        {g.is_active ? "activa" : "pausada"}
                      </div>
                    </div>
                    <div className="adm-row-actions">
                      <Link
                        href={`/clientes/${g.access_token}`}
                        target="_blank"
                        className="link-arrow"
                      >
                        Ver galería <span className="arr">→</span>
                      </Link>
                      <Link
                        href={`/admin/galerias/${g.id}`}
                        className="btn btn-outline adm-row-btn"
                      >
                        Editar
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

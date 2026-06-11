import { notFound } from "next/navigation";
import { getServiceSupabase, supabaseConfigured } from "@/lib/supabase/server";
import ClientGallery, { type PhotoWithUrl } from "@/components/clientes/ClientGallery";

type Params = { token: string };

export default async function ClientGalleryPage({
  params,
}: {
  params: Params;
}) {
  if (!supabaseConfigured()) {
    return (
      <main className="cl-login">
        <div className="cl-card">
          <div className="wordmark cl-card-mark">CASA</div>
          <h1 className="serif cl-card-title">Próximamente</h1>
          <p className="cl-card-sub">
            Las galerías privadas estarán habilitadas en unos días. Gracias por la paciencia.
          </p>
        </div>
      </main>
    );
  }

  const svc = getServiceSupabase();
  const { data: gallery } = await svc
    .from("galleries")
    .select(
      `id, title, is_active, created_at,
       clients ( name, email ),
       events ( date, type ),
       photos ( id, storage_path, original_filename, sort_order )`,
    )
    .eq("access_token", params.token)
    .single();

  const g = gallery as unknown as {
    is_active: boolean;
    title: string | null;
    clients: { name: string | null; email: string } | null;
    events: { date: string | null; type: string | null } | null;
    photos: {
      id: string;
      storage_path: string;
      original_filename: string | null;
      sort_order: number;
    }[];
  } | null;

  if (!g || !g.is_active) notFound();

  const rawPhotos = g.photos ?? [];
  const sorted = [...rawPhotos].sort((a, b) => a.sort_order - b.sort_order);

  const photos: PhotoWithUrl[] = await Promise.all(
    sorted.map(async (p) => {
      const { data } = await svc.storage
        .from("photos")
        .createSignedUrl(p.storage_path, 60 * 60 * 8);
      return {
        id: p.id,
        url: data?.signedUrl ?? "",
        original_filename: p.original_filename,
      };
    }),
  );

  const client = g.clients;
  const title = g.title;
  const event = g.events;

  return (
    <ClientGallery
      token={params.token}
      title={title ?? client?.name ?? "Tu galería"}
      eventDate={event?.date ?? null}
      photos={photos}
    />
  );
}

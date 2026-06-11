import { redirect } from "next/navigation";
import { getServerSupabase, supabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import AdminTopbar from "@/components/admin/AdminTopbar";
import PedidoActions from "@/components/admin/PedidoActions";

type Row = {
  id: string;
  items: { id: string; name: string; qty: number; price: number }[] | null;
  total: number | null;
  payment_status: string;
  shipping_status: string;
  created_at: string;
};

export default async function Pedidos() {
  if (!supabaseConfigured()) redirect("/admin");
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  if (!isAdmin(user.email)) redirect("/admin");

  const { data } = await supabase
    .from("orders")
    .select("id, items, total, payment_status, shipping_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows: Row[] = (data as unknown as Row[]) ?? [];

  return (
    <>
      <AdminTopbar email={user.email ?? ""} />
      <main className="adm-main">
        <div className="wrap">
          <header className="adm-head">
            <div>
              <div className="label">Admin · Pedidos</div>
              <h1 className="serif adm-title">Pedidos</h1>
            </div>
          </header>

          {rows.length === 0 ? (
            <div className="adm-empty">
              <p className="serif-italic">Todavía no hay pedidos.</p>
            </div>
          ) : (
            <ul className="adm-list">
              {rows.map((r) => (
                <li key={r.id} className="adm-row">
                  <div>
                    <div className="serif adm-row-title">
                      Pedido {r.id.slice(0, 8)}
                    </div>
                    <div className="label adm-row-meta">
                      {r.items?.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                      {" · "}
                      ARS{" "}
                      {(r.total ?? 0).toLocaleString("es-AR", {
                        maximumFractionDigits: 0,
                      })}
                      {" · "}
                      pago: {r.payment_status} · envío: {r.shipping_status}
                    </div>
                  </div>
                  <PedidoActions
                    orderId={r.id}
                    shippingStatus={r.shipping_status}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

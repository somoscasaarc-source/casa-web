import { PACKAGES } from "@/lib/site";

/** Estados de pago que cuentan como facturado/cobrado. */
export const PAID = new Set(["paid", "approved"]);

export function isPaid(status: string | null | undefined): boolean {
  return PAID.has((status ?? "").toLowerCase());
}

/** Nombre legible de un paquete a partir de su id. */
export function packageName(id: string | null | undefined): string {
  if (!id) return "—";
  return PACKAGES.find((p) => p.id === id)?.name ?? id;
}

export const PAY_LABEL: Record<string, string> = {
  pending: "pendiente",
  paid: "pagado",
  approved: "pagado",
  rejected: "rechazado",
  cancelled: "cancelado",
};

export const SHIP_LABEL: Record<string, string> = {
  pending: "pendiente",
  preparando: "preparando",
  enviado: "enviado",
  entregado: "entregado",
};

export function payLabel(s: string | null | undefined): string {
  const k = (s ?? "").toLowerCase();
  return PAY_LABEL[k] ?? k ?? "—";
}

export function shipLabel(s: string | null | undefined): string {
  const k = (s ?? "").toLowerCase();
  return SHIP_LABEL[k] ?? k ?? "—";
}

/** Formato de fecha corto en español-AR. */
export function formatDate(d: string | null | undefined): string {
  if (!d) return "sin fecha";
  return new Date(d).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Devuelve la fecha del próximo evento (>= hoy); si no hay, la más reciente. */
export function nextEventDate(
  dates: (string | null | undefined)[],
): string | null {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = valid.filter((d) => d >= today).sort();
  if (upcoming.length > 0) return upcoming[0];
  return valid.sort().reverse()[0];
}

import type { Metadata } from "next";
import ClientesLogin from "@/components/ClientesLogin";

export const metadata: Metadata = {
  title: "Área de Clientes — CASA",
  description:
    "Accedé con tu enlace privado para ver y descargar tu galería.",
  robots: { index: false, follow: false },
};

export default function ClientesPage() {
  return <ClientesLogin />;
}

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASA — Estudio Audiovisual · Villa Crespo",
  description:
    "CASA es un estudio audiovisual de Villa Crespo, Buenos Aires. Fotografía y video para bodas. Sentite en casa.",
  metadataBase: new URL("https://casa-web-chi.vercel.app"),
  openGraph: {
    title: "CASA — Estudio Audiovisual",
    description: "Fotografía y video para bodas en Buenos Aires.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

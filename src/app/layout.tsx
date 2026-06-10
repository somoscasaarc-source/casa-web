import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CASA — Estudio Audiovisual · Villa Crespo",
  description:
    "CASA es un estudio audiovisual de Villa Crespo, Buenos Aires. Fotografía y video para bodas y quinceañeras. Sentite en casa.",
  metadataBase: new URL("https://somoscasa.com.ar"),
  openGraph: {
    title: "CASA — Estudio Audiovisual",
    description: "Fotografía y video para bodas y quinceañeras en Buenos Aires.",
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
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

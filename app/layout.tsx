import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import Clarity from "@/components/Clarity";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Philippe Laroche — Ton plan de vente immobilier en 2 minutes",
  description:
    "Découvre le meilleur plan pour vendre ta propriété en moins de 2 minutes. Un logiciel intelligent analyse ta propriété, ton marché et ton objectif pour te proposer la meilleure stratégie de vente à Montréal.",
  metadataBase: new URL("https://philippelarocheimmobilier.com"),
  openGraph: {
    title: "Découvre le meilleur plan pour vendre ta propriété",
    description: "Plan de vente personnalisé — Philippe Laroche, courtier immobilier à Montréal (RE/MAX Cité).",
    locale: "fr_CA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen antialiased">
        <MetaPixel />
        <Clarity />
        {children}
      </body>
    </html>
  );
}

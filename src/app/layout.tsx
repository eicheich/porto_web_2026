import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Mono, Instrument_Serif, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import logoFish from "../../porto_pict/logo/logo-fish.svg";

const logoFishSrc = typeof logoFish === "string" ? logoFish : logoFish.src;

const serif = Instrument_Serif({ subsets: ["latin"], variable: "--font-serif", weight: "400", style: ["normal", "italic"] });
const display = Barlow_Condensed({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const mono = DM_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.conceptName}`,
    template: `%s — ${profile.name}`,
  },
  description: `${profile.name}'s interactive portfolio & digital lab (${profile.conceptName}). Practical Machine Learning and intelligent web prototypes.`,
  icons: {
    icon: logoFishSrc,
    shortcut: logoFishSrc,
    apple: logoFishSrc,
  },
  openGraph: {
    title: `${profile.name} — ${profile.conceptName}`,
    description: profile.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${mono.variable} ${serif.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}

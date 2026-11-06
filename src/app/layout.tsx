import type { Metadata, Viewport } from "next";
import { Inter_Tight, League_Gothic } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HorizontalScroll from "@/components/HorizontalScroll";
import Effects from "@/components/Effects";
import Parallax from "@/components/Parallax";
import Atmosphere from "@/components/Atmosphere";
import "./globals.css";

const display = League_Gothic({
  subsets: ["latin", "latin-ext"],
  variable: "--font-league",
});

const text = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter-tight",
});

export const viewport: Viewport = {
  themeColor: "#090a09",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fernando-halim.vercel.app/"),
  title: "Fernando Halim | Fullstack Developer",
  description:
    "Fullstack developer based in Indonesia, specializing in fraud detection systems and modern web applications.",
  keywords: [
    "Fernando Halim",
    "Fullstack Developer",
    "Java Application Developer",
    "Spring Boot",
    "React",
    "Go",
    "Fraud Detection Systems",
    "Payment Gateway",
    "Indonesia",
  ],
  authors: [{ name: "Fernando Halim" }],
  creator: "Fernando Halim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fernando-halim.vercel.app/",
    title: "Fernando Halim | Fullstack Developer",
    description:
      "Fullstack developer specializing in fraud detection systems and modern web applications.",
    siteName: "Fernando Halim Portfolio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Fernando Halim - Fullstack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernando Halim | Fullstack Developer",
    description:
      "Fullstack developer specializing in fraud detection systems and modern web applications.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* decided before first paint, so hidden letters never flash in */}
        <script
          dangerouslySetInnerHTML={{
            __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('fx')",
          }}
        />
      </head>
      <body>
        <a
          href="#hero"
          className="label sr-only z-20 bg-fg p-3 text-ground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <Atmosphere />
        <HorizontalScroll />
        <Effects />
        <Parallax />
        <Nav />
        {children}
        <Footer />
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}

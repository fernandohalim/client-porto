import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Fraunces, Hanken_Grotesk } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

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

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} scroll-smooth`}
    >
      {" "}
      <body className="antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

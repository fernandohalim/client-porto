import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

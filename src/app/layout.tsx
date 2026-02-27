import type { Metadata } from "next";
import Navbar from "../components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fernando Halim | Portfolio",
  description: "Fullstack Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans bg-black text-white selection:bg-green-500/30">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

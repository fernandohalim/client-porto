import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";

// lūme's two faces — Bricolage Grotesque carries the title/labels, Geist Mono the
// timestamps (tabular so 0:00 never jitters). Loaded here so the page inherits them.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono-lume",
});

export default function LumeCaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${bricolage.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}

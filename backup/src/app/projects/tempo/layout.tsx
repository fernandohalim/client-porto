import { Nunito } from "next/font/google";

// Tempo ships Nunito Variable bundled locally — the rounded terminals are half
// the reason the widget reads as calm rather than clinical. Loaded here (server
// component) so the case study inherits the app's actual face.
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-nunito",
});

export default function TempoCaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={nunito.variable}>{children}</div>;
}

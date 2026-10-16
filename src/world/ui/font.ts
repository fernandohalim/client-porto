import { Amatic_SC, Nunito } from "next/font/google";

// Hand-lettered, for everything written on the paper map.
export const amatic = Amatic_SC({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

// Rounded and heavy at the top end: friendly, toy-like headings that still
// read cleanly at small sizes for the controls.
export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  display: "swap",
});

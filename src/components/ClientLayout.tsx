"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Navbar from "./NavBar";
import MenuPanel from "./MenuPanel";
import Loader from "./Loader";
import CommandPalette from "./CommandPalette";
import Footer from "./Footer";
import PageTransition from "@/utilities/PageTransition";
import ScrollProgress from "@/utilities/ScrollProgress";
import Cursor from "@/utilities/Cursor";
import SmoothScroll from "@/utilities/SmoothScroll";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNestPage = pathname?.startsWith("/projects/nest");
  const isNotedPage = pathname?.startsWith("/projects/noted");
  const isPiggyPage = pathname?.startsWith("/projects/piggy-wallet");
  const isLumePage = pathname?.startsWith("/projects/lume");
  const isTempoPage = pathname?.startsWith("/projects/tempo");
  const isCaseStudy =
    isNestPage || isNotedPage || isPiggyPage || isLumePage || isTempoPage;

  const [menuOpen, setMenuOpen] = useState(false);

  // a route change must never strand the menu open. Adjusting during render is
  // the documented way to reset state on a changing input — an effect for this
  // would paint the stale open state for one frame first.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  const globalStyles = isNestPage
    ? "bg-[#fdfbf7] text-stone-800 selection:bg-emerald-200 selection:text-emerald-900"
    : isNotedPage
      ? "bg-[#0a0a0a] text-[#e5e5e5] selection:bg-[#d97757] selection:text-[#0a0a0a]"
      : isPiggyPage
        ? "bg-[#f5f4fb] text-[#1e1b2e] selection:bg-[#e8e8fb] selection:text-[#4646b8]"
        : isLumePage
          ? "bg-[#0b0b0f] text-[#f2f3f5] selection:bg-[#c8b6ff] selection:text-[#0b0b0f]"
          : isTempoPage
            ? "bg-[#f7f1e8] text-[#4a3f38] selection:bg-[#e6c2b0] selection:text-[#4a3f38]"
            : "bg-white text-ink selection:bg-ink selection:text-white";

  return (
    <div
      id="global-layout"
      className={`min-h-screen transition-colors duration-700 ${isCaseStudy ? "case-study" : ""} ${globalStyles}`}
    >
      {/* the cursor runs everywhere, case studies included — it composites with
          mix-blend-difference, so it stays legible on every theme without any
          per-route configuration, and it is the one piece of chrome that should
          feel continuous when you cross into a case study. */}
      <Cursor />
      <SmoothScroll />
      <Loader />

      {!isCaseStudy && (
        <>
          <ScrollProgress />
          <Navbar open={menuOpen} setOpen={setMenuOpen} />
          <MenuPanel open={menuOpen} onNavigate={() => setMenuOpen(false)} />
          <CommandPalette />
        </>
      )}

      <div className="flex min-h-screen flex-col">
        <div className="relative z-10 grow">
          <PageTransition>{children}</PageTransition>
        </div>
        {!isCaseStudy && <Footer />}
      </div>
    </div>
  );
}

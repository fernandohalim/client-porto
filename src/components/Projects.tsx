"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { Chars } from "@/utilities/TextReveal";

type Preview =
  | { type: "shot"; src: string; bg: string }
  | { type: "noted" }
  | { type: "tint"; bg: string; glyph: string; color: string };

type Entry = {
  no: string;
  title: string;
  kind: string;
  year: string;
  meta: string;
  live?: boolean;
  href?: string; // case-study route
  crossfade?: string; // bg for the route transition
  preview: Preview;
};

const FEATURED: Entry[] = [
  {
    no: "01",
    title: "NEST",
    kind: "Product — Case Study",
    year: "2026",
    meta: "AI receipt scanning · settlement engine",
    href: "/projects/nest",
    crossfade: "#fdfbf7",
    preview: {
      type: "shot",
      src: "/nest-shot-1.png",
      bg: "linear-gradient(160deg,#e9efe6,#dbe7da)",
    },
  },
  {
    no: "02",
    title: "NOTED",
    kind: "Product — Case Study",
    year: "2026",
    meta: "Offline-first markdown · 3-way merge",
    href: "/projects/noted",
    crossfade: "#0a0a0a",
    preview: { type: "noted" },
  },
];

const CLIENTS: Entry[] = [
  {
    no: "03",
    title: "FINANCIAL RECORD APP",
    kind: "Company X",
    year: "2024",
    meta: "React · Express · Node",
    live: true,
    preview: {
      type: "tint",
      bg: "linear-gradient(160deg,#efe9e2,#e7dfd4)",
      glyph: "f",
      color: "#9a7a52",
    },
  },
  {
    no: "04",
    title: "WEB-BASED ERP",
    kind: "Company X",
    year: "2024",
    meta: "React · Material UI · Node",
    live: true,
    preview: {
      type: "tint",
      bg: "linear-gradient(160deg,#e6ebef,#d9e1e8)",
      glyph: "e",
      color: "#5a7390",
    },
  },
  {
    no: "05",
    title: "COMPANY PROFILE",
    kind: "PT Maju Jaya Arkananta",
    year: "2024",
    meta: "Express · Node",
    live: true,
    preview: {
      type: "tint",
      bg: "linear-gradient(160deg,#f0ece3,#e8e1d3)",
      glyph: "m",
      color: "#8a7a5a",
    },
  },
  {
    no: "06",
    title: "COMMUNITY CATALOGUE",
    kind: "Rawa Belong Community",
    year: "2023",
    meta: "React · Flutter · Node",
    preview: {
      type: "tint",
      bg: "linear-gradient(160deg,#f1e8e6,#e9dad6)",
      glyph: "r",
      color: "#a06a60",
    },
  },
  {
    no: "07",
    title: "COMPANY PROFILE",
    kind: "LeSeen Electronics",
    year: "2023",
    meta: "React · Node · Material UI",
    preview: {
      type: "tint",
      bg: "linear-gradient(160deg,#e6ebef,#d9e1e8)",
      glyph: "l",
      color: "#5a7390",
    },
  },
];

export default function Projects() {
  const router = useRouter();
  const [crossfade, setCrossfade] = useState<{ bg: string } | null>(null);
  const [active, setActive] = useState<Entry | null>(null);

  // cursor-chasing preview card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.5 });
  const py = useSpring(my, { stiffness: 220, damping: 24, mass: 0.5 });

  const handleCaseStudyClick = (href: string, bg: string) => () => {
    setCrossfade({ bg });
    setTimeout(() => {
      document.documentElement.classList.remove("scroll-smooth");
      const layout = document.getElementById("global-layout");
      if (layout) {
        layout.style.transition = "none";
        layout.style.backgroundColor = bg;
      }
      window.scrollTo(0, 0);
      router.push(href, { scroll: false });
      setTimeout(
        () => document.documentElement.classList.add("scroll-smooth"),
        500,
      );
    }, 500);
  };

  return (
    <section
      id="work"
      className="relative py-28 scroll-mt-24"
      onMouseMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
      onMouseLeave={() => setActive(null)}
    >
      {crossfade &&
        typeof window !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ backgroundColor: crossfade.bg }}
            className="fixed inset-0 z-[99999] pointer-events-none"
          />,
          document.body,
        )}

      {/* floating preview — desktop only */}
      <div className="hidden md:block">
        <motion.div
          style={{ x: px, y: py }}
          className="fixed top-0 left-0 z-30 pointer-events-none"
        >
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.no}
                initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 2 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="w-[300px] -translate-x-1/2 -translate-y-[115%] overflow-hidden shadow-2xl shadow-ink/30"
              >
                <PreviewCard entry={active} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* heading */}
      <div className="px-5 md:px-8 pb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="display text-ink text-[clamp(3rem,9vw,8rem)]">
          <Chars text="INDEX" stagger={0.05} />
        </h2>
        <span className="mono-label text-smoke pb-3">
          Selected work — 2023 → 26
        </span>
      </div>

      {/* featured releases */}
      {FEATURED.map((e, i) => (
        <div
          key={e.no}
          onClick={handleCaseStudyClick(e.href!, e.crossfade!)}
          onMouseEnter={() => setActive(e)}
          data-cursor="View"
          className={`group relative overflow-hidden border-t border-line ${i === FEATURED.length - 1 ? "border-b" : ""}`}
        >
          {/* dark flood on hover */}
          <span className="absolute inset-0 bg-coal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          <div className="relative z-10 px-5 md:px-8 py-8 md:py-12 grid grid-cols-12 items-baseline gap-x-3 gap-y-2 transition-colors duration-500 group-hover:text-bone">
            <span className="col-span-2 md:col-span-1 font-mono text-xs text-smoke transition-colors duration-500 group-hover:text-accent">
              {e.no}
            </span>
            <h3 className="col-span-10 md:col-span-6 display text-[clamp(2.6rem,8vw,6.5rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4">
              {e.title}
            </h3>
            <div className="col-span-12 md:col-span-5 flex flex-wrap md:justify-end items-baseline gap-x-6 gap-y-1 mono-label text-smoke transition-colors duration-500 group-hover:text-ash">
              <span>{e.kind}</span>
              <span>{e.year}</span>
              <span className="hidden lg:inline">{e.meta}</span>
              <span className="text-accent">→</span>
            </div>
          </div>
        </div>
      ))}

      {/* client sub-index */}
      <p className="mono-label text-smoke px-5 md:px-8 mt-20 mb-2">
        Also produced — via WEBin
      </p>
      {CLIENTS.map((e, i) => (
        <div
          key={e.no}
          onMouseEnter={() => setActive(e)}
          data-cursor={e.live ? "Live" : "Archived"}
          className={`group border-t border-line ${i === CLIENTS.length - 1 ? "border-b" : ""}`}
        >
          <div className="px-5 md:px-8 py-5 grid grid-cols-12 items-baseline gap-x-3">
            <span className="col-span-2 md:col-span-1 font-mono text-xs text-ash transition-colors duration-300 group-hover:text-accent">
              {e.no}
            </span>
            <h3 className="col-span-10 md:col-span-6 display font-semibold text-[clamp(1.3rem,3.4vw,2.4rem)] text-ink/80 transition-all duration-300 group-hover:translate-x-3 group-hover:text-ink">
              {e.title}
            </h3>
            <div className="col-span-12 md:col-span-5 flex md:justify-end items-center gap-x-6 mono-label text-smoke">
              <span>{e.kind}</span>
              <span className="hidden sm:inline">{e.year}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${e.live ? "bg-accent" : "bg-ash"}`}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function PreviewCard({ entry }: { entry: Entry }) {
  const p = entry.preview;
  if (p.type === "shot") {
    return (
      <div
        className="aspect-[4/3] flex items-end justify-center pt-6 px-10"
        style={{ background: p.bg }}
      >
        <Image
          src={p.src}
          alt={entry.title}
          width={180}
          height={380}
          className="w-[150px] h-auto rounded-t-xl shadow-xl"
        />
      </div>
    );
  }
  if (p.type === "noted") {
    return (
      <div className="aspect-[4/3] bg-[#0a0a0a] p-5 font-mono text-[12px] leading-relaxed">
        <p className="text-[#d97757] font-bold"># local-first notes</p>
        <p className="text-[#e5e5e5] mt-2">markdown that saves offline,</p>
        <p className="text-[#e5e5e5]">syncs everywhere, never loses</p>
        <p className="text-[#e5e5e5]">a keystroke.</p>
        <p className="text-[#d97757] mt-3">
          - [x] <span className="text-[#e5e5e5]">3-way merge</span>
        </p>
      </div>
    );
  }
  return (
    <div
      className="aspect-[4/3] flex items-center justify-center"
      style={{ background: p.bg }}
    >
      <span
        className="font-serif italic text-7xl opacity-60"
        style={{ color: p.color }}
      >
        {p.glyph}
      </span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Chars } from "@/utilities/TextReveal";
import Link from "next/link";

// every entry renders as the same row — no featured tier. `kind` decides the
// status verb and where (or whether) the row navigates:
//   case     → internal case-study route, crossfade nav
//   source   → external repo, new tab
//   live     → client site in production, no public link
//   archived → client work no longer running
type Kind = "case" | "source" | "live" | "archived";

type Work = {
  title: string; // project OR client name
  blurb: string; // one-line description
  stack: string[]; // tech — first two are rendered
  year: string;
  kind: Kind;
  href?: string; // omit = no destination (client rows)
  crossfade?: string; // case only — the case study's background color
};

// own products and open source — one register, no tiers inside it.
const WORK: Work[] = [
  {
    title: "lūme",
    blurb: "Spotify miniplayer · art-sampled glow",
    stack: ["Tauri", "Rust"],
    year: "2026",
    kind: "case",
    href: "/projects/lume",
    crossfade: "#0b0b0f",
  },
  {
    title: "nest.",
    blurb: "AI receipt scanning · settlement engine",
    stack: ["Next", "Gemini"],
    year: "2026",
    kind: "case",
    href: "/projects/nest",
    crossfade: "#fdfbf7",
  },
  {
    title: "Tempo",
    blurb: "Desktop clock widget · timer, alarm, stopwatch",
    stack: ["Electron", "React"],
    year: "2026",
    kind: "case",
    href: "/projects/tempo",
    crossfade: "#f7f1e8",
  },
  {
    title: "Piggy Wallet",
    blurb: "Offline-first expense tracker · budget system",
    stack: ["Next", "IDB"],
    year: "2026",
    kind: "case",
    href: "/projects/piggy-wallet",
    crossfade: "#f5f4fb",
  },
  {
    title: "noted.",
    blurb: "Offline-first markdown · 3-way merge",
    stack: ["Next", "IDB"],
    year: "2026",
    kind: "case",
    href: "/projects/noted",
    crossfade: "#0a0a0a",
  },
  {
    title: "PIXELEMOJI",
    blurb: "Emoji to pixel art converter · customizeable",
    stack: ["Next", "Canvas"],
    year: "2026",
    kind: "source",
    href: "https://github.com/fernandohalim/pixel-emoji",
  },
  {
    title: "PIXELIMAGE",
    blurb: "Image to pixel art converter · customizeable",
    stack: ["Next", "Canvas"],
    year: "2026",
    kind: "source",
    href: "https://github.com/fernandohalim/pixel-image",
  },
  {
    title: "LOG WATCHDOG",
    blurb: "Application log monitoring · advanced",
    stack: ["Go", "Win"],
    year: "2026",
    kind: "source",
    href: "https://github.com/fernandohalim/log-watchdog",
  },
  {
    title: "LOG JANITOR",
    blurb: "Application log cleanup · multi-retention",
    stack: ["Go", "Win"],
    year: "2025",
    kind: "source",
    href: "https://github.com/fernandohalim/log-janitor",
  },
];

// commissioned work — same row treatment, own register. numbering continues
// from WORK so the page still reads as one index.
const CLIENTS: Work[] = [
  {
    title: "Handy and Sharon",
    blurb: "Wedding invitation site with RSVP",
    stack: ["Next", "Firestore"],
    year: "2026",
    kind: "live",
  },
  {
    title: "Nenggala Academy",
    blurb: "Student portal and marketing site",
    stack: ["Next", "Express"],
    year: "2026",
    kind: "live",
  },
  {
    title: "PT Maju Jaya Arkananta",
    blurb: "Company profile and catalogue website with CMS",
    stack: ["CRA", "Go"],
    year: "2024",
    kind: "live",
  },
  {
    title: "PT Jasplast Sukses Bersama",
    blurb: "Financial record website",
    stack: ["CRA", "Express"],
    year: "2024",
    kind: "live",
  },
  {
    title: "PT Argotehnik Kreasindo Abadi",
    blurb: "Web-based operational ERP",
    stack: ["CRA", "Express"],
    year: "2024",
    kind: "live",
  },
  {
    title: "Rawa Belong Florist Community",
    blurb: "Marketplace mobile application and website",
    stack: ["Flutter", "Express"],
    year: "2023",
    kind: "archived",
  },
  {
    title: "LeSeen Electronics",
    blurb: "Company profile website",
    stack: ["CRA", "Tailwind"],
    year: "2023",
    kind: "archived",
  },
];

// the one thing every row surfaces at rest besides title and year — it tells
// you whether the row leads anywhere before you commit a hover to it.
const STATUS: Record<Kind, { label: string; tone: string }> = {
  case: { label: "Case Study", tone: "text-accent" },
  source: { label: "Source", tone: "text-smoke group-hover:text-ash" },
  live: { label: "Live", tone: "text-accent" },
  archived: { label: "Archived", tone: "text-ash" },
};

const pad = (n: number) => String(n).padStart(2, "0");

// uniform index row. every entry is the same compact height, so the dividers
// land on an even rhythm. collapsed it shows only [no · title · verb · year];
// on desktop the blurb + tech crossfade OVER the title 1s after hover
// (constant height, no reflow). touch keeps it open.
function Row({ no, e, last }: { no: string; e: Work; last?: boolean }) {
  const status = STATUS[e.kind];

  return (
    <div
      className={`group relative overflow-hidden border-t border-line ${last ? "border-b" : ""}`}
    >
      {/* dark flood on hover */}
      <span className="absolute inset-0 bg-coal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
      {/* fixed 72px height (multiple of 4 → whole device pixels at 1×/1.25×/
          1.5×/2× scaling) so every divider lands on the same pixel phase and
          renders at a uniform weight instead of alternating thin/thick */}
      <div className="relative z-10 px-5 md:px-8 py-4 md:py-0 md:h-[72px] grid grid-cols-12 items-baseline md:items-center gap-x-3 transition-colors duration-500 group-hover:text-bone">
        {/* number */}
        <span className="col-span-2 md:col-span-1 font-mono text-xs text-smoke transition-colors duration-500 group-hover:text-accent">
          {no}
        </span>

        {/* title + detail share one cell; detail crossfades over the title */}
        <div className="col-span-7 md:col-span-8 relative">
          <h3 className="display font-semibold text-[clamp(1.5rem,3.4vw,2.4rem)] transition-opacity duration-300 md:group-hover:opacity-0 md:group-hover:delay-1000">
            {e.title}
          </h3>

          <div className="mt-2 md:mt-0 md:absolute md:inset-0 md:flex md:items-center opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100 md:group-hover:delay-1000">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <p className="font-mono text-[11px] leading-[1.7] text-smoke transition-colors duration-500 group-hover:text-ash">
                {e.blurb}
              </p>
              <p className="mono-label text-smoke/70 transition-colors duration-500 group-hover:text-ash whitespace-nowrap">
                {e.stack.slice(0, 2).join(" · ")}
              </p>
              {/* mobile carries the verb here — the right column is too narrow
                  for it at that width, and this block is always open on touch */}
              <span className={`mono-label md:hidden ${status.tone}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* verb + year — always visible. the verb sits in a fixed-width slot so
            it reads as a real column instead of ragging off the year */}
        <div className="col-span-3 flex justify-end items-baseline gap-x-4 md:gap-x-6 mono-label text-smoke transition-colors duration-500 group-hover:text-ash">
          <span
            className={`hidden md:inline md:w-[7rem] transition-colors duration-500 ${status.tone}`}
          >
            {status.label}
          </span>
          <span>{e.year}</span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const router = useRouter();
  const [crossfade, setCrossfade] = useState<{ bg: string } | null>(null);

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

  // `kind` picks the wrapper — the row inside it is identical either way
  const renderRow = (e: Work, no: string, last: boolean) => {
    const row = <Row no={no} e={e} last={last} />;

    if (e.kind === "case")
      return (
        <div
          key={e.title}
          onClick={handleCaseStudyClick(e.href!, e.crossfade!)}
          data-cursor="Case Study"
          className="block cursor-pointer"
        >
          {row}
        </div>
      );

    if (e.kind === "source")
      return (
        <Link
          key={e.title}
          href={e.href!}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Source"
          className="block"
        >
          {row}
        </Link>
      );

    // client rows have no public destination — the verb is the whole signal
    return (
      <div key={e.title} data-cursor={STATUS[e.kind].label}>
        {row}
      </div>
    );
  };

  return (
    <section id="work" className="relative py-20 md:py-28 scroll-mt-24">
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

      {/* heading */}
      <div className="px-5 md:px-8 pb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="display text-ink text-[clamp(3rem,9vw,8rem)]">
          <Chars text="INDEX" stagger={0.05} />
        </h2>
        <span className="mono-label text-smoke pb-3">
          Selected work — {WORK.length + CLIENTS.length} entries
        </span>
      </div>

      {/* two registers, one row treatment — the label is the only break */}
      {WORK.map((e, i) => renderRow(e, pad(i + 1), i === WORK.length - 1))}

      <p className="mono-label text-smoke px-5 md:px-8 mt-20 mb-2">
        Also produced — freelances
      </p>
      {CLIENTS.map((e, i) =>
        renderRow(e, pad(WORK.length + i + 1), i === CLIENTS.length - 1),
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Chars } from "@/utilities/TextReveal";
import Link from "next/link";

type Work = {
  title: string; // project OR client name
  blurb: string; // one-line description
  stack: string[]; // tech — first two are rendered
  year: string;
  href?: string; // omit = no link (archived clients)
  crossfade?: string; // set = internal case-study route (crossfade nav)
  live?: boolean; // client status only
};

const FEATURED: Work[] = [
  {
    title: "lūme",
    blurb: "Spotify miniplayer · art-sampled glow",
    stack: ["Tauri", "Rust"],
    year: "2026",
    href: "/projects/lume",
    crossfade: "#0b0b0f",
  },
  {
    title: "nest.",
    blurb: "AI receipt scanning · settlement engine",
    stack: ["Next", "Gemini"],
    year: "2026",
    href: "/projects/nest",
    crossfade: "#fdfbf7",
  },
  {
    title: "Tempo",
    blurb: "Desktop clock widget · timer, alarm, stopwatch",
    stack: ["Electron", "React"],
    year: "2026",
    href: "/projects/tempo",
    crossfade: "#f7f1e8",
  },
];

const PERSONAL: Work[] = [
  {
    title: "Piggy Wallet",
    blurb: "Offline-first expense tracker · budget system",
    stack: ["Next", "IDB"],
    year: "2026",
    href: "/projects/piggy-wallet",
    crossfade: "#f5f4fb",
  },
  {
    title: "noted.",
    blurb: "Offline-first markdown · 3-way merge",
    stack: ["Next", "IDB"],
    year: "2026",
    href: "/projects/noted",
    crossfade: "#0a0a0a",
  },
  {
    title: "PIXELEMOJI",
    blurb: "Emoji to pixel art converter · customizeable",
    stack: ["Next", "Canvas"],
    year: "2026",
    href: "https://github.com/fernandohalim/pixel-emoji",
  },
  {
    title: "PIXELIMAGE",
    blurb: "Image to pixel art converter · customizeable",
    stack: ["Next", "Canvas"],
    year: "2026",
    href: "https://github.com/fernandohalim/pixel-image",
  },
  {
    title: "LOG WATCHDOG",
    blurb: "Application log monitoring · advanced",
    stack: ["Go", "Win"],
    year: "2026",
    href: "https://github.com/fernandohalim/log-watchdog",
  },
  {
    title: "LOG JANITOR",
    blurb: "Application log cleanup · multi-retention",
    stack: ["Go", "Win"],
    year: "2025",
    href: "https://github.com/fernandohalim/log-janitor",
  },
];

const CLIENTS: Work[] = [
  {
    title: "Handy and Sharon",
    blurb: "Wedding invitation site with RSVP",
    stack: ["Next", "Firestore"],
    year: "2026",
    live: true,
  },
  {
    title: "Nenggala Academy",
    blurb: "Student portal and marketing site",
    stack: ["Next", "Express"],
    year: "2026",
    live: true,
  },
  {
    title: "PT Maju Jaya Arkananta",
    blurb: "Company profile and catalogue website with CMS",
    stack: ["CRA", "Go"],
    year: "2024",
    live: true,
  },
  {
    title: "PT Jasplast Sukses Bersama",
    blurb: "Financial record website",
    stack: ["CRA", "Express"],
    year: "2024",
    live: true,
  },
  {
    title: "PT Argotehnik Kreasindo Abadi",
    blurb: "Web-based operational ERP",
    stack: ["CRA", "Express"],
    year: "2024",
    live: true,
  },
  {
    title: "Rawa Belong Florist Community",
    blurb: "Marketplace mobile application and website",
    stack: ["Flutter", "Express"],
    year: "2023",
  },
  {
    title: "LeSeen Electronics",
    blurb: "Company profile website",
    stack: ["CRA", "Tailwind"],
    year: "2023",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

// featured work — a large stacked hero. shows everything (blurb + tech) up
// front since there are only two; hover floods to coal and inverts.
function Hero({ no, e }: { no: string; e: Work }) {
  return (
    <div className="group relative overflow-hidden border-t border-line cursor-pointer">
      {/* dark flood on hover */}
      <span className="absolute inset-0 bg-coal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
      {/* snap to a multiple of 4 (whole device pixels at 1×/1.25×/1.5×/2×
          scaling) so the hero dividers land on a uniform pixel phase like the
          index rows. min-h (not h) lets a wrapped blurb grow instead of clip. */}
      <div className="relative z-10 px-5 md:px-8 py-9 md:py-14 md:min-h-[288px] flex flex-col justify-center transition-colors duration-500 group-hover:text-bone">
        {/* meta — number · kind · year */}
        <div className="flex items-center gap-x-4 mono-label text-smoke transition-colors duration-500 group-hover:text-ash">
          <span className="text-accent">{no}</span>
          <span>Case Study</span>
          <span className="ml-auto">{e.year}</span>
        </div>

        {/* title */}
        <h3 className="display text-[clamp(3rem,10vw,7rem)] mt-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
          {e.title}
        </h3>

        {/* blurb + tech + arrow */}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 mt-4 md:mt-5">
          <p className="font-mono text-[12px] leading-[1.7] text-smoke transition-colors duration-500 group-hover:text-ash">
            {e.blurb}
          </p>
          <p className="mono-label text-smoke/70 transition-colors duration-500 group-hover:text-ash whitespace-nowrap">
            {e.stack.slice(0, 2).join(" · ")}
          </p>
          <span className="ml-auto text-accent inline-block transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </div>
  );
}

// uniform index row for personal + client work. every row is the same
// compact height, so the dividers land on an even rhythm. collapsed it shows
// only [no · title · year]; on desktop the blurb + tech crossfade OVER the
// title 1s after hover (constant height, no reflow). touch keeps it open.
function Row({
  no,
  e,
  indicator,
  status,
  last,
}: {
  no: string;
  e: Work;
  indicator: React.ReactNode;
  status?: React.ReactNode;
  last?: boolean;
}) {
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
              {status}
            </div>
          </div>
        </div>

        {/* year + indicator — always visible */}
        <div className="col-span-3 flex justify-end items-baseline gap-x-4 md:gap-x-5 mono-label text-smoke transition-colors duration-500 group-hover:text-ash">
          <span>{e.year}</span>
          {indicator}
        </div>
      </div>
    </div>
  );
}

const ARROW = (
  <span className="text-accent inline-block transition-transform duration-500 group-hover:translate-x-1">
    →
  </span>
);

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
        <span className="mono-label text-smoke pb-3">Selected work</span>
      </div>

      {/* featured — large stacked heroes */}
      {FEATURED.map((e, i) => (
        <div
          key={e.title}
          onClick={handleCaseStudyClick(e.href!, e.crossfade!)}
          data-cursor="Case Study"
          className="block"
        >
          <Hero no={pad(i + 1)} e={e} />
        </div>
      ))}

      {/* the rest — one uniform divider list. personal first, then freelances */}
      {PERSONAL.map((e, i) => {
        const no = pad(FEATURED.length + i + 1);
        const isCaseStudy = e.href?.startsWith("/projects/");
        const row = (
          <Row
            no={no}
            e={e}
            indicator={ARROW}
            last={i === PERSONAL.length - 1}
          />
        );

        return isCaseStudy ? (
          <div
            key={e.title}
            onClick={handleCaseStudyClick(e.href!, e.crossfade!)}
            data-cursor="Case Study"
            className="block cursor-pointer"
          >
            {row}
          </div>
        ) : (
          <Link
            key={e.title}
            href={e.href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Visit"
            className="block"
          >
            {row}
          </Link>
        );
      })}

      {/* client sub-index */}
      <p className="mono-label text-smoke px-5 md:px-8 mt-20 mb-2">
        Also produced — freelances
      </p>
      {CLIENTS.map((e, i) => (
        <div key={e.title} data-cursor={e.live ? "Live" : "Archived"}>
          <Row
            no={pad(i + 1)}
            e={e}
            last={i === CLIENTS.length - 1}
            status={
              <span
                className={`mono-label ${e.live ? "text-accent" : "text-ash"}`}
              >
                {e.live ? "Live" : "Archived"}
              </span>
            }
            indicator={
              <span
                className={`w-1.5 h-1.5 rounded-full ${e.live ? "bg-accent" : "bg-ash"}`}
              />
            }
          />
        </div>
      ))}
    </section>
  );
}

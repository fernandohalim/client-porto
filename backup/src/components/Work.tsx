"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Work — S.02, own products, on the slab ground.
//
// Only the documented builds get a card. The open-source utilities used to sit
// in this grid too, but a card is a promise of something to look at, and those
// four had no interface worth showing — they were four placeholder rectangles
// diluting five real ones. They now live behind a single link to the profile,
// which is where someone who wants to read source is actually heading.
//
// Translated from the reference's service grid: white cards on #EBF0ED that
// flood the accent on hover, the title sliding up to make room for a
// description hidden at rest. Here the card holds a project screenshot at rest
// and the flood covers it, so the image only reads in the calm state and the
// hover state is pure type.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionMark from "@/utilities/SectionMark";
import ScrollFill from "@/utilities/ScrollFill";
import PillButton from "@/utilities/PillButton";

const EASE = [0.16, 1, 0.3, 1] as const;
const GITHUB = "https://github.com/fernandohalim";

type Item = {
  title: string;
  blurb: string;
  stack: string[];
  year: string;
  href: string;
  img: string;
  crossfade: string; // the case study's ground colour
};

const WORK: Item[] = [
  {
    title: "lūme",
    blurb: "Spotify miniplayer that samples cover art for its glow",
    stack: ["Tauri", "Rust"],
    year: "2026",
    href: "/projects/lume",
    img: "/images/work-lume.jpg",
    crossfade: "#0b0b0f",
  },
  {
    title: "nest.",
    blurb: "AI receipt scanning with a group settlement engine",
    stack: ["Next", "Gemini"],
    year: "2026",
    href: "/projects/nest",
    img: "/images/work-nest.jpg",
    crossfade: "#fdfbf7",
  },
  {
    title: "Tempo",
    blurb: "Desktop clock widget — timer, alarm, stopwatch",
    stack: ["Electron", "React"],
    year: "2026",
    href: "/projects/tempo",
    img: "/images/work-tempo.jpg",
    crossfade: "#f7f1e8",
  },
  {
    title: "Piggy Wallet",
    blurb: "Offline-first expense tracker with a budget system",
    stack: ["Next", "IDB"],
    year: "2026",
    href: "/projects/piggy-wallet",
    img: "/images/work-piggy-wallet.jpg",
    crossfade: "#f5f4fb",
  },
  {
    title: "noted.",
    blurb: "Offline-first markdown editor with 3-way merge",
    stack: ["Next", "IDB"],
    year: "2026",
    href: "/projects/noted",
    img: "/images/work-noted.jpg",
    crossfade: "#0a0a0a",
  },
];

function Card({ e, i }: { e: Item; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -70px 0px" }}
      transition={{ duration: 0.75, delay: (i % 3) * 0.08, ease: EASE }}
      className="group relative isolate aspect-[4/3] overflow-hidden rounded-card bg-white"
    >
      <Image
        src={e.img}
        alt={`${e.title} — ${e.blurb}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-coal/75 via-coal/10 to-transparent transition-opacity duration-500 group-hover:opacity-0" />

      {/* the flood */}
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <span className="mono-label rounded-[3px] border border-white/35 px-1.5 py-1 text-white transition-colors duration-500 group-hover:border-coal/35 group-hover:text-coal">
          Case study
        </span>
        <span className="mono-label text-white/75 transition-colors duration-500 group-hover:text-coal/70">
          {e.year}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="display text-[clamp(1.35rem,2.4vw,1.75rem)] text-white transition-colors duration-500 group-hover:text-coal">
          {e.title}
        </h3>
        {/* collapses to zero height at rest so the title sits low; hover opens
            it and the title rides up — no layout shift outside the card */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="pt-2 text-[13px] leading-snug text-coal/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-150">
              {e.blurb}
            </p>
            <p className="mono-label pt-2 text-coal/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-200">
              {e.stack.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const router = useRouter();
  const [crossfade, setCrossfade] = useState<{ bg: string } | null>(null);

  const openCase = (href: string, bg: string) => () => {
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
    <section id="work" className="scroll-mt-20 bg-slab py-20 md:py-28">
      {crossfade &&
        typeof window !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ backgroundColor: crossfade.bg }}
            className="pointer-events-none fixed inset-0 z-[99999]"
          />,
          document.body,
        )}

      <div className="px-5 md:px-8">
        <div className="flex gap-4 md:gap-7">
          <SectionMark no="02" name="Selected work" className="mt-2" />
          <ScrollFill
            text="Products I designed, built and shipped on my own — each one documented end to end as a case study."
            className="max-w-[22ch] md:max-w-[26ch]"
          />
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-2.5 px-5 sm:grid-cols-2 md:mt-20 md:px-8 lg:grid-cols-3">
        {WORK.map((e, i) => (
          <div
            key={e.title}
            onClick={openCase(e.href, e.crossfade)}
            onKeyDown={(ev) =>
              ev.key === "Enter" && openCase(e.href, e.crossfade)()
            }
            role="button"
            tabIndex={0}
            data-cursor="Case study"
            data-cursor-snap
            className="block cursor-pointer"
          >
            <Card e={e} i={i} />
          </div>
        ))}

        {/* ── the sixth cell: everything that isn't a case study ──
            fills the 3-column grid's empty slot instead of leaving a hole,
            which is exactly what the reference does with its stray photo. */}
        <motion.a
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Open GitHub"
          data-cursor-snap
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -70px 0px" }}
          transition={{ duration: 0.75, delay: 0.16, ease: EASE }}
          className="group flex aspect-[4/3] flex-col justify-between rounded-card border border-line-slab bg-transparent p-6 transition-colors duration-500 hover:border-transparent hover:bg-accent"
        >
          <div className="flex items-start justify-between">
            <span className="chip text-ink/45 transition-colors duration-500 group-hover:text-coal/60">
              Also built
            </span>
            <span className="grid h-[22px] w-[22px] place-items-center rounded-[3px] border border-line-slab text-ink/50 transition-all duration-500 group-hover:border-coal group-hover:bg-coal group-hover:text-white">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </div>

          <div>
            <h3 className="display text-[clamp(1.35rem,2.4vw,1.75rem)] text-ink transition-colors duration-500 group-hover:text-coal">
              Open source
            </h3>
            <p className="mt-2 max-w-[26ch] text-[13px] leading-snug text-mute transition-colors duration-500 group-hover:text-coal/80">
              Pixel-art converters, Go log tooling and the smaller utilities —
              all on GitHub.
            </p>
          </div>
        </motion.a>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 px-5 md:px-8">
        <span className="mono-label text-mute">
          {WORK.length} case studies — latest first
        </span>
        <PillButton
          label="More on GitHub"
          href={GITHUB}
          external
          tone="dark"
          cursor="Open GitHub"
        />
      </div>
    </section>
  );
}

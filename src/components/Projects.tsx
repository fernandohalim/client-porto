"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Reveal from "@/utilities/Reveal";
import ProjectPreview from "./ProjectPreview";

type Tint = { bg: string; glyph: string };

const TINTS: Record<string, Tint> = {
  sage: { bg: "linear-gradient(160deg,#e9efe6,#dbe7da)", glyph: "#5f8a5a" },
  clay: { bg: "linear-gradient(160deg,#efe9e2,#e7dfd4)", glyph: "#9a7a52" },
  slate: { bg: "linear-gradient(160deg,#e6ebef,#d9e1e8)", glyph: "#5a7390" },
  sand: { bg: "linear-gradient(160deg,#f0ece3,#e8e1d3)", glyph: "#8a7a5a" },
  rose: { bg: "linear-gradient(160deg,#f1e8e6,#e9dad6)", glyph: "#a06a60" },
};

export default function Projects() {
  const router = useRouter();
  const [crossfade, setCrossfade] = useState<{ bg: string } | null>(null);

  // crossfade-into-case-study transition (brand-matched bg per project)
  const handleCaseStudyClick =
    (href: string, bg: string) => (e: React.MouseEvent) => {
      e.preventDefault();
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

        setTimeout(() => {
          document.documentElement.classList.add("scroll-smooth");
        }, 500);
      }, 500);
    };

  const clientProjects = [
    {
      title: "Financial record app",
      client: "Company X",
      date: "2024",
      glyph: "f",
      tint: "clay",
      description:
        "Chart-of-accounts platform with multi-layer user management and auto-generated financial recaps.",
      tech: ["React", "Express", "Node"],
      live: true,
      shots: [],
    },
    {
      title: "Web-based ERP",
      client: "Company X",
      date: "2024",
      glyph: "e",
      tint: "slate",
      description:
        "Inventory, transactions, and project management in one clean, responsive interface.",
      tech: ["React", "Material UI", "Node"],
      live: true,
      shots: [],
    },
    {
      title: "Company profile",
      client: "PT Maju Jaya Arkananta",
      date: "2024",
      glyph: "m",
      tint: "sand",
      description: "Catalogue API and product management.",
      tech: ["Express", "Node"],
      live: true,
      shots: [],
    },
    {
      title: "Community catalogue",
      client: "Rawa Belong Community",
      date: "2023",
      glyph: "r",
      tint: "rose",
      description: "Responsive catalogue web for a flower-shop community.",
      tech: ["React", "Flutter", "Node"],
      live: false,
      shots: [],
    },
    {
      title: "Company profile",
      client: "LeSeen Electronics",
      date: "2023",
      glyph: "l",
      tint: "slate",
      description: "Videotron company profile and product showcase.",
      tech: ["React", "Node", "Material UI"],
      live: false,
      shots: [],
    },
  ];

  return (
    <section
      id="projects"
      className="max-w-5xl mx-auto px-6 py-28 scroll-mt-24"
    >
      {/* unchanged portal crossfade */}
      {crossfade &&
        typeof window !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ backgroundColor: crossfade.bg }}
            className="fixed inset-0 z-99999 pointer-events-none"
          />,
          document.body,
        )}

      <Reveal>
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-14">
          <h2 className="font-serif font-light tracking-tight text-[clamp(2rem,4.5vw,3.2rem)]">
            Selected <em className="italic">work</em>
          </h2>
        </div>
      </Reveal>

      {/* CASE STUDIES */}
      <p className="text-faint text-xs uppercase tracking-[0.16em] mb-5">
        Case studies
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
        {/* featured: nest */}
        <Reveal className="md:col-span-2">
          <div
            onClick={handleCaseStudyClick("/projects/nest", "#fdfbf7")}
            className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_30px_60px_-38px_rgba(34,32,28,0.4)]"
          >
            <ProjectPreview
              size="featured"
              frame="phone"
              tintBg={TINTS.sage.bg}
              glyph="n"
              glyphColor={TINTS.sage.glyph}
              shots={["/nest-shot-1.png", "/nest-shot-2.png"]}
              alt="nest app screens"
            />
            <div className="p-10 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-faint text-xs uppercase tracking-[0.1em]">
                  Personal product
                </span>
                <span className="text-faint text-xs">v2.4.6</span>
              </div>
              <h3 className="font-serif text-3xl mb-3">nest</h3>
              <p className="text-ink-2 max-w-[42ch] mb-auto leading-relaxed">
                A bouncy expense splitter that photographs receipts, extracts
                the math with Gemini, and settles who-owes-who in the fewest
                possible transactions.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Next.js", "Supabase", "Gemini 2.5", "Zustand"].map((t) => (
                  <span
                    key={t}
                    className="text-[12.5px] text-ink-2 border border-line rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                Read the case study
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
            </div>
          </div>
        </Reveal>

        {/* featured: noted */}
        <Reveal className="md:col-span-2" delay={0.1}>
          <div
            onClick={handleCaseStudyClick("/projects/noted", "#0a0a0a")}
            className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_30px_60px_-38px_rgba(34,32,28,0.4)]"
          >
            <div className="p-10 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-faint text-xs uppercase tracking-widest">
                  Personal product
                </span>
                <span className="text-faint text-xs">v2.0.1</span>
              </div>
              <h3 className="font-serif text-3xl mb-3">noted</h3>
              <p className="text-ink-2 max-w-[42ch] mb-auto leading-relaxed">
                A minimalist, offline-first markdown editor for programmers —
                local-first storage, background sync, and a true three-way merge
                when the same note is edited on two devices.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Next.js", "Supabase", "CodeMirror", "IndexedDB"].map((t) => (
                  <span
                    key={t}
                    className="text-[12.5px] text-ink-2 border border-line rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                Read the case study
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
            </div>

            {/* dark editor preview — signals noted's terminal identity */}
            <div
              className="relative min-h-75 bg-[#0a0a0a] overflow-hidden flex flex-col"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              <div className="flex items-center gap-2 h-9 px-4 border-b border-[#262626] shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#d97757]" />
                <span className="text-[#888] text-xs">noted</span>
                <span className="ml-auto text-[#888] text-[11px]">saved</span>
              </div>
              <div className="flex-1 p-5 text-[13px] leading-relaxed">
                <p className="text-[#d97757] font-bold">
                  {"# local-first notes"}
                </p>
                <p className="text-[#e5e5e5] mt-2">
                  markdown that saves offline,
                </p>
                <p className="text-[#e5e5e5]">syncs everywhere, and never</p>
                <p className="text-[#e5e5e5]">loses a keystroke.</p>
                <p className="mt-4 text-[#d97757]">
                  - [x] <span className="text-[#e5e5e5]">offline queue</span>
                </p>
                <p className="text-[#d97757]">
                  - [x] <span className="text-[#e5e5e5]">3-way merge</span>
                </p>
                <p className="text-[#d97757]">
                  - [ ] <span className="text-[#e5e5e5]">ship v2.1</span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* CLIENT WORK */}
      <p className="text-faint text-xs uppercase tracking-[0.16em] mb-5">
        Client work
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clientProjects.map((p, i) => {
          const tint = TINTS[p.tint];
          return (
            <Reveal key={p.title + p.client} delay={(i % 2) * 0.05}>
              <div className="group h-full flex flex-col rounded-2xl border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_30px_60px_-38px_rgba(34,32,28,0.4)]">
                <ProjectPreview
                  tintBg={tint.bg}
                  glyph={p.glyph}
                  glyphColor={tint.glyph}
                  shots={p.shots}
                  alt={p.title}
                />
                <span className="text-faint text-xs uppercase tracking-[0.1em] mb-1">
                  {p.client} · {p.date}
                </span>
                <h3 className="font-serif text-xl mb-2">{p.title}</h3>
                <p className="text-ink-2 text-sm mb-auto leading-relaxed">
                  {p.description}
                </p>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[12px] text-ink-2 border border-line rounded-full px-2.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                      p.live ? "bg-[#6f9a6a]" : "bg-faint"
                    }`}
                    title={p.live ? "live" : "archived"}
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

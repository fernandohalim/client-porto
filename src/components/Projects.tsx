"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Reveal from "@/utilities/Reveal";

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
  const [isAnimating, setIsAnimating] = useState(false);

  // unchanged crossfade-into-nest transition
  const handleCaseStudyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimating(true);

    setTimeout(() => {
      document.documentElement.classList.remove("scroll-smooth");

      const layout = document.getElementById("global-layout");
      if (layout) {
        layout.style.transition = "none";
        layout.style.backgroundColor = "#fdfbf7";
      }

      window.scrollTo(0, 0);
      router.push("/projects/nest", { scroll: false });

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
    },
  ];

  return (
    <section
      id="projects"
      className="max-w-5xl mx-auto px-6 py-28 scroll-mt-24"
    >
      {/* unchanged portal crossfade */}
      {isAnimating &&
        typeof window !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#fdfbf7] z-[99999] pointer-events-none"
          />,
          document.body,
        )}

      <Reveal>
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-14">
          <h2 className="font-serif font-light tracking-tight text-[clamp(2rem,4.5vw,3.2rem)]">
            Selected <em className="italic">work</em>
          </h2>
          <span className="text-faint text-sm">
            2023 — 2026 · five shipped, two in progress
          </span>
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
            onClick={handleCaseStudyClick}
            className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-line-2 hover:shadow-[0_30px_60px_-38px_rgba(34,32,28,0.4)]"
          >
            <div
              className="flex items-center justify-center min-h-[280px] overflow-hidden"
              style={{ background: TINTS.sage.bg }}
            >
              <span
                className="font-serif italic text-[6rem] opacity-50 transition-transform duration-700 group-hover:scale-110"
                style={{ color: TINTS.sage.glyph }}
              >
                n
              </span>
            </div>
            <div className="p-10 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-faint text-xs uppercase tracking-[0.1em]">
                  Personal product
                </span>
                <span className="text-faint text-xs">v2.4</span>
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

        {/* two in-progress slots */}
        {[0, 1].map((i) => (
          <Reveal key={i} delay={0.1 + i * 0.08}>
            <div className="flex flex-col items-center justify-center text-center min-h-[230px] rounded-2xl border border-dashed border-line-2 text-faint">
              <span className="text-xs uppercase tracking-[0.1em] border border-line-2 rounded-full px-3 py-1.5 mb-4">
                In progress
              </span>
              <h3 className="font-serif italic text-xl text-ink-2">
                case study, soon
              </h3>
            </div>
          </Reveal>
        ))}
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
                <div
                  className="flex items-center justify-center rounded-xl aspect-[16/9] mb-6 overflow-hidden"
                  style={{ background: tint.bg }}
                >
                  <span
                    className="font-serif italic text-5xl opacity-50 transition-transform duration-700 group-hover:scale-110"
                    style={{ color: tint.glyph }}
                  >
                    {p.glyph}
                  </span>
                </div>
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

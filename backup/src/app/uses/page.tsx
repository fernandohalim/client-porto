"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Uses — the colophon page, rebuilt in the slab language.
//
// This page was left behind by the redesign: it was still painting with the
// warm legacy tokens (bone / smoke / ash), still shouting "USES" at 11vw in
// expanded caps, and still listing gear as twelve-column hairline rows. It now
// follows the same rules as every other section — a chip-marked opening, a
// scroll-filled statement, and card grids on the slab ground.
//
// Equipment names are sentence case here too. The old set was typed in caps as
// a styling device, which stops being necessary once the display face carries
// the emphasis on its own.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import SectionMark from "@/utilities/SectionMark";
import ScrollFill from "@/utilities/ScrollFill";
import PillButton from "@/utilities/PillButton";

const EASE = [0.16, 1, 0.3, 1] as const;

type Gear = { name: string; meta: string; desc: string };

const SECTIONS: { label: string; items: Gear[] }[] = [
  {
    label: "Workstation",
    items: [
      {
        name: "MacBook Air M2",
        meta: "Apple Silicon",
        desc: "Spring Boot microservices, Node environments and dockerised tests in total silence — with battery to spare.",
      },
    ],
  },
  {
    label: "Desk",
    items: [
      {
        name: "Lofree Flow2",
        meta: "84-key · low profile",
        desc: "The main board.",
      },
      {
        name: "Royal Kludge RK65",
        meta: "65% · mechanical",
        desc: "Compact secondary.",
      },
      {
        name: "Razer Basilisk",
        meta: "Mouse",
        desc: "Alongside dual 27″ 2K monitors.",
      },
    ],
  },
  {
    label: "Editors",
    items: [
      {
        name: "IntelliJ IDEA",
        meta: "Java",
        desc: "Does the heavy lifting for Spring Boot.",
      },
      { name: "VS Code", meta: "Web", desc: "React and Next.js work." },
      {
        name: "iTerm2",
        meta: "Terminal",
        desc: "Where system ops live, alongside the macOS terminal.",
      },
    ],
  },
  {
    label: "Database",
    items: [
      {
        name: "DataGrip",
        meta: "Primary GUI",
        desc: "Schemas, complex queries and inspecting large datasets efficiently.",
      },
      {
        name: "PL/SQL Developer",
        meta: "Oracle specialist",
        desc: "Triggers, packages and massive transaction batches.",
      },
    ],
  },
];

const TOTAL = SECTIONS.reduce((n, s) => n + s.items.length, 0);
const pad = (n: number) => String(n).padStart(2, "0");

export default function Uses() {
  // running index across every section, precomputed — mutating a counter during
  // render breaks under concurrent rendering, which can run the same component
  // twice and double-count
  const offsets: number[] = [];
  SECTIONS.reduce((n, sec, i) => {
    offsets[i] = n;
    return n + sec.items.length;
  }, 0);

  return (
    <main className="bg-white">
      {/* ── opening ── */}
      <section className="px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-36">
        <div className="mb-14">
          <PillButton label="Back home" href="/" tone="dark" cursor="Home" />
        </div>

        <div className="flex gap-4 md:gap-7">
          <SectionMark no="01" name="Colophon" className="mt-2" />
          <ScrollFill
            text={`${TOTAL} pieces of hardware and software I actually reach for every day — updated only when something earns its place.`}
            className="max-w-[22ch] md:max-w-[26ch]"
          />
        </div>
      </section>

      {/* ── the gear ── */}
      <section className="bg-slab px-5 py-16 md:px-8 md:py-24">
        {SECTIONS.map((section, si) => (
          <div key={section.label} className="mb-14 last:mb-0">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <span className="chip text-ink/55">{section.label}</span>
              <span className="mono-label text-mute">
                {pad(section.items.length)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                  transition={{
                    duration: 0.65,
                    delay: (i % 3) * 0.07,
                    ease: EASE,
                  }}
                  className="group flex flex-col rounded-card border border-line-slab bg-white p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="mono-label text-faint-2 transition-colors duration-400 group-hover:text-accent-deep">
                      {pad(offsets[si] + i + 1)}
                    </span>
                    <span className="chip text-ink/45">{item.meta}</span>
                  </div>

                  <h3 className="display mt-8 text-[clamp(1.15rem,2vw,1.45rem)]">
                    {item.name}
                  </h3>
                  <p className="mt-3 grow text-[13px] leading-relaxed text-mute">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── back out ── */}
      <section className="flex flex-wrap items-center justify-between gap-4 px-5 py-16 md:px-8 md:py-20">
        <span className="mono-label text-mute">
          {TOTAL} entries across {SECTIONS.length} categories
        </span>
        <PillButton
          label="See the work"
          href="/#work"
          tone="dark"
          cursor="Selected work"
        />
      </section>
    </main>
  );
}

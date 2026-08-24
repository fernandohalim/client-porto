"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Experience — S.04, the coal slab.
//
// The first pass at this section only restyled the old markup: it kept the
// twelve-column row grid, the "↳" bullet glyphs and the stacked mono meta from
// the previous theme, which is why it still read as the old design wearing new
// colours. This is the actual translation — the reference's card grid, which is
// how that site presents any set of peer items (services, fleet, team).
//
// Everything stays visible at rest. The work cards earn their hover flood
// because a screenshot can afford to be covered; a job description cannot, so
// these cards only lift and warm their border.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { motion } from "framer-motion";
import SectionMark from "@/utilities/SectionMark";
import ScrollFill from "@/utilities/ScrollFill";

const EASE = [0.16, 1, 0.3, 1] as const;

type Credit = {
  no: string;
  role: string;
  company: string;
  date: string;
  type: string;
  stack: string[];
  points: string[];
  active: boolean;
  linkedin: string;
};

const CREDITS: Credit[] = [
  {
    no: "01",
    role: "Java Application Developer",
    company: "PT Rintis Sejahtera",
    date: "Oct 2024 — Now",
    type: "Full-time",
    stack: ["Java", "Spring Boot", "Redis", "Oracle"],
    points: [
      "Real-time fraud detection microservices for interbank transaction networks.",
      "Complex database operations across massive volumes of financial records.",
    ],
    active: true,
    linkedin: "https://www.linkedin.com/company/pt-rintis-sejahtera/",
  },
  {
    no: "02",
    role: "Fullstack Developer",
    company: "WEBin",
    date: "Feb 2023 — Now",
    type: "Freelance studio",
    stack: ["Next.js", "React", "Node", "Go"],
    points: [
      "End-to-end custom builds for B2B clients — system design through deployment.",
      "Clean, documented APIs and responsive product interfaces.",
    ],
    active: true,
    linkedin: "https://www.linkedin.com/company/91073950",
  },
  {
    no: "03",
    role: "Frontend Developer",
    company: "PT Overo Digital Global",
    date: "Aug 2022 — Jan 2023",
    type: "Hybrid",
    stack: ["React", "Tailwind", "Flutter"],
    points: [
      "Client-facing web and cross-platform mobile interfaces with the UI/UX team.",
    ],
    active: false,
    linkedin: "https://www.linkedin.com/company/overo-global-technologies/",
  },
];

function Card({ c, i }: { c: Credit; i: number }) {
  return (
    <motion.a
      href={c.linkedin}
      target="_blank"
      rel="noreferrer"
      data-cursor="View LinkedIn"
      data-cursor-snap
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -70px 0px" }}
      transition={{ duration: 0.75, delay: i * 0.09, ease: EASE }}
      className="group flex flex-col rounded-card border border-line-dark bg-coal-2 p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent/45"
    >
      {/* ── head ── */}
      <div className="flex items-start justify-between gap-3">
        <span className="chip text-ash-2 transition-colors duration-400 group-hover:text-accent-soft">
          {c.no}
        </span>
        <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[3px] border border-line-dark text-ash-2 transition-all duration-400 group-hover:border-accent group-hover:bg-accent group-hover:text-coal">
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

      {/* ── role ── */}
      <h3 className="display mt-7 text-[clamp(1.3rem,2.1vw,1.65rem)] text-bone-2">
        {c.role}
      </h3>

      <p className="mono-label mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-ash-2">
        <span className="text-bone-2/85">{c.company}</span>
        {c.active && (
          <span className="flex items-center gap-1.5 text-accent-soft">
            <span className="h-1 w-1 animate-pulse rounded-full bg-accent-soft" />
            Active
          </span>
        )}
      </p>

      {/* ── what the job actually was ── */}
      <ul className="mt-6 grow space-y-3 border-t border-line-dark pt-5">
        {c.points.map((p) => (
          <li key={p} className="text-[13px] leading-relaxed text-ash-2">
            {p}
          </li>
        ))}
      </ul>

      {/* ── foot: dates, then the stack as chips ── */}
      <div className="mt-6 border-t border-line-dark pt-5">
        <p className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ash-2/80">
          <span>{c.date}</span>
          <span className="text-ash-2/40">·</span>
          <span>{c.type}</span>
        </p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {c.stack.map((s) => (
            <span key={s} className="chip text-ash-2/70">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      data-ground="dark"
      className="scroll-mt-20 bg-coal py-20 text-bone-2 md:py-28"
    >
      <div className="px-5 md:px-8">
        <div className="flex gap-4 md:gap-7">
          <SectionMark no="04" name="Experience" tone="bone" className="mt-2" />
          <ScrollFill
            tone="bone"
            text="Three years across a payments processor, a freelance studio and an agency floor — the throughline is shipping things other people depend on."
            className="max-w-[22ch] md:max-w-[26ch]"
          />
        </div>
      </div>

      {/* ── the cards ── */}
      <div className="mt-14 grid grid-cols-1 gap-2.5 px-5 md:mt-20 md:grid-cols-3 md:px-8">
        {CREDITS.map((c, i) => (
          <Card key={c.no} c={c} i={i} />
        ))}
      </div>

      {/* ── plate + note ── */}
      <div className="mt-2.5 grid grid-cols-1 gap-2.5 px-5 md:grid-cols-3 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -70px 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="md:col-span-2"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-card md:aspect-[21/9]">
            <Image
              src="/images/experience-slab.jpg"
              alt="Workspace"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="flex flex-col justify-center rounded-card border border-line-dark bg-coal-2 p-6"
        >
          <span className="chip text-ash-2">Why it matters</span>
          <p className="mt-5 text-sm leading-relaxed text-ash-2">
            The day job runs at a scale I could never simulate alone — millions
            of transactions, latency budgets in milliseconds, no forgiving path
            for a bad query. Everything I know about writing software that holds
            up came from there.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

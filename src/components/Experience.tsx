"use client";

import { motion } from "framer-motion";
import { Chars } from "@/utilities/TextReveal";

type Credit = {
  no: string;
  role: string;
  company: string;
  date: string;
  type: string;
  stack: string;
  points: string[];
  active: boolean;
};

const CREDITS: Credit[] = [
  {
    no: "A",
    role: "JAVA APPLICATION DEVELOPER",
    company: "PT Rintis Sejahtera",
    date: "Oct 2024 — Now",
    type: "Full-time",
    stack: "Java · Spring Boot · Redis · Oracle",
    points: [
      "Real-time fraud detection microservices for interbank transaction networks.",
      "Complex database operations across massive volumes of financial records.",
    ],
    active: true,
  },
  {
    no: "B",
    role: "FULLSTACK DEVELOPER",
    company: "WEBin",
    date: "Feb 2023 — Now",
    type: "Freelance studio",
    stack: "Next.js · React · Node · Go",
    points: [
      "End-to-end custom builds for B2B clients — system design through deployment.",
      "Clean, documented APIs and responsive product interfaces.",
    ],
    active: true,
  },
  {
    no: "C",
    role: "FRONTEND DEVELOPER",
    company: "PT Overo Digital Global",
    date: "Aug 2022 — Jan 2023",
    type: "Hybrid",
    stack: "React · Tailwind · Flutter",
    points: [
      "Client-facing web and cross-platform mobile interfaces with the UI/UX team.",
    ],
    active: false,
  },
];

export default function Experience() {
  return (
    <section
      id="about"
      className="bg-coal text-bone py-28 md:py-36 scroll-mt-24"
    >
      <div className="px-5 md:px-8">
        <span className="mono-label text-smoke">About — In production</span>

        <h2 className="display text-[clamp(2.2rem,6.5vw,5.5rem)] mt-8 max-w-[16ch]">
          <span className="block">
            <Chars text="I CARE ABOUT THE" stagger={0.02} />
          </span>
          <span className="block text-bone/40">
            <Chars text="PARTS NOBODY" stagger={0.02} delay={0.2} />
          </span>
          <span className="block">
            <Chars text="NOTICES" stagger={0.03} delay={0.4} />
            <span className="text-accent">.</span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-start-7 md:col-span-6 text-ash leading-relaxed max-w-[52ch]"
          >
            Two productions running in parallel: by day, payment-scale fraud
            systems where a missed millisecond is a missed transaction — by
            night, self-directed products where I own everything from the data
            model to the easing curve. The first taught me rigor. The second is
            where the rigor gets a personality.
          </motion.p>
        </div>

        {/* credit roll */}
        {CREDITS.map((c, i) => (
          <motion.div
            key={c.no}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`group border-t border-bone/15 py-8 grid grid-cols-12 gap-x-3 gap-y-4 ${
              i === CREDITS.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="col-span-1 font-mono text-xs text-smoke group-hover:text-accent transition-colors">
              {c.no}
            </span>
            <div className="col-span-11 md:col-span-5">
              <h3 className="display font-semibold text-[clamp(1.2rem,2.6vw,1.9rem)] transition-transform duration-500 group-hover:translate-x-2">
                {c.role}
              </h3>
              <p className="mono-label text-smoke mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-bone/70">{c.company}</span>
                <span>{c.date}</span>
                <span>{c.type}</span>
                {c.active && (
                  <span className="flex items-center gap-1.5 text-accent">
                    <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                    Active
                  </span>
                )}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <ul className="space-y-2">
                {c.points.map((p) => (
                  <li
                    key={p}
                    className="flex gap-3 text-sm text-ash leading-relaxed"
                  >
                    <span className="text-accent shrink-0">↳</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[11px] text-smoke mt-4 tracking-wide">
                {c.stack}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

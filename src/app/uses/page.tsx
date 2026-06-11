"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Chars } from "@/utilities/TextReveal";

type Gear = { name: string; meta: string; desc: string };

const SECTIONS: { label: string; items: Gear[] }[] = [
  {
    label: "Workstation",
    items: [
      {
        name: "MACBOOK AIR M2",
        meta: "Apple Silicon · Unix",
        desc: "Spring Boot microservices, Node environments, and dockerized tests in total silence — with battery to spare.",
      },
    ],
  },
  {
    label: "Desk",
    items: [
      {
        name: "LOFREE FLOW2",
        meta: "84-key · low profile",
        desc: "The main board.",
      },
      {
        name: "ROYAL KLUDGE RK65",
        meta: "65% · mechanical",
        desc: "Compact secondary.",
      },
      {
        name: "RAZER BASILISK",
        meta: "Mouse",
        desc: "Alongside dual 27″ 2K monitors.",
      },
    ],
  },
  {
    label: "Editors",
    items: [
      {
        name: "INTELLIJ IDEA",
        meta: "Java",
        desc: "Does the heavy lifting for Spring Boot.",
      },
      { name: "VS CODE", meta: "Web", desc: "React and Next.js work." },
      {
        name: "ITERM2",
        meta: "Terminal",
        desc: "Where system ops live, with the macOS terminal.",
      },
    ],
  },
  {
    label: "Database",
    items: [
      {
        name: "DATAGRIP",
        meta: "Primary GUI",
        desc: "Schemas, complex queries, and inspecting large datasets efficiently.",
      },
      {
        name: "PL/SQL DEVELOPER",
        meta: "Oracle specialist",
        desc: "Triggers, packages, and massive transaction batches.",
      },
    ],
  },
];

export default function Uses() {
  let counter = 0;

  return (
    <main className="min-h-screen pt-32 pb-28">
      <div className="px-5 md:px-8">
        <Link
          href="/"
          data-cursor="Back"
          className="group inline-flex items-center gap-2 mono-label text-smoke hover:text-ink transition-colors mb-14"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back home
        </Link>

        <span className="block mono-label text-smoke">
          Colophon — Equipment
        </span>
        <h1 className="display text-ink text-[clamp(3rem,11vw,9rem)] mt-6">
          <Chars text="USES" stagger={0.05} />
          <span className="text-accent">.</span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-smoke max-w-[52ch] leading-relaxed mt-8 mb-20"
        >
          The daily drivers — from Apple silicon to the tooling behind
          high-volume database work. Updated when something earns its place.
        </motion.p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.label} className="mb-16">
          <p className="mono-label text-smoke px-5 md:px-8 mb-2">
            {section.label}
          </p>
          {section.items.map((item, i) => {
            counter += 1;
            const no = String(counter).padStart(2, "0");
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group border-t border-line ${
                  i === section.items.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="px-5 md:px-8 py-5 grid grid-cols-12 items-baseline gap-x-3 gap-y-1">
                  <span className="col-span-2 md:col-span-1 font-mono text-xs text-ash transition-colors duration-300 group-hover:text-accent">
                    {no}
                  </span>
                  <h3 className="col-span-10 md:col-span-4 display font-semibold text-[clamp(1.2rem,2.8vw,1.8rem)] text-ink/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-ink">
                    {item.name}
                  </h3>
                  <p className="col-span-10 col-start-3 md:col-span-4 md:col-start-auto text-sm text-smoke leading-relaxed">
                    {item.desc}
                  </p>
                  <span className="col-span-10 col-start-3 md:col-span-3 md:col-start-auto md:text-right mono-label text-smoke">
                    {item.meta}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </main>
  );
}

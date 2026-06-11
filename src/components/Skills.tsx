"use client";

import { motion } from "framer-motion";
import { Chars } from "@/utilities/TextReveal";
import Marquee from "@/utilities/Marquee";

type Item = { name: string; tier: "Expert" | "Comfortable" | "Learning" };

const NOW: Item[] = [
  { name: "JAVA", tier: "Expert" },
  { name: "SPRING BOOT", tier: "Expert" },
  { name: "TYPESCRIPT", tier: "Expert" },
  { name: "NEXT.JS", tier: "Expert" },
  { name: "REACT", tier: "Expert" },
  { name: "TAILWIND", tier: "Expert" },
  { name: "ORACLE SQL", tier: "Comfortable" },
  { name: "REDIS", tier: "Comfortable" },
  { name: "GIT", tier: "Expert" },
  { name: "SUPABASE", tier: "Expert" },
];

const BEFORE: Item[] = [
  { name: "JAVASCRIPT", tier: "Expert" },
  { name: "GO", tier: "Expert" },
  { name: "NODE", tier: "Comfortable" },
  { name: "EXPRESS", tier: "Comfortable" },
  { name: "FLUTTER", tier: "Expert" },
  { name: "REACT NATIVE", tier: "Comfortable" },
  { name: "MYSQL", tier: "Comfortable" },
  { name: "FIREBASE", tier: "Comfortable" },
  { name: "MAVEN", tier: "Comfortable" },
  { name: "XCODE", tier: "Comfortable" },
];

function Row({ item, i }: { item: Item; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (i % 9) * 0.04 }}
      className="group flex items-baseline justify-between border-b border-line py-3"
    >
      <span className="display font-semibold text-lg md:text-xl [font-stretch:100%] transition-[font-stretch,color] duration-300 group-hover:[font-stretch:125%] group-hover:text-accent">
        {item.name}
      </span>
      <span
        className={`mono-label ${item.tier === "Expert" ? "text-ink" : item.tier === "Learning" ? "text-ash" : "text-smoke"}`}
      >
        {item.tier}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="stack" className="py-28 scroll-mt-24">
      <Marquee className="border-b border-line py-3 mb-20">
        {["TOOLING", "IS", "TASTE", "MADE", "OPERATIONAL"].map((t) => (
          <span key={t} className="flex items-center">
            <span className="display text-2xl text-ash px-6">{t}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>

      <div className="px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-14">
          <h2 className="display text-[clamp(3rem,9vw,8rem)] text-ink">
            <Chars text="STACK" stagger={0.05} />
          </h2>
          <span className="mono-label text-smoke pb-3">Hover a row</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <div>
            <p className="mono-label text-smoke mb-4 border-t border-line-2 pt-3">
              Everyday tech stack
            </p>
            {NOW.map((it, i) => (
              <Row key={it.name} item={it} i={i} />
            ))}
          </div>
          <div>
            <p className="mono-label text-smoke mb-4 border-t border-line-2 pt-3">
              Other tech stack
            </p>
            {BEFORE.map((it, i) => (
              <Row key={it.name} item={it} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Chars } from "@/utilities/TextReveal";
import Marquee from "@/utilities/Marquee";
import TechIcon, { TechKey } from "./TechIcon";

type Item = {
  key: TechKey;
  name: string;
  tier: "Expert" | "Comfortable" | "Learning";
};

const NOW: Item[] = [
  { key: "java", name: "JAVA", tier: "Expert" },
  { key: "spring-boot", name: "SPRING BOOT", tier: "Expert" },
  { key: "typescript", name: "TYPESCRIPT", tier: "Expert" },
  { key: "next", name: "NEXT.JS", tier: "Expert" },
  { key: "react", name: "REACT", tier: "Expert" },
  { key: "tailwind", name: "TAILWIND", tier: "Expert" },
  { key: "oracle-sql", name: "ORACLE SQL", tier: "Comfortable" },
  { key: "redis", name: "REDIS", tier: "Comfortable" },
  { key: "git", name: "GIT", tier: "Expert" },
];

const BEFORE: Item[] = [
  { key: "javascript", name: "JAVASCRIPT", tier: "Expert" },
  { key: "go", name: "GO", tier: "Comfortable" },
  { key: "node", name: "NODE", tier: "Comfortable" },
  { key: "express", name: "EXPRESS", tier: "Comfortable" },
  { key: "flutter", name: "FLUTTER", tier: "Comfortable" },
  { key: "react-native", name: "REACT NATIVE", tier: "Comfortable" },
  { key: "mysql", name: "MYSQL", tier: "Comfortable" },
  { key: "firebase", name: "FIREBASE", tier: "Learning" },
  { key: "maven", name: "MAVEN", tier: "Comfortable" },
];

function Row({ item, i }: { item: Item; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (i % 9) * 0.04 }}
    >
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        className="group relative flex items-baseline justify-between border-b border-line py-3"
      >
        {/* silhouette — springs in from the left with a slight unfurl */}
        <span
          className="absolute left-0 inset-y-0 flex items-center"
          aria-hidden
        >
          <motion.span
            variants={{
              rest: { opacity: 0, x: -20, scale: 0.5, rotate: -14 },
              hover: { opacity: 1, x: 0, scale: 1, rotate: 0 },
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              mass: 0.7,
            }}
            className="block w-6 h-6 text-ink"
          >
            <TechIcon variant={item.key} mono />
          </motion.span>
        </span>

        {/* the word yields — slightly softer spring so it trails the icon */}
        <motion.span
          variants={{ rest: { x: 0 }, hover: { x: 44 } }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 24,
            mass: 0.9,
          }}
          className="display font-semibold text-lg md:text-xl [font-stretch:100%] transition-[font-stretch,color] duration-500 ease-out group-hover:[font-stretch:120%] group-hover:text-accent"
        >
          {item.name}
        </motion.span>

        <span
          className={`mono-label ${
            item.tier === "Expert"
              ? "text-ink"
              : item.tier === "Learning"
                ? "text-ash"
                : "text-smoke"
          }`}
        >
          {item.tier}
        </span>
      </motion.div>
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

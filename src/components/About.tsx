"use client";

// ─────────────────────────────────────────────────────────────────────────────
// About — S.01, on white.
//
// The reference opens every section with one long sentence set huge and filled
// word-by-word on scroll, then drops into a hairline stat grid. The stats are
// what give that site its authority, so this one substitutes the only numbers
// a portfolio actually owns: shipped counts, clients, years, stack breadth.
// Every figure here is derived from the real project and stack data further
// down the page rather than invented.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { motion } from "framer-motion";
import SectionMark from "@/utilities/SectionMark";
import ScrollFill from "@/utilities/ScrollFill";
import PillButton from "@/utilities/PillButton";

const EASE = [0.16, 1, 0.3, 1] as const;

type Stat = { value: string; label: string; icon: React.ReactNode };

const I = (d: string) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.15"
    strokeLinecap="square"
    aria-hidden
  >
    <path d={d} />
  </svg>
);

const STATS: Stat[] = [
  {
    value: "17",
    label: "Projects shipped",
    icon: I("M2.5 5.5h15v11h-15zM2.5 9h15M7 5.5v11"),
  },
  {
    value: "8",
    label: "Clients served",
    icon: I("M10 3.5 17 7.5v5L10 16.5 3 12.5v-5zM10 9.5 17 7.5M10 9.5v7"),
  },
  {
    value: "5",
    label: "Case studies written",
    icon: I("M4.5 3.5h11v13h-11zM7 7h6M7 10h6M7 13h3.5"),
  },
  {
    value: "4",
    label: "Years building",
    icon: I("M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM10 6.5V10l2.5 2"),
  },
  {
    value: "22",
    label: "Technologies in rotation",
    icon: I("M3.5 6.5h5v5h-5zM11.5 6.5h5v5h-5zM3.5 13h5v3.5h-5zM11.5 13h5v3.5h-5z"),
  },
  {
    value: "3",
    label: "Roles held",
    icon: I("M3.5 16.5v-2a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v2M10 3.5a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5z"),
  },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white py-20 md:py-28">
      {/* ── opening statement ── */}
      <div className="px-5 md:px-8">
        <div className="flex gap-4 md:gap-7">
          <SectionMark no="01" name="About" className="mt-2" />
          <ScrollFill
            text="I build software at two very different scales — fraud detection for interbank payment networks, and products small enough that I own every decision in them."
            className="max-w-[22ch] md:max-w-[26ch]"
            lead={0}
          />
        </div>
      </div>

      {/* ── portrait + stat grid ── */}
      <div className="mt-16 grid grid-cols-1 gap-10 px-5 md:mt-24 md:grid-cols-12 md:gap-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="md:col-span-5"
        >
          <div className="relative aspect-[11/14] overflow-hidden rounded-card">
            <Image
              src="/images/about-portrait.jpg"
              alt="Fernando Halim"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <div className="flex flex-col md:col-span-6 md:col-start-7">
          {/* the grid — hairline dividers, thin icons, mono captions */}
          <div className="grid grid-cols-2 gap-x-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.07, ease: EASE }}
                className="flex items-start gap-3 border-b border-line py-5"
              >
                <span className="mt-1 shrink-0 text-ink/45">{s.icon}</span>
                <span>
                  <span className="display block text-[clamp(1.6rem,3vw,2.2rem)]">
                    {s.value}
                  </span>
                  <span className="mono-label mt-1 block text-mute">
                    {s.label}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-10"
          >
            <p className="max-w-[46ch] text-sm leading-relaxed text-mute">
              By day I write Java and Spring Boot services that score interbank
              transactions in real time, where a missed millisecond is a missed
              transaction. After hours I build and ship my own products
              end-to-end — data model through easing curve. The first taught me
              rigor; the second is where the rigor gets a personality.
            </p>
            <div className="mt-7">
              <PillButton
                label="Read the experience"
                href="/#experience"
                tone="dark"
                cursor="Experience"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

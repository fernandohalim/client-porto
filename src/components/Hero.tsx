"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Hero — "INVERT"
// Theme-true: flat bone / ink / accent, NO gradients, hairline rules, mono data.
// The title is STATIC. The interaction is the cursor: a hard-edged disc that
// inverts everything under it (mix-blend-difference — the NavBar trick), and a
// scroll-driven cut that flips the whole frame to a negative. Drop in as
// src/components/Hero.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Chars } from "@/utilities/TextReveal";

function Readout({
  mv,
  format,
}: {
  mv: MotionValue<number>;
  format: (n: number) => string;
}) {
  const [v, setV] = useState(() => format(mv.get()));
  useEffect(() => {
    const u = (l: number) => setV(format(l));
    u(mv.get());
    return mv.on("change", u);
  }, [mv, format]);
  return <>{v}</>;
}

function Timecode() {
  const [f, setF] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setF((x) => x + 1), 1000 / 24);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <>{`${p(Math.floor(f / 1440) % 60)}:${p(Math.floor(f / 24) % 60)}:${p(
      f % 24,
    )}`}</>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // scroll → cut the frame to a negative
  const invert = useTransform(scrollYProgress, [0.25, 0.95], [0, 1]);

  // cursor normalized for the HUD position readout
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const posX = useSpring(mx, { stiffness: 120, damping: 24 });
  const posY = useSpring(my, { stiffness: 120, damping: 24 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(Math.round(((e.clientX - r.left) / r.width) * 100));
    my.set(Math.round(((e.clientY - r.top) / r.height) * 100));
  };

  return (
    <section
      ref={ref}
      id="hero"
      onMouseMove={onMove}
      className="relative isolate min-h-screen overflow-hidden bg-bone text-ink"
    >
      {/* ── flat structural background ── */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <svg
          className="absolute inset-0 h-full w-full text-ink/[0.05]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="33.33"
            y1="0"
            x2="33.33"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.08"
          />
          <line
            x1="66.66"
            y1="0"
            x2="66.66"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.08"
          />
          <line
            x1="0"
            y1="66"
            x2="100"
            y2="66"
            stroke="currentColor"
            strokeWidth="0.08"
          />
        </svg>
        {[
          "top-20 left-5 md:left-8 border-t border-l",
          "top-20 right-5 md:right-8 border-t border-r",
          "bottom-10 left-5 md:left-8 border-b border-l",
          "bottom-10 right-5 md:right-8 border-b border-r",
        ].map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-line-2 ${c}`} />
        ))}
      </div>

      {/* faint oversized ghost — flat tint, static */}
      <span
        aria-hidden
        className="display pointer-events-none absolute -bottom-[4vw] right-[2vw] z-0 select-none text-ink/[0.035] text-[26vw] leading-none"
      >
        02
      </span>

      {/* vertical spine label */}
      <div className="absolute right-3 top-1/2 z-0 hidden -translate-y-1/2 lg:block">
        <span className="mono-label text-smoke [writing-mode:vertical-rl] [transform:rotate(180deg)] tracking-[0.32em]">
          Vol. 02 — Negative / Positive
        </span>
      </div>

      {/* ── content ── */}
      <div className="relative z-10 flex min-h-screen flex-col px-5 pb-10 pt-24 md:px-8">
        {/* top strip: slate + live HUD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mono-label flex items-start justify-between gap-6 border-b border-line pb-4 text-smoke"
        >
          <div className="flex flex-col gap-1">
            <span className="text-ink">Vol. 02 — Now showing</span>
            <span className="hidden sm:block">
              Fullstack · Interface Engineering
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 tabular-nums">
            <span className="flex items-center gap-2 text-ink">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              REC <Timecode />
            </span>
            <span className="hidden items-center gap-3 sm:flex">
              <span>
                POS{" "}
                <span className="text-ink">
                  <Readout
                    mv={posX}
                    format={(n) => String(n).padStart(2, "0")}
                  />
                  ·
                  <Readout
                    mv={posY}
                    format={(n) => String(n).padStart(2, "0")}
                  />
                </span>
              </span>
              <span>FORMAT 2.39:1</span>
            </span>
            <span className="hidden md:block">6.2°S 106.8°E</span>
          </div>
        </motion.div>

        {/* the static title */}
        <div className="flex flex-1 items-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="display select-none text-ink text-[clamp(3rem,12vw,10.5rem)] leading-[0.82]"
          >
            <span className="block">
              <Chars text="FERNANDO" stagger={0.04} delay={0.2} />
            </span>
            <span className="block text-right">
              <Chars text="HALIM" stagger={0.05} delay={0.5} />
              <span className="ml-2 align-top text-[0.32em] text-accent">
                ®
              </span>
            </span>
          </motion.h1>
        </div>

        {/* bottom: statement + status + scroll */}
        <div className="flex flex-col justify-between gap-6 border-t border-line pt-5 md:flex-row md:items-end">
          <p className="max-w-[46ch] text-sm leading-relaxed text-smoke">
            I direct and build interfaces — real-time fraud systems for banks by
            day, self-produced products like{" "}
            <span className="text-ink">nest.</span> and{" "}
            <span className="text-ink">noted.</span> after hours.
          </p>
          <div className="mono-label flex shrink-0 items-center gap-6 text-smoke">
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Available via WEBin
            </span>
            <a
              href="#work"
              data-cursor="↓"
              className="text-ink transition-colors hover:text-accent"
            >
              Selected Index ↓
            </a>
          </div>
        </div>
      </div>

      {/* ── scroll cut → whole frame goes negative ── */}
      <motion.div
        aria-hidden
        style={{ opacity: invert }}
        className="pointer-events-none absolute inset-0 z-30 bg-bone mix-blend-difference"
      />
    </section>
  );
}

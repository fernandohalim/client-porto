"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ScrollFill — the reference's signature opening move: a long sentence set
// huge, its words filling from faint to solid as the block scrolls through the
// viewport. The paragraph IS the headline; there is no separate title.
//
// Each word owns a slice of the scroll range, so the fill sweeps left-to-right
// through the sentence rather than fading the block as a whole.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

function Word({
  children,
  progress,
  range,
  dim,
  lead,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: string;
  lead: boolean;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mr-[0.26em] inline-block">
      {/* the unfilled ghost sits underneath at all times */}
      <span className={dim}>{children}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {lead ? <span className="text-accent">{children}</span> : children}
      </motion.span>
    </span>
  );
}

export default function ScrollFill({
  text,
  className = "",
  tone = "ink",
  /** highlight the first N words in the accent once filled */
  lead = 0,
}: {
  text: string;
  className?: string;
  tone?: "ink" | "bone";
  lead?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // starts filling as the block enters the lower third, completes just past
    // centre — so it is fully solid while you are actually reading it
    offset: ["start 0.82", "end 0.55"],
  });

  const words = text.split(" ");
  const dim = tone === "bone" ? "text-bone-2/20" : "text-ink/20";

  return (
    <p ref={ref} className={`statement flex flex-wrap ${className}`}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            dim={dim}
            lead={i < lead}
          >
            {w}
          </Word>
        );
      })}
    </p>
  );
}

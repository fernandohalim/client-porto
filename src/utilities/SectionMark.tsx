"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SectionMark — the boxed mono chips that open every section.
// Two stacked chips: the ordinal (S.01) over the section name. They sit in the
// left margin and, on wide viewports, hang beside the opening statement rather
// than above it — which is what gives the reference its "filed document" feel.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";

export default function SectionMark({
  no,
  name,
  tone = "ink",
  className = "",
}: {
  no: string; // "01" — rendered as S.01
  name: string;
  tone?: "ink" | "bone";
  className?: string;
}) {
  const color = tone === "bone" ? "text-bone-2" : "text-ink";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex shrink-0 flex-col items-start gap-[3px] ${color} ${className}`}
    >
      <span className="chip opacity-55">S.{no}</span>
      <span className="chip">{name}</span>
    </motion.div>
  );
}

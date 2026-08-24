"use client";

// ─────────────────────────────────────────────────────────────────────────────
// 404 — brought onto the slab theme.
//
// Was still painting with the legacy warm tokens and shouting LOST at 16vw in
// expanded caps. It also carried a bare `mono-label` attribute on the Link,
// which React passes straight through to the DOM as an unknown attribute.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import PillButton from "@/utilities/PillButton";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-white px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="w-full"
      >
        <span className="chip text-ink/55">Error 404</span>

        <h1 className="display mt-8 max-w-[14ch] text-[clamp(2.2rem,7vw,5.5rem)]">
          This page isn&rsquo;t in the index
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-7 max-w-[46ch] text-sm leading-relaxed text-mute">
          It may have moved, been renamed, or never existed at all. The work,
          the stack and the way to reach me are all still where you left them.
        </p>

        <div className="mt-11 flex flex-wrap gap-2.5">
          <PillButton label="Back home" href="/" tone="dark" cursor="Home" />
          <PillButton
            label="Selected work"
            href="/#work"
            tone="light"
            cursor="Work"
            className="border border-line"
          />
        </div>
      </motion.div>
    </main>
  );
}

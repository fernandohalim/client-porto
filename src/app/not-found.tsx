"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-paper">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <span className="mono-label text-smoke">
          Error 404 — Not in catalogue
        </span>
        <h1 className="display text-ink text-[clamp(3.5rem,16vw,12rem)] mt-6">
          LOST<span className="text-accent">.</span>
        </h1>
        <p className="text-ink-2 max-w-[42ch] mx-auto mt-7 mb-10 leading-relaxed">
          The page you&apos;re looking for has moved, been renamed, or never
          existed.
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-ink hover:border-ink transition-colors font-mono"
          data-cursor="Home"
          mono-label
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          BACK HOME
        </Link>
      </motion.div>
    </main>
  );
}

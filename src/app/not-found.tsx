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
        <span className="text-faint text-xs uppercase tracking-[0.16em]">
          Error 404
        </span>
        <h1 className="font-serif font-light tracking-tight text-[clamp(3rem,12vw,7rem)] mt-4 leading-none">
          Page <em className="italic text-accent">not found.</em>
        </h1>
        <p className="text-ink-2 max-w-[42ch] mx-auto mt-7 mb-10 leading-relaxed">
          The page you&apos;re looking for has moved, been renamed, or never
          existed.
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 border border-line-2 rounded-full px-6 py-3 text-ink hover:border-ink transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back home
        </Link>
      </motion.div>
    </main>
  );
}

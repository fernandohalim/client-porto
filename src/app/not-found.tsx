"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Typewriter from "@/utilities/Typewriter";
import DecryptText from "@/utilities/DecryptText";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden selection:bg-red-500/30">
      {/* dramatic background error glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-200 h-150 bg-red-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 w-full">
        {/* mock terminal header */}
        <div className="mb-8">
          <Typewriter command="traceroute " args="target_destination" />
        </div>

        {/* we use animate instead of whileInView here! */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight text-white flex flex-wrap items-center">
            <span className="text-red-500 mr-4 md:mr-6">
              <DecryptText text="[404]" />
            </span>
            <DecryptText text="fatal_error" />
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-zinc-400 font-mono text-sm md:text-base leading-relaxed mb-12 max-w-2xl lowercase"
        >
          connection refused. the sector you are trying to access has been
          deleted, moved, or never existed in the master branch.
        </motion.p>

        {/* action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 font-mono text-sm"
        >
          <Link
            href="/"
            className="group flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/60 transition-all"
          >
            <span className="text-red-500/70 group-hover:text-red-400 transition-colors">
              cd
            </span>
            <span className="text-red-400/90 group-hover:text-red-400 transition-colors">
              ~/home
            </span>
            <span className="text-red-500/50 group-hover:text-red-400 transition-colors">
              _&crarr;
            </span>
          </Link>
        </motion.div>

        {/* fake stack trace */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-zinc-900/50 font-mono text-xs text-zinc-600 space-y-2 lowercase"
        >
          <p>{`> stack trace:`}</p>
          <p className="pl-4">{`at router.resolve (next/router:1:404)`}</p>
          <p className="pl-4">{`at connection.refused (system/network:connection_lost)`}</p>
          <p className="pl-4 text-red-500/50">{`fatal: target out of bounds. aborting sequence.`}</p>
        </motion.div>
      </div>
    </main>
  );
}

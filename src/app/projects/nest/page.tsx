"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

export default function NestCaseStudy() {
  // variants for staggered animations
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <main
      className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-32 relative overflow-hidden"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {/* --- organic background textures --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-start justify-center">
        {/* subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] bg-size-[24px_24px] opacity-60"></div>

        {/* massive breathing gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-200 h-200 bg-emerald-200/40 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[20%] -right-[10%] w-150 h-150 bg-yellow-100/50 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 md:pt-24 relative z-10">
        {/* terminal escape hatch */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-stone-400 hover:text-emerald-600 mb-16 md:mb-24 transition-all group px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="text-stone-300 group-hover:-translate-x-1 transition-transform">
              &lt;-
            </span>
            [return_to_terminal]
          </Link>
        </motion.div>

        {/* MASSIVE HERO */}
        <div className="mb-32 md:mb-48 relative flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="w-full md:w-3/5"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse"></span>
              <span className="font-bold text-xs tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Case Study
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black tracking-tighter text-stone-800 mb-6 leading-[1.1]"
            >
              how i built <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
                nest.
              </span>{" "}
              🐣
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl font-bold text-stone-500 max-w-xl leading-relaxed mb-8"
            >
              a bouncy, highly interactive expense splitter that uses{" "}
              <strong className="text-stone-700">
                Google Gemini 2.5 Flash
              </strong>{" "}
              to automatically read your receipts and do the math for you.
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-4">
              <a
                href="https://nest-splitbill-app.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-stone-900 text-white rounded-full font-black tracking-widest uppercase text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-emerald-600 hover:shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all"
              >
                launch live app ↗
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Floating UI Cluster */}
          <div className="w-full md:w-2/5 h-80 relative hidden md:block perspective-1000">
            <motion.div
              animate={{ y: [0, -15, 0], rotateZ: [6, 4, 6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 bg-white border border-stone-100 shadow-xl rounded-2xl p-4 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                FH
              </div>
              <div>
                <p className="text-sm font-black text-stone-800">
                  You owe Michael
                </p>
                <p className="text-xs font-bold text-emerald-600">$45.00</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0], rotateZ: [-3, -1, -3] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-10 left-0 bg-stone-900 text-white pl-6 pr-3 py-3 rounded-full shadow-2xl flex items-center gap-4 z-20"
            >
              <span className="text-xs font-black tracking-widest uppercase">
                scan receipt
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                <span className="relative z-10 text-sm">✨</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-40">
          {/* Section 1: The Problem */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <div className="text-red-400 font-black text-sm tracking-widest uppercase mb-3">
                01. The Problem
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-stone-800">
                splitting tabs is a nightmare.
              </h2>
              <p className="text-stone-500 leading-relaxed font-bold text-lg">
                nobody wants to be the accountant on vacation. typing 30 line
                items from a crumpled dinner receipt into a spreadsheet is a
                miserable user experience that causes friction between friends.
              </p>
            </motion.div>

            {/* The physical receipt mock */}
            <motion.div
              variants={fadeUp}
              className="relative flex justify-center perspective-1000"
            >
              <motion.div
                whileHover={{ rotateZ: 0, scale: 1.05 }}
                className="bg-white p-8 w-72 rounded-t-lg shadow-xl border border-stone-200 transform rotate-3"
              >
                {/* zig-zag tear effect at bottom */}
                <div className="absolute bottom-0 left-0 w-full border-b-[6px] border-dashed border-stone-200 translate-y-0.75"></div>

                <div className="text-center mb-6 border-b-2 border-dashed border-stone-200 pb-4">
                  <h3 className="font-black text-xl text-stone-800 font-serif">
                    THE DINER
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">
                    Table 42 • Guests: 4
                  </p>
                </div>

                <div className="font-mono text-xs text-stone-500 space-y-3">
                  <div className="flex justify-between">
                    <span>1x Burger</span>
                    <span>$14.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2x Fries</span>
                    <span>$8.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Coke</span>
                    <span>$3.00</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-100 pt-2 text-stone-400">
                    <span>Tax</span>
                    <span>$2.15</span>
                  </div>
                  <div className="flex justify-between font-black text-stone-800 pt-2 text-sm">
                    <span>TOTAL</span>
                    <span>$32.40</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-red-100 bg-red-50 -mx-8 px-8 pb-4 text-center">
                  <p className="text-red-500 font-black text-xs uppercase tracking-widest">
                    Wait, who had the coke?
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Section 2: The AI Solution */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            {/* The laser scanner mock */}
            <motion.div
              variants={fadeUp}
              className="order-2 md:order-1 relative h-96 bg-stone-900 rounded-4xl overflow-hidden border-4 border-stone-800 shadow-2xl flex items-center justify-center group"
            >
              {/* placeholder image for the receipt photo */}
              <div className="w-48 h-64 bg-stone-800 rounded-lg border border-stone-700 flex flex-col items-center justify-center opacity-50">
                <span className="text-4xl mb-2">🧾</span>
                <span className="text-stone-500 font-mono text-xs">
                  processing_image...
                </span>
              </div>

              {/* The sweeping laser */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] z-10"
              />

              {/* scanning overlay grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

              {/* success popups */}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-10 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg"
              >
                data extracted successfully
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="order-1 md:order-2">
              <div className="text-emerald-500 font-black text-sm tracking-widest uppercase mb-3">
                02. The Solution
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-stone-800">
                zero manual entry.
              </h2>
              <p className="text-stone-500 leading-relaxed font-bold text-lg">
                by wiring up the{" "}
                <strong className="text-stone-700">
                  Google Gemini 2.5 Flash
                </strong>{" "}
                vision model, users simply snap a photo of their receipt. nest
                instantly parses the merchant, date, exact line items, prices,
                and taxes, converting a physical piece of paper into a digital,
                splittable tab in less than 3 seconds.
              </p>
            </motion.div>
          </motion.section>

          {/* Section 3: Engineering the Engine */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <div className="text-stone-400 font-black text-sm tracking-widest uppercase mb-3">
                03. The Architecture
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800">
                engineering the engine.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Zustand */}
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-8 rounded-4xl shadow-lg border border-stone-100 hover:border-blue-200 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  ⚛️
                </div>
                <h3 className="font-black text-xl text-stone-800 mb-3">
                  Zustand State
                </h3>
                <p className="text-sm font-bold text-stone-500 leading-relaxed">
                  implemented optimistic UI updates. when users tap to settle a
                  debt, the UI updates instantly while syncing to the database
                  silently in the background.
                </p>
              </motion.div>

              {/* Card 2: Supabase */}
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-8 rounded-4xl shadow-lg border border-stone-100 hover:border-green-200 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="font-black text-xl text-stone-800 mb-3">
                  Supabase Sync
                </h3>
                <p className="text-sm font-bold text-stone-500 leading-relaxed">
                  utilizing postgres webhooks and realtime channels to broadcast
                  settlement events instantly to all group members, keeping tabs
                  aligned globally.
                </p>
              </motion.div>

              {/* Card 3: Tailwind */}
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-8 rounded-4xl shadow-lg border border-stone-100 hover:border-purple-200 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <h3 className="font-black text-xl text-stone-800 mb-3">
                  Tailwind v4
                </h3>
                <p className="text-sm font-bold text-stone-500 leading-relaxed">
                  custom physics and micro-interactions built entirely with
                  modern tailwind features, keeping the client bundle incredibly
                  light and performant.
                </p>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// nest. — case study page
// editorial + engineering postmortem hybrid. brand-matched to the actual app.
// ─────────────────────────────────────────────────────────────────────────────

export default function NestCaseStudy() {
  // force scroll to top instantly on mount + restore the global layout bg on
  // unmount so the parent layout can crossfade back to its dark theme.
  useEffect(() => {
    document.documentElement.classList.remove("scroll-smooth");
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.documentElement.classList.add("scroll-smooth");
    }, 100);

    return () => {
      clearTimeout(timer);
      const layout = document.getElementById("global-layout");
      if (layout) {
        layout.style.transition = "";
        layout.style.backgroundColor = "";
      }
    };
  }, []);

  // shared spring variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.92, rotateX: 18 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 250, damping: 18, mass: 0.8 },
    },
  };

  const slideRight: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 220, damping: 22 },
    },
  };

  return (
    <main
      className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-32 relative overflow-hidden"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {/* ─── ambient background ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-start justify-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />

        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-emerald-200/40 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-yellow-100/50 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px]"
        />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-24 relative z-10 perspective-1000">
        {/* ─── escape hatch back to terminal ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-stone-400 hover:text-emerald-600 mb-12 md:mb-16 transition-all group px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="text-stone-300 group-hover:-translate-x-1 transition-transform">
              &lt;-
            </span>
            [return_to_terminal]
          </Link>
        </motion.div>

        {/* ─── hero ─────────────────────────────────────────────────────── */}
        <Hero fadeUp={fadeUp} />

        {/* ─── by-the-numbers ribbon ────────────────────────────────────── */}
        <StatsRibbon />

        {/* ─── two products in one app ──────────────────────────────────── */}
        <TwoProducts fadeUp={fadeUp} slideRight={slideRight} />

        {/* ─── the scanner pipeline ─────────────────────────────────────── */}
        <ScannerSection fadeUp={fadeUp} />

        {/* ─── interactive split engine ─────────────────────────────────── */}
        <SplitEngineSection fadeUp={fadeUp} />

        {/* ─── settlement graph ─────────────────────────────────────────── */}
        <SettlementGraphSection fadeUp={fadeUp} />

        {/* ─── engineering bug bounty ───────────────────────────────────── */}
        <BugBountySection fadeUp={fadeUp} />

        {/* ─── polish-pass details ──────────────────────────────────────── */}
        <PolishSection fadeUp={fadeUp} />

        {/* ─── tech stack ───────────────────────────────────────────────── */}
        <TechStackSection fadeUp={fadeUp} />

        {/* ─── ship it / cta ────────────────────────────────────────────── */}
        <FinalCTA fadeUp={fadeUp} />
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero({ fadeUp }: { fadeUp: Variants }) {
  return (
    <div className="mb-24 md:mb-40 relative grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
      <motion.div
        className="md:col-span-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
          <span className="font-bold text-xs tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Case Study · 2026
          </span>
          <span className="font-mono text-[10px] font-bold text-stone-400 hidden sm:inline">
            v2.4.6 · shipped
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-stone-800 mb-6 leading-[0.95]"
        >
          how i built <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">
            nest.
          </span>{" "}
          <span className="inline-block hover:rotate-12 transition-transform duration-300">
            🐣
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl font-bold text-stone-500 max-w-xl leading-relaxed mb-4"
        >
          a bouncy, opinionated expense splitter that snaps photos of receipts,
          extracts the math with{" "}
          <strong className="text-stone-700">Google Gemini 2.5 Flash</strong>,
          and uses a debt-minimizing settlement algorithm to figure out who pays
          who.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-sm md:text-base font-medium text-stone-400 italic max-w-lg leading-relaxed mb-8 font-serif"
        >
          built for the friend who&apos;s tired of being the group accountant.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <a
            href="https://nest-splitbill-app.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-stone-900 text-white rounded-full font-black tracking-widest uppercase text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-emerald-600 hover:shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all"
          >
            launch the app ↗
          </a>
          <a
            href="https://nest-splitbill-app.vercel.app/changelog"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white text-stone-600 border-2 border-stone-200 rounded-full font-black tracking-widest uppercase text-sm shadow-sm hover:border-emerald-200 hover:text-emerald-700 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all"
          >
            changelog 📝
          </a>
          <a
            href="https://github.com/fernandohalim/nest-app"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white text-stone-600 border-2 border-stone-200 rounded-full font-black tracking-widest uppercase text-sm shadow-sm hover:border-stone-800 hover:bg-stone-800 hover:text-white hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all"
          >
            source ⌥
          </a>
        </motion.div>
      </motion.div>

      {/* ─── floating UI cluster (real app pieces, not mockups) ─────────── */}
      <div className="md:col-span-5 h-96 md:h-[460px] relative hidden md:block perspective-1000">
        {/* receipt total card */}
        <motion.div
          animate={{
            y: [0, -16, 0],
            rotateZ: [4, 1, 4],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 right-2 bg-white border border-stone-100 shadow-2xl rounded-3xl p-5 z-30 w-[210px]"
        >
          <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">
            total expense
          </div>
          <div className="text-3xl font-black text-emerald-500 leading-none mb-3">
            <span className="text-base text-stone-300 align-top mr-0.5">
              Rp
            </span>
            342,800
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[9px] font-extrabold bg-pink-100 text-pink-700 border border-pink-200 px-2 py-0.5 rounded-md">
              kiwe
            </span>
            <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
              cuket
            </span>
            <span className="text-[9px] font-extrabold bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-md">
              you
            </span>
          </div>
        </motion.div>

        {/* settlement card */}
        <motion.div
          animate={{
            y: [0, 18, 0],
            rotateZ: [-3, -6, -3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
          className="absolute top-44 left-2 bg-stone-900 text-white pl-4 pr-2 py-3 rounded-3xl shadow-2xl flex items-center gap-3 z-40 w-[230px]"
        >
          <div className="flex flex-col">
            <span className="text-[8px] font-black tracking-widest text-stone-400 uppercase">
              you pay
            </span>
            <span className="text-sm font-black">michael</span>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <span className="text-base font-black text-emerald-400 leading-none">
              Rp 45,000
            </span>
            <span className="text-[8px] font-bold text-stone-500 mt-1">
              optimal route
            </span>
          </div>
        </motion.div>

        {/* scan-receipt pill */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotateZ: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-12 right-6 bg-emerald-500 text-white pl-5 pr-2 py-2.5 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-3 z-30"
        >
          <span className="text-[10px] font-black tracking-widest uppercase">
            scan receipt
          </span>
          <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center text-xs">
            ✨
          </div>
        </motion.div>

        {/* floating member avatar */}
        <motion.div
          animate={{ y: [0, -10, 0], rotateZ: [-12, -8, -12] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          className="absolute top-32 right-32 w-14 h-14 rounded-full bg-purple-100 text-purple-700 border-4 border-white shadow-xl flex items-center justify-center font-black text-sm z-50"
        >
          fh
        </motion.div>

        {/* item-by-item line */}
        <motion.div
          animate={{ y: [0, 14, 0], rotateZ: [2, 5, 2] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8,
          }}
          className="absolute bottom-32 left-12 bg-white border border-stone-100 shadow-xl rounded-2xl px-4 py-2 z-20 flex items-center gap-2"
        >
          <span className="text-xs font-black text-stone-700">🍔 burger</span>
          <span className="text-[9px] font-black bg-stone-100 border border-stone-200/60 px-1.5 py-0.5 rounded-md tabular-nums">
            2/3
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS RIBBON
// ─────────────────────────────────────────────────────────────────────────────

function StatsRibbon() {
  const stats = [
    { value: "10", label: "currencies" },
    { value: "3", label: "split modes" },
    { value: "24+", label: "releases" },
    { value: "<3s", label: "scan time" },
    { value: "0", label: "ratio drift" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="mb-32 md:mb-48"
    >
      <div className="bg-stone-900 text-white rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-stone-900/15">
        <div
          className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl"
          aria-hidden
        />

        <div className="relative z-10">
          <div className="text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            shipped &amp; live
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 220 }}
                className="flex flex-col"
              >
                <span className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
                  {s.value}
                </span>
                <span className="text-[10px] md:text-xs font-black text-stone-400 uppercase tracking-widest mt-2">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TWO PRODUCTS IN ONE
// ─────────────────────────────────────────────────────────────────────────────

function TwoProducts({
  fadeUp,
  slideRight,
}: {
  fadeUp: Variants;
  slideRight: Variants;
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={slideRight} className="mb-12 md:mb-16 max-w-3xl">
        <div className="text-stone-400 font-black text-sm tracking-widest uppercase mb-3">
          01. Two products, one app
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800 mb-4">
          a <span className="font-serif italic font-medium">cozy</span> trip
          ledger and a{" "}
          <span className="font-serif italic font-medium">brutal</span>{" "}
          quick-scan tool —{" "}
          <span className="text-emerald-600">in the same shell.</span>
        </h2>
        <p className="text-base md:text-lg font-medium text-stone-500 leading-relaxed">
          most splitters force one mental model. nest splits them on purpose: a
          permanent, group-aware ledger for ongoing trips, and a 7-day
          self-destructing receipt for that one dinner with strangers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TRIPS */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -8 }}
          className="bg-white rounded-[2rem] p-8 border-2 border-stone-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 group relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 bg-emerald-100/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="text-5xl">🎒</div>
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest bg-stone-50 border border-stone-100 px-2 py-1 rounded-md">
                permanent
              </span>
            </div>
            <h3 className="text-2xl font-black text-stone-800 mb-3">trips</h3>
            <p className="text-sm font-bold text-stone-500 leading-relaxed mb-6">
              dedicated spaces for ongoing group expenses. members, currency,
              owner, real-time multi-device sync, optional collaborative-edit
              mode. lives forever once marked settled.
            </p>
            <div className="space-y-2">
              {[
                "real-time supabase channels",
                "multi-payer splits with proportional crediting",
                "bookmark trips you didn't create",
                "auto-cleanup after 7 inactive days unless settled",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-2 text-xs font-bold text-stone-600"
                >
                  <span className="text-emerald-500 mt-0.5 shrink-0">↳</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* QUICK SPLITS */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -8 }}
          className="bg-stone-900 text-white rounded-[2rem] p-8 border-2 border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
            aria-hidden
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="text-5xl">🧾</div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-md flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                ephemeral · 7 days
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3">receipts</h3>
            <p className="text-sm font-bold text-stone-400 leading-relaxed mb-6">
              snap a photo, split, share an image, move on. no group, no members
              table, no sync overhead. server-side filtered by{" "}
              <span className="text-emerald-400 font-mono text-[11px]">
                created_by = auth.uid()
              </span>{" "}
              so they&apos;re truly private even before RLS lands.
            </p>
            <div className="space-y-2">
              {[
                "ephemeral_members stored inline as JSON",
                "exportable PNG via html-to-image + twemoji parse",
                "no trip overhead, fastest path to a settled bill",
                "auto-deleted by a nightly job after 7 days",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-2 text-xs font-bold text-stone-300"
                >
                  <span className="text-emerald-400 mt-0.5 shrink-0">↳</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCANNER PIPELINE
// ─────────────────────────────────────────────────────────────────────────────

function ScannerSection({ fadeUp }: { fadeUp: Variants }) {
  const stages = [
    { icon: "📤", label: "uploading", hint: "to supabase edge function" },
    { icon: "🔍", label: "reading", hint: "gemini 2.5 flash · vision" },
    { icon: "✨", label: "extracting", hint: "validated JSON shape" },
  ];

  const extractedItems = [
    { name: "1x cheeseburger", price: "Rp 78,000" },
    { name: "1x bavarian fries", price: "Rp 42,000" },
    { name: "2x lemon iced tea", price: "Rp 36,000" },
    { name: "1x chocolate mousse", price: "Rp 55,000" },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-12 md:mb-16 max-w-3xl">
        <div className="text-emerald-500 font-black text-sm tracking-widest uppercase mb-3">
          02. The scanner
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800 mb-4">
          photo →{" "}
          <span className="font-mono text-2xl md:text-4xl text-emerald-600 bg-emerald-50 px-3 py-1 rounded-2xl border-2 border-emerald-100">
            {"{ items, total, date }"}
          </span>
        </h2>
        <p className="text-base md:text-lg font-medium text-stone-500 leading-relaxed">
          a base64 image goes to a supabase edge function which calls Gemini 2.5
          Flash with a tight prompt and a JSON schema. the response is validated
          against a typed shape{" "}
          <span className="font-mono text-sm text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
            isValidScanResponse()
          </span>{" "}
          before it touches the UI — no trusting the model.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: scanner viewfinder */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-7 relative h-[440px] bg-stone-900 rounded-[2rem] overflow-hidden border-4 border-stone-800 shadow-2xl flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* receipt placeholder */}
          <div className="w-52 h-72 bg-stone-800 rounded-2xl border-2 border-stone-700/50 flex flex-col items-center justify-center opacity-60 relative shadow-2xl">
            <span className="text-4xl mb-3">🧾</span>
            <span className="text-stone-500 font-mono text-[10px] tracking-widest">
              processing_image...
            </span>
            <div className="absolute inset-x-4 top-12 space-y-2">
              {[40, 70, 30, 80, 50, 60, 35].map((w, i) => (
                <div
                  key={i}
                  className="h-1 bg-stone-700 rounded-full"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>

          {/* sweeping laser */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,1)] z-10"
          />

          {/* corner brackets */}
          <div className="absolute inset-12 pointer-events-none">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />
          </div>

          {/* status pills */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest uppercase text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              scan receipt
            </span>
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-500/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              live
            </span>
          </div>

          {/* success popup */}
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
            className="absolute bottom-8 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"
          >
            extracted 4 items · Rp 211,000
          </motion.div>
        </motion.div>

        {/* RIGHT: extracted JSON */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-5 bg-white rounded-[2rem] p-6 md:p-8 border-2 border-stone-100 shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              parsed output
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-stone-200" />
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {extractedItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ delay: 0.3 + i * 0.12, type: "spring" }}
                className="flex justify-between items-center bg-stone-50 px-4 py-3 rounded-2xl border border-stone-100"
              >
                <span className="text-sm font-extrabold text-stone-700">
                  {item.name}
                </span>
                <span className="text-sm font-black text-emerald-600 tabular-nums">
                  {item.price}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t-2 border-dashed border-stone-200 space-y-3">
            {[
              { label: "merchant", value: "burger&friends" },
              { label: "category", value: "food & bev" },
              { label: "date", value: "may 7, 2026" },
            ].map((kv) => (
              <div
                key={kv.label}
                className="flex justify-between text-[11px] font-black uppercase tracking-widest"
              >
                <span className="text-stone-400">{kv.label}</span>
                <span className="text-stone-700">{kv.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* stage strip */}
      <motion.div
        variants={fadeUp}
        className="mt-6 grid grid-cols-3 gap-3 md:gap-6"
      >
        {stages.map((stage, i) => (
          <div
            key={stage.label}
            className="bg-white border-2 border-stone-100 rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-50 flex items-center justify-center text-xl md:text-2xl shrink-0">
              {stage.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black text-stone-400 tabular-nums">
                  0{i + 1}
                </span>
                <span className="text-sm font-black text-stone-800">
                  {stage.label}
                </span>
              </div>
              <span className="text-[10px] md:text-[11px] font-bold text-stone-400 truncate block">
                {stage.hint}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLIT ENGINE — interactive
// ─────────────────────────────────────────────────────────────────────────────

type SplitMode = "equal" | "exact" | "adjustment";

function SplitEngineSection({ fadeUp }: { fadeUp: Variants }) {
  const [mode, setMode] = useState<SplitMode>("exact");

  const tabs: { id: SplitMode; label: string; hint: string }[] = [
    { id: "equal", label: "equally", hint: "the lazy default" },
    { id: "exact", label: "by item", hint: "weighted, with auto-tax math" },
    { id: "adjustment", label: "custom", hint: "split equally + extras" },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <div className="text-stone-400 font-black text-sm tracking-widest uppercase mb-3">
          03. The split engine
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800 mb-4">
          three ways to{" "}
          <span className="font-serif italic font-medium">divide</span> a single
          bill.
        </h2>
        <p className="text-base md:text-lg font-medium text-stone-500 leading-relaxed">
          tap below — each mode has its own data shape, its own validation
          rules, and its own UX surface in the form.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        {/* tab strip */}
        <div className="bg-stone-100 p-1.5 rounded-3xl flex gap-1 relative mb-6 max-w-md mx-auto">
          <motion.div
            layout
            className="absolute top-1.5 bottom-1.5 bg-white rounded-2xl shadow-sm"
            initial={false}
            animate={{
              left:
                mode === "equal" ? "1.5%" : mode === "exact" ? "34%" : "66.5%",
              width: "32%",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMode(t.id)}
              className={`flex-1 py-3 text-xs z-10 rounded-2xl transition-all active:scale-95 ${
                mode === t.id
                  ? "font-black text-stone-800"
                  : "font-bold text-stone-500 hover:text-stone-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="text-center text-xs font-bold text-stone-400 mb-8">
          {tabs.find((t) => t.id === mode)?.hint}
        </p>

        {/* live preview pane */}
        <div className="bg-white rounded-[2rem] border-2 border-stone-100 shadow-xl overflow-hidden min-h-[420px] md:min-h-[460px]">
          {mode === "equal" && <EqualPreview />}
          {mode === "exact" && <ExactPreview />}
          {mode === "adjustment" && <AdjustmentPreview />}
        </div>
      </motion.div>
    </motion.section>
  );
}

function PreviewWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
    >
      <div>
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">
          live preview
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-stone-800 mb-3">
          {title}
        </h3>
        <p className="text-sm md:text-base font-medium text-stone-500 leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

function EqualPreview() {
  const members = ["fernando", "michael", "kiwe", "cuket"];
  const total = 320000;
  const share = total / members.length;

  return (
    <PreviewWrapper
      title="split equally"
      subtitle="select who's involved, divide the total. zero ambiguity, zero math, zero arguing about pizza slices."
    >
      <div className="bg-stone-50 rounded-3xl p-5 border-2 border-stone-100">
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            ramen night
          </span>
          <span className="text-2xl font-black text-emerald-600 tabular-nums">
            Rp {total.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m}
              className="flex justify-between items-center bg-white p-3 rounded-2xl border-2 border-emerald-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-stone-800">{m}</span>
              </div>
              <span className="text-sm font-black text-emerald-600 tabular-nums">
                Rp {share.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t-2 border-dashed border-stone-200 flex items-center justify-center gap-2">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            total ÷ {members.length} people
          </span>
        </div>
      </div>
    </PreviewWrapper>
  );
}

function ExactPreview() {
  const items = [
    {
      name: "🍔 cheeseburger",
      price: 78000,
      assigned: [{ name: "fh", weight: 1 }],
    },
    {
      name: "🍟 fries (shared)",
      price: 42000,
      assigned: [
        { name: "fh", weight: 1 },
        { name: "kiwe", weight: 1 },
      ],
    },
    {
      name: "🥤 lemon tea",
      price: 36000,
      assigned: [{ name: "kiwe", weight: 2 }],
    },
  ];

  return (
    <PreviewWrapper
      title="split by item — with weights"
      subtitle="tap a member multiple times to give them a larger share. nest auto-distributes the tax/tip proportional to each person's base spend, so the math doesn't drift on re-edits."
    >
      <div className="space-y-3">
        {items.map((item) => {
          const totalWeight = item.assigned.reduce((s, a) => s + a.weight, 0);
          return (
            <div
              key={item.name}
              className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden shadow-sm"
            >
              <div className="flex items-center bg-stone-50 border-b-2 border-stone-100">
                <span className="flex-1 px-3 py-2.5 text-sm font-black text-stone-700">
                  {item.name}
                </span>
                <span className="px-3 py-2.5 text-sm font-black text-emerald-600 tabular-nums border-l-2 border-stone-100">
                  Rp {item.price.toLocaleString()}
                </span>
              </div>
              <div className="px-3 py-2.5 flex flex-wrap gap-1.5">
                {item.assigned.map((a) => (
                  <span
                    key={a.name + a.weight}
                    className="text-[10px] font-black bg-stone-800 text-white pl-3 pr-2 py-1 rounded-full flex items-center gap-1.5"
                  >
                    {a.name}
                    {a.weight > 1 && (
                      <span className="bg-emerald-500 px-1.5 py-0.5 rounded text-[9px]">
                        x{a.weight}
                      </span>
                    )}
                  </span>
                ))}
                {item.assigned.length > 1 && (
                  <span className="text-[10px] font-black text-stone-400 self-center ml-1">
                    {item.assigned.length} sharing · {totalWeight} units
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-3 flex items-start gap-2 mt-2">
          <span className="text-base">💡</span>
          <p className="text-[11px] font-bold text-amber-800 leading-tight">
            tax/tip auto-distributes proportional to each person&apos;s base
            spend. <span className="font-black">no ratio drift, ever.</span>
          </p>
        </div>
      </div>
    </PreviewWrapper>
  );
}

function AdjustmentPreview() {
  const members = [
    { name: "fernando", base: 80000, extra: 0 },
    { name: "michael", base: 80000, extra: 25000 },
    { name: "kiwe", base: 80000, extra: 0 },
    { name: "cuket", base: 80000, extra: 0 },
  ];

  return (
    <PreviewWrapper
      title="custom adjustments"
      subtitle="split equally — but stack a personal extra on top. michael ordered the wagyu? he gets the wagyu charge added without changing anyone else's share."
    >
      <div className="bg-stone-50 rounded-3xl p-5 border-2 border-stone-100">
        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m.name}
              className="bg-white p-3 rounded-2xl border-2 border-stone-100 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-stone-800">
                  {m.name}
                </span>
                <span className="text-sm font-black text-stone-700 tabular-nums">
                  Rp {(m.base + m.extra).toLocaleString()}
                </span>
              </div>
              {m.extra > 0 && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-stone-200">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                    + adjusted bill
                  </span>
                  <span className="text-[10px] font-black text-amber-600 tabular-nums">
                    +Rp {m.extra.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PreviewWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTLEMENT GRAPH
// ─────────────────────────────────────────────────────────────────────────────

function SettlementGraphSection({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <div className="text-stone-400 font-black text-sm tracking-widest uppercase mb-3">
          04. The settlement engine
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800 mb-4">
          who pays who?{" "}
          <span className="font-serif italic font-medium">as few</span>{" "}
          transactions{" "}
          <span className="font-serif italic font-medium">as possible</span>.
        </h2>
        <p className="text-base md:text-lg font-medium text-stone-500 leading-relaxed">
          a greedy debt-minimizing match. compute every member&apos;s net
          balance, sort the debtors and creditors by magnitude, then iterate:
          the largest debtor pays the largest creditor until one of them zeroes
          out. near-optimal in practice without the NP-hard solver.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* BEFORE */}
        <div className="bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
              before · raw debts
            </span>
            <span className="text-2xl font-black text-rose-500 tabular-nums">
              4 transactions
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { from: "fernando", to: "michael", amt: 45000 },
              { from: "kiwe", to: "michael", amt: 30000 },
              { from: "fernando", to: "kiwe", amt: 15000 },
              { from: "cuket", to: "fernando", amt: 20000 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-rose-100"
              >
                <span className="text-xs font-black text-stone-700 w-20 truncate">
                  {t.from}
                </span>
                <span className="text-rose-400">→</span>
                <span className="text-xs font-black text-stone-700 w-20 truncate">
                  {t.to}
                </span>
                <span className="ml-auto text-sm font-black text-rose-500 tabular-nums">
                  Rp {t.amt.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-[11px] font-bold text-rose-700/80 italic">
            naive view: every debt becomes its own venmo. nobody wants to do
            this on a sunday morning.
          </div>
        </div>

        {/* AFTER */}
        <div className="bg-stone-900 text-white rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div
            className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl"
            aria-hidden
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                after · optimized
              </span>
              <span className="text-2xl font-black text-emerald-400 tabular-nums">
                2 transactions
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { from: "fernando", to: "michael", amt: 60000 },
                { from: "cuket", to: "kiwe", amt: 50000 },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring" }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/10"
                >
                  <span className="text-xs font-black text-white w-20 truncate">
                    {t.from}
                  </span>
                  <span className="text-emerald-400">→</span>
                  <span className="text-xs font-black text-white w-20 truncate">
                    {t.to}
                  </span>
                  <span className="ml-auto text-sm font-black text-emerald-400 tabular-nums">
                    Rp {t.amt.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-[11px] font-bold text-emerald-300/80 italic">
              same balances, half the venmos. this is{" "}
              <span className="font-mono not-italic text-emerald-400">
                calculateSettlements()
              </span>
              .
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-6 bg-white border-2 border-stone-100 rounded-[2rem] p-6 md:p-8 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl shrink-0">🧠</div>
          <div>
            <h4 className="text-base md:text-lg font-black text-stone-800 mb-2">
              the trick that makes settled-debt math actually correct
            </h4>
            <p className="text-sm font-medium text-stone-500 leading-relaxed">
              when a debtor marks their share &quot;paid,&quot; nest credits the
              payer(s) <em>proportionally</em> to what each one originally
              fronted — not by dumping the entire amount on the first payer in
              the dictionary. multi-payer expenses with partial settlements stay
              perfectly balanced.{" "}
              <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                getProportionalPayerCredit()
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUG BOUNTY — engineering deep-dives
// ─────────────────────────────────────────────────────────────────────────────

const BUGS = [
  {
    id: "L12",
    title: "the penny drift bug",
    before: "ratio = total / sumOfItems\nshare *= ratio",
    after:
      "baseShare from exact item math\ndelta = total - sumOfItems\nshare += (base / sumOfItems) * delta",
    impact:
      "ratio multiplication compounded float errors on every re-save. exact splits drifted by pennies until totals stopped balancing. the fix isolates rounding to one proportional distribution step.",
  },
  {
    id: "L2",
    title: "multi-payer settled credit",
    before: "credit[firstPayerId] += settledAmount",
    after: "for each payer:\n  credit[id] += (paid / totalPaid) * settled",
    impact:
      "settling a multi-payer expense used to dump the full amount on whoever happened to be first in the paidBy dictionary. now everyone gets credited in exact proportion to what they fronted.",
  },
  {
    id: "L6",
    title: "quick-split privacy leak",
    before: "SELECT * WHERE trip_id IS NULL\n→ filter on client",
    after: "SELECT * WHERE trip_id IS NULL\n  AND created_by = auth.uid()",
    impact:
      "the receipts tab was returning every quick-split for every user, then filtering on the client. PII visible to anyone authenticated, plus a hard scaling cap. server-side filter closes the leak before RLS lands architecturally.",
  },
  {
    id: "L3",
    title: "float-safe currency equality",
    before: "if (sumPaid !== totalAmount) ...",
    after:
      "isAmountEqual(a, b, code) — tolerance\n0.5 for IDR/JPY/KRW, 0.01 elsewhere",
    impact:
      "33.33 + 33.33 + 33.34 ≠ 100 in javascript. the multi-payer validator rejected perfectly fine splits. now currency-aware tolerance — correct for both zero-decimal currencies and decimal ones.",
  },
  {
    id: "L4",
    title: "timezone drift on save",
    before: "new Date(input).toISOString()\n// silently shifts to UTC",
    after: "formatLocalISO(date) preserves\nwall-clock string end-to-end",
    impact:
      "an 11pm bali expense became a 4pm next-day expense in the user's view because the form round-tripped through UTC. now nest preserves local-clock strings end-to-end.",
  },
  {
    id: "L5",
    title: "trusting the LLM",
    before: "const items = data.items // 🤞",
    after:
      "isValidScanResponse(data):\n  every item has string name +\n  finite number price",
    impact:
      "Gemini is great until it isn't. one hallucinated response shape would crash the receipt builder. now every scan response is type-narrowed at the boundary before anything downstream consumes it.",
  },
];

function BugBountySection({ fadeUp }: { fadeUp: Variants }) {
  const [active, setActive] = useState(0);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <div className="text-rose-500 font-black text-sm tracking-widest uppercase mb-3">
          05. The bug bounty
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800 mb-4">
          six bugs i hunted{" "}
          <span className="font-serif italic font-medium">in production</span>.
        </h2>
        <p className="text-base md:text-lg font-medium text-stone-500 leading-relaxed">
          the unglamorous middle of any v2. these are real lines from the actual
          diff — kept and labelled in the codebase as L-fixes for posterity.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* sidebar list */}
        <div className="lg:col-span-4 space-y-2">
          {BUGS.map((bug, i) => (
            <button
              key={bug.id}
              type="button"
              onClick={() => setActive(i)}
              className={`w-full text-left flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                active === i
                  ? "bg-stone-900 text-white border-stone-900 shadow-xl"
                  : "bg-white border-stone-100 hover:border-stone-300 text-stone-700"
              }`}
            >
              <span
                className={`font-mono text-[10px] font-black px-2 py-1 rounded-md tabular-nums ${
                  active === i
                    ? "bg-emerald-500 text-white"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {bug.id}
              </span>
              <span className="text-sm font-black flex-1 truncate">
                {bug.title}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  active === i
                    ? "translate-x-1 text-emerald-400"
                    : "text-stone-300"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* detail panel */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border-2 border-stone-100 shadow-xl overflow-hidden">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs font-black bg-emerald-500 text-white px-3 py-1.5 rounded-md tabular-nums">
                {BUGS[active].id}
              </span>
              <h4 className="text-xl md:text-2xl font-black text-stone-800">
                {BUGS[active].title}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4">
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">
                  before
                </div>
                <pre className="text-[11px] md:text-xs font-mono text-stone-700 whitespace-pre-wrap break-words leading-relaxed">
                  {BUGS[active].before}
                </pre>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">
                  after
                </div>
                <pre className="text-[11px] md:text-xs font-mono text-stone-700 whitespace-pre-wrap break-words leading-relaxed">
                  {BUGS[active].after}
                </pre>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-stone-50 border border-stone-100 rounded-2xl p-4">
              <span className="text-xl shrink-0">💭</span>
              <p className="text-sm font-medium text-stone-600 leading-relaxed">
                {BUGS[active].impact}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POLISH PASS
// ─────────────────────────────────────────────────────────────────────────────

const POLISH_ITEMS = [
  {
    icon: "🎨",
    title: "twemoji everywhere",
    body: "every emoji parsed through twemoji on mount + via mutation observer for late-rendered nodes. consistent rendering whether you're on android, iphone, or the windows clock app.",
  },
  {
    icon: "📡",
    title: "real-time sync",
    body: "supabase postgres_changes channels broadcast every expense, member, and trip mutation. open the trip on two phones and watch them update in lockstep.",
  },
  {
    icon: "🔌",
    title: "honest offline screen",
    body: "useSyncExternalStore subscribes to navigator.onLine. losing wifi mid-edit shows a calm 'nest is sleeping' overlay instead of an unsyncable optimistic update.",
  },
  {
    icon: "🛡️",
    title: "the version guard",
    body: "polls /version.json on visibility change (debounced 30min). if the deployed version diverges from the bundle, the SW gets unregistered, caches purged, and the user is gently reloaded.",
  },
  {
    icon: "💱",
    title: "10 currencies, real math",
    body: "zero-decimal currencies (IDR, JPY, KRW) format and validate differently from decimal ones. tolerance, formatter, and symbol all flow from the same currencyCode source of truth.",
  },
  {
    icon: "🪟",
    title: "stage-based loading",
    body: "no Math.random() progress bars. every async stage (uploading → reading → extracting) renders its actual state. honest UI beats convincing fake progress.",
  },
  {
    icon: "🎚️",
    title: "explicit destructive severity",
    body: "every showConfirm carries an explicit severity prop. delete-trip is rose-red and titled 'nuke entire trip'; toggle-collaborative is the default emerald. severity in code, not inferred from titles.",
  },
  {
    icon: "📸",
    title: "exportable PNG receipts",
    body: "html-to-image rasterizes the off-screen receipt at 3x pixel ratio, twemoji-parsed for emoji fidelity. one tap saves a beautiful brand-matched image to the camera roll.",
  },
];

function PolishSection({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <div className="text-stone-400 font-black text-sm tracking-widest uppercase mb-3">
          06. The polish pass
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800 mb-4">
          eight details{" "}
          <span className="font-serif italic font-medium">no one</span> would
          notice if i hadn&apos;t shipped them.
        </h2>
        <p className="text-base md:text-lg font-medium text-stone-500 leading-relaxed">
          which is the point.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {POLISH_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }}
            className="bg-white p-6 rounded-3xl border-2 border-stone-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl mb-4">{item.icon}</div>
            <h4 className="font-black text-stone-800 text-base mb-2">
              {item.title}
            </h4>
            <p className="text-xs font-medium text-stone-500 leading-relaxed">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TECH STACK
// ─────────────────────────────────────────────────────────────────────────────

const TECH = [
  {
    name: "Next.js 15",
    role: "app router · server components · edge",
    color: "stone",
  },
  { name: "TypeScript", role: "strict everywhere", color: "blue" },
  {
    name: "Tailwind v4",
    role: "design tokens · arbitrary values",
    color: "sky",
  },
  {
    name: "Framer Motion",
    role: "spring animations · layout reflow",
    color: "purple",
  },
  {
    name: "Zustand",
    role: "state · individual selectors · optimistic UI",
    color: "amber",
  },
  {
    name: "Supabase",
    role: "postgres · realtime · edge functions · auth",
    color: "emerald",
  },
  {
    name: "Gemini 2.5 Flash",
    role: "vision · structured JSON output",
    color: "rose",
  },
  { name: "Twemoji", role: "cross-platform emoji parity", color: "pink" },
  {
    name: "html-to-image",
    role: "client-side PNG rasterization",
    color: "indigo",
  },
];

const COLOR_MAP: Record<string, { dot: string; border: string; bg: string }> = {
  stone: {
    dot: "bg-stone-700",
    border: "hover:border-stone-300",
    bg: "bg-stone-50",
  },
  blue: {
    dot: "bg-blue-500",
    border: "hover:border-blue-200",
    bg: "bg-blue-50",
  },
  sky: { dot: "bg-sky-500", border: "hover:border-sky-200", bg: "bg-sky-50" },
  purple: {
    dot: "bg-purple-500",
    border: "hover:border-purple-200",
    bg: "bg-purple-50",
  },
  amber: {
    dot: "bg-amber-500",
    border: "hover:border-amber-200",
    bg: "bg-amber-50",
  },
  emerald: {
    dot: "bg-emerald-500",
    border: "hover:border-emerald-200",
    bg: "bg-emerald-50",
  },
  rose: {
    dot: "bg-rose-500",
    border: "hover:border-rose-200",
    bg: "bg-rose-50",
  },
  pink: {
    dot: "bg-pink-500",
    border: "hover:border-pink-200",
    bg: "bg-pink-50",
  },
  indigo: {
    dot: "bg-indigo-500",
    border: "hover:border-indigo-200",
    bg: "bg-indigo-50",
  },
};

function TechStackSection({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="mb-32 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <div className="text-stone-400 font-black text-sm tracking-widest uppercase mb-3">
          07. The stack
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-800 mb-4">
          opinions, picked{" "}
          <span className="font-serif italic font-medium">on purpose</span>.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TECH.map((t) => {
          const c = COLOR_MAP[t.color];
          return (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ x: 4 }}
              className={`bg-white p-5 rounded-2xl border-2 border-stone-100 transition-all duration-300 ${c.border}`}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className="font-black text-stone-800">{t.name}</span>
              </div>
              <p className="text-xs font-bold text-stone-400 leading-snug pl-5">
                {t.role}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────

function FinalCTA({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="relative"
    >
      <motion.div
        variants={fadeUp}
        className="relative bg-emerald-700 text-white rounded-[2.5rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-emerald-900/15"
      >
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/40 rounded-full blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em] mb-4 block">
            08. ship it
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.05]">
            stop being the{" "}
            <span className="font-serif italic font-medium text-emerald-200">
              group accountant
            </span>
            .
          </h2>
          <p className="text-base md:text-lg font-medium text-emerald-100 leading-relaxed mb-10 max-w-xl">
            nest is live, free, and updates frequently. every receipt you scan
            saves a future argument.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://nest-splitbill-app.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 bg-white text-emerald-700 rounded-full font-black tracking-widest uppercase text-sm shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
            >
              launch nest ↗
            </a>
            <a
              href="https://nest-splitbill-app.vercel.app/changelog"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 bg-emerald-800/40 backdrop-blur-sm border-2 border-emerald-400/30 text-white rounded-full font-black tracking-widest uppercase text-sm hover:bg-emerald-800/60 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
            >
              read the changelog 📝
            </a>
            <a
              href="https://github.com/fernandohalim/nest-app"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 bg-stone-900/50 backdrop-blur-sm border-2 border-white/10 text-white rounded-full font-black tracking-widest uppercase text-sm hover:bg-stone-900/70 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
            >
              source on github ⌥
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-emerald-400/20 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-black text-emerald-200 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              shipped v2.4.6
            </span>
            <span>fernando halim · 2026</span>
            <span className="opacity-60">crafted with too much chamomile</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

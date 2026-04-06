"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NestCaseStudy() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-32"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-24 relative">
        {/* terminal escape hatch */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold text-stone-400 hover:text-emerald-600 mb-16 transition-colors group px-4 py-2 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md"
        >
          <span className="text-stone-300 group-hover:-translate-x-1 transition-transform">
            &lt;-
          </span>
          [return_to_terminal]
        </Link>

        {/* MASSIVE HERO */}
        <div className="mb-24 relative">
          {/* decorative blurred glow */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"></span>
            <span className="font-bold text-sm tracking-widest text-emerald-600 uppercase">
              Case Study
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-stone-800 mb-6 relative z-10 leading-tight">
            how i built <span className="text-emerald-700">nest.</span> 🐣
          </h1>
          <p className="text-xl font-bold text-stone-500 max-w-2xl leading-relaxed relative z-10">
            a bouncy, highly interactive expense splitter that uses Google
            Gemini 2.5 Flash to automatically read your receipts and do the math
            for you.
          </p>

          {/* Floating UI Artboard inside the page */}
          <div className="absolute right-0 top-12 hidden md:block w-72 h-72 pointer-events-none z-0">
            <div
              className="absolute top-0 right-0 bg-white border-2 border-stone-100 shadow-xl rounded-2xl p-3 flex items-center gap-3 transform rotate-6 animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <span className="text-stone-300">🔍</span>
              <span className="text-stone-300 text-xs font-bold">
                search trips...
              </span>
            </div>
            <div
              className="absolute bottom-12 right-12 bg-stone-900 text-white pl-6 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-3 transform -rotate-3 animate-bounce"
              style={{ animationDuration: "5s", animationDelay: "1s" }}
            >
              <span className="text-[10px] font-black tracking-widest uppercase">
                scan
              </span>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                <span className="relative z-10 text-lg">✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-32">
          {/* Section 1: The Problem */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-4 text-stone-800">
                the problem with splitting tabs.
              </h2>
              <p className="text-stone-600 leading-relaxed font-medium">
                nobody wants to be the accountant on vacation. typing 30 line
                items from a crumpled dinner receipt into a spreadsheet is a
                miserable user experience that causes friction between friends.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-red-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-400"></div>
              <div className="font-mono text-xs text-stone-400 space-y-2 blur-[1px]">
                <p>1x Burger ....... $14.50</p>
                <p>2x Fries ........ $8.00</p>
                <p>1x Coke ......... $3.00</p>
                <p>Tax ............. $2.15</p>
                <p className="text-red-400 mt-4 font-bold">
                  ERROR: DOES NOT SUM TO $32.40
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: The AI Solution */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-emerald-100/50"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md animate-pulse">
                  📸
                </div>
                <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-emerald-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-stone-800">
                      Gemini 2.5 Flash
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                      SUCCESS
                    </span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full w-3/4 mb-2"></div>
                  <div className="h-2 bg-stone-100 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-black tracking-tight mb-4 text-stone-800">
                zero manual entry.
              </h2>
              <p className="text-stone-600 leading-relaxed font-medium">
                by wiring up the Google Gemini 2.5 Flash vision model, users
                simply snap a photo of their receipt. nest instantly parses the
                merchant, date, exact line items, prices, and taxes, converting
                a physical piece of paper into a digital, splittable tab in less
                than 3 seconds.
              </p>
            </div>
          </section>

          {/* Section 3: Engineering the Engine */}
          <section>
            <h2 className="text-3xl font-black tracking-tight mb-8 text-stone-800">
              engineering the engine.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-stone-100 hover:border-emerald-200 transition-colors">
                <div className="text-3xl mb-4">⚛️</div>
                <h3 className="font-extrabold text-stone-800 mb-2">
                  Zustand State
                </h3>
                <p className="text-sm font-medium text-stone-500 leading-relaxed">
                  implemented optimistic UI updates. when users tap to settle a
                  debt, the UI updates instantly while syncing to the database
                  silently in the background.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-stone-100 hover:border-emerald-200 transition-colors">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="font-extrabold text-stone-800 mb-2">
                  Supabase Sync
                </h3>
                <p className="text-sm font-medium text-stone-500 leading-relaxed">
                  utilizing postgres webhooks and realtime channels to broadcast
                  settlement events instantly to all group members.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-stone-100 hover:border-emerald-200 transition-colors">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-extrabold text-stone-800 mb-2">
                  Tailwind v4
                </h3>
                <p className="text-sm font-medium text-stone-500 leading-relaxed">
                  custom physics and micro-interactions built without heavy
                  animation libraries, keeping the client bundle incredibly
                  light.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.main>
  );
}

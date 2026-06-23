"use client";

import { motion, Variants, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SVGProps, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// piggy wallet — case study. brand-matched to the real app:
// custom 1.8-stroke SVG icons (NO emoji), category swatches, numpad, food meter,
// alpha-leveled heatmap. palette: #5b5bd6 / #f5a623 / #20c9a6 / #1e1b2e / #f5f4fb
// ─────────────────────────────────────────────────────────────────────────────

const LIVE = "https://piggy-wallet-expense-tracker.vercel.app";
const REPO = "https://github.com/fernandohalim/piggy-wallet";

// ── Piggy's real icon system (copied 1:1 from components/ui/Icons.tsx) ───────
type IconProps = SVGProps<SVGSVGElement>;
const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const I = (p: IconProps) => <svg {...base} width="24" height="24" {...p} />;

const FoodIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 12h16" />
    <path d="M5.5 12a6.5 6.5 0 0 0 13 0" />
    <path d="M9 4.5c-.7 1 .7 2 0 3" />
    <path d="M13 4.5c-.7 1 .7 2 0 3" />
  </I>
);
const CartIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M3 4h2l2.2 10.5a1 1 0 0 0 1 .8h7.6a1 1 0 0 0 1-.8L20 7H6" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </I>
);
const BusIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="4" y="5" width="16" height="12" rx="2.5" />
    <path d="M4 11h16" />
    <path d="M8 17v2M16 17v2" />
    <path d="M7.5 14h.01M16.5 14h.01" />
  </I>
);
const BagIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M6.5 8h11l-1 11.2a1 1 0 0 1-1 .8H8.5a1 1 0 0 1-1-.8L6.5 8Z" />
    <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
  </I>
);
const BillIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M7 3h7l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 16h4" />
  </I>
);
const ClapperIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="8" width="18" height="12" rx="1.5" />
    <path d="M3 8l2.5-4h13L21 8" />
    <path d="M8 4l-1.5 4M13 4l-1.5 4" />
  </I>
);
const PillIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="8.5" width="18" height="7" rx="3.5" />
    <path d="M12 8.5v7" />
  </I>
);
const BoxIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path d="M4 7l8 4 8-4M12 11v10" />
  </I>
);
const HomeIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5" />
    <path d="M10 20v-5h4v5" />
  </I>
);
const ReceiptIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21V3Z" />
    <path d="M9 8h6M9 12h6" />
  </I>
);
const TargetIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" />
  </I>
);
const SettingsIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 7h9M17 7h3" />
    <path d="M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2.2" />
    <circle cx="9" cy="17" r="2.2" />
  </I>
);
const FlameIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 2.8c2.2 3.4 6 5.4 6 10.2a6 6 0 0 1-12 0c0-1.6.6-3 1.6-4.1.3 1.4 1.2 2.3 2.3 2.7C9.3 8.7 10.3 5.7 12 2.8Z" />
  </I>
);
const TrophyIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4.5v1.5A3.5 3.5 0 0 0 8 10M17 5h2.5v1.5A3.5 3.5 0 0 1 16 10" />
    <path d="M12 13v3M9 20h6l-1-4h-4l-1 4Z" />
  </I>
);
const PieIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9h9" />
  </I>
);
const CalendarIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
  </I>
);
const CheckIcon = (p: IconProps) => (
  <I {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </I>
);
const CloudIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 .5 8.5H7Z" />
  </I>
);
const DatabaseIcon = (p: IconProps) => (
  <I {...p}>
    <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
    <path d="M5 5.5v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" />
    <path d="M5 11.5v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" />
  </I>
);
const SyncIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 9a8 8 0 0 1 13.7-3.3L20 8" />
    <path d="M20 4v4h-4" />
    <path d="M20 15a8 8 0 0 1-13.7 3.3L4 16" />
    <path d="M4 20v-4h4" />
  </I>
);
const BackspaceIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M20 6H9L3 12l6 6h11a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" />
    <path d="M15 9.5l-4 5M11 9.5l4 5" />
  </I>
);
const PiggyMark = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...p}>
    <path d="M7 4.8 5.6 9 9.4 8.2Z" />
    <path d="M17 4.8 18.4 9 14.6 8.2Z" />
    <path
      fillRule="evenodd"
      d="M5 13a7 6 0 1 0 14 0a7 6 0 1 0-14 0Z
         M8.65 11.2a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0-1.7 0Z
         M13.65 11.2a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0-1.7 0Z
         M10.15 15a0.55 0.9 0 1 0 1.1 0a0.55 0.9 0 1 0-1.1 0Z
         M12.75 15a0.55 0.9 0 1 0 1.1 0a0.55 0.9 0 1 0-1.1 0Z"
    />
  </svg>
);

// category id → icon + color (Piggy's real CATEGORY_COLORS)
const CAT = {
  food: { label: "Food & Drinks", Icon: FoodIcon, color: "#5B5BD6" },
  groceries: { label: "Groceries", Icon: CartIcon, color: "#20C9A6" },
  transport: { label: "Transport", Icon: BusIcon, color: "#54B8F0" },
  shopping: { label: "Shopping", Icon: BagIcon, color: "#F5A623" },
  bills: { label: "Bills & Utilities", Icon: BillIcon, color: "#8B5CF6" },
  entertainment: {
    label: "Entertainment",
    Icon: ClapperIcon,
    color: "#EF5A6F",
  },
  health: { label: "Health", Icon: PillIcon, color: "#F472B6" },
  other: { label: "Other", Icon: BoxIcon, color: "#94A3B8" },
} as const;
type CatId = keyof typeof CAT;
const CAT_IDS = Object.keys(CAT) as CatId[];

// Piggy's swatch: color@10% bg, full-color icon
function Swatch({
  id,
  size = "h-9 w-9",
  icon = "h-5 w-5",
}: {
  id: CatId;
  size?: string;
  icon?: string;
}) {
  const { Icon, color } = CAT[id];
  return (
    <span
      className={`grid place-items-center ${size} shrink-0 rounded-full`}
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <Icon className={icon} />
    </span>
  );
}

const idr = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function PiggyWalletCaseStudy() {
  useEffect(() => {
    document.documentElement.classList.remove("scroll-smooth");
    window.scrollTo(0, 0);
    const t = setTimeout(
      () => document.documentElement.classList.add("scroll-smooth"),
      100,
    );
    return () => {
      clearTimeout(t);
      const layout = document.getElementById("global-layout");
      if (layout) {
        layout.style.transition = "";
        layout.style.backgroundColor = "";
      }
    };
  }, []);

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
    <main className="min-h-screen bg-[#f5f4fb] text-[#1e1b2e] selection:bg-[#e8e8fb] selection:text-[#4646b8] pb-32 relative overflow-hidden">
      <ScrollProgress />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 100% 0%, rgba(245,166,35,0.10), transparent 55%), radial-gradient(120% 90% at 0% 0%, rgba(91,91,214,0.12), transparent 50%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[760px] h-[760px] bg-[#5b5bd6]/20 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute bottom-[8%] right-[5%] w-[520px] h-[520px] bg-[#20c9a6]/20 rounded-full blur-[120px]"
        />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-24 relative z-10 [perspective:1000px]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#9c98b3] hover:text-[#5b5bd6] mb-12 md:mb-16 transition-all group px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#e6e3f0] shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="text-[#c9c5db] group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            back to portfolio
          </Link>
        </motion.div>

        <Hero fadeUp={fadeUp} />
        <StatsRibbon />
        <EntrySection fadeUp={fadeUp} slideRight={slideRight} />
        <BudgetSection fadeUp={fadeUp} />
        <InsightsSection fadeUp={fadeUp} />
        <ArchitectureSection fadeUp={fadeUp} />
        <TechStackSection fadeUp={fadeUp} />
        <FinalCTA fadeUp={fadeUp} />
      </div>
    </main>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 origin-left z-50 bg-gradient-to-r from-[#5b5bd6] via-[#54b8f0] to-[#20c9a6]"
    />
  );
}

function SectionLabel({
  n,
  text,
  color = "#9c98b3",
}: {
  n: string;
  text: string;
  color?: string;
}) {
  return (
    <div
      className="font-bold text-sm tracking-widest uppercase mb-3"
      style={{ color }}
    >
      {n}. {text}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────── HERO ───────
function Hero({ fadeUp }: { fadeUp: Variants }) {
  return (
    <div className="mb-24 md:mb-40 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <motion.div
        className="lg:col-span-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.div variants={fadeUp} className="mb-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ rotate: -6, scale: 1.05 }}
            className="w-16 h-16 rounded-[1.25rem] overflow-hidden shadow-xl shadow-[#5b5bd6]/15 ring-1 ring-black/5"
          >
            <Image
              src="/piggy-icon.png"
              alt="piggy wallet icon"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
          <span className="w-3 h-3 rounded-full bg-[#5b5bd6] shadow-[0_0_12px_rgba(91,91,214,0.6)] animate-pulse" />
          <span className="font-bold text-xs tracking-widest text-[#5b5bd6] uppercase bg-[#e8e8fb] px-3 py-1 rounded-full border border-[#d8d8f5]">
            Case Study · 2026
          </span>
          <span className="font-mono text-[10px] font-bold text-[#9c98b3] hidden sm:inline">
            v1.5 · shipped
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[#1e1b2e] mb-6 leading-[0.95]"
        >
          how i built <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b5bd6] via-[#7c6df0] to-[#5b5bd6]">
            piggy wallet.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl font-semibold text-[#6b6880] max-w-xl leading-relaxed mb-4"
        >
          an <strong className="text-[#1e1b2e]">offline-first</strong> expense
          tracker designed thumb-first: a native numpad, a custom icon language,
          daily food budgeting with rollover, and a spending calendar — all of
          it usable with zero signal.
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-sm md:text-base font-medium text-[#9c98b3] italic max-w-lg leading-relaxed mb-8"
        >
          built for the person who logs lunch on the subway, then forgets they
          were ever offline.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <a
            href={LIVE}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#1e1b2e] text-white rounded-full font-bold tracking-widest uppercase text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-[#5b5bd6] hover:shadow-[0_10px_20px_rgba(91,91,214,0.25)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all"
          >
            launch the app ↗
          </a>
          <a
            href={`${LIVE}/changelog`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white text-[#4a4760] border-2 border-[#e6e3f0] rounded-full font-bold tracking-widest uppercase text-sm shadow-sm hover:border-[#c7c2ec] hover:text-[#5b5bd6] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all"
          >
            changelog
          </a>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white text-[#4a4760] border-2 border-[#e6e3f0] rounded-full font-bold tracking-widest uppercase text-sm shadow-sm hover:border-[#1e1b2e] hover:bg-[#1e1b2e] hover:text-white hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all"
          >
            source
          </a>
        </motion.div>
      </motion.div>

      {/* floating cluster — real Piggy UI pieces, no emoji */}
      <div className="lg:col-span-5 h-96 lg:h-[480px] relative hidden lg:block">
        {/* food meter mini */}
        <motion.div
          animate={{ y: [0, -16, 0], rotateZ: [3, 1, 3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 bg-white border border-[#efedf7] shadow-2xl rounded-[1.15rem] p-4 z-30 w-[230px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#1e1b2e]">
              <span
                className="grid place-items-center h-8 w-8 rounded-full"
                style={{ background: "rgba(245,166,35,0.15)" }}
              >
                <FoodIcon className="h-4 w-4 text-[#f5a623]" />
              </span>
              Food
            </span>
            <span className="text-[10px] text-[#9c98b3]">Rp 50rb/day</span>
          </div>
          <p className="text-xl font-extrabold text-[#1e1b2e]">
            Rp 32.000 left
          </p>
          <div className="h-2 rounded-full bg-[#e6e3f0] overflow-hidden mt-2">
            <div className="h-full w-[36%] rounded-full bg-[#5b5bd6]" />
          </div>
          <p className="text-[10px] text-[#4646b8] mt-1.5 font-medium">
            +Rp 12.000 rolled over
          </p>
        </motion.div>

        {/* category swatch chip */}
        <motion.div
          animate={{ y: [0, 12, 0], rotateZ: [-3, -5, -3] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1,
          }}
          className="absolute top-40 left-0 bg-white border border-[#efedf7] shadow-xl rounded-full pl-2 pr-4 py-2 z-40 flex items-center gap-2.5"
        >
          <Swatch id="transport" size="h-8 w-8" icon="h-4 w-4" />
          <div className="leading-tight">
            <p className="text-xs font-bold text-[#1e1b2e]">Transport</p>
            <p className="text-[10px] text-[#9c98b3] tabular-nums">Rp 14.000</p>
          </div>
        </motion.div>

        {/* numpad save key */}
        <motion.div
          animate={{ y: [0, -12, 0], rotateZ: [-2, 2, -2] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
          className="absolute bottom-16 right-8 bg-[#5b5bd6] text-white rounded-[1.15rem] w-20 h-24 flex flex-col items-center justify-center gap-1.5 shadow-2xl shadow-[#5b5bd6]/40 z-30"
        >
          <CheckIcon className="h-7 w-7" strokeWidth={2.4} />
          <span className="text-xs font-semibold">Save</span>
        </motion.div>

        {/* streak flame */}
        <motion.div
          animate={{ y: [0, -10, 0], rotateZ: [-10, -6, -10] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.9,
          }}
          className="absolute top-28 right-36 bg-[#fff4dd] border-4 border-white shadow-xl rounded-2xl px-3 py-2.5 z-50 flex items-center gap-2"
        >
          <FlameIcon className="h-5 w-5 text-[#f5a623]" />
          <span className="text-sm font-extrabold text-[#b9791a] tabular-nums">
            14
          </span>
        </motion.div>

        {/* mini sidebar */}
        <motion.div
          animate={{ y: [0, 14, 0], rotateZ: [2, 4, 2] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.6,
          }}
          className="absolute bottom-28 left-10 bg-[#1e1b2e] rounded-[1.15rem] p-2.5 z-20 flex flex-col gap-2 shadow-2xl"
        >
          {[HomeIcon, ReceiptIcon, TargetIcon, SettingsIcon].map((Ic, k) => (
            <span
              key={k}
              className={`grid place-items-center h-9 w-9 rounded-xl ${k === 0 ? "bg-[#5b5bd6] text-white" : "text-[#a09cc0]"}`}
            >
              <Ic className="h-5 w-5" />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────── STATS RIBBON ───────
function StatsRibbon() {
  const stats = [
    { value: "100%", label: "offline-first" },
    { value: "8", label: "categories" },
    { value: "24", label: "custom icons" },
    { value: "0ms", label: "network wait" },
  ];
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="mb-32 md:mb-48"
    >
      <div className="bg-[#1e1b2e] text-white rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-[#1e1b2e]/15">
        <div
          className="absolute -top-20 -right-20 w-60 h-60 bg-[#5b5bd6]/30 rounded-full blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#20c9a6]/15 rounded-full blur-2xl"
          aria-hidden
        />
        <div className="relative z-10">
          <div className="text-[10px] md:text-xs font-bold text-[#9b97e8] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9b97e8] animate-pulse" />
            shipped &amp; live
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 220 }}
                className="flex flex-col"
              >
                <span className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white leading-none">
                  {s.value}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-[#a09cc0] uppercase tracking-widest mt-2">
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

// ─────────────────────────────────────────────── 01 · ENTRY (numpad) ───────
function EntrySection({
  fadeUp,
  slideRight,
}: {
  fadeUp: Variants;
  slideRight: Variants;
}) {
  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "000",
    "0",
    "back",
  ];
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={slideRight} className="mb-12 md:mb-16 max-w-3xl">
        <SectionLabel n="01" text="The entry screen" color="#5b5bd6" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1e1b2e] mb-4">
          a <span className="italic font-medium text-[#5b5bd6]">native</span>{" "}
          numpad, not the OS keyboard.
        </h2>
        <p className="text-base md:text-lg font-medium text-[#6b6880] leading-relaxed">
          on mobile the amount is the hero. a custom numpad — nine digits, a{" "}
          <span className="font-mono text-sm bg-[#efedf7] px-1.5 py-0.5 rounded">
            000
          </span>{" "}
          shortcut for thousands, a backspace, and a full-height save key —
          keeps the figure front-and-centre and saves in one thumb press. the
          category sits behind a colour-swatch dropdown, every icon hand-drawn
          on the same 1.8px grid.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* the real numpad */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-6 bg-[#1e1b2e] rounded-[2rem] p-5 border-4 border-[#2a2640] shadow-2xl"
        >
          <div className="text-center mb-4 pt-2">
            <div className="text-[9px] font-bold text-[#a09cc0] uppercase tracking-widest mb-1">
              amount
            </div>
            <div className="text-4xl font-extrabold text-white tabular-nums">
              <span className="text-lg text-[#6b6890] align-top mr-1">Rp</span>
              42.000
            </div>
          </div>
          <div className="flex items-stretch gap-2">
            <div className="grid grid-cols-3 gap-2 flex-1">
              {keys.map((k) => (
                <div
                  key={k}
                  className="h-12 rounded-2xl bg-white/[0.06] border border-white/10 text-lg font-semibold text-white grid place-items-center"
                >
                  {k === "back" ? <BackspaceIcon className="h-6 w-6" /> : k}
                </div>
              ))}
            </div>
            <div className="w-24 shrink-0 rounded-2xl bg-[#5b5bd6] text-white font-semibold shadow-[0_10px_34px_rgba(91,91,214,0.4)] flex flex-col items-center justify-center gap-1.5">
              <CheckIcon className="h-7 w-7" strokeWidth={2.4} />
              Save
            </div>
          </div>
        </motion.div>

        {/* category select, shown open */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-6 bg-white rounded-[2rem] p-6 md:p-7 border-2 border-[#efedf7] shadow-xl"
        >
          <span className="text-[10px] font-bold text-[#9c98b3] uppercase tracking-widest mb-4 block">
            pick a category
          </span>
          <div className="w-full h-12 px-3 rounded-[1.15rem] bg-white border-2 border-[#5b5bd6] flex items-center gap-2.5 mb-3">
            <Swatch id="food" />
            <span className="flex-1 font-medium text-[#1e1b2e]">
              Food &amp; Drinks
            </span>
            <span className="text-[#9c98b3] rotate-180">▾</span>
          </div>
          <div className="rounded-[1.15rem] border border-[#e6e3f0] shadow-[0_10px_34px_rgba(91,91,214,0.12)] p-1">
            {CAT_IDS.map((id) => {
              const active = id === "food";
              return (
                <div
                  key={id}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl ${active ? "bg-[#e8e8fb]" : ""}`}
                >
                  <Swatch id={id} size="h-8 w-8" icon="h-4 w-4" />
                  <span
                    className={`flex-1 text-sm ${active ? "font-semibold text-[#4646b8]" : "text-[#1e1b2e]"}`}
                  >
                    {CAT[id].label}
                  </span>
                  {active && <CheckIcon className="h-4 w-4 text-[#5b5bd6]" />}
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-[#fff7e8] border-2 border-[#f7e2b8] rounded-2xl p-3 text-[11px] font-semibold text-[#9a6a14] leading-tight">
            amounts are stored as integer rupiah — a zero-decimal currency means
            there are no float cents to round, ever.
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────── 02 · BUDGETS ───────
type Tab = "caps" | "food";
function BudgetSection({ fadeUp }: { fadeUp: Variants }) {
  const [tab, setTab] = useState<Tab>("caps");
  const tabs: { id: Tab; label: string; hint: string }[] = [
    {
      id: "caps",
      label: "category caps",
      hint: "one monthly ceiling per category",
    },
    {
      id: "food",
      label: "food allowance",
      hint: "a daily budget with rollover",
    },
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
        <SectionLabel n="02" text="The budget system" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1e1b2e] mb-4">
          two budgets, anchored to your{" "}
          <span className="italic font-medium text-[#5b5bd6]">payday</span>.
        </h2>
        <p className="text-base md:text-lg font-medium text-[#6b6880] leading-relaxed">
          a simple monthly cap per category, or a separate daily food allowance
          with rollover and projections. either way the cycle starts on{" "}
          <em>your</em> pay date, not the 1st — and that anchor syncs across
          devices.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="bg-[#edecf6] p-1.5 rounded-3xl flex gap-1 relative mb-6 max-w-md mx-auto">
          <motion.div
            layout
            className="absolute top-1.5 bottom-1.5 bg-white rounded-2xl shadow-sm"
            initial={false}
            animate={{ left: tab === "caps" ? "1.5%" : "50%", width: "48.5%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-xs z-10 rounded-2xl transition-all active:scale-95 ${tab === t.id ? "font-extrabold text-[#1e1b2e]" : "font-bold text-[#6b6880] hover:text-[#4a4760]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-center text-xs font-bold text-[#9c98b3] mb-8">
          {tabs.find((t) => t.id === tab)?.hint}
        </p>
        <div className="bg-white rounded-[2rem] border-2 border-[#efedf7] shadow-xl overflow-hidden">
          {tab === "caps" ? <CapsPreview /> : <FoodPreview />}
        </div>
      </motion.div>
    </motion.section>
  );
}

function CapsPreview() {
  const rows: { id: CatId; spent: number; cap: number }[] = [
    { id: "groceries", spent: 1080000, cap: 1500000 },
    { id: "transport", spent: 240000, cap: 400000 },
    { id: "shopping", spent: 560000, cap: 500000 },
    { id: "bills", spent: 320000, cap: 800000 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-6 md:p-8 space-y-3"
    >
      {rows.map((r) => {
        const { color, label } = CAT[r.id];
        const pct = Math.min(100, Math.round((r.spent / r.cap) * 100));
        const over = r.spent > r.cap;
        return (
          <div
            key={r.id}
            className="bg-[#f7f6fc] rounded-[1.15rem] p-4 border border-[#efedf7]"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <Swatch id={r.id} size="h-9 w-9" icon="h-5 w-5" />
              <span className="flex-1 font-semibold text-[#1e1b2e]">
                {label}
              </span>
              <span
                className={`text-xs font-extrabold tabular-nums ${over ? "text-[#ef5a6f]" : "text-[#6b6880]"}`}
              >
                {pct}%{over && " · over"}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-[#e6e3f0] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: over ? "#ef5a6f" : color,
                }}
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-[#9c98b3] tabular-nums">
              {idr(r.spent)} of {idr(r.cap)}
            </p>
          </div>
        );
      })}
    </motion.div>
  );
}

function FoodPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-6 md:p-8"
    >
      <div className="max-w-md mx-auto rounded-[1.15rem] bg-white border border-[#efedf7] shadow-[0_6px_20px_rgba(91,91,214,0.07)] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2.5 font-medium text-[#1e1b2e]">
            <span
              className="grid place-items-center h-9 w-9 rounded-full"
              style={{ background: "rgba(245,166,35,0.15)" }}
            >
              <FoodIcon className="h-5 w-5 text-[#f5a623]" />
            </span>
            Food &amp; Drinks
          </span>
          <span className="text-xs text-[#9c98b3]">Rp 50.000 · Rp 75.000</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#1e1b2e]">
            Rp 32.000 left today
          </p>
          <p className="text-xs text-[#9c98b3]">
            Rp 18.000 spent of Rp 50.000 available
          </p>
        </div>
        <div className="h-2.5 rounded-full bg-[#e6e3f0] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5b5bd6] transition-all"
            style={{ width: "36%" }}
          />
        </div>
        <p className="text-xs text-[#4646b8] font-medium">
          +Rp 12.000 rolled over from earlier days
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="rounded-xl bg-[#f5f4fb] p-2.5">
            <p className="text-[#9c98b3]">This week</p>
            <p className="font-semibold text-sm tabular-nums">
              Rp 214.000 / Rp 375.000
            </p>
          </div>
          <div className="rounded-xl bg-[#f5f4fb] p-2.5">
            <p className="text-[#9c98b3]">This cycle (projected)</p>
            <p className="font-semibold text-sm tabular-nums">
              Rp 1.180.000 / Rp 1.625.000
            </p>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-[#e6e3f0] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5b5bd6]"
            style={{ width: "72%" }}
          />
        </div>
      </div>
      <p className="text-center text-[11px] font-medium text-[#9c98b3] mt-4 max-w-md mx-auto">
        even, or a weekday / weekend split. unspent allowance rolls into today;
        overspend trims from it. piggy projects the week and the full cycle from
        your pace.
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────── 03 · INSIGHTS ───────
const ALPHAS = [0, 0.16, 0.4, 0.66, 1];
const EMPTY = "#ECEAF6";
function cellBg(level: number, hex: string) {
  if (level <= 0) return EMPTY;
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16),
    g = parseInt(h.slice(2, 4), 16),
    b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${ALPHAS[level]})`;
}
// deterministic levels for a 30-day month (offset 2 = starts Wed), last 6 days future
const HEAT_LEVELS = [
  1, 0, 2, 3, 0, 0, 1, 0, 2, 4, 1, 0, 0, 3, 2, 1, 0, 0, 2, 0, 4, 1, 0, 2,
];
const DONUT = [
  { id: "food" as CatId, pct: 0.34 },
  { id: "groceries" as CatId, pct: 0.22 },
  { id: "transport" as CatId, pct: 0.16 },
  { id: "shopping" as CatId, pct: 0.12 },
  { id: "bills" as CatId, pct: 0.09 },
  { id: "other" as CatId, pct: 0.07 },
];

function InsightsSection({ fadeUp }: { fadeUp: Variants }) {
  const [filter, setFilter] = useState<CatId | "all">("all");
  const base = filter === "all" ? "#5B5BD6" : CAT[filter].color;
  const C = 2 * Math.PI * 42;
  let acc = 0;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="03" text="Insights at a glance" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1e1b2e] mb-4">
          the home screen, made{" "}
          <span className="italic font-medium text-[#5b5bd6]">glanceable</span>.
        </h2>
        <p className="text-base md:text-lg font-medium text-[#6b6880] leading-relaxed">
          a category donut, a two-month spending calendar you can filter by
          category, and a streak that rewards the habit of logging.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* heatmap calendar */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-7 bg-white rounded-[2rem] p-6 border-2 border-[#efedf7] shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-base font-semibold text-[#1e1b2e]">
              <CalendarIcon className="h-5 w-5 text-[#5b5bd6]" /> Spending
              heatmap
            </span>
            <span className="text-xs text-[#9c98b3]">June 2026</span>
          </div>
          {/* category filter chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${filter === "all" ? "bg-[#1e1b2e] text-white border-[#1e1b2e]" : "bg-white text-[#6b6880] border-[#e6e3f0]"}`}
            >
              All
            </button>
            {CAT_IDS.slice(0, 5).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors"
                style={
                  filter === id
                    ? {
                        background: CAT[id].color,
                        color: "#fff",
                        borderColor: CAT[id].color,
                      }
                    : {
                        color: CAT[id].color,
                        borderColor: `${CAT[id].color}55`,
                      }
                }
              >
                {CAT[id].label.split(" ")[0]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="text-[9px] text-[#9c98b3] text-center">
                {d}
              </span>
            ))}
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={`pad${i}`} className="aspect-square" />
            ))}
            {HEAT_LEVELS.map((lvl, i) => {
              const future = i >= 18;
              const day = i + 1;
              return (
                <div
                  key={i}
                  className="aspect-square rounded-md grid place-items-center text-[9px] tabular-nums transition-colors"
                  style={{
                    background: future ? "#F3F1FA" : cellBg(lvl, base),
                    color:
                      lvl >= 3 && !future ? "rgba(255,255,255,0.9)" : "#9b98ad",
                    opacity: future ? 0.4 : 1,
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-[#9c98b3]">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                className="h-3 w-3 rounded-[3px]"
                style={{ background: cellBg(l, base) }}
              />
            ))}
            <span>More</span>
          </div>
        </motion.div>

        {/* donut + streak */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div className="bg-white rounded-[2rem] p-6 border-2 border-[#efedf7] shadow-xl">
            <span className="flex items-center gap-2 text-base font-semibold text-[#1e1b2e] mb-4">
              <PieIcon className="h-5 w-5 text-[#5b5bd6]" /> This cycle
            </span>
            <div className="flex items-center gap-5">
              <div className="relative w-[120px] h-[120px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {DONUT.map((s) => {
                    const dash = s.pct * C;
                    const off = -acc * C;
                    // eslint-disable-next-line react-hooks/immutability
                    acc += s.pct;
                    return (
                      <circle
                        key={s.id}
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={CAT[s.id].color}
                        strokeWidth="11"
                        strokeDasharray={`${dash} ${C - dash}`}
                        strokeDashoffset={off}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 grid place-content-center text-center">
                  <span className="text-base font-extrabold text-[#1e1b2e] tabular-nums leading-none">
                    Rp 4.2jt
                  </span>
                  <span className="text-[9px] text-[#9c98b3]">86 logged</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {DONUT.slice(0, 4).map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: CAT[s.id].color }}
                    />
                    <span className="flex-1 text-[#6b6880]">
                      {CAT[s.id].label.split(" ")[0]}
                    </span>
                    <span className="font-semibold tabular-nums text-[#1e1b2e]">
                      {Math.round(s.pct * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#1e1b2e] text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
            <div
              className="absolute -top-10 -right-10 w-32 h-32 bg-[#f5a623]/20 rounded-full blur-2xl"
              aria-hidden
            />
            <div className="relative z-10 flex items-center gap-4">
              <span className="grid place-items-center h-14 w-14 rounded-2xl bg-[#f5a623]/15">
                <FlameIcon className="h-7 w-7 text-[#f5a623]" />
              </span>
              <div>
                <p className="text-2xl font-extrabold tabular-nums leading-none">
                  14 days
                </p>
                <p className="text-xs text-[#a09cc0] mt-1">logging streak</p>
              </div>
              <div className="ml-auto flex gap-1.5">
                {[7, 14, 30].map((m) => (
                  <span
                    key={m}
                    className={`grid place-items-center h-10 w-10 rounded-xl ${m <= 14 ? "bg-[#5b5bd6]/20 text-[#9b97e8]" : "bg-white/5 text-[#56536e]"}`}
                  >
                    <TrophyIcon className="h-4 w-4" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ──────────────────────────────────────────── 04 · ARCHITECTURE ───────
function ArchitectureSection({ fadeUp }: { fadeUp: Variants }) {
  const steps = [
    {
      Icon: DatabaseIcon,
      label: "write local",
      hint: "IndexedDB via idb — instant, never blocks the UI",
    },
    {
      Icon: ReceiptIcon,
      label: "queue outbox",
      hint: "the mutation is appended to a durable outbox store",
    },
    {
      Icon: SyncIcon,
      label: "flush + merge",
      hint: "setDoc(merge) on reconnect · last-write-wins by updatedAt",
    },
  ];
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="04" text="Under the hood" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1e1b2e] mb-4">
          the network is an{" "}
          <span className="italic font-medium text-[#5b5bd6]">enhancement</span>
          , never a dependency.
        </h2>
        <p className="text-base md:text-lg font-medium text-[#6b6880] leading-relaxed">
          every expense lands in IndexedDB the instant you save it and is queued
          in an outbox. a guarded flush drains the queue to Firestore the moment{" "}
          <span className="font-mono text-sm bg-[#efedf7] px-1.5 py-0.5 rounded">
            navigator.onLine
          </span>{" "}
          flips true; live{" "}
          <span className="font-mono text-sm bg-[#efedf7] px-1.5 py-0.5 rounded">
            onSnapshot
          </span>{" "}
          listeners merge remote changes back, last-write-wins. soft-delete
          tombstones survive the round trip.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-6"
      >
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="bg-white border-2 border-[#efedf7] rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-[#f3f2fb] text-[#5b5bd6]">
                <s.Icon className="h-6 w-6" />
              </span>
              <div>
                <span className="text-[9px] font-bold text-[#9c98b3] tabular-nums block">
                  0{i + 1}
                </span>
                <span className="text-sm font-extrabold text-[#1e1b2e]">
                  {s.label}
                </span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-[#9c98b3] leading-relaxed">
              {s.hint}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-[#1e1b2e] text-white rounded-[2rem] p-6 md:p-8 shadow-xl flex items-start gap-4"
      >
        <span className="grid place-items-center h-11 w-11 shrink-0 rounded-xl bg-[#5b5bd6]/20 text-[#9b97e8]">
          <CloudIcon className="h-6 w-6" />
        </span>
        <p className="text-sm font-medium text-[#c9c5db] leading-relaxed">
          failed pushes stay queued and retry on the next{" "}
          <span className="font-mono text-[#9b97e8]">online</span> event, so two
          phones editing the same cycle stay eventually consistent — and a
          Serwist service worker makes the whole thing installable with a calm
          offline screen instead of a spinner.
        </p>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────── TECH STACK ───────
const TECH = [
  { name: "Next.js 16", role: "app router · server components" },
  { name: "React 19", role: "the latest runtime" },
  { name: "TypeScript", role: "strict everywhere" },
  { name: "Tailwind v4", role: "design tokens · @theme" },
  { name: "Firebase", role: "auth · firestore sync" },
  { name: "IndexedDB · idb", role: "offline-first local store" },
  { name: "Serwist", role: "service worker · installable PWA" },
  { name: "Recharts", role: "the spending donut" },
  { name: "Framer Motion", role: "spring animations" },
];
function TechStackSection({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="05" text="The stack" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1e1b2e] mb-4">
          modern, and picked{" "}
          <span className="italic font-medium text-[#5b5bd6]">on purpose</span>.
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TECH.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            whileHover={{ x: 4 }}
            className="bg-white p-5 rounded-2xl border-2 border-[#efedf7] transition-all duration-300 hover:border-[#d8d8f5]"
          >
            <div className="flex items-center gap-3 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5b5bd6]" />
              <span className="font-extrabold text-[#1e1b2e]">{t.name}</span>
            </div>
            <p className="text-xs font-bold text-[#9c98b3] leading-snug pl-5">
              {t.role}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────── FINAL CTA ───────
function FinalCTA({ fadeUp }: { fadeUp: Variants }) {
  const socials = [
    { label: "Live app", href: LIVE, node: <PiggyMark className="w-5 h-5" /> },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/fernando-halimm",
      node: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5a2 2 0 11-.02 4 2 2 0 01.02-4zM3 8.5h4V21H3V8.5zM9 8.5h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V8.5z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: REPO,
      node: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0112 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: "mailto:fernandohalim26@gmail.com",
      node: <ReceiptIcon className="w-5 h-5" />,
    },
  ];
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
        className="relative bg-[#4646b8] text-white rounded-[2.5rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-[#1e1b2e]/15"
      >
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-[#5b5bd6]/50 rounded-full blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#f5a623]/25 rounded-full blur-3xl"
          aria-hidden
        />
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-10 right-12 z-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/95 p-2 shadow-2xl shadow-[#1e1b2e]/30 ring-1 ring-white/40">
            <Image
              src="/piggy-icon.png"
              alt="piggy wallet"
              width={64}
              height={64}
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
        </motion.div>

        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] font-bold text-[#cdcbf2] uppercase tracking-[0.3em] mb-4 block">
            06. start tracking
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.05]">
            log it now, even{" "}
            <span className="italic font-medium text-[#ffd98a]">offline</span>.
          </h2>
          <p className="text-base md:text-lg font-medium text-[#dedcf6] leading-relaxed mb-10 max-w-xl">
            piggy wallet is live, free, and installable. every spend is one
            thumb press — and it&apos;s saved before the network even notices.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={LIVE}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 bg-white text-[#4646b8] rounded-full font-extrabold tracking-widest uppercase text-sm shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
            >
              launch piggy ↗
            </a>
            <a
              href={`${LIVE}/changelog`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 bg-[#1e1b2e]/30 backdrop-blur-sm border-2 border-white/20 text-white rounded-full font-extrabold tracking-widest uppercase text-sm hover:bg-[#1e1b2e]/50 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
            >
              read the changelog
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 bg-[#1e1b2e]/40 backdrop-blur-sm border-2 border-white/10 text-white rounded-full font-extrabold tracking-widest uppercase text-sm hover:bg-[#1e1b2e]/60 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
            >
              source on github
            </a>
          </div>

          <div className="mt-10 flex gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                whileHover={{ y: -4 }}
                className="w-12 h-12 rounded-2xl bg-white/95 text-[#4646b8] shadow-lg flex items-center justify-center hover:text-[#5b5bd6] transition-colors"
              >
                {s.node}
              </motion.a>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-bold text-[#cdcbf2] uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9b97e8] animate-pulse" />
              shipped v1.5
            </span>
            <span>fernando halim · 2026</span>
            <span className="opacity-60">offline-first, on purpose</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

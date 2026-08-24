"use client";

import { motion, Variants, useScroll, useSpring } from "framer-motion";
import { SVGProps, useEffect, useId, useRef, useState } from "react";
import {
  CaseStudyBack,
  CaseStudyNext,
  type CaseTheme,
} from "@/components/CaseStudyChrome";

// shell chrome only — the interior palette below is untouched
const CASE_THEME: CaseTheme = { fg: "#f2f3f5", muted: "#9a9ca5", border: "rgba(255,255,255,0.12)", surface: "rgba(255,255,255,0.05)", accent: "#c8b6ff" };

// ─────────────────────────────────────────────────────────────────────────────
// lūme — case study. brand-matched to the real Tauri app:
// deep-night glass (#0b0b0f), Bricolage Grotesque + Geist Mono, the crescent mark,
// and the signature "the album art is the light source" — pick a cover and the
// WHOLE page cross-fades (380ms) to that art's sampled accent, exactly like lūme.
// palette: #0b0b0f bg · #f2f3f5 / #9a9ca5 / #62646d text · lilac fallback #c8b6ff
// ─────────────────────────────────────────────────────────────────────────────

const REPO = "https://github.com/fernandohalim/lume-app";
const RELEASES = "https://github.com/fernandohalim/lume-app/releases";

// ── icons, drawn on lūme's thin-stroke grid (transport uses glyphs in-app; here
//    we hand-draw so they stay crisp at any size) ─────────────────────────────
type IconProps = SVGProps<SVGSVGElement>;
const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const I = (p: IconProps) => <svg {...base} width="24" height="24" {...p} />;

const PlayIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" {...p}>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);
const PauseIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" {...p}>
    <rect x="6.5" y="5" width="3.6" height="14" rx="1.2" />
    <rect x="13.9" y="5" width="3.6" height="14" rx="1.2" />
  </svg>
);
const PrevIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" {...p}>
    <rect x="5" y="5.5" width="2.4" height="13" rx="1" />
    <path d="M20 5.8v12.4L10 12 20 5.8Z" />
  </svg>
);
const NextIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" {...p}>
    <rect x="16.6" y="5.5" width="2.4" height="13" rx="1" />
    <path d="M4 5.8v12.4L14 12 4 5.8Z" />
  </svg>
);
const ShuffleIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M3 6h3.5l9 12H21" />
    <path d="M3 18h3.5l3-4M14 8l1.5-2H21" />
    <path d="M18.5 3.5 21 6l-2.5 2.5M18.5 15.5 21 18l-2.5 2.5" />
  </I>
);
const RepeatIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M17 3l3 3-3 3" />
    <path d="M20 6H8a4 4 0 0 0-4 4v1" />
    <path d="M7 21l-3-3 3-3" />
    <path d="M4 18h12a4 4 0 0 0 4-4v-1" />
  </I>
);
const QueueIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 7h11M4 12h11M4 17h7" />
    <circle cx="18" cy="16" r="2.4" />
    <path d="M20.4 16V8l-2 .9" />
  </I>
);
const MicIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="9" y="2.5" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <path d="M12 17v4M9 21h6" />
  </I>
);
const KeyIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="8" cy="8" r="4.5" />
    <path d="M11.2 11.2 20 20M17 17l2-2M14.5 14.5l2-2" />
  </I>
);
const LockIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    <path d="M12 14.5v2.5" />
  </I>
);
const RefreshIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 9a8 8 0 0 1 13.7-3.3L20 8" />
    <path d="M20 4v4h-4" />
    <path d="M20 15a8 8 0 0 1-13.7 3.3L4 16" />
    <path d="M4 20v-4h4" />
  </I>
);
const RustIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
  </I>
);
const TrayIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M3.5 14h5l1.5 2.5h4L15.5 14h5" />
  </I>
);
const GlassIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M4 9h16" />
    <circle cx="7" cy="6.5" r="0.5" fill="currentColor" />
  </I>
);
const CornerIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <rect x="12.5" y="12.5" width="5.5" height="4" rx="1.3" />
  </I>
);

// the crescent mark — distilled from the app icon: a backlit sphere on night glass.
function LumeMark({ size = 40 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 1024 1024" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="44%" r="75%">
          <stop offset="0%" stopColor="#17131f" />
          <stop offset="60%" stopColor="#0e0e13" />
          <stop offset="100%" stopColor="#09090c" />
        </radialGradient>
        <radialGradient id={`${id}-bloom`} cx="54%" cy="53%" r="53%">
          <stop offset="0%" stopColor="#c8b6ff" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#9a78ff" stopOpacity="0.3" />
          <stop offset="72%" stopColor="#7a5cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-light`} x1="26%" y1="24%" x2="82%" y2="84%">
          <stop offset="0%" stopColor="#7b5cff" />
          <stop offset="50%" stopColor="#b9a6ff" />
          <stop offset="100%" stopColor="#f1ecff" />
        </linearGradient>
        <mask id={`${id}-crescent`}>
          <rect width="1024" height="1024" fill="black" />
          <circle cx="512" cy="516" r="224" fill="white" />
          <circle cx="460" cy="458" r="172" fill="black" />
        </mask>
        <clipPath id={`${id}-tile`}>
          <rect width="1024" height="1024" rx="228" ry="228" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-tile)`}>
        <rect width="1024" height="1024" fill={`url(#${id}-bg)`} />
        <rect width="1024" height="1024" fill={`url(#${id}-bloom)`} />
        <rect
          width="1024"
          height="1024"
          fill={`url(#${id}-light)`}
          mask={`url(#${id}-crescent)`}
        />
        <ellipse cx="512" cy="36" rx="400" ry="132" fill="#ffffff" opacity="0.045" />
      </g>
    </svg>
  );
}

// ── the tracks that drive the "light source" — each cover is a gradient standing
//    in for real art, with the dominant colour lūme would sample from it. ───────
type Track = {
  title: string;
  artist: string;
  accent: string; // the sampled dominant colour
  art: string; // cover gradient
  dur: string;
};
const TRACKS: Track[] = [
  {
    title: "Midnight City",
    artist: "M83",
    accent: "#c8b6ff",
    art: "linear-gradient(140deg,#2a2247 0%,#6d54c9 55%,#c8b6ff 100%)",
    dur: "4:03",
  },
  {
    title: "Nightcall",
    artist: "Kavinsky",
    accent: "#ff6f91",
    art: "linear-gradient(140deg,#2b1220 0%,#c23a5e 55%,#ff9db3 100%)",
    dur: "4:18",
  },
  {
    title: "Teardrop",
    artist: "Massive Attack",
    accent: "#4fd6c8",
    art: "linear-gradient(140deg,#0e2a2a 0%,#189b93 55%,#8ff0e6 100%)",
    dur: "5:30",
  },
  {
    title: "Sunset Lover",
    artist: "Petit Biscuit",
    accent: "#f5a35b",
    art: "linear-gradient(140deg,#331c10 0%,#d9772e 55%,#ffca8f 100%)",
    dur: "3:57",
  },
  {
    title: "Instant Crush",
    artist: "Daft Punk",
    accent: "#6f9bff",
    art: "linear-gradient(140deg,#131d3a 0%,#3a63d9 55%,#a7c0ff 100%)",
    dur: "5:16",
  },
];

// derive a soft/glow tint from any accent hex (for static, non-cross-fading tints)
const soft = (hex: string, a = 0.18) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// same tint, but off the animatable --lume-accent var so it cross-fades (380ms)
// on a track change — exactly like lūme's --accent-soft / --glow / --bloom.
const glow = (pct: number) =>
  `color-mix(in srgb, var(--lume-accent) ${pct}%, transparent)`;

export default function LumeCaseStudy() {
  const [track, setTrack] = useState<Track>(TRACKS[0]);
  const accent = track.accent;

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
    hidden: { opacity: 0, y: 44, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.8 },
    },
  };

  return (
    <main
      data-lume
      className="min-h-screen bg-[#0b0b0f] text-[#f2f3f5] pb-32 relative overflow-hidden [font-family:var(--font-bricolage),system-ui,sans-serif] selection:bg-[#c8b6ff]/25"
      style={{ "--lume-accent": accent } as React.CSSProperties}
    >
      {/* @property registration so --lume-accent (and everything derived from it)
          cross-fades over 380ms on a track change — lūme's signature move. */}
      <style>{`
        @property --lume-accent { syntax:'<color>'; inherits:true; initial-value:#c8b6ff; }
        [data-lume]{ transition: --lume-accent 380ms cubic-bezier(0.22,1,0.36,1); }
        [data-lume] *{ transition-property: color, background-color, border-color, box-shadow, stroke, fill; transition-duration: 380ms; transition-timing-function: cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      <ScrollProgress />

      {/* the page-wide bloom — a blurred wash of the current accent, the whole
          reason lūme exists distilled to a background. */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 70% at 78% -5%, ${glow(22)}, transparent 55%), radial-gradient(90% 60% at 0% 8%, ${glow(12)}, transparent 50%)`,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[18%] right-[-6%] w-[720px] h-[720px] rounded-full blur-[150px]"
          style={{ background: glow(28) }}
        />
        {/* faint film grain / vignette to sell the glass */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-20 relative z-10">
        <CaseStudyBack theme={CASE_THEME} />

        <Hero fadeUp={fadeUp} track={track} />
        <StatsRibbon />
        <LightSourceSection
          fadeUp={fadeUp}
          track={track}
          setTrack={setTrack}
        />
        <PlayerSection fadeUp={fadeUp} track={track} />
        <LyricsSection fadeUp={fadeUp} />
        <PillSection fadeUp={fadeUp} track={track} />
        <RustSection fadeUp={fadeUp} />
        <TechStackSection fadeUp={fadeUp} />
        <FinalCTA fadeUp={fadeUp} />
      </div>
      <CaseStudyNext
        theme={CASE_THEME}
        next={{ name: "nest.", href: "/projects/nest" }}
      />
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
      style={{ scaleX, background: "var(--lume-accent)" }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 shadow-[0_0_12px_var(--lume-accent)]"
    />
  );
}

// a glass card — the material the whole app is made of.
function Glass({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[18px] bg-white/[0.045] border border-white/[0.08] backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="[font-family:var(--font-geist-mono-lume),monospace] text-xs font-semibold text-[var(--lume-accent)] tabular-nums">
        {n}
      </span>
      <span className="h-px w-8 bg-white/15" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a9ca5]">
        {text}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────── HERO ───────
function Hero({ fadeUp, track }: { fadeUp: Variants; track: Track }) {
  return (
    <div className="mb-24 md:mb-40 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <motion.div
        className="lg:col-span-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[1rem] overflow-hidden shadow-[0_10px_40px_-8px_var(--lume-accent)]"
          >
            <LumeMark size={52} />
          </motion.div>
          <div className="leading-none">
            <span className="text-2xl font-bold tracking-tight lowercase">
              lūme
            </span>
            <p className="text-[11px] text-[#62646d] mt-1.5">
              a spotify miniplayer, reimagined
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-7">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{
              background: "var(--lume-accent)",
              boxShadow: "0 0 12px var(--lume-accent)",
            }}
          />
          <span
            className="[font-family:var(--font-geist-mono-lume),monospace] text-[11px] font-medium tracking-wide px-3 py-1 rounded-full border"
            style={{
              color: "var(--lume-accent)",
              background: glow(10),
              borderColor: glow(35),
            }}
          >
            Case Study · 2026
          </span>
          <span className="[font-family:var(--font-geist-mono-lume),monospace] text-[10px] text-[#62646d] hidden sm:inline">
            v1.0 · desktop · win + macOS
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-[5.4rem] font-extrabold tracking-[-0.03em] mb-6 leading-[0.94]"
        >
          the album art
          <br />
          is the{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(120deg, var(--lume-accent), #f1ecff)`,
            }}
          >
            light source.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl font-medium text-[#c9cbd3] max-w-xl leading-relaxed mb-4"
        >
          lūme is an always-on-top desktop miniplayer that remote-controls your
          running Spotify — a modern replacement for the dated native one. It
          samples a dominant colour from the current cover, and the whole player{" "}
          <strong className="text-[#f2f3f5]">glows the colour of whatever
          is playing.</strong>
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-sm md:text-base text-[#9a9ca5] italic max-w-lg leading-relaxed mb-8"
        >
          built on a tiny native Rust core — secrets never touch the webview,
          the glass never streams a byte of audio.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <a
            href={RELEASES}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full font-semibold text-sm text-[#0b0b0f] shadow-[0_10px_30px_-8px_var(--lume-accent)] hover:-translate-y-1 hover:brightness-110 active:scale-95 transition-all"
            style={{ background: "var(--lume-accent)" }}
          >
            download for desktop ↓
          </a>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full font-semibold text-sm text-[#c9cbd3] bg-white/[0.045] border border-white/10 hover:border-white/25 hover:text-white hover:-translate-y-1 active:scale-95 transition-all"
          >
            source on github ↗
          </a>
        </motion.div>
      </motion.div>

      {/* floating cluster — real lūme UI pieces, glowing the current accent */}
      <div className="lg:col-span-5 h-96 lg:h-[480px] relative hidden lg:block [perspective:1200px]">
        {/* the now-playing card */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 right-0 w-[300px] z-30"
        >
          <NowPlayingCard track={track} compact />
        </motion.div>

        {/* mini-pill with spinning vinyl */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-6 left-0 z-40"
        >
          <MiniPill track={track} />
        </motion.div>

        {/* a synced-lyric line, lit */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-[54%] right-6 z-50 rounded-2xl px-4 py-2.5 bg-[#121218]/90 backdrop-blur-md border border-white/10 shadow-2xl flex items-center gap-2.5"
        >
          <MicIcon
            className="h-4 w-4"
            style={{ color: "var(--lume-accent)" }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--lume-accent)" }}
          >
            waiting in the car…
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// the signature now-playing card, faithfully rebuilt: bloom + scrim + art + rail.
function NowPlayingCard({
  track,
  playing = true,
  pct = 38,
  compact = false,
}: {
  track: Track;
  playing?: boolean;
  pct?: number;
  compact?: boolean;
}) {
  return (
    <div className="relative rounded-[18px] overflow-hidden border border-white/[0.08] bg-[#0b0b0f] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
      {/* bloom: blurred cover bleeding behind the card */}
      <div
        className="absolute inset-[-40%] blur-[46px] opacity-[0.6] saturate-150"
        style={{ background: track.art }}
      />
      {/* scrim: transparent over art (left) → dark under text (right) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, transparent 26%, rgba(11,11,15,0.72) 66%, rgba(11,11,15,0.85) 100%)",
        }}
      />
      <div className="relative z-10 p-3.5 flex gap-3.5 items-center">
        <div
          className="w-[76px] h-[76px] shrink-0 rounded-[10px] shadow-[0_8px_24px_-8px_var(--lume-accent)] ring-1 ring-white/10"
          style={{ background: track.art }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[15px] tracking-[-0.01em] truncate">
            {track.title}
          </p>
          <p className="text-[12px] text-[#9a9ca5] truncate">{track.artist}</p>

          <div className="mt-2.5">
            <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: "var(--lume-accent)" }}
              />
            </div>
            <div className="flex justify-between mt-1.5 [font-family:var(--font-geist-mono-lume),monospace] text-[10px] text-[#9a9ca5] tabular-nums">
              <span>1:34</span>
              {!compact && (
                <span className="text-[#62646d] truncate px-2">
                  MacBook Pro
                </span>
              )}
              <span className="text-[#62646d]">{track.dur}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[#9a9ca5]">
            <button className="opacity-60 hover:opacity-100 transition-opacity">
              <PrevIcon className="h-[18px] w-[18px]" />
            </button>
            <span
              className="grid place-items-center h-8 w-8 rounded-full text-[#0b0b0f] shadow-[0_4px_16px_-4px_var(--lume-accent)]"
              style={{ background: "var(--lume-accent)" }}
            >
              {playing ? (
                <PauseIcon className="h-[15px] w-[15px]" />
              ) : (
                <PlayIcon className="h-[15px] w-[15px]" />
              )}
            </span>
            <button className="opacity-60 hover:opacity-100 transition-opacity">
              <NextIcon className="h-[18px] w-[18px]" />
            </button>
            <span className="ml-auto flex items-center gap-1.5">
              <ShuffleIcon
                className="h-[15px] w-[15px]"
                style={{ color: "var(--lume-accent)" }}
              />
              <RepeatIcon className="h-[15px] w-[15px] opacity-50" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniPill({ track }: { track: Track }) {
  return (
    <div className="relative flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-full bg-[#121218]/95 backdrop-blur-md border border-white/10 shadow-2xl w-[210px]">
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-40 -z-0"
        style={{ background: glow(50) }}
      />
      {/* spinning vinyl */}
      <div className="relative z-10 h-9 w-9 rounded-full overflow-hidden ring-1 ring-white/15">
        <motion.div
          className="h-full w-full"
          style={{ background: track.art }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-[#0b0b0f] ring-1 ring-white/20" />
      </div>
      <div className="relative z-10 flex-1 min-w-0 leading-tight">
        <p className="text-[12px] font-semibold truncate">{track.title}</p>
        <p className="text-[10px] text-[#9a9ca5] truncate">{track.artist}</p>
      </div>
      <span
        className="relative z-10 grid place-items-center h-6 w-6 rounded-full text-[#0b0b0f]"
        style={{ background: "var(--lume-accent)" }}
      >
        <PauseIcon className="h-3 w-3" />
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────── STATS RIBBON ───────
function StatsRibbon() {
  const stats = [
    { value: "2", label: "native platforms" },
    { value: "0", label: "tokens in the webview" },
    { value: "380ms", label: "accent cross-fade" },
    { value: "6", label: "phases shipped" },
  ];
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="mb-32 md:mb-48"
    >
      <Glass className="p-6 md:p-10 relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl"
          style={{ background: soft("#c8b6ff", 0.14) }}
          aria-hidden
        />
        <div className="relative z-10">
          <div className="[font-family:var(--font-geist-mono-lume),monospace] text-[10px] md:text-xs font-semibold text-[#9a9ca5] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--lume-accent)" }}
            />
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
                <span className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-none tabular-nums">
                  {s.value}
                </span>
                <span className="text-[10px] md:text-xs font-medium text-[#9a9ca5] uppercase tracking-widest mt-2">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Glass>
    </motion.section>
  );
}

// ──────────────────────────────────────────── 01 · THE LIGHT SOURCE ───────
function LightSourceSection({
  fadeUp,
  track,
  setTrack,
}: {
  fadeUp: Variants;
  track: Track;
  setTrack: (t: Track) => void;
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="01" text="The light source" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] mb-4">
          the player glows the colour of{" "}
          <span
            className="italic font-medium"
            style={{ color: "var(--lume-accent)" }}
          >
            what&apos;s playing
          </span>
          .
        </h2>
        <p className="text-base md:text-lg text-[#9a9ca5] leading-relaxed">
          A dominant colour is sampled from each cover down in the Rust core and
          drives everything tinted — the accent, the backdrop bloom, the
          progress fill, the active icons. Swap the track below and watch the
          whole page cross-fade to the new light in{" "}
          <span className="[font-family:var(--font-geist-mono-lume),monospace] text-sm text-[#f2f3f5]">
            380ms
          </span>
          . That is the real mechanic, not a mock.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* the covers you can pick */}
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <Glass className="p-5 md:p-6">
            <span className="[font-family:var(--font-geist-mono-lume),monospace] text-[10px] uppercase tracking-[0.24em] text-[#9a9ca5] mb-4 block">
              pick a cover → sample the light
            </span>
            <div className="grid grid-cols-5 gap-3">
              {TRACKS.map((t) => {
                const active = t.title === track.title;
                return (
                  <button
                    key={t.title}
                    onClick={() => setTrack(t)}
                    className="group relative aspect-square rounded-xl overflow-hidden transition-transform hover:-translate-y-1 active:scale-95"
                    style={{
                      boxShadow: active
                        ? `0 0 0 2px #0b0b0f, 0 0 0 4px ${t.accent}, 0 10px 30px -6px ${soft(t.accent, 0.6)}`
                        : "0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                    aria-label={`${t.title} by ${t.artist}`}
                  >
                    <span
                      className="absolute inset-0"
                      style={{ background: t.art }}
                    />
                    {active && (
                      <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-white shadow" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-9 w-9 rounded-lg ring-1 ring-white/10"
                  style={{ background: "var(--lume-accent)" }}
                />
                <div className="[font-family:var(--font-geist-mono-lume),monospace] leading-tight">
                  <p className="text-[10px] text-[#62646d] uppercase tracking-widest">
                    sampled --accent
                  </p>
                  <p
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: "var(--lume-accent)" }}
                  >
                    {track.accent}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#62646d] leading-relaxed max-w-[15rem]">
                A muted/monochrome cover gets its luminance lifted toward the
                lilac fallback so it still glows — never gamer-RGB.
              </p>
            </div>
          </Glass>
        </motion.div>

        {/* the card it lights up */}
        <motion.div variants={fadeUp} className="lg:col-span-5">
          <NowPlayingCard track={track} />
          <p className="text-center text-[11px] text-[#62646d] mt-4 [font-family:var(--font-geist-mono-lume),monospace]">
            @property --lume-accent · cross-faded, not swapped
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────── 02 · THE PLAYER ───────
function PlayerSection({ fadeUp, track }: { fadeUp: Variants; track: Track }) {
  const [playing, setPlaying] = useState(true);
  const [pct, setPct] = useState(38);
  const [shuffle, setShuffle] = useState(true);
  const [repeat, setRepeat] = useState<"off" | "context" | "track">("context");

  const feats = [
    "click-or-drag seek",
    "optimistic transport",
    "fast reconcile burst",
    "shuffle · repeat cycle",
    "marquee on overflow",
    "smooth progress interpolation",
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
        <SectionLabel n="02" text="The transport" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] mb-4">
          every command{" "}
          <span
            className="italic font-medium"
            style={{ color: "var(--lume-accent)" }}
          >
            feels instant
          </span>
          .
        </h2>
        <p className="text-base md:text-lg text-[#9a9ca5] leading-relaxed">
          lūme never streams audio — it sends transport commands to your running
          Spotify over the Web API. Each press updates the UI optimistically,
          then a short fast-poll burst reconciles with the real state, so a
          remote command lands before the network catches up.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* an actually-interactive transport */}
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <div className="relative rounded-[18px] overflow-hidden border border-white/[0.08] bg-[#0b0b0f] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
            <div
              className="absolute inset-[-40%] blur-[52px] opacity-[0.55] saturate-150"
              style={{ background: track.art }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, transparent 22%, rgba(11,11,15,0.7) 62%, rgba(11,11,15,0.86) 100%)",
              }}
            />
            <div className="relative z-10 p-5 flex gap-4 items-center">
              <div
                className="w-[96px] h-[96px] shrink-0 rounded-[10px] ring-1 ring-white/10 shadow-[0_8px_24px_-8px_var(--lume-accent)]"
                style={{ background: track.art }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[17px] tracking-[-0.01em] truncate">
                  {track.title}
                </p>
                <p className="text-[12px] text-[#9a9ca5] truncate">
                  {track.artist}
                </p>

                {/* draggable rail */}
                <div className="mt-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pct}
                    onChange={(e) => setPct(+e.target.value)}
                    className="lume-range w-full"
                    style={{ "--fill": `${pct}%` } as React.CSSProperties}
                    aria-label="Seek"
                  />
                  <div className="flex justify-between mt-1.5 [font-family:var(--font-geist-mono-lume),monospace] text-[10px] text-[#9a9ca5] tabular-nums">
                    <span>
                      {Math.floor((pct / 100) * 4)}:
                      {String(Math.floor(((pct / 100) * 243) % 60)).padStart(
                        2,
                        "0",
                      )}
                    </span>
                    <span className="text-[#62646d] truncate px-2">
                      MacBook Pro
                    </span>
                    <span className="text-[#62646d]">{track.dur}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[#c9cbd3]">
                  <button
                    onClick={() => setPct(0)}
                    className="opacity-70 hover:opacity-100 hover:bg-white/5 rounded-lg p-1 transition"
                    aria-label="Previous"
                  >
                    <PrevIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPlaying((p) => !p)}
                    className="grid place-items-center h-9 w-9 rounded-full text-[#0b0b0f] shadow-[0_4px_16px_-4px_var(--lume-accent)] active:scale-90 transition"
                    style={{ background: "var(--lume-accent)" }}
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? (
                      <PauseIcon className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setPct(100)}
                    className="opacity-70 hover:opacity-100 hover:bg-white/5 rounded-lg p-1 transition"
                    aria-label="Next"
                  >
                    <NextIcon className="h-5 w-5" />
                  </button>
                  <span className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => setShuffle((s) => !s)}
                      className="rounded-lg p-1.5 hover:bg-white/5 transition"
                      style={{
                        color: shuffle ? "var(--lume-accent)" : "#62646d",
                      }}
                      aria-label="Shuffle"
                    >
                      <ShuffleIcon className="h-[17px] w-[17px]" />
                    </button>
                    <button
                      onClick={() =>
                        setRepeat((r) =>
                          r === "off"
                            ? "context"
                            : r === "context"
                              ? "track"
                              : "off",
                        )
                      }
                      className="relative rounded-lg p-1.5 hover:bg-white/5 transition"
                      style={{
                        color: repeat !== "off" ? "var(--lume-accent)" : "#62646d",
                      }}
                      aria-label="Repeat"
                    >
                      <RepeatIcon className="h-[17px] w-[17px]" />
                      {repeat === "track" && (
                        <span
                          className="absolute -top-0.5 -right-0.5 text-[8px] font-bold"
                          style={{ color: "var(--lume-accent)" }}
                        >
                          1
                        </span>
                      )}
                    </button>
                    <button
                      className="rounded-lg p-1.5 hover:bg-white/5 text-[#62646d] transition"
                      aria-label="Queue"
                    >
                      <QueueIcon className="h-[17px] w-[17px]" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-[#62646d] mt-4 [font-family:var(--font-geist-mono-lume),monospace]">
            drag the rail · toggle shuffle &amp; repeat — this one&apos;s live
          </p>
        </motion.div>

        {/* the feature list */}
        <motion.div variants={fadeUp} className="lg:col-span-5">
          <Glass className="p-6 h-full">
            <span className="[font-family:var(--font-geist-mono-lume),monospace] text-[10px] uppercase tracking-[0.24em] text-[#9a9ca5] mb-4 block">
              what the bar can do
            </span>
            <ul className="space-y-2.5">
              {feats.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-[#c9cbd3]"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: "var(--lume-accent)" }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-white/[0.08] text-[13px] text-[#9a9ca5] leading-relaxed">
              At rest the controls recede to{" "}
              <span className="[font-family:var(--font-geist-mono-lume),monospace] text-xs text-[#f2f3f5]">
                0.55
              </span>{" "}
              opacity so the art stays the hero — they lift back in on hover.
            </div>
          </Glass>
        </motion.div>
      </div>

      <style>{`
        .lume-range { -webkit-appearance:none; appearance:none; height:4px; border-radius:99px;
          background: linear-gradient(90deg, var(--lume-accent) var(--fill), rgba(255,255,255,0.10) var(--fill)); cursor:pointer; }
        .lume-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:13px; height:13px; border-radius:50%;
          background: var(--lume-accent); box-shadow:0 0 10px -1px var(--lume-accent); }
        .lume-range::-moz-range-thumb { width:13px; height:13px; border:none; border-radius:50%; background: var(--lume-accent); }
      `}</style>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────── 03 · LYRICS ───────
const LYRIC_LINES = [
  "sitting in the dark",
  "waiting in the car",
  "the city's still asleep",
  "and the radio hums low",
  "you said you'd never leave",
  "but the night has other plans",
  "so i drive until the morning",
  "with the colour of the sound",
];

function LyricsSection({ fadeUp }: { fadeUp: Variants }) {
  const [active, setActive] = useState(2);
  const [running, setRunning] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % LYRIC_LINES.length);
    }, 1900);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running]);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mb-32 md:mb-48"
    >
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="03" text="Synced lyrics" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] mb-4">
          karaoke highlight, pulled from{" "}
          <span
            className="italic font-medium"
            style={{ color: "var(--lume-accent)" }}
          >
            LRCLIB
          </span>
          .
        </h2>
        <p className="text-base md:text-lg text-[#9a9ca5] leading-relaxed">
          The active line lights up and auto-scrolls to centre off the same
          interpolated progress that drives the bar. Tap any line to seek to its
          moment. Instrumental and not-found states stay tidy — no spinner
          stuck on screen.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <div className="relative rounded-[18px] overflow-hidden border border-white/[0.08] bg-[#0b0b0f] h-[320px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(80% 60% at 50% 40%, ${soft("#c8b6ff", 0.14)}, transparent 70%)`,
              }}
            />
            <div className="relative z-10 h-full flex flex-col justify-center gap-1 px-8">
              {LYRIC_LINES.map((line, i) => {
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setActive(i);
                      setRunning(false);
                    }}
                    className="text-left py-1.5 text-xl md:text-2xl font-bold tracking-[-0.01em] transition-all duration-500"
                    style={{
                      color: isActive
                        ? "var(--lume-accent)"
                        : isPast
                          ? "#3a3b42"
                          : "#62646d",
                      opacity: isActive ? 1 : isPast ? 0.7 : 0.85,
                      transform: isActive ? "scale(1.04)" : "scale(1)",
                      transformOrigin: "left",
                      filter: isActive
                        ? `drop-shadow(0 0 18px ${soft("#c8b6ff", 0.4)})`
                        : "none",
                    }}
                  >
                    {line}
                  </button>
                );
              })}
            </div>
            {/* top/bottom fade masks */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#0b0b0f] to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0b0b0f] to-transparent z-20 pointer-events-none" />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-5 space-y-3">
          {[
            {
              Icon: MicIcon,
              t: "synced .lrc",
              d: "line-timed lyrics, highlighted from live progress",
            },
            {
              Icon: RefreshIcon,
              t: "auto-refresh",
              d: "a skip or a natural track change reloads without reopening",
            },
            {
              Icon: GlassIcon,
              t: "graceful fallbacks",
              d: "plain-text · instrumental · not-found, each with its own calm state",
            },
          ].map((r) => (
            <Glass key={r.t} className="p-5 flex items-start gap-4">
              <span
                className="grid place-items-center h-10 w-10 shrink-0 rounded-xl"
                style={{
                  background: soft("#c8b6ff", 0.12),
                  color: "var(--lume-accent)",
                }}
              >
                <r.Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-[15px]">{r.t}</p>
                <p className="text-[13px] text-[#9a9ca5] leading-snug mt-0.5">
                  {r.d}
                </p>
              </div>
            </Glass>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────── 04 · MINI-PILL + TRAY ───────
function PillSection({ fadeUp, track }: { fadeUp: Variants; track: Track }) {
  const feats = [
    {
      Icon: CornerIcon,
      t: "snaps to the nearest corner",
      d: "drag it anywhere; on release it flies to whichever screen corner it's closest to",
    },
    {
      Icon: TrayIcon,
      t: "lives in the tray",
      d: "close hides to the system tray — the Rust core keeps running and polling",
    },
    {
      Icon: GlassIcon,
      t: "frameless glass",
      d: "no OS chrome; our own minimize / minify / close cluster, hover-revealed",
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
        <SectionLabel n="04" text="Mini-pill & tray" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] mb-4">
          shrink it to a{" "}
          <span
            className="italic font-medium"
            style={{ color: "var(--lume-accent)" }}
          >
            spinning pill
          </span>
          .
        </h2>
        <p className="text-base md:text-lg text-[#9a9ca5] leading-relaxed">
          One tap collapses the whole window into a small draggable pill — the
          cover becomes a vinyl record that turns while it plays. Click to
          expand back to the full player; the app remembers exactly where it
          was.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <motion.div
          variants={fadeUp}
          className="lg:col-span-5 grid place-items-center py-8"
        >
          <div className="scale-[1.4]">
            <MiniPill track={track} />
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="lg:col-span-7 space-y-3">
          {feats.map((r) => (
            <Glass key={r.t} className="p-5 flex items-start gap-4">
              <span
                className="grid place-items-center h-10 w-10 shrink-0 rounded-xl"
                style={{
                  background: soft("#c8b6ff", 0.12),
                  color: "var(--lume-accent)",
                }}
              >
                <r.Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-[15px]">{r.t}</p>
                <p className="text-[13px] text-[#9a9ca5] leading-snug mt-0.5">
                  {r.d}
                </p>
              </div>
            </Glass>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ──────────────────────────────────────────── 05 · SECRETS IN RUST ───────
function RustSection({ fadeUp }: { fadeUp: Variants }) {
  const steps = [
    {
      Icon: KeyIcon,
      label: "PKCE, no secret",
      hint: "Authorization Code + PKCE — no client secret ever ships in the binary",
    },
    {
      Icon: RustIcon,
      label: "handled in Rust",
      hint: "OAuth + refresh live in the Tauri core, exposed as #[tauri::command]s",
    },
    {
      Icon: LockIcon,
      label: "stored in the keychain",
      hint: "tokens sit in the OS keychain via the keyring crate — never in the webview",
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
        <SectionLabel n="05" text="Under the hood" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] mb-4">
          the secrets{" "}
          <span
            className="italic font-medium"
            style={{ color: "var(--lume-accent)" }}
          >
            stay in Rust
          </span>
          .
        </h2>
        <p className="text-base md:text-lg text-[#9a9ca5] leading-relaxed">
          Tauri pairs a tiny native Rust core with a lightweight SvelteKit
          webview. Every token exchange happens in the core; the frontend only
          ever calls commands and reacts to their results. A byte of audio never
          moves — lūme just tells the official client what to do over{" "}
          <span className="[font-family:var(--font-geist-mono-lume),monospace] text-sm text-[#f2f3f5] bg-white/[0.06] px-1.5 py-0.5 rounded">
            Spotify Connect
          </span>
          .
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-6"
      >
        {steps.map((s, i) => (
          <Glass key={s.label} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="grid place-items-center h-11 w-11 rounded-xl"
                style={{
                  background: soft("#c8b6ff", 0.12),
                  color: "var(--lume-accent)",
                }}
              >
                <s.Icon className="h-6 w-6" />
              </span>
              <div>
                <span className="[font-family:var(--font-geist-mono-lume),monospace] text-[9px] font-semibold text-[#62646d] tabular-nums block">
                  0{i + 1}
                </span>
                <span className="text-sm font-bold">{s.label}</span>
              </div>
            </div>
            <p className="text-[12px] text-[#9a9ca5] leading-relaxed">
              {s.hint}
            </p>
          </Glass>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-[18px] p-6 md:p-8 flex items-start gap-4 border border-white/[0.08]"
        style={{ background: soft("#c8b6ff", 0.07) }}
      >
        <span
          className="grid place-items-center h-11 w-11 shrink-0 rounded-xl"
          style={{
            background: soft("#c8b6ff", 0.14),
            color: "var(--lume-accent)",
          }}
        >
          <RefreshIcon className="h-6 w-6" />
        </span>
        <p className="text-sm text-[#c9cbd3] leading-relaxed">
          A silent refresh keeps the session alive across restarts — the token
          survives a full quit, so you connect once and never see the login gate
          again. Everyone brings their own Spotify Client ID from{" "}
          <span className="[font-family:var(--font-geist-mono-lume),monospace] text-xs" style={{ color: "var(--lume-accent)" }}>
            lume.env
          </span>
          , so no credential is ever baked into the download.
        </p>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────── TECH STACK ───────
const TECH = [
  { name: "Tauri 2", role: "rust core + webview · tiny native binary" },
  { name: "SvelteKit", role: "SPA mode · the glass frontend" },
  { name: "TypeScript", role: "strict across the webview" },
  { name: "Rust", role: "reqwest · keyring · hand-rolled PKCE" },
  { name: "Spotify Web API", role: "playback state + transport" },
  { name: "LRCLIB", role: "free synced .lrc lyrics, no auth" },
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
        <SectionLabel n="06" text="The stack" />
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em]">
          small, native, and picked{" "}
          <span
            className="italic font-medium"
            style={{ color: "var(--lume-accent)" }}
          >
            on purpose
          </span>
          .
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TECH.map((t) => (
          <motion.div key={t.name} variants={fadeUp} whileHover={{ x: 4 }}>
            <Glass className="p-5 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--lume-accent)" }}
                />
                <span className="font-bold">{t.name}</span>
              </div>
              <p className="text-xs text-[#9a9ca5] leading-snug pl-5">
                {t.role}
              </p>
            </Glass>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────── FINAL CTA ───────
function FinalCTA({ fadeUp }: { fadeUp: Variants }) {
  const socials = [
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
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/fernando-halimm",
      node: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5a2 2 0 11-.02 4 2 2 0 01.02-4zM3 8.5h4V21H3V8.5zM9 8.5h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V8.5z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: "mailto:fernandohalim26@gmail.com",
      node: <MicIcon className="w-5 h-5" />,
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
        className="relative rounded-[24px] p-10 md:p-16 overflow-hidden border border-white/[0.08] bg-[#101015]"
      >
        <div
          className="absolute -top-32 -right-24 w-[440px] h-[440px] rounded-full blur-3xl"
          style={{ background: soft("#c8b6ff", 0.22) }}
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-24 w-[380px] h-[380px] rounded-full blur-3xl"
          style={{ background: soft("#7b5cff", 0.16) }}
          aria-hidden
        />
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-10 right-12 z-10"
        >
          <div className="rounded-[1.25rem] overflow-hidden shadow-[0_20px_50px_-12px_var(--lume-accent)] ring-1 ring-white/10">
            <LumeMark size={72} />
          </div>
        </motion.div>

        <div className="relative z-10 max-w-3xl">
          <span className="[font-family:var(--font-geist-mono-lume),monospace] text-[10px] font-semibold text-[#9a9ca5] uppercase tracking-[0.3em] mb-4 block">
            07. bring it home
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] mb-6 leading-[1.02]">
            let your desktop{" "}
            <span
              className="italic font-medium"
              style={{ color: "var(--lume-accent)" }}
            >
              glow
            </span>
            .
          </h2>
          <p className="text-base md:text-lg text-[#9a9ca5] leading-relaxed mb-10 max-w-xl">
            lūme is a free, unsigned personal-use build for Windows and macOS.
            Bring your own Spotify Client ID and a Premium account, and the
            player lights up in the colour of every track.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={RELEASES}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-full font-bold text-sm text-[#0b0b0f] shadow-[0_10px_30px_-8px_var(--lume-accent)] hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
              style={{ background: "var(--lume-accent)" }}
            >
              download latest ↓
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-full font-bold text-sm text-white bg-white/[0.06] border border-white/15 hover:bg-white/10 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
            >
              read the source ↗
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
                className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 text-[#c9cbd3] flex items-center justify-center hover:text-[var(--lume-accent)] hover:border-white/25 transition-colors"
              >
                {s.node}
              </motion.a>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap items-center gap-x-8 gap-y-3 [font-family:var(--font-geist-mono-lume),monospace] text-[11px] font-medium text-[#9a9ca5] uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--lume-accent)" }}
              />
              shipped v1.0
            </span>
            <span>fernando halim · 2026</span>
            <span className="opacity-60">the art is the light source</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  Variants,
} from "framer-motion";
import Link from "next/link";
import { SVGProps, useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Tempo — case study. brand-matched to the real Electron widget: the "Warm
// Analog" tokens straight out of src/index.css, Nunito's rounded terminals, the
// paper-grain surface, and the depleting progress ring as the one recurring
// motif. nothing here is pure black or pure white.
//
// palette: #f7f1e8 cream · #ece0d0 cream-deep · #e2d5c3 line
//          #c8795a clay · #a85e42 clay-deep · #e6c2b0 clay-soft
//          #8fa68e sage · #4a3f38 ink · #8a7969 ink-soft
//
// the demos are not mock-ups — the timer, stopwatch, alarm scheduling and chime
// synthesis below are the app's own `src/core/` functions and `scripts/` recipes
// ported over unchanged. that portability is the whole point of the layer.
// ─────────────────────────────────────────────────────────────────────────────

const REPO = "https://github.com/fernandohalim/tempo-app";
const RELEASES = "https://github.com/fernandohalim/tempo-app/releases";

const EASE_CALM = [0.32, 0.72, 0.28, 1] as const;

// ── icons — copied 1:1 from src/components/icons.tsx ─────────────────────────
type IconProps = SVGProps<SVGSVGElement>;
const stroked: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const I = (p: IconProps) => <svg {...stroked} width="18" height="18" {...p} />;

const PlayIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
    <path
      d="M8 7L16.8 12L8 17Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);
const PauseIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
    <rect x="6.5" y="4.5" width="4" height="15" rx="1.6" />
    <rect x="13.5" y="4.5" width="4" height="15" rx="1.6" />
  </svg>
);
const ResetIcon = (p: IconProps) => (
  <I strokeWidth={2.1} {...p}>
    <path d="M3.5 5.5v5h5" />
    <path d="M4.2 10.5a8 8 0 1 1 .6 5.4" />
  </I>
);
const GearIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
  </I>
);
const PlusIcon = (p: IconProps) => (
  <I strokeWidth={2.4} {...p}>
    <path d="M12 5v14M5 12h14" />
  </I>
);
const BellIcon = (p: IconProps) => (
  <I strokeWidth={1.9} {...p}>
    <path d="M12 3.2a6 6 0 0 0-6 6c0 4.2-1.4 5.6-2 6.3h16c-.6-.7-2-2.1-2-6.3a6 6 0 0 0-6-6z" />
    <path d="M10.2 19a2 2 0 0 0 3.6 0" />
  </I>
);
const FlagIcon = (p: IconProps) => (
  <I strokeWidth={2.1} {...p}>
    <path d="M6 21V4" />
    <path d="M6 4.6h10.5l-2.2 4.2 2.2 4.2H6" />
  </I>
);
const MinifyIcon = (p: IconProps) => (
  <I strokeWidth={2.2} {...p}>
    <path d="M10 3.5v6.5H3.5" />
    <path d="M14 20.5V14h6.5" />
  </I>
);
const ExpandIcon = (p: IconProps) => (
  <I strokeWidth={2.2} {...p}>
    <path d="M14 3.5h6.5V10" />
    <path d="M10 20.5H3.5V14" />
  </I>
);
const CheckIcon = (p: IconProps) => (
  <I strokeWidth={2.4} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </I>
);
const CloseIcon = (p: IconProps) => (
  <I strokeWidth={1.7} {...p}>
    <path d="M4 4l16 16M20 4L4 20" />
  </I>
);
const MoonIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </I>
);
const TrayIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 14h5l1.5 2.5h5L16 14h5" />
  </I>
);
const WaveIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M3 12h2.5l2-6 3 13 3-9 2 4H21" />
  </I>
);
const GridIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
  </I>
);
const ShieldIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </I>
);

/**
 * Tempo's mark — a warm clay disc with cream hands at 12 and 3. Same geometry
 * as scripts/gen-icons.mjs (disc r 0.46, hands out to 0.32 and 0.76, round
 * caps), only drawn as vectors here instead of rasterised.
 */
function TempoMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="block"
      aria-hidden
    >
      <circle cx="50" cy="50" r="46" fill="#c8795a" />
      {/* the two capsules, at their own half-widths: 0.05 and 0.045 */}
      <path d="M50 50V32" stroke="#f7f1e8" strokeWidth="10" strokeLinecap="round" />
      <path d="M50 50h26" stroke="#f7f1e8" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// src/core/timer.ts — ported unchanged. the invariant that makes this survive
// system sleep: while running the only authority is `endsAt`, an absolute
// instant. `remainingSeconds` is a display cache, never a decremented counter.
// ─────────────────────────────────────────────────────────────────────────────
const SECOND_MS = 1000;
type TimerStatus = "idle" | "running" | "paused" | "completed";
type TimerState = {
  durationSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
  endsAt: number | null;
};

const createTimer = (durationSeconds: number): TimerState => {
  const safe = Math.max(0, Math.floor(durationSeconds));
  return {
    durationSeconds: safe,
    remainingSeconds: safe,
    status: "idle",
    endsAt: null,
  };
};

const timerRemainingMs = (s: TimerState, now: number) =>
  s.status === "running" && s.endsAt !== null
    ? Math.max(0, s.endsAt - now)
    : Math.max(0, s.remainingSeconds * SECOND_MS);

const timerProgress = (s: TimerState, now: number) => {
  const totalMs = s.durationSeconds * SECOND_MS;
  if (totalMs <= 0) return 0;
  return Math.min(1, Math.max(0, (totalMs - timerRemainingMs(s, now)) / totalMs));
};

const tickTimer = (s: TimerState, now: number): TimerState => {
  if (s.status !== "running" || s.endsAt === null) return s;
  const remainingMs = s.endsAt - now;
  if (remainingMs <= 0)
    return { ...s, status: "completed", remainingSeconds: 0, endsAt: null };
  const remainingSeconds = Math.ceil(remainingMs / SECOND_MS);
  // same object reference when nothing observable changed, so the 20 Hz tick
  // only re-renders on the ~1 Hz the seconds actually roll over.
  return remainingSeconds === s.remainingSeconds
    ? s
    : { ...s, remainingSeconds };
};

const formatCountdown = (ms: number) => {
  const total = Math.ceil(Math.max(0, ms) / SECOND_MS);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const formatStopwatch = (ms: number) => {
  const safe = Math.max(0, ms);
  const m = Math.floor(safe / 60000);
  const s = Math.floor((safe % 60000) / 1000);
  const h = Math.floor((safe % 1000) / 10);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(h).padStart(2, "0")}`;
};

// src/core/alarm.ts — describeRepeat and nextOccurrence, ported unchanged.
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function describeRepeat(days: number[]): string {
  if (days.length === 0) return "Once";
  if (days.length === 7) return "Every day";
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  if (sorted.length === 5 && sorted.every((d) => d >= 1 && d <= 5))
    return "Weekdays";
  if (sorted.length === 2 && sorted.includes(0) && sorted.includes(6))
    return "Weekends";
  return sorted.map((d) => DAY_LABELS[d] ?? "?").join(" ");
}

function nextOccurrence(
  time: string,
  days: number[],
  from: number,
): number | null {
  const [hh, mm] = time.split(":");
  const hours = Number(hh);
  const minutes = Number(mm);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  const base = new Date(from);
  // a local Date per candidate day lets the platform resolve month rollovers
  // and daylight-saving shifts for us.
  for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
    const candidate = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + dayOffset,
      hours,
      minutes,
      0,
      0,
    );
    const t = candidate.getTime();
    if (t <= from) continue;
    if (days.length > 0 && !days.includes(candidate.getDay())) continue;
    return t;
  }
  return null;
}

// ── a shared heartbeat, only running while something needs it ────────────────
// the first reading lands on the next animation frame rather than synchronously
// in the effect body, so mounting never cascades a second render.
function useTicker(active: boolean, intervalMs = 50) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!active) return;
    const read = () => setNow(Date.now());
    const frame = window.requestAnimationFrame(read);
    const id = window.setInterval(read, intervalMs);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(id);
    };
  }, [active, intervalMs]);
  return now;
}

/** Wall clock that stays null until mounted, so SSR and the client agree. */
function useWallClock(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const read = () => setNow(Date.now());
    const frame = window.requestAnimationFrame(read);
    const id = window.setInterval(read, intervalMs);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}

// ─────────────────────────────────────────────────────── SHARED SHELL ────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE_CALM },
  },
};

const section = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: false, amount: 0.15 },
  variants: { visible: { transition: { staggerChildren: 0.1 } } },
};

/** The material the whole widget is made of — warm paper, never flat. */
function Paper({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`tempo-grain relative overflow-hidden rounded-[26px] border border-[#e2d5c3] bg-gradient-to-b from-[#f7f1e8] to-[#ece0d0] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-extrabold text-[#c8795a] tabular-nums">
        {n}
      </span>
      <span className="h-px w-8 bg-[#e2d5c3]" />
      <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#8a7969]">
        {text}
      </span>
    </div>
  );
}

function Heading({
  children,
  accent,
  tail = ".",
}: {
  children: React.ReactNode;
  accent: string;
  tail?: string;
}) {
  return (
    <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-[#4a3f38] mb-4 leading-[1.08]">
      {children} <span className="text-[#c8795a]">{accent}</span>
      {tail}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base md:text-lg text-[#8a7969] leading-relaxed">
      {children}
    </p>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.88em] font-bold text-[#4a3f38] bg-[#e6c2b0]/40 px-1.5 py-0.5 rounded-md">
      {children}
    </span>
  );
}

// ────────────────────────────────────────────────────── PROGRESS RING ────────
function ProgressRing({
  progress,
  size = 164,
  strokeWidth = 10,
  breathing = false,
  tone = "clay",
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  breathing?: boolean;
  tone?: "clay" | "sage";
  children?: React.ReactNode;
}) {
  const clamped = Math.min(
    1,
    Math.max(0, Number.isFinite(progress) ? progress : 0),
  );
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  return (
    <motion.div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      animate={breathing ? { scale: [1, 1.018, 1] } : { scale: 1 }}
      transition={
        breathing
          ? { duration: 4.5, ease: "easeInOut", repeat: Infinity }
          : { duration: 0.32, ease: EASE_CALM }
      }
    >
      {/* rotated so progress starts at 12 o'clock and runs clockwise */}
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth}
          fill="#ece0d0"
          opacity={0.35}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="#e2d5c3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={tone === "sage" ? "#8fa68e" : "#c8795a"}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </motion.div>
  );
}

/** Three rings expanding outward, staggered. Plays once when a timer lands. */
function RingBurst({ size, repeat = false }: { size: number; repeat?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border-2 border-[#c8795a]"
          style={{ width: size, height: size }}
          initial={{ opacity: 0.55, scale: 0.82 }}
          animate={{ opacity: 0, scale: 1.45 }}
          transition={{
            duration: 1.6,
            delay: i * 0.22,
            ease: "easeOut",
            repeat: repeat ? Infinity : 0,
            repeatDelay: repeat ? 0.5 : 0,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────── PILL SWITCHER ───────
type Mode = "timer" | "alarm" | "stopwatch";
const MODES: { id: Mode; label: string }[] = [
  { id: "timer", label: "Timer" },
  { id: "alarm", label: "Alarm" },
  { id: "stopwatch", label: "Stopwatch" },
];

function PillSwitcher({
  value,
  onChange,
  layoutId,
}: {
  value: Mode;
  onChange: (m: Mode) => void;
  layoutId: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Mode"
      className="flex rounded-full border border-[#e2d5c3]/60 bg-[#ece0d0]/60 p-[3px]"
    >
      {MODES.map((mode) => {
        const selected = mode.id === value;
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(mode.id)}
            className="relative flex-1 rounded-full px-2 py-[7px] text-center"
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 34,
                  mass: 0.8,
                }}
                className="absolute inset-0 rounded-full bg-[#f7f1e8] shadow-[0_2px_6px_-1px_rgba(74,63,56,0.18)]"
              />
            )}
            <span
              className={`relative z-10 text-[12px] font-extrabold tracking-wide transition-colors duration-300 ${
                selected ? "text-[#a85e42]" : "text-[#8a7969] hover:text-[#4a3f38]"
              }`}
            >
              {mode.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────── THE CAPSULE ────────
const CAPSULE_W = 224;
const CAPSULE_H = 58;

function Capsule({
  label,
  remainingFraction,
  running,
  alert,
  onExpand,
  onToggle,
  dot = "clay",
}: {
  label: string;
  remainingFraction?: number;
  running?: boolean;
  alert?: boolean;
  onExpand?: () => void;
  onToggle?: () => void;
  dot?: "clay" | "sage" | "soft";
}) {
  const dotColor = alert
    ? "#f7f1e8"
    : dot === "sage"
      ? "#8fa68e"
      : dot === "soft"
        ? "#8a7969"
        : "#c8795a";

  return (
    <motion.div
      style={{ width: CAPSULE_W, height: CAPSULE_H }}
      animate={
        alert
          ? {
              scale: [1, 1.045, 1],
              boxShadow: [
                "0 8px 20px -6px rgba(168,94,66,0.5)",
                "0 10px 22px 0px rgba(200,121,90,0.8)",
                "0 8px 20px -6px rgba(168,94,66,0.5)",
              ],
            }
          : { scale: 1 }
      }
      transition={
        alert
          ? { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.32, ease: EASE_CALM }
      }
      className={`tempo-grain relative flex items-center overflow-hidden rounded-full border shadow-[0_8px_20px_-8px_rgba(74,63,56,0.55)] ${
        alert
          ? "border-[#a85e42] bg-[#c8795a] text-[#f7f1e8]"
          : "border-[#e2d5c3] bg-gradient-to-b from-[#f7f1e8] to-[#ece0d0]"
      }`}
    >
      {/* remaining time as a receding block of warmth behind the content */}
      {remainingFraction !== undefined && !alert && (
        <div
          className="absolute inset-y-0 left-0 bg-[#e6c2b0]/55"
          style={{ width: `${Math.max(0, Math.min(1, remainingFraction)) * 100}%` }}
        />
      )}

      <div className="relative z-10 flex w-full items-center gap-2.5 px-4">
        <motion.span
          className="h-[7px] w-[7px] shrink-0 rounded-full"
          style={{ background: dotColor }}
          animate={running || alert ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={
            running || alert
              ? { duration: alert ? 0.9 : 2.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.32 }
          }
        />

        {alert ? (
          <>
            <span className="text-[15px] font-extrabold tracking-wide">
              {label}
            </span>
            <span className="ml-auto grid h-[26px] w-[26px] place-items-center">
              <CheckIcon width={18} height={18} />
            </span>
          </>
        ) : (
          <>
            <span className="text-[24px] leading-none font-light tracking-tight text-[#4a3f38] tabular-nums">
              {label}
            </span>
            <div className="ml-auto flex items-center gap-0.5">
              {onToggle && (
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label={running ? "Pause" : "Resume"}
                  className="grid h-[26px] w-[26px] place-items-center rounded-full text-[#8a7969] transition-colors duration-200 hover:bg-[#f7f1e8]/80 hover:text-[#4a3f38]"
                >
                  {running ? (
                    <PauseIcon width={14} height={14} />
                  ) : (
                    <PlayIcon width={14} height={14} />
                  )}
                </button>
              )}
              {onExpand && (
                <button
                  type="button"
                  onClick={onExpand}
                  aria-label="Expand Tempo"
                  className="grid h-[26px] w-[26px] place-items-center rounded-full text-[#8a7969] transition-colors duration-200 hover:bg-[#f7f1e8]/80 hover:text-[#4a3f38]"
                >
                  <ExpandIcon width={13} height={13} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────── CHIME SYNTHESIS ──────
// scripts/gen-sounds.mjs, rebuilt on the Web Audio API. Same partial sets, same
// decay constants, same voices — additive synthesis over a set of decaying
// sines, which is exactly how a struck bell or bar behaves.
type Partial = { ratio: number; amp: number; decay: number };

const CHIME_PARTIALS: Partial[] = [
  { ratio: 1, amp: 1, decay: 1 },
  { ratio: 2, amp: 0.42, decay: 0.68 },
  { ratio: 2.99, amp: 0.24, decay: 0.48 },
  { ratio: 4.01, amp: 0.13, decay: 0.34 },
  { ratio: 5.42, amp: 0.07, decay: 0.24 },
  { ratio: 6.79, amp: 0.04, decay: 0.17 },
];
const BELL_PARTIALS: Partial[] = [
  { ratio: 0.5, amp: 0.55, decay: 1.25 },
  { ratio: 1, amp: 1, decay: 1 },
  { ratio: 1.19, amp: 0.32, decay: 0.85 },
  { ratio: 1.56, amp: 0.22, decay: 0.7 },
  { ratio: 2, amp: 0.36, decay: 0.6 },
  { ratio: 2.66, amp: 0.16, decay: 0.42 },
  { ratio: 3.01, amp: 0.11, decay: 0.34 },
  { ratio: 4.09, amp: 0.06, decay: 0.22 },
];
const GLASS_PARTIALS: Partial[] = [
  { ratio: 1, amp: 1, decay: 1 },
  { ratio: 2.76, amp: 0.3, decay: 0.6 },
  { ratio: 5.4, amp: 0.14, decay: 0.36 },
  { ratio: 8.93, amp: 0.06, decay: 0.2 },
];
const WOOD_PARTIALS: Partial[] = [
  { ratio: 1, amp: 1, decay: 1 },
  { ratio: 3.94, amp: 0.28, decay: 0.42 },
  { ratio: 10.4, amp: 0.09, decay: 0.16 },
];

type Voice = {
  freq: number;
  partials: Partial[];
  decay: number;
  gain?: number;
  start?: number;
};
type Chime = {
  id: string;
  name: string;
  description: string;
  duration: number;
  character: string;
  voices: Voice[];
};

const CHIMES: Chime[] = [
  {
    id: "soft-chime",
    name: "Soft chime",
    description: "A rising pair, warm and unhurried",
    character: "6 softly harmonic partials · a rising fourth, 260 ms apart",
    duration: 2.9,
    voices: [
      { freq: 880.0, partials: CHIME_PARTIALS, decay: 1.5 },
      {
        freq: 1174.7,
        partials: CHIME_PARTIALS,
        decay: 1.5,
        start: 0.26,
        gain: 0.85,
      },
    ],
  },
  {
    id: "low-bell",
    name: "Low bell",
    description: "Deep and slow to fade",
    character: "8 deliberately inharmonic partials — 0.5, 1.19, 1.56, 2.66…",
    duration: 4.2,
    voices: [{ freq: 392.0, partials: BELL_PARTIALS, decay: 2.6 }],
  },
  {
    id: "glass",
    name: "Glass",
    description: "Bright and light",
    character: "4 partials with the energy high up · G6 over a short decay",
    duration: 2.0,
    voices: [
      { freq: 1568.0, partials: GLASS_PARTIALS, decay: 0.75 },
      {
        freq: 2093.0,
        partials: GLASS_PARTIALS,
        decay: 0.6,
        start: 0.11,
        gain: 0.6,
      },
    ],
  },
  {
    id: "wood",
    name: "Wood",
    description: "Short, dry, barely there",
    character: "3 partials, 0.26 s decay — a struck wooden bar",
    duration: 1.1,
    voices: [{ freq: 523.25, partials: WOOD_PARTIALS, decay: 0.26 }],
  },
];

function playChime(id: string) {
  const Ctor =
    typeof window === "undefined"
      ? undefined
      : (window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext);
  if (!Ctor) return;

  const chime = CHIMES.find((c) => c.id === id);
  if (!chime) return;

  const ctx = new Ctor();
  const master = ctx.createGain();
  // headroom below full scale — these should feel gentle, never loud
  master.gain.value = 0.22;
  master.connect(ctx.destination);

  const t0 = ctx.currentTime + 0.02;
  for (const voice of chime.voices) {
    const start = t0 + (voice.start ?? 0);
    for (const partial of voice.partials) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = voice.freq * partial.ratio;

      const gain = ctx.createGain();
      const amp = partial.amp * (voice.gain ?? 1) * 0.5;
      const tau = voice.decay * partial.decay;
      // 6 ms attack, long enough to avoid a click, short enough to still read
      // as struck. then an exponential fall matching exp(-t / tau).
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(amp, start + 0.006);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + Math.min(chime.duration, Math.max(0.08, tau * 3.5)),
      );

      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(t0 + chime.duration);
    }
  }

  window.setTimeout(() => void ctx.close(), (chime.duration + 0.4) * 1000);
}

// ═════════════════════════════════════════════════════════════════ PAGE ══════
export default function TempoCaseStudy() {
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

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#4a3f38] pb-32 relative overflow-hidden [font-family:var(--font-nunito),ui-rounded,system-ui,sans-serif] selection:bg-[#e6c2b0]/60">
      <style>{`
        /* the same inline SVG turbulence the app uses — resolution-independent
           paper grain that costs no binary asset. */
        .tempo-grain::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.32;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)' opacity='0.4'/%3E%3C/svg%3E");
        }
      `}</style>

      <ScrollProgress />

      {/* a wash of warmth, so the page never reads as flat cream */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(110%_60%_at_82%_-8%,rgba(200,121,90,0.16),transparent_58%),radial-gradient(80%_50%_at_-5%_10%,rgba(143,166,142,0.14),transparent_55%)]" />
        <motion.div
          animate={{ scale: [1, 1.07, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[16%] right-[-8%] w-[680px] h-[680px] rounded-full blur-[150px] bg-[#e6c2b0]/50"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: EASE_CALM }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-extrabold text-[#8a7969] hover:text-[#4a3f38] mb-12 md:mb-16 transition-colors px-4 py-2 bg-[#f7f1e8] rounded-full border border-[#e2d5c3] hover:border-[#c8795a]/50 shadow-[0_2px_8px_-4px_rgba(74,63,56,0.3)]"
          >
            <span className="text-[#c8795a] group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            back to portfolio
          </Link>
        </motion.div>

        <Hero />
        <StatsRibbon />
        <WidgetSection />
        <CornerSection />
        <AbsoluteTimeSection />
        <AlarmSection />
        <GeneratedSection />
        <StackSection />
        <FinalCTA />
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
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 bg-[#c8795a]"
    />
  );
}

// ─────────────────────────────────────────────────────────────── HERO ────────
function Hero() {
  const now = useWallClock();
  const clock =
    now === null
      ? "--:--"
      : new Date(now).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <div className="mb-24 md:mb-40 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <motion.div className="lg:col-span-7" {...section}>
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3.5">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="shrink-0 rounded-full shadow-[0_12px_30px_-10px_rgba(200,121,90,0.8)]"
          >
            <TempoMark size={52} />
          </motion.div>
          {/* optically centred on the wordmark, not on the whole two-line block */}
          <div className="leading-none pt-0.5">
            <span className="block text-2xl font-extrabold tracking-[0.16em] uppercase text-[#a85e42]">
              Tempo
            </span>
            <p className="text-[11px] text-[#8a7969] mt-2 font-semibold">
              a calm desktop clock widget
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-7 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c8795a] animate-pulse shadow-[0_0_12px_rgba(200,121,90,0.9)]" />
          <span className="text-[11px] font-extrabold tracking-wide px-3 py-1 rounded-full border border-[#c8795a]/40 bg-[#e6c2b0]/35 text-[#a85e42]">
            Case Study · 2026
          </span>
          <span className="text-[10px] font-bold text-[#8a7969] hidden sm:inline">
            v1.0 · Windows 10/11 · Electron
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-[5.2rem] font-extrabold tracking-[-0.035em] mb-6 leading-[0.95]"
        >
          time,
          <br />
          <span className="text-[#c8795a]">quietly kept.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl font-semibold text-[#6b5c50] max-w-xl leading-relaxed mb-4"
        >
          Tempo is a small floating clock widget that sits{" "}
          <strong className="text-[#4a3f38]">alongside your work instead of
          demanding a window.</strong>{" "}
          Timer, alarm and stopwatch live in one frameless card that stays on
          top, drags anywhere, and remembers where you left it.
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-sm md:text-base text-[#8a7969] italic max-w-lg leading-relaxed mb-8"
        >
          the whole design brief was calm — warm neutrals over pure black and
          white, rounded shapes over sharp edges, gentle easing over snap, and a
          breathing ring as the one recurring motif.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <a
            href={RELEASES}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full font-extrabold text-sm text-[#f7f1e8] bg-[#c8795a] shadow-[0_10px_26px_-8px_rgba(200,121,90,0.9)] hover:-translate-y-1 hover:bg-[#a85e42] active:scale-95 transition-all duration-300"
          >
            download for windows ↓
          </a>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full font-extrabold text-sm text-[#4a3f38] bg-[#f7f1e8] border border-[#e2d5c3] hover:border-[#c8795a]/50 hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            source on github ↗
          </a>
        </motion.div>
      </motion.div>

      {/* floating cluster — real Tempo pieces at their real sizes */}
      <div className="lg:col-span-5 h-[420px] relative hidden lg:block">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-2 z-20"
        >
          <Paper className="w-[248px] shadow-[0_18px_44px_-18px_rgba(74,63,56,0.6)]">
            <div className="relative z-10 px-5 pt-4 pb-6 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-[11px] font-extrabold tracking-[0.16em] text-[#a85e42] uppercase">
                  Tempo
                </span>
                <span className="flex gap-1.5 text-[#8a7969]">
                  <GearIcon width={12} height={12} />
                  <MinifyIcon width={11} height={11} />
                  <CloseIcon width={11} height={11} />
                </span>
              </div>
              <ProgressRing progress={0.62} size={132} strokeWidth={9} breathing>
                <div className="flex flex-col items-center">
                  <span className="text-[30px] leading-none font-light text-[#4a3f38] tabular-nums">
                    15:24
                  </span>
                  <span className="mt-1.5 text-[9px] font-extrabold tracking-[0.12em] text-[#8a7969] uppercase">
                    Remaining
                  </span>
                </div>
              </ProgressRing>
            </div>
          </Paper>
        </motion.div>

        <motion.div
          animate={{ y: [0, 11, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-16 left-0 z-30 scale-90 origin-left"
        >
          <Capsule label={clock} dot="soft" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
          className="absolute bottom-1 right-8 z-40 flex items-center gap-2.5 rounded-full bg-[#c8795a] px-4 py-2.5 text-[#f7f1e8] shadow-[0_12px_28px_-10px_rgba(168,94,66,0.9)]"
        >
          <BellIcon width={16} height={16} />
          <span className="text-[13px] font-extrabold">07:00 · Stretch</span>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────── STATS RIBBON ────────
function StatsRibbon() {
  const stats = [
    { value: "3", label: "modes, one widget" },
    { value: "84", label: "tests over the pure core" },
    { value: "0", label: "network calls, ever" },
    { value: "3.4 MB", label: "packaged asar" },
  ];
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE_CALM }}
      className="mb-32 md:mb-48"
    >
      <Paper className="p-6 md:p-10 shadow-[0_10px_36px_-20px_rgba(74,63,56,0.5)]">
        <div className="relative z-10">
          <div className="text-[10px] md:text-xs font-extrabold text-[#8a7969] uppercase tracking-[0.28em] mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8795a] animate-pulse" />
            shipped &amp; running
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: EASE_CALM }}
                className="flex flex-col"
              >
                <span className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-none tabular-nums text-[#4a3f38]">
                  {s.value}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-[#8a7969] uppercase tracking-widest mt-2">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Paper>
    </motion.section>
  );
}

// ────────────────────────────────────────────── 01 · THE LIVE WIDGET ─────────
const TIMER_PRESETS = [5 * 60, 10 * 60, 25 * 60];

function WidgetSection() {
  const [mode, setMode] = useState<Mode>("timer");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const [autoMini, setAutoMini] = useState(true);
  const [soundId, setSoundId] = useState("soft-chime");

  // ── timer ──
  const [timer, setTimer] = useState<TimerState>(() => createTimer(5 * 60));
  const [sw, setSw] = useState<{
    elapsedMs: number;
    startedAt: number | null;
    laps: number[];
  }>({ elapsedMs: 0, startedAt: null, laps: [] });

  const swRunning = sw.startedAt !== null;
  const now = useTicker(timer.status === "running" || swRunning);

  // the app's own heartbeat: a 50 ms interval calling tick(now). tickTimer
  // returns the same reference when nothing observable changed, so this only
  // re-renders on the ~1 Hz the seconds actually roll over.
  useEffect(() => {
    if (timer.status !== "running") return;
    const id = window.setInterval(
      () => setTimer((s) => tickTimer(s, Date.now())),
      50,
    );
    return () => window.clearInterval(id);
  }, [timer.status]);

  // a finished timer chimes, exactly like the app
  const wasRunning = useRef(false);
  useEffect(() => {
    if (timer.status === "completed" && wasRunning.current) playChime(soundId);
    wasRunning.current = timer.status === "running";
  }, [timer.status, soundId]);

  const startTimer = () => {
    setTimer((s) =>
      s.status === "running"
        ? {
            ...s,
            status: "paused",
            remainingSeconds: Math.ceil(
              Math.max(0, (s.endsAt ?? 0) - Date.now()) / SECOND_MS,
            ),
            endsAt: null,
          }
        : s.status === "paused"
          ? {
              ...s,
              status: "running",
              endsAt: Date.now() + s.remainingSeconds * SECOND_MS,
            }
          : s.durationSeconds <= 0
            ? s
            : {
                ...s,
                status: "running",
                remainingSeconds: s.durationSeconds,
                endsAt: Date.now() + s.durationSeconds * SECOND_MS,
              },
    );
    // shrink to the corner as a countdown begins — the app's autoMiniOnStart
    if (autoMini && timer.status !== "running") setMini(true);
  };

  const swElapsed = swRunning
    ? sw.elapsedMs + Math.max(0, now - (sw.startedAt ?? now))
    : sw.elapsedMs;

  const toggleSw = () =>
    setSw((s) =>
      s.startedAt !== null
        ? {
            ...s,
            elapsedMs: s.elapsedMs + Math.max(0, Date.now() - s.startedAt),
            startedAt: null,
          }
        : { ...s, startedAt: Date.now() },
    );

  // before the first tick lands, recover the instant the timer started from
  // endsAt itself — keeping render pure, and the very first frame honest.
  const clock =
    now ||
    (timer.endsAt !== null
      ? timer.endsAt - timer.remainingSeconds * SECOND_MS
      : 0);
  const remainingMs = timerRemainingMs(timer, clock);
  const ringProgress = 1 - timerProgress(timer, clock);
  const nearlyDone = timer.status === "running" && remainingMs <= 10_000;

  return (
    <motion.section {...section} className="mb-32 md:mb-48">
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="01" text="The widget" />
        <Heading accent="one widget">three modes,</Heading>
        <Lead>
          A segmented pill switcher that genuinely cross-fades — both panels are
          mounted and stacked during the swap, never a hard cut. Each mode keeps
          running in the background, so switching away from a countdown does not
          pause it. This is the real widget at its real size:{" "}
          <Mono>340 × 460</Mono>, running the app&apos;s own core functions.
        </Lead>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* the widget, on a stage tall enough that minifying never jumps the page */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-6 flex flex-col items-center"
        >
          <div className="relative w-full h-[520px] grid place-items-center">
            <AnimatePresence mode="wait" initial={false}>
              {mini ? (
                <motion.div
                  key="mini"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.32, ease: EASE_CALM }}
                >
                  <Capsule
                    label={
                      timer.status === "completed"
                        ? "Time's up"
                        : formatCountdown(remainingMs)
                    }
                    alert={timer.status === "completed"}
                    running={timer.status === "running"}
                    remainingFraction={
                      timer.status === "running" || timer.status === "paused"
                        ? ringProgress
                        : undefined
                    }
                    onExpand={
                      timer.status === "completed"
                        ? undefined
                        : () => setMini(false)
                    }
                    onToggle={
                      timer.status === "running" || timer.status === "paused"
                        ? startTimer
                        : undefined
                    }
                  />
                  {timer.status === "completed" && (
                    <button
                      type="button"
                      onClick={() => {
                        setTimer(createTimer(timer.durationSeconds));
                        setMini(false);
                      }}
                      className="mt-6 mx-auto block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#8a7969] hover:text-[#4a3f38] transition-colors"
                    >
                      dismiss &amp; expand
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.32, ease: EASE_CALM }}
                >
                  <Paper className="w-[340px] h-[460px] flex flex-col shadow-[0_16px_44px_-18px_rgba(74,63,56,0.55)]">
                    <header className="relative z-10 flex items-center justify-between px-5 pt-4">
                      <span className="text-[13px] font-extrabold tracking-[0.16em] text-[#a85e42] uppercase">
                        Tempo
                      </span>
                      <div className="flex items-center gap-0.5 text-[#8a7969]">
                        <WidgetIconButton
                          label="Settings"
                          active={settingsOpen}
                          onClick={() => setSettingsOpen((v) => !v)}
                        >
                          <GearIcon width={13} height={13} />
                        </WidgetIconButton>
                        <WidgetIconButton
                          label="Minify to corner"
                          onClick={() => setMini(true)}
                        >
                          <MinifyIcon width={12} height={12} />
                        </WidgetIconButton>
                        <WidgetIconButton label="Hide to tray" onClick={() => {}}>
                          <CloseIcon width={11} height={11} />
                        </WidgetIconButton>
                      </div>
                    </header>

                    {!settingsOpen && (
                      <div className="relative z-10 px-5 pt-3">
                        <PillSwitcher
                          value={mode}
                          onChange={setMode}
                          layoutId="tempo-live-pill"
                        />
                      </div>
                    )}

                    <div className="relative z-10 flex-1">
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={settingsOpen ? "settings" : mode}
                          initial={{ opacity: 0, scale: 0.985 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.012 }}
                          transition={{ duration: 0.26, ease: EASE_CALM }}
                          className="absolute inset-0"
                        >
                          {settingsOpen ? (
                            <SettingsPanel
                              soundId={soundId}
                              setSoundId={setSoundId}
                              autoMini={autoMini}
                              setAutoMini={setAutoMini}
                            />
                          ) : mode === "timer" ? (
                            <TimerPanel
                              timer={timer}
                              setTimer={setTimer}
                              onToggle={startTimer}
                              remainingMs={remainingMs}
                              ringProgress={ringProgress}
                              breathing={timer.status === "idle" || nearlyDone}
                            />
                          ) : mode === "stopwatch" ? (
                            <StopwatchPanel
                              elapsed={swElapsed}
                              laps={sw.laps}
                              running={swRunning}
                              onToggle={toggleSw}
                              onLap={() =>
                                setSw((s) => ({
                                  ...s,
                                  laps: [...s.laps, swElapsed],
                                }))
                              }
                              onReset={() =>
                                setSw({ elapsedMs: 0, startedAt: null, laps: [] })
                              }
                            />
                          ) : (
                            <AlarmPanel />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-[11px] font-bold text-[#8a7969] mt-2">
            {mini
              ? "the countdown kept running — nothing paused when it shrank"
              : "switch modes · set a duration · press play"}
          </p>
        </motion.div>

        {/* what the card is doing */}
        <motion.div variants={fadeUp} className="lg:col-span-6 space-y-3">
          {[
            {
              Icon: GridIcon,
              t: "both panels mounted through the swap",
              d: "the outgoing and incoming modes are absolutely stacked and cross-fade through each other for 260 ms, rather than one waiting for the other to finish",
            },
            {
              Icon: PlayIcon,
              t: "one heartbeat, mounted at the root",
              d: "a single 50 ms interval drives every mode, so a timer keeps counting while you are looking at the stopwatch — and keeps counting hidden in the tray",
            },
            {
              Icon: MinifyIcon,
              t: "it shrinks itself when you start",
              d: "starting a countdown collapses the card into the corner capsule on the transition into running, so restoring it mid-count does not immediately re-minify",
            },
            {
              Icon: WaveIcon,
              t: "the chime is real",
              d: "open Settings in the widget and pick a sound — each one is re-synthesised in your browser from the same partials the app bakes into its WAVs",
            },
          ].map((r) => (
            <Paper key={r.t} className="p-5 flex items-start gap-4">
              <span className="relative z-10 grid place-items-center h-11 w-11 shrink-0 rounded-2xl bg-[#e6c2b0]/45 text-[#c8795a]">
                <r.Icon width={20} height={20} />
              </span>
              <div className="relative z-10">
                <p className="font-extrabold text-[15px] text-[#4a3f38]">{r.t}</p>
                <p className="text-[13px] text-[#8a7969] leading-snug mt-1">
                  {r.d}
                </p>
              </div>
            </Paper>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function WidgetIconButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded-full transition-colors duration-200 hover:bg-[#e2d5c3]/70 hover:text-[#4a3f38] ${
        active ? "bg-[#e2d5c3]/70 text-[#4a3f38]" : ""
      }`}
    >
      {children}
    </button>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  primary,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={
        primary
          ? "grid h-14 w-14 place-items-center rounded-full bg-[#c8795a] text-[#f7f1e8] shadow-[0_6px_18px_-6px_rgba(168,94,66,0.9)] transition-all duration-300 hover:bg-[#a85e42] active:scale-90"
          : "grid h-10 w-10 place-items-center rounded-full border border-[#e2d5c3] text-[#8a7969] transition-colors duration-300 enabled:hover:bg-[#e2d5c3]/60 enabled:hover:text-[#4a3f38] disabled:opacity-35"
      }
    >
      {children}
    </button>
  );
}

function TimerPanel({
  timer,
  setTimer,
  onToggle,
  remainingMs,
  ringProgress,
  breathing,
}: {
  timer: TimerState;
  setTimer: React.Dispatch<React.SetStateAction<TimerState>>;
  onToggle: () => void;
  remainingMs: number;
  ringProgress: number;
  breathing: boolean;
}) {
  const editable = timer.status === "idle" || timer.status === "completed";
  const display = formatCountdown(remainingMs);

  const CAPTIONS: Record<TimerStatus, string> = {
    idle: "Tap to set",
    running: "Remaining",
    paused: "Paused",
    completed: "Done",
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 px-5 pb-5">
      <div className="relative">
        <ProgressRing progress={ringProgress} size={164} breathing={breathing}>
          <div className="flex flex-col items-center">
            <span className="text-[38px] leading-none font-light tracking-tight text-[#4a3f38] tabular-nums">
              {display}
            </span>
            <span className="mt-1.5 text-[10px] font-extrabold tracking-[0.12em] text-[#8a7969] uppercase">
              {CAPTIONS[timer.status]}
            </span>
          </div>
        </ProgressRing>
        {timer.status === "completed" && <RingBurst size={164} />}
      </div>

      <div className="flex gap-1.5">
        {TIMER_PRESETS.map((seconds) => {
          const active = timer.durationSeconds === seconds;
          return (
            <button
              key={seconds}
              type="button"
              disabled={!editable}
              onClick={() => setTimer(createTimer(seconds))}
              className={`rounded-full px-3 py-1 text-[11px] font-extrabold transition-colors duration-200 disabled:opacity-35 ${
                active
                  ? "bg-[#e6c2b0]/70 text-[#a85e42]"
                  : "text-[#8a7969] enabled:hover:bg-[#e2d5c3]/60 enabled:hover:text-[#4a3f38]"
              }`}
            >
              {Math.round(seconds / 60)} min
            </button>
          );
        })}
      </div>

      {/* three columns keep the primary control optically centred */}
      <div className="grid grid-cols-[40px_56px_40px] items-center gap-3">
        <ControlButton
          label="Reset"
          disabled={timer.status === "idle"}
          onClick={() => setTimer(createTimer(timer.durationSeconds))}
        >
          <ResetIcon width={16} height={16} />
        </ControlButton>

        {timer.status === "completed" ? (
          <ControlButton
            label="Dismiss"
            primary
            onClick={() => setTimer(createTimer(timer.durationSeconds))}
          >
            <CheckIcon width={20} height={20} />
          </ControlButton>
        ) : (
          <ControlButton
            label={timer.status === "running" ? "Pause" : "Start"}
            primary
            onClick={onToggle}
          >
            {timer.status === "running" ? (
              <PauseIcon width={20} height={20} />
            ) : (
              <PlayIcon width={20} height={20} />
            )}
          </ControlButton>
        )}
        <div />
      </div>
    </div>
  );
}

function StopwatchPanel({
  elapsed,
  laps,
  running,
  onToggle,
  onLap,
  onReset,
}: {
  elapsed: number;
  laps: number[];
  running: boolean;
  onToggle: () => void;
  onLap: () => void;
  onReset: () => void;
}) {
  // the ring is a seconds hand, not a countdown — one full turn per minute
  const sweep = (elapsed % 60000) / 60000;
  const [main, hundredths] = formatStopwatch(elapsed).split(".");
  const deltas = laps.map((split, i) => split - (i === 0 ? 0 : (laps[i - 1] ?? 0)));
  const rows = laps
    .map((split, index) => ({ index, split, delta: deltas[index] ?? 0 }))
    .reverse();

  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 px-5 pb-5">
      <ProgressRing progress={sweep} size={150} strokeWidth={9} tone="sage">
        <div className="flex flex-col items-center">
          <div className="flex items-baseline">
            <span className="text-[31px] leading-none font-light tracking-tight text-[#4a3f38] tabular-nums">
              {main}
            </span>
            <span className="ml-0.5 text-[15px] leading-none font-semibold text-[#8fa68e] tabular-nums">
              .{hundredths}
            </span>
          </div>
          <span className="mt-1.5 text-[10px] font-extrabold tracking-[0.12em] text-[#8a7969] uppercase">
            {!running && elapsed > 0 ? "Paused" : "Elapsed"}
          </span>
        </div>
      </ProgressRing>

      {/* the list only claims space once there is something in it */}
      <div className="w-full">
        <AnimatePresence initial={false}>
          {rows.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 88 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: EASE_CALM }}
              className="overflow-y-auto rounded-[26px] border border-[#e2d5c3]/60 bg-[#ece0d0]/35"
            >
              {rows.map((row) => (
                <li
                  key={row.index}
                  className="flex items-baseline gap-2 border-b border-[#e2d5c3]/40 px-3 py-1.5 text-[11px] last:border-b-0"
                >
                  <span className="w-8 shrink-0 font-extrabold text-[#8a7969] tabular-nums">
                    {String(row.index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-bold text-[#4a3f38] tabular-nums">
                    {formatStopwatch(row.delta)}
                  </span>
                  <span className="ml-auto text-[#8a7969] tabular-nums">
                    {formatStopwatch(row.split)}
                  </span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* the left key is Lap while running and Reset once stopped */}
      <div className="grid grid-cols-[40px_56px_40px] items-center gap-3">
        {running ? (
          <ControlButton label="Lap" onClick={onLap}>
            <FlagIcon width={16} height={16} />
          </ControlButton>
        ) : (
          <ControlButton
            label="Reset"
            disabled={elapsed === 0 && laps.length === 0}
            onClick={onReset}
          >
            <ResetIcon width={16} height={16} />
          </ControlButton>
        )}
        <ControlButton label={running ? "Pause" : "Start"} primary onClick={onToggle}>
          {running ? (
            <PauseIcon width={20} height={20} />
          ) : (
            <PlayIcon width={20} height={20} />
          )}
        </ControlButton>
        <div />
      </div>
    </div>
  );
}

const DEMO_ALARMS = [
  { time: "07:00", label: "Stretch", days: [1, 2, 3, 4, 5], on: true },
  { time: "13:30", label: "Stand up", days: [] as number[], on: true },
  { time: "22:45", label: "Wind down", days: [0, 1, 2, 3, 4, 5, 6], on: false },
];

function AlarmPanel() {
  const [alarms, setAlarms] = useState(DEMO_ALARMS);
  return (
    <div className="h-full flex flex-col px-5 pt-4 pb-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-extrabold tracking-[0.14em] text-[#8a7969] uppercase">
          {alarms.filter((a) => a.on).length} scheduled
        </span>
        <button
          type="button"
          aria-label="Add alarm"
          className="grid h-7 w-7 place-items-center rounded-full bg-[#c8795a] text-[#f7f1e8] transition-colors hover:bg-[#a85e42]"
        >
          <PlusIcon width={14} height={14} />
        </button>
      </div>

      <ul className="flex-1 space-y-2">
        {alarms.map((a, i) => (
          <li
            key={a.time}
            className="flex items-center gap-3 rounded-[20px] border border-[#e2d5c3]/70 bg-[#f7f1e8]/70 px-4 py-3"
          >
            <div className="min-w-0">
              <p
                className={`text-[24px] leading-none font-light tabular-nums ${
                  a.on ? "text-[#4a3f38]" : "text-[#8a7969]/60"
                }`}
              >
                {a.time}
              </p>
              <p className="mt-1 text-[10px] font-bold text-[#8a7969] truncate">
                {a.label} · {describeRepeat(a.days)}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={a.on}
              aria-label={`${a.label} alarm`}
              onClick={() =>
                setAlarms((list) =>
                  list.map((x, j) => (j === i ? { ...x, on: !x.on } : x)),
                )
              }
              className={`ml-auto relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                a.on ? "bg-[#c8795a]" : "bg-[#e2d5c3]"
              }`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-[#f7f1e8] shadow ${
                  a.on ? "right-[3px]" : "left-[3px]"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      <p className="text-[10px] text-[#8a7969] leading-relaxed mt-3">
        A one-shot alarm switches itself off once it has rung. Repeats are driven
        entirely by weekday chips — see section 04.
      </p>
    </div>
  );
}

function SettingsPanel({
  soundId,
  setSoundId,
  autoMini,
  setAutoMini,
}: {
  soundId: string;
  setSoundId: (id: string) => void;
  autoMini: boolean;
  setAutoMini: (v: boolean) => void;
}) {
  return (
    <div className="h-full flex flex-col px-5 pt-2 pb-5 overflow-y-auto">
      <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#8a7969] uppercase mb-3">
        Sound
      </p>
      <ul className="space-y-1.5 mb-5">
        {CHIMES.map((c) => {
          const active = c.id === soundId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setSoundId(c.id);
                  playChime(c.id);
                }}
                className={`w-full flex items-center gap-3 rounded-[18px] border px-3.5 py-2.5 text-left transition-colors duration-200 ${
                  active
                    ? "border-[#c8795a]/50 bg-[#e6c2b0]/40"
                    : "border-[#e2d5c3]/70 hover:bg-[#e2d5c3]/35"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                    active
                      ? "bg-[#c8795a] text-[#f7f1e8]"
                      : "bg-[#ece0d0] text-[#8a7969]"
                  }`}
                >
                  <WaveIcon width={14} height={14} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-extrabold text-[#4a3f38]">
                    {c.name}
                  </span>
                  <span className="block text-[10px] text-[#8a7969] truncate">
                    {c.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#8a7969] uppercase mb-3">
        Behaviour
      </p>
      <button
        type="button"
        role="switch"
        aria-checked={autoMini}
        onClick={() => setAutoMini(!autoMini)}
        className="flex items-center gap-3 rounded-[18px] border border-[#e2d5c3]/70 px-3.5 py-3 text-left transition-colors hover:bg-[#e2d5c3]/35"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-extrabold text-[#4a3f38]">
            Minify on start
          </span>
          <span className="block text-[10px] text-[#8a7969]">
            shrink to the corner when a timer begins
          </span>
        </span>
        <span
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
            autoMini ? "bg-[#c8795a]" : "bg-[#e2d5c3]"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-[#f7f1e8] shadow ${
              autoMini ? "right-[3px]" : "left-[3px]"
            }`}
          />
        </span>
      </button>

      <p className="text-[10px] text-[#8a7969] leading-relaxed mt-4">
        Everything here is persisted to a local JSON file through{" "}
        <span className="font-bold text-[#4a3f38]">electron-store</span> — the
        only true runtime dependency in the whole app.
      </p>
    </div>
  );
}

// ──────────────────────────────────────────── 02 · CORNER PARKING ────────────
type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
const CORNERS: Corner[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];
const DEMO_CAP_W = 190;
const DEMO_CAP_H = 50;
const CORNER_MARGIN = 18;

function CornerSection() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [corner, setCorner] = useState<Corner>("bottom-right");
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const placed = useRef(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const positionFor = useCallback(
    (c: Corner) => ({
      x: c.endsWith("left") ? CORNER_MARGIN : box.w - DEMO_CAP_W - CORNER_MARGIN,
      y: c.startsWith("top") ? CORNER_MARGIN : box.h - DEMO_CAP_H - CORNER_MARGIN,
    }),
    [box.w, box.h],
  );

  // park it whenever the corner changes — an instant jump reads as a glitch, so
  // the app eases over 220 ms with easeOutCubic. same here.
  useEffect(() => {
    if (box.w === 0 || box.h === 0) return;
    const target = positionFor(corner);
    if (!placed.current) {
      x.set(target.x);
      y.set(target.y);
      placed.current = true;
      return;
    }
    animate(x, target.x, { duration: 0.22, ease: [0.33, 1, 0.68, 1] });
    animate(y, target.y, { duration: 0.22, ease: [0.33, 1, 0.68, 1] });
  }, [corner, box.w, box.h, positionFor, x, y]);

  /** Which corner of its own display a rect currently sits nearest to. */
  const nearestCorner = (): Corner => {
    const isLeft = x.get() + DEMO_CAP_W / 2 < box.w / 2;
    const isTop = y.get() + DEMO_CAP_H / 2 < box.h / 2;
    if (isTop) return isLeft ? "top-left" : "top-right";
    return isLeft ? "bottom-left" : "bottom-right";
  };

  const handleDragEnd = () => {
    setDragging(false);
    const next = nearestCorner();
    if (next === corner) {
      const target = positionFor(corner);
      animate(x, target.x, { duration: 0.22, ease: [0.33, 1, 0.68, 1] });
      animate(y, target.y, { duration: 0.22, ease: [0.33, 1, 0.68, 1] });
    } else {
      setCorner(next);
    }
  };

  return (
    <motion.section {...section} className="mb-32 md:mb-48">
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="02" text="Corner parking" />
        <Heading accent="magnetic">the capsule is</Heading>
        <Lead>
          Drop it anywhere and it glides to whichever screen corner it was
          dropped nearest. Progress reads as a block of warmth receding across
          the capsule rather than as a ring — at{" "}
          <Mono>224 × 58</Mono> an arc is too fine to read, but a shrinking
          block of colour is legible peripherally, from across the desk.
        </Lead>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <motion.div variants={fadeUp} className="lg:col-span-7">
          {/* a stand-in desktop */}
          <div
            ref={boxRef}
            className="relative h-[340px] rounded-[26px] border border-[#e2d5c3] bg-[#ece0d0]/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(226,213,195,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(226,213,195,0.5)_1px,transparent_1px)] bg-[size:28px_28px]" />
            {CORNERS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCorner(c)}
                aria-label={`Park ${c}`}
                className={`absolute h-16 w-16 rounded-[18px] border-2 border-dashed transition-colors duration-300 ${
                  corner === c
                    ? "border-[#c8795a]/60"
                    : "border-[#e2d5c3] hover:border-[#c8795a]/40"
                } ${c.startsWith("top") ? "top-3" : "bottom-3"} ${
                  c.endsWith("left") ? "left-3" : "right-3"
                }`}
              />
            ))}

            <motion.div
              drag
              dragConstraints={boxRef}
              dragMomentum={false}
              dragElastic={0.06}
              onDragStart={() => setDragging(true)}
              onDragEnd={handleDragEnd}
              style={{ x, y, width: DEMO_CAP_W, height: DEMO_CAP_H }}
              className={`absolute top-0 left-0 z-10 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              <div className="tempo-grain relative flex h-full w-full items-center overflow-hidden rounded-full border border-[#e2d5c3] bg-gradient-to-b from-[#f7f1e8] to-[#ece0d0] shadow-[0_8px_20px_-8px_rgba(74,63,56,0.55)]">
                <div className="absolute inset-y-0 left-0 w-[38%] bg-[#e6c2b0]/55" />
                <div className="relative z-10 flex w-full items-center gap-2.5 px-4">
                  <motion.span
                    className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#c8795a]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="text-[21px] leading-none font-light text-[#4a3f38] tabular-nums">
                    09:38
                  </span>
                  <span className="ml-auto text-[#8a7969]">
                    <ExpandIcon width={12} height={12} />
                  </span>
                </div>
              </div>
            </motion.div>

            <span className="absolute left-1/2 -translate-x-1/2 bottom-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a7969]/80 pointer-events-none">
              drag the capsule · or tap a corner
            </span>
          </div>
          <p className="text-center text-[11px] font-bold text-[#8a7969] mt-3">
            parked{" "}
            <span className="text-[#a85e42]">{corner.replace("-", " ")}</span> ·
            eased over 220 ms with easeOutCubic
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-5 space-y-3">
          {[
            {
              Icon: TrayIcon,
              t: "every window is bigger than it draws",
              d: "a CSS shadow paints outside its element, so anything filling its window gets clipped flat at the edge. each window carries transparent padding at least blur + spread + offset",
            },
            {
              Icon: ShieldIcon,
              t: "a saved position is checked, not trusted",
              d: "at least 96 px of the widget has to land on a connected monitor, or it falls back to the default corner — an unplugged screen should not strand it out of reach",
            },
            {
              Icon: MinifyIcon,
              t: "resizing is bracketed by setResizable",
              d: "a non-resizable window on Windows carries min/max constraints that would otherwise clamp setBounds to the size it already is",
            },
          ].map((r) => (
            <Paper key={r.t} className="p-5 flex items-start gap-4">
              <span className="relative z-10 grid place-items-center h-11 w-11 shrink-0 rounded-2xl bg-[#e6c2b0]/45 text-[#c8795a]">
                <r.Icon width={20} height={20} />
              </span>
              <div className="relative z-10">
                <p className="font-extrabold text-[15px] text-[#4a3f38]">{r.t}</p>
                <p className="text-[13px] text-[#8a7969] leading-snug mt-1">
                  {r.d}
                </p>
              </div>
            </Paper>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────── 03 · TIME IS ABSOLUTE ───────────────
const DEMO_DURATION_MS = 5 * 60 * 1000;

function AbsoluteTimeSection() {
  // both counters watch the same 5-minute timer. one derives from an absolute
  // endsAt; the other decrements per tick, which is what the naive version does.
  const [awakeMs, setAwakeMs] = useState(42 * 1000);
  const [sleptMs, setSleptMs] = useState(0);
  const [asleep, setAsleep] = useState(false);

  useEffect(() => {
    if (asleep) return;
    const id = window.setInterval(() => {
      setAwakeMs((v) => (v >= DEMO_DURATION_MS ? v : v + 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [asleep]);

  const sleep = (minutes: number) => {
    setAsleep(true);
    setSleptMs((v) => v + minutes * 60 * 1000);
    window.setTimeout(() => setAsleep(false), 900);
  };

  const absoluteRemaining = Math.max(0, DEMO_DURATION_MS - awakeMs - sleptMs);
  const naiveRemaining = Math.max(0, DEMO_DURATION_MS - awakeMs);
  const drifted = sleptMs > 0;

  return (
    <motion.section {...section} className="mb-32 md:mb-48">
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="03" text="Correct across sleep" />
        <Heading accent="never accumulated">time is absolute,</Heading>
        <Lead>
          Timers store an absolute <Mono>endsAt</Mono> instant and alarms a{" "}
          <Mono>nextFireAt</Mono>; the countdown is <em>derived</em> from those,
          never decremented per tick. Shut the lid for an hour and a five-minute
          timer wakes up already complete, rather than fifty-five minutes behind.
          Close the lid below and watch the two diverge.
        </Lead>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Paper className="p-6 md:p-10">
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <ClockCard
                title="derived from endsAt"
                subtitle="what Tempo does"
                value={formatCountdown(absoluteRemaining)}
                done={absoluteRemaining === 0}
                good
              />
              <ClockCard
                title="decremented per tick"
                subtitle="what a naive timer does"
                value={formatCountdown(naiveRemaining)}
                done={naiveRemaining === 0}
                good={!drifted}
                note={
                  drifted
                    ? `${Math.round(sleptMs / 60000)} min of ticks never happened`
                    : undefined
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#8a7969] mr-1">
                <MoonIcon width={15} height={15} className="inline mr-2 -mt-0.5" />
                suspend the machine
              </span>
              {[1, 5, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => sleep(m)}
                  disabled={asleep}
                  className="rounded-full bg-[#4a3f38] px-4 py-2 text-[12px] font-extrabold text-[#f7f1e8] transition-all duration-300 hover:bg-[#c8795a] active:scale-95 disabled:opacity-40"
                >
                  {m === 60 ? "1 hour" : `${m} min`}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAwakeMs(42 * 1000);
                  setSleptMs(0);
                }}
                className="rounded-full border border-[#e2d5c3] px-4 py-2 text-[12px] font-extrabold text-[#8a7969] transition-colors hover:text-[#4a3f38] hover:bg-[#e2d5c3]/50"
              >
                reset
              </button>
            </div>

            <AnimatePresence>
              {drifted && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_CALM }}
                  className="mt-6 text-sm text-[#8a7969] leading-relaxed max-w-2xl"
                >
                  The drift is the whole reason the invariant exists. Chromium
                  also throttles timers in hidden windows to roughly once a
                  minute, and Tempo hides to the tray <em>while counting</em> —
                  so the window sets{" "}
                  <Mono>backgroundThrottling: false</Mono> on top of it.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </Paper>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
        {[
          {
            t: "alarms get a grace window",
            d: "anything more than five minutes late is reported as missed and silently rescheduled — opening the lid at lunchtime should not set off the 07:00 alarm",
          },
          {
            t: "wake reconciles immediately",
            d: "powerMonitor's resume event nudges the renderer to sweep at once, instead of waiting up to a second for its next scheduled pass",
          },
          {
            t: "the clock can move, durations cannot",
            d: "a manual time source is stored as a fixed offset, so it still ticks. wall-clock things follow it; the timer and stopwatch stay on the system clock",
          },
        ].map((r) => (
          <Paper key={r.t} className="p-5">
            <p className="relative z-10 font-extrabold text-[14px] text-[#4a3f38] mb-1.5">
              {r.t}
            </p>
            <p className="relative z-10 text-[12.5px] text-[#8a7969] leading-relaxed">
              {r.d}
            </p>
          </Paper>
        ))}
      </motion.div>
    </motion.section>
  );
}

function ClockCard({
  title,
  subtitle,
  value,
  done,
  good,
  note,
}: {
  title: string;
  subtitle: string;
  value: string;
  done: boolean;
  good: boolean;
  note?: string;
}) {
  return (
    <div
      className={`relative rounded-[22px] border p-6 transition-colors duration-500 ${
        good
          ? "border-[#8fa68e]/50 bg-[#cbd8ca]/25"
          : "border-[#c8795a]/50 bg-[#e6c2b0]/25"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`h-2 w-2 rounded-full ${good ? "bg-[#8fa68e]" : "bg-[#c8795a]"}`}
        />
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4a3f38]">
          {title}
        </span>
      </div>
      <p className="text-[52px] md:text-[64px] leading-none font-light tabular-nums text-[#4a3f38]">
        {done ? "00:00" : value}
      </p>
      <p className="mt-3 text-[11px] font-bold text-[#8a7969]">
        {done ? "Done" : subtitle}
      </p>
      {note && (
        <p className="mt-2 text-[11px] font-extrabold text-[#a85e42]">{note}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────── 04 · ALARMS ─────────────────
function AlarmSection() {
  const [days, setDays] = useState<number[]>([1, 3, 5]);
  const [time, setTime] = useState("07:00");
  const now = useWallClock(30_000);

  const next = now === null ? null : nextOccurrence(time, days, now);
  const chips = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <motion.section {...section} className="mb-32 md:mb-48">
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="04" text="Alarms" />
        <Heading accent="seven chips">the repeat model is</Heading>
        <Lead>
          No dropdown, no &ldquo;custom…&rdquo; dialog. Nothing selected is{" "}
          <em>Once</em>, all seven is <em>Every day</em>, and anything between is
          a set that names itself. The label below is{" "}
          <Mono>describeRepeat()</Mono> from the app&apos;s core, and the next
          fire time is <Mono>nextOccurrence()</Mono> — both running here,
          unmodified.
        </Lead>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <Paper className="p-6 md:p-8 h-full">
            <div className="relative z-10">
              <div className="flex flex-wrap items-end gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a7969] mb-2">
                    Time
                  </p>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value || "07:00")}
                    className="bg-transparent text-[44px] leading-none font-light tabular-nums text-[#4a3f38] outline-none border-b-2 border-[#e6c2b0] focus:border-[#c8795a] transition-colors"
                  />
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a7969] mb-2">
                    describeRepeat
                  </p>
                  <p className="text-[22px] font-extrabold text-[#a85e42] leading-none">
                    {describeRepeat(days)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-8">
                {chips.map((c, i) => {
                  const on = days.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-pressed={on}
                      aria-label={DAY_LABELS[i]}
                      onClick={() =>
                        setDays((d) =>
                          d.includes(i) ? d.filter((x) => x !== i) : [...d, i],
                        )
                      }
                      className={`h-11 w-11 rounded-full text-[13px] font-extrabold transition-all duration-300 ${
                        on
                          ? "bg-[#c8795a] text-[#f7f1e8] shadow-[0_4px_12px_-4px_rgba(168,94,66,0.8)]"
                          : "border border-[#e2d5c3] text-[#8a7969] hover:border-[#c8795a]/40 hover:text-[#4a3f38]"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[20px] border border-[#e2d5c3] bg-[#f7f1e8]/70 px-5 py-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a7969] mb-1.5">
                  nextFireAt
                </p>
                <p className="text-[15px] font-extrabold text-[#4a3f38]">
                  {next === null
                    ? "—"
                    : new Date(next).toLocaleString(undefined, {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </p>
                <p className="text-[11.5px] text-[#8a7969] mt-1.5 leading-relaxed">
                  Resolved by constructing one local Date per candidate day, so
                  the platform handles month rollovers and daylight-saving shifts
                  for us. Stored, not recomputed each tick — that is what lets a
                  sleeping machine catch up on wake.
                </p>
              </div>
            </div>
          </Paper>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-5 space-y-3">
          {[
            {
              Icon: BellIcon,
              t: "a ringing alarm owns the card",
              d: "it sits above the header and the switcher with snooze and dismiss, and two landing in the same minute queue properly rather than racing",
            },
            {
              Icon: CheckIcon,
              t: "one-shot alarms retire themselves",
              d: "a repeat of Once flips enabled to false the moment it fires, instead of quietly rescheduling for tomorrow",
            },
            {
              Icon: MoonIcon,
              t: "missed is a state, not a miss",
              d: "the sweep separates fired from missed and reports both, so waking at lunchtime reschedules the 07:00 alarm rather than setting it off",
            },
          ].map((r) => (
            <Paper key={r.t} className="p-5 flex items-start gap-4">
              <span className="relative z-10 grid place-items-center h-11 w-11 shrink-0 rounded-2xl bg-[#e6c2b0]/45 text-[#c8795a]">
                <r.Icon width={20} height={20} />
              </span>
              <div className="relative z-10">
                <p className="font-extrabold text-[15px] text-[#4a3f38]">{r.t}</p>
                <p className="text-[13px] text-[#8a7969] leading-snug mt-1">
                  {r.d}
                </p>
              </div>
            </Paper>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ────────────────────────────────────── 05 · GENERATED ASSETS ────────────────
function GeneratedSection() {
  const [playing, setPlaying] = useState<string | null>(null);

  const play = (id: string) => {
    playChime(id);
    setPlaying(id);
    window.setTimeout(() => setPlaying((p) => (p === id ? null : p)), 900);
  };

  return (
    <motion.section {...section} className="mb-32 md:mb-48">
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="05" text="Generated assets" />
        <Heading accent="generated, not drawn">the icon and the chimes are</Heading>
        <Lead>
          The clay-and-cream mark is rasterised in a script with 4×4
          supersampling — a hand-rolled PNG encoder, CRC32 and all, plus a
          multi-size <Mono>.ico</Mono> container. The four chimes are synthesised
          from decaying sine partials. Both palettes are numbers in a file, so
          retuning is an edit and a rerun rather than a trip to a design tool.
        </Lead>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* the icon */}
        <motion.div variants={fadeUp} className="lg:col-span-5">
          <Paper className="p-6 md:p-8 h-full">
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-6">
                <TempoMark size={168} />
                {/* the geometry, called out */}
                <svg
                  viewBox="0 0 100 100"
                  width={168}
                  height={168}
                  className="absolute inset-0"
                  aria-hidden
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#4a3f38"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                  <circle cx="50" cy="50" r="1.4" fill="#4a3f38" opacity="0.6" />
                </svg>
              </div>
              <dl className="w-full space-y-2 text-[12px]">
                {[
                  ["disc radius", "0.46"],
                  ["hour hand", "0.5 → 0.32, half-width 0.05"],
                  ["minute hand", "0.5 → 0.76, half-width 0.045"],
                  ["supersample", "4 × 4 = 16 samples / pixel"],
                  ["sizes emitted", "16 · 24 · 32 · 48 · 64 · 128 · 256"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-[#e2d5c3]/70 pb-1.5"
                  >
                    <dt className="text-[#8a7969] font-bold">{k}</dt>
                    <dd className="text-[#4a3f38] font-extrabold tabular-nums text-right">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-[11.5px] text-[#8a7969] leading-relaxed mt-5">
                All geometry is in 0–1 units, so one description scales to every
                size. Distance-to-a-segment gives the hands round caps for free.
              </p>
            </div>
          </Paper>
        </motion.div>

        {/* the chimes */}
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <Paper className="p-6 md:p-8 h-full">
            <div className="relative z-10">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a7969] mb-1">
                additive synthesis · press to hear
              </p>
              <p className="text-[12px] text-[#8a7969] mb-6 leading-relaxed">
                Each is a set of decaying sine partials over a fundamental —
                exactly how a struck bell or bar behaves. These play through the
                Web Audio API using the same ratios, amplitudes and decay
                constants the app bakes into its WAVs.
              </p>

              <ul className="space-y-3">
                {CHIMES.map((c) => {
                  const partials = c.voices[0].partials;
                  const isPlaying = playing === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => play(c.id)}
                        className="w-full text-left rounded-[20px] border border-[#e2d5c3] bg-[#f7f1e8]/60 px-5 py-4 transition-all duration-300 hover:border-[#c8795a]/50 hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <motion.span
                            animate={
                              isPlaying
                                ? { scale: [1, 1.18, 1] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                              isPlaying
                                ? "bg-[#c8795a] text-[#f7f1e8]"
                                : "bg-[#ece0d0] text-[#8a7969]"
                            }`}
                          >
                            <PlayIcon width={15} height={15} />
                          </motion.span>
                          <div className="min-w-0">
                            <p className="text-[15px] font-extrabold text-[#4a3f38]">
                              {c.name}
                            </p>
                            <p className="text-[11.5px] text-[#8a7969]">
                              {c.character}
                            </p>
                          </div>
                          <span className="ml-auto shrink-0 text-[11px] font-extrabold text-[#8a7969] tabular-nums">
                            {c.duration.toFixed(1)}s
                          </span>
                        </div>

                        {/* the partial set, as bars: x = ratio, height = amp */}
                        <div className="relative h-12 flex items-end gap-[3px]">
                          {partials.map((p, i) => (
                            <span
                              key={i}
                              className="flex-1 rounded-t-sm bg-[#c8795a] transition-opacity duration-300"
                              style={{
                                height: `${Math.max(6, p.amp * 100)}%`,
                                opacity: 0.35 + p.decay * 0.5,
                              }}
                              title={`ratio ${p.ratio} · amp ${p.amp}`}
                            />
                          ))}
                          <span className="absolute -bottom-0 left-0 right-0 h-px bg-[#e2d5c3]" />
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-[#8a7969] tabular-nums">
                          ratios{" "}
                          {partials.map((p) => p.ratio).join(" · ")}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="text-[11.5px] text-[#8a7969] leading-relaxed mt-5">
                A 6 ms attack ramp keeps the waveform from starting on a
                discontinuity, and a 60 ms tail fade keeps the file from ending
                mid-cycle. Peak sits at{" "}
                <span className="font-extrabold text-[#4a3f38]">0.82</span> —
                these should feel gentle, never loud.
              </p>
            </div>
          </Paper>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ──────────────────────────────────────────────── 06 · THE STACK ─────────────
const TECH = [
  { name: "Electron 43", role: "frameless transparent windows · tray · power-monitor" },
  { name: "React 19", role: "the renderer, via electron-vite" },
  { name: "TypeScript", role: "strict across main, preload and renderer" },
  { name: "Tailwind v4", role: "CSS-first tokens — the Warm Analog palette" },
  { name: "Framer Motion", role: "shared-layout indicators · crossfades · springs" },
  { name: "Zustand", role: "one store per mode, plus a single shared clock" },
  { name: "Howler.js", role: "chime playback" },
  { name: "electron-store", role: "local JSON — the only runtime dependency" },
  { name: "Vitest", role: "84 tests over the pure, platform-free core" },
];

function StackSection() {
  return (
    <motion.section {...section} className="mb-32 md:mb-48">
      <motion.div variants={fadeUp} className="mb-10 md:mb-14 max-w-3xl">
        <SectionLabel n="06" text="The stack" />
        <Heading accent="neither half">a main/renderer split, with the logic in</Heading>
        <Lead>
          <Mono>src/core/</Mono> holds the timer maths, stopwatch maths and alarm
          scheduling with no Electron, Node or DOM imports at all. It is the
          piece that ports to Mac unchanged, the piece the test suite leans on
          hardest — and, as it happens, the piece running the demos on this page.
        </Lead>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TECH.map((t) => (
          <motion.div key={t.name} variants={fadeUp} whileHover={{ x: 4 }}>
            <Paper className="p-5 hover:border-[#c8795a]/40 transition-colors">
              <div className="relative z-10 flex items-center gap-3 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c8795a]" />
                <span className="font-extrabold text-[#4a3f38]">{t.name}</span>
              </div>
              <p className="relative z-10 text-xs text-[#8a7969] leading-snug pl-5">
                {t.role}
              </p>
            </Paper>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} className="mt-6">
        <Paper className="p-6 md:p-8 flex items-start gap-4">
          <span className="relative z-10 grid place-items-center h-11 w-11 shrink-0 rounded-2xl bg-[#e6c2b0]/45 text-[#c8795a]">
            <ShieldIcon width={20} height={20} />
          </span>
          <p className="relative z-10 text-sm text-[#8a7969] leading-relaxed">
            The card is one big{" "}
            <Mono>-webkit-app-region: drag</Mono> surface so it can be moved from
            anywhere — and that property <em>inherits</em>. Any control that does
            not opt back out is silently unclickable, because Windows swallows
            the press as a window drag. So the stylesheet sets{" "}
            <Mono>no-drag</Mono> on every button, input and interactive ARIA role
            automatically, unlayered so it wins the cascade. Relying on each new
            control to remember does not survive contact with a growing UI.
          </p>
        </Paper>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────── FINAL CTA ───────────
function FinalCTA() {
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
      node: <BellIcon className="w-5 h-5" />,
    },
  ];

  return (
    <motion.section {...section} className="relative">
      <motion.div variants={fadeUp}>
        <Paper className="p-10 md:p-16 shadow-[0_20px_60px_-30px_rgba(74,63,56,0.6)]">
          <div
            className="absolute -top-28 -right-20 w-[420px] h-[420px] rounded-full blur-3xl bg-[#e6c2b0]/60"
            aria-hidden
          />
          <div
            className="absolute -bottom-28 -left-20 w-[360px] h-[360px] rounded-full blur-3xl bg-[#cbd8ca]/50"
            aria-hidden
          />
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:block absolute top-10 right-12 z-10"
          >
            <TempoMark size={76} />
          </motion.div>

          <div className="relative z-10 max-w-3xl">
            <span className="text-[10px] font-extrabold text-[#8a7969] uppercase tracking-[0.28em] mb-4 block">
              07. bring it home
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em] mb-6 leading-[1.02] text-[#4a3f38]">
              a clock that{" "}
              <span className="text-[#c8795a]">stays out of the way</span>.
            </h2>
            <p className="text-base md:text-lg text-[#8a7969] leading-relaxed mb-10 max-w-xl">
              Tempo is a free, unsigned personal-use build for Windows 10 and 11
              — an NSIS installer that needs no admin, or a single portable exe.
              No account, no network access of any kind; everything lives in a
              local JSON file beside the app.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={RELEASES}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-full font-extrabold text-sm text-[#f7f1e8] bg-[#c8795a] shadow-[0_12px_30px_-10px_rgba(200,121,90,0.9)] hover:scale-105 hover:-translate-y-1 hover:bg-[#a85e42] active:scale-95 transition-all duration-300"
              >
                download latest ↓
              </a>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-full font-extrabold text-sm text-[#4a3f38] bg-[#f7f1e8] border border-[#e2d5c3] hover:border-[#c8795a]/50 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
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
                  className="w-12 h-12 rounded-2xl bg-[#f7f1e8] border border-[#e2d5c3] text-[#8a7969] flex items-center justify-center hover:text-[#c8795a] hover:border-[#c8795a]/40 transition-colors"
                >
                  {s.node}
                </motion.a>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-[#e2d5c3] flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-extrabold text-[#8a7969] uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8795a] animate-pulse" />
                shipped v1.0
              </span>
              <span>fernando halim · 2026</span>
              <span className="opacity-70">time, quietly kept</span>
            </div>
          </div>
        </Paper>
      </motion.div>
    </motion.section>
  );
}

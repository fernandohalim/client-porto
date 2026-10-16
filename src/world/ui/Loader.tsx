"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Loading as filling the tank: a big analog fuel gauge whose needle swings
// from empty to full as the world boots, and a thin bar with the percentage
// along the bottom of the screen. No words — the gauge says it.
//
// Progress arrives in jumps (code loaded, physics up, first frames drawn), so
// the shown value eases toward it and creeps a little while it waits, the
// way a real needle never quite sits still.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

/** needle angle from straight up, degrees: empty on the left, full on the right */
const SWEEP = 60;
const CREEP_PER_S = 3; // % a second the needle drifts on while waiting
const CREEP_MAX = 14; // ...but never further than this past the real value
const NEEDLE_STIFFNESS = 40;
const NEEDLE_DAMPING = 8;

// a round dial: its centre and the scale's radius
const C = 100;
const SCALE_R = 66;

/** a point at `deg` from straight up, `r` from the centre */
function at(deg: number, r: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [C + Math.sin(a) * r, C - Math.cos(a) * r];
}

function arc(from: number, to: number, r: number) {
  const [x1, y1] = at(from, r);
  const [x2, y2] = at(to, r);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
}

const lerpDeg = (t: number) => -SWEEP + t * SWEEP * 2;

function Gauge({ value }: { value: number }) {
  const angle = lerpDeg(value / 100);
  // ticks every eighth, long at the quarters
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const deg = lerpDeg(i / 8);
    const major = i % 2 === 0;
    const [x1, y1] = at(deg, major ? SCALE_R - 13 : SCALE_R - 8);
    const [x2, y2] = at(deg, SCALE_R + 4);
    return { x1, y1, x2, y2, major };
  });

  return (
    <svg viewBox="0 0 200 200" className="w-[min(70vw,22rem)]" aria-hidden>
      {/* a chrome bezel around a dark face */}
      <circle cx={C} cy={C} r="96" fill="var(--color-chrome, #d9dde3)" />
      <circle cx={C} cy={C} r="96" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="3" />
      <circle cx={C} cy={C} r="86" fill="#1c1520" />
      <circle cx={C} cy={C} r="86" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="4" />

      {/* the scale, one tone from empty to full */}
      <path d={arc(lerpDeg(0), lerpDeg(1), SCALE_R)} stroke="var(--color-cream)" strokeOpacity="0.18" strokeWidth="7" fill="none" strokeLinecap="round" />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="var(--color-cream)"
          strokeWidth={t.major ? 4.5 : 2.5}
          strokeLinecap="round"
        />
      ))}

      {/* the pump, below the pivot where the needle never sweeps */}
      <g transform={`translate(${C - 10} 128)`} fill="var(--color-cream)">
        <rect x="0" y="0" width="14" height="21" rx="2.5" />
        <rect x="2.5" y="2.5" width="9" height="6" rx="1.2" fill="#1c1520" />
        <rect x="-2" y="19.5" width="18" height="4" rx="1.5" />
        <path d="M 14 5 h 4 a 2.5 2.5 0 0 1 2.5 2.5 v 9 a 2 2 0 0 0 4 0 v -10 l -3.5 -4" fill="none" stroke="var(--color-cream)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* the needle, with a short counterweight tail */}
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${C}px ${C}px` }}>
        <path d={`M ${C - 3.2} ${C + 14} L ${C} ${C - SCALE_R + 2} L ${C + 3.2} ${C + 14} Z`} fill="var(--color-coral)" />
      </g>
      <circle cx={C} cy={C} r="9" fill="var(--color-chrome, #d9dde3)" />
      <circle cx={C} cy={C} r="3.5" fill="#1c1520" />
    </svg>
  );
}

export default function Loader({ progress, leaving }: { progress: number; leaving: boolean }) {
  const [shown, setShown] = useState(0);
  const target = useRef(progress);
  const since = useRef(0);

  useEffect(() => {
    target.current = progress;
    since.current = performance.now();
  }, [progress]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let value = 0;
    let velocity = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const real = target.current;
      // drift on while waiting for the next milestone, never all the way to full
      const creep = real >= 100 ? 0 : Math.min(CREEP_MAX, ((now - since.current) / 1000) * CREEP_PER_S);
      const goal = Math.min(real >= 100 ? 100 : 97, real + creep);
      // a lightly damped spring: each jump swings a little past, then settles
      velocity += ((goal - value) * NEEDLE_STIFFNESS - velocity * NEEDLE_DAMPING) * dt;
      value += velocity * dt;
      setShown(Math.max(0, Math.min(100, value)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const pct = Math.round(shown);

  return (
    <div
      aria-busy={!leaving}
      className={`absolute inset-0 z-30 grid place-items-center bg-ink transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        leaving ? "pointer-events-none -translate-y-6 opacity-0" : ""
      }`}
    >
      <div className="animate-pop-in">
        <Gauge value={shown} />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-6 pb-6"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Loading the world"
      >
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream/10">
          <div className="h-full rounded-full bg-coral" style={{ width: `${shown}%` }} />
        </div>
        <span className="w-14 text-right text-lg font-black text-cream tabular-nums">{pct}%</span>
      </div>
    </div>
  );
}

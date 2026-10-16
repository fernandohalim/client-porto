"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Speed lines while the nitrous burns: cream streaks radiating in from the
// screen edges, clear in the middle so the truck stays readable. Flat and
// cartoon, like the rest of the interface — not a post-processing pass.
//
// It reads the truck's telemetry every frame and writes straight to the
// element's style, so boosting never re-renders React.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { carState } from "../config";

export default function SpeedLines() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let level = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // in fast, out a little slower
      const target = carState.boosting ? Math.min(1, Math.abs(carState.speed) / 18) : 0;
      level += (target - level) * (1 - Math.exp(-(target > level ? 10 : 4) * dt));
      const node = el.current;
      if (node) {
        node.style.opacity = level.toFixed(3);
        // a fresh spin each frame makes the streaks flicker past
        node.style.setProperty("--spin", `${Math.floor(Math.random() * 360)}deg`);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 motion-reduce:hidden"
      style={{
        background:
          "repeating-conic-gradient(from var(--spin, 0deg) at 50% 55%, transparent 0deg 5deg, rgba(255, 246, 232, 0.7) 5deg 5.6deg, transparent 5.6deg 9deg)",
        maskImage: "radial-gradient(ellipse 70% 65% at 50% 55%, transparent 45%, black 95%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 55%, transparent 45%, black 95%)",
      }}
    />
  );
}

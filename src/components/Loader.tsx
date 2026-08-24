"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Loader — the cold-open panel.
//
// The reference gates its loader behind a session flag and tears it out of the
// DOM the moment it finishes, so its exact frames could not be captured; what
// is verifiable from its markup is the shape — a full-bleed coal panel with an
// outlined wordmark at centre (`.loader`, `.loader-logo_outline`) that clears
// to reveal the hero.
//
// This is that structure: the wordmark is drawn as an outline and fills solid
// left-to-right as progress advances, a mono counter runs alongside it, and
// the panel then lifts away on a clip-path wipe, uncovering a hero that has
// been sitting there the whole time.
//
// It runs on every full page load, by request. It does NOT run on client-side
// navigation: this lives in ClientLayout, which persists across route changes,
// so the effect only fires on mount — moving between sections or into a case
// study never re-triggers it, which is the behaviour you want.
//
// Reduced-motion visitors still skip it entirely.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "Fernando Halim";

export default function Loader() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // deliberate: whether to show cannot be decided during render. It depends
    // on a media query that does not exist on the server — seeding this into
    // useState would render `true` on the client and `false` on the server and
    // fail hydration. Reading the external system after mount is the correct
    // place for it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);

    const started = performance.now();
    const DURATION = 1500;
    let raf: number;
    let done: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      // ease-out so the count decelerates into 100 instead of hitting a wall
      const t = Math.min(1, (now - started) / DURATION);
      setPct(Math.round((1 - Math.pow(1 - t, 2)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else done = setTimeout(() => setShow(false), 260);
    };
    raf = requestAnimationFrame(tick);

    // Safety net. requestAnimationFrame does not run in a background tab, so a
    // link opened with cmd-click would leave the panel up and the page locked
    // until that tab is focused. setTimeout still fires (throttled) when
    // hidden, so this guarantees the loader can never strand the page.
    const bail = setTimeout(() => setShow(false), DURATION + 3000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
      clearTimeout(bail);
    };
  }, []);

  // Lock scroll for exactly as long as the panel is up.
  //
  // This used to set `overflow: hidden` in the effect above and clear it in a
  // separate effect guarded by `if (!show)`. On mount both effects run in the
  // same commit, and the second one still sees `show === false` from that
  // render — so it cleared the lock immediately and the page was scrollable
  // behind the loader the whole time. Keying the lock to `show` and undoing it
  // in cleanup removes the ordering dependency entirely.
  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-coal px-5 py-6 md:px-8 md:py-8"
        >
          <div className="mono-label flex items-start justify-between text-bone-2/45">
            <span>Fullstack developer</span>
            <span>West Jakarta, ID</span>
          </div>

          {/* ── the filling wordmark ── */}
          <div className="flex flex-1 items-center justify-center">
            <span className="relative inline-block select-none">
              {/* outline underneath */}
              <span
                aria-hidden
                className="display block text-[clamp(2rem,8vw,6rem)] text-transparent"
                style={{ WebkitTextStroke: "1px rgba(245,245,245,0.28)" }}
              >
                {NAME}
              </span>
              {/* solid fill, revealed left-to-right by progress */}
              <span
                aria-hidden
                className="display absolute inset-0 block overflow-hidden whitespace-nowrap text-[clamp(2rem,8vw,6rem)] text-bone-2"
                style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
              >
                {NAME}
              </span>
              <span className="sr-only">{NAME} — loading</span>
            </span>
          </div>

          <div className="flex items-end justify-between">
            <span className="mono-label text-bone-2/45">Loading</span>
            <span className="display text-[clamp(1.6rem,4vw,2.6rem)] tabular-nums text-bone-2">
              {String(pct).padStart(3, "0")}
              <span className="text-accent">%</span>
            </span>
          </div>

          {/* hairline progress rule */}
          <div className="mt-5 h-px w-full bg-line-dark">
            <div
              className="h-full bg-accent transition-[width] duration-75 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

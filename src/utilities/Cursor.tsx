"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.4 });

  const [label, setLabel] = useState<string | null>(null);
  const [hot, setHot] = useState(false); // hovering a link / button
  const [big, setBig] = useState(false); // the invert loupe (over the hero)
  const [enabled, setEnabled] = useState(false);

  const last = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    setEnabled(true);

    const evaluate = (target: Element | null) => {
      if (!target) return;
      const el = target as HTMLElement;
      const tagged = el.closest<HTMLElement>("[data-cursor]");
      const interactive = !!tagged || !!el.closest("a,button");
      setLabel(tagged?.dataset.cursor ?? null);
      setHot(interactive);
      // big loupe only when inside the hero and not over something interactive
      setBig(!interactive && !!el.closest("#hero"));
    };

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      last.current = { x: e.clientX, y: e.clientY };
      evaluate(e.target as Element);
    };

    // re-check under the last cursor point on scroll, so leaving the hero
    // shrinks the loupe even without mouse movement
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        evaluate(document.elementFromPoint(last.current.x, last.current.y));
        ticking = false;
      });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
    };
  }, [x, y]);

  if (!enabled) return null;

  // one cursor, four sizes: hidden behind a label, the big loupe, a small
  // hover bubble, or the default dot.
  const scale = label ? 0 : big ? 21 : hot ? 2.4 : 1;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
    >
      <motion.div
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.6 }}
        className="-ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-[#f2f0ea]"
      />
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#f2f0ea] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#141312]"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
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
  const [hot, setHot] = useState(false); // hovering anything interactive
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      const tagged = el.closest<HTMLElement>("[data-cursor]");
      setLabel(tagged?.dataset.cursor || null);
      setHot(!!tagged || !!el.closest("a,button"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference"
    >
      <motion.div
        animate={{ scale: label ? 0 : hot ? 2.6 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[#f2f0ea]"
      />
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#f2f0ea] text-[#141312] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

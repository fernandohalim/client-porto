"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Chars({
  text,
  delay = 0,
  stagger = 0.03,
  className = "",
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Observes the outer span — no overflow clip, always visible when in viewport
  const isInView = useInView(ref, { once: true });

  return (
    <span
      ref={ref}
      className={`inline-block align-top ${className}`} // ← overflow-hidden removed
      aria-label={text}
    >
      {text.split("").map((c, i) => (
        // overflow-hidden now lives here, one clip per character
        <span key={i} className="inline-block overflow-hidden align-top">
          <motion.span
            aria-hidden
            className="inline-block will-change-transform"
            initial={{ y: "115%", rotate: 5 }}
            animate={
              isInView ? { y: "0%", rotate: 0 } : { y: "115%", rotate: 5 } // ← holds position until parent enters view
            }
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {c === " " ? "\u00A0" : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

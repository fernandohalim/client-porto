"use client";

import { ReactNode, useRef, useEffect, useState } from "react";

export default function Marquee({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const firstRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [clones, setClones] = useState(1); // 1 clone + original = 2 on SSR

  useEffect(() => {
    const calc = () => {
      const el = firstRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      // enough clones to fill 2× viewport — guarantees no gap ever appears
      const needed = Math.max(1, Math.ceil((window.innerWidth * 2) / w));
      setClones(needed);
      trackRef.current?.style.setProperty("--marquee-shift", `-${w}px`);
    };

    calc();
    const ro = new ResizeObserver(calc);
    if (firstRef.current) ro.observe(firstRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`group overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
      >
        <div ref={firstRef} className="flex shrink-0 items-center">
          {children}
        </div>
        {Array.from({ length: clones }, (_, i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

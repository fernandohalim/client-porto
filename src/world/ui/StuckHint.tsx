"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The truck never rights itself — that's R's job. So when it has been on its
// back for a moment, this pill says so. It polls the truck's telemetry every frame and only re-renders when
// the answer flips.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { carState } from "../config";

export default function StuckHint({ visible }: { visible: boolean }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setStuck(carState.stuck);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
      {visible && stuck && (
        <p
          role="status"
          className="flex animate-pop-in items-center gap-2.5 rounded-full border-[3px] border-ink bg-cream px-5 py-2 text-lg font-black shadow-[0_4px_0_var(--color-ink)]"
        >
          Press
          <kbd className="rounded-lg border-2 border-ink bg-white px-2 font-sans text-base font-black shadow-[0_2px_0_var(--color-ink)]">
            R
          </kbd>
          to flip back over
        </p>
      )}
    </div>
  );
}

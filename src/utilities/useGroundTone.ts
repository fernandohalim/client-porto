"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useGroundTone — is the navbar currently sitting over a dark slab?
//
// The navbar used to composite with mix-blend-difference, which handled every
// ground for free but forced the menu toggle into a separate unblended layer
// (a vermilion circle inside a blended group inverts to teal). Two fixed layers
// cannot share a flex row, so the "Search" and "Menu" labels collided.
//
// Reporting the ground instead lets the whole bar live in one row and colour
// itself. Sections opt in by declaring data-ground="dark"; the observer watches
// a 1px band at the navbar's own centre line, so the switch happens exactly as
// a slab edge crosses under it.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";

const BAND_Y = 28; // the navbar's centre line within a 56px bar

/**
 * @param active   pause tracking (the menu forces its own tone while open)
 * @param initialDark what to assume before the observer's first callback — and
 *   what to keep on a route with no dark sections at all, where the observer
 *   never fires. Getting this wrong paints white text on a white page, which is
 *   exactly what /uses did when it defaulted to dark.
 */
export default function useGroundTone(active = true, initialDark = false) {
  const [dark, setDark] = useState(initialDark);

  useEffect(() => {
    if (!active) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-ground="dark"]'),
    );
    if (!targets.length) return;

    const overlapping = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) overlapping.add(e.target);
          else overlapping.delete(e.target);
        }
        setDark(overlapping.size > 0);
      },
      {
        // collapse the viewport to a 1px line at the navbar's centre
        rootMargin: `-${BAND_Y}px 0px -${Math.max(0, window.innerHeight - BAND_Y - 1)}px 0px`,
        threshold: 0,
      },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [active]);

  return dark;
}

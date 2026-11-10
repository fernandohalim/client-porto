"use client";

import { useEffect, useRef, useState } from "react";
import { PERSON } from "@/content/portfolio";
import { prefersReducedMotion } from "@/lib/layout";

// one slat per section of the site, in order
const SLATS = ["Intro", "About", "Work", "Stack", "Experience", "Freelance", "Contact"];

// it never shows for less than this, however fast the pictures arrive
const MIN_TIME = 2000;
// and never holds the door shut longer than this on a bad connection
const MAX_WAIT = 15000;

// The screen a visit opens on: seven slats, one per section, filling from the floor in
// turn as the pictures arrive, under a counter. At a hundred the counter leaves and the
// slats lift away one after another, onto a page whose pictures are all loaded and
// decoded, so nothing pops in later.
//
// It's in the server's HTML, so it covers the page from the first paint; `loading` on
// <html> (set in layout.tsx) holds the page's own entrance back until it has lifted.
export default function Loader() {
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const fills = [...el.querySelectorAll<HTMLElement>(".loader-fill")];
    const slats = [...el.querySelectorAll<HTMLElement>(".loader-slat")];
    const digits = [...el.querySelectorAll<HTMLElement>(".loader-digit")];
    let cancelled = false;
    let frame = 0;

    // every picture on the page is fetched now and decoded, rather than as it scrolls in
    const pictures = [...document.querySelectorAll<HTMLImageElement>("main img")];
    const total = pictures.length + 1;
    let ready = 0;
    const mark = () => {
      ready += 1;
    };
    for (const img of pictures) {
      img.loading = "eager";
      const decoded = () => img.decode().catch(() => {}).then(mark);
      if (img.complete) decoded();
      else {
        img.addEventListener("load", decoded, { once: true });
        img.addEventListener("error", mark, { once: true });
      }
    }
    document.fonts.ready.then(mark);

    const finish = () => {
      html.classList.remove("loading");
      // the page's own entrance starts now (Effects.tsx)
      window.dispatchEvent(new Event("site-ready"));
    };

    const leave = async () => {
      if (prefersReducedMotion()) {
        finish();
        setGone(true);
        return;
      }
      // the words rise out of their masks first, then the slats lift, left to right
      const words = [...el.querySelectorAll<HTMLElement>("[data-leave]")].map((word) =>
        word.animate([{ transform: "translateY(-110%)" }], {
          duration: 520,
          easing: "cubic-bezier(0.6, 0, 0.4, 1)",
          fill: "forwards",
        }),
      );
      await Promise.all(words.map((a) => a.finished)).catch(() => {});
      if (cancelled) return;
      el.style.pointerEvents = "none";
      finish();
      const lifts = slats.map((slat, i) =>
        slat.animate([{ transform: "translateY(-101%)" }], {
          duration: 1000,
          delay: i * 70,
          easing: "cubic-bezier(0.7, 0, 0.2, 1)",
          fill: "forwards",
        }),
      );
      await Promise.all(lifts.map((a) => a.finished)).catch(() => {});
      if (!cancelled) setGone(true);
    };

    const began = performance.now();
    let before = began;
    let shown = 0;
    const tick = (now: number) => {
      const elapsed = now - began;
      const loaded = elapsed > MAX_WAIT ? 1 : ready / total;
      // whichever is further behind sets the pace: the clock, or the pictures
      const target = Math.min(elapsed / MIN_TIME, loaded, 1);
      shown += (target - shown) * (1 - Math.exp(-0.012 * Math.min(now - before, 64)));
      before = now;
      if (target === 1 && shown > 0.995) shown = 1;

      const text = String(Math.round(shown * 100)).padStart(3, "0");
      digits.forEach((digit, i) => {
        if (digit.textContent !== text[i]) digit.textContent = text[i];
      });
      fills.forEach((fill, i) => {
        const level = Math.max(0, Math.min(1, shown * fills.length - i));
        fill.style.transform = `scaleY(${level.toFixed(3)})`;
        slats[i].toggleAttribute("data-lit", level > 0);
      });

      if (shown === 1) leave();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading">
      {SLATS.map((name, i) => (
        <div key={name} aria-hidden className="loader-slat">
          <i className="loader-fill" />
          <p className="loader-tag label">
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span className="loader-name">{name}</span>
          </p>
        </div>
      ))}

      <p aria-hidden className="loader-count">
        <span data-leave>
          {[0, 1, 2].map((i) => (
            <span key={i} className="loader-digit">
              0
            </span>
          ))}
        </span>
      </p>

      <p aria-hidden className="loader-note label">
        <span data-leave>
          {PERSON.name}
          <br />
          Portfolio — {new Date().getFullYear()}
        </span>
      </p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { HORIZONTAL_QUERY, prefersReducedMotion } from "@/lib/layout";

// Share of the distance from the section start that a heading drifts by. It sits
// exactly in place once its section reaches the left edge.
const HEADING_DRIFT = 0.07;

// Share of its own width a picture pans by at either edge of the window. Must stay
// under the spare width .slat-plate keeps beyond an open slat (--travel in globals.css).
const PLATE_PAN = 0.1;

// Share of the scroll distance the mist moves by, so it reads as far away.
const MIST_DRIFT = 0.05;

// Two layers against the page: pictures pan inside their slats, headings run
// slightly ahead of the text around them. Sideways layout only, and off for
// anyone who prefers reduced motion.
export default function Parallax() {
  useEffect(() => {
    const layout = window.matchMedia(HORIZONTAL_QUERY);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const plates = [...document.querySelectorAll<HTMLElement>(".slat-plate")];
    const headings = [...document.querySelectorAll<HTMLElement>("[data-drift]")];
    const mists = [...document.querySelectorAll<HTMLElement>(".mist-track")];
    const far = document.querySelector<HTMLElement>(".far-name");
    let frame = 0;
    let wasLite = false;

    const update = () => {
      frame = 0;
      if (!layout.matches || prefersReducedMotion()) {
        for (const el of [...plates, ...headings, ...mists]) el.style.transform = "";
        return;
      }

      // The light version keeps only the headings moving: the pictures and the mist are
      // let go once, and after that they aren't measured or moved at all.
      const lite = document.documentElement.classList.contains("lite");
      if (lite && !wasLite) {
        for (const el of [...plates, ...mists]) el.style.transform = "";
      }
      wasLite = lite;
      const moving = lite ? [] : plates;

      const vw = window.innerWidth;
      // read everything first, then write, so a frame never forces a second layout
      const pans = moving.map((plate) => {
        const card = plate.parentElement!;
        const box = card.getBoundingClientRect();
        const from = (box.left + box.width / 2 - vw / 2) / (vw / 2);
        return -Math.max(-1, Math.min(1, from)) * plate.offsetWidth * PLATE_PAN;
      });
      const drifts = headings.map((heading) => {
        const left = heading.closest("section")!.getBoundingClientRect().left;
        return Math.max(-vw, Math.min(vw, left)) * HEADING_DRIFT;
      });

      // the far plane crosses the window once over the whole page; the mist barely moves
      const scrolled = window.scrollX + window.scrollY;
      const range = document.documentElement.scrollWidth - vw;
      const farX = far ? -(scrolled / Math.max(range, 1)) * Math.max(far.offsetWidth - vw, 0) : 0;
      if (far && !lite) far.style.transform = `translate3d(${farX.toFixed(1)}px, 0, 0)`;
      for (const track of lite ? [] : mists) {
        const tile = Number(track.dataset.tile);
        track.style.transform = `translate3d(${(-(scrolled * MIST_DRIFT) % tile).toFixed(1)}px, 0, 0)`;
      }

      moving.forEach((el, i) => {
        el.style.transform = `translate3d(${pans[i].toFixed(1)}px, 0, 0)`;
      });
      headings.forEach((el, i) => {
        el.style.transform = `translate3d(${drifts[i].toFixed(1)}px, 0, 0)`;
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // a slat changing width moves its neighbours, so their pans follow along
    const resized = new ResizeObserver(schedule);
    plates.forEach((plate) => resized.observe(plate.parentElement!));

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    layout.addEventListener("change", schedule);
    motion.addEventListener("change", schedule);

    return () => {
      cancelAnimationFrame(frame);
      resized.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      layout.removeEventListener("change", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import { HORIZONTAL_QUERY } from "@/lib/layout";
import { GROUNDS } from "@/lib/palette";

// Two quiet things: content eases in the first time it's seen, and the background
// changes colour as each section arrives.
export default function Effects() {
  useEffect(() => {
    const backdrop = document.querySelector<HTMLElement>(".atmosphere");
    const layout = window.matchMedia(HORIZONTAL_QUERY);

    const sections = [...document.querySelectorAll<HTMLElement>("section[id]")];
    let ground = "";
    const updateGround = () => {
      const horizontal = layout.matches;
      const line = (horizontal ? window.innerWidth : window.innerHeight) * 0.55;
      let current = "hero";
      for (const s of sections) {
        const box = s.getBoundingClientRect();
        if ((horizontal ? box.left : box.top) <= line) current = s.id;
      }
      if (current === ground) return;
      ground = current;
      if (backdrop) backdrop.style.backgroundColor = GROUNDS[current] ?? GROUNDS.hero;
    };
    updateGround();
    window.addEventListener("scroll", updateGround, { passive: true });
    window.addEventListener("resize", updateGround);

    const reveals = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          reveals.unobserve(e.target);
        }
      },
      { threshold: 0.1 },
    );
    // behind the loading screen nothing would be seen arriving, so the entrance waits
    // until it lifts (Loader.tsx)
    const enter = () => document.querySelectorAll(".reveal").forEach((el) => reveals.observe(el));
    if (document.documentElement.classList.contains("loading")) {
      window.addEventListener("site-ready", enter, { once: true });
    } else enter();

    // A device can be slow without saying so. While the page is being scrolled the
    // frames are timed, and if too many run long the site drops to its light version
    // (`.lite` in globals.css) for the rest of the visit. A few clean runs and it stops
    // checking.
    const root = document.documentElement;
    let watching = !root.classList.contains("lite");
    let timer = 0;
    let before = 0;
    let scrolledAt = 0;
    let frames = 0;
    let long = 0;
    let passes = 0;
    const time = (now: number) => {
      timer = 0;
      const gap = before ? now - before : 0;
      before = now;
      // a gap this long is a hidden tab or a pause, not a slow frame
      if (gap > 0 && gap < 250) {
        frames += 1;
        if (gap > 34) long += 1;
      }
      if (frames >= 90) {
        if (long / frames > 0.3) {
          watching = false;
          root.classList.add("lite");
          try {
            sessionStorage.setItem("lite", "1");
          } catch {}
          // the parallax lets go of the pictures on its next pass
          window.dispatchEvent(new Event("resize"));
        } else if (++passes >= 3) {
          watching = false;
        }
        frames = long = 0;
      }
      if (watching && now - scrolledAt < 150) timer = requestAnimationFrame(time);
      else before = 0;
    };
    const onScroll = () => {
      if (!watching) return;
      scrolledAt = performance.now();
      if (!timer) timer = requestAnimationFrame(time);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("site-ready", enter);
      cancelAnimationFrame(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", updateGround);
      window.removeEventListener("resize", updateGround);
      reveals.disconnect();
    };
  }, []);

  return null;
}

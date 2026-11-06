"use client";

import { useEffect } from "react";
import { registerGlide } from "@/lib/glide";
import { HORIZONTAL_QUERY, prefersReducedMotion } from "@/lib/layout";

// how quickly the page closes the gap to where it's headed, per millisecond
const RATE = 0.0065;

// The page is a real horizontal document, so tabbing, touch, arrow keys and
// screen readers all work on their own. This adds the glide: the wheel, page
// keys and section links all aim at a target the scroll position eases toward.
export default function HorizontalScroll() {
  useEffect(() => {
    const layout = window.matchMedia(HORIZONTAL_QUERY);
    let frame = 0;
    let last = 0;
    let pos = window.scrollX;
    let target = pos;
    let rate = RATE;

    const blocked = () => !layout.matches || !!document.querySelector("dialog[open]");
    const clamp = (x: number) =>
      Math.max(0, Math.min(x, document.documentElement.scrollWidth - window.innerWidth));

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) || 16;
      last = now;
      pos += (target - pos) * (1 - Math.exp(-rate * dt));
      if (Math.abs(target - pos) < 0.4) {
        pos = target;
        frame = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      window.scrollTo({ left: pos, behavior: "instant" });
    };

    const glideTo = (x: number, speed = RATE) => {
      target = clamp(x);
      rate = speed;
      if (prefersReducedMotion()) {
        window.scrollTo({ left: target, behavior: "instant" });
        return;
      }
      if (!frame) {
        pos = window.scrollX;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const from = () => (frame ? target : window.scrollX);

    const onWheel = (e: WheelEvent) => {
      if (blocked() || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerWidth : 1;
      glideTo(from() + e.deltaY * unit);
    };

    const onKey = (e: KeyboardEvent) => {
      if (blocked() || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const page = window.innerWidth * 0.85;
      const onControl = (e.target as Element).closest?.("a, button, input, textarea, select");
      let next: number | null = null;
      if (e.key === "PageDown" || (e.key === " " && !onControl && !e.shiftKey)) next = from() + page;
      else if (e.key === "PageUp" || (e.key === " " && !onControl)) next = from() - page;
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") next = from() + 220;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = from() - 220;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = document.documentElement.scrollWidth;
      if (next === null) return;
      e.preventDefault();
      glideTo(next);
    };

    // section links glide too, then hand focus over for keyboard users
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!link || link.pathname !== location.pathname) return;
      const section = document.getElementById(link.hash.slice(1));
      if (!section) return;
      e.preventDefault();
      history.pushState(null, "", link.hash);
      if (layout.matches) {
        glideTo(section.getBoundingClientRect().left + window.scrollX);
      } else {
        section.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" });
      }
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
    };

    registerGlide(glideTo);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      registerGlide(null);
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}

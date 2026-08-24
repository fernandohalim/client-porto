"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const isCaseStudy = pathname?.startsWith("/projects/");

  useEffect(() => {
    // case studies manage their own scroll behavior; respect reduced motion
    if (isCaseStudy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    // published so the menu can stop momentum before pushing the page shell
    // down — without this, an in-flight scroll keeps running underneath it
    window.__lenis = lenis;

    let rafId: number;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [isCaseStudy]);

  return null;
}

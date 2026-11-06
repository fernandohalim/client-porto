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
    document.querySelectorAll(".reveal").forEach((el) => reveals.observe(el));

    return () => {
      window.removeEventListener("scroll", updateGround);
      window.removeEventListener("resize", updateGround);
      reveals.disconnect();
    };
  }, []);

  return null;
}

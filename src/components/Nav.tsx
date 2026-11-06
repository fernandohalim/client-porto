"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONTACT, PERSON } from "@/content/portfolio";
import { HORIZONTAL_QUERY } from "@/lib/layout";

const LINKS = [
  { name: "About", id: "about" },
  { name: "Selected work", id: "work" },
  { name: "Stack", id: "stack" },
  { name: "Experience", id: "experience" },
  { name: "Freelance", id: "freelance" },
  { name: "Contact", id: "contact" },
];

const TICKS = Array.from({ length: 30 });

const CORNER_LINKS = [
  { name: "Email", href: `mailto:${PERSON.email}` },
  ...CONTACT.links.filter((l) => l.name === "LinkedIn" || l.name === "GitHub"),
];

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layout = window.matchMedia(HORIZONTAL_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      const horizontal = layout.matches;
      const line = (horizontal ? window.innerWidth : window.innerHeight) * 0.4;
      let current: string | null = null;
      for (const { id } of LINKS) {
        const box = document.getElementById(id)?.getBoundingClientRect();
        if (box && (horizontal ? box.left : box.top) <= line) current = id;
      }
      setActive(current);

      const range = document.documentElement.scrollWidth - window.innerWidth;
      const progress = range > 0 ? window.scrollX / range : 0;
      marker.current?.style.setProperty("--progress", String(progress));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <header className="label flex flex-wrap items-start justify-between gap-x-8 gap-y-4 p-5 h-scroll:fixed h-scroll:inset-x-0 h-scroll:top-0 h-scroll:z-10 h-scroll:px-8 h-scroll:py-6">
        <Link href="/" className="brand">
          {PERSON.name}
        </Link>

        <div aria-hidden className="relative hidden h-4 gap-1.25 lg:flex">
          {TICKS.map((_, i) => (
            <span key={i} className="w-px bg-rule" />
          ))}
          <span
            ref={marker}
            className="absolute -inset-y-0.5 left-0 w-7 border border-fg bg-ground"
            style={{ transform: "translateX(calc(var(--progress, 0) * 146px))" }}
          />
        </div>

        <nav aria-label="Sections">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {LINKS.map((l) => (
              <li key={l.id}>
                {/* plain anchors: Next's Link aligns a section to its nearest
                    edge, which on a sideways page may not be its start */}
                <a
                  href={`/#${l.id}`}
                  aria-current={active === l.id ? "location" : undefined}
                  className="underline-offset-4 hover:underline aria-[current]:underline"
                >
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="label pointer-events-none fixed inset-x-0 bottom-0 z-10 hidden items-end justify-between px-8 py-5 h-scroll:flex">
        <p>
          {PERSON.role}
          <br />
          {PERSON.location}
        </p>
        <ul className="pointer-events-auto text-right">
          {CORNER_LINKS.map((l) => (
            <li key={l.name}>
              <a href={l.href} className="underline-offset-4 hover:underline">
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

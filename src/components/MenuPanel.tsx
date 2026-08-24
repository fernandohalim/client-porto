"use client";

// ─────────────────────────────────────────────────────────────────────────────
// MenuPanel — a top sheet.
//
// This replaces a push-down shell that scaled and translated the entire page.
// That version worked, but every hard problem it had came from moving the page:
// detaching it to position:fixed collapsed the document, which dropped the
// scroll position, desynced Lenis's internal scroll, and made the scrollbar
// vanish mid-animation. Three separate systems had to be talked back into
// agreement on every close.
//
// Keeping the page still removes all of it. The sheet slides down over the top
// edge, a scrim dims what's below, and nothing about the document changes —
// no transform, no reflow, no scroll to restore, nothing to desync.
//
// The three-column layout is unchanged, so it still reads the way the reference
// does; only the mechanism underneath is different.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;

const COLUMNS: { heading: string; links: { name: string; href: string }[] }[] = [
  {
    heading: "Work",
    links: [
      { name: "Selected work", href: "/#work" },
      { name: "Freelance", href: "/#freelance" },
      { name: "Stack", href: "/#stack" },
    ],
  },
  {
    heading: "Profile",
    links: [
      { name: "About", href: "/#about" },
      { name: "Experience", href: "/#experience" },
      { name: "Uses", href: "/uses" },
    ],
  },
  {
    heading: "Get in touch",
    links: [
      { name: "Contact", href: "/#contact" },
      { name: "Résumé", href: "/fernando_halim_cv.pdf" },
    ],
  },
];

const SOCIALS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/fernando-halimm" },
  { name: "GitHub", href: "https://github.com/fernandohalim" },
  { name: "WhatsApp", href: "https://wa.me/6289606366647" },
];

export default function MenuPanel({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  // Hold the page still while the sheet is down. Lenis handles it when smooth
  // scrolling is on; the wheel/touch guard covers the case where it is not —
  // visitors who prefer reduced motion never get a Lenis instance at all.
  //
  // Deliberately NOT `overflow: hidden` on the document: that removes the
  // scrollbar, which changes the page width and shifts every fixed element
  // sideways at the exact moment the sheet animates.
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    // let the guard through for gestures that start inside the sheet — on a
    // short phone it becomes its own scroll container, and blocking every
    // wheel/touch on the window would make its overflow unreachable
    const block = (e: Event) => {
      if (sheetRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.__lenis?.start();
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [open]);

  return (
    <>
      {/* ── scrim ── */}
      <motion.div
        aria-hidden
        onClick={onNavigate}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`fixed inset-0 z-[85] bg-coal/60 backdrop-blur-[2px] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      {/* ── the sheet ── */}
      <motion.div
        id="site-menu"
        ref={sheetRef}
        aria-hidden={!open}
        initial={false}
        animate={{ y: open ? "0%" : "-100%" }}
        transition={{ duration: 0.62, ease: EASE }}
        // data-lenis-prevent: Lenis swallows wheel events site-wide, which
        // would otherwise stop the sheet scrolling its own overflow.
        data-lenis-prevent
        // capped so the page always shows beneath it — a sheet that reaches
        // the bottom of the screen is just a fullscreen menu with extra steps.
        // 656px of content on a 667px phone left nothing visible at all.
        className="fixed inset-x-0 top-0 z-[88] max-h-[86svh] overflow-y-auto overscroll-contain rounded-b-[16px] bg-coal px-5 pb-8 pt-[76px] text-bone-2 md:max-h-none md:overflow-visible md:px-8 md:pb-11 md:pt-[84px]"
      >
        {/* One stack on mobile, three columns from md.
            A 2-up grid holding three columns leaves the last one alone on its
            own row with dead space beside it, which is what made the sheet read
            as lopsided — the third group looked adrift rather than aligned. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3 md:gap-y-9">
          {COLUMNS.map((col, ci) => (
            <div
              key={col.heading}
              className="border-t border-line-dark pt-5 first:border-t-0 first:pt-0 md:border-t-0 md:pt-0"
            >
              <span className="chip text-bone-2/40">{col.heading}</span>
              <ul className="mt-4 space-y-1">
                {col.links.map((l, i) => (
                  <li key={l.name} className="overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={
                        open ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }
                      }
                      transition={{
                        duration: 0.55,
                        delay: open ? 0.14 + (ci * 3 + i) * 0.03 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={l.href}
                        onClick={onNavigate}
                        tabIndex={open ? 0 : -1}
                        data-cursor="Go"
                        className="display inline-block text-[clamp(1.2rem,2.6vw,1.9rem)] transition-colors duration-300 hover:text-accent-soft"
                      >
                        {l.name}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.4, delay: open ? 0.36 : 0 }}
          className="mono-label mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line-dark pt-5 text-ash-2 md:mt-10"
        >
          <a
            href="mailto:fernandohalim26@gmail.com"
            tabIndex={open ? 0 : -1}
            className="transition-colors hover:text-bone-2"
          >
            fernandohalim26@gmail.com
          </a>
          <span className="flex gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="transition-colors hover:text-bone-2"
              >
                {s.name}
              </a>
            ))}
          </span>
        </motion.div>
      </motion.div>
    </>
  );
}

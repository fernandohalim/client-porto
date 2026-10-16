"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CaseStudyChrome — the shared shell for the five case studies.
//
// Each case study keeps its own bespoke interior and palette; what was NOT
// consistent was the chrome around it. Every page had grown its own "back to
// portfolio" pill — different radius, weight, border, hover — so crossing from
// one case study to another felt like leaving the site.
//
// These two pieces normalise that boundary in the new language (mono label,
// squared arrow tile, chip headings) while taking their colours from the host
// page, so nothing about each project's theme is overridden.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { motion } from "framer-motion";

export type CaseTheme = {
  fg: string; // primary text
  muted: string; // secondary text
  border: string; // hairline
  surface: string; // pill / card fill
  accent: string; // the project's own accent
};

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── the return pill, top of every case study ── */
export function CaseStudyBack({
  theme,
  className = "",
}: {
  theme: CaseTheme;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
      className={`mb-12 md:mb-16 ${className}`}
    >
      <Link
        href="/#work"
        data-cursor="Back to index"
        className="group inline-flex items-center gap-3 rounded-[5px] border py-[7px] pl-[7px] pr-4 transition-colors duration-300"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.surface,
          color: theme.muted,
        }}
      >
        <span
          className="relative grid h-[18px] w-[18px] place-items-center overflow-hidden rounded-[3px] transition-colors duration-300"
          style={{ backgroundColor: theme.accent, color: theme.surface }}
        >
          <span className="block transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-x-[140%]">
            <ArrowLeft />
          </span>
          <span className="absolute block translate-x-[140%] transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0">
            <ArrowLeft />
          </span>
        </span>
        <span
          className="mono-label pt-px transition-colors duration-300"
          style={{ color: theme.muted }}
        >
          <span className="group-hover:hidden">Back to index</span>
          <span
            className="hidden group-hover:inline"
            style={{ color: theme.fg }}
          >
            Back to index
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

/* ── next-project band, appended after each page's own outro ──
   Deliberately NOT a footer: every case study already ends with its own
   bespoke sign-off (version, socials, a closing line), and those are interior,
   not chrome. What none of them had was a way forward — reaching the end of a
   case study dead-ended you into the browser back button. This band is the
   missing piece and nothing else. */
export function CaseStudyNext({
  theme,
  next,
}: {
  theme: CaseTheme;
  next?: { name: string; href: string };
}) {
  return (
    <nav
      aria-label="Continue"
      className="border-t px-6 py-10 md:py-12"
      style={{ borderColor: theme.border }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {next ? (
          <Link
            href={next.href}
            data-cursor="Next case study"
            className="group flex items-baseline gap-4"
          >
            <span
              className="chip shrink-0"
              style={{ color: theme.muted, borderColor: theme.border }}
            >
              Next
            </span>
            <span
              className="display text-[clamp(1.5rem,4vw,2.6rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
              style={{ color: theme.fg }}
            >
              {next.name}
              <span style={{ color: theme.accent }}>.</span>
            </span>
          </Link>
        ) : (
          <span className="flex items-baseline gap-4">
            <span
              className="chip shrink-0"
              style={{ color: theme.muted, borderColor: theme.border }}
            >
              End of index
            </span>
            <span
              className="display text-[clamp(1.5rem,4vw,2.6rem)]"
              style={{ color: theme.fg }}
            >
              That&rsquo;s the last one
              <span style={{ color: theme.accent }}>.</span>
            </span>
          </span>
        )}

        <Link
          href="/#work"
          data-cursor="All work"
          className="group inline-flex shrink-0 items-center gap-3 self-start rounded-[5px] py-[7px] pl-4 pr-[7px] transition-opacity duration-300 hover:opacity-90 sm:self-auto"
          style={{ backgroundColor: theme.accent, color: theme.surface }}
        >
          <span className="mono-label pt-px">All work</span>
          <span
            className="relative grid h-[18px] w-[18px] place-items-center overflow-hidden rounded-[3px]"
            style={{ backgroundColor: theme.surface, color: theme.accent }}
          >
            <span className="block transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[140%]">
              <ArrowRight />
            </span>
            <span className="absolute block -translate-x-[140%] transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0">
              <ArrowRight />
            </span>
          </span>
        </Link>
      </div>
    </nav>
  );
}

function ArrowLeft() {
  return (
    <svg width="7" height="7" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M7 4H1M3.5 1.5 1 4l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="7" height="7" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M1 4h6M4.5 1.5 7 4 4.5 6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

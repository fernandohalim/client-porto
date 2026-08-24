"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Freelance — S.05, commissioned work, on white.
//
// This is the reference's partner roll: a vertical list where every entry fades
// to almost nothing except the one crossing the centre band, which resolves to
// full black and opens its detail. It suits client work far better than the
// card grid does — most of these have no screenshot worth showing, and the
// thing that actually matters per row is the status verb (live / internal /
// pre-launch / discontinued) and whether there's a URL behind it.
//
// Each row measures its own traversal, so the focus is genuinely scroll-linked
// rather than an intersection toggle — entries brighten and dim continuously.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionMark from "@/utilities/SectionMark";
import ScrollFill from "@/utilities/ScrollFill";
import FocusRails from "@/utilities/FocusRails";

type Kind = "live" | "internal" | "prelaunch" | "archived";

type Client = {
  title: string;
  blurb: string;
  stack: string[];
  year: string;
  kind: Kind;
  href?: string;
};

const CLIENTS: Client[] = [
  {
    title: "The Forestine",
    blurb: "Property marketing site for PT Ciputra Development Tbk",
    stack: ["Next", "Tailwind"],
    year: "2026",
    kind: "live",
    href: "https://forestine.id",
  },
  {
    title: "Handy and Sharon",
    blurb: "Wedding invitation site with RSVP handling",
    stack: ["Next", "Firestore"],
    year: "2026",
    kind: "live",
    href: "https://handpickedforshar.com",
  },
  {
    title: "Nenggala Academy",
    blurb: "Student portal and marketing site",
    stack: ["Next", "Express"],
    year: "2026",
    kind: "prelaunch",
  },
  {
    title: "PT Maju Jaya Arkananta",
    blurb: "Company profile and catalogue website with CMS",
    stack: ["CRA", "Go"],
    year: "2024",
    kind: "live",
    href: "https://hydraulicpump.co.id",
  },
  {
    title: "PT Jasplast Sukses Bersama",
    blurb: "Internal financial record system",
    stack: ["CRA", "Express"],
    year: "2024",
    kind: "internal",
  },
  {
    title: "PT Argotehnik Kreasindo Abadi",
    blurb: "Web-based operational ERP",
    stack: ["CRA", "Express"],
    year: "2024",
    kind: "internal",
  },
  {
    title: "Rawa Belong Florist Community",
    blurb: "Marketplace mobile application and website",
    stack: ["Flutter", "Express"],
    year: "2023",
    kind: "archived",
  },
  {
    title: "PT Loyalty Development — LeSeen",
    blurb: "Company profile website",
    stack: ["CRA", "Tailwind"],
    year: "2023",
    kind: "archived",
  },
];

const STATUS: Record<Kind, { label: string; tone: string }> = {
  live: { label: "Live", tone: "text-accent-deep" },
  internal: { label: "Internal only", tone: "text-mute" },
  prelaunch: { label: "Pre-launch", tone: "text-mute" },
  archived: { label: "Discontinued", tone: "text-faint-2" },
};

function Row({ c }: { c: Client }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 0 at the viewport edges → 1 across the centre band
  const focus = useTransform(
    scrollYProgress,
    [0.18, 0.42, 0.58, 0.82],
    [0, 1, 1, 0],
  );
  const nameOpacity = useTransform(focus, [0, 1], [0.08, 1]);
  const metaOpacity = useTransform(focus, [0.55, 1], [0, 1]);
  const metaY = useTransform(focus, [0.55, 1], [10, 0]);

  const status = STATUS[c.kind];

  const body = (
    <div className="flex flex-col items-center py-7 text-center md:py-9">
      <motion.h3
        style={{ opacity: nameOpacity }}
        className="display text-[clamp(1.6rem,5.2vw,3.6rem)] transition-colors duration-300 group-hover:text-accent"
      >
        {c.title}
      </motion.h3>

      <motion.div
        style={{ opacity: metaOpacity, y: metaY }}
        className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1"
      >
        <span className="text-[13px] text-mute">{c.blurb}</span>
        <span className="mono-label text-faint-2">{c.stack.join(" · ")}</span>
        <span className={`mono-label ${status.tone}`}>{status.label}</span>
        <span className="mono-label text-faint-2">{c.year}</span>
      </motion.div>
    </div>
  );

  return (
    <div ref={ref} className="border-b border-line last:border-b-0">
      {c.href ? (
        <Link
          href={c.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Visit site"
          className="group block"
        >
          {body}
        </Link>
      ) : (
        <div data-cursor={status.label} className="group block">
          {body}
        </div>
      )}
    </div>
  );
}

export default function Freelance() {
  return (
    <section
      id="freelance"
      className="relative scroll-mt-20 bg-white py-20 md:py-28"
    >
      <div className="px-5 md:px-8">
        <div className="flex gap-4 md:gap-7">
          <SectionMark no="05" name="Freelance" className="mt-2" />
          <ScrollFill
            text="Commissioned work for studios, developers and small businesses — delivered end to end, from system design through deployment."
            className="max-w-[22ch] md:max-w-[26ch]"
          />
        </div>
      </div>

      <div className="relative mt-16 md:mt-24">
        <FocusRails />
        <div className="px-5 md:px-8">
          {CLIENTS.map((c) => (
            <Row key={c.title} c={c} />
          ))}
        </div>
      </div>

      <p className="mono-label mt-12 px-5 text-center text-mute md:px-8">
        {CLIENTS.length} commissions — {CLIENTS.filter((c) => c.href).length}{" "}
        still live
      </p>
    </section>
  );
}

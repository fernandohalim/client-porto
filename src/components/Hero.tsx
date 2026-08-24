"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Hero — full-bleed dark plate.
//
// The previous hero was a HUD: live timecode, cursor position readout, a REC
// dot, a scroll-driven invert. All of that belonged to the film register and
// is gone. What replaces it is the reference's structure — a photographic
// plate under a heavy coal wash, the statement set bottom-left in sentence
// case, one mono stat floating mid-right, and two preview cards docked
// bottom-right as the first thing you can actually click.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

function PreviewCard({
  href,
  src,
  label,
  alt,
  delay,
}: {
  href: string;
  src: string;
  label: string;
  alt: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: EASE }}
    >
      <Link
        href={href}
        data-cursor={label}
        data-cursor-snap
        className="group relative block w-full overflow-hidden rounded-card border border-white/15 sm:w-[200px]"
      >
        <div className="relative aspect-[45/28] overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <span className="absolute inset-0 bg-coal/25 transition-colors duration-500 group-hover:bg-coal/10" />
        </div>
        <div className="flex items-center justify-between gap-2 bg-coal/85 px-2.5 py-2 backdrop-blur-sm">
          <span className="mono-label text-bone-2">{label}</span>
          <span className="grid h-[15px] w-[15px] place-items-center rounded-[2px] bg-white text-coal">
            <svg width="6" height="6" viewBox="0 0 8 8" fill="none" aria-hidden>
              <path
                d="M1 4h6M4.5 1.5 7 4 4.5 6.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // the plate drifts slightly slower than the page — enough to feel weighted,
  // not enough to read as a parallax trick
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      data-ground="dark"
      className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-coal text-bone-2"
    >
      {/* ── photographic plate ── */}
      <motion.div
        style={{ y: plateY, scale: plateScale }}
        className="absolute inset-0 -z-10"
        aria-hidden
      >
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* heavy wash so the statement always clears contrast regardless of
            which photograph ends up here */}
        <span className="absolute inset-0 bg-coal/62" />
        <span className="absolute inset-0 bg-gradient-to-t from-coal via-coal/35 to-coal/70" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="flex h-full flex-col justify-end px-5 pb-8 md:px-8 md:pb-10"
      >
        {/* ── mono stat, floating mid-right ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mono-label absolute right-5 top-1/2 hidden -translate-y-1/2 text-right text-bone-2/70 md:block"
        >
          <span className="block text-bone-2/45">In production</span>
          <span className="mt-1 block text-bone-2">17 projects shipped</span>
        </motion.div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          {/* ── the statement ── */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
              className="mono-label mb-5 text-bone-2/55"
            >
              Fernando Halim — Fullstack developer
            </motion.p>

            <h1 className="display text-[clamp(2.1rem,6.4vw,5.1rem)]">
              {["Real-time fraud systems", "by day. Products I own"].map(
                (line, i) => (
                  <span key={line} className="block overflow-hidden">
                    <motion.span
                      initial={{ y: "108%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        delay: 0.25 + i * 0.09,
                        duration: 0.95,
                        ease: EASE,
                      }}
                      className="block will-change-transform"
                    >
                      {line}
                    </motion.span>
                  </span>
                ),
              )}
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "108%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.43, duration: 0.95, ease: EASE }}
                  className="block will-change-transform"
                >
                  after hours<span className="text-accent">.</span>
                </motion.span>
              </span>
            </h1>
          </div>

          {/* ── preview cards ──
              an explicit 2-col grid on mobile: two 46vw flex children plus the
              gap and the page gutter exceed 100vw, and flex resolves that by
              shrinking them unequally. 1fr/1fr cannot drift. */}
          <div className="grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:shrink-0">
            <PreviewCard
              href="/#work"
              src="/images/hero-card-work.jpg"
              label="Selected work"
              alt="Preview of selected work"
              delay={1.0}
            />
            <PreviewCard
              href="/#contact"
              src="/images/hero-card-contact.jpg"
              label="Get in touch"
              alt="Preview of the contact section"
              delay={1.12}
            />
          </div>
        </div>
      </motion.div>

      {/* ── availability, bottom-left of the frame ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25, duration: 0.7 }}
        style={{ opacity: fade }}
        className="mono-label pointer-events-none absolute bottom-8 left-5 hidden items-center gap-2 text-bone-2/70 md:left-8 lg:flex"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        Available for work
      </motion.div>
    </section>
  );
}

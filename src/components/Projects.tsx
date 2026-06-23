"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { Chars } from "@/utilities/TextReveal";
import Link from "next/link";

type Entry = {
  no: string;
  title: string;
  kind: string;
  year: string;
  meta: string;
  live?: boolean;
  href?: string; // case-study route
  crossfade?: string; // bg for the route transition
  img?: string;
};

const FEATURED: Entry[] = [
  {
    no: "01",
    title: "NEST",
    kind: "Case Study",
    year: "2026",
    meta: "AI receipt scanning · settlement engine",
    href: "/projects/nest",
    crossfade: "#fdfbf7",
    img: "/work-nest.png",
  },
  {
    no: "02",
    title: "NOTED",
    kind: "Case Study",
    year: "2026",
    meta: "Offline-first markdown · 3-way merge",
    href: "/projects/noted",
    crossfade: "#0a0a0a",
    img: "/work-noted.png",
  },
  {
    no: "03",
    title: "Piggy Wallet",
    kind: "Case Study",
    year: "2026",
    meta: "Offline-first expense tracker · budget system",
    href: "/projects/piggy-wallet",
    crossfade: "#f5f4fb",
    img: "/work-piggy.png",
  },
];

const PERSONAL: Entry[] = [
  {
    no: "01",
    title: "PIXELEMOJI",
    kind: "Product",
    year: "2026",
    meta: "Emoji to pixel art converter · customizeable",
    href: "https://pixelemoji-delta.vercel.app/",
  },
  {
    no: "02",
    title: "PIXELIMAGE",
    kind: "Product",
    year: "2026",
    meta: "Image to pixel art converter · customizeable",
    href: "https://pixelimage.vercel.app/",
  },
];

const CLIENTS: Entry[] = [
  {
    no: "01",
    title: "PT Maju Jaya Arkananta",
    kind: "Company profile and catalogue website with CMS",
    year: "2024",
    meta: "Express · Node",
    live: true,
  },
  {
    no: "02",
    title: "PT Jasplast Sukses Bersama",
    kind: "Financial record website",
    year: "2024",
    meta: "React · Express · Node",
    live: true,
  },
  {
    no: "03",
    title: "PT Argotehnik Kreasindo Abadi",
    kind: "Web-based operational ERP",
    year: "2024",
    meta: "React · Material UI · Node",
    live: true,
  },
  {
    no: "04",
    title: "Rawa Belong Florist Community",
    kind: "Marketplace mobile application and website",
    year: "2023",
    meta: "React · Flutter · Node",
  },
  {
    no: "05",
    title: "LeSeen Electronics",
    kind: "Company profile website",
    year: "2023",
    meta: "React · Node · Material UI",
  },
];

export default function Projects() {
  const router = useRouter();
  const [crossfade, setCrossfade] = useState<{ bg: string } | null>(null);
  const [active, setActive] = useState<Entry | null>(null);

  // cursor-chasing preview card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.5 });
  const py = useSpring(my, { stiffness: 220, damping: 24, mass: 0.5 });

  const handleCaseStudyClick = (href: string, bg: string) => () => {
    setCrossfade({ bg });
    setTimeout(() => {
      document.documentElement.classList.remove("scroll-smooth");
      const layout = document.getElementById("global-layout");
      if (layout) {
        layout.style.transition = "none";
        layout.style.backgroundColor = bg;
      }
      window.scrollTo(0, 0);
      router.push(href, { scroll: false });
      setTimeout(
        () => document.documentElement.classList.add("scroll-smooth"),
        500,
      );
    }, 500);
  };

  return (
    <section
      id="work"
      className="relative py-20 md:py-28 scroll-mt-24"
      onMouseMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
      onMouseLeave={() => setActive(null)}
    >
      {crossfade &&
        typeof window !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ backgroundColor: crossfade.bg }}
            className="fixed inset-0 z-[99999] pointer-events-none"
          />,
          document.body,
        )}

      {/* floating preview — desktop only */}
      <div className="hidden md:block">
        <motion.div
          style={{ x: px, y: py }}
          className="fixed top-0 left-0 z-30 pointer-events-none"
        >
          <AnimatePresence mode="popLayout">
            {active && (
              <motion.div
                key={active.no}
                initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 2 }}
                exit={{
                  scale: 0.7,
                  opacity: 0,
                  transition: { duration: 0.12, ease: "easeIn" },
                }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className="relative w-[320px] aspect-video -translate-x-1/2 -translate-y-[115%] overflow-hidden shadow-2xl shadow-ink/30"
              >
                <Image
                  src={active.img!}
                  alt={active.title}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 mono-label bg-coal/80 text-bone px-2.5 py-1.5">
                  {active.title} — {active.year}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* heading */}
      <div className="px-5 md:px-8 pb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="display text-ink text-[clamp(3rem,9vw,8rem)]">
          <Chars text="INDEX" stagger={0.05} />
        </h2>
        <span className="mono-label text-smoke pb-3">Selected work</span>
      </div>

      {/* featured releases */}
      {FEATURED.map((e, i) => (
        <div
          key={e.no}
          onClick={handleCaseStudyClick(e.href!, e.crossfade!)}
          onMouseEnter={() => setActive(e)}
          onMouseLeave={() => setActive(null)}
          data-cursor="View"
          className={`group relative overflow-hidden border-t border-line ${i === FEATURED.length - 1 ? "border-b" : ""}`}
        >
          {/* dark flood on hover */}
          <span className="absolute inset-0 bg-coal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          <div className="relative z-10 px-5 md:px-8 py-8 md:py-12 grid grid-cols-12 items-baseline gap-x-3 gap-y-3 md:gap-y-2 transition-colors duration-500 group-hover:text-bone">
            <span className="col-span-2 md:col-span-1 font-mono text-xs text-smoke transition-colors duration-500 group-hover:text-accent">
              {e.no}
            </span>
            <h3 className="col-span-10 md:col-span-9 md:whitespace-nowrap display text-[clamp(2.6rem,7vw,6rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4">
              {e.title}
            </h3>

            {/* mobile-only caption — stands in for the desktop hover preview */}
            <p className="col-span-10 col-start-3 md:hidden font-mono text-[11px] leading-[1.7] text-smoke transition-colors duration-500 group-hover:text-ash">
              {e.meta}
            </p>

            <div className="col-span-10 col-start-3 md:col-span-2 md:col-start-auto flex justify-between md:justify-end items-baseline gap-x-6 mono-label text-smoke transition-colors duration-500 group-hover:text-ash">
              <span className="md:hidden">{e.kind}</span>
              <span className="flex items-baseline gap-x-6">
                <span>{e.year}</span>
                <span className="text-accent">→</span>
              </span>
            </div>
          </div>
        </div>
      ))}

      {PERSONAL.map((e, i) => (
        <Link
          href={e.href || "#"}
          key={e.no}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div
            key={e.no}
            data-cursor="Visit"
            className={`group relative overflow-hidden border-b border-line`}
          >
            {/* same flood language as the featured releases */}
            <span className="absolute inset-0 bg-coal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <div className="relative z-10 px-5 md:px-8 py-5 grid grid-cols-12 items-baseline gap-x-3 gap-y-2 md:gap-y-1 transition-colors duration-500 group-hover:text-bone">
              <span className="col-span-2 md:col-span-1 font-mono text-xs text-ash transition-colors duration-500 group-hover:text-accent">
                {e.no}
              </span>
              <h3 className="col-span-10 md:col-span-6 display font-semibold text-[clamp(1.5rem,3.4vw,2.4rem)] text-ink/80 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-bone">
                {e.title}
              </h3>

              {/* mobile-only caption */}
              <p className="col-span-10 col-start-3 md:hidden font-mono text-[11px] leading-[1.7] text-smoke transition-colors duration-500 group-hover:text-ash">
                {e.meta}
              </p>

              <div className="col-span-10 col-start-3 md:col-span-5 md:col-start-auto flex justify-between md:justify-end items-center gap-x-6 mono-label text-smoke transition-colors duration-500 group-hover:text-ash">
                <span className="md:hidden">{e.kind}</span>
                <span className="flex items-center gap-x-6">
                  <span>{e.year}</span>
                  <span className="text-accent">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* client sub-index */}
      <p className="mono-label text-smoke px-5 md:px-8 mt-20 mb-2">
        Also produced — freelances
      </p>
      {CLIENTS.map((e, i) => (
        <div
          key={e.no}
          data-cursor={e.live ? "Live" : "Archived"}
          className={`group relative overflow-hidden border-t border-line ${i === CLIENTS.length - 1 ? "border-b" : ""}`}
        >
          {/* same flood language as the featured releases */}
          <span className="absolute inset-0 bg-coal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          <div className="relative z-10 px-5 md:px-8 py-5 grid grid-cols-12 items-baseline gap-x-3 gap-y-2 md:gap-y-1 transition-colors duration-500 group-hover:text-bone">
            <span className="col-span-2 md:col-span-1 font-mono text-xs text-ash transition-colors duration-500 group-hover:text-accent">
              {e.no}
            </span>
            <h3 className="col-span-10 md:col-span-6 display font-semibold text-[clamp(1.5rem,3.4vw,2.4rem)] text-ink/80 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-bone">
              {e.title}
            </h3>

            {/* mobile-only caption (the build type) */}
            <p className="col-span-10 col-start-3 md:hidden font-mono text-[11px] leading-[1.7] text-smoke transition-colors duration-500 group-hover:text-ash">
              {e.kind}
            </p>

            <div className="col-span-10 col-start-3 md:col-span-5 md:col-start-auto flex items-center justify-between md:justify-end gap-x-6 mono-label text-smoke transition-colors duration-500 group-hover:text-ash">
              <span className="hidden md:inline">{e.kind}</span>
              <span className="flex items-center gap-x-4">
                <span className="md:hidden">
                  {e.live ? "Live" : "Archived"}
                </span>
                <span>{e.year}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${e.live ? "bg-accent" : "bg-ash"}`}
                />
              </span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

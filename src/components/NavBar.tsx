"use client";

// ─────────────────────────────────────────────────────────────────────────────
// NavBar — one fixed row, colour driven by the ground beneath it.
//
// The first version split the bar into a blended layer (wordmark, links) and an
// unblended one (the vermilion toggle, which mix-blend-difference would have
// inverted to teal). Two separately positioned fixed layers cannot share a flex
// row, so the reserved gap between "Search" and "Menu" was a guess — and it was
// wrong, which is exactly why those labels collided.
//
// Now everything sits in a single row and useGroundTone reports whether a dark
// slab is under the bar, so the row simply picks its own colours. Nothing
// overlaps because nothing is positioned independently any more.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import JakartaTime from "@/utilities/JakartaTime";
import useGroundTone from "@/utilities/useGroundTone";

const EASE = [0.76, 0, 0.24, 1] as const;

const QUICK = [
  { name: "Selected work", href: "/#work" },
  { name: "About", href: "/#about" },
  { name: "Stack", href: "/#stack" },
];

export default function Navbar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  // only the landing page opens on a dark plate; every other route starts
  // light, and a route with no dark sections keeps that value for good
  const pathname = usePathname();
  const overDark = useGroundTone(!open, pathname === "/");
  // the menu panel is coal, so an open menu is always a dark ground
  const dark = open || overDark;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const fg = dark ? "text-white" : "text-ink";
  // written out rather than interpolated — Tailwind only ships classes it can
  // see as complete strings, so `hover:${fg}` would never be generated
  const dim = dark
    ? "text-white/55 hover:text-white"
    : "text-ink/50 hover:text-ink";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[95] h-14 transition-colors duration-300 ${fg}`}
    >
      {/* Three tracks, not justify-between: the wordmark and the right cluster
          are different widths, so space-between puts the nav at the centre of
          the leftover gap rather than the centre of the viewport. Equal 1fr
          flanks make the middle track genuinely centred.

          Columns are assigned explicitly. The nav is display:none below md,
          which removes it from the grid flow entirely — with auto-placement the
          toggle then slid into the middle `auto` track and sat dead centre on
          mobile, with an empty 1fr stranded to its right. */}
      <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          data-cursor="Home"
          className="mono-label col-start-1 justify-self-start"
        >
          Fernando Halim<span className="align-super text-[8px]">®</span>
        </Link>

        <nav className="col-start-2 hidden items-center gap-7 md:flex">
          {QUICK.map((l) => (
            <a
              key={l.name}
              href={l.href}
              onClick={() => setOpen(false)}
              className="group relative mono-label whitespace-nowrap"
            >
              {l.name}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="col-start-3 flex items-center gap-4 justify-self-end sm:gap-6">
          <span className={`mono-label hidden lg:block ${dim}`}>
            <JakartaTime />
          </span>

          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            data-cursor="⌘K"
            className={`mono-label hidden transition-colors md:block ${dim}`}
          >
            Search
          </button>

          <button
            onClick={() => setOpen(!open)}
            data-cursor={open ? "Close" : "Open menu"}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="group flex items-center gap-2.5"
          >
            {/* fixed-width slot so swapping Menu/Close never reflows the row */}
            <span className="mono-label hidden w-[38px] text-right sm:block">
              {open ? "Close" : "Menu"}
            </span>
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-accent text-coal transition-transform duration-300 group-hover:scale-105">
              <span className="relative block h-[9px] w-[13px]">
                <motion.span
                  animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-current"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="absolute bottom-0 left-0 block h-[1.5px] w-full rounded-full bg-current"
                />
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

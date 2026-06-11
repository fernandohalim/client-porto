"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JakartaTime from "@/utilities/JakartaTime";

const LINKS = [
  { name: "Index", href: "/#work", no: "01" },
  { name: "About", href: "/#about", no: "02" },
  { name: "Stack", href: "/#stack", no: "03" },
  { name: "Uses", href: "/uses", no: "04" },
  { name: "Contact", href: "/#contact", no: "05" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // lock scroll while the overlay is up
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[90] mix-blend-difference text-[#f2f0ea]">
        <div className="flex items-center justify-between px-5 md:px-8 h-16">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="mono-label"
            data-cursor="Home"
          >
            Fernando Halim — ©2026
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {LINKS.slice(0, 3).map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="group relative mono-label"
              >
                {l.name}
                <span className="absolute left-0 -bottom-1 h-px w-full bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <span className="hidden sm:block mono-label opacity-70">
              <JakartaTime />
            </span>
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-command-palette"))
              }
              className="hidden md:block mono-label opacity-70 hover:opacity-100 transition-opacity"
              data-cursor="⌘K"
            >
              Search
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="mono-label"
              data-cursor={open ? "Close" : "Open"}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[80] bg-coal text-bone flex flex-col justify-end px-5 md:px-8 pb-10 pt-24"
          >
            <nav className="flex flex-col">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.name}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{
                    delay: 0.25 + i * 0.06,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-t border-bone/15"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    data-cursor="Go"
                    className="group flex items-baseline gap-5 py-3 md:py-4"
                  >
                    <span className="font-mono text-xs text-smoke">{l.no}</span>
                    <span className="display text-[clamp(2.6rem,9vw,6.5rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:text-accent">
                      {l.name}
                    </span>
                  </a>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-5 mono-label text-smoke"
            >
              <a
                href="mailto:fernandohalim26@gmail.com"
                className="hover:text-bone transition-colors"
              >
                fernandohalim26@gmail.com
              </a>
              <span className="flex gap-6">
                <a
                  href="https://github.com/fernandohalim"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bone transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/fernando-halimm"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bone transition-colors"
                >
                  LinkedIn
                </a>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

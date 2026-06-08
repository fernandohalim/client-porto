"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
    setIsOpen(false);
  };

  const sectionLinks = [
    { name: "Work", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled || isOpen
          ? "bg-paper/75 backdrop-blur-md border-b border-line py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        {/* mark */}
        <Link
          href="/"
          onClick={(e) => {
            setIsOpen(false);
            if (isHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="font-serif text-lg tracking-tight text-ink"
        >
          Fernando <em className="italic text-accent">Halim</em>
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-8 text-[15px]">
          {isHome &&
            sectionLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="group relative text-ink-2 hover:text-ink transition-colors"
              >
                {l.name}
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}

          <Link
            href="/uses"
            className={`group relative transition-colors ${
              pathname === "/uses" ? "text-ink" : "text-ink-2 hover:text-ink"
            }`}
          >
            Uses
            <span
              className={`absolute left-0 -bottom-0.5 h-px w-full bg-ink origin-left transition-transform duration-300 ${
                pathname === "/uses"
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>

          <button
            onClick={openPalette}
            title="Open command palette"
            className="flex items-center gap-2 border border-line rounded-full px-3 py-1.5 text-ink-2 hover:text-ink hover:border-line-2 transition-colors"
          >
            <span className="text-[13px]">Search</span>
            <kbd className="text-[11px] text-faint border border-line rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          className="md:hidden flex flex-col gap-1.5 items-end"
        >
          <span
            className={`h-px bg-ink transition-all duration-300 ${
              isOpen ? "w-6 rotate-45 translate-y-[3.5px]" : "w-6"
            }`}
          />
          <span
            className={`h-px bg-ink transition-all duration-300 ${
              isOpen ? "w-6 -rotate-45 -translate-y-[3.5px]" : "w-4"
            }`}
          />
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="md:hidden border-t border-line bg-paper/95 backdrop-blur-xl"
          >
            <div className="flex flex-col px-6 py-7 gap-5 text-[15px]">
              {isHome &&
                sectionLinks.map((l) => (
                  <a
                    key={l.name}
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="text-ink-2 hover:text-ink transition-colors"
                  >
                    {l.name}
                  </a>
                ))}
              <Link
                href="/uses"
                onClick={() => setIsOpen(false)}
                className={
                  pathname === "/uses"
                    ? "text-ink"
                    : "text-ink-2 hover:text-ink transition-colors"
                }
              >
                Uses
              </Link>
              <button
                onClick={openPalette}
                className="text-left text-ink-2 hover:text-ink transition-colors"
              >
                Search (⌘K)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

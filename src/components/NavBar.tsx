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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
    setIsOpen(false);
  };

  // order matches the new page flow: hero → projects → experience → skills → contact
  const homeLinks = [
    { name: "./projects", href: "#projects" },
    { name: "./journey", href: "#experience" },
    { name: "./skills", href: "#skills" },
    { name: "./connect", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-black/80 border-b border-zinc-900 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        {/* left: brand */}
        <Link
          href="/"
          className="font-mono text-zinc-100 font-bold hover:text-green-400 transition-colors flex items-center gap-2 z-50"
          onClick={(e) => {
            setIsOpen(false);
            if (isHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="text-green-500">
            root<span className="hidden sm:inline">@fernando_halim</span>
          </span>
          <span className="text-zinc-600">~#</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {isHome && (
            <div className="hidden md:flex items-center gap-6 font-mono text-sm text-zinc-400">
              {homeLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-green-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          <Link
            href="/uses"
            className={`hidden md:block font-mono text-sm transition-colors ${
              pathname === "/uses"
                ? "text-green-400"
                : "text-zinc-400 hover:text-green-400"
            }`}
          >
            /uses
          </Link>

          <button
            onClick={openCommandPalette}
            className="group flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] duration-500 transition-all cursor-pointer z-50"
            title="open command palette"
          >
            <span className="hidden sm:block text-zinc-500 font-mono text-xs group-hover:text-zinc-300 transition-colors">
              cmd
            </span>
            <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
              <span className="bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                ctrl
              </span>
              <span>+</span>
              <span className="bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                k
              </span>
            </div>
          </button>

          <button
            className="md:hidden font-mono text-sm text-zinc-400 hover:text-green-400 transition-colors z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "[x]" : "[menu]"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 border-b border-zinc-900 bg-black/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex flex-col px-6 py-6 font-mono text-sm text-zinc-400 gap-6">
              {isHome &&
                homeLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-green-400 transition-colors border-l border-zinc-800 pl-4 hover:border-green-500"
                  >
                    {link.name}
                  </a>
                ))}

              <Link
                href="/uses"
                onClick={() => setIsOpen(false)}
                className={`block transition-colors border-l pl-4 ${
                  pathname === "/uses"
                    ? "text-green-400 border-green-500"
                    : "hover:text-green-400 border-zinc-800 hover:border-green-500"
                }`}
              >
                /uses
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

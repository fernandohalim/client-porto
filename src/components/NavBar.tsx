"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // centralized link list for easy mapping
  const navLinks = [
    { name: "./about", href: "#about" },
    { name: "./skills", href: "#skills" },
    { name: "./experience", href: "#experience" },
    { name: "./projects", href: "#projects" },
    { name: "./contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/70">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* logo / root dir */}
        <Link
          href="/"
          className="font-mono text-zinc-400 font-bold hover:text-green-400 transition-colors z-50"
          onClick={() => setIsOpen(false)}
        >
          ~/fernando<span className="text-green-500 animate-blink">_</span>
        </Link>

        {/* desktop navigation */}
        <div className="hidden md:flex gap-6 font-mono text-sm text-zinc-400">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-green-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* mobile toggle button */}
        <button
          className="md:hidden font-mono text-sm text-zinc-400 hover:text-green-400 transition-colors z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "[x]" : "[menu]"}
        </button>
      </div>

      {/* mobile navigation dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden absolute top-16 left-0 right-0 border-b border-zinc-900 bg-zinc-950/95 shadow-2xl"
          >
            <div className="flex flex-col px-6 py-6 font-mono text-sm text-zinc-400 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // closes the menu when a link is clicked!
                  className="block hover:text-green-400 transition-colors border-l border-zinc-800 pl-4 hover:border-green-500"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

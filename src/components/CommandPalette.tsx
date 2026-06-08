"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    {
      id: "home",
      name: "Home",
      desc: "Back to the top",
      action: () => router.push("/"),
    },
    {
      id: "work",
      name: "Selected work",
      desc: "Projects & case studies",
      action: () => router.push("/#projects"),
    },
    {
      id: "experience",
      name: "Experience",
      desc: "Where I've worked",
      action: () => router.push("/#experience"),
    },
    {
      id: "skills",
      name: "Skills",
      desc: "What I build with",
      action: () => router.push("/#skills"),
    },
    {
      id: "uses",
      name: "Uses",
      desc: "Hardware & software",
      action: () => router.push("/uses"),
    },
    {
      id: "contact",
      name: "Contact",
      desc: "Get in touch",
      action: () => router.push("/#contact"),
    },
    {
      id: "email",
      name: "Email",
      desc: "fernandohalim26@gmail.com",
      action: () => window.location.assign("mailto:fernandohalim26@gmail.com"),
    },
    {
      id: "resume",
      name: "Résumé",
      desc: "Download CV (PDF)",
      action: () => window.open("/fernando_halim_cv.pdf", "_blank"),
    },
  ];

  const filtered =
    query === ""
      ? commands
      : commands.filter((c) =>
          (c.name + " " + c.desc).toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        } else {
          setQuery("");
          setSelected(0);
          setIsOpen(true);
        }
      }
    };
    const onOpen = () => {
      setQuery("");
      setSelected(0);
      setIsOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [isOpen]);

  const run = (i: number) => {
    const cmd = filtered[i];
    if (!cmd) return;
    cmd.action();
    setIsOpen(false);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (s + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected(
        (s) => (s - 1 + filtered.length) % Math.max(filtered.length, 1),
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(selected);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-ink/25 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative w-full max-w-lg bg-surface border border-line-2 rounded-2xl shadow-[0_40px_80px_-30px_rgba(34,32,28,0.45)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
              <span className="text-faint text-sm">↳</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search or jump to…"
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-transparent text-ink placeholder:text-faint outline-none text-[15px]"
              />
              <kbd className="text-[11px] text-faint border border-line rounded px-1.5 py-0.5">
                esc
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-faint">
                  No matches.
                </p>
              ) : (
                filtered.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => run(i)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                      selected === i ? "bg-paper" : "hover:bg-paper/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          selected === i ? "bg-accent" : "bg-transparent"
                        }`}
                      />
                      <span className="text-[15px] text-ink">{c.name}</span>
                      <span className="text-[13px] text-faint">{c.desc}</span>
                    </span>
                    {selected === i && (
                      <span className="text-faint text-xs">↵</span>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 px-5 py-3 border-t border-line text-[11px] text-faint">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

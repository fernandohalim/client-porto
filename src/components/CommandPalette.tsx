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
      name: "Index",
      desc: "Selected work & case studies",
      action: () => router.push("/#work"),
    },
    {
      id: "about",
      name: "About",
      desc: "In production — where I work",
      action: () => router.push("/#about"),
    },
    {
      id: "stack",
      name: "Stack",
      desc: "What I build with",
      action: () => router.push("/#stack"),
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
            className="absolute inset-0 bg-coal/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-bone border border-line-2 shadow-[0_40px_80px_-30px_rgba(14,13,12,0.5)] overflow-hidden"
          >
            {/* input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
              <span className="text-accent font-mono text-sm">↳</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={onInputKey}
                placeholder="SEARCH OR JUMP TO…"
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-transparent text-ink placeholder:text-ash outline-none font-mono text-[13px] uppercase tracking-[0.08em]"
              />
              <kbd className="font-mono text-[10px] uppercase tracking-[0.18em] text-smoke border border-line px-1.5 py-0.5">
                esc
              </kbd>
            </div>

            {/* results */}
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-smoke">
                  No matches.
                </p>
              ) : (
                filtered.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => run(i)}
                    onMouseEnter={() => setSelected(i)}
                    data-cursor="Go"
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      selected === i
                        ? "bg-ink text-bone"
                        : "text-ink hover:bg-ink/5"
                    }`}
                  >
                    <span className="flex items-baseline gap-3 min-w-0">
                      <span
                        className={`font-mono text-[10px] shrink-0 ${
                          selected === i ? "text-accent" : "text-ash"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] font-semibold uppercase tracking-tight">
                        {c.name}
                      </span>
                      <span
                        className={`font-mono text-[11px] truncate ${
                          selected === i ? "text-ash" : "text-smoke"
                        }`}
                      >
                        {c.desc}
                      </span>
                    </span>
                    {selected === i && (
                      <span className="font-mono text-xs text-accent shrink-0 ml-3">
                        ↵
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* footer hints */}
            <div className="flex items-center gap-5 px-5 py-3 border-t border-line font-mono text-[10px] uppercase tracking-[0.18em] text-smoke">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>esc Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

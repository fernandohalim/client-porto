"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    {
      id: "home",
      name: "cd ~/",
      desc: "return to root directory",
      action: () => router.push("/"),
    },
    {
      id: "uses",
      name: "cd /uses",
      desc: "view hardware & software stack",
      action: () => router.push("/uses"),
    },
    {
      id: "contact",
      name: "./connect.sh",
      desc: "open email client",
      action: () => window.location.assign("mailto:fernandohalim26@gmail.com"),
    },
    {
      id: "resume",
      name: "wget resume.pdf",
      desc: "download curriculum vitae",
      action: () => window.open("/fernando_halim_cv.pdf", "_blank"),
    },
  ];

  // filter commands based on user input
  const filteredCommands =
    query === ""
      ? commands
      : commands.filter(
          (cmd) =>
            cmd.name.toLowerCase().includes(query.toLowerCase()) ||
            cmd.desc.toLowerCase().includes(query.toLowerCase()),
        );

  // listen to ctrl+k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // listen to custom btn navbar
  useEffect(() => {
    const handleCustomOpen = () => setIsOpen(true);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () =>
      window.removeEventListener("open-command-palette", handleCustomOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // handle arrow navigation and enter key selection
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) =>
          (prev - 1 + filteredCommands.length) % filteredCommands.length,
      );
    } else if (e.key === "Enter" && filteredCommands.length > 0) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
          {/* background blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* command palette modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl mx-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* inner subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-500/5 blur-[50px] pointer-events-none"></div>

            {/* input area */}
            <div className="flex items-center px-4 py-4 border-b border-zinc-800 relative z-10">
              <span className="text-green-500 font-mono mr-3">{">"}</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="type a command or search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0); // reset selection instantly when typing
                }}
                onKeyDown={handleModalKeyDown}
                className="w-full bg-transparent text-zinc-100 font-mono text-sm outline-none placeholder:text-zinc-600"
                spellCheck={false}
              />
              <span className="text-zinc-600 font-mono text-xs px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                esc
              </span>
            </div>

            {/* command list output */}
            <div className="max-h-[60vh] overflow-y-auto py-2 relative z-10 no-scrollbar">
              {filteredCommands.length === 0 ? (
                <div className="px-6 py-8 text-center font-mono text-sm text-zinc-500">
                  command not found.
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left font-mono text-sm transition-colors ${
                      selectedIndex === index
                        ? "bg-green-500/10 text-green-400 border-l-2 border-green-500"
                        : "text-zinc-400 hover:bg-zinc-900/50 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="font-bold">{cmd.name}</span>
                      <span
                        className={`text-xs ${selectedIndex === index ? "text-green-500/70" : "text-zinc-600"}`}
                      >
                        {cmd.desc}
                      </span>
                    </div>
                    {selectedIndex === index && (
                      <span className="text-xs text-green-500 hidden sm:block">
                        ↵
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

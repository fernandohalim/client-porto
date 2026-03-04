"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface LogMessage {
  text: string;
  isCommand?: boolean;
}

// --- STATIC DATABASE: COMMANDS ---
// moved outside the component so it doesn't trigger dependency warnings
const terminalCommands: Record<string, string[]> = {
  help: [
    "available commands:",
    "  whoami   - print current user",
    "  sudo     - execute with elevated privileges",
    "  music    - load audio driver profiles",
    "  stardew  - initialize pelican_town.exe",
    "  clear    - clear terminal output",
    "  exit     - close terminal session",
    "  menu     - return to graphic interface",
  ],
  whoami: ["root@fernando_halim"],
  sudo: [
    "fernandohalim is not in the sudoers file. this incident will be reported.",
  ],
  music: [
    "loading audio profiles...",
    "> [distwave] : heavy edm / trap initialized.",
    "> [season]   : experimental r&b initialized.",
    "audio routing active. ready for playback.",
    "interface in progress...",
  ],
  stardew: [
    "booting stardew valley engine...",
    "allocating farm space...",
    "error: user is still a beginner. crop rotation knowledge insufficient.",
    "please consult the wiki before planting more parsnips.",
  ],
};

export default function CommandPalette() {
  const router = useRouter();

  // hybrid state
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "terminal">("menu");
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // terminal state
  const [logs, setLogs] = useState<LogMessage[]>([]);

  // refs (using ref for buffer prevents cascading state renders)
  const bufferRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);

  // route commands need router, so they stay inside
  const routeCommands = [
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

  const filteredRoutes =
    query === ""
      ? routeCommands
      : routeCommands.filter(
          (cmd) =>
            cmd.name.toLowerCase().includes(query.toLowerCase()) ||
            cmd.desc.toLowerCase().includes(query.toLowerCase()),
        );

  // --- EFFECT: BACKGROUND KEYLOGGER ---
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // ignore if palette is open or user is typing in a real input
      if (
        isOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key.length === 1) {
        // update buffer secretly without causing a re-render
        bufferRef.current = (bufferRef.current + e.key)
          .slice(-15)
          .toLowerCase();

        // check for easter eggs right inside the event listener
        const triggers = ["help", "sudo", "music", "stardew"];
        const match = triggers.find((t) => bufferRef.current.endsWith(t));

        if (match) {
          setIsOpen(true);
          setMode("terminal");
          bufferRef.current = ""; // reset buffer
          setLogs([
            { text: `> ${match}`, isCommand: true },
            ...terminalCommands[match].map((text) => ({ text })),
          ]);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [isOpen]);

  // --- EFFECT: GLOBAL TRIGGERS (CTRL+K / CUSTOM EVENT) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setMode("menu");
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
      setMode("menu");
      setQuery("");
      setSelectedIndex(0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  // auto-focus and auto-scroll
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 10);
  }, [isOpen, mode]);

  useEffect(() => {
    if (mode === "terminal") {
      endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, mode]);

  // --- EVENT: HYBRID INPUT HANDLER ---
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    // MENU MODE NAVIGATION
    if (mode === "menu") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredRoutes.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredRoutes.length) % filteredRoutes.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();

        // if they hit enter on a route
        if (filteredRoutes.length > 0) {
          filteredRoutes[selectedIndex].action();
          setIsOpen(false);
        }
        // if they type a terminal command in the menu and hit enter
        else {
          const cmd = query.trim().toLowerCase();
          setMode("terminal");
          setQuery("");
          executeTerminalCommand(cmd);
        }
      }
    }
    // TERMINAL MODE NAVIGATION
    else if (mode === "terminal") {
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = query.trim().toLowerCase();
        setQuery("");
        executeTerminalCommand(cmd);
      }
    }
  };

  const executeTerminalCommand = (cmd: string) => {
    if (!cmd) return;

    if (cmd === "clear") {
      setLogs([]);
      return;
    }
    if (cmd === "exit") {
      setIsOpen(false);
      return;
    }
    if (cmd === "menu") {
      setMode("menu");
      setLogs([]);
      return;
    }

    const newLogs = [...logs, { text: `> ${cmd}`, isCommand: true }];
    if (terminalCommands[cmd]) {
      newLogs.push(...terminalCommands[cmd].map((text) => ({ text })));
    } else {
      newLogs.push({
        text: `command not found: ${cmd}. type 'help' for available commands.`,
      });
    }
    setLogs(newLogs);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
          {/* background blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* master modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full mx-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              mode === "terminal"
                ? "max-w-3xl h-[60vh]"
                : "max-w-xl max-h-[70vh]"
            }`}
          >
            {/* inner subtle glow */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-500/5 blur-[50px] pointer-events-none transition-opacity ${mode === "terminal" ? "opacity-30" : "opacity-100"}`}
            ></div>

            {/* hybrid input area */}
            <div className="flex items-center px-4 py-4 border-b border-zinc-800 relative z-10 shrink-0 bg-zinc-950/80 backdrop-blur">
              {mode === "terminal" ? (
                <span className="text-green-500 font-mono text-sm mr-3">
                  root@fernando_halim/
                </span>
              ) : (
                <span className="text-green-500 font-mono mr-3">{">"}</span>
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  mode === "menu" ? "type a command, or type 'help'..." : ""
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                className="w-full bg-transparent text-zinc-100 font-mono text-sm outline-none placeholder:text-zinc-600 caret-green-500"
                spellCheck={false}
                autoComplete="off"
              />
              <span className="text-zinc-600 font-mono text-xs px-2 py-1 bg-zinc-900 rounded border border-zinc-800 shrink-0 ml-2">
                esc
              </span>
            </div>

            {/* dynamic content area */}
            <div className="relative z-10 overflow-y-auto no-scrollbar flex-1 p-2">
              {/* MENU MODE VIEW */}
              {mode === "menu" &&
                (filteredRoutes.length === 0 ? (
                  <div className="px-4 py-8 text-center font-mono text-sm text-zinc-500">
                    hit <span className="text-green-500">enter</span> to execute
                    as terminal command.
                  </div>
                ) : (
                  filteredRoutes.map((cmd, index) => (
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
                ))}

              {/* TERMINAL MODE VIEW */}
              {mode === "terminal" && (
                <div className="p-4 font-mono text-sm space-y-1">
                  <div className="text-zinc-500 mb-4 border-b border-zinc-800/50 pb-2">
                    tty1 - interactive shell session started. type
                    &apos;menu&apos; to exit.
                  </div>
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={`${log.isCommand ? "text-green-400 mt-2" : "text-zinc-300"}`}
                    >
                      {log.text}
                    </div>
                  ))}
                  <div ref={endOfTerminalRef} className="h-4" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

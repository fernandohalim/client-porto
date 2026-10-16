"use client";

// ─────────────────────────────────────────────────────────────────────────────
// In-game interface, after the welcome layer has gone: three round buttons in
// the top-right corner (sound, map, menu) and the minimap bottom-left. The menu is
// a tabbed card — Welcome, Controls, Options — following the shape of
// Bruno Simon's, which keeps everything that isn't driving one click away.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useState } from "react";

export type Tab = "welcome" | "controls" | "options";

const roundButton =
  "grid h-11 w-11 place-items-center rounded-full bg-cream text-ink shadow-[0_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor" />
      {muted ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
      )}
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden>
      <path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}

export function Hud({
  visible,
  muted,
  onToggleSound,
  onOpenMenu,
  onOpenMap,
}: {
  visible: boolean;
  muted: boolean;
  onToggleSound: () => void;
  onOpenMenu: () => void;
  onOpenMap: () => void;
}) {
  return (
    <div
      className={`absolute top-5 right-5 flex gap-2.5 transition-[opacity,transform] duration-500 ${
        visible ? "" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
      inert={!visible}
    >
      <button
        type="button"
        className={roundButton}
        onClick={(e) => {
          e.currentTarget.blur();
          onToggleSound();
        }}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        title={muted ? "Sound off (N)" : "Sound on (N)"}
      >
        <SoundIcon muted={muted} />
      </button>
      <button
        type="button"
        className={roundButton}
        onClick={(e) => {
          e.currentTarget.blur();
          onOpenMap();
        }}
        aria-label="Open the map"
        title="Map (M)"
      >
        <MapIcon />
      </button>
      <button
        type="button"
        className={roundButton}
        onClick={(e) => {
          e.currentTarget.blur();
          onOpenMenu();
        }}
        aria-label="Open menu"
        title="Menu (Esc)"
      >
        <MenuIcon />
      </button>
    </div>
  );
}

const CONTROLS: [string, string][] = [
  ["W A S D / arrows", "Drive and steer"],
  ["Shift", "Nitro"],
  ["Space", "Drift / brake"],
  ["H", "Horn"],
  ["R", "Flip back over"],
  ["M", "Map"],
  ["N", "Sound on / off"],
  ["Esc", "This menu"],
];

const pill =
  "rounded-full px-5 py-2.5 text-sm font-extrabold shadow-[0_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

export function Menu({
  open,
  muted,
  onClose,
  onToggleSound,
  onRespawn,
  onReset,
}: {
  open: boolean;
  muted: boolean;
  onClose: () => void;
  onToggleSound: () => void;
  onRespawn: () => void;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>("welcome");

  return (
    <div
      className={`absolute inset-0 z-20 grid place-items-center bg-ink/25 p-4 transition-opacity duration-300 ${
        open ? "" : "pointer-events-none opacity-0"
      }`}
      // closed, it only fades out: inert drops focus from its buttons, or the
      // next Space (the brake) would press whichever was clicked last
      inert={!open}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl bg-cream p-6 text-ink shadow-[0_8px_0_var(--color-ink)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          open ? "" : "translate-y-6 scale-95"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <nav className="flex gap-1.5 rounded-full bg-sand/60 p-1">
            {(["welcome", "controls", "options"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-extrabold capitalize transition-colors ${
                  tab === t ? "bg-ink text-cream" : "text-ink/70 hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full text-2xl font-black text-ink/60 hover:bg-sand/60 hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="mt-6 min-h-56">
          {tab === "welcome" && (
            <div>
              <h2 className="text-3xl leading-tight font-black">Hey, I&rsquo;m Fernando.</h2>
              <p className="mt-3 leading-relaxed text-ink/75">
                I build fraud detection for interbank payment networks by day, and my own
                products after hours. This desert is my portfolio — every landmark out
                there is a part of my work.
              </p>
              <p className="mt-3 leading-relaxed text-ink/75">
                Drive around, find the flags, and go ahead and break things. It all comes
                back.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button type="button" onClick={onClose} className={`${pill} bg-coral text-white`}>
                  Keep driving
                </button>
                <Link href="/site" className={`${pill} bg-white`}>
                  View the website
                </Link>
              </div>
            </div>
          )}

          {tab === "controls" && (
            <ul className="grid gap-2">
              {CONTROLS.map(([key, action]) => (
                <li key={key} className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-2.5">
                  <span className="font-semibold text-ink/75">{action}</span>
                  <kbd className="rounded-lg border-2 border-ink bg-cream px-2 py-0.5 font-sans text-sm font-black shadow-[0_2px_0_var(--color-ink)]">
                    {key}
                  </kbd>
                </li>
              ))}
            </ul>
          )}

          {tab === "options" && (
            <ul className="grid gap-2.5">
              <li className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3">
                <span>
                  <span className="block font-extrabold">Sound</span>
                  <span className="text-sm text-ink/60">Engine, crashes and the horn</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!muted}
                  onClick={onToggleSound}
                  className={`relative h-8 w-14 rounded-full border-2 border-ink transition-colors ${
                    muted ? "bg-sand" : "bg-coral"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-cream shadow-[0_2px_0_var(--color-ink)] transition-[left] ${
                      muted ? "left-0.5" : "left-[26px]"
                    }`}
                  />
                </button>
              </li>
              <li className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3">
                <span>
                  <span className="block font-extrabold">Respawn</span>
                  <span className="text-sm text-ink/60">Back to the signpost, wheels down</span>
                </span>
                <button type="button" onClick={onRespawn} className={`${pill} bg-white`}>
                  Respawn
                </button>
              </li>
              <li className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3">
                <span>
                  <span className="block font-extrabold">Reset objects</span>
                  <span className="text-sm text-ink/60">Rebuild everything you&rsquo;ve smashed</span>
                </span>
                <button type="button" onClick={onReset} className={`${pill} bg-white`}>
                  Reset
                </button>
              </li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

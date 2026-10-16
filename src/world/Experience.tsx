"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The landing route, in three beats:
//
//   loading  the name drops in over a progress bar while the world boots
//            behind it; the camera holds a wide establishing shot
//   intro    the loader lifts, the camera eases in, and a light welcome
//            layer sits over the live world: name, keycap prompt, way out
//   playing  the first drive key clears the welcome layer; what remains is a
//            minimap and two buttons (sound, menu). M opens the paper map,
//            Esc the tabbed menu.
//
// The world is desktop-only. Anything without a fine pointer, a wide screen
// and WebGL2 gets the loader and then a card pointing to /site, and the 3D
// scene is never downloaded for it.
// ─────────────────────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import * as audio from "./audio";
import { DRIVE_KEYS } from "./config";
import { emitWorld, onWorld, view } from "./events";
import Intro from "./ui/Intro";
import Loader from "./ui/Loader";
import SpeedLines from "./ui/SpeedLines";
import StuckHint from "./ui/StuckHint";
import { Hud, Menu } from "./ui/Menu";
import { nunito } from "./ui/font";
import BigMap from "./ui/map/BigMap";
import Minimap from "./ui/map/Minimap";
import { LANDMARK_PINS, ZONE_PINS } from "./ui/map/art";
import { getFound, getServerFound, subscribeFound } from "./ui/map/fog";

const World = dynamic(() => import("./World"), { ssr: false });

const DESKTOP = "(min-width: 1024px) and (pointer: fine)";

let webgl: boolean | undefined;
function hasWebGL() {
  if (webgl === undefined) {
    try {
      webgl = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getCapable = () => window.matchMedia(DESKTOP).matches && hasWebGL();
// unknown during SSR — the loader covers everything until hydrated anyway
const getServerCapable = () => null;

type Phase = "loading" | "intro" | "playing";

// progress milestones, and something to read while each one happens
const STAGES = [
  { at: 12, label: "Pouring the sand…" },
  { at: 55, label: "Waking up the desert…" },
  { at: 88, label: "Fuelling the truck…" },
  { at: 100, label: "Here we go!" },
];

const MIN_LOADER_MS = 1900; // long enough for the name to land and be read
const LEAVE_MS = 700;

export default function Experience() {
  const capable = useSyncExternalStore(subscribe, getCapable, getServerCapable);
  const muted = useSyncExternalStore(audio.subscribeMuted, audio.isMuted, () => false);
  const found = useSyncExternalStore(subscribeFound, getFound, getServerFound);

  const [phase, setPhase] = useState<Phase>("loading");
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null);
  const [stunt, setStunt] = useState<{ title: string; detail: string; key: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [pressed, setPressed] = useState<Set<string>>(() => new Set());
  const startedAt = useRef(0);

  const onMount = useCallback(() => setStage((s) => Math.max(s, 1)), []);
  const onReady = useCallback(() => {
    setStage((s) => Math.max(s, 2));
    // a beat for the first frames to draw before calling it done
    window.setTimeout(() => setStage(3), 450);
  }, []);

  // without the world there is nothing to wait for
  useEffect(() => {
    startedAt.current = performance.now();
    if (capable !== false) return;
    const t = window.setTimeout(() => setStage(3), 900);
    return () => window.clearTimeout(t);
  }, [capable]);

  // done loading: hold until the name has landed, then lift the loader away
  useEffect(() => {
    if (stage < 3 || phase !== "loading") return;
    const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - startedAt.current));
    const lift = window.setTimeout(() => setLeaving(true), wait);
    const done = window.setTimeout(() => setPhase("intro"), wait + LEAVE_MS);
    return () => {
      window.clearTimeout(lift);
      window.clearTimeout(done);
    };
  }, [stage, phase]);

  // framing follows the phase: wide, then closer, then in on the truck
  useEffect(() => {
    const paused = menuOpen || mapOpen;
    view.target = phase === "loading" ? 2.4 : phase === "intro" || paused ? 1.4 : 1;
    view.playing = phase === "playing" && !paused;
  }, [phase, menuOpen, mapOpen]);

  // a section or landmark found for the first time: say so, with confetti
  const onDiscover = useCallback((ids: string[]) => {
    const names = ids.map(
      (id) => [...ZONE_PINS, ...LANDMARK_PINS].find((p) => p.id === id)?.name ?? id,
    );
    audio.chime();
    emitWorld("celebrate");
    setToast({ text: `Found: ${names.join(" & ")}`, key: performance.now() });
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  // a landed jump: a quick shout over the truck
  useEffect(
    () =>
      onWorld("stunt", ({ air, flips }) => {
        const title =
          flips > 1 ? `${flips}× flip!` : flips === 1 ? "Flip!" : air >= 1.8 ? "Huge air!" : "Big air!";
        setStunt({ title, detail: `${air.toFixed(1)}s in the air`, key: performance.now() });
      }),
    [],
  );
  useEffect(() => {
    if (!stunt) return;
    const t = window.setTimeout(() => setStunt(null), 1700);
    return () => window.clearTimeout(t);
  }, [stunt]);

  const toggleSound = useCallback(() => {
    audio.unlock();
    audio.setMuted(!audio.isMuted());
  }, []);

  useEffect(() => {
    const unlock = () => audio.unlock();
    const onDown = (e: KeyboardEvent) => {
      unlock();
      if (e.code === "KeyN") toggleSound();
      if (phase === "intro" && capable) {
        setPressed((p) => new Set(p).add(e.code));
        if (DRIVE_KEYS.has(e.code)) setPhase("playing");
      }
      if (phase === "playing") {
        if (e.code === "KeyM" && !menuOpen) setMapOpen((o) => !o);
        if (e.code === "Escape") {
          // Esc closes whatever is open first, and only then opens the menu
          if (mapOpen) setMapOpen(false);
          else setMenuOpen((o) => !o);
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (phase !== "intro") return;
      setPressed((p) => {
        const next = new Set(p);
        next.delete(e.code);
        return next;
      });
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("pointerdown", unlock);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("pointerdown", unlock);
    };
  }, [phase, capable, toggleSound, menuOpen, mapOpen]);

  const paused = phase === "playing" && (menuOpen || mapOpen);
  const driving = capable === true && phase === "playing" && !paused;
  const current = STAGES[stage];

  return (
    <main className={`${nunito.className} fixed inset-0 overflow-hidden bg-sand text-ink select-none`}>
      {capable && (
        <World driving={driving} paused={paused} resetKey={resetKey} onMount={onMount} onReady={onReady} />
      )}

      {capable && (
        <>
          <SpeedLines />
          <StuckHint visible={driving} />
          <Intro visible={phase === "intro"} pressed={pressed} />
          <Minimap
            visible={phase === "playing" && !menuOpen && !mapOpen}
            active={driving}
            found={found}
            onOpen={() => setMapOpen(true)}
            onDiscover={onDiscover}
          />
          <BigMap
            open={mapOpen}
            found={found}
            onClose={() => setMapOpen(false)}
            onTravel={(at) => {
              emitWorld("travel", at);
              setMapOpen(false);
            }}
            onHome={() => {
              emitWorld("respawn");
              setMapOpen(false);
            }}
          />
          {/* discovery toast */}
          <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2">
            {toast && (
              <p
                key={toast.key}
                role="status"
                className="animate-pop-in rounded-full border-[3px] border-ink bg-cream px-5 py-2 text-lg font-black shadow-[0_4px_0_var(--color-ink)]"
              >
                {toast.text}
              </p>
            )}
          </div>
          {/* stunt call-out, just above the truck */}
          <div className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
            {stunt && !paused && (
              <div key={stunt.key} role="status" className="animate-stunt-pop">
                <p className="text-5xl font-black text-cream [-webkit-text-stroke:3px_var(--color-ink)] [paint-order:stroke_fill] [text-shadow:0_5px_0_var(--color-ink)]">
                  {stunt.title}
                </p>
                <p className="mt-2 inline-block rounded-full bg-cream px-3 py-0.5 text-xs font-extrabold tracking-wide uppercase shadow-[0_3px_0_var(--color-ink)]">
                  {stunt.detail}
                </p>
              </div>
            )}
          </div>
          <Hud
            visible={phase === "playing" && !menuOpen && !mapOpen}
            muted={muted}
            onToggleSound={toggleSound}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenMap={() => setMapOpen(true)}
          />
          <Menu
            open={menuOpen}
            muted={muted}
            onClose={() => setMenuOpen(false)}
            onToggleSound={toggleSound}
            onRespawn={() => {
              emitWorld("respawn");
              setMenuOpen(false);
            }}
            onReset={() => {
              setResetKey((k) => k + 1);
              setMenuOpen(false);
            }}
          />
        </>
      )}

      {capable === false && phase !== "loading" && (
        <div className="absolute inset-0 grid place-items-center p-6">
          <section className="w-full max-w-sm animate-pop-in rounded-3xl bg-cream p-7 text-center shadow-[0_8px_0_var(--color-ink)]">
            <h1 className="text-3xl leading-tight font-black">Fernando Halim</h1>
            <p className="mt-3 leading-relaxed text-ink/75">
              This portfolio is a desert you drive around, and it&rsquo;s built for a desktop
              browser with a keyboard. Everything in it is on the website too.
            </p>
            <Link
              href="/site"
              className="mt-6 inline-block rounded-full bg-coral px-6 py-3 font-extrabold text-white shadow-[0_4px_0_var(--color-ink)]"
            >
              View the website
            </Link>
          </section>
        </div>
      )}

      {phase === "loading" && (
        <Loader progress={current.at} label={current.label} leaving={leaving} />
      )}
    </main>
  );
}

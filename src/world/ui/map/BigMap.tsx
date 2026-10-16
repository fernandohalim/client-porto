"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The full paper map, opened with M or by clicking the minimap. The whole
// desert under its fog, a live marker for the truck, and a pin per section:
// found ones carry their name and take you there on click; unfound ones are
// just a question mark. "Start" is always there as a way home.
//
// The pins are real buttons laid over the canvas, so they are focusable and
// readable by assistive tech — the canvas underneath is only the picture.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { carState } from "../../config";
import { amatic } from "../font";
import { INK, MAP_SIZE, ZONE_PINS, getMapArt, mapAngle, toMap } from "./art";
import { getFog } from "./fog";

const pct = (v: number) => `${(v / MAP_SIZE) * 100}%`;

export default function BigMap({
  open,
  found,
  onClose,
  onTravel,
  onHome,
}: {
  open: boolean;
  found: string[];
  onClose: () => void;
  onTravel: (at: [number, number]) => void;
  onHome: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = canvas.current;
    if (!el) return;
    el.width = MAP_SIZE;
    el.height = MAP_SIZE;
    const ctx = el.getContext("2d")!;
    let art: { base: HTMLCanvasElement; overlay: HTMLCanvasElement } | null = null;
    let raf = 0;
    let stopped = false;
    void getMapArt(amatic.style.fontFamily).then((c) => {
      art = c;
    });
    const fog = getFog();

    const frame = () => {
      if (stopped) return;
      if (art) {
        ctx.drawImage(art.base, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(fog, 0, 0, MAP_SIZE, MAP_SIZE);
        ctx.drawImage(art.overlay, 0, 0);
        // the truck
        const [x, y] = toMap(carState.position.x, carState.position.z);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(mapAngle(carState.forward.x, carState.forward.z));
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-12, -13);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-12, 13);
        ctx.closePath();
        ctx.fillStyle = "#ff5a3c";
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = INK;
        ctx.stroke();
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [open]);

  // where the truck starts, in the middle of the pit stop
  const [hx, hy] = toMap(0, 0);

  return (
    <div
      className={`absolute inset-0 z-20 grid place-items-center bg-ink/40 p-4 transition-opacity duration-300 ${
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
        aria-label="Map"
        onClick={(e) => e.stopPropagation()}
        className={`relative transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          open ? "" : "translate-y-6 scale-95 rotate-1"
        }`}
        style={{ width: "min(84vh, 84vw)" }}
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl border-[3px] border-ink shadow-[0_10px_0_var(--color-ink)]">
          <canvas ref={canvas} className="block h-full w-full" />

          {/* the way home, always available */}
          <button
            type="button"
            onClick={onHome}
            className={`${amatic.className} absolute -translate-x-1/2 -translate-y-full rounded-full border-2 border-ink bg-cream px-3 text-xl leading-7 font-bold shadow-[0_2px_0_var(--color-ink)] hover:bg-white`}
            style={{ left: pct(hx), top: pct(hy - 14) }}
            title="Travel back to the start"
          >
            Start ↵
          </button>

          {ZONE_PINS.map((pin) => {
            const [px, py] = toMap(...pin.world);
            const known = found.includes(pin.id);
            return known ? (
              <button
                key={pin.id}
                type="button"
                onClick={() => onTravel(pin.drop)}
                title={`Travel to ${pin.name}`}
                // the dot sits exactly on the spot (14px is half the dot), with
                // the name hanging below it
                className="group absolute flex -translate-x-1/2 flex-col items-center"
                style={{ left: pct(px), top: `calc(${pct(py)} - 14px)` }}
              >
                <span
                  className="block h-7 w-7 rounded-full border-[3px] border-ink shadow-[0_2px_0_var(--color-ink)] transition-transform group-hover:scale-125"
                  style={{ background: pin.color }}
                />
                <span
                  className={`${amatic.className} mt-1 rounded-md bg-cream/90 px-2 text-2xl leading-7 font-bold whitespace-nowrap text-ink`}
                >
                  {pin.name}
                </span>
                <span className="mt-0.5 rounded-full bg-ink px-2 py-0.5 text-[10px] font-extrabold text-cream opacity-0 transition-opacity group-hover:opacity-100">
                  Travel here
                </span>
              </button>
            ) : (
              <span
                key={pin.id}
                title="Not found yet — go exploring"
                className={`${amatic.className} absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-dashed border-ink/60 bg-cream/70 text-2xl font-bold text-ink/70`}
                style={{ left: pct(px), top: pct(py) }}
              >
                ?
              </span>
            );
          })}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close map"
            className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream text-2xl font-black shadow-[0_2px_0_var(--color-ink)] hover:bg-white"
          >
            ×
          </button>
        </div>

        <p className="mt-5 text-center text-sm font-extrabold text-cream drop-shadow-[0_2px_0_var(--color-ink)]">
          {found.length} of {ZONE_PINS.length} sections found · click a found section to travel
          there · M or Esc to close
        </p>
      </section>
    </div>
  );
}

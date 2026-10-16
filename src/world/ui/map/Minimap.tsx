"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The round minimap, bottom-left: a window onto the paper map, centred on the
// truck, with the fog drawn over it. Sections inside the window get a pin;
// sections outside it get a little arrow on the rim pointing the way — the
// map's real job on a portfolio is making sure people find the work.
//
// It also drives discovery: every few frames it clears the fog around the
// truck and reports any section found for the first time.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { carState } from "../../config";
import { amatic } from "../font";
import { INK, MAP_SIZE, SCALE, ZONE_PINS, getMapArt, mapAngle, toMap } from "./art";
import { FOG_SIZE, getFog, reveal } from "./fog";

const SIZE = 184; // css px
const VIEW = 30; // metres from the centre to the rim
const REVEAL_EVERY = 0.15; // s

export default function Minimap({
  visible,
  active,
  found,
  onOpen,
  onDiscover,
}: {
  visible: boolean;
  /** reveal fog and discover sections only while actually driving */
  active: boolean;
  found: string[];
  onOpen: () => void;
  onDiscover: (ids: string[]) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ active, found, onDiscover });
  useEffect(() => {
    live.current = { active, found, onDiscover };
  }, [active, found, onDiscover]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = SIZE * dpr;
    el.height = SIZE * dpr;
    const ctx = el.getContext("2d")!;

    let art: HTMLCanvasElement | null = null;
    let raf = 0;
    let last = performance.now();
    let sinceReveal = REVEAL_EVERY;
    let stopped = false;

    void getMapArt(amatic.style.fontFamily).then((c) => {
      art = c.base;
    });
    const fog = getFog();

    const frame = (now: number) => {
      if (stopped) return;
      const dt = (now - last) / 1000;
      last = now;
      const { active: on, found: seen, onDiscover: discover } = live.current;

      if (on) {
        sinceReveal += dt;
        if (sinceReveal >= REVEAL_EVERY) {
          sinceReveal = 0;
          const fresh = reveal(carState.position.x, carState.position.z);
          if (fresh.length) discover(fresh);
        }
      }

      if (art) {
        const [cx, cy] = toMap(carState.position.x, carState.position.z);
        const half = VIEW * SCALE;
        const S = SIZE * dpr;
        const k = S / (half * 2); // map px → canvas px

        ctx.clearRect(0, 0, S, S);
        ctx.save();
        ctx.beginPath();
        ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(art, cx - half, cy - half, half * 2, half * 2, 0, 0, S, S);
        const f = FOG_SIZE / MAP_SIZE;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(fog, (cx - half) * f, (cy - half) * f, half * 2 * f, half * 2 * f, 0, 0, S, S);

        // section pins, or rim arrows for the ones out of view
        for (const pin of ZONE_PINS) {
          const [px, py] = toMap(...pin.world);
          let x = (px - cx) * k + S / 2;
          let y = (py - cy) * k + S / 2;
          const dx = x - S / 2;
          const dy = y - S / 2;
          const d = Math.hypot(dx, dy);
          const known = seen.includes(pin.id);
          const rim = S / 2 - 14 * dpr;
          if (d > rim) {
            x = S / 2 + (dx / d) * rim;
            y = S / 2 + (dy / d) * rim;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.atan2(dy, dx));
            ctx.beginPath();
            ctx.moveTo(8 * dpr, 0);
            ctx.lineTo(-5 * dpr, -6 * dpr);
            ctx.lineTo(-5 * dpr, 6 * dpr);
            ctx.closePath();
            ctx.fillStyle = known ? pin.color : "#a8916a";
            ctx.fill();
            ctx.lineWidth = 1.5 * dpr;
            ctx.strokeStyle = INK;
            ctx.stroke();
            ctx.restore();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, 7 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = known ? pin.color : "#a8916a";
            ctx.fill();
            ctx.lineWidth = 2 * dpr;
            ctx.strokeStyle = INK;
            ctx.stroke();
            if (!known) {
              ctx.fillStyle = INK;
              ctx.font = `700 ${12 * dpr}px ${amatic.style.fontFamily}`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("?", x, y + dpr);
            }
          }
        }

        // the truck: an arrow along its heading
        ctx.translate(S / 2, S / 2);
        ctx.rotate(mapAngle(carState.forward.x, carState.forward.z));
        ctx.beginPath();
        ctx.moveTo(11 * dpr, 0);
        ctx.lineTo(-7 * dpr, -7 * dpr);
        ctx.lineTo(-3 * dpr, 0);
        ctx.lineTo(-7 * dpr, 7 * dpr);
        ctx.closePath();
        ctx.fillStyle = "#ff5a3c";
        ctx.fill();
        ctx.lineWidth = 2 * dpr;
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
  }, []);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.currentTarget.blur();
        onOpen();
      }}
      aria-label="Open the map (M)"
      title="Map (M)"
      className={`absolute bottom-5 left-5 rounded-full border-[3px] border-ink bg-cream p-1 shadow-[0_4px_0_var(--color-ink)] transition-[opacity,transform] duration-500 hover:-translate-y-0.5 ${
        visible ? "" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <canvas
        ref={canvas}
        className="block rounded-full"
        style={{ width: SIZE, height: SIZE }}
      />
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-cream px-2 text-[11px] font-black">
        M
      </span>
    </button>
  );
}

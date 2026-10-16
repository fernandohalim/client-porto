"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Watches for the truck pulling up at a section's spot, and announces it.
//
// A spot fires once, then stays quiet until the truck has driven well clear
// of it — so closing a card while still parked doesn't reopen it, and
// rolling around beside a landmark doesn't keep firing.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { carState } from "../../config";
import { emitWorld } from "../../events";
import { SPOTS } from "./frame";

/** how far past a spot's radius the truck must go before it can fire again */
const REARM_MARGIN = 2.5;

export default function Arrivals({ active }: { active: boolean }) {
  const armed = useRef(new Set(SPOTS.map((s) => s.id)));

  useFrame(() => {
    const { x, z } = carState.position;
    for (const spot of SPOTS) {
      const d = Math.hypot(x - spot.at[0], z - spot.at[1]);
      if (d > spot.radius + REARM_MARGIN) armed.current.add(spot.id);
      else if (active && d < spot.radius && armed.current.has(spot.id)) {
        armed.current.delete(spot.id);
        emitWorld("arrive", spot.id);
      }
    }
  });

  return null;
}

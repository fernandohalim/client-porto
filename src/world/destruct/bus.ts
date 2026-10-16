// A tiny event bus for explosions. Barrels publish; breakables, the blast
// visuals and the radial shove all subscribe. No React state involved, so an
// explosion never re-renders anything that didn't break.

import type { Vector3 } from "three";

type Listener = (at: Vector3, power: number) => void;

const listeners = new Set<Listener>();

export function explode(at: Vector3, power = 1) {
  listeners.forEach((l) => l(at, power));
}

export function onExplosion(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** live debris bodies across the world, so a chain reaction can't spawn hundreds */
export const debris = { live: 0, cap: 110 };

/** radius of an explosion's reach, per unit of power */
export const BLAST_RADIUS = 5.5;


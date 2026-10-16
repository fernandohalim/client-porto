// ─────────────────────────────────────────────────────────────────────────────
// One pooled particle system for every puff in the world: tyre dust, break
// dust, explosion smoke. Emitters call `emit` / `burst`; <Particles> owns the
// single instanced mesh that draws them all.
// ─────────────────────────────────────────────────────────────────────────────

import { Color, Vector3 } from "three";

export const MAX_PARTICLES = 320;

export type Particle = {
  alive: boolean;
  position: Vector3;
  velocity: Vector3;
  color: Color;
  age: number;
  life: number;
  size: number;
  /** upward acceleration: dust settles (negative), smoke rises (positive) */
  lift: number;
};

export const pool: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
  alive: false,
  position: new Vector3(),
  velocity: new Vector3(),
  color: new Color(),
  age: 0,
  life: 1,
  size: 1,
  lift: 0,
}));

let cursor = 0;

export function emit(
  at: Vector3,
  velocity: Vector3,
  color: string | Color,
  { life = 1, size = 0.5, lift = -0.5 } = {},
) {
  // overwrite the oldest slot when full: losing an old puff is invisible,
  // refusing a new one is not
  const p = pool[cursor];
  cursor = (cursor + 1) % MAX_PARTICLES;
  p.alive = true;
  p.position.copy(at);
  p.velocity.copy(velocity);
  p.color.set(color);
  p.age = 0;
  p.life = life;
  p.size = size;
  p.lift = lift;
}

const _v = new Vector3();

/** a radial puff, for breaks and landings */
export function burst(at: Vector3, color: string, count: number, speed = 2.5, size = 0.6) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = speed * (0.5 + Math.random() * 0.5);
    _v.set(Math.cos(a) * s, 0.8 + Math.random() * 1.5, Math.sin(a) * s);
    emit(at, _v, color, { life: 0.7 + Math.random() * 0.6, size: size * (0.7 + Math.random() * 0.6), lift: -0.8 });
  }
}

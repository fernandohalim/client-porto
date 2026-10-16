// ─────────────────────────────────────────────────────────────────────────────
// Where everything in the desert stands, computed once at module load from
// fixed seeds. Both the 3D scene and the paper map read from here, so the map
// can never disagree with the world it draws.
// ─────────────────────────────────────────────────────────────────────────────

import { HALF, LANDMARKS } from "../config";
import { isClear, randomPoint, seeded } from "./layout";

/* ── mesas: a ring around the edge, two rows forming the canyon ── */

export type Tier = { x: number; z: number; y: number; r: number; h: number };

function mesa(x: number, z: number, radius: number, height: number, rand: () => number): Tier[] {
  const tiers: Tier[] = [];
  const count = 2 + Math.floor(rand() * 2);
  let y = 0;
  let r = radius;
  for (let i = 0; i < count; i++) {
    const h = (height / count) * (0.8 + rand() * 0.4);
    // each tier drifts a little off-centre, so the stack looks eroded
    tiers.push({ x: x + (rand() - 0.5) * r * 0.2, z: z + (rand() - 0.5) * r * 0.2, y: y + h / 2, r, h });
    y += h;
    r *= 0.72 + rand() * 0.12;
  }
  return tiers;
}

export const MESA_TIERS: Tier[] = (() => {
  const rand = seeded(31);
  const out: Tier[] = [];

  // the ring: along each edge, set back so the cliff face sits on the wall
  for (let side = 0; side < 4; side++) {
    for (let s = -HALF - 6; s <= HALF + 6; s += 6 + rand() * 4) {
      const r = 3.5 + rand() * 3;
      const offset = HALF + r * 0.7 + rand() * 2;
      const [x, z] =
        side === 0 ? [s, -offset] : side === 1 ? [s, offset] : side === 2 ? [-offset, s] : [offset, s];
      // the camera sits off the -X / +Z corner, so mesas on those two edges
      // stand between it and the truck: keep them low enough to see over
      const nearCamera = side === 1 || side === 2;
      const height = nearCamera ? 1.6 + rand() * 1.6 : 4 + rand() * 6;
      out.push(...mesa(x, z, r, height, rand));
    }
  }

  // the canyon: two rows of mesas either side of the diagonal corridor
  const { from, to, width } = LANDMARKS.canyon;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const dx = (to[0] - from[0]) / len;
  const dz = (to[1] - from[1]) / len;
  for (let s = 2; s < len; s += 4.5) {
    for (const side of [-1, 1]) {
      const r = 2.6 + rand() * 1.4;
      const off = width / 2 + r * 0.9;
      const x = from[0] + dx * s + -dz * off * side;
      const z = from[1] + dz * s + dx * off * side;
      // walls a little lower than the outer cliffs, so the camera sees in
      out.push(...mesa(x, z, r, 3 + rand() * 2.2, rand));
    }
  }
  return out;
})();

/* ── dunes: caps of big buried spheres ── */

export const DUNES = (() => {
  const rand = seeded(11);
  const out: { x: number; z: number; r: number; h: number }[] = [];
  let tries = 0;
  while (out.length < 24 && tries++ < 3000) {
    const [x, z] = randomPoint(rand, 6);
    const r = 5 + rand() * 6;
    if (!isClear(x, z, r * 0.65)) continue;
    out.push({ x, z, r, h: 0.8 + rand() * 1.2 });
  }
  return out;
})();

export const ROCKS = (() => {
  const rand = seeded(23);
  const out: { x: number; z: number; s: number; yaw: number; v: number }[] = [];
  let tries = 0;
  while (out.length < 32 && tries++ < 3000) {
    const [x, z] = randomPoint(rand, 4);
    if (!isClear(x, z, 1.5)) continue;
    out.push({ x, z, s: 0.5 + rand() * 1.3, yaw: rand() * Math.PI, v: Math.floor(rand() * 3) });
  }
  return out;
})();

/* ── breakable scatter ── */

function scatter(seed: number, count: number, margin: number) {
  const rand = seeded(seed);
  const out: { x: number; z: number; r: number }[] = [];
  let tries = 0;
  while (out.length < count && tries++ < 3000) {
    const [x, z] = randomPoint(rand, 4);
    if (!isClear(x, z, margin)) continue;
    // and clear of everything already placed by this scatter
    if (out.some((o) => Math.hypot(o.x - x, o.z - z) < margin * 2 + 1)) continue;
    out.push({ x, z, r: rand() });
  }
  return out;
}

export const CACTI = scatter(5, 50, 1);
export const CRATE_STACKS = scatter(61, 12, 2);
export const BARREL_CLUSTERS = scatter(71, 12, 2.5);

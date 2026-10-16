// ─────────────────────────────────────────────────────────────────────────────
// Where each section's landmark stands and which way it faces, and the spots
// that open its card.
//
// Every landmark is built in its own local frame: +X points out of its front,
// toward the end of the road that leads to it, +Z across, +Y up. `frameOf`
// turns that into world space. A spot is where the truck has to stop to open
// a card; its camera shot (`cam` looking at `look`, both local) is the swoop
// the arrival plays. One spot per section.
// ─────────────────────────────────────────────────────────────────────────────

import { Vector3 } from "three";
import { ROADS, ZONES, type ZoneId } from "../../config";

type V3 = [number, number, number];

export type Frame = {
  id: ZoneId;
  color: string;
  /** the landmark's origin, world x/z */
  at: [number, number];
  /** world-space yaw that turns local +X toward the road */
  yaw: number;
  /** local (x, y, z) → world */
  toWorld: (x: number, y: number, z: number) => Vector3;
};

export function frameOf(id: ZoneId): Frame {
  const zone = ZONES.find((z) => z.id === id)!;
  const at: [number, number] = [zone.position[0], zone.position[2]];
  const road = ROADS.find((r) => r.to === id)!;
  const [ex, ez] = road.points.at(-1)!;
  const len = Math.hypot(ex - at[0], ez - at[1]) || 1;
  const fx = (ex - at[0]) / len;
  const fz = (ez - at[1]) / len;
  return {
    id,
    color: zone.color,
    at,
    yaw: Math.atan2(-fz, fx),
    // local +X → (fx, fz); local +Z → (-fz, fx), the same handedness as three
    toWorld: (x, y, z) => new Vector3(at[0] + fx * x - fz * z, y, at[1] + fz * x + fx * z),
  };
}

/* ── the spots ──────────────────────────────────────────────────────────── */

export type CardKey = { zone: ZoneId };

export type Spot = {
  id: string;
  card: CardKey;
  /** where the truck must stop, world x/z, and how close counts */
  at: [number, number];
  radius: number;
  /** the arrival shot, world space */
  cam: Vector3;
  look: Vector3;
};

type LocalSpot = { id: string; card: CardKey; at: [number, number]; radius: number; cam: V3; look: V3 };

/**
 * In each landmark's local frame: stop spot, camera, and what it looks at.
 *
 * Every shot follows one rule, tuned by eye: the camera stands well out in
 * front and off to the +Z side, and aims a few metres to the right of the
 * landmark — so the landmark and the parked truck fill the left of the frame
 * and the card, which slides in on the right, covers only open sky and sand.
 */
const LOCAL: Record<ZoneId, LocalSpot[]> = {
  about: [{ id: "about", card: { zone: "about" }, at: [3.6, 0], radius: 3.2, cam: [14, 4.6, 8.5], look: [2.2, 1.2, -2.6] }],
  // the launch pad breaks the rule: the camera stands straight out on the
  // open side (-Z, away from the gantry), far and low enough for the whole
  // rocket, and aims past its -X side — so the gantry stands behind it, the
  // truck parks at the left edge and the card covers the fuel tanks
  work: [{ id: "work", card: { zone: "work" }, at: [4.6, -1.4], radius: 3.2, cam: [8.5, 3.4, -23], look: [-4.2, 4.6, 0] }],
  // the mine is the biggest: further back, and higher
  experience: [{ id: "experience", card: { zone: "experience" }, at: [3.4, 0], radius: 3.2, cam: [20, 6.5, 13], look: [0, 2.4, -3.5] }],
  stack: [{ id: "stack", card: { zone: "stack" }, at: [3.6, 0], radius: 3.2, cam: [18, 6, 11], look: [1.2, 1.8, -3.2] }],
  freelance: [{ id: "freelance", card: { zone: "freelance" }, at: [3.6, 0], radius: 3.2, cam: [18, 6, 11], look: [1.2, 2, -3.2] }],
  // low and looking up, so the radio tower climbs out of the top of the frame
  contact: [{ id: "contact", card: { zone: "contact" }, at: [3.6, 0], radius: 3.2, cam: [20, 3.2, 12], look: [1.2, 4.6, -3.6] }],
};

export const SPOTS: Spot[] = ZONES.flatMap((z) => {
  const f = frameOf(z.id);
  return LOCAL[z.id].map((s) => {
    const at = f.toWorld(s.at[0], 0, s.at[1]);
    return {
      id: s.id,
      card: s.card,
      at: [at.x, at.z] as [number, number],
      radius: s.radius,
      cam: f.toWorld(...s.cam),
      look: f.toWorld(...s.look),
    };
  });
});

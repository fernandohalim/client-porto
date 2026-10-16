// ─────────────────────────────────────────────────────────────────────────────
// Map geometry shared by everything that places things: the road curves, and
// one `isClear` test so scattered props never land on a road, a section zone,
// a landmark or the spawn.
// ─────────────────────────────────────────────────────────────────────────────

import { CatmullRomCurve3, Vector3 } from "three";
import { HALF, JUMPS, LANDMARKS, PLAYGROUND, ROADS, ZONES } from "../config";

/** deterministic scatter, so props land in the same place on every load */
export function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

/** a random point inside the drivable square, kept `inset` from the walls */
export function randomPoint(rand: () => number, inset = 4): [number, number] {
  return [
    (rand() * 2 - 1) * (HALF - inset),
    (rand() * 2 - 1) * (HALF - inset),
  ];
}

export const ROAD_WIDTH = 3.4;

export const roadCurves = ROADS.map((r) => ({
  ...r,
  curve: new CatmullRomCurve3(
    r.points.map(([x, z]) => new Vector3(x, 0, z)),
    false,
    "centripetal",
  ),
}));

// dense samples, for distance tests
const roadSamples = roadCurves.flatMap((r) => r.curve.getSpacedPoints(80));

function distToSegment(
  x: number,
  z: number,
  [ax, az]: [number, number],
  [bx, bz]: [number, number],
) {
  const dx = bx - ax;
  const dz = bz - az;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(x - (ax + t * dx), z - (az + t * dz));
}

/** the signpost, on the plaza's edge in the gap between the Work and Contact roads */
export const HUB: [number, number] = [0.85, 7.4];
/** the packed-dirt pit-stop plaza the truck starts on */
export const PLAZA_RADIUS = 6.5;

const LANDMARK_RADII: [[number, number], number][] = [
  [LANDMARKS.oasis, 10],
  [LANDMARKS.gasStation, 8],
  [LANDMARKS.waterTower, 4.5],
  [LANDMARKS.shack, 6],
  [LANDMARKS.windmill, 3],
  [HUB, 3],
  [LANDMARKS.junkyard.at, LANDMARKS.junkyard.radius + 2],
  [PLAYGROUND.billboard, 5],
  ...PLAYGROUND.towers.map((t): [[number, number], number] => [t, 3]),
];

/** a jump's direction of travel, x/z */
export function jumpDirection(heading: number): [number, number] {
  const a = (heading * Math.PI) / 180;
  return [Math.cos(a), -Math.sin(a)];
}

/** how far a jump's run reaches: ramp plus landing zone, metres past its foot */
const JUMP_REACH = 26;
/** and how much straight, open ground it needs in front of it */
const JUMP_RUN_UP = 26;

/** stretches of ground that must stay open: jump runs, the bowling lane, the fuse */
const OPEN_LINES: { from: [number, number]; to: [number, number]; half: number }[] = [
  ...JUMPS.map((j) => {
    const [dx, dz] = jumpDirection(j.heading);
    return {
      // a clear run-up behind the foot (it takes ~20 m to reach speed), then
      // the ramp and the landing
      from: [j.at[0] - dx * JUMP_RUN_UP, j.at[1] - dz * JUMP_RUN_UP] as [number, number],
      to: [j.at[0] + dx * JUMP_REACH, j.at[1] + dz * JUMP_REACH] as [number, number],
      half: j.kind === "dune" ? 6 : 3.5,
    };
  }),
  { from: PLAYGROUND.bowling.from, to: PLAYGROUND.bowling.to, half: 4 },
  ...PLAYGROUND.fuse.slice(1).map((p, i) => ({ from: PLAYGROUND.fuse[i], to: p, half: 2 })),
];

/** shortest distance from a point to any road's centre line */
export function distanceToRoad(x: number, z: number) {
  let best = Infinity;
  for (const p of roadSamples) {
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < best) best = d;
  }
  return best;
}

/**
 * true when a point is clear of roads, zones, landmarks, the canyon, the
 * spawn, and the ground the jumps and set pieces need
 */
export function isClear(x: number, z: number, margin = 1) {
  if (Math.hypot(x, z) < 7 + margin) return false;
  for (const zone of ZONES) {
    if (Math.hypot(x - zone.position[0], z - zone.position[2]) < 7 + margin) return false;
  }
  for (const [[lx, lz], r] of LANDMARK_RADII) {
    if (Math.hypot(x - lx, z - lz) < r + margin) return false;
  }
  const { from, to, width } = LANDMARKS.canyon;
  if (distToSegment(x, z, from, to) < width / 2 + 7 + margin) return false;
  for (const l of OPEN_LINES) {
    if (distToSegment(x, z, l.from, l.to) < l.half + margin) return false;
  }
  for (const p of roadSamples) {
    if (Math.hypot(x - p.x, z - p.z) < ROAD_WIDTH / 2 + margin) return false;
  }
  return true;
}

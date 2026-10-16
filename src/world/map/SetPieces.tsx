"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Set pieces built to be wrecked, out in the open desert past the sections:
//
//   billboard  a giant sign on two legs beside the junkyard road; ram a leg
//              and the whole thing goes over, ram it flat out and it shatters
//   bowling    a straight dirt lane with ten cactus pins racked at the end
//   fuse       a line of explosive barrels just close enough to chain, so
//              one knock ripples all the way down to a stash at the end
//   towers     tall columns of crates that topple when clipped
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { CuboidCollider, CylinderCollider } from "@react-three/rapier";
import { BoxGeometry, CatmullRomCurve3, CylinderGeometry, Vector3 } from "three";
import { PALETTE, PLAYGROUND } from "../config";
import { merge, propMaterial, type Part } from "../geo";
import {
  BARREL,
  CACTUS_HEIGHT,
  CRATE_SIZE,
  cactusGeometries,
  crateGeometry,
  explosiveBarrelGeometry,
} from "../props";
import Breakable from "../destruct/Breakable";

type V3 = [number, number, number];

const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);

/* ── billboard ────────────────────────────────────────────────────────────── */

const BOARD = { width: 6.4, height: 3.2, legs: 2.3, clearance: 3.1 };

const billboardGeometry = (() => {
  const { width: w, height: h, legs, clearance: y0 } = BOARD;
  const yc = y0 + h / 2;
  const front = 0.12;
  const parts: Part[] = [
    // legs, feet, and the catwalk under the board
    ...[-legs, legs].flatMap((x) => [
      { geo: box(0.26, y0 + h, 0.26), color: PALETTE.woodDark, position: [x, (y0 + h) / 2, -0.2] as V3 },
      { geo: box(0.6, 0.3, 1.3), color: PALETTE.woodDark, position: [x, 0.15, -0.2] as V3 },
      { geo: box(0.08, 1.6, 0.08), color: PALETTE.wood, position: [x * 0.5, y0 * 0.55, -0.2] as V3, rotation: [0, 0, x > 0 ? 0.9 : -0.9] as V3 },
    ]),
    { geo: box(w + 0.4, 0.1, 0.7), color: PALETTE.wood, position: [0, y0 - 0.15, 0.1] },
    // the board: a framed panel painted with a desert sunset
    { geo: box(w + 0.2, h + 0.2, 0.2), color: PALETTE.ink, position: [0, yc, 0] },
    { geo: box(w, h, 0.05), color: PALETTE.cream, position: [0, yc, front] },
    { geo: new CylinderGeometry(1.15, 1.15, 0.05, 20, 1, false, Math.PI / 2, Math.PI), color: PALETTE.yellow, position: [0.9, y0 + 1.15, front + 0.02], rotation: [Math.PI / 2, 0, 0] },
  ];
  // sunset stripes across the bottom
  [PALETTE.coral, PALETTE.hazard, PALETTE.violet].forEach((c, i) => {
    parts.push({ geo: box(w, 0.28, 0.05), color: c, position: [0, y0 + 0.2 + i * 0.32, front + 0.03] });
  });
  // and a monster truck in silhouette, front and centre
  const tx = -1.4;
  const ty = y0 + 1.25;
  parts.push(
    { geo: box(1.7, 0.45, 0.04), color: PALETTE.ink, position: [tx, ty + 0.45, front + 0.05] },
    { geo: box(0.8, 0.4, 0.04), color: PALETTE.ink, position: [tx - 0.1, ty + 0.85, front + 0.05] },
    { geo: new CylinderGeometry(0.42, 0.42, 0.04, 12), color: PALETTE.ink, position: [tx - 0.6, ty, front + 0.05], rotation: [Math.PI / 2, 0, 0] },
    { geo: new CylinderGeometry(0.42, 0.42, 0.04, 12), color: PALETTE.ink, position: [tx + 0.6, ty, front + 0.05], rotation: [Math.PI / 2, 0, 0] },
  );
  // two lamps on arms over the top
  for (const x of [-w / 3, w / 3]) {
    parts.push(
      { geo: box(0.06, 0.06, 0.7), color: PALETTE.ink, position: [x, y0 + h + 0.25, 0.35] },
      { geo: box(0.4, 0.15, 0.2), color: PALETTE.steelDark, position: [x, y0 + h + 0.2, 0.7] },
    );
  }
  return merge(parts);
})();

const BILLBOARD_DEBRIS = { count: 10, size: 0.5, colors: [PALETTE.cream, PALETTE.coral, PALETTE.woodDark, PALETTE.yellow] };

function Billboard() {
  const [x, z] = PLAYGROUND.billboard;
  const { width: w, height: h, legs, clearance: y0 } = BOARD;
  return (
    <Breakable
      position={[x, 0.01, z]}
      // the painted face turned toward the camera
      rotation={[0, -Math.PI / 4, 0]}
      geometry={billboardGeometry}
      colliders={
        <>
          {[-legs, legs].map((lx) => (
            <CuboidCollider key={lx} args={[0.13, (y0 + h) / 2, 0.13]} position={[lx, (y0 + h) / 2, -0.2]} density={0.3} />
          ))}
          {/* heavy feet keep it standing until it's hit */}
          {[-legs, legs].map((lx) => (
            <CuboidCollider key={`f${lx}`} args={[0.3, 0.15, 0.65]} position={[lx, 0.15, -0.2]} density={1.2} />
          ))}
          <CuboidCollider args={[w / 2, h / 2, 0.1]} position={[0, y0 + h / 2, 0]} density={0.04} />
        </>
      }
      dynamic
      breakSpeed={9}
      debris={BILLBOARD_DEBRIS}
      dust={PALETTE.sand}
    />
  );
}

/* ── bowling ──────────────────────────────────────────────────────────────── */

const PIN_DEBRIS = { count: 5, size: 0.3, colors: [PALETTE.cactus, PALETTE.cactusDark] };

function Bowling() {
  const { from, to } = PLAYGROUND.bowling;
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  const ux = dx / length;
  const uz = dz / length;
  // lane yaw: local +X along the lane
  const yaw = Math.atan2(-uz, ux);

  const lane = useMemo(() => {
    const parts: Part[] = [
      { geo: box(length + 6, 0.04, 3.6), color: PALETTE.road, position: [length / 2 + 1, 0, 0] },
      // chalked edges, a foul line, and aiming arrows
      { geo: box(length + 6, 0.05, 0.12), color: PALETTE.cream, position: [length / 2 + 1, 0, 1.8] },
      { geo: box(length + 6, 0.05, 0.12), color: PALETTE.cream, position: [length / 2 + 1, 0, -1.8] },
      { geo: box(0.15, 0.05, 3.6), color: PALETTE.hazard, position: [2, 0, 0] },
      // the pin deck, a lighter square at the end
      { geo: box(5, 0.045, 3.6), color: PALETTE.sand, position: [length + 1.5, 0, 0] },
    ];
    for (const s of [-1, 0, 1]) {
      parts.push({ geo: box(0.7, 0.05, 0.12), color: PALETTE.cream, position: [length * 0.55, 0, s * 0.8], rotation: [0, s * 0.5, 0] });
    }
    return merge(parts);
  }, [length]);

  const pins = useMemo(() => {
    const out: V3[] = [];
    // the head pin nearest the bowler, then rows of two, three, four
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i <= row; i++) {
        const along = length + row * 1.05;
        const across = (i - row / 2) * 1.1;
        out.push([from[0] + ux * along - uz * across, 0.01, from[1] + uz * along + ux * across]);
      }
    }
    return out;
  }, [from, length, ux, uz]);

  return (
    <>
      <mesh geometry={lane} material={propMaterial} position={[from[0], 0.03, from[1]]} rotation={[0, yaw, 0]} receiveShadow />
      {pins.map((p, i) => (
        <Breakable
          key={i}
          position={p}
          rotation={[0, i * 1.7, 0]}
          geometry={cactusGeometries[i % cactusGeometries.length]}
          colliders={<CylinderCollider args={[CACTUS_HEIGHT / 2, 0.28]} position={[0, CACTUS_HEIGHT / 2, 0]} density={0.08} />}
          dynamic
          // a solid hit bowls them over; only a flat-out one splits them
          breakSpeed={8}
          debris={PIN_DEBRIS}
          sound="plant"
          dust={PALETTE.sand}
        />
      ))}
    </>
  );
}

/* ── the barrel fuse ──────────────────────────────────────────────────────── */

const FUSE_SPACING = 3; // m — inside the blast radius, so each sets off the next
const BARREL_DEBRIS = { count: 5, size: 0.28, colors: [PALETTE.hazard, PALETTE.ink, PALETTE.yellow] };

function Fuse() {
  const barrels = useMemo(() => {
    const curve = new CatmullRomCurve3(
      PLAYGROUND.fuse.map(([x, z]) => new Vector3(x, 0, z)),
      false,
      "centripetal",
    );
    const n = Math.max(2, Math.round(curve.getLength() / FUSE_SPACING));
    const out: V3[] = curve.getSpacedPoints(n).map((p) => [p.x, 0, p.z]);
    // the stash at the far end
    const [ex, ez] = PLAYGROUND.fuse.at(-1)!;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      out.push([ex + 1.8 + Math.cos(a) * 0.85, 0, ez - 1.2 + Math.sin(a) * 0.85]);
    }
    out.push([ex + 1.8, 0, ez - 1.2]);
    return out;
  }, []);

  return (
    <>
      {barrels.map(([x, , z], i) => (
        <Breakable
          key={i}
          position={[x, BARREL.height / 2 + 0.01, z]}
          geometry={explosiveBarrelGeometry}
          colliders={<CylinderCollider args={[BARREL.height / 2, BARREL.radius]} density={0.15} />}
          dynamic
          breakSpeed={2}
          explosive
          debris={BARREL_DEBRIS}
          sound="metal"
        />
      ))}
    </>
  );
}

/* ── crate towers ─────────────────────────────────────────────────────────── */

const CRATE_DEBRIS = { count: 6, size: 0.3, colors: [PALETTE.wood, PALETTE.woodDark] };
const TOWER_HEIGHT = 5;

function Towers() {
  const crates = useMemo(() => {
    const s = CRATE_SIZE + 0.01;
    const out: { at: V3; yaw: number }[] = [];
    PLAYGROUND.towers.forEach(([x, z]) => {
      for (let level = 0; level < TOWER_HEIGHT; level++) {
        for (const [a, b] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) {
          out.push({ at: [x + a * s, CRATE_SIZE / 2 + level * s + 0.01, z + b * s], yaw: 0 });
        }
      }
    });
    return out;
  }, []);

  return (
    <>
      {crates.map((c, i) => (
        <Breakable
          key={i}
          position={c.at}
          rotation={[0, c.yaw, 0]}
          geometry={crateGeometry}
          colliders={<CuboidCollider args={[CRATE_SIZE / 2, CRATE_SIZE / 2, CRATE_SIZE / 2]} density={0.15} />}
          dynamic
          breakSpeed={3.5}
          debris={CRATE_DEBRIS}
        />
      ))}
    </>
  );
}

export default function SetPieces() {
  return (
    <>
      <Billboard />
      <Bowling />
      <Fuse />
      <Towers />
    </>
  );
}

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The junkyard, off the Work road at the end of its own branch: a ring of
// corrugated fence with a gate, wrecked cars to shove around (and, hit hard
// enough, scatter), a three-high stack of them waiting to be toppled, a tyre
// mountain, and a crusher with towers of crushed-car cubes beside it. A few
// fuel drums make sure it all ends in fire.
//
// Everything is placed in the yard's own frame: `f` runs from the gate (-) to
// the back fence (+), `s` across it. The road's last point fixes the gate.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import { BoxGeometry, CircleGeometry, CylinderGeometry } from "three";
import { LANDMARKS, PALETTE, ROADS } from "../config";
import { merge, propMaterial, type Part } from "../geo";
import { BARREL, explosiveBarrelGeometry } from "../props";
import Breakable from "../destruct/Breakable";
import { seeded } from "./layout";

type V3 = [number, number, number];

const { at: CENTRE, radius: RADIUS } = LANDMARKS.junkyard;

// the gate faces the end of the junkyard road
const roadEnd = ROADS.find((r) => r.to === "junkyard")!.points.at(-1)!;
const GATE_ANGLE = Math.atan2(roadEnd[1] - CENTRE[1], roadEnd[0] - CENTRE[0]);
const INWARD: [number, number] = [-Math.cos(GATE_ANGLE), -Math.sin(GATE_ANGLE)];
const ACROSS: [number, number] = [-INWARD[1], INWARD[0]];
/** yaw that turns an object's +X to point from the gate into the yard */
const YAW_IN = Math.atan2(-INWARD[1], INWARD[0]);

/** yard frame → world x/z */
function yard(f: number, s: number): [number, number] {
  return [CENTRE[0] + INWARD[0] * f + ACROSS[0] * s, CENTRE[1] + INWARD[1] * f + ACROSS[1] * s];
}

const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);

/* ── fence: corrugated sheet panels on posts ────────────────────────────── */

const PANEL = { width: 2.9, height: 2.1 };
const PANEL_TINTS = [
  [PALETTE.steel, PALETTE.steelDark],
  [PALETTE.rust, PALETTE.rustDark],
  ["#7fa6a0", "#5d807b"],
];
const panelGeometries = PANEL_TINTS.map(([light, dark]) => {
  const { width: w, height: h } = PANEL;
  const parts: Part[] = [];
  // corrugation: alternating ribs, every other one standing proud
  const ribs = 10;
  for (let i = 0; i < ribs; i++) {
    parts.push({
      geo: box(w / ribs + 0.01, h, 0.05),
      color: i % 2 ? dark : light,
      position: [(i + 0.5) * (w / ribs) - w / 2, h / 2 + 0.15, i % 2 ? 0.04 : 0],
    });
  }
  // a rust bloom along the bottom, and the posts
  parts.push({ geo: box(w * 0.4, 0.35, 0.07), color: PALETTE.rustDark, position: [w * 0.15, 0.4, 0.02] });
  for (const x of [-w / 2, w / 2]) {
    parts.push({ geo: box(0.12, h + 0.3, 0.12), color: PALETTE.woodDark, position: [x, (h + 0.3) / 2, -0.06] });
  }
  return merge(parts);
});
const PANEL_DEBRIS = { count: 5, size: 0.4, colors: [PALETTE.steel, PALETTE.rust, PALETTE.steelDark] };

function Fence() {
  const panels = useMemo(() => {
    const out: { at: V3; yaw: number; tint: number }[] = [];
    const n = Math.round((Math.PI * 2 * RADIUS) / PANEL.width);
    const rand = seeded(97);
    for (let i = 0; i < n; i++) {
      const a = GATE_ANGLE + ((i + 0.5) / n) * Math.PI * 2;
      // leave the two panels either side of the gate angle open
      const fromGate = Math.abs(Math.atan2(Math.sin(a - GATE_ANGLE), Math.cos(a - GATE_ANGLE)));
      if (fromGate < 0.25) continue;
      const x = CENTRE[0] + Math.cos(a) * RADIUS;
      const z = CENTRE[1] + Math.sin(a) * RADIUS;
      // tangent to the ring, with a little lean so it looks put up by hand
      out.push({ at: [x, 0, z], yaw: -a + Math.PI / 2 + (rand() - 0.5) * 0.08, tint: Math.floor(rand() * 3) });
    }
    return out;
  }, []);

  return (
    <>
      {panels.map((p, i) => (
        <Breakable
          key={i}
          position={p.at}
          rotation={[0, p.yaw, 0]}
          geometry={panelGeometries[p.tint]}
          colliders={<CuboidCollider args={[PANEL.width / 2, PANEL.height / 2, 0.1]} position={[0, PANEL.height / 2 + 0.15, 0]} />}
          breakSpeed={4}
          debris={PANEL_DEBRIS}
          sound="metal"
          dust={PALETTE.steel}
        />
      ))}
    </>
  );
}

/** the gateposts and a striped sign over the way in */
function Gate() {
  const [gx, gz] = yard(-RADIUS, 0);
  const geometry = useMemo(() => {
    const parts: Part[] = [];
    for (const s of [-2.9, 2.9]) {
      parts.push({ geo: box(0.3, 4.2, 0.3), color: PALETTE.woodDark, position: [0, 2.1, s] });
    }
    parts.push({ geo: box(0.2, 0.9, 6.2), color: PALETTE.cream, position: [0, 3.7, 0] });
    for (let i = 0; i < 6; i++) {
      parts.push({ geo: box(0.22, 0.9, 0.45), color: i % 2 ? PALETTE.ink : PALETTE.yellow, position: [0, 3.7, -2.6 + i * 1.04] });
    }
    parts.push({ geo: box(0.24, 0.5, 2.6), color: PALETTE.coral, position: [0, 3.7, 0] });
    return merge(parts);
  }, []);
  return (
    <RigidBody type="fixed" colliders={false} position={[gx, 0, gz]} rotation={[0, YAW_IN, 0]}>
      {[-2.9, 2.9].map((s) => (
        <CuboidCollider key={s} args={[0.15, 2.1, 0.15]} position={[0, 2.1, s]} />
      ))}
      <mesh geometry={geometry} material={propMaterial} castShadow receiveShadow />
    </RigidBody>
  );
}

/* ── wrecked cars ─────────────────────────────────────────────────────────── */

const CAR = { length: 2.3, width: 1.1, body: 0.55, cabin: 0.45, ride: 0.32 };
const CAR_PAINTS = ["#d9785f", "#5fa8a0", "#d8b04a", "#8c7bd1", "#c9c2b2"];
const carGeometries = CAR_PAINTS.map((paint, v) => {
  const { length: l, width: w, body: b, cabin: c, ride: r } = CAR;
  const parts: Part[] = [
    { geo: box(l, b, w), color: paint, position: [0, r + b / 2, 0] },
    { geo: box(l * 0.5, c, w * 0.9), color: paint, position: [-l * 0.08, r + b + c / 2, 0] },
    // windows: dark bands, one smashed out
    { geo: box(l * 0.52, c * 0.6, w * 0.92), color: PALETTE.ink, position: [-l * 0.08, r + b + c * 0.5, 0] },
    { geo: box(0.05, c * 0.6, w * 0.8), color: v % 2 ? "#6b7480" : PALETTE.ink, position: [l * 0.18, r + b + c * 0.5, 0] },
    // bumpers and rust
    { geo: box(0.1, 0.16, w * 1.02), color: PALETTE.steel, position: [l / 2, r + 0.12, 0] },
    { geo: box(0.1, 0.16, w * 1.02), color: PALETTE.steel, position: [-l / 2, r + 0.12, 0] },
    { geo: box(l * 0.35, b * 0.5, w * 1.01), color: PALETTE.rust, position: [l * (v % 2 ? 0.25 : -0.28), r + b * 0.35, 0] },
    { geo: box(l * 0.2, 0.03, w * 0.5), color: PALETTE.rust, position: [l * 0.3, r + b + 0.01, 0.1] },
  ];
  // three wheels left on, at most
  [[0.7, 1], [0.7, -1], [-0.7, 1], [-0.7, -1]].forEach(([x, side], i) => {
    if (i === v % 4) return;
    parts.push({
      geo: new CylinderGeometry(0.3, 0.3, 0.22, 9),
      color: PALETTE.tire,
      position: [x * l * 0.5, 0.3, side * (w / 2)],
      rotation: [Math.PI / 2, 0, 0],
    });
  });
  return merge(parts);
});
const CAR_DEBRIS = { count: 8, size: 0.45, colors: [PALETTE.rust, PALETTE.steel, PALETTE.ink, PALETTE.tire] };

function carColliders() {
  const { length: l, width: w, body: b, cabin: c, ride: r } = CAR;
  return (
    <>
      <CuboidCollider args={[l / 2, (b + r) / 2, w / 2]} position={[0, (b + r) / 2, 0]} density={0.12} />
      <CuboidCollider args={[l * 0.25, c / 2, w * 0.45]} position={[-l * 0.08, r + b + c / 2, 0]} density={0.08} />
    </>
  );
}

function Wreck({ at, y = 0, yaw, paint }: { at: [number, number]; y?: number; yaw: number; paint: number }) {
  return (
    <Breakable
      position={[at[0], y + 0.01, at[1]]}
      rotation={[0, yaw, 0]}
      geometry={carGeometries[paint % carGeometries.length]}
      colliders={carColliders()}
      dynamic
      // a hard, fast ram scatters it; anything slower just shoves it
      breakSpeed={9.5}
      debris={CAR_DEBRIS}
      sound="metal"
      dust={PALETTE.oil}
    />
  );
}

const WRECKS: [number, number, number][] = [
  [-5.5, 4, 0.3],
  [-6, -3.5, 1.9],
  [-1.5, 1, 1.2],
  [2.5, -2, 2.6],
  [-2, -6, 0.8],
];
const STACK_AT: [number, number] = [2.5, -7.5];

/* ── tyre mountain ────────────────────────────────────────────────────────── */

const TYRE = { radius: 0.45, height: 0.3 };
const tyreGeometry = merge([
  { geo: new CylinderGeometry(TYRE.radius, TYRE.radius, TYRE.height, 12), color: PALETTE.tire },
  { geo: new CylinderGeometry(TYRE.radius * 0.5, TYRE.radius * 0.5, TYRE.height + 0.02, 8), color: "#4a4450" },
]);
const TYRE_DEBRIS = { count: 3, size: 0.3, colors: [PALETTE.tire] };

function TyreMountain() {
  const tyres = useMemo(() => {
    const [cx, cz] = yard(1, 7.5);
    const out: V3[] = [];
    // rings of seven, four, then one on top
    const layers = [
      { n: 7, r: 0.95 },
      { n: 4, r: 0.5 },
      { n: 1, r: 0 },
    ];
    layers.forEach(({ n, r }, layer) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + layer;
        out.push([cx + Math.cos(a) * r, TYRE.height / 2 + layer * (TYRE.height + 0.01) + 0.01, cz + Math.sin(a) * r]);
      }
    });
    return out;
  }, []);
  return (
    <>
      {tyres.map((p, i) => (
        <Breakable
          key={i}
          position={p}
          geometry={tyreGeometry}
          colliders={<CylinderCollider args={[TYRE.height / 2, TYRE.radius]} density={0.1} />}
          dynamic
          // rubber doesn't break; only a blast gets rid of a tyre
          breakSpeed={99}
          debris={TYRE_DEBRIS}
          sound="plant"
          dust={PALETTE.tire}
        />
      ))}
    </>
  );
}

/* ── the crusher, and what it made ────────────────────────────────────────── */

function Crusher() {
  const [x, z] = yard(8.5, 0);
  const geometry = useMemo(
    () =>
      merge([
        // the bed, the four columns, the press plate and its ram
        { geo: box(3, 0.8, 2.6), color: PALETTE.steelDark, position: [0, 0.4, 0] },
        ...[[-1.3, -1.1], [-1.3, 1.1], [1.3, -1.1], [1.3, 1.1]].map(([cx, cz]) => ({
          geo: box(0.3, 3.6, 0.3),
          color: PALETTE.yellow,
          position: [cx, 2.2, cz] as V3,
        })),
        { geo: box(2.4, 0.4, 2.1), color: PALETTE.steel, position: [0, 2.3, 0] },
        { geo: box(3.2, 0.5, 2.8), color: PALETTE.yellow, position: [0, 4.1, 0] },
        { geo: new CylinderGeometry(0.25, 0.25, 1.6, 8), color: PALETTE.chrome, position: [0, 3.2, 0] },
        // hazard stripes on the bed
        ...[0, 1, 2, 3, 4].map((i) => ({
          geo: box(0.3, 0.2, 0.02),
          color: i % 2 ? PALETTE.ink : PALETTE.yellow,
          position: [-1.2 + i * 0.6, 0.55, -1.31] as V3,
          rotation: [0, 0, 0.6] as V3,
        })),
        // a car, mid-crush
        { geo: box(2.2, 0.35, 1.2), color: CAR_PAINTS[1], position: [0, 0.98, 0] },
        { geo: box(2.2, 0.08, 1.25), color: PALETTE.rust, position: [0, 1.18, 0] },
        // the control box
        { geo: box(0.6, 1.2, 0.5), color: PALETTE.coral, position: [1.9, 0.6, 1.2] },
      ]),
    [],
  );
  return (
    <RigidBody type="fixed" colliders={false} position={[x, 0, z]} rotation={[0, YAW_IN, 0]}>
      <CuboidCollider args={[1.5, 0.6, 1.3]} position={[0, 0.6, 0]} />
      <CuboidCollider args={[1.6, 0.25, 1.4]} position={[0, 4.1, 0]} />
      {[[-1.3, -1.1], [-1.3, 1.1], [1.3, -1.1], [1.3, 1.1]].map(([cx, cz], i) => (
        <CuboidCollider key={i} args={[0.15, 1.8, 0.15]} position={[cx, 2.2, cz]} />
      ))}
      <mesh geometry={geometry} material={propMaterial} castShadow receiveShadow />
    </RigidBody>
  );
}

const CUBE = 0.95;
const cubeGeometries = CAR_PAINTS.map((paint) =>
  merge([
    { geo: box(CUBE, CUBE, CUBE), color: paint },
    // crumpled seams and a flash of rust on each face
    { geo: box(CUBE + 0.02, 0.08, CUBE + 0.02), color: PALETTE.steelDark, position: [0, 0.15, 0] },
    { geo: box(CUBE * 0.5, CUBE * 0.4, CUBE + 0.02), color: PALETTE.rust, position: [0.15, -0.2, 0] },
    { geo: box(CUBE + 0.02, CUBE * 0.3, CUBE * 0.35), color: PALETTE.ink, position: [0, -0.25, 0.2] },
  ]),
);
const CUBE_DEBRIS = { count: 6, size: 0.35, colors: [PALETTE.rust, PALETTE.steel, ...CAR_PAINTS.slice(0, 3)] };

function CubeTowers() {
  const cubes = useMemo(() => {
    const rand = seeded(131);
    const out: { at: V3; yaw: number; paint: number }[] = [];
    for (const [f, s, high] of [[5.5, 4, 4], [5.5, -4, 3]] as const) {
      const [x, z] = yard(f, s);
      for (let i = 0; i < high; i++) {
        out.push({
          at: [x + (rand() - 0.5) * 0.12, CUBE / 2 + i * (CUBE + 0.01) + 0.01, z + (rand() - 0.5) * 0.12],
          yaw: YAW_IN + (rand() - 0.5) * 0.3,
          paint: Math.floor(rand() * cubeGeometries.length),
        });
      }
    }
    return out;
  }, []);
  return (
    <>
      {cubes.map((c, i) => (
        <Breakable
          key={i}
          position={c.at}
          rotation={[0, c.yaw, 0]}
          geometry={cubeGeometries[c.paint]}
          colliders={<CuboidCollider args={[CUBE / 2, CUBE / 2, CUBE / 2]} density={0.12} />}
          dynamic
          breakSpeed={6}
          debris={CUBE_DEBRIS}
          sound="metal"
          dust={PALETTE.oil}
        />
      ))}
    </>
  );
}

/* ── fuel drums, the floor, and the whole yard ───────────────────────────── */

const DRUM_DEBRIS = { count: 5, size: 0.28, colors: [PALETTE.hazard, PALETTE.ink, PALETTE.yellow] };

function Drums() {
  const drums = useMemo(() => {
    const out: V3[] = [];
    for (const [f, s] of [[-7, 7.5], [4, 8.8], [-8, -7]] as const) {
      const [x, z] = yard(f, s);
      for (let i = 0; i < 3; i++) {
        const a = i * 2.1 + f;
        out.push([x + Math.cos(a) * 0.75, BARREL.height / 2 + 0.01, z + Math.sin(a) * 0.75]);
      }
    }
    return out;
  }, []);
  return (
    <>
      {drums.map((p, i) => (
        <Breakable
          key={i}
          position={p}
          geometry={explosiveBarrelGeometry}
          colliders={<CylinderCollider args={[BARREL.height / 2, BARREL.radius]} density={0.15} />}
          dynamic
          breakSpeed={2}
          explosive
          debris={DRUM_DEBRIS}
          sound="metal"
        />
      ))}
    </>
  );
}

/** packed, oil-stained dirt inside the fence */
function Floor() {
  const geometry = useMemo(() => {
    const rand = seeded(149);
    const parts: Part[] = [
      { geo: new CircleGeometry(RADIUS + 0.6, 32), color: PALETTE.road, rotation: [-Math.PI / 2, 0, 0] },
    ];
    for (let i = 0; i < 9; i++) {
      const a = rand() * Math.PI * 2;
      const d = rand() * (RADIUS - 2);
      parts.push({
        geo: new CircleGeometry(0.6 + rand() * 1.2, 9),
        color: rand() > 0.5 ? PALETTE.oil : PALETTE.track,
        position: [Math.cos(a) * d, 0.005 + i * 0.001, Math.sin(a) * d],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [1, 0.6 + rand() * 0.4, 1],
      });
    }
    return merge(parts);
  }, []);
  return <mesh geometry={geometry} material={propMaterial} position={[CENTRE[0], 0.05, CENTRE[1]]} receiveShadow />;
}

export default function Junkyard() {
  return (
    <>
      <Floor />
      <Fence />
      <Gate />
      {WRECKS.map(([f, s, yaw], i) => (
        <Wreck key={i} at={yard(f, s)} yaw={YAW_IN + yaw} paint={i} />
      ))}
      {/* the stack: three cars high, slightly off true */}
      {[0, 1, 2].map((i) => (
        <Wreck
          key={`stack-${i}`}
          at={yard(STACK_AT[0] + (i - 1) * 0.12, STACK_AT[1])}
          y={i * (CAR.ride + CAR.body + CAR.cabin + 0.02)}
          yaw={YAW_IN + 0.2 + i * 0.15}
          paint={i + 2}
        />
      ))}
      <TyreMountain />
      <Crusher />
      <CubeTowers />
      <Drums />
    </>
  );
}

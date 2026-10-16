"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The six section landmarks — each one a place you can spot from across the
// desert and drive up to:
//
//   About       a campsite: tent, campfire with a smoke column, camp chairs
//   Work        a rocket launch pad: rocket, gantry, fuel tanks, steam
//   Experience  an old mine: a timber portal in a rock hill, a headframe,
//               rails, and an ore cart per role
//   Stack       a tool shed with crates stencilled by group, a giant wrench
//   Freelance   a roadside diner with a tall sign
//   Contact     a radio tower with a blinking beacon, a hut and a mailbox
//
// Built in each landmark's own frame (see frame.ts): +X is its front, facing
// the road in. Each is one merged mesh — one draw call — in a fixed body with
// a few box colliders for the solid parts.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import {
  BoxGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  SphereGeometry,
  Vector3,
  type BufferGeometry,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { PALETTE, type ZoneId } from "../../config";
import { aimEuler, merge, propMaterial, type Part } from "../../geo";
import { emit } from "../../fx/pool";
import { STACK_GROUPS } from "@/content/portfolio";
import { frameOf } from "./frame";

type V3 = [number, number, number];

const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);
const cyl = (rt: number, rb: number, h: number, seg = 8) => new CylinderGeometry(rt, rb, h, seg);
const stone = (r: number) => new DodecahedronGeometry(r, 0);
/** a triangular prism along X, one edge up: a tent, a roof ridge */
const prismX = (r: number, len: number) => cyl(r, r, len, 3);
const PRISM_X: V3 = [-Math.PI / 2, 0, Math.PI / 2];
const PRISM_Z: V3 = [-Math.PI / 2, 0, 0];
/** a flat disc on the ground */
const disc = (r: number, color: string, at: V3 = [0, 0.04, 0], seg = 24): Part => ({
  geo: new CircleGeometry(r, seg),
  color,
  position: at,
  rotation: [-Math.PI / 2, 0, 0],
});

const DIRT = "#c99467";
const CONCRETE = "#d8cdbd";
const PLANK = "#e3c9a0";

/** a landmark: its mesh and colliders in a fixed body, turned to face its road */
function Placed({ id, geometry, children }: { id: ZoneId; geometry: BufferGeometry; children?: ReactNode }) {
  const f = useMemo(() => frameOf(id), [id]);
  return (
    <RigidBody type="fixed" colliders={false} position={[f.at[0], 0, f.at[1]]} rotation={[0, f.yaw, 0]}>
      {children}
      <mesh geometry={geometry} material={propMaterial} castShadow receiveShadow />
    </RigidBody>
  );
}

/* ── About: the campsite ────────────────────────────────────────────────── */

const FIRE: V3 = [1.1, 0, 1.3];

const campsiteGeometry = (() => {
  const parts: Part[] = [disc(5.6, DIRT)];
  // the tent: a coral prism with a dark doorway, and a pole flying a pennant
  parts.push(
    { geo: prismX(1.4, 3.3), color: PALETTE.coral, position: [-2.4, 0.7, -1.3], rotation: PRISM_X },
    { geo: prismX(0.75, 0.06), color: PALETTE.ink, position: [-0.73, 0.38, -1.3], rotation: PRISM_X },
    { geo: cyl(0.04, 0.04, 2.9), color: PALETTE.woodDark, position: [-0.8, 1.45, -1.3] },
    { geo: box(0.55, 0.32, 0.03), color: PALETTE.yellow, position: [-0.5, 2.7, -1.3] },
  );
  // the fire: a ring of stones, crossed logs, flames
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    parts.push({ geo: stone(0.2), color: i % 2 ? PALETTE.rock : PALETTE.rockLight, position: [FIRE[0] + Math.cos(a) * 0.62, 0.12, FIRE[2] + Math.sin(a) * 0.62] });
  }
  parts.push(
    { geo: box(1, 0.16, 0.16), color: PALETTE.woodDark, position: [FIRE[0], 0.12, FIRE[2]], rotation: [0, 0.6, 0] },
    { geo: box(1, 0.16, 0.16), color: PALETTE.wood, position: [FIRE[0], 0.2, FIRE[2]], rotation: [0, -0.7, 0] },
    { geo: new ConeGeometry(0.34, 0.9, 5), color: PALETTE.coral, position: [FIRE[0], 0.6, FIRE[2]] },
    { geo: new ConeGeometry(0.22, 0.65, 5), color: PALETTE.yellow, position: [FIRE[0] + 0.05, 0.55, FIRE[2] + 0.04] },
    { geo: new ConeGeometry(0.1, 0.35, 4), color: PALETTE.cream, position: [FIRE[0] - 0.04, 0.45, FIRE[2] - 0.03] },
  );
  // two camp chairs facing the fire, and a log to sit on
  for (const [x, z, yaw, color] of [[-0.3, 2.7, 0.7, PALETTE.teal], [2.6, 2.5, -0.6, PALETTE.yellow]] as const) {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const at = (lx: number, y: number, lz: number): V3 => [x + lx * c + lz * s, y, z - lx * s + lz * c];
    parts.push(
      { geo: box(0.65, 0.08, 0.6), color, position: at(0, 0.45, 0), rotation: [0, yaw, 0] },
      { geo: box(0.65, 0.6, 0.06), color, position: at(0, 0.78, 0.3), rotation: [-0.25, yaw, 0] },
      ...[[-0.3, -0.27], [0.3, -0.27], [-0.3, 0.27], [0.3, 0.27]].map(([lx, lz]) => ({
        geo: cyl(0.025, 0.025, 0.45, 4),
        color: PALETTE.ink,
        position: at(lx, 0.22, lz),
      })),
    );
  }
  parts.push({ geo: cyl(0.26, 0.26, 1.8, 7), color: PALETTE.woodDark, position: [2.9, 0.26, -0.2], rotation: [Math.PI / 2, 0.3, 0] });
  // string lights from the tent pole to a post across the fire
  const from = new Vector3(-0.8, 2.6, -1.3);
  const to = new Vector3(3.6, 2.4, 3.2);
  parts.push({ geo: cyl(0.05, 0.06, 2.5), color: PALETTE.woodDark, position: [3.6, 1.25, 3.2] });
  const bulbs = [PALETTE.yellow, PALETTE.coral, PALETTE.teal, PALETTE.violet, PALETTE.cream];
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const p = from.clone().lerp(to, t);
    p.y -= Math.sin(Math.PI * t) * 0.5;
    parts.push({ geo: new SphereGeometry(0.08, 5, 4), color: bulbs[i % bulbs.length], position: [p.x, p.y, p.z] });
  }
  // a guitar leaning on the log
  parts.push(
    { geo: new SphereGeometry(0.28, 7, 5), color: PALETTE.wood, position: [3.3, 0.55, -0.9], scale: [1, 1.25, 0.35] },
    { geo: box(0.07, 0.75, 0.05), color: PALETTE.woodDark, position: [3.3, 1.1, -0.9], rotation: [0, 0, -0.2] },
  );
  return merge(parts);
})();

/** smoke drifting up off the fire, visible from across the map */
function Smoke({ at }: { at: Vector3 }) {
  const next = useRef(0);
  const v = useMemo(() => new Vector3(), []);
  const p = useMemo(() => new Vector3(), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (t < next.current) return;
    next.current = t + 0.16;
    p.copy(at).add(v.set((Math.random() - 0.5) * 0.3, 1, (Math.random() - 0.5) * 0.3));
    v.set((Math.random() - 0.5) * 0.4, 1.2 + Math.random() * 0.6, (Math.random() - 0.5) * 0.4);
    emit(p, v, Math.random() > 0.5 ? "#e9dccb" : "#cdbfae", { life: 2.4 + Math.random(), size: 0.45 + Math.random() * 0.35, lift: 0.5 });
    if (Math.random() < 0.35) {
      v.set((Math.random() - 0.5) * 0.8, 2 + Math.random(), (Math.random() - 0.5) * 0.8);
      emit(p, v, PALETTE.yellow, { life: 0.6, size: 0.1, lift: 0.4 });
    }
  });
  return null;
}

function Campsite() {
  const fire = useMemo(() => frameOf("about").toWorld(...FIRE), []);
  return (
    <>
      <Placed id="about" geometry={campsiteGeometry}>
        <CuboidCollider args={[1.65, 0.7, 1.2]} position={[-2.4, 0.7, -1.3]} />
        <CuboidCollider args={[0.9, 0.26, 0.3]} position={[2.9, 0.26, -0.2]} rotation={[0, 0.3, 0]} />
      </Placed>
      <Smoke at={fire} />
    </>
  );
}

/* ── Work: the launch pad ───────────────────────────────────────────────── */

// The gantry and tanks stand on the far side (+Z) from where the game's
// camera looks in, so the rocket is never hidden behind them.
const PAD = { radius: 4.4, height: 0.3 };
const GANTRY: V3 = [1.6, 0, 3.8];
const GANTRY_HEIGHT = 10;
/** the side of the rocket that faces the game's camera, in this frame */
const FACING = new Vector3(-0.76, 0, -0.65).normalize();

const launchPadGeometry = (() => {
  const { radius: r, height: h } = PAD;
  const parts: Part[] = [
    disc(7.5, CONCRETE, [0.5, 0.03, 0]),
    // the pad: an octagon with a hazard-striped rim
    { geo: cyl(r, r + 0.3, h, 8), color: "#bdb4a8", position: [0, h / 2, 0] },
  ];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    parts.push({
      geo: box(0.5, 0.06, 1.4),
      color: i % 2 ? PALETTE.yellow : PALETTE.ink,
      position: [Math.cos(a) * (r - 0.45), h + 0.03, Math.sin(a) * (r - 0.45)],
      rotation: [0, -a, 0],
    });
  }

  // the rocket: fins, nozzle, a banded cream body, portholes, a coral nose
  const y0 = h;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    parts.push({
      geo: box(0.16, 2.3, 1.5),
      color: PALETTE.coral,
      position: [Math.cos(a) * 1.35, y0 + 1.25, Math.sin(a) * 1.35],
      rotation: [0, -a, 0.12],
    });
  }
  parts.push(
    { geo: new ConeGeometry(0.75, 0.9, 12), color: PALETTE.ink, position: [0, y0 + 0.55, 0], rotation: [Math.PI, 0, 0] },
    { geo: cyl(1.1, 1.1, 3.2, 16), color: PALETTE.cream, position: [0, y0 + 2.6, 0] },
    { geo: cyl(1.13, 1.13, 0.5, 16), color: PALETTE.teal, position: [0, y0 + 1.6, 0] },
    { geo: cyl(0.96, 1.1, 2.8, 16), color: PALETTE.cream, position: [0, y0 + 5.6, 0] },
    { geo: cyl(1.12, 1.12, 0.4, 16), color: PALETTE.teal, position: [0, y0 + 4.3, 0] },
    { geo: new ConeGeometry(0.96, 2.3, 16), color: PALETTE.coral, position: [0, y0 + 8.15, 0] },
    { geo: new SphereGeometry(0.18, 8, 6), color: PALETTE.teal, position: [0, y0 + 9.35, 0] },
  );
  // two portholes, on the side the camera sees
  for (const y of [y0 + 5.9, y0 + 3.2]) {
    const out = FACING.clone().multiplyScalar(y > y0 + 4 ? 0.98 : 1.1);
    const tilt = aimEuler(FACING);
    parts.push(
      { geo: cyl(0.46, 0.46, 0.12, 14), color: PALETTE.ink, position: [out.x, y, out.z], rotation: tilt },
      { geo: cyl(0.34, 0.34, 0.16, 14), color: PALETTE.sky, position: [out.x * 1.02, y, out.z * 1.02], rotation: tilt },
    );
  }

  // the gantry: a yellow lattice tower with an arm across to the rocket
  const [gx, , gz] = GANTRY;
  for (const [dx, dz] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) {
    parts.push({ geo: box(0.2, GANTRY_HEIGHT, 0.2), color: PALETTE.steelDark, position: [gx + dx, GANTRY_HEIGHT / 2, gz + dz] });
  }
  for (let y = 1.2; y < GANTRY_HEIGHT; y += 1.4) {
    parts.push(
      { geo: box(1.6, 0.14, 0.14), color: PALETTE.yellow, position: [gx, y, gz - 0.7] },
      { geo: box(1.6, 0.14, 0.14), color: PALETTE.yellow, position: [gx, y, gz + 0.7] },
      { geo: box(0.14, 0.14, 1.6), color: PALETTE.yellow, position: [gx - 0.7, y, gz] },
      { geo: box(0.14, 0.14, 1.6), color: PALETTE.yellow, position: [gx + 0.7, y, gz] },
    );
  }
  const armFrom = new Vector3(gx, 7, gz);
  const armTo = new Vector3(0, 7, 0).addScaledVector(armFrom.clone().setY(0).normalize(), 1.05);
  const arm = armTo.clone().sub(armFrom);
  parts.push(
    { geo: box(0.35, arm.length(), 0.35), color: PALETTE.yellow, position: armFrom.clone().addScaledVector(arm, 0.5).toArray() as V3, rotation: aimEuler(arm) },
    { geo: box(1.8, 0.25, 1.8), color: PALETTE.steelDark, position: [gx, GANTRY_HEIGHT + 0.1, gz] },
  );

  // fuel tanks on cradles, and floodlights trained on the rocket
  for (const z of [3.2, 4.8]) {
    parts.push(
      { geo: cyl(0.7, 0.7, 3.2, 12), color: PALETTE.cream, position: [-3.6, 0.95, z], rotation: [0, 0, Math.PI / 2] },
      { geo: cyl(0.72, 0.72, 0.35, 12), color: PALETTE.teal, position: [-3.6, 0.95, z], rotation: [0, 0, Math.PI / 2] },
      { geo: box(0.3, 0.4, 1.3), color: PALETTE.steelDark, position: [-4.6, 0.2, z] },
      { geo: box(0.3, 0.4, 1.3), color: PALETTE.steelDark, position: [-2.6, 0.2, z] },
    );
  }
  for (const [x, z] of [[3.6, -3.8], [-3.4, -3.6]]) {
    parts.push(
      { geo: cyl(0.07, 0.09, 4.2, 5), color: PALETTE.ink, position: [x, 2.1, z] },
      { geo: box(0.7, 0.5, 0.35), color: PALETTE.yellow, position: [x * 0.92, 4.3, z * 0.92], rotation: [0, Math.atan2(x, z), 0] },
    );
  }
  return merge(parts);
})();

/** steam venting from under the rocket, rolling out across the pad */
function Steam({ at }: { at: Vector3 }) {
  const next = useRef(0);
  const v = useMemo(() => new Vector3(), []);
  const p = useMemo(() => new Vector3(), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (t < next.current) return;
    next.current = t + 0.09;
    const a = Math.random() * Math.PI * 2;
    p.copy(at).add(v.set(Math.cos(a) * 0.8, 0.4, Math.sin(a) * 0.8));
    v.set(Math.cos(a) * (1.6 + Math.random()), 0.4 + Math.random() * 0.5, Math.sin(a) * (1.6 + Math.random()));
    emit(p, v, Math.random() > 0.5 ? "#ffffff" : "#ecebe6", { life: 1.6 + Math.random() * 0.8, size: 0.5 + Math.random() * 0.4, lift: 0.25 });
  });
  return null;
}

function LaunchPad() {
  const base = useMemo(() => frameOf("work").toWorld(0, PAD.height, 0), []);
  return (
    <>
      <Placed id="work" geometry={launchPadGeometry}>
        <CylinderCollider args={[PAD.height / 2, PAD.radius + 0.15]} position={[0, PAD.height / 2, 0]} />
        <CylinderCollider args={[4.6, 1.25]} position={[0, PAD.height + 4.6, 0]} />
        <CuboidCollider args={[0.85, GANTRY_HEIGHT / 2, 0.85]} position={[GANTRY[0], GANTRY_HEIGHT / 2, GANTRY[2]]} />
        <CuboidCollider args={[1.6, 0.8, 1.5]} position={[-3.6, 0.8, 4]} />
      </Placed>
      <Steam at={base} />
    </>
  );
}

/* ── Experience: the mine ───────────────────────────────────────────────── */

const mineGeometry = (() => {
  const parts: Part[] = [
    disc(6, DIRT, [1.5, 0.04, 0]),
    // the hill the mine runs into
    { geo: cyl(5.4, 7, 5, 7), color: PALETTE.rock, position: [-6.2, 2.5, 0] },
    { geo: cyl(3.4, 5.2, 2.2, 7), color: PALETTE.rockLight, position: [-6.8, 6, 0.4] },
    // the portal: dark mouth, timber frame, a yellow sign over it
    { geo: box(2.2, 2.7, 2.6), color: PALETTE.ink, position: [-0.2, 1.35, 0] },
    { geo: box(0.35, 3.1, 0.35), color: PALETTE.woodDark, position: [0.9, 1.55, -1.45] },
    { geo: box(0.35, 3.1, 0.35), color: PALETTE.woodDark, position: [0.9, 1.55, 1.45] },
    { geo: box(0.45, 0.4, 3.6), color: PALETTE.wood, position: [0.9, 3.2, 0] },
    { geo: box(0.12, 0.7, 2.4), color: PALETTE.yellow, position: [1.15, 3.85, 0] },
    { geo: box(0.13, 0.22, 2), color: PALETTE.ink, position: [1.18, 3.85, 0] },
  ];
  // rails out of the mouth, and a spur beside them for the carts
  for (const zRail of [0, 3.6]) {
    for (const s of [-0.45, 0.45]) {
      parts.push({ geo: box(6.5, 0.08, 0.08), color: PALETTE.steel, position: [3.6, 0.12, zRail + s] });
    }
    for (let x = 0.8; x < 6.8; x += 0.7) {
      parts.push({ geo: box(0.18, 0.06, 1.3), color: PALETTE.woodDark, position: [x, 0.07, zRail] });
    }
  }
  // an ore cart per role, heaped with gold
  for (const x of [1.4, 3.2, 5]) {
    parts.push(
      { geo: box(1.3, 0.75, 1.05), color: PALETTE.steelDark, position: [x, 0.6, 3.6] },
      { geo: box(1.36, 0.12, 1.1), color: PALETTE.rust, position: [x, 0.95, 3.6] },
      ...[-0.4, 0.4].flatMap((dx) =>
        [-0.45, 0.45].map((dz) => ({ geo: cyl(0.16, 0.16, 0.08, 8), color: PALETTE.ink, position: [x + dx, 0.2, 3.6 + dz] as V3, rotation: [Math.PI / 2, 0, 0] as V3 })),
      ),
      ...[0, 1, 2, 3].map((k) => ({ geo: stone(0.24), color: k % 2 ? PALETTE.yellow : "#ffd86b", position: [x - 0.3 + k * 0.2, 1.08 + (k % 2) * 0.1, 3.6 + (k % 3) * 0.12 - 0.12] as V3 })),
    );
  }
  // the headframe: an A-frame tower with the winding wheel on top
  const base = [-1.6, 0, -4.6] as V3;
  const top = new Vector3(base[0], 8.2, base[2]);
  for (const [dx, dz] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) {
    const foot = new Vector3(base[0] + dx, 0, base[2] + dz);
    const dir = top.clone().sub(foot);
    parts.push({ geo: box(0.22, dir.length(), 0.22), color: PALETTE.woodDark, position: foot.clone().addScaledVector(dir, 0.5).toArray() as V3, rotation: aimEuler(dir) });
  }
  for (const y of [2.6, 5.2]) {
    const w = 2.4 * (1 - y / 8.2) + 0.3;
    parts.push(
      { geo: box(w, 0.16, 0.16), color: PALETTE.wood, position: [base[0], y, base[2] - w / 2 + 0.1] },
      { geo: box(w, 0.16, 0.16), color: PALETTE.wood, position: [base[0], y, base[2] + w / 2 - 0.1] },
      { geo: box(0.16, 0.16, w), color: PALETTE.wood, position: [base[0] - w / 2 + 0.1, y, base[2]] },
      { geo: box(0.16, 0.16, w), color: PALETTE.wood, position: [base[0] + w / 2 - 0.1, y, base[2]] },
    );
  }
  parts.push(
    { geo: cyl(1.15, 1.15, 0.16, 16), color: PALETTE.steelDark, position: [base[0], 8.4, base[2]], rotation: [Math.PI / 2, 0, 0] },
    { geo: cyl(0.85, 0.85, 0.18, 16), color: PALETTE.yellow, position: [base[0], 8.4, base[2]], rotation: [Math.PI / 2, 0, 0] },
    { geo: cyl(0.2, 0.2, 0.3, 8), color: PALETTE.ink, position: [base[0], 8.4, base[2]], rotation: [Math.PI / 2, 0, 0] },
  );
  // lanterns either side of the mouth
  for (const z of [-2.2, 2.2]) {
    parts.push(
      { geo: cyl(0.06, 0.06, 1.8, 5), color: PALETTE.woodDark, position: [1.6, 0.9, z] },
      { geo: box(0.3, 0.38, 0.3), color: PALETTE.yellow, position: [1.6, 1.95, z] },
    );
  }
  return merge(parts);
})();

function Mine() {
  return (
    <Placed id="experience" geometry={mineGeometry}>
      <CylinderCollider args={[3.5, 6.4]} position={[-6.2, 3.5, 0]} />
      <CuboidCollider args={[1.3, 4.2, 1.3]} position={[-1.6, 4.2, -4.6]} />
      <CuboidCollider args={[2.6, 0.55, 0.6]} position={[3.2, 0.55, 3.6]} />
      <CuboidCollider args={[0.2, 1.6, 1.8]} position={[0.9, 1.6, 0]} />
    </Placed>
  );
}

/* ── Stack: the tool shed ───────────────────────────────────────────────── */

const GROUP_COLORS = [PALETTE.sky, PALETTE.teal, PALETTE.coral, PALETTE.yellow, PALETTE.violet];

const shedGeometry = (() => {
  const parts: Part[] = [
    disc(5.4, DIRT, [1, 0.04, 0]),
    // the shed: plank walls under a sky-blue gable, a door, two windows
    { geo: box(4, 3, 6.2), color: PLANK, position: [-2.6, 1.5, 0] },
    { geo: prismX(2.5, 6.8), color: PALETTE.sky, position: [-2.6, 4.25, 0], rotation: PRISM_Z },
    { geo: box(0.06, 2.2, 1.3), color: PALETTE.ink, position: [-0.58, 1.1, 0] },
    { geo: box(0.06, 0.9, 1), color: PALETTE.sky, position: [-0.58, 1.8, -2] },
    { geo: box(0.06, 0.9, 1), color: PALETTE.sky, position: [-0.58, 1.8, 2] },
    // a sign over the door
    { geo: box(0.15, 0.7, 3.4), color: PALETTE.ink, position: [-0.5, 3.35, 0] },
    { geo: box(0.17, 0.42, 3.1), color: PALETTE.cream, position: [-0.48, 3.35, 0] },
    // a giant wrench leaning on the wall: the shed's landmark
    { geo: box(0.35, 4.4, 0.18), color: PALETTE.chrome, position: [-0.3, 2.3, -2.95], rotation: [0, 0, -0.18] },
    { geo: box(1, 0.9, 0.2), color: PALETTE.chrome, position: [0.12, 4.55, -2.95], rotation: [0, 0, -0.18] },
    { geo: box(0.45, 0.5, 0.22), color: PLANK, position: [0.2, 4.8, -2.95], rotation: [0, 0, -0.18] },
    // a workbench with a vice out front
    { geo: box(1, 0.1, 2.2), color: PALETTE.wood, position: [1.2, 0.95, 3] },
    ...[[0.8, 2.1], [1.6, 2.1], [0.8, 3.9], [1.6, 3.9]].map(([x, z]) => ({ geo: box(0.1, 0.9, 0.1), color: PALETTE.woodDark, position: [x, 0.45, z] as V3 })),
    { geo: box(0.3, 0.25, 0.4), color: PALETTE.steelDark, position: [1.2, 1.13, 2.4] },
  ];
  // a crate per stack group, lids in the group's colour
  const crates: V3[] = [[1.1, 0.35, -2.4], [1.85, 0.35, -2.4], [2.6, 0.35, -2.4], [1.45, 1.06, -2.4], [2.2, 1.06, -2.4]];
  STACK_GROUPS.forEach((_, i) => {
    const at = crates[i % crates.length];
    parts.push(
      { geo: box(0.7, 0.7, 0.7), color: PALETTE.wood, position: at },
      { geo: box(0.72, 0.14, 0.72), color: GROUP_COLORS[i % GROUP_COLORS.length], position: [at[0], at[1] + 0.3, at[2]] },
      { geo: box(0.72, 0.1, 0.1), color: PALETTE.woodDark, position: at, rotation: [0, 0, Math.PI / 4] },
    );
  });
  return merge(parts);
})();

function ToolShed() {
  return (
    <Placed id="stack" geometry={shedGeometry}>
      <CuboidCollider args={[2, 1.5, 3.1]} position={[-2.6, 1.5, 0]} />
      <CuboidCollider args={[0.85, 0.7, 0.4]} position={[1.85, 0.7, -2.4]} />
      <CuboidCollider args={[0.5, 0.5, 1.1]} position={[1.2, 0.5, 3]} />
    </Placed>
  );
}

/* ── Freelance: the diner ───────────────────────────────────────────────── */

const DINER = { length: 8.6, width: 3.6, height: 3 };

const dinerGeometry = (() => {
  const { length: l, width: w, height: h } = DINER;
  const x = -2.4;
  const parts: Part[] = [
    disc(5.6, CONCRETE, [1, 0.04, 0]),
    // the body: a cream box with rounded ends, a pink belt, a window band
    { geo: box(w, h, l), color: PALETTE.cream, position: [x, h / 2 + 0.25, 0] },
    { geo: cyl(w / 2, w / 2, h, 12), color: PALETTE.cream, position: [x, h / 2 + 0.25, l / 2] },
    { geo: cyl(w / 2, w / 2, h, 12), color: PALETTE.cream, position: [x, h / 2 + 0.25, -l / 2] },
    { geo: box(w + 0.06, 0.5, l), color: PALETTE.pink, position: [x, 0.85, 0] },
    { geo: cyl(w / 2 + 0.03, w / 2 + 0.03, 0.5, 12), color: PALETTE.pink, position: [x, 0.85, l / 2] },
    { geo: cyl(w / 2 + 0.03, w / 2 + 0.03, 0.5, 12), color: PALETTE.pink, position: [x, 0.85, -l / 2] },
    { geo: box(w + 0.05, 0.85, l - 1.2), color: PALETTE.ink, position: [x, 2.05, 0] },
    { geo: box(w + 0.3, 0.2, l + 0.4), color: PALETTE.chrome, position: [x, h + 0.35, 0] },
    // the door and its step
    { geo: box(0.06, 2.1, 1.1), color: PALETTE.sky, position: [x + w / 2 + 0.02, 1.3, 0] },
    { geo: box(0.7, 0.25, 1.6), color: PALETTE.chrome, position: [x + w / 2 + 0.35, 0.12, 0] },
    // the tall sign: a pole, a pink-framed board, a star on top
    { geo: cyl(0.12, 0.14, 7.6, 6), color: PALETTE.ink, position: [1.2, 3.8, -4.4] },
    { geo: box(0.3, 1.8, 3.2), color: PALETTE.pink, position: [1.2, 6.6, -4.4] },
    { geo: box(0.32, 1.3, 2.7), color: PALETTE.yellow, position: [1.2, 6.6, -4.4] },
    { geo: box(0.34, 0.3, 2.2), color: PALETTE.coral, position: [1.2, 6.6, -4.4] },
    { geo: new SphereGeometry(0.4, 5, 3), color: PALETTE.yellow, position: [1.2, 7.9, -4.4], scale: [1, 1.2, 1] },
  ];
  // two tables with umbrellas out front
  for (const z of [2.2, 4]) {
    parts.push(
      { geo: cyl(0.5, 0.5, 0.06, 10), color: PALETTE.cream, position: [1.6, 0.85, z] },
      { geo: cyl(0.05, 0.05, 2.2, 5), color: PALETTE.ink, position: [1.6, 1.1, z] },
      { geo: new ConeGeometry(1, 0.5, 8), color: PALETTE.pink, position: [1.6, 2.35, z] },
    );
  }
  return merge(parts);
})();

function Diner() {
  const { length: l, width: w, height: h } = DINER;
  return (
    <Placed id="freelance" geometry={dinerGeometry}>
      <CuboidCollider args={[w / 2, h / 2 + 0.25, l / 2 + w / 2]} position={[-2.4, h / 2 + 0.25, 0]} />
      <CuboidCollider args={[0.15, 3.8, 0.15]} position={[1.2, 3.8, -4.4]} />
    </Placed>
  );
}

/* ── Contact: the radio tower ───────────────────────────────────────────── */

const TOWER: V3 = [-3.4, 0, -3.2];
const TOWER_HEIGHT = 15;

const radioGeometry = (() => {
  const parts: Part[] = [
    disc(5.4, DIRT, [1, 0.04, 0]),
    // the hut, with a dish on its roof
    { geo: box(3, 2.6, 3.4), color: PALETTE.cream, position: [-2.4, 1.3, 2.2] },
    { geo: box(3.4, 0.25, 3.8), color: PALETTE.violet, position: [-2.4, 2.72, 2.2] },
    { geo: box(0.06, 2, 1), color: PALETTE.violet, position: [-0.88, 1, 2.2] },
    { geo: box(0.06, 0.7, 0.9), color: PALETTE.sky, position: [-0.88, 1.7, 3.3] },
    { geo: new ConeGeometry(0.8, 0.35, 10), color: PALETTE.chrome, position: [-2.6, 3.4, 2.6], rotation: [0.5, 0, 0.4] },
    { geo: cyl(0.05, 0.05, 0.6, 4), color: PALETTE.ink, position: [-2.6, 3.0, 2.6] },
    // the mailbox out front, flag up
    { geo: cyl(0.06, 0.06, 1.1, 5), color: PALETTE.woodDark, position: [2.4, 0.55, 2.6] },
    { geo: box(0.75, 0.45, 0.45), color: PALETTE.violet, position: [2.4, 1.3, 2.6] },
    { geo: cyl(0.225, 0.225, 0.75, 10), color: PALETTE.violet, position: [2.4, 1.52, 2.6], rotation: [0, 0, Math.PI / 2] },
    { geo: box(0.05, 0.3, 0.2), color: PALETTE.hazard, position: [2.15, 1.7, 2.86] },
  ];
  // the tower: four legs leaning in, braced in violet and cream bands
  const top = new Vector3(TOWER[0], TOWER_HEIGHT, TOWER[2]);
  for (const [dx, dz] of [[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]]) {
    const foot = new Vector3(TOWER[0] + dx, 0, TOWER[2] + dz);
    const dir = top.clone().sub(foot);
    parts.push({ geo: box(0.16, dir.length(), 0.16), color: PALETTE.steelDark, position: foot.clone().addScaledVector(dir, 0.5).toArray() as V3, rotation: aimEuler(dir) });
  }
  for (let i = 1; i < 6; i++) {
    const y = (i / 6) * TOWER_HEIGHT;
    const w = 2.6 * (1 - y / TOWER_HEIGHT) + 0.15;
    const color = i % 2 ? PALETTE.violet : PALETTE.cream;
    parts.push(
      { geo: box(w, 0.14, 0.14), color, position: [TOWER[0], y, TOWER[2] - w / 2] },
      { geo: box(w, 0.14, 0.14), color, position: [TOWER[0], y, TOWER[2] + w / 2] },
      { geo: box(0.14, 0.14, w), color, position: [TOWER[0] - w / 2, y, TOWER[2]] },
      { geo: box(0.14, 0.14, w), color, position: [TOWER[0] + w / 2, y, TOWER[2]] },
    );
  }
  parts.push({ geo: cyl(0.05, 0.05, 2.2, 4), color: PALETTE.ink, position: [TOWER[0], TOWER_HEIGHT + 1.1, TOWER[2]] });
  return merge(parts);
})();

/** the beacon on top of the tower, blinking */
function Beacon({ at }: { at: Vector3 }) {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const on = clock.elapsedTime % 1.4 < 0.7;
    (m.material as MeshBasicMaterial).color.set(on ? "#ff5a3c" : "#5a2a2a");
  });
  return (
    <mesh ref={mesh} position={at}>
      <sphereGeometry args={[0.32, 8, 6]} />
      <meshBasicMaterial color="#ff5a3c" />
    </mesh>
  );
}

function RadioTower() {
  const beacon = useMemo(() => frameOf("contact").toWorld(TOWER[0], TOWER_HEIGHT + 2.3, TOWER[2]), []);
  return (
    <>
      <Placed id="contact" geometry={radioGeometry}>
        <CuboidCollider args={[1.5, 1.3, 1.7]} position={[-2.4, 1.3, 2.2]} />
        <CuboidCollider args={[1.4, 2, 1.4]} position={[TOWER[0], 2, TOWER[2]]} />
        <CuboidCollider args={[0.4, 0.8, 0.3]} position={[2.4, 0.8, 2.6]} />
      </Placed>
      <Beacon at={beacon} />
    </>
  );
}

export default function SectionLandmarks() {
  return (
    <>
      <Campsite />
      <LaunchPad />
      <Mine />
      <ToolShed />
      <Diner />
      <RadioTower />
    </>
  );
}

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The pit stop: where the truck starts, and the first thing anyone sees.
//
// A packed-dirt plaza that every road fans out of (and whose edge hides the
// roads' ends); a garage shack with an awning, a workbench and tyre stacks; a
// string of flickering bulbs and pennants out to a pole; a windmill turning in
// the wind; and a ring of things to smash right where you start — cones,
// crates and oil drums, none of them explosive this close to the start line.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
} from "@react-three/rapier";
import {
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  MeshBasicMaterial,
  TorusGeometry,
  Vector3,
  type Group,
  type Mesh,
} from "three";
import { LANDMARKS, PALETTE } from "../config";
import { aimEuler, merge, propMaterial, type Part } from "../geo";
import { CRATE_SIZE, crateGeometry } from "../props";
import Breakable from "../destruct/Breakable";
import { PLAZA_RADIUS } from "./layout";

type V3 = [number, number, number];
const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);
const tube = (r: number, len: number, seg = 6) => new CylinderGeometry(r, r, len, seg);

/** a point at `deg` degrees round the plaza (0° = screen-right, 90° = screen-up) */
function onPlaza(deg: number, r: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  const sx = Math.cos(a) * r;
  const up = Math.sin(a) * r;
  // screen axes back to world x/z (the camera looks along +x/-z)
  return [(sx + up) * Math.SQRT1_2, (sx - up) * Math.SQRT1_2];
}

/** yaw that turns a model's +X to face from (x, z) toward (tx, tz) */
const facing = (x: number, z: number, tx: number, tz: number) => Math.atan2(-(tz - z), tx - x);

/* ── the plaza ── */

function Plaza() {
  const geometry = useMemo(
    () =>
      merge([
        // a darker worn rim, then the packed dirt
        { geo: new CylinderGeometry(PLAZA_RADIUS + 0.35, PLAZA_RADIUS + 0.35, 0.02, 40), color: PALETTE.track, position: [0, 0.05, 0] },
        { geo: new CylinderGeometry(PLAZA_RADIUS, PLAZA_RADIUS, 0.02, 40), color: "#d9a26f", position: [0, 0.055, 0] },
        // oil stains where trucks have parked
        { geo: new CylinderGeometry(1.1, 1.1, 0.01, 14), color: "#a87a52", position: [0.8, 0.066, -0.6] },
        { geo: new CylinderGeometry(0.6, 0.6, 0.01, 10), color: "#a87a52", position: [-1.6, 0.066, 1.2] },
      ]),
    [],
  );
  return <mesh geometry={geometry} material={propMaterial} receiveShadow />;
}

/* ── the garage shack ── */

// model space: +X is the front, facing the plaza
const shackGeometry = merge([
  // weathered plank walls, with darker boards for texture
  { geo: box(3.2, 2.5, 4), color: PALETTE.wood, position: [0, 1.25, 0] },
  ...[-1.5, -0.5, 0.5, 1.5].map((z) => ({ geo: box(3.22, 2.5, 0.06), color: PALETTE.woodDark, position: [0, 1.25, z] as V3 })),
  // corrugated tin roof, pitched back
  { geo: box(3.8, 0.12, 4.6), color: "#8f9aa3", position: [0, 2.62, 0], rotation: [0, 0, 0.1] },
  ...[-2, -1, 0, 1, 2].map((z) => ({ geo: box(3.82, 0.06, 0.08), color: "#76828c", position: [0, 2.7, z] as V3, rotation: [0, 0, 0.1] as V3 })),
  // door, window, and the PIT STOP board over them
  { geo: box(0.06, 1.7, 0.9), color: PALETTE.teal, position: [1.61, 0.85, -1.1] },
  { geo: box(0.06, 0.8, 1.1), color: PALETTE.ink, position: [1.61, 1.45, 0.8] },
  { geo: box(0.08, 0.06, 1.2), color: PALETTE.cream, position: [1.63, 1.85, 0.8] },
  { geo: box(0.1, 0.55, 3.2), color: PALETTE.coral, position: [1.7, 2.25, 0] },
  { geo: box(0.12, 0.12, 3.0), color: PALETTE.yellow, position: [1.72, 2.25, 0] },
  // awning out front on two posts, over a workbench
  { geo: box(2.4, 0.08, 4.2), color: "#a5b0b8", position: [2.8, 2.2, 0], rotation: [0, 0, -0.12] },
  ...[1.85, -1.85].map((z) => ({ geo: tube(0.07, 2.1), color: PALETTE.woodDark, position: [3.85, 1.05, z] as V3 })),
  { geo: box(0.7, 0.08, 2), color: PALETTE.woodDark, position: [2.0, 0.9, 0.4] },
  ...[-0.5, 1.3].map((z) => ({ geo: box(0.08, 0.9, 0.08), color: PALETTE.woodDark, position: [2.0, 0.45, z] as V3 })),
  { geo: box(0.4, 0.25, 0.3), color: PALETTE.hazard, position: [2.0, 1.07, 1.0] },
  { geo: box(0.06, 0.9, 1.6), color: "#6b4a33", position: [1.64, 1.5, 0.4] },
  // a gas can and a spare wheel leaning on the wall
  { geo: box(0.25, 0.35, 0.18), color: PALETTE.hazard, position: [1.8, 0.18, -1.8] },
  { geo: new TorusGeometry(0.4, 0.17, 6, 12), color: PALETTE.tire, position: [1.75, 0.45, 1.7], rotation: [0, Math.PI / 2, 0.15] },
]);

function Shack() {
  const [x, z] = LANDMARKS.shack;
  const yaw = facing(x, z, 0, 0);
  return (
    <RigidBody type="fixed" colliders={false} position={[x, 0, z]} rotation={[0, yaw, 0]}>
      <CuboidCollider args={[1.6, 1.3, 2]} position={[0, 1.3, 0]} />
      <CylinderCollider args={[1.05, 0.1]} position={[3.85, 1.05, 1.85]} />
      <CylinderCollider args={[1.05, 0.1]} position={[3.85, 1.05, -1.85]} />
      <mesh geometry={shackGeometry} material={propMaterial} castShadow receiveShadow />
    </RigidBody>
  );
}

/* ── string lights and pennants, from the awning out to a pole ── */

const bulbMaterial = new MeshBasicMaterial({ color: new Color(2.6, 2.0, 1.0), toneMapped: false });
const PENNANT_COLORS = [PALETTE.coral, PALETTE.yellow, PALETTE.teal, PALETTE.violet];

function Lights() {
  const { to, points } = useMemo(() => {
    const [sx, sz] = LANDMARKS.shack;
    const yaw = facing(sx, sz, 0, 0);
    // from the awning's outer corner, sagging across to a pole by the plaza
    const from = new Vector3(
      sx + Math.cos(yaw) * 3.85 - Math.sin(yaw) * 1.85,
      2.1,
      sz - Math.sin(yaw) * 3.85 - Math.cos(yaw) * 1.85,
    );
    const [px, pz] = onPlaza(138, PLAZA_RADIUS + 1.6);
    const end = new Vector3(px, 3, pz);
    const sag = from.clone().lerp(end, 0.5).setY(1.7);
    return { to: end, points: new CatmullRomCurve3([from, sag, end]).getSpacedPoints(14) };
  }, []);
  const bulbs = useRef<(Mesh | null)[]>([]);
  const flags = useRef<(Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    bulbs.current.forEach((b, i) => {
      // a lazy shimmer, one bulb now and then dipping
      if (b) b.scale.setScalar(0.85 + 0.15 * Math.sin(t * 3 + i * 1.7) + (Math.sin(t * 13 + i * 7) > 0.97 ? -0.5 : 0));
    });
    flags.current.forEach((f, i) => {
      if (f) f.rotation.x = Math.sin(t * 2.5 + i * 0.9) * 0.35;
    });
  });

  const wire = useMemo(() => {
    const parts: Part[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const d = b.clone().sub(a);
      const len = d.length();
      const mid2 = a.clone().addScaledVector(d, 0.5);
      parts.push({ geo: tube(0.015, len, 4), color: PALETTE.ink, position: [mid2.x, mid2.y, mid2.z], rotation: aimEuler(d) });
    }
    // the pole at the far end
    parts.push({ geo: tube(0.08, 3), color: PALETTE.woodDark, position: [to.x, 1.5, to.z] });
    return merge(parts);
  }, [points, to]);

  return (
    <group>
      <mesh geometry={wire} material={propMaterial} castShadow />
      <RigidBody type="fixed" colliders={false} position={[to.x, 1.5, to.z]}>
        <CylinderCollider args={[1.5, 0.1]} />
      </RigidBody>
      {points.slice(1, -1).map((p, i) => (
        <group key={i} position={p}>
          <mesh ref={(m) => void (bulbs.current[i] = m)} position-y={-0.1} material={bulbMaterial}>
            <sphereGeometry args={[0.07, 6, 4]} />
          </mesh>
          <mesh ref={(m) => void (flags.current[i] = m)} position-y={-0.18}>
            <coneGeometry args={[0.12, 0.3, 3]} />
            <meshLambertMaterial color={PENNANT_COLORS[i % PENNANT_COLORS.length]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── the windmill ── */

const towerGeometry = (() => {
  const parts: Part[] = [];
  const H = 6.5;
  for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    // legs lean in toward the top
    parts.push({ geo: tube(0.07, H + 0.1), color: PALETTE.chrome, position: [x * 0.6, H / 2, z * 0.6], rotation: [z * 0.12, 0, -x * 0.12] });
  }
  for (const y of [1.6, 3.2, 4.8]) {
    const w = 1.2 * (1 - y / (H * 1.25)) + 0.35;
    parts.push(
      { geo: box(w * 2, 0.05, 0.05), color: PALETTE.chrome, position: [0, y, w] },
      { geo: box(w * 2, 0.05, 0.05), color: PALETTE.chrome, position: [0, y, -w] },
      { geo: box(0.05, 0.05, w * 2), color: PALETTE.chrome, position: [w, y, 0] },
      { geo: box(0.05, 0.05, w * 2), color: PALETTE.chrome, position: [-w, y, 0] },
    );
  }
  // platform, head and tail vane
  parts.push(
    { geo: box(0.7, 0.08, 0.7), color: PALETTE.woodDark, position: [0, H, 0] },
    { geo: box(0.6, 0.3, 0.3), color: PALETTE.ink, position: [0, H + 0.25, 0] },
    { geo: box(1.5, 0.06, 0.06), color: PALETTE.ink, position: [-0.85, H + 0.3, 0] },
    { geo: box(0.05, 0.6, 0.8), color: PALETTE.coral, position: [-1.6, H + 0.3, 0] },
  );
  return merge(parts);
})();

const rotorGeometry = merge([
  { geo: tube(0.12, 0.2, 8), color: PALETTE.ink, rotation: [0, 0, Math.PI / 2] },
  ...Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      geo: box(0.03, 1.2, 0.22),
      color: i % 2 ? PALETTE.cream : "#c9ced4",
      position: [0, Math.sin(a) * 0.75, Math.cos(a) * 0.75] as V3,
      // blades lie along the radius, pitched to catch the wind
      rotation: [-a, 0.35, 0] as V3,
    };
  }),
  { geo: new TorusGeometry(1.32, 0.03, 4, 24), color: PALETTE.ink, rotation: [0, Math.PI / 2, 0] },
]);

function Windmill() {
  const [x, z] = LANDMARKS.windmill;
  const rotor = useRef<Group>(null);
  useFrame(({ clock }, delta) => {
    if (!rotor.current) return;
    // spins with the gusts, never quite stopping
    const gust = 1.4 + Math.sin(clock.elapsedTime * 0.4) * 0.8;
    rotor.current.rotation.x += gust * delta;
  });
  // the rotor faces the plaza, so it's seen turning face-on
  const yaw = facing(x, z, 0, 0);
  return (
    <RigidBody type="fixed" colliders={false} position={[x, 0, z]} rotation={[0, yaw, 0]}>
      {[[1, 1], [-1, 1], [1, -1], [-1, -1]].map(([lx, lz], i) => (
        <CylinderCollider key={i} args={[3.25, 0.1]} position={[lx * 0.45, 3.25, lz * 0.45]} />
      ))}
      <mesh geometry={towerGeometry} material={propMaterial} castShadow />
      <group ref={rotor} position={[0.45, 6.8, 0]}>
        <mesh geometry={rotorGeometry} material={propMaterial} castShadow />
      </group>
    </RigidBody>
  );
}

/* ── starter smashables ── */

const coneGeometry = merge([
  { geo: box(0.42, 0.05, 0.42), color: "#e8571d", position: [0, 0.025, 0] },
  { geo: new ConeGeometry(0.17, 0.62, 10), color: "#ff6a2a", position: [0, 0.36, 0] },
  { geo: new CylinderGeometry(0.105, 0.125, 0.09, 10), color: PALETTE.cream, position: [0, 0.38, 0] },
]);
const drumGeometry = merge([
  { geo: tube(0.34, 0.95, 10), color: "#2f6fb5" },
  { geo: tube(0.355, 0.05, 10), color: PALETTE.ink, position: [0, 0.28, 0] },
  { geo: tube(0.355, 0.05, 10), color: PALETTE.ink, position: [0, -0.28, 0] },
  { geo: tube(0.3, 0.02, 10), color: "#24558a", position: [0, 0.48, 0] },
]);
const tireStackGeometry = merge([
  { geo: new TorusGeometry(0.36, 0.16, 6, 12), color: PALETTE.tire, rotation: [Math.PI / 2, 0, 0] },
]);

const CONE_DEBRIS = { count: 4, size: 0.18, colors: ["#ff6a2a", PALETTE.cream] };
const CRATE_DEBRIS = { count: 6, size: 0.3, colors: [PALETTE.wood, PALETTE.woodDark] };
const DRUM_DEBRIS = { count: 5, size: 0.26, colors: ["#2f6fb5", PALETTE.ink] };

function Smashables() {
  const cones = useMemo(
    () => [300, 312, 324, 336, 348, 60, 72, 84].map((deg, i) => onPlaza(deg, i < 5 ? PLAZA_RADIUS - 0.6 : PLAZA_RADIUS + 0.8)),
    [],
  );
  const crates = useMemo(() => {
    const [cx, cz] = onPlaza(118, PLAZA_RADIUS + 0.6);
    const s = CRATE_SIZE;
    return [
      [cx - s * 0.52, s / 2, cz],
      [cx + s * 0.52, s / 2, cz],
      [cx, s * 1.5 + 0.01, cz],
      [cx + 0.2, s / 2, cz + s * 1.05],
    ] as V3[];
  }, []);
  const drums = useMemo(() => {
    const [dx, dz] = onPlaza(218, PLAZA_RADIUS + 0.7);
    return [
      [dx, 0.48, dz],
      [dx + 0.72, 0.48, dz + 0.1],
      [dx + 0.3, 0.48, dz + 0.68],
    ] as V3[];
  }, []);
  const tires = useMemo(() => {
    const out: V3[] = [];
    for (const [deg, n] of [[42, 4], [52, 3], [200, 3]] as const) {
      const [x, z] = onPlaza(deg, PLAZA_RADIUS + 0.9);
      for (let k = 0; k < n; k++) out.push([x, 0.17 + k * 0.33, z]);
    }
    return out;
  }, []);

  return (
    <>
      {cones.map(([x, z], i) => (
        <Breakable
          key={`cone${i}`}
          position={[x, 0.01, z]}
          geometry={coneGeometry}
          colliders={<CylinderCollider args={[0.33, 0.17]} position={[0, 0.33, 0]} density={0.12} />}
          dynamic
          breakSpeed={5}
          debris={CONE_DEBRIS}
          sound="plant"
        />
      ))}
      {crates.map((p, i) => (
        <Breakable
          key={`crate${i}`}
          position={p}
          rotation={[0, 0.3 * i, 0]}
          geometry={crateGeometry}
          colliders={<CuboidCollider args={[CRATE_SIZE / 2, CRATE_SIZE / 2, CRATE_SIZE / 2]} density={0.15} />}
          dynamic
          breakSpeed={3.5}
          debris={CRATE_DEBRIS}
        />
      ))}
      {drums.map((p, i) => (
        <Breakable
          key={`drum${i}`}
          position={p}
          geometry={drumGeometry}
          colliders={<CylinderCollider args={[0.475, 0.34]} density={0.2} />}
          dynamic
          breakSpeed={4.5}
          debris={DRUM_DEBRIS}
          sound="metal"
        />
      ))}
      {/* tyre stacks: they don't break, they bounce */}
      {tires.map((p, i) => (
        <RigidBody key={`tire${i}`} position={p} colliders={false} restitution={0.6}>
          <CylinderCollider args={[0.16, 0.52]} density={0.12} />
          <mesh geometry={tireStackGeometry} material={propMaterial} castShadow />
        </RigidBody>
      ))}
    </>
  );
}

export default function PitStop() {
  return (
    <>
      <Plaza />
      <Shack />
      <Lights />
      <Windmill />
      <Smashables />
    </>
  );
}

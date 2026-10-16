"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Set dressing that gives the desert places to recognise: a palm oasis, an
// old gas station (whose pumps explode), a water tower, and bleached cow
// skulls. Built from primitives and merged, one draw call per piece.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import {
  BoxGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  SphereGeometry,
} from "three";
import { LANDMARKS, PALETTE } from "../config";
import { merge, propMaterial, type Part } from "../geo";
import { gasPumpGeometry } from "../props";
import Breakable from "../destruct/Breakable";
import { isClear, randomPoint, seeded } from "./layout";

type V3 = [number, number, number];

/* ── oasis ───────────────────────────────────────────────────────────────── */

function palmGeometry(lean: number, height: number) {
  const parts: Part[] = [];
  const segments = 6;
  let x = 0;
  let y = 0;
  // a trunk of short tapering segments, each leaning a bit further
  for (let i = 0; i < segments; i++) {
    const h = height / segments;
    const a = lean * (i / segments);
    const r = 0.2 - i * 0.018;
    parts.push({
      geo: new CylinderGeometry(r * 0.9, r, h * 1.05, 6),
      color: i % 2 ? PALETTE.wood : PALETTE.woodDark,
      position: [x + Math.sin(a) * h * 0.5, y + Math.cos(a) * h * 0.5, 0],
      rotation: [0, 0, -a],
    });
    x += Math.sin(a) * h;
    y += Math.cos(a) * h;
  }
  // fronds: long flattened cones drooping out from the crown
  for (let i = 0; i < 7; i++) {
    const yaw = (i / 7) * Math.PI * 2;
    parts.push({
      geo: new ConeGeometry(0.32, 2.2, 4),
      color: i % 2 ? PALETTE.palm : PALETTE.cactusDark,
      position: [x + Math.cos(yaw) * 0.9, y - 0.25, -Math.sin(yaw) * 0.9],
      rotation: [0, yaw, -Math.PI / 2 - 0.45],
      scale: [1, 1, 0.25],
    });
  }
  parts.push({ geo: new SphereGeometry(0.22, 5, 4), color: PALETTE.woodDark, position: [x, y - 0.1, 0] });
  return merge(parts);
}

function Oasis() {
  const [ox, oz] = LANDMARKS.oasis;

  const pond = useMemo(
    () =>
      merge([
        // wet sand, then the water itself
        { geo: new CircleGeometry(6.4, 12), color: PALETTE.sandDark, rotation: [-Math.PI / 2, 0, 0], position: [0, 0.03, 0] },
        { geo: new CircleGeometry(5.6, 12), color: "#b9773f", rotation: [-Math.PI / 2, 0, 0.2], position: [0, 0.06, 0] },
      ]),
    [],
  );

  const palms = useMemo(() => {
    const rand = seeded(41);
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + rand() * 0.5;
      const d = 6.4 + rand() * 1.6;
      return {
        position: [Math.cos(a) * d, 0, Math.sin(a) * d] as V3,
        // lean out over the water
        yaw: Math.atan2(Math.sin(a), -Math.cos(a)) + Math.PI,
        geometry: palmGeometry(0.35 + rand() * 0.3, 4 + rand() * 1.6),
      };
    });
  }, []);

  const tufts = useMemo(() => {
    const rand = seeded(43);
    const parts: Part[] = [];
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2;
      const d = 5.5 + rand() * 3;
      for (let j = 0; j < 3; j++) {
        parts.push({
          geo: new ConeGeometry(0.08, 0.6 + rand() * 0.4, 3),
          color: j % 2 ? PALETTE.palm : PALETTE.cactus,
          position: [Math.cos(a) * d + (rand() - 0.5) * 0.3, 0.3, Math.sin(a) * d + (rand() - 0.5) * 0.3],
          rotation: [(rand() - 0.5) * 0.6, 0, (rand() - 0.5) * 0.6],
        });
      }
    }
    return merge(parts);
  }, []);

  return (
    <group position={[ox, 0, oz]}>
      <mesh geometry={pond} material={propMaterial} receiveShadow />
      {/* water: the only glossy surface, so the environment light catches it */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.09} receiveShadow>
        <circleGeometry args={[5, 14]} />
        <meshStandardMaterial color={PALETTE.water} roughness={0.08} metalness={0.1} />
      </mesh>
      <mesh geometry={tufts} material={propMaterial} />
      {palms.map((p, i) => (
        <RigidBody key={i} type="fixed" colliders={false} position={p.position} rotation={[0, p.yaw, 0]}>
          <CylinderCollider args={[1.5, 0.22]} position={[0, 1.5, 0]} />
          <mesh geometry={p.geometry} material={propMaterial} castShadow />
        </RigidBody>
      ))}
    </group>
  );
}

/* ── gas station ─────────────────────────────────────────────────────────── */

const PUMP_DEBRIS = { count: 6, size: 0.3, colors: [PALETTE.coral, PALETTE.cream, PALETTE.ink] };

function GasStation() {
  const [gx, gz] = LANDMARKS.gasStation;
  const yaw = Math.PI * 0.75; // facing back toward the hub

  const building = useMemo(
    () =>
      merge([
        // the shop
        { geo: new BoxGeometry(4, 2.6, 3), color: PALETTE.cream, position: [-2.2, 1.3, 0] },
        { geo: new BoxGeometry(4.2, 0.35, 3.2), color: PALETTE.coral, position: [-2.2, 2.75, 0] },
        { geo: new BoxGeometry(0.06, 1.7, 0.9), color: PALETTE.teal, position: [-0.17, 0.85, 0.6] },
        { geo: new BoxGeometry(0.06, 0.9, 1.1), color: PALETTE.ink, position: [-0.17, 1.4, -0.7] },
        // the canopy over the pumps, on four posts
        { geo: new BoxGeometry(3.4, 0.25, 4), color: PALETTE.cream, position: [1.9, 3.1, 0] },
        { geo: new BoxGeometry(3.5, 0.12, 4.1), color: PALETTE.coral, position: [1.9, 2.95, 0] },
        ...[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => ({
            geo: new CylinderGeometry(0.1, 0.1, 3, 6),
            color: PALETTE.cream,
            position: [1.9 + sx * 1.4, 1.5, sz * 1.7] as V3,
          })),
        ),
        // the sign on its pole
        { geo: new CylinderGeometry(0.08, 0.08, 4.4, 6), color: PALETTE.ink, position: [4.6, 2.2, -2.6] },
        { geo: new CylinderGeometry(0.75, 0.75, 0.12, 12), color: PALETTE.yellow, position: [4.6, 4.5, -2.6], rotation: [Math.PI / 2, 0, 0] },
        { geo: new CylinderGeometry(0.58, 0.58, 0.14, 12), color: PALETTE.coral, position: [4.6, 4.5, -2.6], rotation: [Math.PI / 2, 0, 0] },
      ]),
    [],
  );

  // pump positions in station space, rotated into the world
  const pumps = [-0.9, 0.9].map((z) => {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const lx = 1.9;
    return [gx + lx * c + z * s, 0, gz - lx * s + z * c] as V3;
  });

  return (
    <>
      <RigidBody type="fixed" colliders={false} position={[gx, 0, gz]} rotation={[0, yaw, 0]}>
        <CuboidCollider args={[2, 1.4, 1.5]} position={[-2.2, 1.4, 0]} />
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <CylinderCollider key={`${sx}${sz}`} args={[1.5, 0.12]} position={[1.9 + sx * 1.4, 1.5, sz * 1.7]} />
          )),
        )}
        <CylinderCollider args={[2.2, 0.1]} position={[4.6, 2.2, -2.6]} />
        <mesh geometry={building} material={propMaterial} castShadow receiveShadow />
      </RigidBody>
      {pumps.map((p, i) => (
        <Breakable
          key={i}
          position={p}
          rotation={[0, yaw, 0]}
          geometry={gasPumpGeometry}
          colliders={<CuboidCollider args={[0.28, 0.7, 0.22]} position={[0, 0.7, 0]} />}
          breakSpeed={1}
          explosive
          debris={PUMP_DEBRIS}
          sound="metal"
        />
      ))}
    </>
  );
}

/* ── water tower ─────────────────────────────────────────────────────────── */

const TOWER_LEGS: [number, number][] = [
  [1.3, 1.3],
  [-1.3, 1.3],
  [1.3, -1.3],
  [-1.3, -1.3],
];

function WaterTower() {
  const [wx, wz] = LANDMARKS.waterTower;
  const legs = TOWER_LEGS;
  const geometry = useMemo(
    () =>
      merge([
        ...legs.map(([x, z]) => ({
          geo: new CylinderGeometry(0.1, 0.13, 5, 5),
          color: PALETTE.woodDark,
          position: [x * 0.92, 2.5, z * 0.92] as V3,
          rotation: [z * 0.035, 0, -x * 0.035] as V3,
        })),
        // cross braces
        ...[1.4, 3.2].flatMap((y) => [
          { geo: new BoxGeometry(2.6, 0.08, 0.08), color: PALETTE.wood, position: [0, y, 1.25] as V3 },
          { geo: new BoxGeometry(2.6, 0.08, 0.08), color: PALETTE.wood, position: [0, y, -1.25] as V3 },
          { geo: new BoxGeometry(0.08, 0.08, 2.6), color: PALETTE.wood, position: [1.25, y, 0] as V3 },
          { geo: new BoxGeometry(0.08, 0.08, 2.6), color: PALETTE.wood, position: [-1.25, y, 0] as V3 },
        ]),
        // the tank: planked drum, bands, a pointed roof
        { geo: new CylinderGeometry(1.7, 1.7, 2.2, 12), color: PALETTE.teal, position: [0, 6.1, 0] },
        { geo: new CylinderGeometry(1.74, 1.74, 0.12, 12), color: PALETTE.ink, position: [0, 5.4, 0] },
        { geo: new CylinderGeometry(1.74, 1.74, 0.12, 12), color: PALETTE.ink, position: [0, 6.8, 0] },
        { geo: new CylinderGeometry(1.8, 1.8, 0.15, 12), color: PALETTE.woodDark, position: [0, 5.0, 0] },
        { geo: new ConeGeometry(1.9, 1, 12), color: PALETTE.coral, position: [0, 7.7, 0] },
        { geo: new SphereGeometry(0.12, 6, 4), color: PALETTE.yellow, position: [0, 8.25, 0] },
      ]),
    [legs],
  );

  return (
    <RigidBody type="fixed" colliders={false} position={[wx, 0, wz]}>
      {legs.map(([x, z], i) => (
        <CylinderCollider key={i} args={[2.5, 0.15]} position={[x * 0.92, 2.5, z * 0.92]} />
      ))}
      <mesh geometry={geometry} material={propMaterial} castShadow receiveShadow />
    </RigidBody>
  );
}

/* ── cow skulls ──────────────────────────────────────────────────────────── */

const skullGeometry = merge([
  { geo: new SphereGeometry(0.28, 6, 5), color: PALETTE.bone, scale: [1, 0.8, 1.1] },
  { geo: new BoxGeometry(0.22, 0.18, 0.4), color: PALETTE.bone, position: [0, -0.05, 0.3] },
  { geo: new SphereGeometry(0.06, 4, 3), color: PALETTE.ink, position: [0.12, 0.04, 0.2] },
  { geo: new SphereGeometry(0.06, 4, 3), color: PALETTE.ink, position: [-0.12, 0.04, 0.2] },
  { geo: new ConeGeometry(0.07, 0.55, 5), color: PALETTE.bone, position: [0.4, 0.12, -0.05], rotation: [0, 0, -1.2] },
  { geo: new ConeGeometry(0.07, 0.55, 5), color: PALETTE.bone, position: [-0.4, 0.12, -0.05], rotation: [0, 0, 1.2] },
]);

function Skulls() {
  const skulls = useMemo(() => {
    const rand = seeded(53);
    const out: { x: number; z: number; yaw: number }[] = [];
    let tries = 0;
    while (out.length < 7 && tries++ < 1000) {
      const [x, z] = randomPoint(rand, 6);
      if (!isClear(x, z, 0.5)) continue;
      out.push({ x, z, yaw: rand() * Math.PI * 2 });
    }
    return out;
  }, []);

  return (
    <>
      {skulls.map((s, i) => (
        <mesh
          key={i}
          geometry={skullGeometry}
          material={propMaterial}
          position={[s.x, 0.18, s.z]}
          rotation={[0.15, s.yaw, 0]}
          scale={1.3}
          castShadow
        />
      ))}
    </>
  );
}

export default function Landmarks() {
  return (
    <>
      <Oasis />
      <GasStation />
      <WaterTower />
      <Skulls />
    </>
  );
}

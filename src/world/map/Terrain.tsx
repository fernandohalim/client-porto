"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The ground itself: sand with a slow patchwork of lighter and darker tones
// baked into vertex colours (a flat colour is most of why the first pass read
// as pale), dunes to bounce over, rocks, and the invisible walls behind the
// mesas.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
} from "@react-three/rapier";
import { BufferAttribute, Color, DodecahedronGeometry, PlaneGeometry } from "three";
import { HALF, PALETTE } from "../config";
import { merge, propMaterial } from "../geo";
import { DUNES, ROCKS } from "./data";

const EXTENT = HALF + 45;

/** cheap smooth noise: a few rotated sine waves, in roughly [-1, 1] */
function patch(x: number, z: number) {
  return (
    Math.sin(x * 0.11 + z * 0.05) * 0.5 +
    Math.sin(x * -0.04 + z * 0.13 + 1.7) * 0.35 +
    Math.sin(x * 0.23 - z * 0.19 + 4.1) * 0.15
  );
}

function Ground() {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(EXTENT * 2, EXTENT * 2, 72, 72);
    g.rotateX(-Math.PI / 2);
    const light = new Color(PALETTE.sand);
    const dark = new Color(PALETTE.sandDark);
    const c = new Color();
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const t = 0.5 + 0.5 * patch(pos.getX(i), pos.getZ(i));
      c.copy(light).lerp(dark, t * 0.8);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new BufferAttribute(colors, 3));
    return g;
  }, []);

  return (
    <RigidBody type="fixed" colliders={false} friction={1}>
      {/* solid out to the edge of the visible sand: a blast can throw the
          truck over the walls, and it should land there, not fall forever */}
      <CuboidCollider args={[EXTENT, 0.5, EXTENT]} position={[0, -0.5, 0]} />
      <mesh geometry={geometry} receiveShadow>
        <meshLambertMaterial vertexColors />
      </mesh>
    </RigidBody>
  );
}

/** invisible walls on the drivable square; the mesas give them a face */
function Walls() {
  const walls: [number, number, number, number][] = [
    [0, -HALF, HALF, 0.5],
    [0, HALF, HALF, 0.5],
    [-HALF, 0, 0.5, HALF],
    [HALF, 0, 0.5, HALF],
  ];
  return (
    <RigidBody type="fixed" colliders={false}>
      {walls.map(([x, z, hx, hz], i) => (
        <CuboidCollider key={i} args={[hx, 4, hz]} position={[x, 4, z]} />
      ))}
    </RigidBody>
  );
}

/**
 * A dune is the cap of a big buried sphere: smooth enough to drive over at
 * speed, which is exactly what long-travel suspension wants to bounce on.
 */
function Dunes() {
  const dunes = DUNES;

  return (
    <>
      {dunes.map((d, i) => (
        <RigidBody key={i} type="fixed" colliders={false} position={[d.x, d.h - d.r, d.z]}>
          <BallCollider args={[d.r]} />
          <mesh receiveShadow castShadow>
            <icosahedronGeometry args={[d.r, 3]} />
            <meshLambertMaterial color={PALETTE.dune} flatShading />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

/** boulders: two-tone, a lighter cap on a darker base */
const rockGeometries = [0, 1, 2].map((v) =>
  merge([
    { geo: new DodecahedronGeometry(1, 0), color: v === 2 ? PALETTE.rockDark : PALETTE.rock, scale: [1, 0.7, 0.85] },
    { geo: new DodecahedronGeometry(0.62, 0), color: PALETTE.rockLight, position: [0.15, 0.42, 0.05], scale: [1, 0.6, 0.9] },
  ]),
);

function Rocks() {
  const rocks = ROCKS;

  return (
    <>
      {rocks.map((r, i) => (
        <RigidBody
          key={i}
          type="fixed"
          colliders="hull"
          position={[r.x, r.s * 0.3, r.z]}
          rotation={[0, r.yaw, 0]}
        >
          <mesh geometry={rockGeometries[r.v]} material={propMaterial} scale={r.s} castShadow receiveShadow />
        </RigidBody>
      ))}
    </>
  );
}

export default function Terrain() {
  return (
    <>
      <Ground />
      <Walls />
      <Dunes />
      <Rocks />
    </>
  );
}

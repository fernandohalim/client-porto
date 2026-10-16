"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Natural jumps: things the desert left lying around that happen to launch a
// monster truck. No skatepark ramps — a dirt kicker someone bulldozed, a rock
// slab fallen against a boulder, a dune with a wind-cut lip, and a heap of
// scrap by the junkyard.
//
// Each ramp's face is a circular arc tangent to the ground, so the truck rolls
// on without a bump and leaves the lip at a set angle. The collider is the
// mesh itself (a trimesh), so the curve the wheels ride is the curve you see —
// a convex hull would flatten it into a straight wedge and lose the kick.
//
// Sizes were tuned by driving them: taking off at 10–12 m/s gives about a
// second of air and a 2 m rise, enough for the "Big air!" call-out without
// sending the truck into a wall.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import {
  BoxGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  ExtrudeGeometry,
  Shape,
  type BufferGeometry,
} from "three";
import { JUMPS, PALETTE, type JumpKind } from "../config";
import { merge, propMaterial, type Part } from "../geo";

type V3 = [number, number, number];

/** how much the extrusion's bevel grows the outline; the shape is sunk by it */
const BEVEL = 0.25;

/**
 * A ramp's side profile, along +X from its foot at the origin: an arc that
 * rises to `height` and leaves at `angle`, a flat top, then a slope back down.
 */
function profile(height: number, angleDeg: number, top: number, back: number) {
  const angle = (angleDeg * Math.PI) / 180;
  const radius = height / (1 - Math.cos(angle));
  const run = radius * Math.sin(angle);
  const shape = new Shape();
  shape.moveTo(0, 0);
  const steps = 14;
  for (let i = 1; i <= steps; i++) {
    const a = (angle * i) / steps;
    shape.lineTo(radius * Math.sin(a), radius * (1 - Math.cos(a)));
  }
  shape.lineTo(run + top, height);
  shape.lineTo(run + top + back, 0);
  shape.lineTo(0, 0);
  return { shape, run };
}

/** a profile extruded to `width`, centred across Z, sunk so the foot meets the ground */
function ramp(shape: Shape, width: number) {
  const g = new ExtrudeGeometry(shape, {
    depth: width - BEVEL * 2,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 2,
    curveSegments: 4,
  });
  g.translate(0, -BEVEL, -(width - BEVEL * 2) / 2);
  return g;
}

const stone = (r: number) => new DodecahedronGeometry(r, 0);

function kicker(): BufferGeometry {
  const { shape, run } = profile(1.8, 28, 1, 4);
  const parts: Part[] = [{ geo: ramp(shape, 3.6), color: PALETTE.road }];
  // a few stones bulldozed to the sides
  for (const [u, side, r] of [[1.5, 1, 0.35], [run, -1, 0.45], [run + 2.5, 1, 0.3]] as const) {
    parts.push({ geo: stone(r), color: PALETTE.rockLight, position: [u, r * 0.4, side * 2.3] });
  }
  return merge(parts);
}

function dune(): BufferGeometry {
  // long and gentle on the windward side, cut steep where the wind drops it
  const { shape } = profile(2, 23, 0.8, 2.8);
  return merge([{ geo: ramp(shape, 10), color: PALETTE.dune }]);
}

function scrap(): BufferGeometry {
  const { shape, run } = profile(1.6, 27, 0.8, 3.4);
  const parts: Part[] = [{ geo: ramp(shape, 3.8), color: PALETTE.oil }];
  // tyre stacks at the top corners, so the lip reads from a distance
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      parts.push({
        geo: new CylinderGeometry(0.45, 0.45, 0.3, 10),
        color: PALETTE.tire,
        position: [run + 0.4, 1.6 + 0.16 + i * 0.3, side * 2.4],
      });
    }
  }
  // a rusted car door, dumped against the side
  parts.push({ geo: new BoxGeometry(1.3, 0.9, 0.08), color: PALETTE.rust, position: [run - 2, 0.5, 2.1], rotation: [0.5, 0.3, 0] });
  return merge(parts);
}

function slab(): BufferGeometry {
  // a flat slab of rock fallen against a boulder; its top face is the ramp
  const length = 5.8;
  const thick = 0.45;
  const angle = (21 * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const centre: V3 = [(length / 2) * c + (thick / 2) * s, (length / 2) * s - (thick / 2) * c, 0];
  const tipX = length * c;
  const tipY = length * s;
  return merge([
    { geo: new BoxGeometry(length, thick, 3.2), color: PALETTE.rock, position: centre, rotation: [0, 0, angle] },
    // the boulder it leans on, and rubble around it
    { geo: stone(1.2), color: PALETTE.rockDark, position: [tipX - 0.5, tipY - 1.1, 0], scale: [1, 0.9, 1.3] },
    { geo: stone(0.5), color: PALETTE.rockLight, position: [tipX + 0.6, 0.2, 1.4] },
    { geo: stone(0.4), color: PALETTE.rockLight, position: [1.2, 0.1, -1.9] },
  ]);
}

const BUILDERS: Record<JumpKind, () => BufferGeometry> = { kicker, dune, scrap, slab };

export default function Jumps() {
  const geometries = useMemo(() => {
    const cache = new Map<JumpKind, BufferGeometry>();
    return JUMPS.map((j) => {
      if (!cache.has(j.kind)) cache.set(j.kind, BUILDERS[j.kind]());
      return cache.get(j.kind)!;
    });
  }, []);

  return (
    <>
      {JUMPS.map((j, i) => (
        <RigidBody
          key={i}
          type="fixed"
          colliders="trimesh"
          friction={1}
          position={[j.at[0], 0, j.at[1]]}
          rotation={[0, (j.heading * Math.PI) / 180, 0]}
        >
          <mesh geometry={geometries[i]} material={propMaterial} castShadow receiveShadow />
        </RigidBody>
      ))}
    </>
  );
}

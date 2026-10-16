"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Small life on the sand: dry grass tufts, pebbles and the odd flower,
// scattered over the whole desert and thicker round the pit stop. Each kind
// is ONE instanced mesh — a thousand tufts cost a single draw call — with a
// per-instance colour so no two look quite alike.
//
// They stay off roads, the plaza, the section pads and the pond. Purely
// decorative: no colliders, and they don't cast shadows, which at this count
// would cost more than they add.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import {
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  InstancedMesh,
  Object3D,
  SphereGeometry,
} from "three";
import { HALF, LANDMARKS, PALETTE, ZONES } from "../config";
import { merge, propMaterial } from "../geo";
import { DUNES } from "./data";
import { PLAZA_RADIUS, ROAD_WIDTH, distanceToRoad, seeded } from "./layout";

const tuftGeometry = merge([
  { geo: new ConeGeometry(0.05, 0.42, 3), color: "#ffffff", position: [0, 0.2, 0], rotation: [0.25, 0, 0.1] },
  { geo: new ConeGeometry(0.05, 0.34, 3), color: "#ffffff", position: [0.06, 0.16, 0.04], rotation: [-0.2, 0, -0.35] },
  { geo: new ConeGeometry(0.05, 0.3, 3), color: "#ffffff", position: [-0.06, 0.14, -0.03], rotation: [0.1, 0, 0.4] },
  { geo: new ConeGeometry(0.04, 0.26, 3), color: "#ffffff", position: [0.02, 0.12, -0.07], rotation: [-0.4, 0, 0] },
]);
const pebbleGeometry = merge([{ geo: new DodecahedronGeometry(0.1, 0), color: "#ffffff", scale: [1, 0.55, 0.8] }]);
const flowerGeometry = merge([
  { geo: new CylinderGeometry(0.012, 0.012, 0.28, 4), color: "#4f8a3c", position: [0, 0.14, 0] },
  { geo: new SphereGeometry(0.07, 5, 3), color: "#ffffff", position: [0, 0.3, 0], scale: [1, 0.5, 1] },
]);

/** somewhere tidy to put a small thing: not on a road, pad, pond or dune */
function open(x: number, z: number) {
  if (Math.hypot(x, z) < PLAZA_RADIUS + 0.6) return false;
  if (distanceToRoad(x, z) < ROAD_WIDTH / 2 + 0.25) return false;
  for (const zone of ZONES) {
    // no grass poking up through a landmark's floor
    if (Math.hypot(x - zone.position[0], z - zone.position[2]) < zone.clear - 1) return false;
  }
  if (Math.hypot(x - LANDMARKS.oasis[0], z - LANDMARKS.oasis[1]) < 5.8) return false;
  // dune caps rise out of the ground: anything here would be buried
  for (const d of DUNES) {
    const cap = Math.sqrt(d.r * d.r - (d.r - d.h) * (d.r - d.h));
    if (Math.hypot(x - d.x, z - d.z) < cap) return false;
  }
  return true;
}

function scatterInstances(
  seed: number,
  count: number,
  geometry: InstancedMesh["geometry"],
  colors: string[],
  scale: [number, number],
) {
  const rand = seeded(seed);
  const mesh = new InstancedMesh(geometry, propMaterial, count);
  const dummy = new Object3D();
  const c = new Color();
  let placed = 0;
  let tries = 0;
  while (placed < count && tries++ < count * 20) {
    // two thirds anywhere, a third clustered round the pit stop
    const near = rand() < 0.35;
    const x = near ? (rand() * 2 - 1) * 18 : (rand() * 2 - 1) * (HALF - 2);
    const z = near ? (rand() * 2 - 1) * 18 : (rand() * 2 - 1) * (HALF - 2);
    if (!open(x, z)) continue;
    const s = scale[0] + rand() * (scale[1] - scale[0]);
    dummy.position.set(x, 0, z);
    dummy.rotation.set(0, rand() * Math.PI * 2, 0);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    mesh.setMatrixAt(placed, dummy.matrix);
    mesh.setColorAt(placed, c.set(colors[Math.floor(rand() * colors.length)]));
    placed++;
  }
  mesh.count = placed;
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  mesh.frustumCulled = false;
  return mesh;
}

export default function GroundDetail() {
  const meshes = useMemo(
    () => [
      scatterInstances(151, 1900, tuftGeometry, ["#c9b46a", "#b8a65a", "#a9b45e", "#d6c27a"], [0.7, 1.4]),
      scatterInstances(157, 1100, pebbleGeometry, [PALETTE.rock, PALETTE.rockLight, "#b9a58a", "#9c8b76"], [0.6, 1.8]),
      scatterInstances(163, 380, flowerGeometry, ["#ff7aa8", "#ffd23a", "#ffffff", "#b58cff"], [0.8, 1.3]),
    ],
    [],
  );
  return (
    <>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  );
}

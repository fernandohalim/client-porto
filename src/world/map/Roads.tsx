"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Dirt roads out of the hub, a signpost pointing down each one, and fences
// lining the stretches marked in config — breakable, naturally.
//
// The roads are one ribbon mesh (with two darker wheel ruts), laid a hair
// above the sand. They have no collider: they are paint, not terrain.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Vector3,
  type CatmullRomCurve3,
} from "three";
import { PALETTE, ZONES } from "../config";
import { merge, propMaterial } from "../geo";
import { FENCE_SPAN, fenceGeometry } from "../props";
import Breakable from "../destruct/Breakable";
import { HUB, ROAD_WIDTH, roadCurves } from "./layout";

const UP = new Vector3(0, 1, 0);

/** a flat strip following a curve, offset sideways from its centre line */
function ribbon(
  curve: CatmullRomCurve3,
  width: number,
  offset: number,
  y: number,
  color: string,
) {
  const n = Math.max(8, Math.ceil(curve.getLength() / 0.8));
  const pts = curve.getSpacedPoints(n);
  const side = new Vector3();
  const positions: number[] = [];
  const c = new Color(color);
  for (let i = 0; i < pts.length - 1; i++) {
    const quad: Vector3[] = [];
    for (const j of [i, i + 1]) {
      const t = curve.getTangentAt(j / n);
      side.crossVectors(t, UP).normalize();
      const p = pts[j];
      quad.push(
        p.clone().addScaledVector(side, offset - width / 2).setY(y),
        p.clone().addScaledVector(side, offset + width / 2).setY(y),
      );
    }
    const [a, b, d, e] = quad; // a,b at i; d,e at i+1
    // wound so the face normal points up
    positions.push(...a.toArray(), ...b.toArray(), ...d.toArray());
    positions.push(...b.toArray(), ...e.toArray(), ...d.toArray());
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  const count = positions.length / 3;
  const normals = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    normals.set([0, 1, 0], i * 3);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("normal", new BufferAttribute(normals, 3));
  g.setAttribute("color", new BufferAttribute(colors, 3));
  return g;
}

function RoadSurface() {
  const geometry = useMemo(() => {
    const parts = roadCurves.flatMap(({ curve }) => [
      { geo: ribbon(curve, ROAD_WIDTH, 0, 0.025, PALETTE.road), color: PALETTE.road },
      { geo: ribbon(curve, 0.38, -0.75, 0.045, PALETTE.track), color: PALETTE.track },
      { geo: ribbon(curve, 0.38, 0.75, 0.045, PALETTE.track), color: PALETTE.track },
    ]);
    return merge(parts);
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshLambertMaterial vertexColors />
    </mesh>
  );
}

/** the hub signpost: one arrow per section, each in its zone colour */
function Signpost() {
  const arrows = useMemo(
    () =>
      roadCurves
        .map((r) => {
          const zone = ZONES.find((z) => z.id === r.to);
          if (!zone) return null;
          const [x, z] = r.points[1];
          const yaw = Math.atan2(-(z - HUB[1]), x - HUB[0]);
          return { color: zone.color, yaw };
        })
        .filter((a) => a !== null),
    [],
  );

  const pole = useMemo(
    () =>
      merge([
        { geo: new CylinderGeometry(0.09, 0.11, 3.4, 6), color: PALETTE.woodDark, position: [0, 1.7, 0] },
        { geo: new ConeGeometry(0.16, 0.25, 6), color: PALETTE.woodDark, position: [0, 3.5, 0] },
      ]),
    [],
  );

  const arrowGeometries = useMemo(
    () =>
      arrows.map((a) =>
        merge([
          { geo: new BoxGeometry(1.2, 0.3, 0.06), color: a.color, position: [0.65, 0, 0] },
          { geo: new ConeGeometry(0.26, 0.34, 3), color: a.color, position: [1.4, 0, 0], rotation: [0, 0, -Math.PI / 2], scale: [1, 1, 0.25] },
          { geo: new BoxGeometry(1.24, 0.06, 0.07), color: PALETTE.cream, position: [0.65, 0.17, 0] },
        ]),
      ),
    [arrows],
  );

  return (
    <RigidBody type="fixed" colliders={false} position={[HUB[0], 0, HUB[1]]}>
      <CylinderCollider args={[1.7, 0.12]} position={[0, 1.7, 0]} />
      <mesh geometry={pole} material={propMaterial} castShadow />
      {arrows.map((a, i) => (
        <mesh
          key={i}
          geometry={arrowGeometries[i]}
          material={propMaterial}
          position-y={2.9 - i * 0.4}
          rotation-y={a.yaw}
          castShadow
        />
      ))}
    </RigidBody>
  );
}

const FENCE_DEBRIS = { count: 5, size: 0.35, colors: [PALETTE.wood, PALETTE.woodDark] };

function Fences() {
  const spans = useMemo(() => {
    const out: { position: [number, number, number]; yaw: number }[] = [];
    for (const { curve, fence } of roadCurves) {
      if (!fence) continue;
      const len = curve.getLength();
      const step = (FENCE_SPAN + 0.15) / len;
      for (let u = fence[0]; u <= fence[1]; u += step) {
        const p = curve.getPointAt(u);
        const t = curve.getTangentAt(u);
        const side = new Vector3().crossVectors(t, UP).normalize();
        const yaw = Math.atan2(-t.z, t.x);
        for (const s of [-1, 1]) {
          const q = p.clone().addScaledVector(side, s * (ROAD_WIDTH / 2 + 0.7));
          out.push({ position: [q.x, 0, q.z], yaw });
        }
      }
    }
    return out;
  }, []);

  return (
    <>
      {spans.map((f, i) => (
        <Breakable
          key={i}
          position={f.position}
          rotation={[0, f.yaw, 0]}
          geometry={fenceGeometry}
          colliders={<CuboidCollider args={[FENCE_SPAN / 2, 0.5, 0.08]} position={[0, 0.5, 0]} />}
          breakSpeed={1}
          debris={FENCE_DEBRIS}
          dust={PALETTE.sand}
        />
      ))}
    </>
  );
}

export default function Roads() {
  return (
    <>
      <RoadSurface />
      <Signpost />
      <Fences />
    </>
  );
}

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Tyre tracks pressed into the sand behind the rear wheels.
//
// One instanced mesh, used as a ring buffer of short tread marks. A mark is
// laid each time a tyre has rolled far enough from its last one, and narrows
// to nothing over its last few seconds — width rather than opacity, so the
// marks stay opaque and never need sorting.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3, type InstancedMesh } from "three";
import { PALETTE, carState } from "../config";

const COUNT = 600;
const SPACING = 0.42;
const LIFE = 16; // s
const FADE = 5; // s

const REAR = [2, 3];
const dummy = new Object3D();
const _at = new Vector3();

type Mark = { x: number; y: number; z: number; yaw: number; born: number };

export default function Tracks() {
  const mesh = useRef<InstancedMesh>(null);
  const marks = useRef<(Mark | null)[]>(Array.from({ length: COUNT }, () => null));
  const cursor = useRef(0);
  const last = useRef([new Vector3(1e6, 0, 0), new Vector3(1e6, 0, 0)]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const now = clock.elapsedTime;

    // lay new marks
    REAR.forEach((w, i) => {
      if (!carState.contact[w]) {
        last.current[i].set(1e6, 0, 0);
        return;
      }
      const p = carState.contactPoint[w];
      const prev = last.current[i];
      if (prev.x > 1e5) {
        // first contact after being airborne: start a fresh trail here
        prev.copy(p);
        return;
      }
      const gap = p.distanceTo(prev);
      if (gap < SPACING) return;
      // point along the direction of travel since the last mark
      const yaw = Math.atan2(-(p.z - prev.z), p.x - prev.x);
      // a fast or long frame can cover several spacings: fill every one,
      // or the trail breaks into dashes
      const steps = Math.min(8, Math.floor(gap / SPACING));
      for (let s = 1; s <= steps; s++) {
        _at.lerpVectors(prev, p, (s * SPACING) / gap);
        marks.current[cursor.current] = { x: _at.x, y: _at.y, z: _at.z, yaw, born: now };
        cursor.current = (cursor.current + 1) % COUNT;
      }
      prev.lerpVectors(prev, p, Math.min(1, (steps * SPACING) / gap));
    });

    // place and age them all
    for (let i = 0; i < COUNT; i++) {
      const mark = marks.current[i];
      const age = mark ? now - mark.born : LIFE;
      if (!mark || age >= LIFE) {
        marks.current[i] = null;
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
      } else {
        // ground layers stack up to 9cm (roads, ruts, zone pads), so tracks
        // sit just over all of them rather than flickering against one
        dummy.position.set(mark.x, mark.y + 0.1, mark.z);
        dummy.rotation.set(-Math.PI / 2, 0, mark.yaw);
        const k = Math.min(1, (LIFE - age) / FADE);
        dummy.scale.set(1, k, 1);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false} receiveShadow>
      {/* length along X (the travel direction), width along Y before laying flat */}
      <planeGeometry args={[SPACING * 1.1, 0.3]} />
      <meshLambertMaterial color={PALETTE.track} />
    </instancedMesh>
  );
}

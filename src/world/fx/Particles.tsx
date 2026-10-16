"use client";

// Draws the shared particle pool as one instanced mesh. Puffs grow fast, then
// shrink away rather than fading — no transparency, so no sorting and no
// overdraw cost.

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Object3D, type InstancedMesh } from "three";
import { MAX_PARTICLES, pool } from "./pool";

const dummy = new Object3D();
const white = new Color("#ffffff");

export default function Particles() {
  const mesh = useRef<InstancedMesh>(null);

  // the colour attribute must exist before the first render, or the material
  // compiles without instance colours and ignores them forever after
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < MAX_PARTICLES; i++) m.setColorAt(i, white);
  }, []);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = pool[i];
      if (p.alive) {
        p.age += dt;
        if (p.age >= p.life) p.alive = false;
      }
      if (!p.alive) {
        dummy.scale.setScalar(0);
        dummy.position.set(0, -100, 0);
      } else {
        p.velocity.y += p.lift * dt;
        p.velocity.multiplyScalar(Math.exp(-2.2 * dt)); // air drag
        p.position.addScaledVector(p.velocity, dt);
        if (p.position.y < 0.05) p.position.y = 0.05;
        const t = p.age / p.life;
        // pop up to full size in the first fifth, then shrink to nothing
        const k = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        dummy.position.copy(p.position);
        dummy.scale.setScalar(p.size * (0.4 + 0.6 * k) * Math.max(k, 0));
        dummy.rotation.set(p.age * 1.3, p.age * 0.7, 0);
        m.setColorAt(i, p.color);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, MAX_PARTICLES]}
      frustumCulled={false}
      castShadow={false}
    >
      <icosahedronGeometry args={[0.5, 0]} />
      <meshLambertMaterial flatShading />
    </instancedMesh>
  );
}

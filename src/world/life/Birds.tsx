"use client";

// A small flock wheeling overhead. Their circle drifts lazily after the truck,
// so they are usually in view, and they cast shadows that sweep across the sand.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group } from "three";
import { PALETTE, carState } from "../config";

const COUNT = 5;
const center = new Vector3(6, 0, -6);

export default function Birds() {
  const birds = useRef<(Group | null)[]>([]);
  const wings = useRef<(Group | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    // the flock's centre drifts toward the truck, slowly
    center.lerp(carState.position, 1 - Math.exp(-0.15 * delta));

    for (let i = 0; i < COUNT; i++) {
      const b = birds.current[i];
      if (!b) continue;
      const radius = 7 + (i % 3) * 1.6;
      const a = t * 0.35 + (i / COUNT) * Math.PI * 2;
      const y = 8.5 + Math.sin(t * 0.8 + i) * 0.6 + (i % 2) * 0.8;
      b.position.set(center.x + Math.cos(a) * radius, y, center.z + Math.sin(a) * radius);
      // face along the circle: the tangent, counter-clockwise
      b.rotation.y = -a;

      const w = wings.current[i];
      if (w) {
        // flap in bursts, glide in between
        const flapping = Math.sin(t * 0.5 + i * 1.3) > -0.2;
        const flap = flapping ? Math.sin(t * 12 + i) * 0.7 : 0.15;
        // wings span X, so they beat about the body's long (Z) axis
        w.children[0].rotation.z = flap;
        w.children[1].rotation.z = -flap;
      }
    }
  });

  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => (
        <group key={i} ref={(g) => void (birds.current[i] = g)} scale={0.55}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.08, 0.5]} />
            <meshLambertMaterial color={PALETTE.ink} />
          </mesh>
          <group ref={(g) => void (wings.current[i] = g)}>
            {/* each wing pivots at the body's edge */}
            <group position={[0.08, 0, 0]}>
              <mesh castShadow position={[0.3, 0, 0.02]}>
                <boxGeometry args={[0.6, 0.02, 0.22]} />
                <meshLambertMaterial color={PALETTE.ink} />
              </mesh>
            </group>
            <group position={[-0.08, 0, 0]}>
              <mesh castShadow position={[-0.3, 0, 0.02]}>
                <boxGeometry args={[0.6, 0.02, 0.22]} />
                <meshLambertMaterial color={PALETTE.ink} />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </>
  );
}

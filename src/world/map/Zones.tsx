"use client";

// Placeholder pads where each portfolio section will be built: a coloured
// pad, a flag on a pole, and a glowing beacon you can spot from across the
// map. Real section content replaces these later.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { Color, type Group } from "three";
import { PALETTE, ZONES } from "../config";

export default function Zones() {
  const flags = useRef<(Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flags.current.forEach((f, i) => {
      if (f) f.rotation.y = Math.sin(t * 2.2 + i) * 0.25;
    });
  });

  return (
    <>
      {ZONES.map((z, i) => (
        <group key={z.id} position={[z.position[0], 0, z.position[2]]}>
          <mesh rotation-x={-Math.PI / 2} position-y={0.07} receiveShadow>
            <circleGeometry args={[5, 28]} />
            <meshLambertMaterial color={z.color} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position-y={0.09}>
            <ringGeometry args={[4.4, 4.7, 28]} />
            <meshLambertMaterial color={PALETTE.cream} />
          </mesh>
          <RigidBody type="fixed" colliders={false}>
            <CylinderCollider args={[1.6, 0.1]} position={[0, 1.6, 0]} />
            <mesh castShadow position-y={1.6}>
              <cylinderGeometry args={[0.08, 0.1, 3.2, 6]} />
              <meshLambertMaterial color={PALETTE.ink} />
            </mesh>
          </RigidBody>
          {/* pivots at the pole, so the flag swings rather than spins */}
          <group ref={(g) => void (flags.current[i] = g)} position={[0, 2.8, 0]}>
            <mesh castShadow position-x={0.67}>
              <boxGeometry args={[1.3, 0.75, 0.05]} />
              <meshLambertMaterial color={z.color} />
            </mesh>
          </group>
          {/* the beacon: brighter than white, so bloom picks it up */}
          <mesh position-y={3.4}>
            <icosahedronGeometry args={[0.22, 0]} />
            <meshBasicMaterial
              color={new Color(z.color).multiplyScalar(2.5)}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

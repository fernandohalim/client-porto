"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Tumbleweeds: light physics balls pushed by a gusting wind, hopping now and
// then. They roll across the desert, pile into whatever is in the way, and
// scatter when the truck hits them. One that reaches the downwind edge is
// carried back round to the upwind side.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import { HALF, PALETTE } from "../config";
import { seeded } from "../map/layout";

const COUNT = 6;
const RADIUS = 0.5;
// mostly toward screen-right, a little up-screen
const WIND = new Vector3(1, 0, 0.3).normalize();

export default function Tumbleweeds() {
  const bodies = useRef<(RapierRigidBody | null)[]>([]);

  const starts = useMemo(() => {
    const rand = seeded(97);
    return Array.from({ length: COUNT }, () => [
      (rand() * 2 - 1) * (HALF - 8),
      RADIUS + 0.2,
      (rand() * 2 - 1) * (HALF - 8),
    ] as [number, number, number]);
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    bodies.current.forEach((b, i) => {
      if (!b) return;
      const m = b.mass();
      // gusts: the wind swells and drops, out of step for each weed
      const gust = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 1.9);
      const push = (0.35 + gust * 0.9) * m * delta * 6;
      b.applyImpulse({ x: WIND.x * push, y: 0, z: WIND.z * push }, true);

      const p = b.translation();
      // an occasional hop, only from the ground
      if (p.y < RADIUS + 0.1 && Math.random() < delta * 0.6) {
        b.applyImpulse({ x: 0, y: m * (1.5 + Math.random() * 2), z: 0 }, true);
      }

      // downwind edge: back round to the upwind side
      if (p.x > HALF - 3 || p.z > HALF - 3 || p.y < -5) {
        b.setTranslation(
          { x: -HALF + 4, y: RADIUS + 0.5, z: (Math.random() * 2 - 1) * (HALF - 8) },
          true,
        );
        b.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    });
  });

  return (
    <>
      {starts.map((s, i) => (
        <RigidBody
          key={i}
          ref={(b) => void (bodies.current[i] = b)}
          position={s}
          colliders={false}
          canSleep={false}
          linearDamping={0.3}
          angularDamping={0.2}
        >
          <BallCollider args={[RADIUS]} density={0.06} restitution={0.45} friction={0.6} />
          {/* two offset wire shells read as a tangle of dry stems */}
          <mesh castShadow>
            <icosahedronGeometry args={[RADIUS, 1]} />
            <meshBasicMaterial color={PALETTE.woodDark} wireframe />
          </mesh>
          <mesh rotation={[0.6, 0.9, 0.3]} scale={0.8}>
            <icosahedronGeometry args={[RADIUS, 1]} />
            <meshBasicMaterial color={PALETTE.wood} wireframe />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

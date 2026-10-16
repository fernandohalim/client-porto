"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Lizards and roadrunners around the pit stop. They potter about near a home
// spot, and bolt when the truck comes close — lizards in a wriggling dash,
// roadrunners flat out — then wander back once it has gone.
//
// Pure animation, no physics: they never block the truck and it can't hit
// them, which is the right call for anything with a face.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, ConeGeometry, SphereGeometry, Vector3, type Group } from "three";
import { HALF, PALETTE, carState } from "../config";
import { merge, propMaterial } from "../geo";
import { seeded } from "../map/layout";

type Kind = "lizard" | "roadrunner";

const lizardGeometry = merge([
  { geo: new SphereGeometry(0.12, 6, 4), color: "#6f9a4a", scale: [2.2, 0.6, 1] },
  { geo: new SphereGeometry(0.08, 6, 4), color: "#6f9a4a", position: [0.3, 0.02, 0], scale: [1.4, 0.8, 1] },
  { geo: new ConeGeometry(0.06, 0.45, 5), color: "#5d8840", position: [-0.45, 0, 0], rotation: [0, 0, Math.PI / 2] },
  ...[[0.14, 1], [0.14, -1], [-0.14, 1], [-0.14, -1]].map(([x, s]) => ({
    geo: new BoxGeometry(0.05, 0.03, 0.14),
    color: "#4f7a36",
    position: [x, -0.04, s * 0.1] as [number, number, number],
  })),
  { geo: new SphereGeometry(0.02, 4, 3), color: PALETTE.ink, position: [0.36, 0.05, 0.05] },
  { geo: new SphereGeometry(0.02, 4, 3), color: PALETTE.ink, position: [0.36, 0.05, -0.05] },
]);

const roadrunnerGeometry = merge([
  { geo: new SphereGeometry(0.16, 6, 5), color: "#7a6a5a", scale: [1.5, 1, 0.9], position: [0, 0.42, 0] },
  { geo: new SphereGeometry(0.09, 6, 4), color: "#7a6a5a", position: [0.22, 0.62, 0] },
  { geo: new ConeGeometry(0.03, 0.18, 4), color: PALETTE.yellow, position: [0.36, 0.62, 0], rotation: [0, 0, -Math.PI / 2] },
  { geo: new ConeGeometry(0.06, 0.2, 4), color: "#3f5a8a", position: [0.18, 0.74, 0], rotation: [0, 0, -0.5] },
  { geo: new BoxGeometry(0.4, 0.04, 0.08), color: "#5a4a3a", position: [-0.32, 0.5, 0], rotation: [0, 0, 0.5] },
  { geo: new BoxGeometry(0.03, 0.32, 0.03), color: PALETTE.yellow, position: [0.02, 0.16, 0.05] },
  { geo: new BoxGeometry(0.03, 0.32, 0.03), color: PALETTE.yellow, position: [-0.02, 0.16, -0.05] },
]);

type Critter = {
  kind: Kind;
  home: Vector3;
  pos: Vector3;
  target: Vector3;
  heading: number;
  speed: number;
  fleeing: boolean;
  wait: number;
};

const FLEE_AT = { lizard: 5.5, roadrunner: 8 };
const SAFE_AT = { lizard: 11, roadrunner: 15 };
const RUN = { lizard: 5.5, roadrunner: 9 };
const STROLL = { lizard: 0.5, roadrunner: 1.1 };

const _v = new Vector3();

export default function Critters() {
  const groups = useRef<(Group | null)[]>([]);

  const critters = useMemo<Critter[]>(() => {
    const rand = seeded(131);
    const spots: [Kind, number][] = [
      ["lizard", 0], ["lizard", 1], ["lizard", 2], ["lizard", 3], ["lizard", 4],
      ["roadrunner", 5], ["roadrunner", 6],
    ];
    return spots.map(([kind]) => {
      const a = rand() * Math.PI * 2;
      const r = 7.5 + rand() * 7;
      const home = new Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
      return {
        kind,
        home,
        pos: home.clone(),
        target: home.clone(),
        heading: rand() * Math.PI * 2,
        speed: 0,
        fleeing: false,
        wait: rand() * 3,
      };
    });
  }, []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.elapsedTime;
    critters.forEach((c, i) => {
      const g = groups.current[i];
      if (!g) return;
      const truck = carState.position;
      const d = Math.hypot(c.pos.x - truck.x, c.pos.z - truck.z);

      if (!c.fleeing && d < FLEE_AT[c.kind]) {
        c.fleeing = true;
        // straight away from the truck, with a little sideways panic
        _v.set(c.pos.x - truck.x, 0, c.pos.z - truck.z).normalize();
        const swerve = (Math.random() - 0.5) * 1.2;
        const dir = new Vector3(_v.x * Math.cos(swerve) - _v.z * Math.sin(swerve), 0, _v.x * Math.sin(swerve) + _v.z * Math.cos(swerve));
        c.target.copy(c.pos).addScaledVector(dir, SAFE_AT[c.kind] + 2);
      }
      if (c.fleeing && d > SAFE_AT[c.kind]) c.fleeing = false;

      // idling: pause, then potter to a new spot near home
      if (!c.fleeing && c.pos.distanceTo(c.target) < 0.2) {
        c.wait -= dt;
        if (c.wait <= 0) {
          c.wait = 1.5 + Math.random() * 4;
          const a = Math.random() * Math.PI * 2;
          c.target.set(c.home.x + Math.cos(a) * 2.5, 0, c.home.z + Math.sin(a) * 2.5);
        }
      }

      // stay inside the world
      c.target.x = Math.max(-HALF + 2, Math.min(HALF - 2, c.target.x));
      c.target.z = Math.max(-HALF + 2, Math.min(HALF - 2, c.target.z));

      _v.copy(c.target).sub(c.pos).setY(0);
      const remaining = _v.length();
      const want = remaining < 0.2 ? 0 : c.fleeing ? RUN[c.kind] : STROLL[c.kind];
      c.speed += (want - c.speed) * Math.min(1, dt * (c.fleeing ? 10 : 3));
      if (remaining > 0.01) {
        const goal = Math.atan2(-_v.z, _v.x);
        let turn = goal - c.heading;
        turn = Math.atan2(Math.sin(turn), Math.cos(turn));
        c.heading += turn * Math.min(1, dt * (c.fleeing ? 14 : 4));
        c.pos.addScaledVector(_v.normalize(), Math.min(remaining, c.speed * dt));
      }

      g.position.set(c.pos.x, c.kind === "lizard" ? 0.08 : 0, c.pos.z);
      // lizards wriggle as they run; roadrunners bob
      const wiggle = c.kind === "lizard" ? Math.sin(t * 28 + i) * 0.35 * Math.min(1, c.speed / 2) : 0;
      g.rotation.set(0, c.heading + wiggle, 0);
      if (c.kind === "roadrunner") g.position.y = Math.abs(Math.sin(t * 20 + i)) * 0.06 * Math.min(1, c.speed / 3);
    });
  });

  return (
    <>
      {critters.map((c, i) => (
        <group key={i} ref={(g) => void (groups.current[i] = g)}>
          <mesh
            geometry={c.kind === "lizard" ? lizardGeometry : roadrunnerGeometry}
            material={propMaterial}
            castShadow
            scale={c.kind === "lizard" ? 1.3 : 1.2}
          />
        </group>
      ))}
    </>
  );
}

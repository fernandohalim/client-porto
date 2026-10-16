"use client";

// ─────────────────────────────────────────────────────────────────────────────
// What an explosion looks and feels like. Listens on the bus and, for each
// blast: a bright fireball and shockwave ring (bright enough to bloom), a
// flash of light, smoke, a scorch mark that lingers, a shove to every dynamic
// body nearby — the truck included — and camera shake.
//
// A fixed pool of slots, always mounted and hidden when idle: a chain of
// barrels never mounts or unmounts anything, and the light count never
// changes, so no shader ever recompiles mid-blast.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import {
  Color,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshLambertMaterial,
  type PointLight,
} from "three";
import { carState, shake } from "../config";
import { emit } from "../fx/pool";
import { boom } from "../audio";
import { BLAST_RADIUS, onExplosion } from "./bus";

const SLOTS = 6;
const FIREBALL = 0.5; // s
const SCORCH = 14; // s

type Slot = { active: boolean; age: number; at: Vector3; power: number };

const HOT = new Color(3.2, 1.6, 0.45); // > 1: escapes tone mapping and blooms
const COOL = new Color(0.9, 0.18, 0.06);
const _v = new Vector3();
const _p = new Vector3();
const _c = new Color();

export default function Explosions() {
  const { world } = useRapier();
  const slots = useRef<Slot[]>(
    Array.from({ length: SLOTS }, () => ({ active: false, age: 0, at: new Vector3(), power: 1 })),
  );
  const next = useRef(0);
  const groups = useRef<(Group | null)[]>([]);
  const balls = useRef<(Mesh | null)[]>([]);
  const rings = useRef<(Mesh | null)[]>([]);
  const scorches = useRef<(Mesh | null)[]>([]);
  const light = useRef<PointLight>(null);
  const flash = useRef(0);

  useEffect(
    () =>
      onExplosion((at, power) => {
        const slot = slots.current[next.current];
        next.current = (next.current + 1) % SLOTS;
        slot.active = true;
        slot.age = 0;
        slot.at.copy(at).setY(Math.max(at.y, 0.4));
        slot.power = power;

        // the shove: outward and up, falling off with distance
        const reach = BLAST_RADIUS * power;
        world.bodies.forEach((b) => {
          if (!b.isDynamic()) return;
          const t = b.translation();
          _v.set(t.x - at.x, t.y - at.y, t.z - at.z);
          const d = _v.length();
          if (d > reach) return;
          const falloff = 1 - d / reach;
          _v.setY(0).normalize().multiplyScalar(5 * falloff).setY(6 * falloff);
          const m = b.mass();
          // shove low on the side facing the blast, so things roll away from
          // it rather than just hopping — this is what flips the truck
          _p.set(at.x - t.x, 0, at.z - t.z).normalize().multiplyScalar(0.5);
          b.applyImpulseAtPoint(
            { x: _v.x * m, y: _v.y * m, z: _v.z * m },
            { x: t.x + _p.x, y: t.y - 0.3, z: t.z + _p.z },
            true,
          );
        });

        // shake by how close it went off to the truck
        const near = 1 - Math.min(1, at.distanceTo(carState.position) / 28);
        shake.amount = Math.min(1.4, shake.amount + 1.1 * near * power);
        boom(near);

        flash.current = 1;
        light.current?.position.copy(slot.at).setY(slot.at.y + 1.2);

        // smoke rising, sand kicked out
        for (let i = 0; i < 14; i++) {
          const a = Math.random() * Math.PI * 2;
          emit(
            slot.at,
            _v.set(Math.cos(a) * 1.6, 2 + Math.random() * 2.5, Math.sin(a) * 1.6),
            i % 3 ? "#4a3a3a" : "#6b5550",
            { life: 1.4 + Math.random() * 1, size: 0.9 + Math.random() * 0.7, lift: 1.2 },
          );
        }
        for (let i = 0; i < 12; i++) {
          const a = Math.random() * Math.PI * 2;
          emit(
            _v.copy(slot.at).setY(0.3),
            new Vector3(Math.cos(a) * 6, 1 + Math.random() * 2, Math.sin(a) * 6),
            "#e7b07a",
            { life: 0.8 + Math.random() * 0.5, size: 0.7, lift: -1 },
          );
        }
      }),
    [world],
  );

  useFrame((_, delta) => {
    for (let i = 0; i < SLOTS; i++) {
      const s = slots.current[i];
      const g = groups.current[i];
      if (!g) continue;
      if (!s.active) {
        g.visible = false;
        continue;
      }
      s.age += delta;
      g.visible = true;
      g.position.copy(s.at);

      const ball = balls.current[i];
      const ring = rings.current[i];
      const scorch = scorches.current[i];

      const t = Math.min(1, s.age / FIREBALL);
      const out = 1 - Math.pow(1 - t, 3);
      if (ball) {
        ball.visible = t < 1;
        ball.scale.setScalar((0.4 + 2.6 * out) * s.power * (1 - t * 0.35));
        (ball.material as MeshBasicMaterial).color.copy(_c.copy(HOT).lerp(COOL, t));
      }
      if (ring) {
        const rt = Math.min(1, s.age / 0.35);
        ring.visible = rt < 1;
        ring.scale.setScalar(0.5 + BLAST_RADIUS * s.power * rt);
        (ring.material as MeshBasicMaterial).opacity = 0.8 * (1 - rt);
      }
      if (scorch) {
        scorch.position.y = 0.11 - s.at.y;
        (scorch.material as MeshLambertMaterial).opacity = 0.75 * Math.min(1, (SCORCH - s.age) / 3);
      }
      if (s.age > SCORCH) s.active = false;
    }

    if (light.current) {
      flash.current *= Math.exp(-7 * delta);
      light.current.intensity = 90 * flash.current;
    }
  });

  return (
    <>
      <pointLight ref={light} intensity={0} distance={18} decay={2} color="#ffb060" />
      {Array.from({ length: SLOTS }, (_, i) => (
        <group key={i} ref={(g) => void (groups.current[i] = g)} visible={false}>
          <mesh ref={(m) => void (balls.current[i] = m)}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial toneMapped={false} />
          </mesh>
          <mesh ref={(m) => void (rings.current[i] = m)} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.85, 1, 32]} />
            <meshBasicMaterial color={[2.4, 1.2, 0.4]} toneMapped={false} transparent depthWrite={false} />
          </mesh>
          <mesh ref={(m) => void (scorches.current[i] = m)} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[2.2, 14]} />
            <meshLambertMaterial
              color="#3a2420"
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

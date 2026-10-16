"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Anything the truck can smash.
//
// Fixed props (fences, cacti, pumps) are sensors, not walls: the truck drives
// INTO them, they shatter, and it carries on with a small thud of lost speed.
// Solid, they stopped it dead, which felt like hitting concrete. Dynamic props
// (crates, barrels) stay solid, get shoved, and break on a harder hit.
// Everything is deliberately flimsy: dynamic props weigh a fraction of what
// their colliders declare, break at a fraction of their listed speed, and a
// truck that smashes one keeps nearly all its speed — the props should burst
// around the truck, not stop it.
//
// Hit hard enough, or caught in a blast, it swaps itself for a handful of
// debris bodies that tumble, shrink and vanish. Explosive props also publish
// a blast of their own, which is how barrels chain.
//
// Broken things come back after a while, but only once the truck has driven
// away — nothing should rebuild itself in front of you.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RigidBody,
  type CollisionEnterPayload,
  type IntersectionEnterPayload,
  type RapierRigidBody,
} from "@react-three/rapier";
import { Vector3, type BufferGeometry, type Group } from "three";
import { carState } from "../config";
import { propMaterial } from "../geo";
import { BLAST_RADIUS, debris, explode, onExplosion } from "./bus";
import { burst } from "../fx/pool";
import { smash as smashSound, type Material } from "../audio";
import { seeded } from "../map/layout";

export type DebrisSpec = { count: number; size: number; colors: string[] };

type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  /** scales the mesh only; size the colliders to match */
  scale?: number;
  geometry: BufferGeometry;
  /** collider elements, in the prop's local space — they carry their own density */
  colliders: ReactNode;
  dynamic?: boolean;
  /** truck speed (m/s) needed to break it on contact */
  breakSpeed: number;
  debris: DebrisSpec;
  explosive?: boolean;
  /** dust colour for the puff when it breaks */
  dust?: string;
  /** what it sounds like breaking */
  sound?: Material;
};

const RESPAWN_AFTER = 30; // s
const RESPAWN_DISTANCE = 28; // m from the truck

type Wreck = { at: Vector3; velocity: Vector3; seed: number };

/** how much of its speed the truck keeps when it ploughs through a prop */
const PLOUGH_KEEP = 0.96;
/** every dynamic prop weighs this share of its colliders' declared density */
const LIGHTER = 0.35;
/** and everything breaks at this share of its listed `breakSpeed` */
const EASIER = 0.55;

/** apply `props` to every collider element, looking inside fragments */
function mapColliders(
  nodes: ReactNode,
  props: (c: ReactElement<{ density?: number; sensor?: boolean }>) => { density?: number; sensor?: boolean },
): ReactNode {
  return Children.map(nodes, (c) => {
    if (!isValidElement(c)) return c;
    if (c.type === Fragment) {
      const children = (c.props as { children?: ReactNode }).children;
      return <>{mapColliders(children, props)}</>;
    }
    const el = c as ReactElement<{ density?: number; sensor?: boolean }>;
    return cloneElement(el, props(el));
  });
}

function isTruck(e: CollisionEnterPayload | IntersectionEnterPayload) {
  const data = e.other.rigidBody?.userData as { truck?: boolean } | undefined;
  return data?.truck === true;
}

/* ── debris: short-lived bodies flung out of the break point ── */
function Debris({
  wreck,
  spec,
  onDone,
}: {
  wreck: Wreck;
  spec: DebrisSpec;
  onDone: () => void;
}) {
  const LIFE = 3.2;
  const FADE = 0.7;
  const groups = useRef<(Group | null)[]>([]);
  const age = useRef(0);
  const done = useRef(false);

  const pieces = useMemo(() => {
    // fewer pieces when the world is already full of them
    const n = debris.live > debris.cap ? 2 : spec.count;
    const rand = seeded(wreck.seed);
    return Array.from({ length: n }, () => {
      const size = spec.size * (0.5 + rand() * 0.7);
      return {
        size: [size * (0.6 + rand()), size * (0.4 + rand() * 0.6), size * (0.6 + rand())] as [number, number, number],
        color: spec.colors[Math.floor(rand() * spec.colors.length)],
        offset: [(rand() - 0.5) * 0.6, 0.2 + rand() * 0.6, (rand() - 0.5) * 0.6] as [number, number, number],
        velocity: [
          wreck.velocity.x * 0.6 + (rand() - 0.5) * 4,
          Math.max(wreck.velocity.y, 0) * 0.6 + 2 + rand() * 4,
          wreck.velocity.z * 0.6 + (rand() - 0.5) * 4,
        ] as [number, number, number],
        spin: [(rand() - 0.5) * 12, (rand() - 0.5) * 12, (rand() - 0.5) * 12] as [number, number, number],
      };
    });
  }, [wreck, spec]);

  useEffect(() => {
    debris.live += pieces.length;
    return () => {
      debris.live -= pieces.length;
    };
  }, [pieces.length]);

  useFrame((_, delta) => {
    if (done.current) return;
    age.current += delta;
    const k = Math.min(1, Math.max(0, (LIFE - age.current) / FADE));
    for (const g of groups.current) g?.scale.setScalar(k);
    if (age.current >= LIFE) {
      done.current = true;
      onDone();
    }
  });

  return (
    <>
      {pieces.map((p, i) => (
        <RigidBody
          key={i}
          position={[wreck.at.x + p.offset[0], wreck.at.y + p.offset[1], wreck.at.z + p.offset[2]]}
          linearVelocity={p.velocity}
          angularVelocity={p.spin}
          colliders={false}
        >
          <CuboidCollider args={[p.size[0] / 2, p.size[1] / 2, p.size[2] / 2]} density={0.3} />
          <group ref={(g) => void (groups.current[i] = g)}>
            <mesh castShadow>
              <boxGeometry args={p.size} />
              <meshLambertMaterial color={p.color} flatShading />
            </mesh>
          </group>
        </RigidBody>
      ))}
    </>
  );
}

export default function Breakable({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  geometry,
  colliders,
  dynamic = false,
  breakSpeed,
  debris: spec,
  explosive = false,
  dust = "#e8c193",
  sound = "wood",
}: Props) {
  const body = useRef<RapierRigidBody>(null);
  const broken = useRef(false);
  const brokenFor = useRef(0);
  const [wreck, setWreck] = useState<Wreck | null>(null);
  const [cleared, setCleared] = useState(false);
  // bumped on respawn, so the rigid body is rebuilt where it started
  const [generation, setGeneration] = useState(0);

  const where = () => {
    const t = body.current?.translation();
    return t ? new Vector3(t.x, t.y, t.z) : new Vector3(...position);
  };

  const smash = (velocity: Vector3) => {
    if (broken.current) return;
    broken.current = true;
    brokenFor.current = 0;
    const at = where();
    burst(at, dust, 6);
    smashSound(sound);
    if (explosive) explode(at, 1);
    setWreck({ at, velocity, seed: 1 + Math.floor(Math.random() * 1e6) });
  };

  // caught in someone else's blast: break after a beat, so chains ripple outward
  useEffect(
    () =>
      onExplosion((at, power) => {
        if (broken.current) return;
        const here = where();
        const d = here.distanceTo(at);
        if (d > BLAST_RADIUS * power) return;
        const push = here.clone().sub(at).setY(0).normalize().multiplyScalar(6).setY(5);
        window.setTimeout(() => smash(push), 60 + d * 35);
      }),
    // smash/where read refs and props that never change for a mounted prop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generation],
  );

  // come back once the truck is well away
  useFrame((_, delta) => {
    if (!broken.current || !cleared) return;
    brokenFor.current += delta;
    if (brokenFor.current < RESPAWN_AFTER) return;
    const [x, , z] = position;
    if (Math.hypot(carState.position.x - x, carState.position.z - z) < RESPAWN_DISTANCE) return;
    broken.current = false;
    setWreck(null);
    setCleared(false);
    setGeneration((g) => g + 1);
  });

  const need = breakSpeed * EASIER;

  // the truck's speed from before the contact, minus a little for the thud
  const keepGoing = (e: CollisionEnterPayload | IntersectionEnterPayload) => {
    const truck = e.other.rigidBody;
    if (!truck) return;
    const v = carState.velocity;
    truck.setLinvel({ x: v.x * PLOUGH_KEEP, y: truck.linvel().y, z: v.z * PLOUGH_KEEP }, true);
  };

  const onCollisionEnter = (e: CollisionEnterPayload) => {
    if (!isTruck(e)) return;
    // explosives go off at any real knock; everything else needs speed
    const enough = explosive ? Math.min(need, 1.5) : need;
    if (Math.abs(carState.speed) < enough) return;
    smash(carState.velocity.clone());
    keepGoing(e);
  };

  const onIntersectionEnter = (e: IntersectionEnterPayload) => {
    if (!isTruck(e) || Math.abs(carState.speed) < need) return;
    smash(carState.velocity.clone());
    keepGoing(e);
  };

  // fixed props become sensors, so they never block the truck; dynamic ones
  // lose most of their weight, so they barely slow it
  const shapes = dynamic
    ? mapColliders(colliders, (c) => ({ density: (c.props.density ?? 1) * LIGHTER }))
    : mapColliders(colliders, () => ({ sensor: true }));

  return (
    <>
      {!wreck && (
        <RigidBody
          key={generation}
          ref={body}
          type={dynamic ? "dynamic" : "fixed"}
          position={position}
          rotation={rotation}
          colliders={false}
          onCollisionEnter={dynamic ? onCollisionEnter : undefined}
          onIntersectionEnter={dynamic ? undefined : onIntersectionEnter}
        >
          {shapes}
          <mesh geometry={geometry} material={propMaterial} scale={scale} castShadow receiveShadow />
        </RigidBody>
      )}
      {wreck && !cleared && (
        <Debris wreck={wreck} spec={spec} onDone={() => setCleared(true)} />
      )}
    </>
  );
}

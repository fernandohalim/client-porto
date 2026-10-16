"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The monster truck.
//
// Physics is Rapier's raycast vehicle: the chassis is one rigid body, and each
// wheel is a ray with a spring on it rather than a body of its own. That is
// what makes it bouncy and cheap — four springs instead of four jointed wheels
// fighting the solver. The wheels, shocks and axles you see are decoration,
// placed every frame from where the controller says each spring sits.
//
// Driving inputs are applied in useBeforePhysicsStep, so they stay in lockstep
// with the fixed physics tick. Visuals and telemetry update in useFrame.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
  CuboidCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import type { DynamicRayCastVehicleController } from "@dimforge/rapier3d-compat";
import { MathUtils, Quaternion, Vector3, type Group, type Mesh } from "three";
import { CAR, HALF, PALETTE, SPAWN, carState, shake } from "./config";
import { burst, emit } from "./fx/pool";
import * as audio from "./audio";
import { emitWorld, onWorld } from "./events";
import {
  FLAME_TIPS,
  TAIL_BRAKE,
  TAIL_IDLE,
  TruckBody,
  axleGeometry,
  chromeMaterial,
  diffGeometry,
  flameCoreGeometry,
  flameCoreMaterial,
  flameOuterGeometry,
  flameOuterMaterial,
  rodGeometry,
  springGeometry,
  springMaterial,
  tailMaterial,
  tireGeometries,
} from "./truck/parts";
import { propMaterial } from "./geo";

type Keys = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  boost: boolean;
  reset: boolean;
  horn: boolean;
};

const IDLE_KEYS: Keys = {
  forward: false,
  back: false,
  left: false,
  right: false,
  brake: false,
  boost: false,
  reset: false,
  horn: false,
};

const [bx, by, bz] = CAR.body;
const FRONT = [0, 1];
const REAR = [2, 3];
const UP = new Vector3(0, 1, 0);

// a jump this long, or a full turn in the air, gets called out on landing
// (measured wheels-off, which is shorter than the flight: the suspension
// rays reach the ground before the chassis does)
const BIG_AIR = 0.7; // s
const FULL_TURN = Math.PI * 2 * 0.85; // a little short of 360°, since it lands flat
// upside down this long in the air means it won't land on its wheels: no call-out
const BOTCHED_AFTER = 0.6; // s
// and it must actually have risen: wheels off the ground while hung up on a
// rock at the same height is not a jump
const MIN_RISE = 0.6; // m
// on its back this long before the interface suggests pressing R
const STUCK_AFTER = 1.5; // s
// outside the walls this long and it's sent back to the hub
const OFF_MAP_AFTER = 1.5; // s

const EMBERS = ["#ffd23a", "#ff8a3a", "#ff4f3a", "#fff3e2"];
const _ember = new Vector3();
const _emberV = new Vector3();

const CONFETTI = [PALETTE.coral, PALETTE.teal, PALETTE.yellow, PALETTE.violet, PALETTE.cream];

// box inertia for the body's dimensions, so the centre of mass is the only
// thing we are actually overriding
const INERTIA = {
  x: (CAR.mass / 3) * (by * by + bz * bz),
  y: (CAR.mass / 3) * (bx * bx + bz * bz),
  z: (CAR.mass / 3) * (bx * bx + by * by),
};

// where each shock bolts to the frame, chassis space (inboard of the wheel)
const SHOCK_TOPS = CAR.wheels.map(([x, , z]) => new Vector3(x - Math.sign(x) * 0.14, 0.36, z * 0.5));

const spawnQuat = new Quaternion().setFromAxisAngle(UP, SPAWN.yaw);
const _q = new Quaternion();
const _fwd = new Vector3();
const _a = new Vector3();
const _b = new Vector3();
const _dir = new Vector3();
const _right = new Vector3();

/** stretch a unit-height, Y-aligned mesh between two points */
function span(mesh: Mesh | null, from: Vector3, to: Vector3) {
  if (!mesh) return;
  _dir.subVectors(to, from);
  const len = _dir.length();
  mesh.position.copy(from).addScaledVector(_dir, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, _dir.divideScalar(len || 1));
  mesh.scale.set(1, len, 1);
}

export default function Car({ driving, paused }: { driving: boolean; paused: boolean }) {
  const chassis = useRef<RapierRigidBody>(null);
  const controller = useRef<DynamicRayCastVehicleController | null>(null);
  const wheels = useRef<(Group | null)[]>([]);
  const spinners = useRef<(Group | null)[]>([]);
  const springs = useRef<(Mesh | null)[]>([]);
  const rods = useRef<(Mesh | null)[]>([]);
  const axles = useRef<(Mesh | null)[]>([]);
  const diffs = useRef<(Mesh | null)[]>([]);
  const flames = useRef<(Group | null)[]>([]);
  const upsideDownFor = useRef(0);
  const outsideFor = useRef(0);
  const airborne = useRef(false);
  const fallSpeed = useRef(0);
  // the jump in progress: how long, how much it has turned, and whether it's gone wrong
  // rear grip, eased back after a drift; and whether boost was lit last step
  const rearGrip = useRef(CAR.frictionSlip);
  const wasBoosting = useRef(false);
  const air = useRef({ time: 0, spin: 0, inverted: 0, botched: false, from: 0, peak: 0 });

  const { world, rapier } = useRapier();
  const [subscribeKeys, getKeys] = useKeyboardControls<keyof Keys>();

  // read through a ref inside the physics callback, which is registered once
  const drivingRef = useRef(driving);
  const pausedRef = useRef(paused);
  useEffect(() => {
    drivingRef.current = driving;
    pausedRef.current = paused;
  }, [driving, paused]);

  /* ── build the vehicle once the chassis body exists ── */
  useEffect(() => {
    const body = chassis.current;
    if (!body) return;

    const c = world.createVehicleController(body);
    CAR.wheels.forEach(([x, y, z], i) => {
      c.addWheel(
        { x, y, z },
        { x: 0, y: -1, z: 0 }, // suspension pushes down
        { x: 0, y: 0, z: -1 }, // axle runs across the truck
        CAR.suspensionRest,
        CAR.wheelRadius,
      );
      c.setWheelSuspensionStiffness(i, CAR.suspensionStiffness);
      c.setWheelSuspensionCompression(i, CAR.suspensionCompression);
      c.setWheelSuspensionRelaxation(i, CAR.suspensionRelaxation);
      c.setWheelMaxSuspensionTravel(i, CAR.maxSuspensionTravel);
      c.setWheelFrictionSlip(i, CAR.frictionSlip);
    });
    controller.current = c;

    return () => {
      world.removeVehicleController(c);
      controller.current = null;
    };
  }, [world]);

  /**
   * Stand the truck back on its wheels, keeping where it is and which way it
   * faces — or, given a spot, drop it there facing up the screen.
   */
  const recover = (toSpawn = false, at?: [number, number]) => {
    const body = chassis.current;
    if (!body) return;

    if (toSpawn || at) {
      const [x, z] = at ?? [SPAWN.position[0], SPAWN.position[2]];
      body.setTranslation({ x, y: SPAWN.position[1], z }, true);
      body.setRotation(spawnQuat, true);
    } else {
      const p = body.translation();
      const r = body.rotation();
      _fwd.set(1, 0, 0).applyQuaternion(_q.set(r.x, r.y, r.z, r.w));
      const yaw = Math.atan2(-_fwd.z, _fwd.x);
      // thrown over the walls by a blast: back inside, just short of them
      const inside = HALF - 3;
      body.setTranslation(
        {
          x: MathUtils.clamp(p.x, -inside, inside),
          y: Math.max(p.y, 0) + 1.2,
          z: MathUtils.clamp(p.z, -inside, inside),
        },
        true,
      );
      body.setRotation(_q.setFromAxisAngle(UP, yaw), true);
    }
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    upsideDownFor.current = 0;
    // a jump interrupted by a reset doesn't count
    air.current = { time: 0, spin: 0, inverted: 0, botched: true, from: 0, peak: 0 };
  };

  // R flips the truck back over
  useEffect(
    () =>
      subscribeKeys(
        (s) => s.reset,
        (pressed) => pressed && drivingRef.current && recover(),
      ),
    // recover only touches refs, so it never goes stale
    [subscribeKeys],
  );

  // H honks
  useEffect(
    () =>
      subscribeKeys(
        (s) => s.horn,
        (pressed) => audio.horn(pressed && drivingRef.current),
      ),
    [subscribeKeys],
  );

  // "Respawn" from the menu and "Travel" from the map. Both are clicked while
  // the menu or map has the physics paused, and a body moved then doesn't
  // stay moved — so they wait here and land on the first step after resuming.
  const pendingMove = useRef<{ spawn: boolean; at?: [number, number] } | null>(null);
  useEffect(() => onWorld("respawn", () => void (pendingMove.current = { spawn: true })), []);
  useEffect(() => onWorld("travel", (at) => void (pendingMove.current = { spawn: false, at })), []);
  // something found: confetti out of the truck, and a double toot
  useEffect(
    () =>
      onWorld("celebrate", () => {
        const body = chassis.current;
        if (!body) return;
        const p = body.translation();
        _a.set(p.x, p.y + 1.2, p.z);
        for (let i = 0; i < 40; i++) {
          const a = Math.random() * Math.PI * 2;
          const s = 1.5 + Math.random() * 3;
          _b.set(Math.cos(a) * s, 5 + Math.random() * 4, Math.sin(a) * s);
          emit(_a, _b, CONFETTI[i % CONFETTI.length], {
            life: 1.4 + Math.random() * 0.8,
            size: 0.22 + Math.random() * 0.12,
            lift: -7,
          });
        }
        audio.toot();
      }),
    [],
  );

  /* ── inputs → controller, on the physics tick ── */
  useBeforePhysicsStep((w) => {
    const c = controller.current;
    if (!c) return;

    const move = pendingMove.current;
    if (move) {
      pendingMove.current = null;
      recover(move.spawn, move.at);
    }

    const k = drivingRef.current ? getKeys() : IDLE_KEYS;

    // positive when rolling forward
    const speed = c.currentVehicleSpeed();
    const throttle = Number(k.forward) - Number(k.back);
    const top =
      throttle > 0
        ? k.boost
          ? CAR.maxBoostSpeed
          : CAR.maxSpeed
        : CAR.maxReverseSpeed;
    // full force until close to the top speed, then a steep fade to nothing
    const headroom =
      throttle === 0
        ? 0
        : MathUtils.clamp(1 - Math.pow(Math.max(0, throttle * speed) / top, 3), 0, 1);
    // Rapier's engine force pushes toward chassis -X, hence the minus
    // (nitrous isn't in here: through the rear tyres it levers the nose up into
    // a wheelie — it's a thrust on the body instead, below)
    const force = -throttle * CAR.engineForce * headroom;
    // rear-wheel drive: the back steps out when you floor it mid-turn
    REAR.forEach((i) => c.setWheelEngineForce(i, force));

    const drifting = k.brake && Math.abs(speed) > CAR.driftMinSpeed;
    // narrows with speed up to cruising, then again toward full boost; a
    // drift gets full lock back, for catching the slide
    const abs = Math.abs(speed);
    const steerMax = drifting
      ? CAR.steerSlow
      : abs <= CAR.steerFastAt
        ? MathUtils.lerp(CAR.steerSlow, CAR.steerFast, abs / CAR.steerFastAt)
        : MathUtils.lerp(
            CAR.steerFast,
            CAR.steerBoost,
            Math.min((abs - CAR.steerFastAt) / (CAR.maxBoostSpeed - CAR.steerFastAt), 1),
          );
    const target = (Number(k.left) - Number(k.right)) * steerMax;
    const current = c.wheelSteering(0) ?? 0;
    const steer = MathUtils.lerp(current, target, 0.2);
    FRONT.forEach((i) => c.setWheelSteering(i, steer));

    // handbrake: at speed only the rear brakes, lightly, and loses its grip
    if (drifting) {
      FRONT.forEach((i) => c.setWheelBrake(i, 0));
      REAR.forEach((i) => c.setWheelBrake(i, CAR.driftBrake));
    } else {
      // hands off the wheel (a section's card is open, say): brake properly,
      // so pulling up at a section eases the truck to a stop
      const coast = drivingRef.current ? CAR.idleBrake : CAR.brakeForce;
      const brake = k.brake ? CAR.brakeForce : throttle === 0 ? coast : 0;
      for (let i = 0; i < 4; i++) c.setWheelBrake(i, brake);
    }
    const grip = drifting ? CAR.driftGrip : CAR.frictionSlip;
    rearGrip.current += (grip - rearGrip.current) * (drifting ? 0.4 : 0.05);
    REAR.forEach((i) => c.setWheelFrictionSlip(i, rearGrip.current));

    // wheels ignore sensors: fences and cacti are driven through, not over
    c.updateVehicle(w.timestep, rapier.QueryFilterFlags.EXCLUDE_SENSORS);

    const body = chassis.current;
    if (!body) return;

    let wheelsDown = 0;
    for (let i = 0; i < 4; i++) if (c.wheelIsInContact(i)) wheelsDown++;

    // swing the tail: a yaw nudge with the steering, stronger with speed
    if (drifting && wheelsDown >= 2) {
      const steerInput = Number(k.left) - Number(k.right);
      const amount = steerInput * CAR.driftYaw * Math.min(abs / 8, 1) * Math.sign(speed);
      body.applyTorqueImpulse({ x: 0, y: amount * w.timestep, z: 0 }, true);
    }

    // Nitrous: thrust straight through the centre of mass, level with the
    // ground, so it adds speed without pitching the truck. A hard shove the
    // moment it lights, then a push that fades out toward the boost ceiling.
    const boostingNow = k.boost && k.forward && wheelsDown > 0;
    if (boostingNow) {
      const r = body.rotation();
      _fwd.set(1, 0, 0).applyQuaternion(_q.set(r.x, r.y, r.z, r.w)).setY(0).normalize();
      const fade = MathUtils.clamp(1 - Math.pow(Math.max(0, speed) / CAR.maxBoostSpeed, 3), 0, 1);
      const dv = CAR.boostThrust * fade * w.timestep + (wasBoosting.current ? 0 : CAR.boostKick);
      body.applyImpulse({ x: _fwd.x * dv * CAR.mass, y: 0, z: _fwd.z * dv * CAR.mass }, true);
    }
    wasBoosting.current = boostingNow;

    // self-righting: torque along (truck up × world up), damped by tilt rate
    const r = body.rotation();
    const upX = 2 * (r.x * r.y - r.w * r.z);
    const upZ = 2 * (r.y * r.z + r.w * r.x);
    const onGround = wheelsDown >= 2;
    const strength = onGround ? CAR.uprightGround : CAR.uprightAir;
    const damping = CAR.uprightDamping * (onGround ? 1 : 0.5);
    const av = body.angvel();
    const dt = w.timestep;
    body.applyTorqueImpulse(
      {
        x: (-upZ * strength - av.x * damping) * dt,
        y: 0,
        z: (upX * strength - av.z * damping) * dt,
      },
      true,
    );
  });

  /* ── controller → visuals and telemetry, every rendered frame ── */
  useFrame((state, delta) => {
    const c = controller.current;
    const body = chassis.current;
    if (!c || !body) return;

    const k = drivingRef.current ? getKeys() : IDLE_KEYS;

    // wheels, then the shocks and axles hanging off them
    let grounded = 0;
    for (let i = 0; i < 4; i++) {
      const wheel = wheels.current[i];
      const spinner = spinners.current[i];
      const [x, y, z] = CAR.wheels[i];
      const suspension = c.wheelSuspensionLength(i) ?? CAR.suspensionRest;
      if (wheel && spinner) {
        wheel.position.set(x, y - suspension, z);
        wheel.rotation.y = c.wheelSteering(i) ?? 0;
        // the axle points along -Z, so a positive roll is a negative Z rotation
        spinner.rotation.z = -(c.wheelRotation(i) ?? 0);
      }
      // shock: from the frame mount down to just inboard of the hub
      _a.copy(SHOCK_TOPS[i]);
      _b.set(x, y - suspension, z * 0.7);
      span(springs.current[i], _a.clone().lerp(_b, 0.45), _b);
      span(rods.current[i], _a, _b);

      const inContact = c.wheelIsInContact(i);
      carState.contact[i] = inContact;
      if (inContact) {
        grounded++;
        const p = c.wheelContactPoint(i);
        if (p) carState.contactPoint[i].set(p.x, p.y, p.z);
      }
    }
    // solid axles: a beam between each pair of hubs, with the diff in the middle
    for (const [axle, [l, r]] of [[0, [0, 1]], [1, [2, 3]]] as const) {
      const wl = wheels.current[l];
      const wr = wheels.current[r];
      if (!wl || !wr) continue;
      _a.copy(wl.position).setZ(wl.position.z * 0.75);
      _b.copy(wr.position).setZ(wr.position.z * 0.75);
      span(axles.current[axle], _a, _b);
      diffs.current[axle]?.position.lerpVectors(_a, _b, 0.5);
    }

    // telemetry for the camera, dust, tracks and zones
    const p = body.translation();
    const v = body.linvel();
    const rot = body.rotation();
    _q.set(rot.x, rot.y, rot.z, rot.w);
    carState.position.set(p.x, p.y, p.z);
    carState.velocity.set(v.x, v.y, v.z);
    carState.forward.set(1, 0, 0).applyQuaternion(_q);
    carState.speed = c.currentVehicleSpeed();
    _right.set(0, 0, 1).applyQuaternion(_q);
    carState.slide = Math.abs(carState.velocity.dot(_right));
    carState.braking = k.brake;
    carState.drifting = k.brake && Math.abs(carState.speed) > CAR.driftMinSpeed && grounded > 0;
    const lit = k.boost && k.forward && grounded > 0;
    // the moment it lights: a jolt, a whoosh
    if (lit && !carState.boosting) {
      shake.amount = Math.min(1.2, shake.amount + 0.45);
      audio.whoosh();
    }
    carState.boosting = lit;

    // boost flames: flicker at the stack tips
    const t = state.clock.elapsedTime;
    flames.current.forEach((f, i) => {
      if (!f) return;
      f.visible = carState.boosting;
      if (f.visible) {
        const flicker = 0.7 + Math.sin(t * 60 + i * 2.3) * 0.15 + Math.random() * 0.35;
        f.scale.set(1.5, flicker * 3, 1.5);
        // embers spat out of every other pipe, blown back behind the truck
        if (i % 2 === 0 && Math.random() < 0.7) {
          f.getWorldPosition(_ember);
          _emberV.copy(carState.forward).multiplyScalar(-2 - Math.random() * 3);
          _emberV.y += 1.5 + Math.random() * 2.5;
          _emberV.x += (Math.random() - 0.5) * 1.5;
          _emberV.z += (Math.random() - 0.5) * 1.5;
          emit(_ember, _emberV, EMBERS[Math.floor(Math.random() * EMBERS.length)], {
            life: 0.3 + Math.random() * 0.35,
            size: 0.12 + Math.random() * 0.14,
            lift: 1.5,
          });
        }
      }
    });
    tailMaterial.color.copy(k.brake ? TAIL_BRAKE : TAIL_IDLE);

    // menu or map open: the world is frozen, so leave the jump and the
    // recovery timers where they are and let the engine idle
    if (pausedRef.current) {
      audio.engine(0, 0, false, false);
      audio.skid(0);
      return;
    }

    audio.skid(carState.drifting ? carState.slide : 0);
    audio.engine(
      carState.speed,
      Number(k.forward) - Number(k.back),
      carState.boosting,
      grounded === 0,
    );

    const upY = 1 - 2 * (rot.x * rot.x + rot.z * rot.z);

    // landing: shake and a ring of sand, scaled by how fast it came down
    if (grounded === 0) {
      if (!airborne.current) air.current = { time: 0, spin: 0, inverted: 0, botched: false, from: p.y, peak: p.y };
      airborne.current = true;
      fallSpeed.current = Math.min(fallSpeed.current, v.y);
      // the jump so far: time aloft, and tumble (yaw doesn't count)
      const j = air.current;
      const av = body.angvel();
      j.time += delta;
      j.peak = Math.max(j.peak, p.y);
      j.spin += Math.hypot(av.x, av.z) * delta;
      j.inverted = upY < 0.3 ? j.inverted + delta : 0;
      if (j.inverted > BOTCHED_AFTER) j.botched = true;
    } else if (airborne.current) {
      airborne.current = false;
      const impact = -fallSpeed.current;
      fallSpeed.current = 0;
      if (impact > 3.5) {
        audio.thud(impact);
        shake.amount = Math.min(1.2, shake.amount + impact * 0.05);
        burst(_a.set(p.x, 0.2, p.z), PALETTE.sand, Math.min(16, Math.round(impact * 1.5)), 3.5, 0.8);
      }
      // stuck the landing: call out the jump
      const j = air.current;
      const flips = Math.floor((j.spin + Math.PI * 2 - FULL_TURN) / (Math.PI * 2));
      const rose = j.peak - j.from >= MIN_RISE;
      if (!j.botched && rose && upY > 0.5 && (j.time >= BIG_AIR || flips > 0)) {
        audio.stunt(flips);
        emitWorld("stunt", { air: j.time, flips });
      }
    }

    // Thrown off the map by a blast: let the flight play out for a moment,
    // then back to the start. The one automatic reset.
    const outside = Math.abs(p.x) > HALF || Math.abs(p.z) > HALF || p.y < -10;
    outsideFor.current = outside ? outsideFor.current + delta : 0;
    if (outsideFor.current > OFF_MAP_AFTER) {
      outsideFor.current = 0;
      recover(true);
      return;
    }

    // On its back or side: no automatic reset — that's R's job, and righting
    // itself was annoying. Just flag it, so the interface can suggest R.
    upsideDownFor.current = upY < 0.3 ? upsideDownFor.current + delta : 0;
    carState.stuck = upsideDownFor.current > STUCK_AFTER;
  });

  return (
    <RigidBody
      ref={chassis}
      colliders={false}
      position={SPAWN.position}
      rotation={[0, SPAWN.yaw, 0]}
      canSleep={false}
      angularDamping={CAR.angularDamping}
      linearDamping={0.05}
      userData={{ truck: true }}
    >
      <CuboidCollider
        args={CAR.chassis}
        massProperties={{
          mass: CAR.mass,
          centerOfMass: { x: 0, y: CAR.centerOfMassY, z: 0 },
          principalAngularInertia: INERTIA,
          angularInertiaLocalFrame: { x: 0, y: 0, z: 0, w: 1 },
        }}
      />
      {/* the body's shape, for landing on its roof; the frame carries the mass */}
      <CuboidCollider args={CAR.body} position={[0, CAR.bodyY, 0]} density={0} />
      <TruckBody />

      {CAR.wheels.map((_, i) => (
        <group key={i} ref={(g) => void (wheels.current[i] = g)}>
          <group ref={(g) => void (spinners.current[i] = g)}>
            <mesh
              geometry={CAR.wheels[i][2] < 0 ? tireGeometries.left : tireGeometries.right}
              material={propMaterial}
              castShadow
            />
          </group>
        </group>
      ))}

      {CAR.wheels.map((_, i) => (
        <group key={i}>
          <mesh ref={(m) => void (springs.current[i] = m)} geometry={springGeometry} material={springMaterial} castShadow />
          <mesh ref={(m) => void (rods.current[i] = m)} geometry={rodGeometry} material={chromeMaterial} />
        </group>
      ))}

      {[0, 1].map((i) => (
        <group key={i}>
          <mesh ref={(m) => void (axles.current[i] = m)} geometry={axleGeometry} material={propMaterial} castShadow />
          <mesh ref={(m) => void (diffs.current[i] = m)} geometry={diffGeometry} material={propMaterial} />
        </group>
      ))}

      {/* boost flames, out of the end of every zoomie */}
      {FLAME_TIPS.map((tip, i) => (
        <group key={i} position={tip.position} rotation={tip.rotation}>
          <group ref={(g) => void (flames.current[i] = g)} visible={false}>
            <mesh geometry={flameOuterGeometry} material={flameOuterMaterial} />
            <mesh geometry={flameCoreGeometry} material={flameCoreMaterial} />
          </group>
        </group>
      ))}
    </RigidBody>
  );
}

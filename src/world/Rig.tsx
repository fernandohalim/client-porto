"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Camera and sun, both chasing the truck.
//
// The camera keeps a fixed isometric-ish angle and eases toward the truck, so
// it never rotates — the map always reads the same way up, which the minimap
// will rely on. Its distance follows `view.zoom`: a wide establishing shot
// while loading, easing in for the menu and again when driving starts. While
// driving it leads the truck slightly, so you see more of where you're going.
// Explosions and hard landings add shake on top.
//
// The shadow-casting sun moves with the truck too. One small shadow frustum
// that follows the action is far cheaper than one big enough to cover the
// whole desert, and on a weak GPU that is the difference that matters. It
// sits low for golden hour, so shadows stretch long across the sand.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type DirectionalLight, type PerspectiveCamera } from "three";
import { CAMERA, PALETTE, carState, shake } from "./config";
import { view } from "./events";

// low and from the right of the screen: long shadows falling toward the viewer's left
const SUN_OFFSET = new Vector3(14, 9, 9);
const SHADOW_EXTENT = 22;
const FOV = 30;
// boost throws the lens wide and the camera back, so the ground rushes past
const BOOST_FOV = 46;
const BOOST_PULL = 1.15;
const BOOST_RUMBLE = 0.07;

const focus = new Vector3();
const lead = new Vector3();
const aim = new Vector3();
const LEAD = 0.35; // seconds of travel to look ahead
const MAX_LEAD = 4; // m

export default function Rig() {
  const sun = useRef<DirectionalLight>(null);
  const primed = useRef(false);
  const pull = useRef(1);

  useFrame((state, delta) => {
    // snap on the first frame instead of sweeping in from the origin
    const t = primed.current ? 1 - Math.exp(-CAMERA.follow * delta) : 1;
    primed.current = true;

    // look ahead along the ground, only while actually driving
    lead.copy(carState.velocity).setY(0).multiplyScalar(view.playing ? LEAD : 0);
    if (lead.length() > MAX_LEAD) lead.setLength(MAX_LEAD);
    aim.copy(carState.position).add(lead);
    focus.lerp(aim, t);

    // zoom eases slowly, so each change of framing reads as a camera move
    view.zoom += (view.target - view.zoom) * (1 - Math.exp(-1.6 * delta));

    const cam = state.camera as PerspectiveCamera;
    pull.current += ((carState.boosting ? BOOST_PULL : 1) - pull.current) * (1 - Math.exp(-3 * delta));
    cam.position.copy(focus).addScaledVector(CAMERA.offset, view.zoom * pull.current);
    // a constant low rumble for as long as the nitrous burns
    if (carState.boosting) shake.amount = Math.max(shake.amount, BOOST_RUMBLE);

    // shake: random jitter scaled by a decaying amount
    if (shake.amount > 0.001) {
      const s = shake.amount;
      cam.position.x += (Math.random() - 0.5) * s;
      cam.position.y += (Math.random() - 0.5) * s;
      cam.position.z += (Math.random() - 0.5) * s;
      shake.amount *= Math.exp(-6 * delta);
    }
    cam.lookAt(focus);

    // the FOV kick sells the speed
    const fov = carState.boosting ? BOOST_FOV : FOV;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov += (fov - cam.fov) * (1 - Math.exp(-5 * delta));
      cam.updateProjectionMatrix();
    }

    const light = sun.current;
    if (light) {
      light.position.copy(focus).add(SUN_OFFSET);
      light.target.position.copy(focus);
      light.target.updateMatrixWorld();
    }
  });

  return (
    <directionalLight
      ref={sun}
      color={PALETTE.sun}
      intensity={3.8}
      castShadow
      shadow-mapSize={[2048, 2048]}
      // shadows at 60%: the sand under them stays warm and readable instead
      // of dropping to a hard dark cut-out
      shadow-intensity={0.6}
      // generous biases: a sun this low grazes the flat-shaded dunes and mesa
      // tops, which is exactly where shadow acne stripes show up
      shadow-bias={-0.0008}
      shadow-normalBias={0.09}
      shadow-camera-near={1}
      shadow-camera-far={60}
      shadow-camera-left={-SHADOW_EXTENT}
      shadow-camera-right={SHADOW_EXTENT}
      shadow-camera-top={SHADOW_EXTENT}
      shadow-camera-bottom={-SHADOW_EXTENT}
    />
  );
}

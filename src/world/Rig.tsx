"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Camera and sun, both chasing the truck.
//
// Two shots, blended by `view.title`:
//
//   title    low behind the parked truck, looking past the tailgate out over
//            the desert, with a little engine sway. It pushes in from further
//            back as the loader lifts (`view.dolly`).
//   driving  a fixed isometric-ish angle that eases after the truck and never
//            rotates — the map always reads the same way up, which the
//            minimap relies on. Its distance follows `view.zoom`; it leads the
//            truck slightly, so you see more of where you're going.
//
// Starting the game cranes from one to the other along an arc, eased at both
// ends. Pulling up at a section swoops the driving view the same way into
// that section's own shot (`view.shot`), and back out when its card closes. Explosions, hard landings and nitrous add shake on top.
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
import { CRANE_MS, SHOT_MS, view } from "./events";

// low and from the right of the screen: long shadows falling toward the viewer's left
const SUN_OFFSET = new Vector3(14, 9, 9);
const SHADOW_EXTENT = 22;
const FOV = 30;
// boost throws the lens wide and the camera back, so the ground rushes past
const BOOST_FOV = 46;
const BOOST_PULL = 1.15;
const BOOST_RUMBLE = 0.07;

// the title shot, in the truck's own frame: metres behind, up, and to the right
const TITLE_BACK = 7;
const TITLE_UP = 1.8;
const TITLE_SIDE = 0.9;
// where it looks: far ahead and a little below eye level, so the whole truck
// sits in the lower half and the sky above is left for the logo
const TITLE_AHEAD = 12;
const TITLE_LOOK_UP = 0.9;
const TITLE_FOV = 44;
// the push-in as the loader lifts: this much further back, and higher
const DOLLY_BACK = 7;
const DOLLY_UP = 2.5;
// how high the crane swings above the straight line between the two shots
const CRANE_ARC = 3;

const _fwd = new Vector3();
const _right = new Vector3();
const titlePos = new Vector3();
const titleLook = new Vector3();
const playPos = new Vector3();
const playLook = new Vector3();

// a section's arrival shot: a tighter lens, and a little hop on the way in
const SHOT_FOV = 34;
const SHOT_ARC = 2.5;

/** ease in and out: slow off the mark, slow into the landing */
const smooth = (t: number) => t * t * (3 - 2 * t);

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
    // the crane runs at a steady pace, eased by `smooth` below
    const craneStep = delta / (CRANE_MS / 1000);
    view.title =
      view.title > view.titleTarget
        ? Math.max(view.titleTarget, view.title - craneStep)
        : Math.min(view.titleTarget, view.title + craneStep);
    view.dolly += (view.dollyTarget - view.dolly) * (1 - Math.exp(-0.9 * delta));
    const shotStep = delta / (SHOT_MS / 1000);
    view.shot =
      view.shot > view.shotTarget
        ? Math.max(view.shotTarget, view.shot - shotStep)
        : Math.min(view.shotTarget, view.shot + shotStep);

    const cam = state.camera as PerspectiveCamera;
    pull.current += ((carState.boosting ? BOOST_PULL : 1) - pull.current) * (1 - Math.exp(-3 * delta));
    playPos.copy(focus).addScaledVector(CAMERA.offset, view.zoom * pull.current);
    playLook.copy(focus);

    // a section's shot, swooped into from the driving view
    const sh = smooth(view.shot);
    if (sh > 0) {
      playPos.lerp(view.shotPos, sh);
      playPos.y += Math.sin(Math.PI * sh) * SHOT_ARC;
      playLook.lerp(view.shotLook, sh);
    }

    // the title shot, built from the truck's heading
    const b = smooth(view.title);
    if (b > 0) {
      _fwd.copy(carState.forward).setY(0);
      if (_fwd.lengthSq() < 1e-4) _fwd.set(1, 0, 0);
      _fwd.normalize();
      _right.set(-_fwd.z, 0, _fwd.x);
      const back = TITLE_BACK + view.dolly * DOLLY_BACK;
      const t = state.clock.elapsedTime;
      titlePos
        .copy(carState.position)
        .addScaledVector(_fwd, -back)
        .addScaledVector(_right, TITLE_SIDE);
      // idle sway: the engine rocking a hand-held camera, barely
      titlePos.y = carState.position.y + TITLE_UP + view.dolly * DOLLY_UP + Math.sin(t * 1.3) * 0.05;
      titlePos.x += Math.sin(t * 0.7) * 0.06;
      titleLook
        .copy(carState.position)
        .addScaledVector(_fwd, TITLE_AHEAD)
        .setY(carState.position.y + TITLE_LOOK_UP);
      cam.position.lerpVectors(playPos, titlePos, b);
      // swing up over the arc on the way between the two
      cam.position.y += Math.sin(Math.PI * b) * CRANE_ARC;
    } else {
      cam.position.copy(playPos);
    }
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
    if (b > 0) cam.lookAt(titleLook.lerp(playLook, 1 - b));
    else cam.lookAt(playLook);

    // the FOV kick sells the speed; the title shot is wider and lower
    const driveFov = (carState.boosting ? BOOST_FOV : FOV) * (1 - sh) + SHOT_FOV * sh;
    const fov = driveFov * (1 - b) + TITLE_FOV * b;
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

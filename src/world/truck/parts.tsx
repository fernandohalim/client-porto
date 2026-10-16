"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The monster truck, muscle-car style: a gloss-black chopped coupe with flame
// graphics, sitting high on enormous paddle tyres. A chrome supercharger
// punches through the hood with eight zoomie pipes fanning out of the engine
// bay — the boost flames come out of those. Shark-tooth grille, slanted angry
// headlights, a ram bumper, a roof cage with a light bar, and spiked beadlock
// hubs on the outside of every wheel.
//
// Static pieces are merged by material (paint, chrome, trim, decals, lamps),
// so the whole body costs a handful of draw calls. The moving parts (wheels,
// shocks, axles, flames, brake lights) are driven from <Car> every frame.
//
// Chassis space: +X is the nose, +Y up, Z across. B is the floor of the body,
// which floats clear of the tyre tops the way a monster truck body does.
// ─────────────────────────────────────────────────────────────────────────────

import {
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Euler,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  Quaternion,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { CAR, PALETTE } from "../config";
import { merge, propMaterial, type Part } from "../geo";

type V3 = [number, number, number];

const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);
const tube = (r: number, len: number, seg = 8) => new CylinderGeometry(r, r, len, seg);
const ACROSS: V3 = [Math.PI / 2, 0, 0]; // a cylinder lying along Z
const ALONG: V3 = [0, 0, Math.PI / 2]; // a cylinder lying along X
const UP = new Vector3(0, 1, 0);

/** Euler that turns +Y onto `dir` */
function aim(dir: Vector3): V3 {
  const e = new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(UP, dir.clone().normalize()));
  return [e.x, e.y, e.z];
}

/** a cylinder of length `len` running from `from` along `dir` */
function pipe(from: Vector3, dir: Vector3, len: number, r: number, color: string): Part {
  const d = dir.clone().normalize();
  const mid = from.clone().addScaledVector(d, len / 2);
  return { geo: tube(r, len, 10), color, position: [mid.x, mid.y, mid.z], rotation: aim(d) };
}

const B = 0.42; // body floor
const BLACK = "#16131b";
const TRIM = "#24202a";

/* ── materials ── */

export const paintMaterial = new MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.3,
  metalness: 0.25,
  flatShading: true,
});
// a cool, slightly dark chrome: the warm reflections otherwise wash it out to bone
export const chromeMaterial = new MeshStandardMaterial({
  color: "#a9b2bf",
  metalness: 1,
  roughness: 0.16,
  flatShading: true,
});
const decalMaterial = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide });
const lampMaterial = new MeshBasicMaterial({ color: new Color(2.4, 2.1, 1.4), toneMapped: false });
export const tailMaterial = new MeshBasicMaterial({ color: new Color(0.9, 0.08, 0.06), toneMapped: false });
export const TAIL_IDLE = new Color(0.9, 0.08, 0.06);
export const TAIL_BRAKE = new Color(4, 0.3, 0.2);

/* ── gloss-black body ── */

const paintGeometry = merge([
  // the tub: one long slab, nose to tail
  { geo: box(2.1, 0.3, 1.24), color: BLACK, position: [0, B + 0.15, 0] },
  // a raised cowl down the middle of the long hood
  { geo: box(0.9, 0.06, 0.62), color: BLACK, position: [0.55, B + 0.33, 0] },
  // chopped cabin, low roof, set well back
  { geo: box(0.62, 0.28, 1.02), color: BLACK, position: [-0.36, B + 0.44, 0] },
  { geo: box(0.52, 0.05, 0.98), color: BLACK, position: [-0.38, B + 0.6, 0] },
  // fastback sloping down onto the trunk
  { geo: box(0.02, 0.36, 0.98), color: BLACK, position: [-0.78, B + 0.43, 0], rotation: [0, 0, -0.95] },
  // rear wing on two posts
  ...[1, -1].map((s) => ({ geo: box(0.06, 0.22, 0.06), color: BLACK, position: [-0.96, B + 0.4, s * 0.42] as V3 })),
  { geo: box(0.3, 0.04, 1.3), color: BLACK, position: [-0.98, B + 0.53, 0], rotation: [0, 0, 0.12] },
  ...[1, -1].map((s) => ({ geo: box(0.34, 0.16, 0.03), color: BLACK, position: [-0.98, B + 0.5, s * 0.66] as V3 })),
]);

/* ── trim: frame, glass, intake, ram bumper, grille mouth ── */

const trimGeometry = merge([
  // frame rails and crossmembers, visible between the wheels
  { geo: box(2.1, 0.12, 0.12), color: PALETTE.ink, position: [0, -0.05, 0.32] },
  { geo: box(2.1, 0.12, 0.12), color: PALETTE.ink, position: [0, -0.05, -0.32] },
  ...[-0.7, 0, 0.7].map((x) => ({ geo: box(0.1, 0.1, 0.7), color: PALETTE.ink, position: [x, -0.05, 0] as V3 })),
  // risers lifting the body off the frame
  ...[-0.55, 0.55].flatMap((x) => [-0.28, 0.28].map((z) => ({ geo: box(0.1, 0.42, 0.1), color: PALETTE.ink, position: [x, B / 2 - 0.02, z] as V3 }))),
  // raked windscreen, side windows, rear glass
  { geo: box(0.02, 0.36, 0.94), color: "#0d0b10", position: [0.04, B + 0.44, 0], rotation: [0, 0, 0.9] },
  ...[1, -1].map((s) => ({ geo: box(0.4, 0.18, 0.02), color: "#0d0b10", position: [-0.38, B + 0.46, s * 0.515] as V3 })),
  { geo: box(0.02, 0.26, 0.82), color: "#0d0b10", position: [-0.77, B + 0.44, 0], rotation: [0, 0, -0.95] },
  // the intake hat on top of the blower, with its butterfly slots
  { geo: box(0.36, 0.13, 0.44), color: TRIM, position: [0.42, B + 0.72, 0] },
  ...[-0.12, 0, 0.12].map((z) => ({ geo: box(0.26, 0.02, 0.06), color: "#0d0b10", position: [0.42, B + 0.79, z] as V3 })),
  // the shark mouth: a dark cavity across the nose
  { geo: box(0.04, 0.2, 0.86), color: "#5a1414", position: [1.055, B + 0.14, 0] },
  // ram bumper: a heavy bar, square and wide
  { geo: box(0.16, 0.18, 1.34), color: TRIM, position: [1.2, B - 0.06, 0] },
  { geo: box(0.3, 0.06, 0.12), color: TRIM, position: [1.1, B - 0.06, 0.3] },
  { geo: box(0.3, 0.06, 0.12), color: TRIM, position: [1.1, B - 0.06, -0.3] },
  // tail
  { geo: box(0.04, 0.22, 1.2), color: TRIM, position: [-1.06, B + 0.14, 0] },
]);

/* ── chrome: blower, zoomies, teeth, cage, bumper hoops ── */

/** zoomie headers: four a side, fanning up and back out of the engine bay */
const ZOOMIE_LENGTH = 0.62;
const zoomies = [1, -1].flatMap((side) =>
  [0.24, 0.4, 0.56, 0.72].map((x, i) => {
    const from = new Vector3(x, B + 0.34, side * 0.5);
    const dir = new Vector3(-0.42 - i * 0.04, 0.85, side * (0.3 + i * 0.05)).normalize();
    return { from, dir, tip: from.clone().addScaledVector(dir, ZOOMIE_LENGTH) };
  }),
);

const chromeGeometry = merge([
  // supercharger: case, fins, pulley — punching up through the hood
  { geo: box(0.52, 0.24, 0.36), color: PALETTE.chrome, position: [0.42, B + 0.52, 0] },
  ...[-0.14, -0.05, 0.05, 0.14].map((x) => ({ geo: box(0.03, 0.2, 0.4), color: PALETTE.chrome, position: [0.42 + x, B + 0.52, 0] as V3 })),
  { geo: tube(0.09, 0.06, 12), color: PALETTE.chrome, position: [0.7, B + 0.46, 0], rotation: ALONG },
  // zoomies, each with a flared lip
  ...zoomies.flatMap(({ from, dir, tip }) => [
    pipe(from, dir, ZOOMIE_LENGTH, 0.05, PALETTE.chrome),
    pipe(tip.clone().addScaledVector(dir, -0.05), dir, 0.06, 0.068, PALETTE.chrome),
  ]),
  // shark teeth: fangs down from the top of the mouth, up from the bottom
  ...Array.from({ length: 7 }, (_, i) => ({
    geo: new ConeGeometry(0.05, 0.13, 4),
    color: PALETTE.cream,
    position: [1.08, B + 0.2, (i - 3) * 0.12] as V3,
    rotation: [Math.PI, 0, 0] as V3,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    geo: new ConeGeometry(0.045, 0.11, 4),
    color: PALETTE.cream,
    position: [1.08, B + 0.08, (i - 2.5) * 0.12] as V3,
  })),
  // bumper horns: two chrome uprights on the ram, low enough to leave the teeth on show
  ...[1, -1].map((s) => ({ geo: tube(0.04, 0.24), color: PALETTE.chrome, position: [1.26, B + 0.06, s * 0.52] as V3 })),
  // roof cage: four posts, two side rails, front and rear bars
  ...[-0.62, -0.1].flatMap((x) => [1, -1].map((s) => ({ geo: tube(0.03, 0.34), color: PALETTE.chrome, position: [x, B + 0.75, s * 0.48] as V3 }))),
  ...[1, -1].map((s) => ({ geo: tube(0.03, 0.56), color: PALETTE.chrome, position: [-0.36, B + 0.92, s * 0.48] as V3, rotation: ALONG })),
  ...[-0.62, -0.1].map((x) => ({ geo: tube(0.03, 1), color: PALETTE.chrome, position: [x, B + 0.92, 0] as V3, rotation: ACROSS })),
]);

/* ── flame graphics ── */

function flameShape(scale: number) {
  // traced front to back: a straight leading edge, tongues licking rearward
  const pts: [number, number][] = [
    [0, -0.12], [0, 0.12], [-0.24, 0.13], [-0.15, 0.07], [-0.5, 0.1], [-0.33, 0.03],
    [-0.7, 0.0], [-0.33, -0.04], [-0.52, -0.09], [-0.17, -0.07], [-0.26, -0.13],
  ];
  const s = new Shape();
  pts.forEach(([x, y], i) => (i ? s.lineTo(x * scale, y * scale) : s.moveTo(x * scale, y * scale)));
  s.closePath();
  return new ShapeGeometry(s);
}

const decalGeometry = (() => {
  const parts: Part[] = [];
  const layers: [string, number, number][] = [
    ["#d8261b", 1.0, 0],
    ["#ff7a1a", 0.8, 0.002],
    ["#ffd23a", 0.55, 0.004],
  ];
  // down both flanks, from the nose
  for (const side of [1, -1]) {
    for (const [color, k, lift] of layers) {
      parts.push({
        geo: flameShape(1.25 * k),
        color,
        position: [1.04, B + 0.15, side * (0.621 + lift)],
      });
    }
  }
  // across the hood, either side of the blower, lying flat
  for (const z of [0.36, -0.36]) {
    for (const [color, k, lift] of layers) {
      parts.push({
        geo: flameShape(1.1 * k),
        color,
        position: [1.02, B + 0.301 + lift, z],
        rotation: [-Math.PI / 2, 0, 0],
      });
    }
  }
  return merge(parts);
})();

/* ── lamps: angry slanted headlights, roof light bar ── */

const lampGeometry = merge([
  // tilted so the inner ends dip, like a frown
  { geo: box(0.03, 0.07, 0.24), color: "#ffffff", position: [1.065, B + 0.26, 0.4], rotation: [-0.3, 0, 0] },
  { geo: box(0.03, 0.07, 0.24), color: "#ffffff", position: [1.065, B + 0.26, -0.4], rotation: [0.3, 0, 0] },
  ...[-0.32, -0.16, 0, 0.16, 0.32].map((z) => ({ geo: box(0.06, 0.07, 0.12), color: "#ffffff", position: [-0.08, B + 0.97, z] as V3 })),
]);

const tailGeometry = merge(
  [1, -1].map((s) => ({ geo: box(0.03, 0.07, 0.3), color: "#ffffff", position: [-1.085, B + 0.2, s * 0.38] as V3 })),
);

export function TruckBody() {
  return (
    <group>
      <mesh geometry={paintGeometry} material={paintMaterial} castShadow receiveShadow />
      <mesh geometry={trimGeometry} material={propMaterial} castShadow receiveShadow />
      <mesh geometry={chromeGeometry} material={chromeMaterial} castShadow />
      <mesh geometry={decalGeometry} material={decalMaterial} />
      <mesh geometry={lampGeometry} material={lampMaterial} />
      <mesh geometry={tailGeometry} material={tailMaterial} />
    </group>
  );
}

/* ── tyres: enormous paddles, beadlock rim and spiked hub on the outer face ── */

function tire(outward: 1 | -1) {
  const r = CAR.wheelRadius;
  const w = CAR.wheelWidth;
  const face = outward * (w / 2);
  const parts: Part[] = [
    { geo: new CylinderGeometry(r * 0.9, r * 0.9, w, 16), color: PALETTE.tire, rotation: ACROSS },
    // sidewall bulges
    ...[1, -1].map((s) => ({ geo: new TorusGeometry(r * 0.74, 0.07, 4, 16), color: "#35303b", position: [0, 0, s * w * 0.4] as V3 })),
    // the plain inner face
    { geo: new CylinderGeometry(r * 0.5, r * 0.5, 0.03, 10), color: PALETTE.ink, position: [0, 0, -face], rotation: ACROSS },
    // beadlock: a chrome ring with a circle of bolts, over a dark dish
    { geo: new CylinderGeometry(r * 0.56, r * 0.56, 0.04, 14), color: PALETTE.ink, position: [0, 0, face], rotation: ACROSS },
    { geo: new TorusGeometry(r * 0.56, 0.035, 4, 18), color: PALETTE.chrome, position: [0, 0, face + outward * 0.02] },
    ...Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return { geo: box(0.035, 0.035, 0.04), color: PALETTE.chrome, position: [Math.cos(a) * r * 0.56, Math.sin(a) * r * 0.56, face + outward * 0.04] as V3 };
    }),
    // the spiked hub: one long centre spike and a ring of short ones
    { geo: new CylinderGeometry(0.1, 0.12, 0.08, 8), color: PALETTE.chrome, position: [0, 0, face + outward * 0.04], rotation: ACROSS },
    { geo: new ConeGeometry(0.07, 0.3, 8), color: PALETTE.chrome, position: [0, 0, face + outward * 0.22], rotation: [outward * Math.PI / 2, 0, 0] },
    ...Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return {
        geo: new ConeGeometry(0.025, 0.12, 5),
        color: PALETTE.chrome,
        position: [Math.cos(a) * 0.14, Math.sin(a) * 0.14, face + outward * 0.1] as V3,
        rotation: [outward * Math.PI / 2, 0, 0] as V3,
      };
    }),
  ];
  // paddle tread: big chevron lugs, two staggered rows angled opposite ways
  const lugs = 14;
  for (let i = 0; i < lugs; i++) {
    for (const half of [1, -1]) {
      const a = ((i + (half > 0 ? 0 : 0.5)) / lugs) * Math.PI * 2;
      parts.push({
        geo: box(0.13, 0.2, w * 0.48).rotateX(half * 0.4),
        color: PALETTE.tire,
        position: [Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92, half * w * 0.25],
        rotation: [0, 0, a],
      });
    }
  }
  return merge(parts);
}

/** by which way the outside of the wheel faces: +Z (right side) or -Z (left) */
export const tireGeometries = { right: tire(1), left: tire(-1) };

/* ── shock absorber: spring over a chrome rod, scaled along Y to length ── */

export const springGeometry = new CylinderGeometry(0.07, 0.07, 1, 8, 1);
export const springMaterial = new MeshLambertMaterial({ color: PALETTE.coral, flatShading: true });
export const rodGeometry = new CylinderGeometry(0.03, 0.03, 1, 6, 1);

/* ── solid axle beam with a diff, length along Y (rotated by <Car>) ── */

export const axleGeometry = merge([{ geo: new CylinderGeometry(0.075, 0.075, 1, 8), color: PALETTE.ink }]);
export const diffGeometry = merge([
  { geo: new SphereGeometry(0.19, 8, 6), color: PALETTE.ink, scale: [1, 0.9, 0.8] },
  { geo: new CylinderGeometry(0.07, 0.07, 0.24, 6), color: PALETTE.chrome, position: [0.22, 0, 0], rotation: ALONG },
]);

/* ── boost flame: an outer cone and a hot core, pointing +Y ── */

export const flameOuterMaterial = new MeshBasicMaterial({ color: new Color(3, 1, 0.25), toneMapped: false });
export const flameCoreMaterial = new MeshBasicMaterial({ color: new Color(3.5, 3, 1.6), toneMapped: false });
export const flameOuterGeometry = new CylinderGeometry(0, 0.07, 0.55, 6, 1).translate(0, 0.275, 0);
export const flameCoreGeometry = new CylinderGeometry(0, 0.04, 0.32, 5, 1).translate(0, 0.16, 0);

/** where each zoomie ends and which way it points, chassis space */
export const FLAME_TIPS = zoomies.map(({ tip, dir }) => ({
  position: [tip.x, tip.y, tip.z] as V3,
  rotation: aim(dir),
}));

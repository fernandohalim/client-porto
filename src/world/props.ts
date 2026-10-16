// Geometry for every breakable prop, built once at module load.

import {
  BoxGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  SphereGeometry,
} from "three";
import { PALETTE } from "./config";
import { merge, type Part } from "./geo";

const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);
const cyl = (rt: number, rb: number, h: number, seg = 8) =>
  new CylinderGeometry(rt, rb, h, seg);

/* ── crate: a planked box with a darker frame ── */
export const CRATE_SIZE = 0.7;
export const crateGeometry = (() => {
  const s = CRATE_SIZE;
  const h = s / 2;
  const t = 0.07;
  const parts: Part[] = [{ geo: box(s - 0.02, s - 0.02, s - 0.02), color: PALETTE.wood }];
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      parts.push({ geo: box(t, s, t), color: PALETTE.woodDark, position: [x * (h - t / 2), 0, z * (h - t / 2)] });
    }
  }
  for (const y of [-1, 1]) {
    for (const x of [-1, 1]) parts.push({ geo: box(t, t, s), color: PALETTE.woodDark, position: [x * (h - t / 2), y * (h - t / 2), 0] });
    for (const z of [-1, 1]) parts.push({ geo: box(s, t, t), color: PALETTE.woodDark, position: [0, y * (h - t / 2), z * (h - t / 2)] });
  }
  // a diagonal brace across two faces
  for (const z of [-1, 1]) {
    parts.push({ geo: box(s * 1.2, t, 0.02), color: PALETTE.woodDark, position: [0, 0, z * (h + 0.005)], rotation: [0, 0, Math.PI / 4] });
  }
  return merge(parts);
})();

/* ── explosive barrel: red drum, hazard band, dark rings ── */
export const BARREL = { radius: 0.34, height: 0.95 };
export const explosiveBarrelGeometry = (() => {
  const { radius: r, height: h } = BARREL;
  return merge([
    { geo: cyl(r, r, h, 10), color: PALETTE.hazard },
    { geo: cyl(r + 0.015, r + 0.015, 0.05, 10), color: PALETTE.ink, position: [0, h * 0.3, 0] },
    { geo: cyl(r + 0.015, r + 0.015, 0.05, 10), color: PALETTE.ink, position: [0, -h * 0.3, 0] },
    { geo: cyl(r + 0.01, r + 0.01, 0.16, 10), color: PALETTE.yellow, position: [0, 0, 0] },
    { geo: cyl(r * 0.9, r * 0.9, 0.02, 10), color: PALETTE.ink, position: [0, h / 2 + 0.01, 0] },
    { geo: cyl(0.05, 0.05, 0.05, 6), color: PALETTE.chrome, position: [r * 0.5, h / 2 + 0.03, 0] },
  ]);
})();

/* ── cactus: saguaro with arms, three variants ── */
export const CACTUS_HEIGHT = 2;
export const cactusGeometries = [0, 1, 2].map((v) => {
  const c = PALETTE.cactus;
  const d = PALETTE.cactusDark;
  const parts: Part[] = [
    { geo: new CapsuleGeometry(0.22, 1.4, 3, 7), color: c, position: [0, 0.9, 0] },
    // ribs: thin darker capsules hugging the trunk
    { geo: new CapsuleGeometry(0.06, 1.3, 2, 4), color: d, position: [0.19, 0.9, 0] },
    { geo: new CapsuleGeometry(0.06, 1.3, 2, 4), color: d, position: [-0.19, 0.9, 0] },
  ];
  if (v !== 2) {
    parts.push(
      { geo: new CapsuleGeometry(0.13, 0.3, 3, 6), color: c, position: [0.35, 0.85, 0], rotation: [0, 0, Math.PI / 2] },
      { geo: new CapsuleGeometry(0.13, 0.45, 3, 6), color: c, position: [0.52, 1.15, 0] },
    );
  }
  if (v !== 1) {
    parts.push(
      { geo: new CapsuleGeometry(0.11, 0.22, 3, 6), color: c, position: [-0.3, 1.2, 0], rotation: [0, 0, Math.PI / 2] },
      { geo: new CapsuleGeometry(0.11, 0.35, 3, 6), color: c, position: [-0.44, 1.45, 0] },
    );
  }
  if (v === 0) {
    // a flower on top
    parts.push({ geo: new SphereGeometry(0.1, 5, 4), color: "#ff7aa8", position: [0, 1.85, 0] });
  }
  return merge(parts);
});

/* ── fence: one breakable span, two posts and two rails, along +X ── */
export const FENCE_SPAN = 2.6;
export const fenceGeometry = (() => {
  const L = FENCE_SPAN;
  return merge([
    { geo: box(0.12, 1, 0.12), color: PALETTE.woodDark, position: [-L / 2, 0.5, 0] },
    { geo: box(0.12, 1, 0.12), color: PALETTE.woodDark, position: [L / 2, 0.5, 0] },
    { geo: box(L, 0.12, 0.05), color: PALETTE.wood, position: [0, 0.75, 0] },
    { geo: box(L, 0.12, 0.05), color: PALETTE.wood, position: [0, 0.4, 0], rotation: [0, 0, 0.04] },
  ]);
})();

/* ── gas pump: explosive, of course ── */
export const gasPumpGeometry = (() =>
  merge([
    { geo: box(0.55, 1.3, 0.4), color: PALETTE.coral, position: [0, 0.65, 0] },
    { geo: box(0.42, 0.35, 0.02), color: PALETTE.cream, position: [0, 0.95, 0.21] },
    { geo: box(0.6, 0.12, 0.45), color: PALETTE.cream, position: [0, 1.36, 0] },
    { geo: cyl(0.04, 0.04, 0.6, 5), color: PALETTE.ink, position: [0.32, 0.6, 0.1] },
    { geo: box(0.08, 0.2, 0.08), color: PALETTE.ink, position: [0.32, 0.95, 0.12] },
  ]))();

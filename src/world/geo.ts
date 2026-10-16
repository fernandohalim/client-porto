// ─────────────────────────────────────────────────────────────────────────────
// Low-poly props are built from primitives, then merged into one geometry
// with the colours baked into vertices. One prop = one mesh = one draw call,
// however many boxes and capsules went into it — which is what keeps a desert
// full of breakable things affordable on a weak GPU.
// ─────────────────────────────────────────────────────────────────────────────

import {
  BufferAttribute,
  Color,
  Euler,
  Matrix4,
  MeshLambertMaterial,
  Quaternion,
  Vector3,
  type BufferGeometry,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type Part = {
  geo: BufferGeometry;
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

const _m = new Matrix4();
const _q = new Quaternion();
const _c = new Color();

export function merge(parts: Part[]): BufferGeometry {
  const geos = parts.map(({ geo, color, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.deleteAttribute("uv");
    _q.setFromEuler(new Euler(...rotation));
    _m.compose(new Vector3(...position), _q, new Vector3(...scale));
    g.applyMatrix4(_m);
    _c.set(color);
    const n = g.attributes.position.count;
    const colors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      colors[i * 3] = _c.r;
      colors[i * 3 + 1] = _c.g;
      colors[i * 3 + 2] = _c.b;
    }
    g.setAttribute("color", new BufferAttribute(colors, 3));
    return g;
  });
  const merged = mergeGeometries(geos);
  if (!merged) throw new Error("merge: incompatible geometries");
  merged.computeBoundingSphere();
  return merged;
}

const _up = new Vector3(0, 1, 0);

/** Euler angles that turn +Y onto `dir` — for laying a cylinder along a line */
export function aimEuler(dir: Vector3): [number, number, number] {
  _q.setFromUnitVectors(_up, dir.clone().normalize());
  const e = new Euler().setFromQuaternion(_q);
  return [e.x, e.y, e.z];
}

/** the one material every merged prop shares */
export const propMaterial = new MeshLambertMaterial({
  vertexColors: true,
  flatShading: true,
});

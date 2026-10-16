"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Breakable things strewn across the whole desert, so there is always
// something to drive through: cacti, crate stacks, and clusters of explosive
// barrels — with a big stash at the dead end of the canyon as a reward for
// driving all the way up it.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { CuboidCollider, CylinderCollider } from "@react-three/rapier";
import { LANDMARKS, PALETTE } from "../config";
import {
  BARREL,
  CACTUS_HEIGHT,
  CRATE_SIZE,
  cactusGeometries,
  crateGeometry,
  explosiveBarrelGeometry,
} from "../props";
import Breakable from "../destruct/Breakable";
import { BARREL_CLUSTERS, CACTI, CRATE_STACKS } from "./data";

type V3 = [number, number, number];

const CACTUS_DEBRIS = { count: 6, size: 0.3, colors: [PALETTE.cactus, PALETTE.cactusDark] };
const CRATE_DEBRIS = { count: 6, size: 0.3, colors: [PALETTE.wood, PALETTE.woodDark] };
const BARREL_DEBRIS = { count: 5, size: 0.28, colors: [PALETTE.hazard, PALETTE.ink, PALETTE.yellow] };

function Cacti() {
  const cacti = CACTI;
  return (
    <>
      {cacti.map((c, i) => {
        const s = 0.8 + c.r * 0.7;
        return (
          <Breakable
            key={i}
            position={[c.x, 0, c.z]}
            rotation={[0, c.r * Math.PI * 2, 0]}
            scale={s}
            geometry={cactusGeometries[i % cactusGeometries.length]}
            colliders={
              <CylinderCollider
                args={[(CACTUS_HEIGHT / 2) * s, 0.26 * s]}
                position={[0, (CACTUS_HEIGHT / 2) * s, 0]}
              />
            }
            breakSpeed={1}
            debris={CACTUS_DEBRIS}
            sound="plant"
            dust={PALETTE.sand}
          />
        );
      })}
    </>
  );
}

function CrateStack({ at, yaw }: { at: V3; yaw: number }) {
  const s = CRATE_SIZE;
  const c = Math.cos(yaw);
  const sn = Math.sin(yaw);
  const crates: V3[] = [];
  // a 3-2-1 pyramid, laid along the stack's own axis
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 3 - row; i++) {
      const lx = (i - (2 - row) / 2) * (s + 0.02);
      crates.push([at[0] + lx * c, s / 2 + row * s + 0.01, at[2] - lx * sn]);
    }
  }
  return (
    <>
      {crates.map((p, i) => (
        <Breakable
          key={i}
          position={p}
          rotation={[0, yaw, 0]}
          geometry={crateGeometry}
          colliders={<CuboidCollider args={[s / 2, s / 2, s / 2]} density={0.15} />}
          dynamic
          breakSpeed={3.5}
          debris={CRATE_DEBRIS}
        />
      ))}
    </>
  );
}

function Crates() {
  const stacks = CRATE_STACKS;
  return (
    <>
      {stacks.map((st, i) => (
        <CrateStack key={i} at={[st.x, 0, st.z]} yaw={st.r * Math.PI} />
      ))}
    </>
  );
}

function Barrel({ at }: { at: V3 }) {
  return (
    <Breakable
      position={[at[0], BARREL.height / 2 + 0.01, at[2]]}
      geometry={explosiveBarrelGeometry}
      colliders={<CylinderCollider args={[BARREL.height / 2, BARREL.radius]} density={0.15} />}
      dynamic
      breakSpeed={2}
      explosive
      debris={BARREL_DEBRIS}
      sound="metal"
    />
  );
}

function Barrels() {
  const clusters = BARREL_CLUSTERS;
  const barrels = useMemo(() => {
    const out: V3[] = [];
    for (const c of clusters) {
      const n = 2 + Math.floor(c.r * 2);
      for (let i = 0; i < n; i++) {
        const a = c.r * 10 + i * 2.1;
        out.push([c.x + Math.cos(a) * 0.8, 0, c.z + Math.sin(a) * 0.8]);
      }
    }
    // the canyon stash: a tight pile at the dead end
    const [ex, ez] = LANDMARKS.canyon.to;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const d = i === 0 ? 0 : 0.85;
      out.push([ex - 4 + Math.cos(a) * d, 0, ez + 4 + Math.sin(a) * d]);
    }
    return out;
  }, [clusters]);

  return (
    <>
      {barrels.map((b, i) => (
        <Barrel key={i} at={b} />
      ))}
    </>
  );
}

export default function Scatter() {
  return (
    <>
      <Cacti />
      <Crates />
      <Barrels />
    </>
  );
}

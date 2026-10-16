"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Red-rock mesas: a ring around the edge of the world, so it ends in cliffs
// rather than at an invisible wall, plus two rows facing each other to form
// the canyon running from beside the About road into the far corner.
//
// Each mesa is a stack of tiers that narrow toward a flat top, banded in
// alternating rock colours for the strata. All of them are merged into ONE
// geometry — the whole range is a single draw call — while each tier keeps
// its own cylinder collider.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { CylinderGeometry } from "three";
import { PALETTE } from "../config";
import { merge, propMaterial, type Part } from "../geo";
import { MESA_TIERS } from "./data";

const BANDS = [PALETTE.rock, PALETTE.rockLight, PALETTE.rockDark, PALETTE.rockLight];

export default function Mesas() {
  const tiers = MESA_TIERS;

  const geometry = useMemo(() => {
    const parts: Part[] = tiers.flatMap((t, i) => {
      const band = BANDS[i % BANDS.length];
      return [
        { geo: new CylinderGeometry(t.r * 0.94, t.r, t.h, 7), color: band, position: [t.x, t.y, t.z] as [number, number, number], rotation: [0, i, 0] as [number, number, number] },
        // a darker band just under each tier's top edge. Its top sits 4cm
        // below the tier top — level with it, the two faces z-fight
        { geo: new CylinderGeometry(t.r * 0.96, t.r * 0.96, 0.18, 7), color: PALETTE.rockDark, position: [t.x, t.y + t.h / 2 - 0.13, t.z] as [number, number, number], rotation: [0, i, 0] as [number, number, number] },
      ];
    });
    return merge(parts);
  }, [tiers]);

  return (
    <RigidBody type="fixed" colliders={false}>
      {tiers.map((t, i) => (
        <CylinderCollider key={i} args={[t.h / 2, t.r]} position={[t.x, t.y, t.z]} />
      ))}
      <mesh geometry={geometry} material={propMaterial} castShadow receiveShadow />
    </RigidBody>
  );
}

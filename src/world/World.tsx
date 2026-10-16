"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The 3D scene. Loaded client-only (Rapier is WebAssembly) from Experience.
//
// One look, no post-processing: flat-shaded low poly lit by a warm sun and a
// cool skylight. Everything the style needs comes from lighting and colour,
// which also keeps it light enough for a work laptop.
// ─────────────────────────────────────────────────────────────────────────────

import { Fragment, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  KeyboardControls,
  Lightformer,
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Car from "./Car";
import Rig from "./Rig";
import Explosions from "./destruct/Explosions";
import Dust from "./fx/Dust";
import Particles from "./fx/Particles";
import Tracks from "./fx/Tracks";
import Birds from "./life/Birds";
import Critters from "./life/Critters";
import Tumbleweeds from "./life/Tumbleweeds";
import GroundDetail from "./map/GroundDetail";
import Jumps from "./map/Jumps";
import Junkyard from "./map/Junkyard";
import Landmarks from "./map/Landmarks";
import Mesas from "./map/Mesas";
import PitStop from "./map/PitStop";
import Roads from "./map/Roads";
import Scatter from "./map/Scatter";
import SetPieces from "./map/SetPieces";
import Terrain from "./map/Terrain";
import Zones from "./map/Zones";
import { CAMERA, CONTROLS, PALETTE, SPAWN } from "./config";

/** mounts as soon as this chunk has loaded and the canvas exists */
function Mounted({ onMount }: { onMount: () => void }) {
  useEffect(() => onMount(), [onMount]);
  return null;
}

/** mounts only once Physics has finished loading Rapier, which is the real "ready" */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

/**
 * Reflections for the few glossy surfaces (chrome, water), rendered once from
 * a handful of warm light panels — no HDR file to download.
 */
function Reflections() {
  return (
    <Environment resolution={64} frames={1}>
      <color attach="background" args={[PALETTE.fog]} />
      <Lightformer intensity={3} color={PALETTE.sun} position={[6, 3, 4]} scale={[6, 3, 1]} />
      <Lightformer intensity={1.5} color={PALETTE.skyTop} position={[-5, 5, -3]} scale={[8, 4, 1]} />
      <Lightformer intensity={1} color={PALETTE.skyHorizon} rotation-x={Math.PI / 2} position={[0, 6, 0]} scale={[10, 10, 1]} />
    </Environment>
  );
}

export default function World({
  driving,
  paused,
  resetKey,
  onMount,
  onReady,
}: {
  driving: boolean;
  /** menu or map open: the simulation holds still behind it */
  paused: boolean;
  /** bumped to rebuild every breakable and movable object */
  resetKey: number;
  onMount: () => void;
  onReady: () => void;
}) {
  return (
    <KeyboardControls map={CONTROLS}>
      <Canvas
        shadows
        // capped: retina at full density is the single biggest cost on a weak GPU
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: true }}
        camera={{
          fov: 30,
          near: 1,
          far: 160,
          position: [
            SPAWN.position[0] + CAMERA.offset.x,
            SPAWN.position[1] + CAMERA.offset.y,
            SPAWN.position[2] + CAMERA.offset.z,
          ],
        }}
      >
        <Mounted onMount={onMount} />
        <color attach="background" args={[PALETTE.fog]} />
        <fog attach="fog" args={[PALETTE.fog, 34, 85]} />
        <hemisphereLight args={[PALETTE.skyLight, PALETTE.groundLight, 0.9]} />
        <Rig />
        <Reflections />

        <Suspense fallback={null}>
          <Physics paused={paused}>
            <Terrain />
            <Mesas />
            <Jumps />
            <Fragment key={resetKey}>
              <PitStop />
              <Roads />
              <Landmarks />
              <Scatter />
              <SetPieces />
              <Junkyard />
              <Tumbleweeds />
            </Fragment>
            <Zones />
            <Explosions />
            <Car driving={driving} paused={paused} />
            <Ready onReady={onReady} />
          </Physics>
        </Suspense>

        <Particles />
        <Dust />
        <Tracks />
        <Birds />
        <Critters />
        <GroundDetail />
      </Canvas>
    </KeyboardControls>
  );
}

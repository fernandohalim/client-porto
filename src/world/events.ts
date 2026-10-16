// Messages between the HTML interface and the 3D world, without threading
// callbacks through the Canvas: commands in (respawn, travel, celebrate) and
// moments out (stunt, arrive).

import { Vector3 } from "three";

type Events = {
  respawn: undefined;
  /** drop the truck at a world position, x/z */
  travel: [number, number];
  /** something was found: confetti and a toot from the truck */
  celebrate: undefined;
  /** a landed jump worth calling out: seconds aloft, full turns in the air */
  stunt: { air: number; flips: number };
  /** the truck pulled up at a section spot (its id, from map/sections/frame) */
  arrive: string;
};
type Listener<K extends keyof Events> = (payload: Events[K]) => void;

// typed at the edges; stored loosely inside
const listeners = new Map<keyof Events, Set<(payload: unknown) => void>>();

export function emitWorld<K extends keyof Events>(
  event: K,
  ...payload: Events[K] extends undefined ? [] : [Events[K]]
) {
  listeners.get(event)?.forEach((l) => l(payload[0]));
}

export function onWorld<K extends keyof Events>(event: K, listener: Listener<K>) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  const set = listeners.get(event)!;
  const loose = listener as (payload: unknown) => void;
  set.add(loose);
  return () => {
    set.delete(loose);
  };
}

/**
 * What the camera should frame. `zoom`/`target` scale the driving view's
 * distance; `title` blends from the low title shot behind the truck (1) to the
 * driving view (0), heading for `titleTarget`; `dolly` pushes the title shot
 * in from further back (1) to tight on the tailgate (0).
 */
export const view = {
  zoom: 1,
  target: 1,
  playing: false,
  title: 1,
  titleTarget: 1,
  dolly: 1,
  dollyTarget: 1,
  /** a section's arrival shot: 0 = off, 1 = fully swooped in; and where */
  shot: 0,
  shotTarget: 0,
  shotPos: new Vector3(),
  shotLook: new Vector3(),
};

/** how long the swoop into (and back out of) a section's shot takes */
export const SHOT_MS = 1100;

/** how long the crane from the title shot up to the driving view takes */
export const CRANE_MS = 1700;

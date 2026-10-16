// Messages between the HTML interface and the 3D world, without threading
// callbacks through the Canvas: commands in (respawn, travel, celebrate) and
// moments out (stunt).

type Events = {
  respawn: undefined;
  /** drop the truck at a world position, x/z */
  travel: [number, number];
  /** something was found: confetti and a toot from the truck */
  celebrate: undefined;
  /** a landed jump worth calling out: seconds aloft, full turns in the air */
  stunt: { air: number; flips: number };
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

/** what the camera should frame: wide during loading, closer as play begins */
export const view = { zoom: 2.4, target: 2.4, playing: false };

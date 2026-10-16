// ─────────────────────────────────────────────────────────────────────────────
// Fog of war and discovery.
//
// The fog is a low-resolution canvas laid over the map: thick, cloudy
// parchment that the truck wipes away around itself as it drives. Drawn back
// up at map size with smoothing, its low resolution reads as soft edges.
//
// What has been revealed is remembered on a coarse grid, and which sections
// and landmarks have been found as lists — both kept in this browser's storage, so a return
// visit picks up where the last one left off. Storage is a convenience: if it
// is unavailable, the map simply starts fogged again.
// ─────────────────────────────────────────────────────────────────────────────

import { LANDMARK_PINS, ZONE_PINS, MAP_SIZE, SCALE, toMap } from "./art";
import { seeded } from "../../map/layout";

const FOG_RES = 4; // map pixels per fog pixel
export const FOG_SIZE = MAP_SIZE / FOG_RES;
const REVEAL_RADIUS = 16; // metres cleared around the truck
const DISCOVER_RADIUS = 9; // metres from a zone's centre to count as found

const GRID = 48; // cells per side of the remembered-reveal grid
// bumped when the map grew: fog saved against the old size would sit in the wrong place
const STORE_KEY = "world-map-2";

let fog: HTMLCanvasElement | null = null;
const cells = new Uint8Array(GRID * GRID);
const found = new Set<string>();
// kept apart from `found`, which is the sections tally the map shows
const landmarks = new Set<string>();
let dirty = false;

const listeners = new Set<() => void>();
let snapshot: string[] = [];

function notify() {
  snapshot = [...found];
  listeners.forEach((l) => l());
}

export function subscribeFound(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export const getFound = () => snapshot;
const emptyFound: string[] = [];
export const getServerFound = () => emptyFound;

function load() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as { cells?: string; found?: string[]; landmarks?: string[] };
    if (data.cells?.length === GRID * GRID) {
      for (let i = 0; i < cells.length; i++) cells[i] = data.cells.charCodeAt(i) === 49 ? 1 : 0;
    }
    data.found?.forEach((id) => found.add(id));
    data.landmarks?.forEach((id) => landmarks.add(id));
  } catch {
    // corrupt or blocked: start fresh
  }
}

function save() {
  if (!dirty) return;
  dirty = false;
  try {
    let s = "";
    for (let i = 0; i < cells.length; i++) s += cells[i] ? "1" : "0";
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ cells: s, found: [...found], landmarks: [...landmarks] }),
    );
  } catch {
    // storage blocked: the fog just won't be remembered
  }
}

/** erase a soft hole in the fog at map pixel (px, py) */
function clear(px: number, py: number, radiusPx: number) {
  if (!fog) return;
  const ctx = fog.getContext("2d")!;
  const x = px / FOG_RES;
  const y = py / FOG_RES;
  const r = radiusPx / FOG_RES;
  ctx.globalCompositeOperation = "destination-out";
  const g = ctx.createRadialGradient(x, y, r * 0.35, x, y, r);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalCompositeOperation = "source-over";
}

function cellCentre(i: number): [number, number] {
  const gx = i % GRID;
  const gy = Math.floor(i / GRID);
  return [((gx + 0.5) / GRID) * MAP_SIZE, ((gy + 0.5) / GRID) * MAP_SIZE];
}

/** the fog canvas, built (and restored from storage) on first use */
export function getFog() {
  if (fog) return fog;
  load();
  fog = document.createElement("canvas");
  fog.width = FOG_SIZE;
  fog.height = FOG_SIZE;
  const ctx = fog.getContext("2d")!;
  // unmapped parchment: a touch darker than the inked paper, so the explored
  // part reads as the drawn-on area
  ctx.fillStyle = "#e6d2a8";
  ctx.fillRect(0, 0, FOG_SIZE, FOG_SIZE);
  // soft, warm cloud blotches, so the fog has some body without going grey
  const rand = seeded(211);
  for (let i = 0; i < 70; i++) {
    const x = rand() * FOG_SIZE;
    const y = rand() * FOG_SIZE;
    const r = 10 + rand() * 30;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const light = rand() > 0.4;
    g.addColorStop(0, light ? "rgba(250, 238, 212, 0.6)" : "rgba(205, 170, 120, 0.25)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // re-open everything a previous visit uncovered
  const cellRadius = (MAP_SIZE / GRID) * 1.1;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i]) clear(...cellCentre(i), cellRadius * 1.6);
  }
  notify();
  window.setInterval(save, 4000);
  window.addEventListener("pagehide", save);
  return fog;
}

/**
 * Clear the fog around the truck; returns any sections or landmarks found for
 * the first time this call, so the interface can announce them.
 */
export function reveal(x: number, z: number): string[] {
  if (!fog) getFog();
  const [px, py] = toMap(x, z);
  clear(px, py, REVEAL_RADIUS * SCALE);

  // remember it on the grid
  const gx = Math.floor((px / MAP_SIZE) * GRID);
  const gy = Math.floor((py / MAP_SIZE) * GRID);
  const span = Math.ceil(((REVEAL_RADIUS * SCALE) / MAP_SIZE) * GRID * 0.7);
  for (let dy = -span; dy <= span; dy++) {
    for (let dx = -span; dx <= span; dx++) {
      const cx = gx + dx;
      const cy = gy + dy;
      if (cx < 0 || cy < 0 || cx >= GRID || cy >= GRID) continue;
      if (dx * dx + dy * dy > span * span) continue;
      const i = cy * GRID + cx;
      if (!cells[i]) {
        cells[i] = 1;
        dirty = true;
      }
    }
  }

  const fresh: string[] = [];
  for (const pin of ZONE_PINS) {
    if (found.has(pin.id)) continue;
    if (Math.hypot(x - pin.world[0], z - pin.world[1]) < DISCOVER_RADIUS) {
      found.add(pin.id);
      fresh.push(pin.id);
    }
  }
  if (fresh.length) {
    dirty = true;
    notify();
  }
  for (const pin of LANDMARK_PINS) {
    if (landmarks.has(pin.id)) continue;
    if (Math.hypot(x - pin.world[0], z - pin.world[1]) < pin.radius) {
      landmarks.add(pin.id);
      fresh.push(pin.id);
      dirty = true;
    }
  }
  return fresh;
}

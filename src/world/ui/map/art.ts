// ─────────────────────────────────────────────────────────────────────────────
// The paper map, painted once onto a canvas from the same data that builds the
// 3D desert: parchment, a faint survey grid, dune contours, dashed dirt roads,
// hatched mesas, the oasis, landmark sketches and hand-lettered names.
//
// It is turned 45° to match the camera, so "up" on the map is "up" on screen
// and pressing W always moves the marker up. The world's square border
// therefore sits on the paper as a diamond, like a map folded off-true.
// ─────────────────────────────────────────────────────────────────────────────

import { HALF, JUMPS, LANDMARKS, PALETTE, PLAYGROUND, ZONES } from "../../config";
import { CACTI, DUNES, MESA_TIERS, ROCKS } from "../../map/data";
import { HUB, PLAZA_RADIUS, ROAD_WIDTH, jumpDirection, roadCurves, seeded } from "../../map/layout";

export const MAP_SIZE = 1400;
/**
 * world metres from the centre to the paper's edge: the square's corners land
 * on the paper's axes at HALF·√2, plus room for the mesas past them
 */
export const EXTENT = Math.ceil(HALF * Math.SQRT2 + 10);
/** the title and compass were drawn for a 1024px sheet */
const K = MAP_SIZE / 1024;
export const SCALE = MAP_SIZE / (2 * EXTENT);
const C = MAP_SIZE / 2;
const R2 = Math.SQRT1_2;

export const INK = "#3b2a22";
export const PAPER = "#f1e1bd";

/** world x/z → map pixels */
export function toMap(x: number, z: number): [number, number] {
  return [C + (x + z) * R2 * SCALE, C + (z - x) * R2 * SCALE];
}

/** a world direction (x/z) → an angle on the map, radians */
export function mapAngle(dx: number, dz: number) {
  return Math.atan2((dz - dx) * R2, (dx + dz) * R2);
}

export const ZONE_NAMES: Record<string, string> = {
  about: "About me",
  work: "Selected work",
  experience: "Experience",
  stack: "Stack",
  freelance: "Freelance",
  contact: "Contact",
};

/** a hand-drawn closed blob: a circle with a wobbly, seeded edge */
function blob(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, seed: number, wobble = 0.12) {
  const rand = seeded(seed);
  const n = 14;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (rand() - 0.5) * 2 * wobble;
    pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k]);
  }
  ctx.beginPath();
  // a smooth curve through the midpoints
  const mid = (i: number) => {
    const [ax, ay] = pts[i % n];
    const [bx, by] = pts[(i + 1) % n];
    return [(ax + bx) / 2, (ay + by) / 2];
  };
  const [sx, sy] = mid(0);
  ctx.moveTo(sx, sy);
  for (let i = 1; i <= n; i++) {
    const [cx, cy] = pts[i % n];
    const [mx, my] = mid(i);
    ctx.quadraticCurveTo(cx, cy, mx, my);
  }
  ctx.closePath();
}

function paper(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

  const rand = seeded(101);
  // coffee stains and age marks
  for (let i = 0; i < 9; i++) {
    const x = rand() * MAP_SIZE;
    const y = rand() * MAP_SIZE;
    const r = 40 + rand() * 140;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(150, 100, 50, 0.07)");
    g.addColorStop(0.8, "rgba(150, 100, 50, 0.04)");
    g.addColorStop(1, "rgba(150, 100, 50, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // fibre speckle
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(110, 75, 40, ${0.04 + rand() * 0.08})`;
    ctx.fillRect(rand() * MAP_SIZE, rand() * MAP_SIZE, 1 + rand() * 1.5, 1 + rand() * 1.5);
  }
}

function grid(ctx: CanvasRenderingContext2D) {
  // a survey grid along the world's own axes — diagonal on the paper
  ctx.strokeStyle = "rgba(90, 60, 30, 0.09)";
  ctx.lineWidth = 1;
  for (let v = -EXTENT * 1.5; v <= EXTENT * 1.5; v += 10) {
    ctx.beginPath();
    ctx.moveTo(...toMap(v, -EXTENT * 1.5));
    ctx.lineTo(...toMap(v, EXTENT * 1.5));
    ctx.moveTo(...toMap(-EXTENT * 1.5, v));
    ctx.lineTo(...toMap(EXTENT * 1.5, v));
    ctx.stroke();
  }
}

function dunes(ctx: CanvasRenderingContext2D) {
  ctx.lineWidth = 1.6;
  DUNES.forEach((d, i) => {
    // the visible cap of the buried sphere
    const cap = Math.sqrt(d.r * d.r - (d.r - d.h) * (d.r - d.h));
    const [x, y] = toMap(d.x, d.z);
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = `rgba(160, 110, 60, ${0.35 - k * 0.08})`;
      blob(ctx, x, y, cap * SCALE * (1 - k * 0.3), 300 + i * 7 + k, 0.08);
      ctx.stroke();
    }
  });
}

function roads(ctx: CanvasRenderingContext2D) {
  for (const { curve } of roadCurves) {
    const pts = curve.getSpacedPoints(60).map((p) => toMap(p.x, p.z));
    const line = () => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    };
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    line();
    ctx.strokeStyle = "rgba(200, 150, 95, 0.55)";
    ctx.lineWidth = ROAD_WIDTH * SCALE;
    ctx.stroke();
    line();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function plaza(ctx: CanvasRenderingContext2D) {
  const [x, y] = toMap(0, 0);
  blob(ctx, x, y, PLAZA_RADIUS * SCALE, 91, 0.05);
  ctx.fillStyle = "rgba(205, 150, 100, 0.75)";
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function oasis(ctx: CanvasRenderingContext2D) {
  const [x, y] = toMap(...LANDMARKS.oasis);
  blob(ctx, x, y, 5.4 * SCALE, 77, 0.15);
  ctx.fillStyle = "#86c9c6";
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  // ripples
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 1.5;
  for (const [dx, dy, w] of [[-10, -6, 18], [6, 8, 14], [12, -10, 10]]) {
    ctx.beginPath();
    ctx.moveTo(x + dx - w / 2, y + dy);
    ctx.quadraticCurveTo(x + dx, y + dy - 4, x + dx + w / 2, y + dy);
    ctx.stroke();
  }
  // palms round the shore: little ink asterisks
  ctx.strokeStyle = "#3f7a3c";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const px = x + Math.cos(a) * 7.4 * SCALE;
    const py = y + Math.sin(a) * 7.4 * SCALE;
    for (let k = 0; k < 5; k++) {
      const b = (k / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(b) * 8, py + Math.sin(b) * 8);
      ctx.stroke();
    }
  }
}

function mesas(ctx: CanvasRenderingContext2D) {
  const fills = ["#d98a66", "#e3a37d", "#c87355"];
  // bases first, so higher tiers stack on top
  const tiers = [...MESA_TIERS].sort((a, b) => a.y - b.y);
  tiers.forEach((t, i) => {
    const [x, y] = toMap(t.x, t.z);
    const r = t.r * SCALE;
    blob(ctx, x, y, r, 500 + i, 0.1);
    ctx.fillStyle = fills[i % fills.length];
    ctx.fill();
    // hatching, clipped to the tier
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = "rgba(90, 40, 25, 0.28)";
    ctx.lineWidth = 1.2;
    for (let k = -r; k < r; k += 7) {
      ctx.beginPath();
      ctx.moveTo(x + k - r, y + r);
      ctx.lineTo(x + k + r, y - r);
      ctx.stroke();
    }
    ctx.restore();
    blob(ctx, x, y, r, 500 + i, 0.1);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function rocksAndCacti(ctx: CanvasRenderingContext2D) {
  ROCKS.forEach((r, i) => {
    const [x, y] = toMap(r.x, r.z);
    blob(ctx, x, y, Math.max(4, r.s * SCALE * 0.8), 700 + i, 0.25);
    ctx.fillStyle = "#b9674a";
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  ctx.strokeStyle = "#3f7a3c";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  for (const c of CACTI) {
    const [x, y] = toMap(c.x, c.z);
    // a little saguaro glyph
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y - 7);
    ctx.moveTo(x, y);
    ctx.lineTo(x - 4, y);
    ctx.lineTo(x - 4, y - 4);
    ctx.moveTo(x, y - 2);
    ctx.lineTo(x + 4, y - 2);
    ctx.lineTo(x + 4, y - 6);
    ctx.stroke();
  }
}

function landmarks(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = INK;
  ctx.fillStyle = PALETTE.cream;
  ctx.lineWidth = 2;

  // gas station: a little shop with a canopy
  {
    const [x, y] = toMap(...LANDMARKS.gasStation);
    ctx.fillStyle = "#f4ead8";
    ctx.fillRect(x - 16, y - 10, 20, 16);
    ctx.strokeRect(x - 16, y - 10, 20, 16);
    ctx.fillStyle = PALETTE.coral;
    ctx.fillRect(x + 6, y - 12, 16, 5);
    ctx.strokeRect(x + 6, y - 12, 16, 5);
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 7);
    ctx.lineTo(x + 8, y + 6);
    ctx.moveTo(x + 20, y - 7);
    ctx.lineTo(x + 20, y + 6);
    ctx.stroke();
  }
  // water tower: tank on legs
  {
    const [x, y] = toMap(...LANDMARKS.waterTower);
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 12);
    ctx.lineTo(x - 5, y - 2);
    ctx.moveTo(x + 8, y + 12);
    ctx.lineTo(x + 5, y - 2);
    ctx.stroke();
    ctx.fillStyle = PALETTE.teal;
    ctx.beginPath();
    ctx.ellipse(x, y - 7, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // pit stop: the shack, sketched as a little barn
  {
    const [x, y] = toMap(...LANDMARKS.shack);
    ctx.fillStyle = PALETTE.wood;
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 10);
    ctx.lineTo(x - 14, y - 4);
    ctx.lineTo(x, y - 14);
    ctx.lineTo(x + 14, y - 4);
    ctx.lineTo(x + 14, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = PALETTE.teal;
    ctx.fillRect(x - 4, y + 1, 8, 9);
    ctx.strokeRect(x - 4, y + 1, 8, 9);
  }
  // the windmill: a tower and a wheel
  {
    const [x, y] = toMap(...LANDMARKS.windmill);
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 12);
    ctx.lineTo(x, y - 6);
    ctx.lineTo(x + 7, y + 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
    ctx.stroke();
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x + Math.cos(a) * 8, y - 8 + Math.sin(a) * 8);
      ctx.stroke();
    }
  }
  // the hub signpost
  {
    const [x, y] = toMap(...HUB);
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x, y - 12);
    ctx.moveTo(x - 9, y - 8);
    ctx.lineTo(x + 9, y - 8);
    ctx.moveTo(x - 7, y - 2);
    ctx.lineTo(x + 7, y - 2);
    ctx.stroke();
  }
  // canyon stash: an X marks the spot
  {
    const [ex, ez] = LANDMARKS.canyon.to;
    const [x, y] = toMap(ex - 4, ez + 4);
    ctx.strokeStyle = PALETTE.hazard;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 9);
    ctx.lineTo(x + 9, y + 9);
    ctx.moveTo(x + 9, y - 9);
    ctx.lineTo(x - 9, y + 9);
    ctx.stroke();
  }
}

/** the jumps: a hatched wedge pointing the way you leave it, wider for a dune */
function jumps(ctx: CanvasRenderingContext2D) {
  for (const j of JUMPS) {
    const [dx, dz] = jumpDirection(j.heading);
    const reach = j.kind === "dune" ? 13 : 9;
    const [x0, y0] = toMap(...j.at);
    const [x1, y1] = toMap(j.at[0] + dx * reach, j.at[1] + dz * reach);
    const a = mapAngle(dx, dz);
    const half = (j.kind === "dune" ? 5 : 2) * SCALE;
    const nx = -Math.sin(a) * half;
    const ny = Math.cos(a) * half;
    ctx.beginPath();
    ctx.moveTo(x0 + nx, y0 + ny);
    ctx.lineTo(x1 + nx, y1 + ny);
    ctx.lineTo(x1 - nx, y1 - ny);
    ctx.lineTo(x0 - nx, y0 - ny);
    ctx.closePath();
    ctx.fillStyle =
      j.kind === "dune" ? "rgba(214, 160, 105, 0.7)" : j.kind === "slab" ? "#c97a5a" : j.kind === "scrap" ? "#9a7a62" : "#d6a070";
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
    // the lip: a heavy line across the high end, and a dashed flight off it
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1 + nx, y1 + ny);
    ctx.lineTo(x1 - nx, y1 - ny);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + Math.cos(a) * 34, y1 + Math.sin(a) * 34);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

/** the junkyard: a fence ring, wrecks as little boxes, the crusher, the tyre heap */
function junkyard(ctx: CanvasRenderingContext2D) {
  const { at, radius } = LANDMARKS.junkyard;
  const [x, y] = toMap(...at);
  ctx.beginPath();
  ctx.arc(x, y, radius * SCALE, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(170, 125, 95, 0.55)";
  ctx.fill();
  ctx.strokeStyle = PALETTE.steelDark;
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
  const rand = seeded(181);
  const paints = ["#d9785f", "#5fa8a0", "#d8b04a", "#8c7bd1", "#c9c2b2"];
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 7; i++) {
    const a = rand() * Math.PI * 2;
    const d = (0.25 + rand() * 0.55) * radius * SCALE;
    ctx.save();
    ctx.translate(x + Math.cos(a) * d, y + Math.sin(a) * d);
    ctx.rotate(rand() * Math.PI);
    ctx.fillStyle = paints[i % paints.length];
    ctx.fillRect(-9, -5, 18, 10);
    ctx.strokeRect(-9, -5, 18, 10);
    ctx.restore();
  }
  // tyres: little rings
  ctx.strokeStyle = PALETTE.tire;
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(x - 18 + i * 6, y + 26 - (i % 2) * 5, 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  // the crusher: a yellow block
  ctx.fillStyle = PALETTE.yellow;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.fillRect(x + 20, y - 34, 18, 18);
  ctx.strokeRect(x + 20, y - 34, 18, 18);
}

/** set pieces: the billboard, the bowling lane, the barrel fuse, crate towers */
function setPieces(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  // billboard: a board on two legs
  {
    const [x, y] = toMap(...PLAYGROUND.billboard);
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 12);
    ctx.lineTo(x - 8, y - 2);
    ctx.moveTo(x + 8, y + 12);
    ctx.lineTo(x + 8, y - 2);
    ctx.stroke();
    ctx.fillStyle = PALETTE.cream;
    ctx.fillRect(x - 15, y - 16, 30, 14);
    ctx.strokeRect(x - 15, y - 16, 30, 14);
    ctx.fillStyle = PALETTE.coral;
    ctx.fillRect(x - 15, y - 7, 30, 5);
  }
  // bowling: the lane, and ten green dots racked at the end
  {
    const { from, to } = PLAYGROUND.bowling;
    const [x0, y0] = toMap(...from);
    const [x1, y1] = toMap(...to);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(200, 150, 95, 0.75)";
    ctx.lineWidth = 3.6 * SCALE;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const ux = (to[0] - from[0]) / len;
    const uz = (to[1] - from[1]) / len;
    ctx.fillStyle = "#3f7a3c";
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i <= row; i++) {
        const along = len + row * 1.05;
        const across = (i - row / 2) * 1.1;
        const [px, py] = toMap(from[0] + ux * along - uz * across, from[1] + uz * along + ux * across);
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  // the fuse: a red dotted line of barrels, and an X at the stash
  {
    ctx.fillStyle = PALETTE.hazard;
    const pts = PLAYGROUND.fuse;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      const n = Math.max(1, Math.round(Math.hypot(bx - ax, bz - az) / 3));
      for (let k = 0; k < n; k++) {
        const [px, py] = toMap(ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n);
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const [ex, ez] = pts.at(-1)!;
    const [x, y] = toMap(ex + 1.8, ez - 1.2);
    ctx.strokeStyle = PALETTE.hazard;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 8);
    ctx.lineTo(x + 8, y + 8);
    ctx.moveTo(x + 8, y - 8);
    ctx.lineTo(x - 8, y + 8);
    ctx.stroke();
  }
  // crate towers: a little stack of squares
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.fillStyle = PALETTE.wood;
  for (const t of PLAYGROUND.towers) {
    const [x, y] = toMap(...t);
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x - 5, y - 6 - i * 9, 10, 9);
      ctx.strokeRect(x - 5, y - 6 - i * 9, 10, 9);
    }
  }
}

function labels(ctx: CanvasRenderingContext2D, family: string) {
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const label = (text: string, x: number, z: number, dy: number, size = 30) => {
    const [px, py] = toMap(x, z);
    ctx.font = `700 ${size}px ${family}`;
    // a paper-coloured halo, so lettering stays legible over ink and hatching
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 7;
    ctx.lineJoin = "round";
    ctx.strokeText(text, px, py + dy);
    ctx.fillText(text, px, py + dy);
  };
  label("The oasis", LANDMARKS.oasis[0], LANDMARKS.oasis[1], 58);
  label("Old gas station", LANDMARKS.gasStation[0], LANDMARKS.gasStation[1], 32);
  label("Water tower", LANDMARKS.waterTower[0], LANDMARKS.waterTower[1], 30);
  label("Pit stop", LANDMARKS.shack[0], LANDMARKS.shack[1], -30);
  const { from, to } = LANDMARKS.canyon;
  // beside the canyon rather than in it, clear of the mesa rows, and nearer
  // its mouth than its middle — further up, the fuse's label has that spot
  const k = 0.3;
  label("The canyon", from[0] + (to[0] - from[0]) * k - 13, from[1] + (to[1] - from[1]) * k - 13, 0, 32);
  label("?", to[0] - 4, to[1] + 4, -24, 30);
  // above the yard: below it is where the Work pin hangs its name
  label("Junkyard", LANDMARKS.junkyard.at[0], LANDMARKS.junkyard.at[1], -(LANDMARKS.junkyard.radius * SCALE + 20), 34);
  const { to: lane } = PLAYGROUND.bowling;
  label("Cactus bowling", lane[0], lane[1], 34, 28);
  const fuseEnd = PLAYGROUND.fuse.at(-1)!;
  label("Fuse", fuseEnd[0], fuseEnd[1], 28, 28);
}

function cartouche(ctx: CanvasRenderingContext2D, family: string) {
  // title banner, top centre
  ctx.save();
  ctx.translate(C, 70 * K);
  ctx.scale(K, K);
  ctx.fillStyle = "rgba(241, 225, 189, 0.92)";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-210, -32);
  ctx.lineTo(210, -32);
  ctx.lineTo(190, 0);
  ctx.lineTo(210, 32);
  ctx.lineTo(-210, 32);
  ctx.lineTo(-190, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = `700 46px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Fernando's Desert", 0, 2);
  ctx.restore();

  // compass rose, bottom right, north pointing the way the truck drives off
  ctx.save();
  ctx.translate(MAP_SIZE - 110 * K, MAP_SIZE - 110 * K);
  ctx.scale(K, K);
  ctx.strokeStyle = INK;
  ctx.lineJoin = "round";

  // a double ring
  ctx.fillStyle = "rgba(241, 225, 189, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.stroke();

  /**
   * One point of the rose, from the hub out to `len` along `angle` (0 = up),
   * `width` wide at the hub: split down its spine into a lit half and a
   * shaded half, so it reads as bevelled. Points meet at the hub without
   * overlapping each other.
   */
  const point = (angle: number, len: number, width: number, lit: string, shade: string) => {
    const tip: [number, number] = [Math.sin(angle) * len, -Math.cos(angle) * len];
    const side = (s: number): [number, number] => [
      Math.sin(angle + (s * Math.PI) / 4) * width,
      -Math.cos(angle + (s * Math.PI) / 4) * width,
    ];
    for (const [s, fill] of [[1, lit], [-1, shade]] as const) {
      const [sx, sy] = side(s);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(...tip);
      ctx.lineTo(sx, sy);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };
  // the in-between points first, smaller, behind
  for (let i = 0; i < 4; i++) point(Math.PI / 4 + (i * Math.PI) / 2, 30, 6, "#e3cfa6", "#b89b6e");
  // then the four main ones: north in coral
  point(0, 56, 10, PALETTE.coral, "#c93a28");
  for (const a of [Math.PI / 2, Math.PI, (Math.PI * 3) / 2]) point(a, 50, 10, PALETTE.cream, "#c9ad80");
  // the hub
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // and an N over the north point
  ctx.font = `700 26px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 5;
  ctx.strokeStyle = PAPER;
  ctx.strokeText("N", 0, -60);
  ctx.fillStyle = INK;
  ctx.fillText("N", 0, -60);
  ctx.restore();
}

function edges(ctx: CanvasRenderingContext2D) {
  // burnt, darkened edges
  const g = ctx.createRadialGradient(C, C, MAP_SIZE * 0.36, C, C, MAP_SIZE * 0.72);
  g.addColorStop(0, "rgba(120, 70, 30, 0)");
  g.addColorStop(1, "rgba(120, 70, 30, 0.35)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);
}

type MapArt = {
  /** the terrain itself — fog of war goes over this */
  base: HTMLCanvasElement;
  /** the title, compass and aged edges — drawn over the fog, always legible */
  overlay: HTMLCanvasElement;
};

let art: Promise<MapArt> | null = null;

function sheet(paint: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = MAP_SIZE;
  canvas.height = MAP_SIZE;
  paint(canvas.getContext("2d")!);
  return canvas;
}

/** the finished map, painted once and shared by the minimap and the big map */
export function getMapArt(family: string) {
  art ??= (async () => {
    try {
      await document.fonts.load(`700 30px ${family}`);
    } catch {
      // the fallback face is fine
    }
    const base = sheet((ctx) => {
      paper(ctx);
      grid(ctx);
      dunes(ctx);
      roads(ctx);
      plaza(ctx);
      oasis(ctx);
      mesas(ctx);
      rocksAndCacti(ctx);
      landmarks(ctx);
      jumps(ctx);
      junkyard(ctx);
      setPieces(ctx);
      labels(ctx, family);
    });
    const overlay = sheet((ctx) => {
      cartouche(ctx, family);
      edges(ctx);
    });
    return { base, overlay };
  })();
  return art;
}

/** where each section's pin goes, and where travelling there drops the truck */
export const ZONE_PINS = ZONES.map((z) => {
  const [x, , zz] = z.position;
  const d = Math.hypot(x, zz) || 1;
  return {
    id: z.id,
    color: z.color,
    name: ZONE_NAMES[z.id] ?? z.id,
    world: [x, zz] as [number, number],
    // a little short of the pad, on the hub side, clear of the flagpole
    drop: [x - (x / d) * 7, zz - (zz / d) * 7] as [number, number],
  };
});

/**
 * Landmarks worth arriving at. Not sections, so they don't count toward the
 * map's tally — but rolling up to one for the first time is still a moment.
 */
export const LANDMARK_PINS: { id: string; name: string; world: [number, number]; radius: number }[] = [
  { id: "oasis", name: "The oasis", world: LANDMARKS.oasis, radius: 9 },
  { id: "gas-station", name: "Old gas station", world: LANDMARKS.gasStation, radius: 7 },
  { id: "water-tower", name: "Water tower", world: LANDMARKS.waterTower, radius: 6 },
  {
    id: "canyon",
    name: "The canyon",
    world: [
      (LANDMARKS.canyon.from[0] + LANDMARKS.canyon.to[0]) / 2,
      (LANDMARKS.canyon.from[1] + LANDMARKS.canyon.to[1]) / 2,
    ],
    radius: LANDMARKS.canyon.width / 2 + 1,
  },
  { id: "junkyard", name: "The junkyard", world: LANDMARKS.junkyard.at, radius: LANDMARKS.junkyard.radius },
];

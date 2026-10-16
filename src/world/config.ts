import { Vector3 } from "three";

// ─────────────────────────────────────────────────────────────────────────────
// Everything tunable about the world lives here, so feel can be adjusted
// without reading physics code.
//
// Axes: +Y is up. The car's local forward is +X and its left is -Z. The camera
// looks diagonally along (+X, -Z), so a car spawned facing that way drives
// straight "up" the screen.
// ─────────────────────────────────────────────────────────────────────────────

// Golden hour: a low warm sun against a cool, lilac skylight, so the lit sides
// glow and the shadows turn purple instead of the whole scene going orange.
export const PALETTE = {
  // sky and light
  skyTop: "#f28a5b",
  skyHorizon: "#ffd29a",
  fog: "#f2c39b",
  sun: "#ffc48a",
  skyLight: "#b9c4ff",
  groundLight: "#9b6458",
  // desert
  sand: "#efc597",
  sandDark: "#dfa877",
  dune: "#e7b582",
  road: "#d29766",
  track: "#bb7f52",
  rock: "#c26a4c",
  rockLight: "#d98c64",
  rockDark: "#94493a",
  cactus: "#3f8f55",
  cactusDark: "#2f7044",
  water: "#2fb7c4",
  palm: "#4d9a4a",
  // props and the truck
  coral: "#ff4f3a",
  teal: "#1fb5a5",
  yellow: "#ffc23a",
  violet: "#7b5cff",
  cream: "#fff3e2",
  ink: "#2b2230",
  tire: "#2a2530",
  wood: "#a5643b",
  woodDark: "#7c4528",
  chrome: "#d9dde3",
  bone: "#f4ead8",
  hazard: "#e3342f",
  // the junkyard: sun-faded paint on tired metal
  rust: "#b4643c",
  rustDark: "#7e3f25",
  steel: "#8d97a3",
  steelDark: "#5f6873",
  oil: "#8a6a52",
  // two more section colours
  sky: "#4aa8e0",
  pink: "#ff7aa8",
};

export const CONTROLS = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "back", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  // a handbrake: at speed it lets the rear go and the truck drifts
  { name: "brake", keys: ["Space"] },
  { name: "boost", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "reset", keys: ["KeyR"] },
  { name: "horn", keys: ["KeyH"] },
];

/** keys that, pressed on the start menu, drop straight into driving */
export const DRIVE_KEYS = new Set(
  CONTROLS.filter((c) => ["forward", "back", "left", "right"].includes(c.name))
    .flatMap((c) => c.keys),
);

export const SPAWN = {
  position: [0, 2, 0] as [number, number, number],
  // turning +X by 45° about Y points it along (+X, -Z): straight up the screen
  yaw: Math.PI / 4,
};

// A monster truck: a wide stance on enormous tyres and long, soft suspension,
// so every bump becomes a bounce and every landing a wobble.
//
// Tuned in a headless Rapier sim of this exact truck. Cruising turns and
// slaloms stay planted, on the flat and across dune flanks; boost, turn AND
// brake together tip it onto its side, and a nearby explosion rolls it over.
// Flips are earned, not constant — and only R puts it back on its wheels.
// (The one automatic reset: thrown off the map, it respawns at the hub.)
export const CAR = {
  // half-extents of the frame collider, which carries all the mass
  chassis: [0.95, 0.15, 0.5] as [number, number, number],
  // the body's collider: massless, but it is what the truck lands on when it
  // rolls, so it ends up on its roof or side rather than balanced on the frame
  body: [1.05, 0.3, 0.62] as [number, number, number],
  bodyY: 0.62,
  mass: 1,
  // A knife edge, found by simulation: at -0.26 a boosted full-lock turn tips
  // straight over; at -0.29 it never does. -0.3, with a touch of ground
  // self-righting below, keeps dune crossings upright and leaves the flips to
  // brake-turns and explosions.
  centerOfMassY: -0.3,
  wheelRadius: 0.55,
  wheelWidth: 0.5,
  // connection points, chassis space: front-left, front-right, rear-left, rear-right
  wheels: [
    [0.8, -0.08, -0.92],
    [0.8, -0.08, 0.92],
    [-0.8, -0.08, -0.92],
    [-0.8, -0.08, 0.92],
  ] as [number, number, number][],

  // suspension — low damping is what makes the truck bounce and wobble
  suspensionRest: 0.38,
  suspensionStiffness: 17,
  suspensionCompression: 0.55,
  suspensionRelaxation: 0.8,
  maxSuspensionTravel: 0.5,
  // below the default (10.5): the rear lets go under hard turns
  frictionSlip: 3.4,

  engineForce: 2.6,
  // nitrous: a thrust on the body (m/s²) on top of the engine, a much higher
  // ceiling, and a kick when it lights
  boostThrust: 9,
  boostKick: 2.2, // m/s added in one go when boost fires
  // top speeds (m/s); engine force fades out as each is approached
  maxSpeed: 11,
  maxBoostSpeed: 22,
  maxReverseSpeed: 5,
  brakeForce: 0.14,
  // gentle drag when nothing is pressed, so the truck rolls to a stop
  idleBrake: 0.03,
  // steering narrows with speed, but not so far that a fast turn is safe
  steerSlow: Math.PI / 5.5,
  steerFast: 0.34,
  steerFastAt: 11, // m/s
  // narrower still at full boost, or a flick of the wheel rolls it
  steerBoost: 0.17,

  // Handbrake drift: Space above `driftMinSpeed` drops the rear tyres' grip,
  // so the back swings out, and a yaw nudge from the steering helps start the
  // slide. Below that speed Space is an ordinary brake. Grip snaps away and
  // comes back gradually, so letting go straightens out instead of snapping.
  driftMinSpeed: 4,
  driftGrip: 0.9,
  driftYaw: 1.6,
  driftBrake: 0.015,
  angularDamping: 0.15,

  // Self-righting torque, toward world up. Only a touch on the ground (6 made
  // it unflippable), a little in the air so most jumps land on the tyres.
  uprightGround: 0.8,
  uprightAir: 0.3,
  uprightDamping: 0.3,
};

export const CAMERA = {
  // camera position relative to the car: behind-left and high, isometric-ish
  offset: new Vector3(-11, 13, 11),
  // how quickly the camera catches up — higher is tighter
  follow: 4,
};

/**
 * half-width of the drivable square; mesas and invisible walls sit on it.
 * The sections and the pit stop sit inside the middle ±48; everything past
 * that is open desert for speed, jumps and the junkyard.
 */
export const HALF = 72;

/**
 * Where each portfolio section will live, spread out across the desert so
 * finding them is a drive: About is the nearest, up the screen from the start;
 * the rest sit out toward the edges. Spots were picked by a clearance search
 * against everything else on the map (the canyon, the junkyard, every jump's
 * run, the set pieces), so each has 10 m of open ground around it.
 *
 * Each section is a themed landmark (map/sections), facing the end of its
 * road. `clear` is how far scattered props keep away from its centre.
 */
export const ZONES = [
  { id: "about", position: [6, 0, -38], color: PALETTE.coral, clear: 8 },
  { id: "work", position: [28, 0, 56], color: PALETTE.teal, clear: 10 },
  { id: "experience", position: [-32, 0, -54], color: PALETTE.yellow, clear: 9 },
  { id: "stack", position: [-34, 0, 6], color: PALETTE.sky, clear: 8 },
  { id: "freelance", position: [2, 0, 32], color: PALETTE.pink, clear: 8 },
  { id: "contact", position: [-52, 0, 40], color: PALETTE.violet, clear: 8 },
] as const;

export type ZoneId = (typeof ZONES)[number]["id"];

type XZ = [number, number];

/**
 * Dirt roads, as control points for a smooth curve. Every one but the canyon
 * starts dead centre, under the pit-stop plaza, so their ends are hidden and
 * they all fan out of one place. `fence` marks which stretch (0–1 along the
 * road) is lined with breakable fencing.
 */
//
// Each section road keeps its first stretch out of the plaza exactly where it
// always was — the pit stop's props are placed in the gaps between them — and
// only bends away toward its zone after that.
export const ROADS: { to: string; points: XZ[]; fence?: [number, number] }[] = [
  { to: "about", points: [[0, 0], [2.5, -2.5], [7, -10], [12, -15], [11, -25], [7.5, -31.5]], fence: [0.2, 0.55] },
  { to: "work", points: [[0, 0], [3.5, 1.2], [14, 6], [24, 14], [30, 30], [30, 44], [28.5, 49.5]], fence: [0.15, 0.4] },
  { to: "experience", points: [[0, 0], [-2.5, -2.5], [-4, -14], [-10, -22], [-21, -31], [-26, -45], [-29, -49]] },
  { to: "contact", points: [[0, 0], [-2.5, 2.5], [-12, 4], [-18, 12], [-30, 18], [-40, 28], [-46.5, 35]], fence: [0.2, 0.5] },
  // the two newer sections branch off the Contact and Work roads, so the
  // plaza keeps its four exits
  { to: "stack", points: [[-12, 4], [-19, 3], [-25, 4.5], [-28, 5.5]] },
  { to: "freelance", points: [[14, 6], [10, 14], [5.5, 21], [3.5, 26]] },
  // branching off the About road and up through the canyon
  { to: "canyon", points: [[12, -15], [19, -19], [26, -26], [34, -33], [48, -48], [62, -62]] },
  // branching off the Work road, out to the junkyard gate
  { to: "junkyard", points: [[24, 14], [33, 15], [40, 20], [43, 29], [45.5, 35.5]], fence: [0.3, 0.75] },
];

export const LANDMARKS = {
  // the pit stop at the start: a garage shack up-left of the plaza, a
  // windmill off to the right — both in gaps between the roads
  shack: [1.2, -10.5] as XZ,
  windmill: [6, 9] as XZ,
  oasis: [-25, -11] as XZ,
  gasStation: [16, 21] as XZ,
  waterTower: [-11, 25] as XZ,
  // the canyon runs along the diagonal from near the About road into the corner
  canyon: { from: [22, -22] as XZ, to: [66, -66] as XZ, width: 8 },
  // a fenced yard of wrecks off the Work road; its own road meets the gate
  junkyard: { at: [50, 46] as XZ, radius: 12 },
};

/**
 * Natural jumps: dirt kickers, rock slabs leaning on boulders, and dune lips.
 * `at` is the foot of the ramp, `heading` the way you drive up it (degrees,
 * 0 = +X, 90 = -Z). Most face 45°, straight up the screen, so the landing is
 * in view. Each needs open ground ahead: they launch the truck ~15 m.
 */
export type JumpKind = "kicker" | "slab" | "dune" | "scrap";
export const JUMPS: { kind: JumpKind; at: XZ; heading: number }[] = [
  { kind: "kicker", at: [-18, -40], heading: 90 },
  { kind: "kicker", at: [40, 6], heading: 45 },
  { kind: "slab", at: [-48, -2], heading: 90 },
  { kind: "slab", at: [48, -18], heading: 45 },
  { kind: "dune", at: [-36, 50], heading: 45 },
  { kind: "dune", at: [4, 52], heading: 45 },
  { kind: "scrap", at: [50, 24], heading: 45 },
];

/** set pieces built to be wrecked, out in the open desert */
export const PLAYGROUND = {
  // a giant billboard on two legs, facing the camera from the far side of the
  // junkyard road — on the near side it would stand between camera and truck
  billboard: [45, 16] as XZ,
  // a straight dirt lane with ten cactus "pins" racked at the far end
  bowling: { from: [-28, -28] as XZ, to: [-50, -50] as XZ },
  // a fuse of explosive barrels, close enough to chain, ending in a stash
  fuse: [[2, -52], [10, -57], [18, -55], [26, -60], [33, -63]] as XZ[],
  // tall columns of crates
  towers: [[-58, -28], [-42, 16], [-22, 62]] as XZ[],
};

/**
 * Live car telemetry, written by <Car> every frame and read by anything that
 * follows it: camera, sun, dust, tracks, and later the section zones. A plain
 * mutable object rather than React state — it changes 60 times a second.
 */
export const carState = {
  position: new Vector3(...SPAWN.position),
  /** world-space velocity */
  velocity: new Vector3(),
  /** world-space nose direction */
  forward: new Vector3(1, 0, 0),
  speed: 0,
  boosting: false,
  braking: false,
  /** per wheel: in contact, and where the tyre touches the ground */
  contact: [false, false, false, false],
  contactPoint: [new Vector3(), new Vector3(), new Vector3(), new Vector3()],
  /** how hard the rear is sliding sideways, m/s */
  slide: 0,
  /** handbrake held at speed */
  drifting: false,
  /** on its back for a while: R will fix it */
  stuck: false,
};

/** camera shake, added to by explosions and hard landings, decays in <Rig> */
export const shake = { amount: 0 };

// ─────────────────────────────────────────────────────────────────────────────
// Every sound in the world, synthesised with Web Audio — no audio files to
// download. An engine that climbs with speed and roars on boost, thuds for
// landings, crunches for smashed props, booms for barrels, and a horn — over a
// quiet bed of desert wind with the odd bird call.
//
// Browsers only allow sound after a gesture, so nothing is created until the
// first key or click calls `unlock()`. Every call before that is a no-op.
// ─────────────────────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

let engineGain: GainNode | null = null;
let engineLow: OscillatorNode | null = null;
let engineHigh: OscillatorNode | null = null;
let engineFilter: BiquadFilterNode | null = null;

let hornGain: GainNode | null = null;
let skidGain: GainNode | null = null;

const MUTE_KEY = "world-muted";
let muted = (() => {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
})();

const VOLUME = 0.55;

export function isMuted() {
  return muted;
}

const muteListeners = new Set<() => void>();
export function subscribeMuted(listener: () => void) {
  muteListeners.add(listener);
  return () => {
    muteListeners.delete(listener);
  };
}

export function setMuted(next: boolean) {
  muted = next;
  muteListeners.forEach((l) => l());
  try {
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    // storage blocked: the choice just won't stick
  }
  if (ctx && master) master.gain.setTargetAtTime(next ? 0 : VOLUME, ctx.currentTime, 0.05);
}

export function unlock() {
  if (ctx) {
    if (ctx.state === "suspended") void ctx.resume();
    return;
  }
  const AC = window.AudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : VOLUME;
  master.connect(ctx.destination);

  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  // engine: a sawtooth and a square an octave down, through a lowpass that
  // opens up with speed
  engineFilter = ctx.createBiquadFilter();
  engineFilter.type = "lowpass";
  engineFilter.frequency.value = 300;
  engineFilter.Q.value = 3;
  engineGain = ctx.createGain();
  engineGain.gain.value = 0;
  engineLow = ctx.createOscillator();
  engineLow.type = "square";
  engineHigh = ctx.createOscillator();
  engineHigh.type = "sawtooth";
  engineLow.connect(engineFilter);
  engineHigh.connect(engineFilter);
  engineFilter.connect(engineGain);
  engineGain.connect(master);
  engineLow.start();
  engineHigh.start();

  // horn: two squares a third apart, held while the key is down
  hornGain = ctx.createGain();
  hornGain.gain.value = 0;
  const hornFilter = ctx.createBiquadFilter();
  hornFilter.type = "lowpass";
  hornFilter.frequency.value = 1600;
  for (const f of [349, 440]) {
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = f;
    o.connect(hornFilter);
    o.start();
  }
  hornFilter.connect(hornGain);
  hornGain.connect(master);

  // tyre scrub: bandpassed noise, silent until a drift opens it up
  const scrub = ctx.createBufferSource();
  scrub.buffer = noise;
  scrub.loop = true;
  const scrubFilter = ctx.createBiquadFilter();
  scrubFilter.type = "bandpass";
  scrubFilter.frequency.value = 1300;
  scrubFilter.Q.value = 2.5;
  skidGain = ctx.createGain();
  skidGain.gain.value = 0;
  scrub.connect(scrubFilter).connect(skidGain).connect(master);
  scrub.start();

  ambience();
}

/**
 * The desert, underneath everything: looped noise through a soft bandpass
 * whose level and pitch wander on two slow, out-of-step LFOs, so the wind
 * gusts and sighs instead of hissing flat. Kept well under the engine.
 */
function ambience() {
  if (!ctx || !master || !noise) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  src.playbackRate.value = 0.5;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 420;
  filter.Q.value = 0.7;
  const wind = ctx.createGain();
  wind.gain.value = 0.035;

  const gust = ctx.createOscillator();
  gust.frequency.value = 0.11;
  const gustDepth = ctx.createGain();
  gustDepth.gain.value = 0.025;
  gust.connect(gustDepth).connect(wind.gain);

  const sweep = ctx.createOscillator();
  sweep.frequency.value = 0.07;
  const sweepDepth = ctx.createGain();
  sweepDepth.gain.value = 180;
  sweep.connect(sweepDepth).connect(filter.frequency);

  src.connect(filter).connect(wind).connect(master);
  src.start();
  gust.start();
  sweep.start();

  // a bird every so often, from somewhere off to one side
  const next = () => window.setTimeout(() => {
    birdCall();
    next();
  }, 7000 + Math.random() * 12000);
  next();
}

/** two or three falling chirps, panned off to one side */
function birdCall() {
  if (!ctx || !master || ctx.state !== "running") return;
  const t0 = ctx.currentTime;
  const pan = ctx.createStereoPanner();
  pan.pan.value = (Math.random() - 0.5) * 1.6;
  pan.connect(master);
  const top = 2600 + Math.random() * 1400;
  const notes = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < notes; i++) {
    const t = t0 + i * (0.13 + Math.random() * 0.05);
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(top, t);
    o.frequency.exponentialRampToValueAtTime(top * 0.6, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.03, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(g).connect(pan);
    o.start(t);
    o.stop(t + 0.12);
  }
}

/** called every frame from the truck */
export function engine(speed: number, throttle: number, boosting: boolean, airborne: boolean) {
  if (!ctx || !engineLow || !engineHigh || !engineFilter || !engineGain) return;
  const t = ctx.currentTime;
  const s = Math.abs(speed);
  // in the air the wheels spin free and the revs climb
  const revs = 34 + s * 4.2 + Math.abs(throttle) * (airborne ? 30 : 9) + (boosting ? 16 : 0);
  engineHigh.frequency.setTargetAtTime(revs, t, 0.09);
  engineLow.frequency.setTargetAtTime(revs * 0.5, t, 0.09);
  engineFilter.frequency.setTargetAtTime(240 + s * 55 + (boosting ? 1400 : 0), t, 0.1);
  engineGain.gain.setTargetAtTime(0.05 + Math.abs(throttle) * 0.05 + (boosting ? 0.08 : 0), t, 0.12);
}

/** an enveloped burst of filtered noise */
function burst(
  type: BiquadFilterType,
  freq: number,
  gain: number,
  decay: number,
  sweepTo?: number,
) {
  if (!ctx || !master || !noise) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  // looped, so a long boom never runs off the end of the one-second buffer
  src.loop = true;
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freq, t);
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, t + decay);
  filter.Q.value = 1.2;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(t, Math.random() * 0.5);
  src.stop(t + decay + 0.05);
}

/** a pitched drop, for thumps */
function thump(from: number, to: number, gain: number, decay: number) {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + decay);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + decay + 0.05);
}

export type Material = "wood" | "plant" | "metal";

export function smash(material: Material) {
  if (material === "wood") {
    burst("bandpass", 900, 0.35, 0.18);
    burst("highpass", 2500, 0.12, 0.06);
  } else if (material === "plant") {
    burst("bandpass", 1600, 0.25, 0.14);
  } else {
    burst("bandpass", 600, 0.3, 0.25);
    thump(220, 120, 0.12, 0.2);
  }
}

/** `near` is 1 right beside the truck, 0 at the edge of earshot */
export function boom(near: number) {
  const k = Math.max(0.15, near);
  burst("lowpass", 1400, 0.7 * k, 1.3, 90);
  thump(70, 28, 0.6 * k, 0.6);
}

export function thud(impact: number) {
  const k = Math.min(1, impact / 10);
  thump(90, 40, 0.35 * k, 0.25);
  burst("lowpass", 400, 0.25 * k, 0.2);
}

/** a bright two-note chime, for finding a section */
export function chime() {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  [784, 1175].forEach((f, i) => {
    const o = ctx!.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.12 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.5);
    o.connect(g);
    g.connect(master!);
    o.start(t + i * 0.12);
    o.stop(t + i * 0.12 + 0.55);
  });
}

/** tyre scrub while drifting; `slide` is sideways speed in m/s */
export function skid(slide: number) {
  if (!ctx || !skidGain) return;
  skidGain.gain.setTargetAtTime(Math.min(0.09, Math.max(0, slide - 1) * 0.015), ctx.currentTime, 0.05);
}

/** nitrous lighting: a rising rush of air and a low punch */
export function whoosh() {
  burst("bandpass", 300, 0.45, 0.7, 3200);
  thump(110, 45, 0.3, 0.35);
}

export function horn(on: boolean) {
  if (!ctx || !hornGain) return;
  hornGain.gain.setTargetAtTime(on ? 0.07 : 0, ctx.currentTime, 0.02);
}

/** two quick honks, for celebrating a find */
export function toot() {
  if (!ctx || !hornGain) return;
  const t = ctx.currentTime;
  const g = hornGain.gain;
  g.cancelScheduledValues(t);
  for (const at of [0, 0.2]) {
    g.setTargetAtTime(0.07, t + at, 0.01);
    g.setTargetAtTime(0, t + at + 0.11, 0.015);
  }
}

/** a rising arpeggio for a landed jump, one note higher per flip */
export function stunt(flips: number) {
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const notes = [523, 659, 784, 1047, 1319].slice(0, 2 + Math.min(flips, 3));
  notes.forEach((f, i) => {
    const at = t + i * 0.07;
    const o = ctx!.createOscillator();
    o.type = "square";
    o.frequency.value = f;
    const lp = ctx!.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2200;
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.06, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    o.connect(lp).connect(g).connect(master!);
    o.start(at);
    o.stop(at + 0.25);
  });
}

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Stack — S.03, on white.
//
// This replaces a pinned showcase copied from the reference's minerals section:
// a dashed progress ring with a category list on one side and a mono readout on
// the other. That layout works there because the middle holds a photographed 3D
// mineral specimen — the ring is only a frame around it. Substituting a cluster
// of flat SVG icons kept the frame and lost the thing being framed, so it was
// an expensive pin guarding an empty centre.
//
// Bands instead: one horizontal marquee per category, alternating direction,
// speed driven by scroll velocity — scroll hard and they surge, scroll up and
// they reverse, stop and they drift. It also gives the page its only horizontal
// register; Work, Experience and Uses are all card grids, and Stack sits
// between two of them.
//
// `wrap` is implemented here rather than imported: framer-motion v12 no longer
// exports it.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import SectionMark from "@/utilities/SectionMark";
import ScrollFill from "@/utilities/ScrollFill";
import TechIcon, { TechKey } from "./TechIcon";

type Tech = { key: TechKey; name: string };
type Group = { name: string; code: string; items: Tech[] };

const GROUPS: Group[] = [
  {
    name: "Languages",
    code: "LANG",
    items: [
      { key: "java", name: "Java" },
      { key: "typescript", name: "TypeScript" },
      { key: "go", name: "Go" },
      { key: "rust", name: "Rust" },
      { key: "python", name: "Python" },
      { key: "csharp", name: "C#" },
    ],
  },
  {
    name: "Services",
    code: "SRV",
    items: [
      { key: "spring-boot", name: "Spring Boot" },
      { key: "express", name: "Express" },
      { key: "node", name: "Node" },
    ],
  },
  {
    name: "Interface",
    code: "UI",
    items: [
      { key: "next", name: "Next.js" },
      { key: "tailwind", name: "Tailwind" },
      { key: "framer-motion", name: "Framer Motion" },
      { key: "electron", name: "Electron" },
      { key: "flutter", name: "Flutter" },
      { key: "react-native", name: "React Native" },
    ],
  },
  {
    name: "Data",
    code: "DATA",
    items: [
      { key: "oracle-sql", name: "Oracle SQL" },
      { key: "redis", name: "Redis" },
      { key: "mysql", name: "MySQL" },
      { key: "supabase", name: "Supabase" },
      { key: "firebase", name: "Firebase" },
    ],
  },
  {
    name: "Workflow",
    code: "OPS",
    items: [
      { key: "git", name: "Git" },
      { key: "maven", name: "Maven" },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);
const pad = (n: number) => String(n).padStart(2, "0");

/** keep v inside [min, max), wrapping around — framer no longer ships this */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* ── one technology ── */
function Chip({ t }: { t: Tech }) {
  return (
    // no data-cursor: the chip is not a link, and a cursor label would only
    // repeat the name already printed next to the icon
    <span className="group/chip mr-2.5 inline-flex shrink-0 items-center gap-2.5 rounded-[6px] border border-line bg-white px-3.5 py-2.5 transition-colors duration-300 hover:border-transparent hover:bg-accent hover:text-coal">
      {/* brand colour at rest, knocked to black once the chip floods — every
          brand palette fights vermilion. Done with a filter rather than a
          second mono <TechIcon>, which would double the SVG count across a
          couple of hundred chips for one hover state. */}
      <span className="block h-[17px] w-[17px] shrink-0 transition-[filter] duration-300 group-hover/chip:brightness-0">
        <TechIcon variant={t.key} />
      </span>
      <span className="mono-label whitespace-nowrap">{t.name}</span>
    </span>
  );
}

/* ── one scrolling band ── */
function Band({ group, baseVelocity }: { group: Group; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // clamp:false lets a hard scroll push the factor past 1 and genuinely surge
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });

  const reduced = useReducedMotion();
  const hovered = useRef(false);
  const speed = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    // ease toward a near-stop on hover so a chip can actually be clicked,
    // rather than snapping and jolting the row
    speed.current += ((hovered.current ? 0.06 : 1) - speed.current) * 0.08;

    let moveBy = baseVelocity * (delta / 1000) * speed.current;
    moveBy += moveBy * factor.get(); // negative when scrolling up → reverses
    baseX.set(baseX.get() + moveBy);
  });

  // four identical copies, so wrapping across a quarter of the track is seamless
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  // short categories (Workflow has two) would leave gaps — pad the run out
  const run: Tech[] = [];
  while (run.length < 10) run.push(...group.items);

  return (
    <div className="border-t border-line py-6 last:border-b">
      <div className="mb-4 flex items-baseline justify-between gap-4 px-5 md:px-8">
        <span className="chip text-ink/55">{group.name}</span>
        <span className="mono-label text-mute">
          {group.code} · {pad(group.items.length)}
        </span>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => (hovered.current = true)}
        onMouseLeave={() => (hovered.current = false)}
      >
        <motion.div style={{ x }} className="flex w-max flex-nowrap">
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} className="flex flex-nowrap" aria-hidden={copy > 0}>
              {run.map((t, i) => (
                <Chip key={`${copy}-${t.key}-${i}`} t={t} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function Stack() {
  return (
    <section id="stack" className="scroll-mt-20 bg-white py-20 md:py-28">
      <div className="px-5 md:px-8">
        <div className="flex gap-4 md:gap-7">
          <SectionMark no="03" name="Stack" className="mt-2" />
          <ScrollFill
            text={`${TOTAL} technologies in rotation, grouped by the job they do rather than by how well I know them.`}
            className="max-w-[22ch] md:max-w-[26ch]"
          />
        </div>
      </div>

      <div className="mt-14 md:mt-20">
        {GROUPS.map((g, i) => (
          <Band
            key={g.name}
            group={g}
            // alternating base direction; scroll velocity modulates both rows
            baseVelocity={i % 2 === 0 ? 1.4 : -1.4}
          />
        ))}
      </div>

      <p className="mono-label mt-10 px-5 text-mute md:px-8">
        Scroll to drive the bands — hover one to hold it still
      </p>
    </section>
  );
}

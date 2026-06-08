"use client";

import Reveal from "@/utilities/Reveal";
import TechIcon, { TechKey } from "./TechIcon";

type SkillItem = {
  key: TechKey;
  name: string;
  tier: "expert" | "comfortable" | "learning";
};

const ACTIVE_STACK: SkillItem[] = [
  { key: "java", name: "Java", tier: "expert" },
  { key: "spring-boot", name: "Spring Boot", tier: "expert" },
  { key: "typescript", name: "TypeScript", tier: "expert" },
  { key: "next", name: "Next.js", tier: "expert" },
  { key: "react", name: "React", tier: "expert" },
  { key: "tailwind", name: "Tailwind", tier: "expert" },
  { key: "oracle-sql", name: "Oracle SQL", tier: "comfortable" },
  { key: "redis", name: "Redis", tier: "comfortable" },
  { key: "git", name: "Git", tier: "expert" },
];

const ARCHIVE_STACK: SkillItem[] = [
  { key: "javascript", name: "JavaScript", tier: "expert" },
  { key: "go", name: "Go", tier: "comfortable" },
  { key: "node", name: "Node", tier: "comfortable" },
  { key: "express", name: "Express", tier: "comfortable" },
  { key: "flutter", name: "Flutter", tier: "comfortable" },
  { key: "react-native", name: "React Native", tier: "comfortable" },
  { key: "mysql", name: "MySQL", tier: "comfortable" },
  { key: "firebase", name: "Firebase", tier: "learning" },
  { key: "maven", name: "Maven", tier: "comfortable" },
];

const TIERS: Record<SkillItem["tier"], { label: string; dot: string }> = {
  expert: { label: "expert", dot: "bg-[#6f9a6a]" },
  comfortable: { label: "comfortable", dot: "bg-accent" },
  learning: { label: "learning", dot: "bg-faint" },
};

const MARQUEE =
  "Java · Spring Boot · React · Next.js · TypeScript · Tailwind · Oracle · Redis · Go · Node · Flutter · Supabase · ";

function SkillCard({ item }: { item: SkillItem }) {
  const tier = TIERS[item.tier];
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-2">
      <span className="w-7 h-7 flex items-center justify-center shrink-0">
        <TechIcon variant={item.key} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-ink truncate">{item.name}</p>
        <p className="text-[11px] text-faint flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} />
          {tier.label}
        </p>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 scroll-mt-24">
      {/* marquee flourish */}
      <div className="group overflow-hidden border-y border-line py-6 mb-16 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <span className="font-serif italic font-light text-2xl text-ink-2 whitespace-nowrap">
            {MARQUEE}
          </span>
          <span className="font-serif italic font-light text-2xl text-ink-2 whitespace-nowrap">
            {MARQUEE}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-4">
            <h2 className="font-serif font-light tracking-tight text-[clamp(2rem,4.5vw,3.2rem)]">
              What I build <em className="italic">with</em>
            </h2>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-faint">
              {(["expert", "comfortable", "learning"] as const).map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${TIERS[t].dot}`}
                  />
                  {TIERS[t].label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* active */}
        <Reveal>
          <p className="text-faint text-xs uppercase tracking-[0.16em] mt-10 mb-5">
            Currently shipping with
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ACTIVE_STACK.map((item, i) => (
            <Reveal key={item.key} delay={(i % 3) * 0.06}>
              <SkillCard item={item} />
            </Reveal>
          ))}
        </div>

        {/* archive */}
        <Reveal>
          <p className="text-faint text-xs uppercase tracking-[0.16em] mt-12 mb-5">
            Shipped with before
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 opacity-90">
          {ARCHIVE_STACK.map((item, i) => (
            <Reveal key={item.key} delay={(i % 3) * 0.06}>
              <SkillCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

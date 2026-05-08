import Typewriter from "@/utilities/Typewriter";
import DecryptText from "../utilities/DecryptText";
import TechIcon, { TechKey } from "./TechIcon";

type SkillItem = {
  key: TechKey;
  name: string;
  tier: "expert" | "comfortable" | "learning";
};

// "what i ship with" — current daily stack (rintis + webin daily drivers)
const ACTIVE_STACK: SkillItem[] = [
  { key: "java", name: "java", tier: "expert" },
  { key: "spring-boot", name: "spring boot", tier: "expert" },
  { key: "typescript", name: "typescript", tier: "expert" },
  { key: "next", name: "next.js", tier: "expert" },
  { key: "react", name: "react", tier: "expert" },
  { key: "tailwind", name: "tailwind", tier: "expert" },
  { key: "oracle-sql", name: "oracle sql", tier: "comfortable" },
  { key: "redis", name: "redis", tier: "comfortable" },
  { key: "git", name: "git", tier: "expert" },
];

// "what i've shipped with" — production-proven, used in past projects
const ARCHIVE_STACK: SkillItem[] = [
  { key: "javascript", name: "javascript", tier: "expert" },
  { key: "go", name: "go", tier: "comfortable" },
  { key: "node", name: "node", tier: "comfortable" },
  { key: "express", name: "express", tier: "comfortable" },
  { key: "flutter", name: "flutter", tier: "comfortable" },
  { key: "react-native", name: "react native", tier: "comfortable" },
  { key: "mysql", name: "mysql", tier: "comfortable" },
  { key: "firebase", name: "firebase", tier: "learning" },
  { key: "maven", name: "maven", tier: "comfortable" },
];

const TIER_STYLES: Record<
  SkillItem["tier"],
  { label: string; dot: string; text: string; ring: string }
> = {
  expert: {
    label: "expert",
    dot: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]",
    text: "text-green-400",
    ring: "border-green-500/30",
  },
  comfortable: {
    label: "comfortable",
    dot: "bg-emerald-600",
    text: "text-emerald-400/80",
    ring: "border-emerald-500/20",
  },
  learning: {
    label: "learning",
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    ring: "border-zinc-700",
  },
};

function SkillCard({ item }: { item: SkillItem }) {
  const style = TIER_STYLES[item.tier];
  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-950/60 border ${style.ring} hover:bg-zinc-900 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)] transition-all duration-300`}
    >
      <div className="shrink-0 w-7 h-7 flex items-center justify-center text-green-400">
        <TechIcon variant={item.key} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm text-zinc-200 truncate">{item.name}</p>
        <p
          className={`font-mono text-[10px] ${style.text} flex items-center gap-1.5 mt-0.5`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </p>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden">
      {/* hex/circuit pattern unique to this section */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e15_1px,transparent_1px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_0%,transparent_75%)]"></div>
        <div className="absolute top-1/4 right-1/4 w-100 h-100 bg-green-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-100 h-100 bg-emerald-900/15 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.85)_100%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Typewriter command="./" args="skill_matrix.config" />
        </div>

        {/* tier legend */}
        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-zinc-500">
          {(["expert", "comfortable", "learning"] as const).map((t) => {
            const s = TIER_STYLES[t];
            return (
              <span key={t} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <span className={s.text}>{s.label}</span>
              </span>
            );
          })}
        </div>

        {/* CURRENTLY ACTIVE — what i ship with */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-green-500 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              [active]
            </span>
            <h3 className="text-lg md:text-xl font-mono font-bold text-white">
              <DecryptText text="what_i_ship_with" />
            </h3>
            <span className="text-zinc-700 font-mono text-xs hidden sm:inline">
              / current daily stack
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ACTIVE_STACK.map((item) => (
              <SkillCard key={item.key} item={item} />
            ))}
          </div>
        </div>

        {/* ARCHIVE — what i've shipped with */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-zinc-500 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              [archive]
            </span>
            <h3 className="text-lg md:text-xl font-mono font-bold text-zinc-300">
              <DecryptText text="what_i_have_shipped_with" />
            </h3>
            <span className="text-zinc-700 font-mono text-xs hidden sm:inline">
              / production-proven, used in past projects
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 opacity-90">
            {ARCHIVE_STACK.map((item) => (
              <SkillCard key={item.key} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

// The first thing anyone sees: the name dropping in letter by letter, and a
// progress bar tied to real milestones (code loaded, physics up, first
// frames drawn). It lifts away to reveal the world already running behind it.

const NAME = "Fernando Halim";

export default function Loader({
  progress,
  label,
  leaving,
}: {
  progress: number;
  label: string;
  leaving: boolean;
}) {
  return (
    <div
      aria-busy={!leaving}
      className={`absolute inset-0 z-30 grid place-items-center bg-sand transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        leaving ? "pointer-events-none -translate-y-6 opacity-0" : ""
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] leading-none font-black tracking-tight text-ink">
          {NAME.split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block animate-letter-drop"
              style={{ animationDelay: `${120 + i * 45}ms` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>
        <p
          className="mt-4 animate-pop-in text-sm font-extrabold tracking-[0.25em] text-coral uppercase"
          style={{ animationDelay: "900ms" }}
        >
          Fullstack developer
        </p>

        <div
          className="mt-10 h-3 w-64 animate-pop-in overflow-hidden rounded-full bg-cream shadow-[0_3px_0_var(--color-ink)]"
          style={{ animationDelay: "1050ms" }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Loading the world"
        >
          <div
            className="h-full rounded-full bg-coral transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p
          className="mt-3 animate-pop-in text-xs font-semibold text-ink/55"
          style={{ animationDelay: "1100ms" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

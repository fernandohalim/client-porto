"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The welcome layer, laid over the live world rather than in front of it: the
// name top-left, a keycap prompt at the bottom, the way out bottom-right.
// Nothing blocks the view of the truck. The first drive key clears it all.
//
// The keycaps press themselves in a loop until you take over, and light up
// for real when you hold the matching key.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

function Key({
  label,
  down,
  delay,
  wide = false,
}: {
  label: string;
  down: boolean;
  delay: number;
  wide?: boolean;
}) {
  return (
    <span
      className={`grid h-12 place-items-center rounded-xl border-2 border-ink text-lg font-black transition-colors ${
        wide ? "w-20" : "w-12"
      } ${down ? "translate-y-1 bg-coral text-white shadow-none" : "animate-key-tap bg-cream text-ink"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {label}
    </span>
  );
}

export default function Intro({
  visible,
  pressed,
}: {
  visible: boolean;
  /** codes of the keys held right now */
  pressed: Set<string>;
}) {
  const on = (...codes: string[]) => codes.some((c) => pressed.has(c));
  const fade = `transition-[opacity,transform] duration-500 ${
    visible ? "" : "pointer-events-none opacity-0"
  }`;

  return (
    <>
      <div className={`absolute top-6 left-6 ${fade} ${visible ? "" : "-translate-y-4"}`}>
        <p className="animate-pop-in text-3xl leading-none font-black text-ink">
          Fernando Halim
        </p>
        <p
          className="mt-1.5 animate-pop-in text-xs font-extrabold tracking-[0.2em] text-coral uppercase"
          style={{ animationDelay: "120ms" }}
        >
          Fullstack developer
        </p>
      </div>

      <div
        className={`absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center ${fade} ${
          visible ? "" : "translate-y-6"
        }`}
      >
        <div className="flex animate-pop-in flex-col items-center gap-1.5" style={{ animationDelay: "200ms" }}>
          <Key label="W" down={on("KeyW", "ArrowUp")} delay={0} />
          <div className="flex gap-1.5">
            <Key label="A" down={on("KeyA", "ArrowLeft")} delay={600} />
            <Key label="S" down={on("KeyS", "ArrowDown")} delay={1200} />
            <Key label="D" down={on("KeyD", "ArrowRight")} delay={1800} />
          </div>
        </div>
        <p
          className="mt-4 animate-pop-in rounded-full bg-cream/90 px-4 py-1.5 text-sm font-extrabold text-ink"
          style={{ animationDelay: "350ms" }}
        >
          Drive to explore · or use the arrow keys
        </p>
      </div>

      {/* fade on the wrapper: a finished pop-in animation would otherwise
          pin the link at full opacity and ignore the fade-out */}
      <div className={`absolute right-6 bottom-6 ${fade}`}>
        <Link
          href="/site"
          className="block animate-pop-in rounded-full bg-cream px-4 py-2 text-sm font-extrabold text-ink shadow-[0_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
          style={{ animationDelay: "500ms" }}
        >
          Prefer to read? View the website →
        </Link>
      </div>
    </>
  );
}

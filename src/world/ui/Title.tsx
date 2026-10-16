"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The title screen, like the front of a game: the name as a cartoon logo
// over a low shot from behind the parked truck — one line, tilted, thick
// outlined letters that drop in and then keep bobbing in a wave, framed by
// two rules with the role spaced out beneath — and an arcade "Press W to
// start" blinking at the bottom. The keycap lights when you press it,
// and any drive key starts the game: the camera cranes up into the driving
// view, and the controls unlock when it lands.
//
// The way out to the plain website stays in the corner, for anyone who would
// rather read than drive.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

const NAME = "Fernando Halim";


/**
 * One letter with two outlines, stacked in a single grid cell: behind, a
 * thick black stroke with a drop beneath; in front, the cream letter with an
 * orange stroke. (A text-shadow ring for the black would be simpler, but
 * Chrome paints it over a stroke that sits under the fill.)
 */
function Letter({ ch }: { ch: string }) {
  return (
    <span className="grid">
      <span
        aria-hidden
        className="[grid-area:1/1] text-ink [-webkit-text-stroke:16px_var(--color-ink)] [paint-order:stroke_fill] [text-shadow:0_7px_0_var(--color-ink)]"
      >
        {ch}
      </span>
      <span className="[grid-area:1/1] [-webkit-text-stroke:8px_#ff8a1f] [paint-order:stroke_fill]">{ch}</span>
    </span>
  );
}

/** a thin rule beside the logo, drawing out from the name */
function Rule({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={`h-[3px] w-[clamp(2rem,6vw,5rem)] animate-pop-in rounded-full bg-cream/80 ${
        side === "left" ? "origin-right" : "origin-left"
      }`}
      style={{ animationDelay: "700ms" }}
    />
  );
}

export default function Title({
  visible,
  pressed,
}: {
  visible: boolean;
  /** codes of the keys held right now */
  pressed: Set<string>;
}) {
  const down = pressed.has("KeyW") || pressed.has("ArrowUp");
  const fade = `transition-[opacity,transform] duration-500 ${visible ? "" : "pointer-events-none opacity-0"}`;

  return (
    <>
      {/* a soft darkening behind the logo, so it reads over a bright sky */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-ink/30 to-transparent ${fade}`}
      />

      <div
        className={`pointer-events-none absolute inset-x-0 top-[10vh] flex flex-col items-center ${fade} ${
          visible ? "" : "-translate-y-6"
        }`}
      >
        <div className="flex -rotate-2 items-center gap-5">
          <Rule side="left" />
          <h1
            aria-label={NAME}
            className="text-[clamp(2.8rem,6.4vw,5.4rem)] leading-none font-black tracking-[0.02em] whitespace-nowrap text-cream uppercase "
          >
            {NAME.split("").map((ch, i) => (
              // two layers: the outer drops in once, the inner bobs for ever,
              // each letter a beat behind the last so the wave runs along
              <span
                key={i}
                aria-hidden
                className="inline-block animate-letter-drop"
                style={{ animationDelay: `${150 + i * 45}ms` }}
              >
                <span
                  className="inline-block animate-bob"
                  style={{ animationDelay: `${1200 + i * 90}ms`, rotate: `${i % 2 ? 3 : -3}deg` }}
                >
                  <Letter ch={ch === " " ? " " : ch} />
                </span>
              </span>
            ))}
          </h1>
          <Rule side="right" />
        </div>
        <p
          className="mt-4 flex animate-pop-in items-center gap-3 text-xs font-extrabold tracking-[0.45em] text-cream uppercase [text-shadow:0_2px_0_var(--color-ink)]"
          style={{ animationDelay: "900ms" }}
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-coral" />
          Fullstack developer
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-coral" />
        </p>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-[5vh] flex justify-center ${fade} ${
          visible ? "" : "translate-y-6"
        }`}
      >
        <p className="flex animate-pop-in items-center gap-3 text-2xl font-black text-cream uppercase [text-shadow:0_3px_0_var(--color-ink)]" style={{ animationDelay: "1400ms" }}>
          <span className={down ? "" : "animate-blink"}>Press</span>
          <span
            className={`grid h-12 w-12 place-items-center rounded-xl border-[3px] border-ink text-xl transition-transform [text-shadow:none] ${
              down
                ? "translate-y-1 bg-coral text-white shadow-none"
                : "bg-cream text-ink shadow-[0_4px_0_var(--color-ink)]"
            }`}
          >
            W
          </span>
          <span className={down ? "" : "animate-blink"}>to start</span>
        </p>
      </div>

      {/* fade on the wrapper: a finished pop-in animation would otherwise
          pin the link at full opacity and ignore the fade-out */}
      <div className={`absolute right-6 bottom-6 ${fade}`}>
        <Link
          href="/site"
          className="block animate-pop-in rounded-full bg-cream px-4 py-2 text-sm font-extrabold text-ink shadow-[0_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
          style={{ animationDelay: "1600ms" }}
        >
          Prefer to read? View the website →
        </Link>
      </div>
    </>
  );
}

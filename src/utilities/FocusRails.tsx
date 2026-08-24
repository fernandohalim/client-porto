"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FocusRails — the dashed tick rails that bracket the focus band on the
// reference's partner roll. Purely decorative; they mark where a row is
// considered "current" so the fade reads as a mechanism rather than a bug.
//
// The focus measurement itself lives in the row components (see Freelance.tsx),
// because each row needs its own useScroll and hooks must not be called from a
// render-prop callback.
// ─────────────────────────────────────────────────────────────────────────────

export default function FocusRails({ tone = "ink" }: { tone?: "ink" | "bone" }) {
  const color =
    tone === "bone" ? "var(--color-line-dark)" : "var(--color-line)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {["left-5 md:left-8", "right-5 md:right-8"].map((side) => (
        <div
          key={side}
          className={`absolute top-1/2 h-[38vh] w-px -translate-y-1/2 ${side}`}
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, ${color} 0 4px, transparent 4px 10px)`,
          }}
        />
      ))}
    </div>
  );
}

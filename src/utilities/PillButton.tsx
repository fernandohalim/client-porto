"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PillButton — the reference's one and only button: a small dark pill with a
// mono uppercase label and a squared-off arrow tile pinned to the right.
// Hover slides the tile's arrow out and a fresh one in from the left.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

type Props = {
  label: string;
  href: string;
  external?: boolean;
  tone?: "dark" | "light" | "accent";
  className?: string;
  cursor?: string;
};

const TONES = {
  dark: {
    shell: "bg-coal text-bone-2",
    tile: "bg-white text-coal",
  },
  light: {
    shell: "bg-white text-coal",
    tile: "bg-coal text-white",
  },
  accent: {
    shell: "bg-accent text-coal",
    tile: "bg-coal text-white",
  },
} as const;

export default function PillButton({
  label,
  href,
  external,
  tone = "dark",
  className = "",
  cursor,
}: Props) {
  const t = TONES[tone];

  const inner = (
    <span
      className={`group inline-flex items-center gap-3 rounded-[5px] py-[7px] pl-4 pr-[7px] ${t.shell} ${className}`}
    >
      <span className="mono-label pt-px">{label}</span>
      <span
        className={`relative grid h-[18px] w-[18px] place-items-center overflow-hidden rounded-[3px] ${t.tile}`}
      >
        <span className="block transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[140%]">
          <Arrow />
        </span>
        <span className="absolute block -translate-x-[140%] transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0">
          <Arrow />
        </span>
      </span>
    </span>
  );

  if (external)
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        data-cursor={cursor ?? label}
        className="inline-block"
      >
        {inner}
      </a>
    );

  return (
    <Link href={href} data-cursor={cursor ?? label} className="inline-block">
      {inner}
    </Link>
  );
}

function Arrow() {
  return (
    <svg width="7" height="7" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M1 4h6M4.5 1.5 7 4 4.5 6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

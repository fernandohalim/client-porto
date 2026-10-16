"use client";

// ─────────────────────────────────────────────────────────────────────────────
// What opens when the truck pulls up at a section: cinema bars slide in top
// and bottom while the camera swoops into the landmark's shot, and the
// section's card slides in from the right. Esc, or any fresh press of a drive
// key, closes it and hands the wheel back.
//
// The words all come from content/portfolio — the same source as /site.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, type ReactNode } from "react";
import { PALETTE } from "../config";
import type { CardKey } from "../map/sections/frame";
import {
  ABOUT,
  CLIENT_STATUS,
  CONTACT,
  EXPERIENCE,
  FREELANCE,
  PERSON,
  STACK,
  STACK_GROUPS,
  WORK,
} from "@/content/portfolio";

const HEADS: Record<CardKey["zone"], { place: string; title: string; color: string }> = {
  about: { place: "The campsite", title: "About me", color: PALETTE.coral },
  work: { place: "The launch pad", title: "Selected work", color: PALETTE.teal },
  experience: { place: "The old mine", title: "Experience", color: PALETTE.yellow },
  stack: { place: "The tool shed", title: "Stack", color: PALETTE.sky },
  freelance: { place: "The diner", title: "Freelance", color: PALETTE.pink },
  contact: { place: "The radio tower", title: "Contact", color: PALETTE.violet },
};

const PROJECT_COLORS = [PALETTE.violet, PALETTE.teal, PALETTE.coral, PALETTE.pink, PALETTE.yellow];
const GROUP_COLORS = [PALETTE.sky, PALETTE.teal, PALETTE.coral, PALETTE.yellow, PALETTE.violet];

function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-extrabold"
      style={{ background: color ?? PALETTE.cream }}
    >
      {children}
    </span>
  );
}

const linkClass =
  "inline-block rounded-full border-[3px] border-ink bg-white px-4 py-1.5 text-sm font-extrabold shadow-[0_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5";

/* ── one body per section ───────────────────────────────────────────────── */

function AboutBody() {
  return (
    <>
      <p className="text-lg leading-snug font-bold">{ABOUT.lede}</p>
      <dl className="mt-5 grid grid-cols-3 gap-2">
        {ABOUT.stats.map((s) => (
          <div key={s.label} className="rounded-2xl border-2 border-ink bg-white px-2 py-2.5 text-center">
            <dd className="text-2xl leading-none font-black">{s.value}</dd>
            <dt className="mt-1 text-[11px] leading-tight font-bold text-ink/65">{s.label}</dt>
          </div>
        ))}
      </dl>
      <p className="mt-5 leading-relaxed text-ink/80">{ABOUT.body}</p>
    </>
  );
}

function WorkBody() {
  return (
    <>
      <p className="leading-relaxed text-ink/80">{WORK.intro}</p>
      <ul className="mt-4 grid gap-2.5">
        {WORK.projects.map((p, i) => {
          const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
          return (
            <li key={p.slug} className="flex gap-3 rounded-2xl border-2 border-ink bg-white p-3">
              <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-ink" style={{ background: color }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg leading-tight font-black">{p.title}</h3>
                  <span className="shrink-0 text-xs font-extrabold text-ink/55">{p.year}</span>
                </div>
                <p className="text-sm text-ink/75">{p.blurb}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.stack.map((t) => (
                    <Chip key={t} color={color}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 rounded-2xl border-2 border-dashed border-ink/40 p-3">
        <p className="text-sm font-extrabold">{WORK.openSource.title}</p>
        <p className="mt-1 text-sm text-ink/70">{WORK.openSource.blurb}</p>
        <a href={PERSON.github} target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-3`}>
          {WORK.openSource.cta} →
        </a>
      </div>
    </>
  );
}

function ExperienceBody() {
  return (
    <>
      <p className="leading-relaxed text-ink/80">{EXPERIENCE.intro}</p>
      <ol className="mt-4 grid gap-3">
        {EXPERIENCE.roles.map((r) => (
          <li key={r.company} className="rounded-2xl border-2 border-ink bg-white p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg leading-tight font-black">{r.role}</h3>
                <a href={r.linkedin} target="_blank" rel="noreferrer" className="text-sm font-extrabold underline decoration-2 underline-offset-2">
                  {r.company}
                </a>
              </div>
              {r.active && <Chip color={PALETTE.yellow}>Active</Chip>}
            </div>
            <p className="mt-1 text-xs font-bold text-ink/55">
              {r.date} · {r.type}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink/80">
              {r.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-bold text-ink/60">{r.stack.join(" · ")}</p>
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-2xl bg-ink p-3.5 text-cream">
        <p className="text-sm font-black">{EXPERIENCE.why.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-cream/80">{EXPERIENCE.why.body}</p>
      </div>
    </>
  );
}

function StackBody() {
  return (
    <>
      <p className="leading-relaxed text-ink/80">{STACK.intro}</p>
      <div className="mt-4 grid gap-3">
        {STACK_GROUPS.map((g, i) => (
          <div key={g.name}>
            <h3 className="text-sm font-black tracking-wide uppercase">{g.name}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {g.items.map((t) => (
                <Chip key={t} color={GROUP_COLORS[i % GROUP_COLORS.length]}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FreelanceBody() {
  const clients = FREELANCE.clients;
  return (
    <>
      <p className="leading-relaxed text-ink/80">{FREELANCE.intro}</p>
      <ul className="mt-4 divide-y-2 divide-dashed divide-ink/20">
        {clients.map((c) => (
          <li key={c.title} className="py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="leading-tight font-black">
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-2">
                    {c.title}
                  </a>
                ) : (
                  c.title
                )}
              </h3>
              <span className="shrink-0 text-xs font-extrabold text-ink/55">{c.year}</span>
            </div>
            <p className="text-sm text-ink/75">{c.blurb}</p>
            <p className="mt-0.5 text-xs font-bold text-ink/55">
              {c.stack.join(" · ")} · {CLIENT_STATUS[c.kind]}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm font-extrabold">
        {clients.length} commissions — {clients.filter((c) => c.href).length} still live
      </p>
    </>
  );
}

function ContactBody() {
  return (
    <>
      <h3 className="text-2xl leading-tight font-black">{CONTACT.heading}</h3>
      <p className="mt-2 leading-relaxed text-ink/80">{CONTACT.body}</p>
      <a
        href={`mailto:${PERSON.email}`}
        className="mt-5 block rounded-2xl border-[3px] border-ink px-4 py-3 text-center font-black break-all text-white shadow-[0_4px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
        style={{ background: PALETTE.violet }}
      >
        {PERSON.email}
      </a>
      <div className="mt-4 flex flex-wrap gap-2">
        {CONTACT.links.map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
            {l.name}
          </a>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold text-ink/60">{PERSON.location}</p>
    </>
  );
}

function Body({ card }: { card: CardKey }) {
  switch (card.zone) {
    case "about":
      return <AboutBody />;
    case "work":
      return <WorkBody />;
    case "experience":
      return <ExperienceBody />;
    case "stack":
      return <StackBody />;
    case "freelance":
      return <FreelanceBody />;
    case "contact":
      return <ContactBody />;
  }
}

export default function SectionCard({ card, onClose }: { card: CardKey | null; onClose: () => void }) {
  // hold on to the last card, so it can slide out with its content intact
  const [shown, setShown] = useState<CardKey | null>(card);
  if (card && card !== shown) setShown(card);
  const open = card !== null;

  // let the swoop get going before the card arrives: `readyFor` is the card
  // whose delay has run, so a new arrival is never ready until its own has
  const [readyFor, setReadyFor] = useState<CardKey | null>(null);
  useEffect(() => {
    if (!card) return;
    const t = window.setTimeout(() => setReadyFor(card), 450);
    return () => window.clearTimeout(t);
  }, [card]);
  const ready = open && readyFor === card;

  const head = shown ? HEADS[shown.zone] : null;

  return (
    <>
      {/* cinema bars */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-[9vh] bg-ink transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[9vh] bg-ink transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      />

      <aside
        role="dialog"
        aria-label={head ? head.title : "Section"}
        inert={!(open && ready)}
        className={`absolute top-[11vh] right-6 bottom-[11vh] flex w-[min(28rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border-[3px] border-ink bg-cream text-ink shadow-[0_8px_0_var(--color-ink)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          open && ready ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-[115%] opacity-0"
        }`}
      >
        {head && shown && (
          <>
            <header className="flex items-center justify-between gap-3 border-b-[3px] border-ink px-5 py-3.5" style={{ background: head.color }}>
              <div>
                <p className="text-xs font-extrabold tracking-[0.2em] text-ink/70 uppercase">{head.place}</p>
                <h2 className="text-3xl leading-none font-black text-cream [-webkit-text-stroke:5px_var(--color-ink)] [paint-order:stroke_fill]">
                  {head.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close and keep driving"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-cream text-2xl leading-none font-black shadow-[0_3px_0_var(--color-ink)] hover:bg-white"
              >
                ×
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <Body card={shown} />
            </div>
            <footer className="border-t-2 border-ink/15 px-5 py-2.5 text-xs font-extrabold text-ink/55">
              Esc or a drive key to get back on the road
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

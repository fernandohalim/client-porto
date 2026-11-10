import { HERO, PERSON } from "@/content/portfolio";
import Rise from "./Rise";

export default function Hero() {
  return (
    <section
      id="hero"
      className="panel flex flex-col justify-between gap-8 h-scroll:w-screen h-scroll:flex-row h-scroll:items-end"
    >
      <h1 data-drift className="display reveal h-scroll:[--size:min(calc(var(--h)/5),9vw)] max-w-[20ch]">
        <Rise text={HERO.headline} />
      </h1>
      <div className="reveal label flex w-56 flex-none flex-col gap-2 h-scroll:pb-1">
        <p>
          {PERSON.name} — {PERSON.role}
        </p>
        <p>{HERO.availability}</p>
        {/* the page runs sideways here, which nothing else on the first screen says */}
        <p aria-hidden className="hidden h-scroll:block">
          Scroll <span className="scroll-cue">→</span>
        </p>
        <ul className="mt-3 flex flex-col gap-1">
          <li>
            <a href="#work" className="link">
              Selected work
            </a>
          </li>
          <li>
            <a href="#contact" className="link">
              Get in touch
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

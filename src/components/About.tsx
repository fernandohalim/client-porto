import { ABOUT } from "@/content/portfolio";
import Rise from "./Rise";

export default function About() {
  return (
    <section id="about" className="panel">
      <div className="flex flex-col justify-between gap-6 h-scroll:w-[max(24rem,calc(var(--h)*0.85))]">
        <h2 data-drift className="display reveal"><Rise text="About" /></h2>
        <div className="reveal flex flex-col gap-3">
          <p className="lede">{ABOUT.lede}</p>
          <p>{ABOUT.body}</p>
          <a href="#experience" className="link label w-fit">
            Read the experience
          </a>
        </div>
      </div>

      <dl className="reveal mt-10 flex flex-col justify-end h-scroll:mt-0 h-scroll:w-[max(18rem,calc(var(--h)*0.5))]">
        {ABOUT.stats.map((s) => (
          <div
            key={s.label}
            className="flex items-baseline justify-between gap-6 border-t border-rule py-2"
          >
            <dt className="label">{s.label}</dt>
            <dd className="font-display text-6xl leading-none">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

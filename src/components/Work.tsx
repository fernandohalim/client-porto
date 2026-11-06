import { PERSON, WORK } from "@/content/portfolio";
import Strip from "./Strip";
import Rise from "./Rise";

export default function Work() {
  return (
    <section id="work" className="panel">
      <div className="head">
        <h2 data-drift className="display reveal"><Rise text="Selected work" /></h2>
        <p className="reveal lede">{WORK.intro}</p>
      </div>

      <Strip label="Selected work" items={WORK.projects} />

      <article className="reveal mt-8 flex flex-col justify-end gap-3 h-scroll:mt-0 h-scroll:w-72 h-scroll:flex-none">
        <h3 className="label">{WORK.openSource.title}</h3>
        <p className="lede">{WORK.openSource.blurb}</p>
        <a
          href={PERSON.github}
          target="_blank"
          rel="noopener noreferrer"
          className="link label w-fit"
        >
          {WORK.openSource.cta} <span aria-hidden>↗</span>
        </a>
      </article>
    </section>
  );
}

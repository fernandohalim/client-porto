import { PERSON, WORK } from "@/content/portfolio";

// each project's slug is where its case study will live again
// (/projects/<slug>) once the pages are rebuilt — unlinked until then so
// nothing points at a 404
export default function Work() {
  return (
    <section id="work">
      <h2>Selected work</h2>
      <p>{WORK.intro}</p>

      <ul>
        {WORK.projects.map((w) => (
          <li key={w.slug}>
            <article>
              <h3>{w.title}</h3>
              <p>{w.blurb}</p>
              <p>
                {w.stack.join(" · ")} — {w.year}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <article>
        <h3>{WORK.openSource.title}</h3>
        <p>{WORK.openSource.blurb}</p>
        <a href={PERSON.github} target="_blank" rel="noopener noreferrer">
          {WORK.openSource.cta}
        </a>
      </article>
    </section>
  );
}

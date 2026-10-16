import { EXPERIENCE } from "@/content/portfolio";

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <p>{EXPERIENCE.intro}</p>

      <ol>
        {EXPERIENCE.roles.map((r) => (
          <li key={r.company}>
            <article>
              <h3>{r.role}</h3>
              <p>
                <a href={r.linkedin} target="_blank" rel="noreferrer">
                  {r.company}
                </a>
                {r.active && " — Active"}
              </p>
              <p>
                {r.date} · {r.type}
              </p>
              <ul>
                {r.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p>{r.stack.join(" · ")}</p>
            </article>
          </li>
        ))}
      </ol>

      <aside>
        <h3>{EXPERIENCE.why.title}</h3>
        <p>{EXPERIENCE.why.body}</p>
      </aside>
    </section>
  );
}

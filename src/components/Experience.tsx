import { EXPERIENCE } from "@/content/portfolio";
import Rise from "./Rise";

export default function Experience() {
  return (
    <section id="experience" className="panel">
      <div className="head">
        <h2 data-drift className="display reveal"><Rise text="Experience" /></h2>
        <p className="reveal lede">{EXPERIENCE.intro}</p>
      </div>

      <ol className="flex flex-col gap-10 h-scroll:flex-row h-scroll:gap-[5vh]">
        {EXPERIENCE.roles.map((r) => (
          <li key={r.company} className="flex-none h-scroll:w-80">
            <article className="reveal flex h-full flex-col justify-between gap-4 border-t border-rule pt-3">
              <div>
                <h3 className="font-display text-5xl uppercase leading-[0.95]">{r.role}</h3>
                <p className="label mt-4">
                  <a href={r.linkedin} target="_blank" rel="noreferrer" className="link">
                    {r.company}
                  </a>
                  {r.active && " — Active"}
                </p>
                <p className="label mt-1">
                  {r.date} · {r.type}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <ul className="flex flex-col gap-2">
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="label">{r.stack.join(" · ")}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <aside className="reveal mt-10 flex flex-col justify-end gap-3 h-scroll:mt-0 h-scroll:w-96 h-scroll:flex-none">
        <h3 className="label">{EXPERIENCE.why.title}</h3>
        <p className="lede">{EXPERIENCE.why.body}</p>
      </aside>
    </section>
  );
}

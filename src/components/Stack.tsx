import { STACK, STACK_GROUPS } from "@/content/portfolio";
import Rise from "./Rise";

export default function Stack() {
  return (
    <section id="stack" className="panel">
      <div className="head">
        <h2 data-drift className="display reveal"><Rise text="Stack" /></h2>
        <p className="reveal lede">{STACK.intro}</p>
      </div>

      {STACK_GROUPS.map((g) => (
        <div
          key={g.name}
          className="reveal mb-8 flex-none h-scroll:mb-0 h-scroll:flex h-scroll:w-52 h-scroll:flex-col h-scroll:justify-end"
        >
          <h3 className="label mb-3 border-b border-rule pb-2">{g.name}</h3>
          <ul className="font-display text-5xl uppercase leading-[1.02]">
            {g.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

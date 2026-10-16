import { STACK, STACK_GROUPS } from "@/content/portfolio";

export default function Stack() {
  return (
    <section id="stack">
      <h2>Stack</h2>
      <p>{STACK.intro}</p>

      {STACK_GROUPS.map((g) => (
        <div key={g.name}>
          <h3>{g.name}</h3>
          <ul>
            {g.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

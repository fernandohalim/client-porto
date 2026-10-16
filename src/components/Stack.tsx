const GROUPS = [
  {
    name: "Languages",
    items: ["Java", "TypeScript", "Go", "Rust", "Python", "C#"],
  },
  { name: "Services", items: ["Spring Boot", "Express", "Node"] },
  {
    name: "Interface",
    items: [
      "Next.js",
      "Tailwind",
      "Framer Motion",
      "Electron",
      "Flutter",
      "React Native",
    ],
  },
  {
    name: "Data",
    items: ["Oracle SQL", "Redis", "MySQL", "Supabase", "Firebase"],
  },
  { name: "Workflow", items: ["Git", "Maven"] },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

export default function Stack() {
  return (
    <section id="stack">
      <h2>Stack</h2>
      <p>
        {TOTAL} technologies in rotation, grouped by the job they do rather
        than by how well I know them.
      </p>

      {GROUPS.map((g) => (
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

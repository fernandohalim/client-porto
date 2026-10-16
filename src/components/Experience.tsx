const ROLES = [
  {
    role: "Java Application Developer",
    company: "PT Rintis Sejahtera",
    date: "Oct 2024 — Now",
    type: "Full-time",
    stack: ["Java", "Spring Boot", "Redis", "Oracle"],
    points: [
      "Real-time fraud detection microservices for interbank transaction networks.",
      "Complex database operations across massive volumes of financial records.",
    ],
    active: true,
    linkedin: "https://www.linkedin.com/company/pt-rintis-sejahtera/",
  },
  {
    role: "Fullstack Developer",
    company: "WEBin",
    date: "Feb 2023 — Now",
    type: "Freelance studio",
    stack: ["Next.js", "React", "Node", "Go"],
    points: [
      "End-to-end custom builds for B2B clients — system design through deployment.",
      "Clean, documented APIs and responsive product interfaces.",
    ],
    active: true,
    linkedin: "https://www.linkedin.com/company/91073950",
  },
  {
    role: "Frontend Developer",
    company: "PT Overo Digital Global",
    date: "Aug 2022 — Jan 2023",
    type: "Hybrid",
    stack: ["React", "Tailwind", "Flutter"],
    points: [
      "Client-facing web and cross-platform mobile interfaces with the UI/UX team.",
    ],
    active: false,
    linkedin: "https://www.linkedin.com/company/overo-global-technologies/",
  },
];

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <p>
        Three years across a payments processor, a freelance studio and an
        agency floor — the throughline is shipping things other people depend
        on.
      </p>

      <ol>
        {ROLES.map((r) => (
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
        <h3>Why it matters</h3>
        <p>
          The day job runs at a scale I could never simulate alone — millions of
          transactions, latency budgets in milliseconds, no forgiving path for a
          bad query. Everything I know about writing software that holds up
          came from there.
        </p>
      </aside>
    </section>
  );
}

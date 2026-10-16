const GITHUB = "https://github.com/fernandohalim";

// slug is where each case study will live again (/projects/<slug>) once the
// pages are rebuilt — unlinked until then so nothing points at a 404
const WORK = [
  {
    title: "lūme",
    slug: "lume",
    blurb: "Spotify miniplayer that samples cover art for its glow",
    stack: ["Tauri", "Rust"],
    year: "2026",
  },
  {
    title: "nest.",
    slug: "nest",
    blurb: "AI receipt scanning with a group settlement engine",
    stack: ["Next", "Gemini"],
    year: "2026",
  },
  {
    title: "Tempo",
    slug: "tempo",
    blurb: "Desktop clock widget — timer, alarm, stopwatch",
    stack: ["Electron", "React"],
    year: "2026",
  },
  {
    title: "Piggy Wallet",
    slug: "piggy-wallet",
    blurb: "Offline-first expense tracker with a budget system",
    stack: ["Next", "IDB"],
    year: "2026",
  },
  {
    title: "noted.",
    slug: "noted",
    blurb: "Offline-first markdown editor with 3-way merge",
    stack: ["Next", "IDB"],
    year: "2026",
  },
];

export default function Work() {
  return (
    <section id="work">
      <h2>Selected work</h2>
      <p>
        Products I designed, built and shipped on my own — each one documented
        end to end as a case study.
      </p>

      <ul>
        {WORK.map((w) => (
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
        <h3>Open source</h3>
        <p>
          Pixel-art converters, Go log tooling and the smaller utilities — all
          on GitHub.
        </p>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer">
          More on GitHub
        </a>
      </article>
    </section>
  );
}

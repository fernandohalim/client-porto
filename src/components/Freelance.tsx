type Kind = "live" | "internal" | "prelaunch" | "archived";

const STATUS: Record<Kind, string> = {
  live: "Live",
  internal: "Internal only",
  prelaunch: "Pre-launch",
  archived: "Discontinued",
};

const CLIENTS: {
  title: string;
  blurb: string;
  stack: string[];
  year: string;
  kind: Kind;
  href?: string;
}[] = [
  {
    title: "PT Ciputra Development Tbk - The Forestine",
    blurb: "Property marketing site",
    stack: ["Next", "Tailwind"],
    year: "2026",
    kind: "live",
    href: "https://forestine.id",
  },
  {
    title: "Handy and Sharon",
    blurb: "Wedding invitation site with RSVP handling",
    stack: ["Next", "Firestore"],
    year: "2026",
    kind: "live",
    href: "https://handpickedforshar.com",
  },
  {
    title: "Nenggala Academy",
    blurb: "Student portal and marketing site",
    stack: ["Next", "Express"],
    year: "2026",
    kind: "prelaunch",
  },
  {
    title: "PT Maju Jaya Arkananta",
    blurb: "Company profile and catalogue website with CMS",
    stack: ["CRA", "Go"],
    year: "2024",
    kind: "live",
    href: "https://hydraulicpump.co.id",
  },
  {
    title: "PT Jasplast Sukses Bersama",
    blurb: "Internal financial record system",
    stack: ["CRA", "Express"],
    year: "2024",
    kind: "internal",
  },
  {
    title: "PT Argotehnik Kreasindo Abadi",
    blurb: "Web-based operational ERP",
    stack: ["CRA", "Express"],
    year: "2024",
    kind: "internal",
  },
  {
    title: "Rawa Belong Florist Community",
    blurb: "Marketplace mobile application and website",
    stack: ["Flutter", "Express"],
    year: "2023",
    kind: "archived",
  },
  {
    title: "PT Loyalty Development - LeSeen",
    blurb: "Company profile website",
    stack: ["CRA", "Tailwind"],
    year: "2023",
    kind: "archived",
  },
];

export default function Freelance() {
  return (
    <section id="freelance">
      <h2>Freelance</h2>
      <p>
        Commissioned work for studios, developers and small businesses —
        delivered end to end, from system design through deployment.
      </p>

      <ul>
        {CLIENTS.map((c) => (
          <li key={c.title}>
            <h3>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.title}
                </a>
              ) : (
                c.title
              )}
            </h3>
            <p>{c.blurb}</p>
            <p>
              {c.stack.join(" · ")} — {STATUS[c.kind]} — {c.year}
            </p>
          </li>
        ))}
      </ul>

      <p>
        {CLIENTS.length} commissions — {CLIENTS.filter((c) => c.href).length}{" "}
        still live
      </p>
    </section>
  );
}

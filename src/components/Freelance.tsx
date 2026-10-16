import { CLIENT_STATUS, FREELANCE } from "@/content/portfolio";

export default function Freelance() {
  const clients = FREELANCE.clients;
  return (
    <section id="freelance">
      <h2>Freelance</h2>
      <p>{FREELANCE.intro}</p>

      <ul>
        {clients.map((c) => (
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
              {c.stack.join(" · ")} — {CLIENT_STATUS[c.kind]} — {c.year}
            </p>
          </li>
        ))}
      </ul>

      <p>
        {clients.length} commissions — {clients.filter((c) => c.href).length}{" "}
        still live
      </p>
    </section>
  );
}

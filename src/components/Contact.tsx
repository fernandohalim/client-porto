const EMAIL = "fernandohalim26@gmail.com";

const LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/fernando-halimm" },
  { name: "GitHub", href: "https://github.com/fernandohalim" },
  { name: "WhatsApp", href: "https://wa.me/6289606366647" },
  { name: "Résumé", href: "/fernando_halim_cv.pdf" },
];

export default function Contact() {
  return (
    <section id="contact">
      <h2>Got something you want built properly?</h2>
      <p>
        A project, a question about the work, or just a hello — the inbox is
        always open, and replies come on Jakarta hours.
      </p>
      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

      <ul>
        {LINKS.map((l) => (
          <li key={l.name}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.name}
            </a>
          </li>
        ))}
      </ul>

      <p>West Jakarta, ID</p>
    </section>
  );
}

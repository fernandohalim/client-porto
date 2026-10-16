import { CONTACT, PERSON } from "@/content/portfolio";

export default function Contact() {
  return (
    <section id="contact">
      <h2>{CONTACT.heading}</h2>
      <p>{CONTACT.body}</p>
      <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>

      <ul>
        {CONTACT.links.map((l) => (
          <li key={l.name}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.name}
            </a>
          </li>
        ))}
      </ul>

      <p>{PERSON.location}</p>
    </section>
  );
}

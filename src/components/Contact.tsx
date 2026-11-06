import { CONTACT, PERSON } from "@/content/portfolio";
import Rise from "./Rise";

export default function Contact() {
  return (
    <section id="contact" className="panel">
      <h2 data-drift className="display reveal flex-none max-w-[14ch] h-scroll:[--size:min(calc(var(--h)/4.2),10vw)]">
        <Rise text={CONTACT.heading} />
      </h2>

      <div className="reveal mt-8 flex flex-col justify-end gap-4 h-scroll:mt-0 h-scroll:w-96 h-scroll:flex-none">
        <p className="lede">{CONTACT.body}</p>
        <a
          href={`mailto:${PERSON.email}`}
          className="text-2xl break-all underline decoration-1 underline-offset-4"
        >
          {PERSON.email}
        </a>
        <ul className="label flex flex-col gap-1">
          {CONTACT.links.map((l) => (
            <li key={l.name}>
              <a href={l.href} target="_blank" rel="noreferrer" className="link">
                {l.name} <span aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="label">{PERSON.location}</p>
      </div>
    </section>
  );
}

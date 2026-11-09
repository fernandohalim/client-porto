import { CONTACT, PERSON } from "@/content/portfolio";
import Rise from "./Rise";

// The last screen. From h-scroll up it fills the window exactly, so the page ends on
// it rather than on a sliver of the section before, with the heading at the top and
// everything else in one row along the bottom, inside the same margins as the header.
export default function Contact() {
  return (
    <section
      id="contact"
      className="panel contact h-scroll:w-screen h-scroll:flex-col h-scroll:justify-between"
    >
      <h2
        data-drift
        className="display reveal max-w-[14ch] flex-none h-scroll:[--size:min(calc(var(--h)/3.3),11vw)]"
      >
        <Rise text={CONTACT.heading} />
      </h2>

      <div className="reveal mt-8 flex flex-col gap-10 h-scroll:mt-0 h-scroll:flex-row h-scroll:items-end h-scroll:justify-between">
        <div className="flex max-w-md flex-col gap-4">
          <p className="lede">{CONTACT.body}</p>
          <a
            href={`mailto:${PERSON.email}`}
            className="text-2xl break-all underline decoration-1 underline-offset-4"
          >
            {PERSON.email}
          </a>
        </div>

        <div className="label flex items-end gap-16">
          <ul className="flex flex-col gap-1">
            {CONTACT.links.map((l) => (
              <li key={l.name}>
                <a href={l.href} target="_blank" rel="noreferrer" className="link">
                  {l.name} <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
          {/* the footer's job on a wide window; on a phone the footer below does it */}
          <p className="hidden h-scroll:block">
            {PERSON.location}
            <br />© {new Date().getFullYear()} {PERSON.name}
            <br />
            Designed and built by me
          </p>
        </div>
      </div>
    </section>
  );
}

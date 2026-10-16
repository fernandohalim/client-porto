import Link from "next/link";
import { HERO, PERSON } from "@/content/portfolio";

export default function Hero() {
  return (
    <section id="hero">
      <p>
        {PERSON.name} — {PERSON.role}
      </p>
      <h1>{HERO.headline}</h1>
      <p>{HERO.shipped}</p>
      <p>{HERO.availability}</p>
      <ul>
        <li>
          <Link href="/site#work">Selected work</Link>
        </li>
        <li>
          <Link href="/site#contact">Get in touch</Link>
        </li>
      </ul>
    </section>
  );
}

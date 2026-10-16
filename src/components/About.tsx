import Link from "next/link";
import { ABOUT } from "@/content/portfolio";

export default function About() {
  return (
    <section id="about">
      <h2>About</h2>
      <p>{ABOUT.lede}</p>

      <dl>
        {ABOUT.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      <p>{ABOUT.body}</p>
      <Link href="/site#experience">Read the experience</Link>
    </section>
  );
}

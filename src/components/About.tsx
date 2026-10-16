import Link from "next/link";

const STATS = [
  { value: "17", label: "Projects shipped" },
  { value: "8", label: "Clients served" },
  { value: "5", label: "Case studies written" },
  { value: "4", label: "Years building" },
  { value: "22", label: "Technologies in rotation" },
  { value: "3", label: "Roles held" },
];

export default function About() {
  return (
    <section id="about">
      <h2>About</h2>
      <p>
        I build software at two very different scales — fraud detection for
        interbank payment networks, and products small enough that I own every
        decision in them.
      </p>

      <dl>
        {STATS.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      <p>
        By day I write Java and Spring Boot services that score interbank
        transactions in real time, where a missed millisecond is a missed
        transaction. After hours I build and ship my own products end-to-end —
        data model through easing curve. The first taught me rigor; the second
        is where the rigor gets a personality.
      </p>
      <Link href="/site#experience">Read the experience</Link>
    </section>
  );
}

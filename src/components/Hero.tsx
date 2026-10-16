import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero">
      <p>Fernando Halim — Fullstack developer</p>
      <h1>Real-time fraud systems by day. Products I own after hours.</h1>
      <p>In production: 17 projects shipped</p>
      <p>Available for work</p>
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

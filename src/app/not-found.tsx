import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <p>Error 404</p>
      <h1>This page isn&rsquo;t in the index.</h1>
      <p>
        It may have moved, been renamed, or never existed at all. The work, the
        stack and the way to reach me are all still where you left them.
      </p>
      <ul>
        <li>
          <Link href="/">Back home</Link>
        </li>
        <li>
          <Link href="/site#work">Selected work</Link>
        </li>
      </ul>
    </main>
  );
}

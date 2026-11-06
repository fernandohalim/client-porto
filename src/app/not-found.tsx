import Link from "next/link";

// a full page load, so the browser lands on the section start (see Nav)
const WORK_HREF = "/#work";

export default function NotFound() {
  return (
    <main>
      <div className="panel flex-col justify-between gap-8 h-scroll:w-screen h-scroll:flex-row h-scroll:items-end">
        <h1 className="display max-w-[14ch] h-scroll:[--size:min(calc(var(--h)/4.2),10vw)]">
          This page isn&rsquo;t in the index.
        </h1>
        <div className="flex max-w-md flex-none flex-col gap-3 h-scroll:w-80">
          <p className="label">Error 404</p>
          <p>
            It may have moved, been renamed, or never existed at all. The work, the
            stack and the way to reach me are all still where you left them.
          </p>
          <ul className="label flex gap-5">
            <li>
              <Link href="/" className="link">
                Back home
              </Link>
            </li>
            <li>
              <a href={WORK_HREF} className="link">
                Selected work
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

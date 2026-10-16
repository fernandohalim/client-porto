import Link from "next/link";

const LINKS = [
  { name: "About", href: "/site#about" },
  { name: "Selected work", href: "/site#work" },
  { name: "Stack", href: "/site#stack" },
  { name: "Experience", href: "/site#experience" },
  { name: "Freelance", href: "/site#freelance" },
  { name: "Contact", href: "/site#contact" },
];

export default function Nav() {
  return (
    <header>
      <Link href="/site">Fernando Halim</Link>
      <nav>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <p>West Jakarta, ID</p>
    </header>
  );
}

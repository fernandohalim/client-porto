// ─────────────────────────────────────────────────────────────────────────────
// Footer — white, matching the reference's closing plate.
//
// The previous version was the old footer in new colours: four columns of plain
// text links over a status bar carrying a live clock, an "Available" pulse and
// a deploy date. That bar was the last surviving piece of the HUD register, and
// it is gone. What replaces it follows the reference — wordmark and boxed
// social tiles on the left, chip-headed link columns on the right, and a single
// hairline rule above a credit line.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { SiGithub, SiWhatsapp } from "react-icons/si";
// Simple Icons dropped LinkedIn over trademark policy, so it comes from Font Awesome
import { FaLinkedinIn } from "react-icons/fa6";
import type { IconType } from "react-icons";

const COLUMNS: { heading: string; links: { name: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { name: "Selected work", href: "/#work" },
      { name: "Stack", href: "/#stack" },
      { name: "Experience", href: "/#experience" },
      { name: "Freelance", href: "/#freelance" },
    ],
  },
  {
    heading: "Profile",
    links: [
      { name: "About", href: "/#about" },
      { name: "Uses", href: "/uses" },
      { name: "Résumé", href: "/fernando_halim_cv.pdf" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { name: "fernandohalim26@gmail.com", href: "mailto:fernandohalim26@gmail.com" },
      { name: "Get in touch", href: "/#contact" },
    ],
  },
];

const SOCIALS: { name: string; href: string; Icon: IconType }[] = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/fernando-halimm",
    Icon: FaLinkedinIn,
  },
  { name: "GitHub", href: "https://github.com/fernandohalim", Icon: SiGithub },
  { name: "WhatsApp", href: "https://wa.me/6289606366647", Icon: SiWhatsapp },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-white text-ink">
      <div className="px-5 pt-16 md:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-14 md:grid-cols-12">
          {/* ── identity ── */}
          <div className="col-span-2 md:col-span-4">
            <Link
              href="/"
              data-cursor="Home"
              className="display text-[clamp(1.5rem,2.6vw,2rem)]"
            >
              Fernando Halim
              <span className="align-super text-[0.4em] text-accent">®</span>
            </Link>
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-mute">
              Fullstack developer producing considered software from West
              Jakarta, Indonesia.
            </p>

            <div className="mt-7 flex gap-2">
              {SOCIALS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  data-cursor={name}
                  className="grid h-9 w-9 place-items-center rounded-[4px] border border-line text-ink/60 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-coal"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* ── link columns ── */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="md:col-span-2">
              <span className="chip text-ink/45">{col.heading}</span>
              <ul className="mt-5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    {l.href.startsWith("http") ||
                    l.href.startsWith("mailto") ||
                    l.href.endsWith(".pdf") ? (
                      <a
                        href={l.href}
                        target={l.href.startsWith("mailto") ? undefined : "_blank"}
                        rel="noreferrer"
                        className="text-sm text-mute transition-colors hover:text-ink"
                      >
                        {l.name}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-mute transition-colors hover:text-ink"
                      >
                        {l.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── availability, as a statement rather than a status light ── */}
          <div className="col-span-2 md:col-span-2">
            <span className="chip text-accent-deep">Open to work</span>
            <p className="mt-5 text-sm leading-relaxed text-mute">
              Taking on freelance builds for 2026.
            </p>
          </div>
        </div>

        <div className="mono-label flex flex-col items-center justify-between gap-2 border-t border-line py-6 text-mute sm:flex-row">
          <span>© {new Date().getFullYear()} — West Jakarta, ID</span>
          <span>Designed and built by Fernando Halim</span>
        </div>
      </div>
    </footer>
  );
}

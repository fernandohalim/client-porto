import Link from "next/link";
import JakartaTime from "@/utilities/JakartaTime";

const LAST_DEPLOYED = "2026-05-08";

export default function Footer() {
  const deploy = new Date(LAST_DEPLOYED).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const navigate = [
    { name: "Work", href: "/#projects" },
    { name: "Experience", href: "/#experience" },
    { name: "Skills", href: "/#skills" },
    { name: "Uses", href: "/uses" },
    { name: "Contact", href: "/#contact" },
  ];

  const elsewhere = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/fernando-halimm" },
    { name: "GitHub", href: "https://github.com/fernandohalim" },
    { name: "WhatsApp", href: "https://wa.me/6289606366647" },
    { name: "Résumé", href: "/fernando_halim_cv.pdf" },
  ];

  return (
    <footer className="border-t border-line bg-paper mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <p className="font-serif text-2xl text-ink">
              Fernando <em className="italic text-accent">Halim</em>
            </p>
            <p className="text-ink-2 text-sm mt-3 max-w-[28ch]">
              Fullstack developer building considered software in West Jakarta.
            </p>
          </div>

          <div>
            <p className="text-faint text-xs uppercase tracking-[0.16em] mb-4">
              Navigate
            </p>
            <ul className="space-y-2.5 text-sm">
              {navigate.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-ink-2 hover:text-ink transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-faint text-xs uppercase tracking-[0.16em] mb-4">
              Elsewhere
            </p>
            <ul className="space-y-2.5 text-sm">
              {elsewhere.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-2 hover:text-ink transition-colors"
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-faint">
          <span>
            © {new Date().getFullYear()} Fernando Halim — West Jakarta, ID
          </span>
          <span className="flex items-center gap-5">
            <span className="tabular-nums">
              <JakartaTime />
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6f9a6a]" />
              available
            </span>
            <span>updated {deploy}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import JakartaTime from "@/utilities/JakartaTime";

const LAST_DEPLOYED = "2026-06-11";

export default function Footer() {
  const deploy = new Date(LAST_DEPLOYED).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const navigate = [
    { name: "Index", href: "/#work" },
    { name: "About", href: "/#about" },
    { name: "Stack", href: "/#stack" },
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
    <footer className="bg-coal text-bone mt-auto overflow-hidden">
      <div className="px-5 md:px-8 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-16">
          <div className="col-span-2 md:col-span-2">
            <p className="mono-label text-smoke mb-3">The studio</p>
            <p className="text-ash text-sm leading-relaxed max-w-[34ch]">
              Fernando Halim — fullstack developer producing considered software
              from West Jakarta. Vol. 02.
            </p>
          </div>
          <div>
            <p className="mono-label text-smoke mb-4">Navigate</p>
            <ul className="space-y-2.5 text-sm">
              {navigate.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-ash hover:text-bone transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono-label text-smoke mb-4">Elsewhere</p>
            <ul className="space-y-2.5 text-sm">
              {elsewhere.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ash hover:text-bone transition-colors"
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-bone/15 py-5 mono-label text-smoke">
          <span>© {new Date().getFullYear()} — West Jakarta, ID</span>
          <span className="flex items-center gap-6">
            <JakartaTime />
            <span className="flex items-center gap-1.5 text-accent">
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />{" "}
              Available
            </span>
            <span>Updated {deploy}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

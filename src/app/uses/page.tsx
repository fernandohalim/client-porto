import Link from "next/link";
import Reveal from "@/utilities/Reveal";

const cardClass =
  "h-full rounded-2xl border border-line bg-surface p-8 transition-all duration-500 hover:border-line-2 hover:shadow-[0_30px_60px_-40px_rgba(34,32,28,0.35)]";
const labelClass = "text-faint text-xs uppercase tracking-[0.14em]";
const chipClass =
  "text-[12.5px] text-ink-2 border border-line rounded-full px-3 py-1";

export default function Uses() {
  return (
    <main className="min-h-screen bg-paper max-w-5xl mx-auto px-6 pt-32 pb-28">
      <Reveal>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink transition-colors mb-12"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back home
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <span className={labelClass}>Colophon</span>
        <h1 className="font-serif font-light tracking-tight text-[clamp(2.4rem,6vw,4rem)] mt-4 mb-5">
          Hardware &amp; <em className="italic">software.</em>
        </h1>
        <p className="text-ink-2 max-w-[52ch] leading-relaxed mb-16 text-lg">
          A breakdown of my daily drivers — from Apple silicon to the tooling
          behind high-volume database work.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Reveal className="md:col-span-2" delay={0.05}>
          <div className={cardClass}>
            <span className={labelClass}>Workstation</span>
            <h3 className="font-serif text-2xl mt-2 mb-4">The daily driver</h3>
            <p className="text-ink-2 leading-relaxed mb-6">
              A <span className="text-ink">MacBook Air M2</span> — incredible
              battery life and a Unix environment out of the box. Apple silicon
              runs my Spring Boot microservices, Node environments, and
              dockerized tests in total silence.
            </p>
            <div className="flex flex-wrap gap-2">
              {["MacBook Air M2", "Apple Silicon", "Unix"].map((t) => (
                <span key={t} className={chipClass}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className={cardClass}>
            <span className={labelClass}>Peripherals</span>
            <h3 className="font-serif text-2xl mt-2 mb-4">Desk</h3>
            <ul className="space-y-3 text-sm text-ink-2">
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">↳</span>
                <span>
                  <span className="text-ink">Lofree Flow2 (84-key)</span> — main
                  low-profile board.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">↳</span>
                <span>
                  <span className="text-ink">Royal Kludge RK65</span> — compact
                  secondary mechanical.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0">↳</span>
                <span>
                  <span className="text-ink">Razer Basilisk</span> &amp; dual
                  27&quot; 2K monitors.
                </span>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className={cardClass}>
            <span className={labelClass}>Editors</span>
            <h3 className="font-serif text-2xl mt-2 mb-4">Split by domain</h3>
            <p className="text-ink-2 leading-relaxed mb-6">
              <span className="text-ink">IntelliJ IDEA</span> does the heavy
              lifting for Java; <span className="text-ink">VS Code</span> for
              React and Next.js. For system ops I live in the macOS terminal and
              iTerm2.
            </p>
            <div className="flex flex-wrap gap-2">
              {["IntelliJ IDEA", "VS Code", "iTerm2"].map((t) => (
                <span key={t} className={chipClass}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.12}>
          <div className={cardClass}>
            <span className={labelClass}>Database</span>
            <h3 className="font-serif text-2xl mt-2 mb-5">
              Where the data lives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-ink border-b border-line pb-2 mb-2">
                  DataGrip
                </p>
                <p className="text-ink-2 text-sm leading-relaxed">
                  Primary database GUI — managing schemas, running complex
                  queries, and inspecting large datasets efficiently.
                </p>
              </div>
              <div>
                <p className="text-ink border-b border-line pb-2 mb-2">
                  PL/SQL Developer
                </p>
                <p className="text-ink-2 text-sm leading-relaxed">
                  The specialist — Oracle triggers, packages, and massive
                  transaction batches.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

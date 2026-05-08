import DecryptText from "../utilities/DecryptText";
import MatrixCanvas from "./MatrixCanvas";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-black pt-28 pb-24">
      {/* --- background combined effects --- */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_0%,transparent_80%)]"></div>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-75 md:w-125 h-75 md:h-125 bg-green-600/30 rounded-full blur-[100px] md:blur-[120px]"></div>
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 w-62.5 md:w-100 h-62.5 md:h-100 bg-emerald-800/30 rounded-full blur-[100px] md:blur-[120px]"></div>
      </div>

      <div className="z-10 max-w-5xl mx-auto w-full">
        {/* matrix banner monitor */}
        <div className="mb-10 md:mb-12">
          <MatrixCanvas />
        </div>

        <div className="text-center">
          {/* status pill */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            system.status === &quot;online&quot;
          </div>

          {/* massive mono headline with blinking cursor */}
          <h1 className="text-[clamp(1.5rem,7vw,4.5rem)] leading-tight font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500 mb-10">
            building_robust_systems. <br className="hidden md:block" />
            <DecryptText text="crafting_clean_uis." />
            <span className="inline-block w-1.5 md:w-7 h-5 md:h-14 bg-green-500 ml-2 animate-blink align-middle -translate-y-1 md:-translate-y-2"></span>
          </h1>
        </div>

        {/* about block — terminal printout style */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-xs overflow-hidden">
            {/* terminal header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950/60">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                ~/about.md
              </span>
              <span className="font-mono text-[10px] text-zinc-600">
                read-only
              </span>
            </div>

            {/* content */}
            <div className="p-5 sm:p-6 md:p-8 font-mono text-sm md:text-[15px] leading-relaxed text-zinc-300 space-y-4 lowercase">
              <p>
                <span className="text-green-500">$ </span>
                <span className="text-zinc-500">whoami</span>
              </p>
              <p>
                <span className="text-zinc-200 font-medium">
                  fernando halim
                </span>
                . a fullstack developer based in west jakarta, indonesia.
              </p>
              <p>
                by day, i engineer real-time fraud detection systems at{" "}
                <span className="text-zinc-200">pt rintis sejahtera</span> —
                processing high-volume financial data through java microservices
                and a database layer that does not get to be slow. by night, i
                ship modern web applications under{" "}
                <span className="text-zinc-200">webin</span>, my freelance
                practice.
              </p>
              <p>
                <span className="text-green-500">$ </span>
                <span className="text-zinc-500">cat philosophy.txt</span>
              </p>
              <ul className="space-y-2 pl-1">
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0">{">"}</span>
                  <span>
                    backend that scales: java + spring boot, redis caching,
                    oracle at depth.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0">{">"}</span>
                  <span>
                    frontend that breathes: react and next.js with a heavy
                    emphasis on micro-interactions.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0">{">"}</span>
                  <span>
                    the unglamorous middle: error handling, edge cases, and the
                    polish passes nobody notices when they are right.
                  </span>
                </li>
              </ul>
              <p className="pt-2 border-t border-zinc-800/60 text-zinc-400">
                i care about software that respects its users — both in
                performance and in the small details.
              </p>
            </div>
          </div>
        </div>

        {/* console-style cta buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-mono text-sm">
          <a
            href="#projects"
            className="group flex items-center gap-2 px-6 py-3 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] duration-500 transition-all"
          >
            <span>./execute_portfolio</span>
            <span className="group-hover:translate-x-1 transition-transform">
              -&gt;
            </span>
          </a>
          <a
            href="#experience"
            className="group flex items-center gap-2 px-6 py-3 rounded-md text-zinc-400 hover:text-white transition-colors"
          >
            <span>cat journey.log</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              _
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

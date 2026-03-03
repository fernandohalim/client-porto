import DecryptText from "../utilities/DecryptText";

export default function Hero() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-black pt-14"
    >
      {/* --- background combined effects --- */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* grid pattern radial fade-out mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_0%,transparent_80%)]"></div>
        {/* primary hacker green glow shifted slightly left */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-75 md:w-125 h-75 md:h-125 bg-green-600/20 rounded-full blur-[100px] md:blur-[120px]"></div>

        {/* secondary deep emerald/cyan glow shifted right for contrast */}
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 w-62.5 md:w-100 h-62.5 md:h-100 bg-emerald-800/20 rounded-full blur-[100px] md:blur-[120px]"></div>
      </div>
      {/* ----------------------------------- */}
      <div className="z-10 text-center max-w-5xl mx-auto mt-8">
        {/* status boolean */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono tracking-wide backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          system.status === &quot;online&quot;
        </div>

        {/* massive mono headline with blinking cursor */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500 mb-8">
          building_robust_systems. <br className="hidden md:block" />
          <DecryptText text="crafting_clean_uis." />
          <span className="inline-block w-2 md:w-8 h-6 md:h-16 bg-green-500 ml-2 animate-blink align-middle -translate-y-1 md:-translate-y-2"></span>{" "}
        </h1>

        {/* clean mono subheadline */}
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-mono leading-relaxed mb-12 lowercase">
          hi, i&apos;m{" "}
          <span className="text-green-400 font-medium">fernando halim</span>. a
          fullstack developer specializing in fraud detection systems and modern
          web applications.
        </p>

        {/* console-style cta buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-mono text-sm">
          <a
            href="#projects"
            className="group flex items-center gap-2 px-6 py-3 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all backdrop-blur-xs"
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

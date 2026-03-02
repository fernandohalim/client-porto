import DecryptText from "../utilities/DecryptText";

export default function Hero() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-black pt-14"
    >
      {/* subtle hacker-green background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center max-w-5xl mx-auto mt-8">
        {/* status boolean */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono tracking-wide">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          system.status === &quot;online&quot;
        </div>

        {/* massive mono headline with blinking cursor */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500 mb-8">
          building_robust_systems. <br className="hidden md:block" />
          <DecryptText text="crafting_clean_uis." />
          <span className="inline-block w-4 md:w-8 h-10 md:h-16 bg-green-500 ml-2 animate-blink align-middle -translate-y-1 md:-translate-y-2"></span>{" "}
        </h1>

        {/* clean mono subheadline */}
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-mono leading-relaxed mb-12 lowercase">
          hi, i&apos;m{" "}
          <span className="text-green-400 font-medium">fernando halim</span>. a
          fullstack developer specializing in fraud detection systems and modern
          web applications.
        </p>

        {/* console-style cta buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-mono text-sm">
          <a
            href="#projects"
            className="group flex items-center gap-2 px-6 py-3 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all"
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

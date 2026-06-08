"use client";

import Reveal from "@/utilities/Reveal";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 pt-32 pb-24 scroll-mt-24"
    >
      <Reveal>
        <div className="flex items-center gap-3 text-faint text-sm tracking-[0.16em] uppercase">
          <span className="w-7 h-px bg-line-2" />
          Fullstack developer · Jakarta
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <h1 className="font-serif font-light tracking-tight leading-[1.02] text-[clamp(2.6rem,7vw,5.6rem)] mt-7">
          I build software that{" "}
          <em className="italic text-accent font-normal">respects</em> its users
          — in <em className="italic font-normal">speed</em> and in{" "}
          <em className="italic font-normal">detail.</em>
        </h1>
      </Reveal>

      <Reveal delay={0.24}>
        <p className="mt-8 max-w-[52ch] text-ink-2 text-[clamp(1.05rem,1.7vw,1.3rem)] leading-relaxed">
          By day I engineer real-time fraud detection for banks at{" "}
          <span className="text-ink">PT Rintis Sejahtera</span>. By night I ship
          modern web products under <span className="text-ink">WEBin</span> —
          with an obsessive eye for the parts nobody notices.
        </p>
      </Reveal>

      <Reveal delay={0.36}>
        <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-7 text-sm">
          <div>
            <span className="inline-flex items-center gap-2 text-ink-2">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#6f9a6a] opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[#6f9a6a]" />
              </span>
              Available
            </span>
            <span className="block text-ink mt-1">
              for select freelance work
            </span>
          </div>
          <div>
            <span className="text-faint">Currently</span>
            <span className="block text-ink mt-1">
              Java Application Developer @ Rintis
            </span>
          </div>
          <div>
            <span className="text-faint">Focus</span>
            <span className="block text-ink mt-1">
              Spring Boot · React · Next.js
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

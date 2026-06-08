"use client";

import Reveal from "@/utilities/Reveal";

export default function Contact() {
  const email = "fernandohalim26@gmail.com";
  const links = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/fernando-halimm" },
    { name: "WhatsApp", href: "https://wa.me/6289606366647" },
    { name: "Résumé", href: "/fernando_halim_cv.pdf" },
  ];

  return (
    <section
      id="contact"
      className="max-w-5xl mx-auto px-6 py-32 text-center scroll-mt-24"
    >
      <Reveal>
        <span className="text-faint text-xs uppercase tracking-[0.16em]">
          Contact
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="font-serif font-light tracking-tight text-[clamp(2.4rem,6vw,4.6rem)] mt-5 mb-6">
          Let&apos;s build <em className="italic text-accent">something.</em>
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="text-ink-2 max-w-[44ch] mx-auto mb-10 text-lg leading-relaxed">
          Have a question about my work, or just want to say hello? My inbox is
          always open.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <a
          href={`mailto:${email}`}
          className="font-serif italic text-[clamp(1.3rem,3vw,2rem)] text-ink border-b border-line-2 pb-1 hover:border-accent hover:text-accent transition-colors"
        >
          {email}
        </a>
      </Reveal>

      <Reveal delay={0.4}>
        <div className="mt-12 flex items-center justify-center gap-7 text-sm">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group relative text-ink-2 hover:text-ink transition-colors"
            >
              {l.name}
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

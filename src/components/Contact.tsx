"use client";

import { motion } from "framer-motion";
import Magnetic from "@/utilities/Magnetic";
import { Chars } from "@/utilities/TextReveal";

const LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/fernando-halimm" },
  { name: "GitHub", href: "https://github.com/fernandohalim" },
  { name: "WhatsApp", href: "https://wa.me/6289606366647" },
  { name: "Résumé", href: "/fernando_halim_cv.pdf" },
];

export default function Contact() {
  const email = "fernandohalim26@gmail.com";
  return (
    <section id="contact" className="py-32 md:py-44 px-5 md:px-8 scroll-mt-24">
      <span className="mono-label text-smoke">Contact — Final reel</span>

      <h2 className="display text-ink text-[clamp(3.4rem,13vw,12rem)] mt-8">
        <span className="block">
          <Chars text="LET'S" stagger={0.04} />
        </span>
        <span className="block text-right">
          <Chars text="TALK" stagger={0.05} delay={0.25} />
          <span className="text-accent">.</span>
        </span>
      </h2>

      <div className="mt-16 md:mt-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-smoke leading-relaxed max-w-[40ch]"
        >
          A project, a question about the work, or a hello — the inbox is always
          open and replies come from Jakarta hours.
        </motion.p>

        <Magnetic strength={0.25}>
          <a
            href={`mailto:${email}`}
            data-cursor="Send"
            className="group relative inline-block overflow-hidden border border-ink rounded-full px-8 py-5"
          >
            <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <span className="relative z-10 mono-label text-ink group-hover:text-bone transition-colors duration-500">
              {email}
            </span>
          </a>
        </Magnetic>
      </div>

      <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
        {LINKS.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="group relative mono-label text-smoke hover:text-ink transition-colors"
          >
            {l.name} ↗
            <span className="absolute left-0 -bottom-1 h-px w-full bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </a>
        ))}
      </div>
    </section>
  );
}

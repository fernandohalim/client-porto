"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Contact — S.06, the closing plate.
//
// Mirrors the reference's final full-bleed section: a photographic plate under
// a heavy wash, everything centred, one pill as the only real target. The old
// version shouted LET'S TALK at 12vw in expanded caps; this one says it once,
// in sentence case, and puts the email where your thumb already is.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { motion } from "framer-motion";
import SectionMark from "@/utilities/SectionMark";
import JakartaTime from "@/utilities/JakartaTime";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL = "fernandohalim26@gmail.com";

const LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/fernando-halimm" },
  { name: "GitHub", href: "https://github.com/fernandohalim" },
  { name: "WhatsApp", href: "https://wa.me/6289606366647" },
  { name: "Résumé", href: "/fernando_halim_cv.pdf" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      data-ground="dark"
      className="relative isolate scroll-mt-20 overflow-hidden bg-coal py-24 text-bone-2 md:py-32"
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src="/images/contact-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-coal/78" />
        <span className="absolute inset-0 bg-gradient-to-b from-coal via-transparent to-coal" />
      </div>

      <SectionMark
        no="06"
        name="Contact"
        tone="bone"
        className="px-5 md:px-8"
      />

      <div className="mt-16 flex flex-col items-center px-5 text-center md:mt-24 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.85, ease: EASE }}
          className="display max-w-[16ch] text-[clamp(2rem,6vw,4.6rem)]"
        >
          Got something you want built properly
          <span className="text-accent">?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-7 max-w-[46ch] text-sm leading-relaxed text-ash-2"
        >
          A project, a question about the work, or just a hello — the inbox is
          always open, and replies come on Jakarta hours.
        </motion.p>

        {/* the one target */}
        <motion.a
          href={`mailto:${EMAIL}`}
          data-cursor="Send an email"
          data-cursor-snap
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          className="group relative mt-11 inline-flex items-center gap-3 overflow-hidden rounded-[6px] bg-white py-3 pl-5 pr-2.5 text-coal"
        >
          <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
          <span className="mono-label relative z-10 pt-px">{EMAIL}</span>
          <span className="relative z-10 grid h-[22px] w-[22px] place-items-center overflow-hidden rounded-[3px] bg-coal text-white">
            <span className="block transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%]">
              <Arrow />
            </span>
            <span className="absolute block -translate-x-[150%] transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0">
              <Arrow />
            </span>
          </span>
        </motion.a>

        {/* elsewhere */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.28 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          {LINKS.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group relative mono-label text-ash-2 transition-colors hover:text-bone-2"
            >
              {l.name} ↗
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </motion.div>

        <div className="mono-label mt-14 flex items-center gap-2 text-ash-2/70">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          West Jakarta — <JakartaTime />
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M1 4h6M4.5 1.5 7 4 4.5 6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

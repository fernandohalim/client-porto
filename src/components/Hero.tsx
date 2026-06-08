"use client";

import { motion, Variants } from "framer-motion";
import Reveal from "@/utilities/Reveal";

export default function Hero() {
  const lineVariant: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] },
    },
  };
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

      <motion.h1
        className="font-serif font-light tracking-tight leading-[1.06] text-[clamp(2.6rem,7vw,5.6rem)] mt-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.14, delayChildren: 0.1 },
          },
        }}
      >
        <motion.span className="block" variants={lineVariant}>
          I build software that{" "}
          <span className="relative inline-block">
            <em className="italic text-accent font-normal">respects</em>
            <motion.span
              className="absolute left-0 -bottom-1 h-0.5 w-full origin-left bg-accent/60"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.75,
                duration: 0.6,
                ease: [0.2, 0.7, 0.2, 1],
              }}
            />
          </span>{" "}
          its
        </motion.span>
        <motion.span className="block" variants={lineVariant}>
          users — in <em className="italic font-normal">speed</em> and in{" "}
          <em className="italic font-normal">detail.</em>
        </motion.span>
      </motion.h1>

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

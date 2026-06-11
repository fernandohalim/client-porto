"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Chars } from "@/utilities/TextReveal";
import Marquee from "@/utilities/Marquee";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const stretch = useTransform(scrollYProgress, [0, 1], ["125%", "65%"]);
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-24 overflow-hidden"
    >
      {/* metadata strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-5 md:px-8 flex items-center justify-between mono-label text-smoke"
      >
        <span>Portfolio — Vol. 02</span>
        <span className="hidden sm:block">
          Fullstack · Interface Engineering
        </span>
        <span>Jakarta, ID — 6.2°S 106.8°E</span>
      </motion.div>

      {/* the name */}
      <motion.div
        style={{ y: drift, opacity: fade }}
        className="px-2 md:px-5 select-none"
      >
        <motion.h1
          style={{ fontStretch: stretch }}
          className="display text-ink text-[clamp(3.4rem,16.5vw,16rem)]"
        >
          <span className="block">
            <Chars text="FERNANDO" stagger={0.045} delay={0.1} />
          </span>
          <span className="block text-right">
            <Chars text="HALIM" stagger={0.05} delay={0.45} />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1.1,
                type: "spring",
                stiffness: 300,
                damping: 18,
              }}
              className="inline-block align-top text-accent text-[0.35em] ml-2 mt-[0.18em]"
            >
              ®
            </motion.span>
          </span>
        </motion.h1>
      </motion.div>

      {/* statement + status */}
      <div>
        <div className="px-5 md:px-8 pb-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 text-smoke leading-relaxed max-w-[46ch] text-[15px]"
          >
            I direct and build interfaces. By day — real-time fraud detection
            for banks at <span className="text-ink">PT Rintis Sejahtera</span>.
            After hours — self-produced products like{" "}
            <span className="text-ink">nest.</span> and{" "}
            <span className="text-ink">noted.</span>, where the interaction
            design is the whole point.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-3 mono-label text-smoke"
          >
            <span className="flex items-center gap-2 text-ink">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-60 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
              </span>
              Now showing
            </span>
            <span className="block mt-2 leading-relaxed normal-case tracking-normal font-sans text-sm">
              Available for select freelance via WEBin
            </span>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.7 }}
            href="#work"
            data-cursor="↓"
            className="md:col-span-3 md:text-right mono-label text-ink hover:text-accent transition-colors"
          >
            Scroll — Selected Index
          </motion.a>
        </div>

        {/* marquee divider */}
        <Marquee className="border-y border-line py-3">
          {[
            "NEST",
            "NOTED",
            "FRAUD DETECTION SYSTEMS",
            "WEBIN",
            "DESIGN ENGINEERING",
          ].map((t) => (
            <span key={t} className="flex items-center">
              <span className="display text-2xl md:text-3xl text-ink px-6">
                {t}
              </span>
              <span className="w-2 h-2 rounded-full bg-accent" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

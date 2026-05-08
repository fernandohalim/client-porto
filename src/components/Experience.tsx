"use client";

import { motion } from "framer-motion";
import DecryptText from "../utilities/DecryptText";
import Typewriter from "@/utilities/Typewriter";
import BrandIcon, { BrandKey } from "./BrandIcon";

type ExperienceEntry = {
  id: string;
  brand: BrandKey;
  company: string;
  role: string;
  date: string;
  type: string;
  stack: string[];
  points: string[];
  active: boolean;
};

const experiences: ExperienceEntry[] = [
  {
    id: "rintis",
    brand: "rintis",
    company: "PT Rintis Sejahtera",
    role: "java application developer",
    date: "oct 2024 — present",
    type: "full-time",
    stack: ["java", "spring boot", "redis", "oracle sql", "maven"],
    points: [
      "engineer and maintain scalable java-based microservices to process real-time transaction data for the core fraud detection system.",
      "design and execute complex database operations to support massive volumes of financial records.",
      "maintain and constantly developing java-based fraud detection system website for banks.",
    ],
    active: true,
  },
  {
    id: "webin",
    brand: "webin",
    company: "WEBin",
    role: "fullstack web developer",
    date: "feb 2023 — present",
    type: "freelance",
    stack: ["react", "next", "node", "typescript", "go", "flutter"],
    points: [
      "deliver end-to-end custom it solutions for b2b clients, handling everything from system design to frontend deployment.",
      "develop and maintaining various scalable and responsive web applications.",
      "build robust apis for various client needs and providing neat api documentation.",
    ],
    active: true,
  },
  {
    id: "overo",
    brand: "overo",
    company: "PT Overo Digital Global",
    role: "frontend developer",
    date: "aug 2022 — jan 2023",
    type: "hybrid",
    stack: ["react", "tailwind css", "flutter", "getx state management"],
    points: [
      "engineered responsive and client-facing web and mobile application.",
      "developed high-performance cross-platform mobile interfaces.",
      "collaborate with ui/ux team to create various web and mobile interfaces.",
    ],
    active: false,
  },
];

export default function Experience() {
  return (
    <section className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden">
      {/* vertical pinstripe pattern unique to this section */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-125 h-125 bg-green-800/12 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-zinc-800/30 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,rgba(34,197,94,0.04)_60px,rgba(34,197,94,0.04)_61px)] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_0%,transparent_85%)]"></div>
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Typewriter command="tail -f " args="journey.log" />
        </div>

        {/* vertical timeline */}
        <div className="relative">
          {/* the connecting line */}
          <div className="absolute left-6 sm:left-8 top-2 bottom-2 w-px bg-gradient-to-b from-green-500/60 via-zinc-700 to-transparent"></div>

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="relative pl-16 sm:pl-20 group"
              >
                {/* svg brand icon as the timeline anchor */}
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-center group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-500 z-10 p-2.5">
                  <BrandIcon variant={exp.brand} />
                  {exp.active && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.9)] border-2 border-black"></span>
                  )}
                </div>

                {/* card */}
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-green-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)] transition-all duration-500 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-900/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-900/10 transition-colors"></div>

                  <div className="relative z-10">
                    <div className="mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-zinc-100 font-mono tracking-tight mb-1">
                        <DecryptText text={exp.role} />
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="text-green-400 font-mono text-sm">
                          @ {exp.company}
                        </span>
                        <span className="text-zinc-700 hidden sm:inline">
                          •
                        </span>
                        <span className="text-zinc-500 font-mono text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                          {exp.date}
                        </span>
                        <span className="text-zinc-500 font-mono text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono text-zinc-300 bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {exp.points.map((point, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-green-500 font-mono mt-0.5 shrink-0">
                            {">"}
                          </span>
                          <p className="leading-relaxed font-mono text-sm text-zinc-400">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* terminal end-of-log marker */}
            <div className="relative pl-16 sm:pl-20">
              <div className="absolute left-3 sm:left-5 top-2 w-6 h-6 rounded-full border border-zinc-800 bg-black flex items-center justify-center z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
              </div>
              <p className="font-mono text-xs text-zinc-600 pt-1">
                <span className="text-green-500/60">$</span> end of stream.
                listening for new entries...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

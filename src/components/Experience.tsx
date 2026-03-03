"use client";

import { useState } from "react";
import DecryptText from "../utilities/DecryptText";
import Typewriter from "@/utilities/Typewriter";

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);

  const experiences = [
    {
      id: "rintis",
      company: "PT Rintis Sejahtera",
      role: "java application developer",
      date: "oct 2024 - present",
      type: "full-time",
      stack: ["java", "spring boot", "redis", "oracle sql", "maven"],
      points: [
        "engineer and maintain scalable java-based microservices to process real-time transaction data for the core fraud detection system.",
        "design and execute complex database operations to support massive volumes of financial records.",
        "maintain and constantly developing java-based fraud detection system website for banks.",
      ],
    },
    {
      id: "webin",
      company: "WEBin",
      role: "fullstack web developer",
      date: "feb 2023 - present",
      type: "freelance",
      stack: ["react", "next", "node", "typescript", "go", "flutter"],
      points: [
        "deliver end-to-end custom it solutions for b2b clients, handling everything from system design to frontend deployment.",
        "develop and maintaining various scalable and responsive web applications.",
        "build robust apis for various client needs and providing neat api documentation.",
      ],
    },
    {
      id: "overo",
      company: "PT Overo Digital Global",
      role: "frontend developer",
      date: "aug 2022 - jan 2023",
      type: "hybrid",
      stack: ["react", "tailwind css", "flutter", "getx state management"],
      points: [
        "engineered responsive and client-facing web and mobile application.",
        "developed high-performance cross-platform mobile interfaces.",
        "collaborate with ui/ux team to create various web and mobile interfaces.",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden"
    >
      {/* --- subtle background grid --- */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* grid pattern with a very aggressive radial fade-out mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_0%,transparent_70%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Typewriter command="tail -f " args="journey.log" />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* left panel - directory navigation */}
          <div className="w-full md:w-1/3 flex flex-row md:flex-col overflow-x-auto no-scrollbar border-b md:border-b-0 md:border-l border-zinc-800">
            {experiences.map((exp, index) => (
              <button
                key={exp.id}
                onClick={() => setActiveIndex(index)}
                className={`text-left px-6 py-4 font-mono text-sm whitespace-nowrap transition-all border-b-2 md:border-b-0 md:border-l-2 -mb-0.5 md:-ml-0.5 ${
                  activeIndex === index
                    ? "border-green-500 bg-green-500/10 text-green-400 backdrop-blur-xs"
                    : "border-transparent hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {activeIndex === index ? "> " : "  "}
                {exp.company}
              </button>
            ))}
          </div>

          {/* right panel - output display */}
          <div className="w-full md:w-2/3 min-h-80">
            <div
              key={activeIndex}
              className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-xs relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {/* subtle background glow that changes slightly based on the index to feel dynamic */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-900/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-900/10 transition-colors"></div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-zinc-100 font-mono tracking-tight mb-2">
                  <DecryptText text={experiences[activeIndex].role} />
                </h3>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-green-400 font-mono text-sm">
                    @ {experiences[activeIndex].company}
                  </span>
                  <span className="text-zinc-700 hidden sm:inline">•</span>
                  <span className="text-zinc-500 font-mono text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                    {experiences[activeIndex].date}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                    {experiences[activeIndex].type}
                  </span>
                </div>

                <div className="mb-8 flex flex-wrap gap-2">
                  {experiences[activeIndex].stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono text-zinc-300 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 text-zinc-400 text-sm md:text-base font-light">
                  {experiences[activeIndex].points.map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-green-500 font-mono mt-0.5">
                        {">"}
                      </span>
                      <p className="leading-relaxed font-mono">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

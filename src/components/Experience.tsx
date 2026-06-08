"use client";

import Reveal from "@/utilities/Reveal";
import Image from "next/image";

type ExperienceEntry = {
  id: string;
  logo: string;
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
    logo: "/logos/rintis.png",
    company: "PT Rintis Sejahtera",
    role: "Java Application Developer",
    date: "Oct 2024 — Present",
    type: "Full-time",
    stack: ["Java", "Spring Boot", "Redis", "Oracle SQL", "Maven"],
    points: [
      "Engineer and maintain scalable Java microservices processing real-time transaction data for the core fraud detection system.",
      "Design and execute complex database operations supporting massive volumes of financial records.",
      "Continuously develop the Java-based fraud detection platform used by banks.",
    ],
    active: true,
  },
  {
    id: "webin",
    logo: "/logos/webin.png",
    company: "WEBin",
    role: "Fullstack Web Developer",
    date: "Feb 2023 — Present",
    type: "Freelance",
    stack: ["React", "Next.js", "Node", "TypeScript", "Go", "Flutter"],
    points: [
      "Deliver end-to-end custom solutions for B2B clients, from system design to frontend deployment.",
      "Develop and maintain scalable, responsive web applications.",
      "Build robust APIs with clean, well-documented interfaces.",
    ],
    active: true,
  },
  {
    id: "overo",
    logo: "/logos/overo.png",
    company: "PT Overo Digital Global",
    role: "Frontend Developer",
    date: "Aug 2022 — Jan 2023",
    type: "Hybrid",
    stack: ["React", "Tailwind CSS", "Flutter", "GetX"],
    points: [
      "Engineered responsive, client-facing web and mobile applications.",
      "Developed high-performance cross-platform mobile interfaces.",
      "Collaborated with the UI/UX team across web and mobile surfaces.",
    ],
    active: false,
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="max-w-5xl mx-auto px-6 py-28 scroll-mt-24"
    >
      <Reveal>
        <h2 className="font-serif font-light tracking-tight text-[clamp(2rem,4.5vw,3.2rem)] mb-14">
          Where I&apos;ve <em className="italic">worked</em>
        </h2>
      </Reveal>

      <div className="relative">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-line" />

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 0.08}>
              <div className="relative pl-20">
                {/* node */}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-xl border border-line bg-surface flex items-center justify-center p-2 overflow-hidden">
                  <Image
                    src={exp.logo}
                    alt={exp.company}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* card */}
                <div className="rounded-2xl border border-line bg-surface p-7 transition-all duration-500 hover:border-line-2 hover:shadow-[0_30px_60px_-40px_rgba(34,32,28,0.35)]">
                  <h3 className="font-serif text-2xl mb-2">{exp.role}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
                    <span className="text-accent text-sm">{exp.company}</span>
                    <span className="text-faint">·</span>
                    <span className="text-xs text-ink-2 border border-line rounded-full px-2.5 py-0.5">
                      {exp.date}
                    </span>
                    <span className="text-xs text-ink-2 border border-line rounded-full px-2.5 py-0.5">
                      {exp.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {exp.stack.map((t) => (
                      <span
                        key={t}
                        className="text-[12px] text-ink-2 border border-line rounded-full px-2.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2.5">
                    {exp.points.map((p, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-sm text-ink-2 leading-relaxed"
                      >
                        <span className="text-accent mt-1 shrink-0">↳</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

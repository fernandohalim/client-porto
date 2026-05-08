"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Typewriter from "@/utilities/Typewriter";
import DecryptText from "../utilities/DecryptText";
import BrandIcon, { BrandKey } from "./BrandIcon";

export default function Projects() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCaseStudyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimating(true);

    setTimeout(() => {
      document.documentElement.classList.remove("scroll-smooth");

      const layout = document.getElementById("global-layout");
      if (layout) {
        layout.style.transition = "none";
        layout.style.backgroundColor = "#fdfbf7";
      }

      window.scrollTo(0, 0);
      router.push("/projects/nest", { scroll: false });

      setTimeout(() => {
        document.documentElement.classList.add("scroll-smooth");
      }, 500);
    }, 500);
  };

  const featuredProjects: Array<{
    id: string;
    brand: BrandKey;
    title: string;
    subtitle: string;
    date: string;
    description: string;
    tech: string[];
    liveLink: string;
    repoLink: string;
  }> = [
    {
      id: "nest",
      brand: "nest",
      title: "nest_group_splitbill_app",
      subtitle: "split expenses, keep the peace",
      date: "v1.2.3",
      description:
        "a beautifully bouncy, modern web app designed to eliminate spreadsheet math. built with a highly interactive ui and an advanced ai engine that optically reads your receipts so you don't have to type a thing.",
      tech: [
        "next.js 16",
        "react 19",
        "tailwind v4",
        "supabase",
        "zustand",
        "gemini 2.5 flash",
      ],
      liveLink: "https://nest-splitbill-app.vercel.app",
      repoLink: "https://nest-splitbill-app.vercel.app/changelog",
    },
  ];

  const clientProjects: Array<{
    brand: BrandKey;
    title: string;
    client: string;
    date: string;
    description: string;
    tech: string[];
    status: "live" | "inactive";
    accent: string;
  }> = [
    {
      brand: "maju-jaya",
      title: "company_profile_website",
      client: "PT Maju Jaya Arkananta",
      date: "jul 2024 — aug 2024",
      description: "catalogue api and product management.",
      tech: ["express", "node"],
      status: "live",
      accent: "#c79a4a",
    },
    {
      brand: "company-x-finance",
      title: "financial_record_app",
      client: "Company X",
      date: "jun 2024 — jul 2024",
      description:
        "chart of account web-based app, multi-layer user management and auto-generated financial recap.",
      tech: ["react", "tailwind css", "express", "node"],
      status: "live",
      accent: "#71717a",
    },
    {
      brand: "company-x-erp",
      title: "web_based_erp",
      client: "Company X",
      date: "feb 2024 — may 2024",
      description:
        "responsive design and clean user interface web for inventory, transaction and project management.",
      tech: ["react", "node", "material ui"],
      status: "live",
      accent: "#71717a",
    },
    {
      brand: "rawa-belong",
      title: "community_catalogue",
      client: "Rawa Belong Community",
      date: "aug 2023 — nov 2023",
      description:
        "responsive design and clean user interface web for flower shop community catalogue.",
      tech: ["react", "flutter", "node", "webview"],
      status: "inactive",
      accent: "#22c55e",
    },
    {
      brand: "leseen",
      title: "company_profile_website",
      client: "LeSeen Electronics",
      date: "feb 2023 — mar 2023",
      description:
        "responsive design and clean user interface web for videotron company profile and products.",
      tech: ["react", "node", "material ui"],
      status: "inactive",
      accent: "#3b82f6",
    },
  ];

  return (
    <section
      id="projects"
      className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden"
    >
      {/* portal animation overlay */}
      {isAnimating &&
        typeof window !== "undefined" &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#fdfbf7] z-99999 pointer-events-none"
          />,
          document.body,
        )}

      {/* dotted matrix background unique to projects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#52525b_1px,transparent_1px)] bg-size-[28px_28px] opacity-30 mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_0%,transparent_70%)]"></div>
        <div className="absolute top-0 left-1/3 -translate-y-1/2 w-150 h-150 bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 w-125 h-125 bg-zinc-800/40 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.85)_100%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Typewriter command="ls -la " args="/var/www/projects" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FEATURED */}
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] duration-500 transition-all group relative overflow-hidden flex flex-col h-full md:col-span-2"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500"></div>

              <div className="relative z-10 flex flex-col grow">
                {/* header with icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-zinc-950/60 border border-zinc-800 group-hover:border-emerald-500/50 transition-colors p-2 flex items-center justify-center">
                    <BrandIcon variant={project.brand} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-mono text-zinc-100 font-bold group-hover:text-emerald-400 transition-colors break-all">
                        <DecryptText text={project.title} />
                      </h3>
                      <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 shrink-0 whitespace-nowrap">
                        {project.date}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-zinc-500 mt-1">
                      {project.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-zinc-400 font-mono text-sm mb-8 grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono text-emerald-400/80 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20"
                    >
                      [{t}]
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-xs font-mono text-zinc-500">
                      sys.state:{" "}
                      <span className="text-emerald-400/90">running</span>
                    </span>
                  </div>
                  <button
                    onClick={handleCaseStudyClick}
                    className="text-[10px] font-mono text-emerald-500 hover:text-emerald-300 uppercase tracking-wider transition-colors z-50 cursor-pointer"
                  >
                    [view_case_study]
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* CLIENT PROJECTS */}
          {clientProjects.map((project, index) => {
            const isLastOddItem =
              clientProjects.length % 2 !== 0 &&
              index === clientProjects.length - 1;
            const isLive = project.status === "live";

            const accentStyle = {
              "--accent": project.accent,
            } as React.CSSProperties;

            return (
              <div
                key={index}
                style={accentStyle}
                className={`p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-[var(--accent)]/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.07)] duration-500 transition-all group relative overflow-hidden flex flex-col h-full ${
                  isLastOddItem ? "md:col-span-2" : ""
                }`}
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-zinc-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--accent)]/15 transition-colors"></div>

                <div className="relative z-10 flex flex-col grow">
                  {/* header with icon */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-zinc-950/60 border border-zinc-800 group-hover:border-[var(--accent)]/60 transition-colors p-2 flex items-center justify-center">
                      <BrandIcon variant={project.brand} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-mono text-zinc-100 font-bold group-hover:text-zinc-300 transition-colors break-all">
                          <DecryptText text={project.title} />
                        </h3>
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 shrink-0 whitespace-nowrap">
                          {project.date}
                        </span>
                      </div>
                      <p className="font-mono text-sm text-zinc-500 mt-1">
                        @ {project.client}
                      </p>
                    </div>
                  </div>

                  <p className="text-zinc-400 font-mono text-sm mb-8 grow">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-2 py-1 rounded border border-zinc-700/30"
                      >
                        [{t}]
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isLive
                            ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                            : "bg-zinc-600"
                        }`}
                      ></span>
                      <span className="text-xs font-mono text-zinc-500">
                        sys.state:{" "}
                        <span
                          className={
                            isLive ? "text-green-400/90" : "text-zinc-500"
                          }
                        >
                          {isLive ? "running" : "archived"}
                        </span>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                      [client_owned]
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

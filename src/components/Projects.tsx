"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Typewriter from "@/utilities/Typewriter";
import DecryptText from "../utilities/DecryptText";

export default function Projects() {
  const router = useRouter();

  // simplified portal animation state
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCaseStudyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // trigger the fade
    setIsAnimating(true);

    // route exactly when the fade reaches 100% opacity
    setTimeout(() => {
      router.push("/projects/nest");
    }, 600);
  };

  // ... (featuredprojects and clientprojects arrays stay exactly the same here) ...
  const featuredProjects = [
    {
      id: "nest",
      title: "nest. 🐣",
      subtitle: "split expenses, keep the peace 🌱",
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

  const clientProjects = [
    {
      title: "company_profile_website",
      client: "PT Maju Jaya Arkananta",
      date: "jul 2024 - aug 2024",
      description: "catalogue api and product management.",
      tech: ["express", "node"],
      status: "live",
    },
    {
      title: "financial_record_app",
      client: "Company X",
      date: "jun 2024 - jul 2024",
      description:
        "chart of account web-based app, multi-layer user management and auto-generated financial recap.",
      tech: ["react", "tailwind css", "express", "node"],
      status: "live",
    },
    {
      title: "web_based_erp",
      client: "Company X",
      date: "feb 2024 - may 2024",
      description:
        "responsive design and clean user interface web for inventory, transaction and project management.",
      tech: ["react", "node", "material ui"],
      status: "live",
    },
    {
      title: "community_catalogue",
      client: "Rawa Belong Community",
      date: "aug 2023 - nov 2023",
      description:
        "responsive design and clean user interface web for flower shop community catalogue.",
      tech: ["react", "flutter", "node", "webview"],
      status: "inactive",
    },
    {
      title: "company_profile_website",
      client: "LeSeen Electronics",
      date: "feb 2023 - mar 2023",
      description:
        "responsive design and clean user interface web for videotron company profile and products.",
      tech: ["react", "node", "material ui"],
      status: "inactive",
    },
  ];

  return (
    <section
      id="projects"
      className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden"
    >
      {/* THE GLOBAL PORTAL FADE OVERLAY */}
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

      {/* --- portfolio blended background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 -translate-y-1/2 w-150 h-150 bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 w-125 h-125 bg-zinc-800/40 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.8)_100%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Typewriter command="ls -la " args="/var/www/projects" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. RENDER FEATURED PROJECTS */}
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] duration-500 transition-all group relative overflow-hidden flex flex-col h-full md:col-span-2"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500"></div>

              <div className="relative z-10 flex flex-col grow">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3
                    className="text-2xl md:text-3xl font-black text-zinc-100 group-hover:text-emerald-400 transition-colors break-all tracking-tight"
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  >
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 shrink-0 whitespace-nowrap">
                    {project.date}
                  </span>
                </div>

                <p
                  className="font-black text-sm text-emerald-500/70 mb-4"
                  style={{ fontFamily: "'Geist', sans-serif" }}
                >
                  {project.subtitle}
                </p>

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
                  <div className="flex gap-4">
                    {/* TRIGGER ANIMATION ON THIS BUTTON */}
                    <button
                      onClick={handleCaseStudyClick}
                      className="text-[10px] font-mono text-emerald-500 hover:text-emerald-300 uppercase tracking-wider transition-colors z-50 cursor-pointer"
                    >
                      [view_case_study]
                    </button>
                    <a
                      href={project.repoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 uppercase tracking-wider transition-colors"
                    >
                      [changelog]
                    </a>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono text-emerald-500/70 hover:text-emerald-400 uppercase tracking-wider transition-colors"
                    >
                      [open_app]
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 2. RENDER CLIENT PROJECTS */}
          {clientProjects.map((project, index) => {
            const isLastOddItem =
              clientProjects.length % 2 !== 0 &&
              index === clientProjects.length - 1;
            const isLive = project.status === "live";

            return (
              <div
                key={index}
                className={`p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-zinc-600 hover:shadow-[0_0_30px_rgba(255,255,255,0.07)] duration-500 transition-all group relative overflow-hidden flex flex-col h-full ${
                  isLastOddItem ? "md:col-span-2" : ""
                }`}
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-zinc-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-zinc-500/20 transition-colors"></div>

                <div className="relative z-10 flex flex-col grow">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-lg font-mono text-zinc-100 font-bold group-hover:text-zinc-300 transition-colors break-all">
                      <DecryptText text={project.title} />
                    </h3>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 shrink-0 whitespace-nowrap">
                      {project.date}
                    </span>
                  </div>

                  <p className="font-mono text-sm text-zinc-500 mb-4">
                    @ {project.client}
                  </p>

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

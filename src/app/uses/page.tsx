"use client";

import Link from "next/link";
import Typewriter from "@/utilities/Typewriter";
import DecryptText from "@/utilities/DecryptText";
import FadeUp from "@/utilities/FadeUp";

export default function Uses() {
  return (
    <main className="min-h-screen bg-black relative flex flex-col selection:bg-green-500/30">
      {/* crt & grid background pattern */}

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* aggressive inward-fading diagonal grid */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#4f4f4f2e_0,#4f4f4f2e_1px,transparent_1px,transparent_32px),repeating-linear-gradient(-45deg,#4f4f4f2e_0,#4f4f4f2e_1px,transparent_1px,transparent_32px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_0%,transparent_80%)]"></div>

        {/* subtle zinc glows for depth */}
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-75 md:w-125 h-75 md:h-125 bg-zinc-800/10 rounded-full blur-[100px] md:blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-62.5 md:w-100 h-62.5 md:h-100 bg-zinc-900/30 rounded-full blur-[100px] md:blur-[120px]"></div>

        {/* crt scanlines overlay */}
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px]"></div>

        {/* fisheye vignette shadow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.9)_100%)]"></div>
      </div>

      {/* main content */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10 w-full grow">
        {/* navigation back to home */}
        <div className="mb-4">
          <FadeUp delay={0.1}>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-mono text-sm text-zinc-500 hover:text-green-400 transition-colors"
            >
              <span className="text-zinc-700 group-hover:text-green-500/50 transition-colors">
                cd
              </span>
              ../home
            </Link>
          </FadeUp>
        </div>

        {/* page header */}
        <div className="mb-16">
          <FadeUp delay={0.2}>
            <Typewriter command="cat " args="inventory.sys" speed={40} />
            <h1 className="mt-6 text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500">
              hardware & <br className="md:hidden" />
              <DecryptText text="software_stack." />
            </h1>
            <p className="text-zinc-400 font-mono text-sm md:text-base leading-relaxed max-w-2xl lowercase">
              a detailed breakdown of my daily drivers. from custom pc builds to
              the architecture powering high-volume database operations.
            </p>
          </FadeUp>
        </div>

        {/* bento box grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* workstation rig (spans 2 columns on desktop) */}
          <div className="md:col-span-2">
            <FadeUp delay={0.3} className="h-full">
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all group relative overflow-hidden backdrop-blur-xs flex flex-col h-full">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-900/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-900/10 transition-colors"></div>
                <h3 className="text-xl font-mono text-zinc-100 font-bold mb-2">
                  workstation.hw
                </h3>
                <p className="font-mono text-xs text-green-500/70 mb-6">
                  /dev/system/core
                </p>
                <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6 grow">
                  i run a custom-built pc to handle heavy compilation and local
                  database environments. it is powered by an{" "}
                  <span className="text-zinc-200">amd ryzen 5 5600</span> paired
                  with an <span className="text-zinc-200">rx 6600 xt</span>,
                  which gives me all the raw processing power i need for java
                  spring boot microservices and running dockerized testing
                  setups.
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-3 py-1.5 rounded border border-zinc-700/30">
                    [ryzen_5_5600]
                  </span>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-3 py-1.5 rounded border border-zinc-700/30">
                    [rx_6600_xt]
                  </span>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* peripherals */}
          <div className="md:col-span-1">
            <FadeUp delay={0.4} className="h-full">
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all group relative overflow-hidden backdrop-blur-xs flex flex-col h-full">
                <h3 className="text-xl font-mono text-zinc-100 font-bold mb-2">
                  peripherals.io
                </h3>
                <p className="font-mono text-xs text-green-500/70 mb-6">
                  /dev/input
                </p>
                <ul className="text-zinc-400 font-mono text-sm space-y-4 grow">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">{">"}</span>
                    <span>
                      <strong className="text-zinc-200 font-normal">
                        lofree flow2 84-keys
                      </strong>
                      : my main low-profile board.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">{">"}</span>
                    <span>
                      <strong className="text-zinc-200 font-normal">
                        royal kludge rk65
                      </strong>
                      : compact secondary mechanical.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">{">"}</span>
                    <span>
                      <strong className="text-zinc-200 font-normal">
                        razer basilisk
                      </strong>{" "}
                      & dual 27&quot; 2k monitors for massive screen real
                      estate.
                    </span>
                  </li>
                </ul>
              </div>
            </FadeUp>
          </div>

          {/* code & terminal */}
          <div className="md:col-span-1">
            <FadeUp delay={0.5} className="h-full">
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all group relative overflow-hidden backdrop-blur-xs flex flex-col h-full">
                <h3 className="text-xl font-mono text-zinc-100 font-bold mb-2">
                  editor.sh
                </h3>
                <p className="font-mono text-xs text-green-500/70 mb-6">
                  /usr/bin/env
                </p>
                <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6 grow">
                  i split my workflow strictly by domain.{" "}
                  <span className="text-zinc-200">intellij idea</span> handles
                  all the heavy lifting for java, while{" "}
                  <span className="text-zinc-200">vscode</span> is my go-to for
                  react and next.js. for system ops, i live in cmd and native
                  linux terminals.
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-3 py-1.5 rounded border border-zinc-700/30">
                    [intellij_idea]
                  </span>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-3 py-1.5 rounded border border-zinc-700/30">
                    [vscode]
                  </span>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/30 px-3 py-1.5 rounded border border-zinc-700/30">
                    [linux_tty]
                  </span>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* database tools (spans 2 columns) */}
          <div className="md:col-span-2">
            <FadeUp delay={0.6} className="h-full">
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all group relative overflow-hidden backdrop-blur-xs flex flex-col h-full">
                <h3 className="text-xl font-mono text-zinc-100 font-bold mb-2">
                  database.sql
                </h3>
                <p className="font-mono text-xs text-green-500/70 mb-6">
                  /var/lib/data
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-zinc-400 font-mono text-sm grow">
                  <div>
                    <p className="text-zinc-200 mb-3 border-b border-zinc-800 pb-2">
                      datagrip
                    </p>
                    <p className="leading-relaxed">
                      my primary database gui. excellent for managing general
                      schemas, running complex queries, and inspecting large
                      data sets efficiently.
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-200 mb-3 border-b border-zinc-800 pb-2">
                      pl/sql developer
                    </p>
                    <p className="leading-relaxed">
                      the specialized tool. i use this strictly for developing
                      oracle triggers, packages, and managing massive
                      transaction batches.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </main>
  );
}

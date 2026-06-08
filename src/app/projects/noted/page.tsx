"use client";

import { motion, Variants, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// noted. — case study page
// dark, monospace, terminal-flavoured. brand-matched to the actual app
// (#0a0a0a / #141414 / #262626 / #888 / accent #d97757, Geist Mono via layout).
// ─────────────────────────────────────────────────────────────────────────────

const APP_URL = "https://noted-dev-app.vercel.app";
const CHANGELOG_URL = `${APP_URL}/changelog`;
const REPO_URL = "https://github.com/fernandohalim/noted";

export default function NotedCaseStudy() {
  // snap to top on mount; restore the global layout bg on unmount so the parent
  // layout can crossfade back to its light theme.
  useEffect(() => {
    document.documentElement.classList.remove("scroll-smooth");
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.documentElement.classList.add("scroll-smooth");
    }, 100);

    return () => {
      clearTimeout(timer);
      const layout = document.getElementById("global-layout");
      if (layout) {
        layout.style.transition = "";
        layout.style.backgroundColor = "";
      }
    };
  }, []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] pb-32 relative overflow-hidden">
      <ScrollProgress />

      {/* ─── ambient background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-[size:22px_22px] opacity-50" />
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#d97757]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 md:pt-24 relative z-10">
        <BackLink />
        <Hero fadeUp={fadeUp} />
        <StatsRibbon />
        <ArchitectureSection fadeUp={fadeUp} />
        <SyncSection fadeUp={fadeUp} />
        <MergeSection fadeUp={fadeUp} />
        <EditorSection fadeUp={fadeUp} />
        <BugBountySection fadeUp={fadeUp} />
        <PolishSection fadeUp={fadeUp} />
        <TechStackSection fadeUp={fadeUp} />
        <FinalCTA />
      </div>
    </main>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-50 bg-[#d97757]"
    />
  );
}

function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-xs text-[#888] hover:text-[#d97757] mb-12 md:mb-16 transition-colors group border border-[#262626] hover:border-[#d97757]/40 px-3 py-1.5 rounded"
    >
      <span className="group-hover:-translate-x-0.5 transition-transform">
        ←
      </span>
      back to portfolio
    </Link>
  );
}

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest mb-5">
      <span className="text-[#888]">{index}</span>
      <span className="w-8 h-px bg-[#262626]" />
      <span className="text-[#d97757]">{children}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero({ fadeUp }: { fadeUp: Variants }) {
  return (
    <div className="mb-24 md:mb-36 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
      <motion.div
        className="md:col-span-7"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeUp} className="mb-6">
          <div className="w-14 h-14 rounded-lg border border-[#262626] bg-[#0a0a0a] flex items-center justify-center">
            <span className="text-3xl font-bold text-[#d97757]">n.</span>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 mb-6 text-xs"
        >
          <span className="text-[#d97757] uppercase tracking-widest border border-[#262626] px-2 py-1 rounded">
            case study · 2026
          </span>
          <span className="text-[#888]">v2.0.1 · live</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
        >
          how i built <span className="text-[#d97757]">noted.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-base md:text-lg text-[#888] max-w-xl leading-relaxed mb-4"
        >
          a minimalist, <span className="text-[#e5e5e5]">offline-first</span>{" "}
          markdown editor for programmers. notes are cached on-device for
          instant access, sync in the background across every device, and
          reconcile with a real{" "}
          <span className="text-[#e5e5e5]">three-way merge</span> when two edits
          collide.
        </motion.p>

        <motion.p variants={fadeUp} className="text-sm text-[#888]/70 mb-8">
          {"// built so a dropped connection never costs a keystroke."}
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-[#d97757] text-[#0a0a0a] text-sm font-bold rounded hover:bg-[#c66544] transition-colors"
          >
            launch app ↗
          </a>
          <a
            href={CHANGELOG_URL}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 border border-[#262626] text-[#e5e5e5] text-sm rounded hover:border-[#d97757]/40 hover:text-[#d97757] transition-colors"
          >
            changelog
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 border border-[#262626] text-[#e5e5e5] text-sm rounded hover:border-[#888] transition-colors"
          >
            source ↗
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="md:col-span-5"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <EditorMock />
      </motion.div>
    </div>
  );
}

function EditorMock() {
  return (
    <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between h-9 px-3 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d97757]" />
          <span className="text-[#888] text-xs">noted</span>
        </div>
        <span className="text-[#888] text-[11px]">saved</span>
      </div>
      <div className="h-7 px-3 flex items-center border-b border-[#262626] text-[11px] text-[#888]">
        notes / engineering / local-first.md
      </div>
      <div className="p-4 text-[13px] leading-relaxed space-y-1.5">
        <p className="text-[#d97757] font-bold">{"# local-first"}</p>
        <p className="text-[#e5e5e5]">write now, sync later. every edit is</p>
        <p className="text-[#e5e5e5]">durable the moment you type it.</p>
        <p className="text-[#888] italic">
          {"> survives a refresh, a tab close, a tunnel."}
        </p>
        <div className="my-3 rounded border border-[#262626] bg-[#141414] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#262626]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
              <span className="text-[11px] text-[#888]">ts</span>
            </span>
            <span className="text-[11px] text-[#888]">copy</span>
          </div>
          <pre className="px-3 py-2 text-[12px] text-[#a8c08a] whitespace-pre-wrap">
            {`await localPutItem(note)\nvoid flushSync(userId)`}
          </pre>
        </div>
        <p className="text-[#d97757]">
          - [x] <span className="text-[#e5e5e5]">offline queue</span>
        </p>
        <p className="text-[#d97757]">
          - [ ] <span className="text-[#e5e5e5]">ship v2.1</span>
        </p>
      </div>
      <div className="flex items-center gap-3 h-9 px-3 border-t border-[#262626] text-[#888]">
        {["H1", "B", "I", "</>", "•", "“”"].map((t) => (
          <span key={t} className="text-[11px]">
            {t}
          </span>
        ))}
        <span className="ml-auto text-[11px]">find</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS RIBBON
// ─────────────────────────────────────────────────────────────────────────────

function StatsRibbon() {
  const stats = [
    { value: "17", label: "releases" },
    { value: "0", label: "edits lost offline" },
    { value: "3-way", label: "conflict merge" },
    { value: "instant", label: "note switching" },
    { value: "pwa", label: "installable" },
  ];
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="mb-28 md:mb-40"
    >
      <div className="rounded-lg border border-[#262626] bg-[#141414] p-6 md:p-8">
        <div className="text-[11px] text-[#888] uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" /> shipped
          &amp; live
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col"
            >
              <span className="text-3xl md:text-4xl font-bold text-[#e5e5e5] lowercase">
                {s.value}
              </span>
              <span className="text-[11px] text-[#888] uppercase tracking-widest mt-2">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 01 — LOCAL-FIRST ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────

function PathPanel({
  title,
  steps,
  footer,
  accent = false,
}: {
  title: string;
  steps: string[];
  footer: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-6 ${
        accent
          ? "border-[#d97757]/30 bg-[#d97757]/5"
          : "border-[#262626] bg-[#141414]"
      }`}
    >
      <div className="text-[11px] uppercase tracking-widest mb-4 text-[#888]">
        {title}
      </div>
      <ol className="space-y-2.5">
        {steps.map((s, i) => (
          <li key={s} className="flex items-start gap-3 text-sm text-[#e5e5e5]">
            <span className="text-[#d97757] tabular-nums text-xs mt-0.5">
              {`0${i + 1}`}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 pt-3 border-t border-[#262626] text-xs text-[#888]">
        {footer}
      </p>
    </div>
  );
}

function ArchitectureSection({ fadeUp }: { fadeUp: Variants }) {
  const layers = [
    {
      tag: "layer 0",
      name: "in-memory map",
      note: "localPeekItem() — synchronous cache read, zero await, instant render",
    },
    {
      tag: "layer 1",
      name: "IndexedDB (idb)",
      note: "localPutItem() — durable on-device store, survives reload & offline",
    },
    {
      tag: "layer 2",
      name: "Supabase postgres",
      note: "server actions — source of truth, reached only in the background",
    },
  ];
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="mb-28 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
        <SectionLabel index="01">local-first storage</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          the UI never waits for the{" "}
          <span className="text-[#d97757]">network</span>.
        </h2>
        <p className="text-[#888] leading-relaxed">
          every note lives in three places at once: an in-memory map for
          synchronous reads, IndexedDB for durability, and Supabase as the
          source of truth. reads hit memory and render in the same tick; writes
          apply optimistically and reconcile in the background.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3"
      >
        {layers.map((l) => (
          <div
            key={l.name}
            className="rounded-lg border border-[#262626] bg-[#141414] p-5"
          >
            <div className="text-[11px] text-[#888] uppercase tracking-widest mb-2">
              {l.tag}
            </div>
            <div className="text-[#e5e5e5] font-bold mb-2">{l.name}</div>
            <p className="text-xs text-[#888] leading-relaxed">{l.note}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <PathPanel
          title="read path"
          accent
          steps={[
            "component mounts",
            "localPeekItem(id) → memory hit",
            "render — no spinner, no await",
          ]}
          footer="opening a note is fully client-side."
        />
        <PathPanel
          title="write path"
          steps={[
            "edit → optimistic localPutItem()",
            "server action persists to postgres",
            "on failure → queueMutation() for later",
          ]}
          footer="a dropped connection just defers the sync."
        />
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 02 — SYNC ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function SyncSection({ fadeUp }: { fadeUp: Variants }) {
  const triggers = [
    { k: "online", v: "the moment the connection returns" },
    { k: "visibilitychange", v: "when you switch back to the tab" },
    { k: "interval", v: "a quiet poll every 60 seconds" },
  ];
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="mb-28 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
        <SectionLabel index="02">the sync engine</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          push your changes, <span className="text-[#d97757]">pull</span>{" "}
          everyone else&apos;s.
        </h2>
        <p className="text-[#888] leading-relaxed">
          sync is two directions on a loop. a delta pull asks the server only
          for rows newer than the last cursor; a queue push drains mutations
          recorded while offline. both fire on reconnect, on tab focus, and
          every 60 seconds.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"
      >
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-6">
          <div className="text-[11px] text-[#d97757] uppercase tracking-widest mb-3">
            pullDelta()
          </div>
          <p className="text-sm text-[#e5e5e5] leading-relaxed mb-4">
            getItemsSince(lastSyncAt) returns only changed rows. the newest
            updated_at becomes the next cursor — so a sync transfers deltas,
            never the whole tree.
          </p>
          <pre className="text-xs text-[#888] bg-[#0a0a0a] border border-[#262626] rounded p-3 leading-relaxed whitespace-pre-wrap">
            {`since = meta.lastSyncAt\nrows  = getItemsSince(since)\nlocalPutItems(rows)\nmeta.lastSyncAt = max(updated_at)`}
          </pre>
        </div>
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-6">
          <div className="text-[11px] text-[#d97757] uppercase tracking-widest mb-3">
            pushPendingMutations()
          </div>
          <p className="text-sm text-[#e5e5e5] leading-relaxed mb-4">
            every offline create / rename / move / delete / edit is queued in
            IndexedDB with an attempt counter, then replayed in order. failures
            are re-queued, not dropped.
          </p>
          <div className="flex flex-wrap gap-2">
            {["create", "rename", "move", "delete", "update_content"].map(
              (t) => (
                <span
                  key={t}
                  className="text-[11px] text-[#888] border border-[#262626] rounded px-2 py-1"
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-lg border border-[#262626] bg-[#141414] p-6"
      >
        <div className="text-[11px] text-[#888] uppercase tracking-widest mb-4">
          flushSync() runs on
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {triggers.map((t) => (
            <div key={t.k} className="border border-[#262626] rounded p-3">
              <div className="text-sm text-[#d97757] mb-1">{t.k}</div>
              <div className="text-xs text-[#888]">{t.v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 — THREE-WAY MERGE
// ─────────────────────────────────────────────────────────────────────────────

function MergeDoc({
  label,
  lines,
  muted = false,
  highlight,
}: {
  label: string;
  lines: string[];
  muted?: boolean;
  highlight?: number;
}) {
  return (
    <div
      className={`rounded-lg border border-[#262626] p-4 ${
        muted ? "bg-[#0a0a0a]" : "bg-[#141414]"
      }`}
    >
      <div className="text-[11px] uppercase tracking-widest mb-3 text-[#888]">
        {label}
      </div>
      <div className="text-[13px] space-y-1">
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              highlight === i
                ? "text-[#d97757]"
                : muted
                  ? "text-[#888]"
                  : "text-[#e5e5e5]"
            }
          >
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

function MergeSection({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="mb-28 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
        <SectionLabel index="03">three-way merge</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          two devices, one note,{" "}
          <span className="text-[#d97757]">no lost work</span>.
        </h2>
        <p className="text-[#888] leading-relaxed">
          editing the same note in two places used to be an all-or-nothing
          choice. now a diff3 merge finds the lines each side actually changed
          against a shared ancestor. disjoint edits merge silently; genuine
          overlaps open a side-by-side resolver.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3"
      >
        <MergeDoc
          label="base — common ancestor"
          muted
          lines={["# todo", "- ship sync", "- write docs"]}
        />
        <MergeDoc
          label="device A"
          highlight={1}
          lines={["# todo", "- ship sync ✓", "- write docs"]}
        />
        <MergeDoc
          label="device B"
          highlight={3}
          lines={["# todo", "- ship sync", "- write docs", "- record demo"]}
        />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-lg border border-[#d97757]/30 bg-[#d97757]/5 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] text-[#d97757] uppercase tracking-widest">
            merged — clean, no conflict
          </span>
          <span className="text-[11px] text-[#888]">diff3Merge()</span>
        </div>
        <div className="text-sm space-y-1">
          <p className="text-[#e5e5e5]"># todo</p>
          <p className="text-[#a8c08a]">
            - ship sync ✓ <span className="text-[#888]">{"// from A"}</span>
          </p>
          <p className="text-[#e5e5e5]">- write docs</p>
          <p className="text-[#a8c08a]">
            - record demo <span className="text-[#888]">{"// from B"}</span>
          </p>
        </div>
        <p className="mt-4 pt-3 border-t border-[#d97757]/20 text-xs text-[#888]">
          the last server-confirmed version is kept on-device as the merge base
          — giving diff3 a true common ancestor instead of guessing.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-3 rounded-lg border border-[#262626] bg-[#141414] p-6"
      >
        <div className="flex items-start gap-3">
          <span className="text-[#d97757] text-lg shrink-0 leading-none">
            !
          </span>
          <p className="text-sm text-[#888] leading-relaxed">
            when edits truly overlap, the auto-merge steps aside and a
            CodeMirror MergeView opens: your version editable on the left,
            theirs as reference on the right, with revert arrows per region. an
            LCS cost guard collapses pathologically large files to a single
            whole-file conflict so the merge never hangs the tab.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 04 — THE EDITOR (interactive raw/rendered toggle)
// ─────────────────────────────────────────────────────────────────────────────

function RawMd() {
  return (
    <div className="space-y-1 text-[#888]">
      <p>
        <span className="text-[#d97757]">## </span>setup
      </p>
      <p>
        install with <span className="text-[#d97757]">`</span>npm i
        <span className="text-[#d97757]">`</span> then run.
      </p>
      <p>
        it is <span className="text-[#d97757]">**</span>fast
        <span className="text-[#d97757]">**</span> and{" "}
        <span className="text-[#d97757]">*</span>local
        <span className="text-[#d97757]">*</span>.
      </p>
      <p className="text-[#d97757]">{"```ts"}</p>
      <p className="text-[#a8c08a]">const db = openDB()</p>
      <p className="text-[#d97757]">{"```"}</p>
    </div>
  );
}

function RenderedMd() {
  return (
    <div className="space-y-2">
      <p className="text-[#d97757] font-bold text-lg">setup</p>
      <p className="text-[#e5e5e5]">
        install with{" "}
        <code className="text-[#a8c08a] bg-[#141414] px-1.5 py-0.5 rounded border border-[#262626]">
          npm i
        </code>{" "}
        then run.
      </p>
      <p className="text-[#e5e5e5]">
        it is <strong className="text-white font-bold">fast</strong> and{" "}
        <em className="italic text-white">local</em>.
      </p>
      <div className="rounded border border-[#262626] bg-[#141414] overflow-hidden mt-2">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#262626]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
            <span className="text-[11px] text-[#888]">ts</span>
          </span>
          <span className="text-[11px] text-[#888]">copy</span>
        </div>
        <pre className="px-3 py-2 text-[12px] text-[#a8c08a]">
          const db = openDB()
        </pre>
      </div>
    </div>
  );
}

function EditorSection({ fadeUp }: { fadeUp: Variants }) {
  const [view, setView] = useState<"rendered" | "raw">("rendered");
  const features = [
    {
      t: "smart enter",
      d: "continues lists and preserves indentation; an empty list item exits the list.",
    },
    {
      t: "smart tab",
      d: "indents a selection, or jumps to the next tab stop mid-line.",
    },
    {
      t: "pinned toolbar",
      d: "formatting + find/replace sit above the mobile keyboard, iOS included.",
    },
  ];
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="mb-28 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
        <SectionLabel index="04">the editor</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          markdown that{" "}
          <span className="text-[#d97757]">renders as you type</span>.
        </h2>
        <p className="text-[#888] leading-relaxed">
          a CodeMirror 6 core with a custom decoration layer. formatting marks
          conceal themselves unless your cursor is on them; fenced code blocks
          become styled cards with a language header and a copy button — all
          without leaving a plain-text document.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="inline-flex border border-[#262626] rounded p-1 mb-4">
          {(["rendered", "raw"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-xs rounded transition-colors ${
                view === v
                  ? "bg-[#d97757] text-[#0a0a0a] font-bold"
                  : "text-[#888] hover:text-[#e5e5e5]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] overflow-hidden">
          <div className="h-7 px-3 flex items-center border-b border-[#262626] text-[11px] text-[#888]">
            notes / readme.md
          </div>
          <div className="p-5 text-[13px] leading-relaxed min-h-[220px]">
            {view === "raw" ? <RawMd /> : <RenderedMd />}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3"
      >
        {features.map((f) => (
          <div
            key={f.t}
            className="rounded-lg border border-[#262626] bg-[#141414] p-5"
          >
            <div className="text-[#e5e5e5] font-bold text-sm mb-1.5">{f.t}</div>
            <p className="text-xs text-[#888] leading-relaxed">{f.d}</p>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 05 — ENGINEERING NOTES (interactive)
// ─────────────────────────────────────────────────────────────────────────────

const NOTES = [
  {
    id: "E1",
    title: "never lose an edit",
    before: "save only on editor blur",
    after: "debounced local persist (400ms)\n+ flush on unmount",
    body: "blur-only saving lost edits when a note was closed or the tab killed mid-type. now every keystroke is persisted on-device within 400ms, and unmounting the editor flushes a final write to the server — recording a conflict for next open if it races.",
  },
  {
    id: "E2",
    title: "optimistic concurrency",
    before: "update overwrites unconditionally",
    after: 'compare expectedUpdatedAt\n→ return "conflict"',
    body: "saves now send the updated_at the client loaded with. if the server's row moved on, the write is rejected as a conflict instead of clobbering another device's work — which is what kicks off the three-way merge.",
  },
  {
    id: "E3",
    title: "a true common ancestor",
    before: "merge guessed the base",
    after: "snapshot last server-confirmed\ncontent as the merge base",
    body: "diff3 is only correct with a real ancestor. the last server-confirmed version of each file is snapshotted as the base — and the pull step skips files with a pending local edit so their base stays the genuine common ancestor.",
  },
  {
    id: "E4",
    title: "service worker vs server actions",
    before: "SW intercepted every GET",
    after: "bypass Next-Action / RSC\n/ Router-State-Tree",
    body: "a network-first service worker happily intercepted Next.js server actions and RSC payloads, breaking mutations on the offline-then-online path. the fetch handler now detects those headers and steps aside, caching only real navigations and assets.",
  },
  {
    id: "E5",
    title: "the LCS cost guard",
    before: "diff3 over any file size",
    after: "degrade to whole-file conflict\nabove a cost limit",
    body: "the LCS behind diff3 is O(n·m). two large notes could lock the tab computing a merge nobody wanted. a size guard short-circuits to a single whole-file conflict above a threshold, keeping the editor responsive.",
  },
  {
    id: "E6",
    title: "the mobile keyboard",
    before: "toolbar hid behind the keyboard",
    after: "size app to visualViewport\nheight (--app-vh)",
    body: "interactive-widget hints are ignored on iOS, so the formatting toolbar vanished behind the soft keyboard. tracking visualViewport height and sizing the app to the visible area lands the toolbar just above the keyboard on every platform.",
  },
];

function BugBountySection({ fadeUp }: { fadeUp: Variants }) {
  const [active, setActive] = useState(0);
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="mb-28 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
        <SectionLabel index="05">engineering notes</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          six fixes from the <span className="text-[#d97757]">git log</span>.
        </h2>
        <p className="text-[#888] leading-relaxed">
          the unglamorous work that makes offline-first actually trustworthy.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-12 gap-3"
      >
        <div className="lg:col-span-4 space-y-2">
          {NOTES.map((n, i) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setActive(i)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded border transition-colors ${
                active === i
                  ? "bg-[#141414] border-[#d97757]/40"
                  : "bg-[#0a0a0a] border-[#262626] hover:border-[#888]/40"
              }`}
            >
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  active === i
                    ? "bg-[#d97757] text-[#0a0a0a]"
                    : "bg-[#141414] text-[#888]"
                }`}
              >
                {n.id}
              </span>
              <span
                className={`text-sm flex-1 truncate ${
                  active === i ? "text-[#e5e5e5]" : "text-[#888]"
                }`}
              >
                {n.title}
              </span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 rounded-lg border border-[#262626] bg-[#141414] p-6">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-bold bg-[#d97757] text-[#0a0a0a] px-2 py-0.5 rounded">
                {NOTES[active].id}
              </span>
              <h4 className="text-lg font-bold text-[#e5e5e5]">
                {NOTES[active].title}
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="rounded border border-[#262626] bg-[#0a0a0a] p-3">
                <div className="text-[11px] text-[#888] uppercase tracking-widest mb-2">
                  before
                </div>
                <pre className="text-xs text-[#888] whitespace-pre-wrap leading-relaxed">
                  {NOTES[active].before}
                </pre>
              </div>
              <div className="rounded border border-[#d97757]/30 bg-[#d97757]/5 p-3">
                <div className="text-[11px] text-[#d97757] uppercase tracking-widest mb-2">
                  after
                </div>
                <pre className="text-xs text-[#a8c08a] whitespace-pre-wrap leading-relaxed">
                  {NOTES[active].after}
                </pre>
              </div>
            </div>
            <p className="text-sm text-[#888] leading-relaxed">
              {NOTES[active].body}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

const POLISH = [
  {
    t: "view-only sharing",
    d: `publish any note as a read-only link; a per-device "viewed" list tracks notes you don't own.`,
  },
  {
    t: "export to pdf / png",
    d: "a real layout dialog — font, page size, orientation, margins, background, render quality.",
  },
  {
    t: "folder export as zip",
    d: "walk a subtree and stream it to a .zip with paths intact, fully client-side.",
  },
  {
    t: "collapsible code blocks",
    d: "fenced blocks fold to a one-line card with language + copy, and reopen on cursor enter.",
  },
  {
    t: "honest offline state",
    d: "a live online indicator and a queued-save badge — never a fake progress bar.",
  },
  {
    t: "drag-to-move tree",
    d: "drag nodes between folders, guarded against moving a folder into its own descendant.",
  },
  {
    t: "keyboard-first",
    d: "a (?) shortcut palette, plus create / rename / save / find bindings throughout.",
  },
  {
    t: "import .txt",
    d: "drop plain-text files straight into any folder and they become notes.",
  },
];

function PolishSection({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="mb-28 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
        <SectionLabel index="06">the details</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          eight things you only notice{" "}
          <span className="text-[#d97757]">when they&apos;re missing</span>.
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {POLISH.map((p) => (
          <motion.div
            key={p.t}
            variants={fadeUp}
            className="rounded-lg border border-[#262626] bg-[#141414] p-5 hover:border-[#d97757]/30 transition-colors"
          >
            <div className="text-[#e5e5e5] font-bold text-sm mb-2">{p.t}</div>
            <p className="text-xs text-[#888] leading-relaxed">{p.d}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

const TECH = [
  { name: "Next.js 16", role: "app router · server actions · middleware" },
  { name: "React 19", role: "client islands · concurrent UI" },
  { name: "TypeScript", role: "strict everywhere" },
  { name: "Tailwind v4", role: "design tokens · arbitrary values" },
  { name: "Supabase", role: "postgres · auth · SSR sessions" },
  { name: "CodeMirror 6", role: "editor · merge view · markdown" },
  { name: "IndexedDB (idb)", role: "local-first cache & queue" },
  { name: "jsPDF + html2canvas", role: "pdf / png export" },
  { name: "JSZip", role: "folder → zip export" },
  { name: "lucide-react", role: "icon set" },
  { name: "PWA / service worker", role: "installable · offline shell" },
  { name: "Framer Motion", role: "section reveals" },
];
function TechStackSection({ fadeUp }: { fadeUp: Variants }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="mb-28 md:mb-40"
    >
      <motion.div variants={fadeUp} className="mb-10 max-w-3xl">
        <SectionLabel index="07">the stack</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          chosen for <span className="text-[#d97757]">offline-first</span>, not
          novelty.
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TECH.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            className="rounded-lg border border-[#262626] bg-[#141414] p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
              <span className="text-[#e5e5e5] font-bold text-sm">{t.name}</span>
            </div>
            <p className="text-xs text-[#888] pl-3.5">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function FinalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="rounded-lg border border-[#262626] bg-[#141414] p-8 md:p-14 relative overflow-hidden">
        <div
          className="absolute -top-24 right-0 w-72 h-72 bg-[#d97757]/10 blur-[100px] rounded-full"
          aria-hidden
        />
        <div className="relative">
          <div className="text-[11px] text-[#888] uppercase tracking-widest mb-4">
            08 · ship it
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
            notes for programmers,{" "}
            <span className="text-[#d97757]">everywhere</span>.
          </h2>
          <p className="text-[#888] max-w-xl leading-relaxed mb-8">
            noted is live, free, installable, and works on a plane. open it,
            write something, then kill your wifi — it keeps up.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href={APP_URL}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#d97757] text-[#0a0a0a] text-sm font-bold rounded hover:bg-[#c66544] transition-colors"
            >
              launch noted ↗
            </a>
            <a
              href={CHANGELOG_URL}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 border border-[#262626] text-[#e5e5e5] text-sm rounded hover:border-[#d97757]/40 hover:text-[#d97757] transition-colors"
            >
              read the changelog
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 border border-[#262626] text-[#e5e5e5] text-sm rounded hover:border-[#888] transition-colors"
            >
              source on github ↗
            </a>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-6 border-t border-[#262626] text-[11px] text-[#888] uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" /> shipped
              v2.0.1
            </span>
            <span>fernando halim · 2026</span>
            <span className="text-[#888]/60">built local-first</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

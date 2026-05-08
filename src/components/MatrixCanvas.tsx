"use client";

import { useEffect, useRef } from "react";

// matrix rain effect using canvas — code-symbol mix per user spec.
// uses requestAnimationFrame and respects reduced-motion.
export default function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // mix of code symbols + digits + lowercase letters
    const chars =
      "01234567890123456789{}[]()<>/\\;:=+-*&|!?#@$%^~abcdefghijklmnopqrstuvwxyz";

    let drops: number[] = [];
    let columns = 0;
    const fontSize = 14;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      columns = Math.floor(rect.width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -50);
    };
    resize();
    window.addEventListener("resize", resize);

    let animationId = 0;
    let lastFrame = 0;
    const fpsInterval = 1000 / 24; // throttle to ~24fps for that vintage monitor feel

    const draw = (now: number) => {
      animationId = requestAnimationFrame(draw);
      const elapsed = now - lastFrame;
      if (elapsed < fpsInterval) return;
      lastFrame = now - (elapsed % fpsInterval);

      const rect = canvas.getBoundingClientRect();
      // semi-transparent black overlay for trail fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.font = `${fontSize}px ui-monospace, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // brighter head of trail, dimmer tail
        const isHead = Math.random() > 0.95;
        ctx.fillStyle = isHead
          ? "rgba(220, 252, 231, 0.95)"
          : "rgba(34, 197, 94, 0.65)";
        ctx.fillText(text, x, y);

        if (y > rect.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(draw);
    } else {
      // static fallback for reduced-motion users
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = "rgba(34, 197, 94, 0.4)";
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < 4; j++) {
          ctx.fillText(
            chars[Math.floor(Math.random() * chars.length)],
            i * fontSize,
            (j + 1) * fontSize * 4,
          );
        }
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.08)] hover:shadow-[0_0_60px_rgba(34,197,94,0.15)] transition-shadow duration-700 group">
      {/* monitor chrome — top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-1.5 bg-zinc-950/80 backdrop-blur border-b border-zinc-900">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/80" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <span className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
          /dev/null &gt; /matrix.feed
        </span>
        <span className="text-[10px] font-mono text-green-500/80 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
          live
        </span>
      </div>

      {/* canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* scanlines overlay */}
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.6)_50%)] bg-size-[100%_3px] pointer-events-none" />

      {/* fisheye vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* corner brackets */}
      <div className="absolute inset-2 pointer-events-none">
        <div className="absolute top-6 left-0 w-3 h-3 border-t border-l border-green-500/40" />
        <div className="absolute top-6 right-0 w-3 h-3 border-t border-r border-green-500/40" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-green-500/40" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/40" />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";

type Frame = "phone" | "browser";

type Props = {
  tintBg: string;
  glyph: string;
  glyphColor: string;
  shots?: string[];
  alt?: string;
  size?: "featured" | "card";
  frame?: Frame;
};

function Phone({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div
      className={`absolute bottom-0 transition-[translate] duration-700 ease-out ${className}`}
    >
      <div className="relative rounded-[1rem] bg-stone-800 p-[5px] shadow-2xl shadow-stone-900/35 ring-1 ring-white/10">
        {/* side buttons */}
        <span className="absolute left-[-2px] top-[20%] h-6 w-[3px] rounded-l-sm bg-stone-600" />
        <span className="absolute left-[-2px] top-[31%] h-9 w-[3px] rounded-l-sm bg-stone-600" />
        <span className="absolute right-[-2px] top-[26%] h-11 w-[3px] rounded-r-sm bg-stone-600" />

        {/* screen */}
        <div className="relative rounded-[0.7rem] overflow-hidden bg-white">
          <Image
            src={src}
            alt={alt}
            width={156}
            height={338}
            className="block w-full h-auto"
          />
          {/* glass glare */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/15" />
        </div>
      </div>
    </div>
  );
}

function Browser({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div
      className={`absolute bottom-0 rounded-t-xl bg-stone-900 overflow-hidden shadow-2xl shadow-stone-900/30 transition-[translate] duration-700 ease-out ${className}`}
    >
      <div className="flex items-center gap-1.5 h-7 px-3 bg-stone-800">
        <span className="w-2 h-2 rounded-full bg-red-400/70" />
        <span className="w-2 h-2 rounded-full bg-amber-400/70" />
        <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 h-3 flex-1 max-w-[55%] rounded-full bg-stone-700/60" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={640}
        height={400}
        className="w-full h-auto"
      />
    </div>
  );
}

export default function ProjectPreview({
  tintBg,
  glyph,
  glyphColor,
  shots = [],
  alt = "",
  size = "card",
  frame = "browser",
}: Props) {
  const featured = size === "featured";

  const renderFrames = () => {
    if (shots.length === 0) {
      return (
        <span
          className={`absolute inset-0 flex items-center justify-center font-serif italic opacity-50 transition-transform duration-700 group-hover:scale-110 ${
            featured ? "text-[6rem]" : "text-5xl"
          }`}
          style={{ color: glyphColor }}
        >
          {glyph}
        </span>
      );
    }

    if (frame === "phone") {
      if (shots.length === 1) {
        return (
          <Phone
            src={shots[0]}
            alt={alt}
            className={`${featured ? "w-[160px]" : "w-[120px]"} rotate-[-4deg] translate-y-[14%] group-hover:translate-y-[7%] z-10`}
          />
        );
      }
      return (
        <>
          <Phone
            src={shots[1]}
            alt={alt}
            className={`${featured ? "w-[150px]" : "w-[112px]"} -rotate-[10deg] -translate-x-[42%] translate-y-[20%] group-hover:translate-y-[14%] opacity-95`}
          />
          <Phone
            src={shots[0]}
            alt={alt}
            className={`${featured ? "w-[160px]" : "w-[120px]"} rotate-[6deg] translate-x-[24%] translate-y-[14%] group-hover:translate-y-[7%] z-10`}
          />
        </>
      );
    }

    // browser (desktop)
    if (shots.length === 1) {
      return (
        <Browser
          src={shots[0]}
          alt={alt}
          className={`${featured ? "w-[82%]" : "w-[88%]"} rotate-[-1deg] translate-y-[20%] group-hover:translate-y-[12%] z-10`}
        />
      );
    }
    return (
      <>
        <Browser
          src={shots[1]}
          alt={alt}
          className={`${featured ? "w-[64%]" : "w-[70%]"} -rotate-[3deg] -translate-x-[26%] translate-y-[30%] group-hover:translate-y-[24%] opacity-90`}
        />
        <Browser
          src={shots[0]}
          alt={alt}
          className={`${featured ? "w-[78%]" : "w-[84%]"} rotate-[2deg] translate-x-[16%] translate-y-[18%] group-hover:translate-y-[10%] z-10`}
        />
      </>
    );
  };

  return (
    <div
      className={`relative overflow-hidden flex items-end justify-center ${
        featured ? "min-h-[300px] h-full" : "rounded-xl aspect-[16/9] mb-6"
      }`}
      style={{ background: tintBg }}
    >
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(34,32,28,0.10)_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* depth + life behind the phone mockups (nest featured card) */}
      {frame === "phone" && shots.length > 0 && (
        <>
          <div
            className="absolute -top-10 -left-12 w-56 h-56 rounded-full bg-[#5f8a5a]/30 blur-3xl animate-pulse"
            style={{ animationDuration: "6s" }}
            aria-hidden
          />
          <div
            className="absolute -bottom-16 -right-10 w-60 h-60 rounded-full bg-[#7fb89a]/25 blur-3xl animate-pulse"
            style={{ animationDuration: "8s", animationDelay: "1s" }}
            aria-hidden
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#5f8a5a]/15"
            aria-hidden
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-[#5f8a5a]/20"
            aria-hidden
          />
          <span
            className="absolute top-8 right-10 w-1.5 h-1.5 rounded-full bg-[#bd6a4a]/60 animate-pulse"
            style={{ animationDuration: "3s" }}
            aria-hidden
          />
          <span
            className="absolute bottom-12 left-12 w-1 h-1 rounded-full bg-[#5f8a5a]/70 animate-pulse"
            style={{ animationDuration: "4s", animationDelay: "0.6s" }}
            aria-hidden
          />
        </>
      )}

      {renderFrames()}
    </div>
  );
}

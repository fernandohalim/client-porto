"use client";

import Image from "next/image";
import {
  type CSSProperties,
  Fragment,
  type PointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "@/lib/layout";
import { lineIn, lineOut, MORPH_TIMING, morphFrames, wipe } from "@/lib/morph";

export type StripItem = {
  title: string;
  image: string;
  blurb: string;
  stack: string[];
  year: string;
  status?: string;
  href?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

// the same on the card and in the opened view, so both use one cached file
const PICTURE_SIZES = "(min-width: 768px) 90vh, 100vw";

const nextFrames = () =>
  new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

const setScrollRestoration = (mode: ScrollRestoration) => {
  window.history.scrollRestoration = mode;
};

// The slats are real buttons and the opened view is a native modal dialog, so
// focus is held inside it, Esc closes it, and focus comes back to the slat.
export default function Strip({ items, label }: { items: StripItem[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const pointer = useRef({ x: -1, y: -1 });
  const dialog = useRef<HTMLDialogElement>(null);
  const picture = useRef<HTMLDivElement>(null);
  const motion = useRef<Animation[]>([]);
  const swap = useRef<Animation[]>([]);
  const openedAt = useRef(0);
  const closing = useRef(false);
  const stepping = useRef(false);
  const inHistory = useRef(false);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const titleId = useId();
  const item = items[index];

  const cardPicture = (i: number) =>
    triggers.current[i]?.querySelector<HTMLElement>(".slat-media") ?? null;

  // The picture should be ready before it moves. It's normally cached from its
  // card; a slow one simply doesn't hold the morph up.
  const pictureReady = (patience = 250) => {
    const img = picture.current?.querySelector("img");
    if (!img) return Promise.resolve();
    return Promise.race([
      img.decode().catch(() => {}),
      new Promise((r) => setTimeout(r, patience)),
    ]);
  };

  const stopMotion = () => {
    motion.current.forEach((a) => a.cancel());
    motion.current = [];
  };

  const stopSwap = () => {
    swap.current.forEach((a) => a.cancel());
    swap.current = [];
  };

  const swapLines = () => [
    ...(dialog.current?.querySelectorAll<HTMLElement>("[data-swap]") ?? []),
  ];

  // held on their first frame until play(), so nothing shows before they start
  const linesIn = (forward: boolean, delay = 0) =>
    swapLines().map((el, n) => {
      const line = el.animate(lineIn(forward), {
        duration: 750,
        delay: delay + Math.min(n * 32, 260),
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "backwards",
      });
      line.pause();
      return line;
    });

  const open = async (i: number) => {
    const view = dialog.current;
    const pic = picture.current;
    if (!view || !pic) return;
    stopMotion();
    stopSwap();
    openedAt.current = i;
    flushSync(() => setIndex(i));
    view.showModal();
    view.scrollTop = 0;

    // An open project is a step in history, so Back closes it instead of leaving the
    // site. Manual restoration stops the browser jumping the page to where it was
    // when the view opened, since Previous and Next may have moved it since.
    setScrollRestoration("manual");
    window.history.pushState(null, "");
    inHistory.current = true;

    // the neighbours' pictures, for Previous and Next
    triggers.current.forEach((trigger) => {
      const img = trigger?.querySelector("img");
      if (img) img.loading = "eager";
    });

    const card = cardPicture(i);
    if (prefersReducedMotion() || !card) return;

    // held on the card's exact frame while the picture gets ready
    const frames = morphFrames(card, pic);
    const run = [view.animate(frames.view, MORPH_TIMING), pic.animate(frames.picture, MORPH_TIMING)];
    run.forEach((a) => a.pause());
    motion.current = run;
    const lines = linesIn(true, 500);
    swap.current = lines;
    await pictureReady();
    if (motion.current !== run) return;
    lines.forEach((a) => a.play());
    // They stay in place on their last frame until the view closes. Removing them on
    // landing makes the browser repaint the whole view, which shows as a blink.
    run.forEach((a) => a.play());
  };

  const close = async () => {
    const view = dialog.current;
    const pic = picture.current;
    if (!view || !pic || closing.current) return;
    closing.current = true;
    stopSwap();
    stepping.current = false;

    // Previous and Next leave the page alone, so it only moves now, to the card this
    // has to land on, and the parallax gets a moment to catch up before it's measured
    if (index !== openedAt.current) {
      triggers.current[index]?.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "instant",
      });
      if (!prefersReducedMotion()) await nextFrames();
    }

    const card = cardPicture(index);
    if (prefersReducedMotion() || !card) {
      view.close();
      return;
    }

    let run = motion.current;
    if (run.length && run[0].playState !== "finished") {
      run.forEach((a) => a.reverse()); // still opening: turn around from where it is
    } else {
      stopMotion();
      const frames = morphFrames(card, pic);
      const back = { ...MORPH_TIMING, duration: 750, direction: "reverse" as const };
      run = [view.animate(frames.view, back), pic.animate(frames.picture, back)];
      motion.current = run;
    }
    await run[0].finished.catch(() => {});
    if (motion.current === run) view.close();
  };

  const onClose = () => {
    stopMotion();
    stopSwap();
    closing.current = false;
    // closed from inside the view, so the step it added comes off again
    if (inHistory.current) window.history.back();
    // Previous and Next may have moved on, so return to the project now showing
    triggers.current[index]?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const onPopState = () => {
      if (!inHistory.current) return;
      inHistory.current = false;
      setScrollRestoration("auto");
      if (dialog.current?.open) close();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  });

  const step = async (by: number) => {
    const pic = picture.current;
    if (stepping.current || closing.current || !pic) return;
    const next = (index + by + items.length) % items.length;
    const forward = by > 0;
    if (prefersReducedMotion()) {
      setIndex(next);
      return;
    }

    stepping.current = true;
    // the opening's last frame is what's on screen, so ending it early costs nothing
    motion.current.forEach((a) => a.finish());
    const frames = wipe(forward);
    // from wherever the picture is now, in case the last one is still arriving
    const from = { clipPath: getComputedStyle(pic).clipPath };
    const leaving = pic.animate([from, frames.out[1]], {
      duration: 320,
      easing: "cubic-bezier(0.7, 0, 0.84, 0)",
      fill: "forwards",
    });
    const words = swapLines().map((el, n) =>
      el.animate(lineOut(forward), {
        duration: 260,
        delay: Math.min(n * 10, 60),
        easing: "cubic-bezier(0.7, 0, 0.84, 0)",
        fill: "forwards",
      }),
    );
    const out = [leaving, ...words];
    swap.current = [...swap.current, ...out];
    const left = await Promise.all(out.map((a) => a.finished)).then(
      () => true,
      () => false,
    );
    if (!left) return; // closed in the meantime

    flushSync(() => setIndex(next));
    // Everything below up to the await happens before the browser paints, and the new
    // words wait out of sight until the new picture is ready to go with them.
    const lines = linesIn(forward);
    swap.current.forEach((a) => {
      if (a !== leaving) a.cancel();
    });
    swap.current = [leaving, ...lines];
    await pictureReady(600);
    if (!swap.current.includes(leaving)) return; // closed in the meantime

    const arriving = pic.animate(frames.in, {
      duration: 620,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
    leaving.cancel();
    lines.forEach((a) => a.play());
    swap.current = [arriving, ...lines];
    stepping.current = false;
  };

  // Only a mouse that really moved opens a slat. When the page scrolls under a
  // resting cursor the browser reports a move at the same spot, and acting on it
  // would ripple the slats open one after another.
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse") return;
    if (e.clientX === pointer.current.x && e.clientY === pointer.current.y) return;
    pointer.current = { x: e.clientX, y: e.clientY };
    const slat = (e.target as Element).closest<HTMLElement>("li[data-index]");
    // the gaps between slats keep the current one open, so crossing them can't flicker
    if (slat) setActive(Number(slat.dataset.index));
  };

  const control = "label cursor-pointer underline underline-offset-4";

  return (
    <>
      <ul
        className="strip"
        style={{ "--count": items.length } as CSSProperties}
        onPointerMove={onPointerMove}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setActive(null);
        }}
      >
        {items.map((it, i) => (
          <li
            key={it.title}
            data-index={i}
            data-open={active === i || undefined}
            className="reveal"
          >
            <h3>
              <button
                ref={(node) => {
                  triggers.current[i] = node;
                }}
                type="button"
                aria-haspopup="dialog"
                onClick={() => open(i)}
                onFocus={(e) => {
                  if (e.currentTarget.matches(":focus-visible")) setActive(i);
                }}
                onBlur={() => setActive((current) => (current === i ? null : current))}
                className="slat"
              >
                <span className="slat-media">
                  <span className="slat-plate">
                    <Image src={it.image} alt="" fill sizes={PICTURE_SIZES} />
                  </span>
                </span>
                <span className="slat-meta label">
                  <span className="slat-name">{it.title}</span>
                  <span>{it.year}</span>
                  <span aria-hidden className="slat-more">
                    {it.stack.join(" · ")}
                  </span>
                </span>
              </button>
            </h3>
            <p className="label mt-1 h-scroll:sr-only">{it.blurb}</p>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="project p-5 h-scroll:px-8 h-scroll:py-6"
        onClose={onClose}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
      >
        <div className="project-rise label flex items-start justify-between">
          <p>
            {label} —{" "}
            <span className="swap-word">
              <span data-swap>{pad(index + 1)}</span>
            </span>{" "}
            / {pad(items.length)}
          </p>
          <button type="button" onClick={close} className={control}>
            Close
          </button>
        </div>

        <div className="flex w-full flex-col items-center gap-8 project-row:flex-row project-row:justify-center project-row:gap-14">
          <div ref={picture} className="project-image flex-none">
            {/* sync: an async decode can paint nothing for a frame when the layer changes */}
            <Image
              src={item.image}
              alt=""
              fill
              sizes={PICTURE_SIZES}
              loading="eager"
              decoding="sync"
            />
          </div>
          <div className="project-copy flex flex-col gap-4">
            <h2 id={titleId} className="display">
              {item.title.split(" ").map((word, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className="swap-word">
                    <span data-swap>{word}</span>
                  </span>
                </Fragment>
              ))}
            </h2>
            <p className="lede swap-mask">
              <span data-swap>{item.blurb}</span>
            </p>
            <p className="label swap-mask">
              <span data-swap>
                {item.stack.join(" · ")} — {item.status ? `${item.status} — ` : ""}
                {item.year}
              </span>
            </p>
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="label swap-mask w-fit"
              >
                <span data-swap className="underline underline-offset-4">
                  Visit site <span aria-hidden>↗</span>
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="project-rise flex justify-between">
          <button type="button" onClick={() => step(-1)} className={control}>
            Previous
          </button>
          <button type="button" onClick={() => step(1)} className={control}>
            Next
          </button>
        </div>

        {/* the page's grain can't reach above a modal, and without its own the
            picture would change brightness the moment the view closes */}
        <div aria-hidden className="grain" />
      </dialog>
    </>
  );
}

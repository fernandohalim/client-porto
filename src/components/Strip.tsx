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
import { HORIZONTAL_QUERY, prefersReducedMotion } from "@/lib/layout";
import {
  COMPACT_CLOSE,
  COMPACT_OPEN,
  lineIn,
  lineOut,
  MORPH_TIMING,
  morphFrames,
  WIPE_IN,
  WIPE_OUT,
  windowAt,
} from "@/lib/morph";

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

// below the horizontal layout each slat is a thin band with its name on the picture
const compact = () => !window.matchMedia(HORIZONTAL_QUERY).matches;

// The slats are real buttons and the opened view is a native modal dialog, so
// focus is held inside it, Esc closes it, and focus comes back to the slat.
export default function Strip({ items, label }: { items: StripItem[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const pointer = useRef({ x: -1, y: -1 });
  const dialog = useRef<HTMLDialogElement>(null);
  const picture = useRef<HTMLDivElement>(null);
  const wipeMask = useRef<HTMLDivElement>(null);
  const wipeInner = useRef<HTMLDivElement>(null);
  const motion = useRef<Animation[]>([]);
  const swap = useRef<Animation[]>([]);
  const openedAt = useRef(0);
  const closing = useRef(false);
  const stepping = useRef(false);
  const inHistory = useRef(false);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const handover = useRef<Animation[]>([]);
  const handedCard = useRef(-1);
  const handedWords = useRef(true);
  const pendingBack = useRef<number | null>(null);
  const handing = useRef(false);
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
        easing: WIPE_IN.easing,
        fill: "backwards",
      });
      line.pause();
      return line;
    });

  // On a phone the name sits on the band's picture, which the view would cover in one
  // frame. So first the words rise away and the blur clears, and the view then grows
  // out of exactly what's left. They stay that way until the view has closed again.
  // On the desktop the words sit below the picture, out of the view's way, so only the
  // blur is held back (`words` false).
  const leaveCard = (i: number, words = true) => {
    const trigger = triggers.current[i];
    if (!trigger) return [];
    const lines = words
      ? [...trigger.querySelectorAll<HTMLElement>(".slat-line")].map((el, n) =>
          el.animate(lineOut(true), {
            duration: 240,
            delay: n * 20,
            easing: WIPE_OUT.easing,
            fill: "forwards",
          }),
        )
      : [];
    const blur = trigger.querySelector<HTMLElement>(".slat-blur");
    const clear = blur
      ? [blur.animate([{ opacity: 0 }], { duration: 260, easing: "ease-out", fill: "forwards" })]
      : [];
    handedCard.current = i;
    handedWords.current = words;
    return [...lines, ...clear];
  };

  // after the view has landed back on the band: the blur returns and the words rise in
  const returnCard = () => {
    const trigger = triggers.current[handedCard.current];
    const left = handover.current;
    handover.current = [];
    handedCard.current = -1;
    if (!trigger || !left.length) return;
    // swapped in the same frame, so nothing shows in between
    left.forEach((a) => a.cancel());
    if (handedWords.current)
      trigger.querySelectorAll<HTMLElement>(".slat-line").forEach((el, n) =>
      el.animate(lineIn(true), {
        duration: 700,
        delay: n * 40,
        easing: WIPE_IN.easing,
        fill: "backwards",
      }),
    );
    trigger
      .querySelector<HTMLElement>(".slat-blur")
      ?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "ease-out" });
  };

  const open = async (i: number) => {
    const view = dialog.current;
    const pic = picture.current;
    if (!view || !pic || handing.current || view.open) return;

    if (compact() && !prefersReducedMotion() && cardPicture(i)) {
      handing.current = true;
      // the view's picture gets ready while the words leave, so nothing waits after
      flushSync(() => setIndex(i));
      const leaving = leaveCard(i);
      handover.current = leaving;
      await Promise.all([
        Promise.all(leaving.map((a) => a.finished)).catch(() => {}),
        pictureReady(400),
      ]);
      handing.current = false;
    }

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
    if (pendingBack.current !== null) {
      // reopened before the last step came off: that step serves this view too
      window.clearTimeout(pendingBack.current);
      pendingBack.current = null;
    } else {
      window.history.pushState(null, "");
    }
    inHistory.current = true;

    // the neighbours' pictures, for Previous and Next
    triggers.current.forEach((trigger) => {
      const img = trigger?.querySelector("img");
      if (img) img.loading = "eager";
    });

    // On the desktop the slat folds back to thin once the view covers everything, out of
    // sight, so closing shrinks the view into the thin slat the strip rests as.
    const fold = () => {
      if (!compact()) setActive(null);
    };

    const card = cardPicture(i);
    if (prefersReducedMotion() || !card) {
      fold();
      return;
    }

    // held on the card's exact frame while the picture gets ready
    const frames = morphFrames(card, pic);
    const timing = handover.current.length ? COMPACT_OPEN : MORPH_TIMING;
    const run = [view.animate(frames.view, timing), pic.animate(frames.picture, timing)];
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
    await run[0].finished.catch(() => {});
    if (motion.current === run) fold();
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

    // Previous and Next may have moved on: the band it lands on is cleared at once,
    // out of sight under the view, and the one it opened from is put back
    if (handover.current.length && handedCard.current !== index) {
      handover.current.forEach((a) => a.cancel());
      handover.current = leaveCard(index);
      handover.current.forEach((a) => a.finish());
    }

    let run = motion.current;
    if (run.length && run[0].playState !== "finished") {
      run.forEach((a) => a.reverse()); // still opening: turn around from where it is
    } else {
      stopMotion();
      // the desktop slat is thin and blurred by now: its blur is held back, out of sight
      // under the view, and comes back once the view has landed
      if (!compact()) {
        handover.current.forEach((a) => a.cancel());
        handover.current = leaveCard(index, false);
        handover.current.forEach((a) => a.finish());
      }
      const frames = morphFrames(card, pic);
      if (handover.current.length) {
        // played forwards from the open view to the slat, so the curve lands as written
        const toBand = (f: Keyframe[]) => [...f].reverse();
        const timing = { ...COMPACT_CLOSE, duration: compact() ? 560 : 700 };
        run = [
          view.animate(toBand(frames.view), timing),
          pic.animate(toBand(frames.picture), timing),
        ];
      } else {
        const back = { ...MORPH_TIMING, duration: 750, direction: "reverse" as const };
        run = [view.animate(frames.view, back), pic.animate(frames.picture, back)];
      }
      motion.current = run;
    }
    await run[0].finished.catch(() => {});
    if (motion.current !== run) return;
    view.close();
    // straight away rather than on the close event, which comes a moment later
    returnCard();
  };

  const onClose = () => {
    stopMotion();
    stopSwap();
    closing.current = false;
    returnCard();
    // Closed from inside the view, so the step it added comes off again. Going back
    // makes Next redraw the whole page, which stalled the landing, so it waits until the
    // slat has settled.
    if (inHistory.current && pendingBack.current === null) {
      pendingBack.current = window.setTimeout(() => {
        pendingBack.current = null;
        // another strip's view opened meanwhile: going back now would close that one
        if (document.querySelector("dialog[open]")) return;
        window.history.back();
      }, 900);
    }
    // Previous and Next may have moved on, so return to the project now showing
    triggers.current[index]?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const onPopState = () => {
      // went back by hand while that step was waiting: it's done, so nothing more to do
      if (pendingBack.current !== null) {
        window.clearTimeout(pendingBack.current);
        pendingBack.current = null;
      }
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

    const mask = wipeMask.current;
    const inner = wipeInner.current;
    if (!mask || !inner) return;

    stepping.current = true;
    // the opening's last frame is what's on screen, so ending it early costs nothing
    motion.current.forEach((a) => a.finish());
    // from wherever the window is now, in case the last picture is still arriving
    const nowMask = { transform: getComputedStyle(mask).transform };
    const nowInner = { transform: getComputedStyle(inner).transform };
    const away = windowAt(forward ? -1 : 1);
    const leaving = [
      mask.animate([nowMask, away.mask], WIPE_OUT),
      inner.animate([nowInner, away.picture], WIPE_OUT),
    ];
    const words = swapLines().map((el, n) =>
      el.animate(lineOut(forward), {
        duration: 280,
        delay: Math.min(n * 10, 60),
        easing: WIPE_OUT.easing,
        fill: "forwards",
      }),
    );
    const out = [...leaving, ...words];
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
      if (!leaving.includes(a)) a.cancel();
    });
    swap.current = [...leaving, ...lines];
    await pictureReady(600);
    if (!swap.current.includes(leaving[0])) return; // closed in the meantime

    const start = windowAt(forward ? 1 : -1);
    const open = windowAt(0);
    const arriving = [
      mask.animate([start.mask, open.mask], WIPE_IN),
      inner.animate([start.picture, open.picture], WIPE_IN),
    ];
    leaving.forEach((a) => a.cancel());
    lines.forEach((a) => a.play());
    swap.current = [...arriving, ...lines];
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
          // the view opening over the strip counts as leaving it; that one is ignored
          if (dialog.current?.open) return;
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
                onBlur={() => {
                  // opening the view takes focus, but its slat stays open underneath so
                  // the view can close back onto it as it was
                  if (dialog.current?.open) return;
                  setActive((current) => (current === i ? null : current));
                }}
                className="slat"
              >
                <span className="slat-media">
                  <span className="slat-plate">
                    {/* the sharp picture stays first: the opening morph reads it */}
                    <Image src={it.image} alt="" fill sizes={PICTURE_SIZES} />
                    {/* a blurred copy over a closed slat, faded rather than un-blurred:
                        animating the blur itself repaints every frame and stutters */}
                    <Image
                      src={it.image}
                      alt=""
                      fill
                      sizes={PICTURE_SIZES}
                      className="slat-blur"
                    />
                  </span>
                </span>
                <span className="slat-meta label">
                  <span className="slat-name">
                    <span className="slat-line">{it.title}</span>
                  </span>
                  <span>
                    <span className="slat-line">{it.year}</span>
                  </span>
                  <span aria-hidden className="slat-more">
                    <span className="slat-line">{it.stack.join(" · ")}</span>
                  </span>
                </span>
              </button>
            </h3>
            <p className="sr-only">{it.blurb}</p>
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
            <div ref={wipeMask} className="project-wipe">
              <div ref={wipeInner} className="project-wipe">
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
            </div>
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

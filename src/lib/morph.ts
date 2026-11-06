// The card opening into the project view, with no fading anywhere. The opened view
// is revealed from the card's own rectangle, and its picture starts exactly where
// the card's picture sits, at the same scale and crop, so the two read as one thing.

export const MORPH_TIMING: KeyframeAnimationOptions = {
  duration: 900,
  easing: "cubic-bezier(0.76, 0, 0.24, 1)",
  fill: "both",
};

// On a phone the band's words leave first, so the click has already been answered and a
// slow start would read as a stall; these get going at once and land without a crawl.
export const COMPACT_OPEN: KeyframeAnimationOptions = {
  duration: 800,
  easing: "cubic-bezier(0.35, 0.05, 0.15, 1)",
  fill: "both",
};

export const COMPACT_CLOSE: KeyframeAnimationOptions = {
  duration: 560,
  // even both ends: a long ease-out tail looked landed well before it finished, and
  // the band's words waited on it
  easing: "cubic-bezier(0.6, 0, 0.4, 1)",
  fill: "both",
};

export function morphFrames(card: HTMLElement, picture: HTMLElement) {
  const plate = card.querySelector<HTMLElement>(".slat-plate")!;
  const img = plate.querySelector("img")!;
  const filter = getComputedStyle(img).filter;
  const C = card.getBoundingClientRect();
  const P = plate.getBoundingClientRect();
  const T = picture.getBoundingClientRect();

  // both boxes crop the same file with object-fit: cover, so compare how much each enlarges it
  const nw = img.naturalWidth || P.width;
  const nh = img.naturalHeight || P.height;
  const cover = (box: DOMRect) => Math.max(box.width / nw, box.height / nh);
  const scale = cover(P) / cover(T);

  const dx = P.left + P.width / 2 - (T.left + T.width / 2);
  const dy = P.top + P.height / 2 - (T.top + T.height / 2);

  // the card's window, in the opened picture's own unscaled coordinates
  const left = T.left + T.width / 2 + dx - (T.width * scale) / 2;
  const top = T.top + T.height / 2 + dy - (T.height * scale) / 2;
  const edge = (px: number) => `${Math.max(0, px / scale).toFixed(2)}px`;
  const crop = [
    edge(C.top - top),
    edge(left + T.width * scale - C.right),
    edge(top + T.height * scale - C.bottom),
    edge(C.left - left),
  ].join(" ");

  return {
    view: [
      {
        clipPath: `inset(${C.top}px ${window.innerWidth - C.right}px ${window.innerHeight - C.bottom}px ${C.left}px)`,
      },
      { clipPath: "inset(0px 0px 0px 0px)" },
    ],
    picture: [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        clipPath: `inset(${crop})`,
        filter: filter === "none" ? "brightness(1)" : filter,
      },
      {
        transform: "translate(0px, 0px) scale(1)",
        clipPath: "inset(0px 0px 0px 0px)",
        filter: "brightness(1)",
      },
    ],
  };
}

// Moving between projects: the picture wipes away and the next wipes in, in the
// direction of travel. A clip-path wipe is drawn on the main thread and stalls whenever
// anything else is busy, so it's a sliding window instead: the mask moves one way and
// the picture inside moves back by the same amount, staying put on screen. Both are
// transforms, which the compositor runs on its own.
//
// `mask` is where the window sits, as a fraction of its width: 0 is fully open, -1 and 1
// are fully away to the left and right.
export const windowAt = (mask: number) => ({
  mask: { transform: `translateX(${mask * 100}%)` },
  picture: { transform: `translateX(${-mask * 100}%)` },
});

// Forward, the picture leaves by its right edge closing in to the left, and the next
// opens from the right; backward is the mirror image.
export const WIPE_OUT = {
  duration: 340,
  // already moving on the first frame, so the click answers at once, then speeding up
  // into the hand-off
  easing: "cubic-bezier(0.45, 0.05, 0.85, 0.45)",
  fill: "forwards" as const,
};

export const WIPE_IN = {
  duration: 680,
  // fast off the hand-off and settled with no long crawl at the end
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

// Moving between projects, the words slide out past the edge of their own masks and
// the next ones slide in from the other side, in the direction of travel. Only a
// transform moves, so the browser can run it without touching layout or paint.
const LINE_HIDDEN = 125; // percent: clear of the mask, including its padding

// one keyframe: it starts from wherever the line is now, even if it's still arriving
export const lineOut = (forward: boolean) => [
  { transform: `translateY(${forward ? -LINE_HIDDEN : LINE_HIDDEN}%)` },
];

export const lineIn = (forward: boolean) => [
  { transform: `translateY(${forward ? LINE_HIDDEN : -LINE_HIDDEN}%)` },
  { transform: "translateY(0%)" },
];

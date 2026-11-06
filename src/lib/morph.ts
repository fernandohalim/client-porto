// The card opening into the project view, with no fading anywhere. The opened view
// is revealed from the card's own rectangle, and its picture starts exactly where
// the card's picture sits, at the same scale and crop, so the two read as one thing.

export const MORPH_TIMING: KeyframeAnimationOptions = {
  duration: 900,
  easing: "cubic-bezier(0.76, 0, 0.24, 1)",
  fill: "both",
};

export function morphFrames(card: HTMLElement, picture: HTMLElement) {
  const plate = card.querySelector<HTMLElement>(".slat-plate")!;
  const img = plate.querySelector("img")!;
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
        filter: getComputedStyle(img).filter === "none" ? "brightness(1)" : getComputedStyle(img).filter,
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
// direction of travel.
export const wipe = (forward: boolean) => ({
  out: [
    { clipPath: "inset(0% 0% 0% 0%)" },
    { clipPath: forward ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" },
  ],
  in: [
    { clipPath: forward ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)" },
  ],
});

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

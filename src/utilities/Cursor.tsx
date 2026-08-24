"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Cursor — rebuilt for the slab theme.
//
// The old cursor belonged to the film register: a fat inverting disc that blew
// up to a 21× loupe over the hero, plus a bone label bubble. This one is quiet.
// It is a hairline ring that reads on any ground, and it has exactly three
// states:
//
//   idle    a 10px hairline ring
//   hot     a small solid dot — anything clickable
//   label   a vermilion chip carrying [data-cursor] text
//
// Plus one structural state, `snap`: elements marked [data-cursor-snap] pull
// the cursor into a hairline frame matching their own bounds, so hovering a
// project card outlines the card instead of floating over it.
//
// Ground independence: the ring and dot composite with mix-blend-difference,
// so they invert against whatever is underneath — white slabs, coal slabs, and
// every case-study theme — with no per-page configuration. The label chip does
// NOT blend; it is vermilion with coal text, which clears AA on both grounds.
//
// The native cursor is only suppressed once this component has mounted and
// confirmed a fine pointer (see the [data-cursor-active] rule in globals.css),
// so a JS failure or a touch device always leaves a real pointer behind.
// ─────────────────────────────────────────────────────────────────────────────

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

type Snap = { x: number; y: number; w: number; h: number; r: number } | null;

const FINE = "(hover: hover) and (pointer: fine)";

// read the pointer capability as an external store rather than syncing it into
// state from an effect — that avoids a cascading render on mount and keeps a
// hybrid device (laptop with a touchscreen) correct when the pointer changes
const subscribeToPointer = (onChange: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export default function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const enabled = useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia(FINE).matches,
    () => false, // SSR: assume coarse, so the native cursor is never taken away
  );

  const [label, setLabel] = useState<string | null>(null);
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snap, setSnap] = useState<Snap>(null);

  const soft = { stiffness: 550, damping: 42, mass: 0.32 };
  const sx = useSpring(x, soft);
  const sy = useSpring(y, soft);

  // snapped geometry gets its own springs so the morph reads as one motion
  const snapX = useSpring(0, { stiffness: 380, damping: 36, mass: 0.5 });
  const snapY = useSpring(0, { stiffness: 380, damping: 36, mass: 0.5 });
  const snapW = useSpring(0, { stiffness: 380, damping: 36, mass: 0.5 });
  const snapH = useSpring(0, { stiffness: 380, damping: 36, mass: 0.5 });

  const last = useRef({ x: -200, y: -200 });
  const snapEl = useRef<HTMLElement | null>(null);

  const readSnap = useCallback((el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const radius = parseFloat(getComputedStyle(el).borderRadius) || 8;
    return { x: r.left, y: r.top, w: r.width, h: r.height, r: radius };
  }, []);

  const evaluate = useCallback(
    (target: Element | null) => {
      if (!target) return;
      const el = target as HTMLElement;

      const tagged = el.closest<HTMLElement>("[data-cursor]");
      const clickable = el.closest<HTMLElement>(
        'a,button,[role="button"],input,select,textarea,summary',
      );
      const snapTarget = el.closest<HTMLElement>("[data-cursor-snap]");

      // a caret belongs to the field, not to us
      const isText = !!el.closest('input,textarea,[contenteditable="true"]');

      setLabel(isText ? null : (tagged?.dataset.cursor ?? null));
      setHot(!isText && (!!clickable || !!tagged));
      setVisible(!isText);

      if (snapTarget && !isText) {
        snapEl.current = snapTarget;
        const g = readSnap(snapTarget);
        snapX.set(g.x);
        snapY.set(g.y);
        snapW.set(g.w);
        snapH.set(g.h);
        setSnap(g);
      } else {
        snapEl.current = null;
        setSnap(null);
      }
    },
    [readSnap, snapX, snapY, snapW, snapH],
  );

  useEffect(() => {
    if (!enabled) return;

    // only now does the native pointer get hidden (globals.css keys off this),
    // so a JS failure or a coarse pointer always leaves a real cursor behind
    document.documentElement.setAttribute("data-cursor-active", "true");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      last.current = { x: e.clientX, y: e.clientY };
      evaluate(e.target as Element);
    };

    // re-evaluate under the stationary pointer — hovering a card and then
    // scrolling must keep the snap frame glued to the card, and leaving the
    // card under the cursor must release it
    let ticking = false;
    const reevaluate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = snapEl.current;
        if (el && el.isConnected) {
          const g = readSnap(el);
          snapX.set(g.x);
          snapY.set(g.y);
          snapW.set(g.w);
          snapH.set(g.h);
        }
        evaluate(document.elementFromPoint(last.current.x, last.current.y));
        ticking = false;
      });
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    const pressDown = () => setDown(true);
    const pressUp = () => setDown(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", reevaluate, { passive: true });
    window.addEventListener("resize", reevaluate);
    window.addEventListener("mousedown", pressDown);
    window.addEventListener("mouseup", pressUp);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", reevaluate);
      window.removeEventListener("resize", reevaluate);
      window.removeEventListener("mousedown", pressDown);
      window.removeEventListener("mouseup", pressUp);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.documentElement.removeAttribute("data-cursor-active");
    };
  }, [enabled, x, y, evaluate, readSnap, snapX, snapY, snapW, snapH]);

  if (!enabled) return null;

  const showRing = !label && !snap;
  const ringScale = down ? 0.72 : hot ? 0.46 : 1;

  return (
    <>
      {/* ── snap frame — hairline outline locked to the hovered element ── */}
      <AnimatePresence>
        {snap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              x: snapX,
              y: snapY,
              width: snapW,
              height: snapH,
              borderRadius: snap.r,
            }}
            className="pointer-events-none fixed left-0 top-0 z-[200] border border-accent"
          />
        )}
      </AnimatePresence>

      {/* ── ring / dot — inverts against any ground ── */}
      <motion.div
        style={{ x: sx, y: sy }}
        animate={{ opacity: visible && showRing ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none fixed left-0 top-0 z-[201] mix-blend-difference"
      >
        <motion.span
          animate={{ scale: ringScale }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className={`block h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white ${
            hot ? "bg-white" : "bg-transparent"
          }`}
        />
      </motion.div>

      {/* ── label chip — vermilion, coal text, no blend ── */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[202]"
      >
        <AnimatePresence>
          {label && visible && (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: down ? 0.92 : 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="mono-label absolute block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-accent px-2.5 py-1.5 text-coal"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

"use client";

import Link from "next/link";
import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";
import { CONTACT, PERSON } from "@/content/portfolio";
import { glideTo } from "@/lib/glide";
import { HORIZONTAL_QUERY } from "@/lib/layout";

const LINKS = [
  { name: "About", id: "about" },
  { name: "Selected work", id: "work" },
  { name: "Stack", id: "stack" },
  { name: "Experience", id: "experience" },
  { name: "Freelance", id: "freelance" },
  { name: "Contact", id: "contact" },
];

const TICKS = Array.from({ length: 30 });

// how tightly the page follows: the rail held, and the rail pressed (the wheel's pace)
const DRAG_RATE = 0.009;
const GLIDE_RATE = 0.0065;

const CORNER_LINKS = [
  { name: "Email", href: `mailto:${PERSON.email}` },
  ...CONTACT.links.filter((l) => l.name === "LinkedIn" || l.name === "GitHub"),
];

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  // where on the marker it was picked up, so it doesn't jump under the pointer
  const grip = useRef<number | null>(null);
  // where the rail sent the page, and how long to wait for it to get there
  const aim = useRef<{ x: number; until: number } | null>(null);
  // on a phone: the bar steps up out of the way while reading down, and back on the way up
  const [barHidden, setBarHidden] = useState(false);
  const barHiddenNow = useRef(false);
  const turnedAt = useRef(0);
  const menu = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const layout = window.matchMedia(HORIZONTAL_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      const horizontal = layout.matches;
      const line = (horizontal ? window.innerWidth : window.innerHeight) * 0.4;
      let current: string | null = null;
      for (const { id } of LINKS) {
        const box = document.getElementById(id)?.getBoundingClientRect();
        if (box && (horizontal ? box.left : box.top) <= line) current = id;
      }
      setActive(current);

      if (!horizontal) {
        // Measured from the furthest point in the current direction, so a slow scroll
        // counts as much as a fast one, and a little jitter doesn't flip it.
        const y = window.scrollY;
        const hide = (value: boolean) => {
          barHiddenNow.current = value;
          setBarHidden(value);
          turnedAt.current = y;
        };
        if (y < 64) hide(false);
        else if (barHiddenNow.current) {
          if (y > turnedAt.current) turnedAt.current = y;
          else if (turnedAt.current - y > 16) hide(false);
        } else {
          if (y < turnedAt.current) turnedAt.current = y;
          else if (y - turnedAt.current > 16) hide(true);
        }
      }

      // While it's held, and while the page is still easing to where it was left, the
      // marker stays where the pointer put it rather than sliding back to the page.
      const range = document.documentElement.scrollWidth - window.innerWidth;
      if (grip.current !== null) return;
      if (aim.current) {
        const arrived = Math.abs(window.scrollX - aim.current.x) <= 1;
        if (!arrived && performance.now() < aim.current.until) return;
        aim.current = null;
      }
      const progress = range > 0 ? window.scrollX / range : 0;
      marker.current?.style.setProperty("--progress", String(progress));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // the wheel takes over from the rail, so the marker goes back to tracking the page
    const letGo = () => {
      aim.current = null;
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", letGo, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", letGo);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // The marker follows the pointer exactly, and the page eases after it. Each pixel of
  // rail is dozens of pixels of page, so moving the page directly would step in jumps.
  const followPointer = (clientX: number, rate: number) => {
    const box = rail.current?.getBoundingClientRect();
    const thumb = marker.current?.offsetWidth ?? 0;
    if (!box || grip.current === null) return;
    const travel = box.width - thumb;
    const progress = Math.max(0, Math.min(1, (clientX - box.left - grip.current) / travel));
    marker.current?.style.setProperty("--progress", String(progress));
    const range = document.documentElement.scrollWidth - window.innerWidth;
    const x = Math.round(progress * range);
    aim.current = { x, until: performance.now() + 1500 };
    glideTo(x, rate);
  };

  const onRailDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !marker.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const thumb = marker.current.getBoundingClientRect();
    const onThumb = e.clientX >= thumb.left && e.clientX <= thumb.right;
    grip.current = onThumb ? e.clientX - thumb.left : thumb.width / 2;
    // pressing the rail itself travels there at the page's usual pace; picking up the
    // marker doesn't move anything yet
    if (!onThumb) followPointer(e.clientX, GLIDE_RATE);
  };

  const onRailMove = (e: PointerEvent<HTMLDivElement>) => {
    if (grip.current !== null) followPointer(e.clientX, DRAG_RATE);
  };

  const onRailUp = (e: PointerEvent<HTMLDivElement>) => {
    grip.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // The phone menu is a modal dialog: focus stays inside, Esc closes it, and focus goes
  // back to the Menu button. It drops in from the top and lifts away again.
  const openMenu = () => {
    const view = menu.current;
    if (!view || view.open) return;
    view.showModal();
    setMenuOpen(true);
  };

  const closeMenu = async () => {
    const view = menu.current;
    if (!view?.open) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await view
        .animate([{ transform: "translateY(-100%)" }], {
          duration: 420,
          easing: "cubic-bezier(0.45, 0.05, 0.85, 0.45)",
          fill: "forwards",
        })
        .finished.catch(() => {});
      view.getAnimations().forEach((a) => a.cancel());
    }
    view.close();
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className="site-header label flex items-center justify-between gap-x-8 px-5 py-4"
        data-hidden={(barHidden && !menuOpen) || undefined}
      >
        <Link href="/" className="brand">
          {PERSON.name}
        </Link>

        {/* Drag the marker, or press anywhere on the rail to go there. Mouse and touch
            only: keyboards and screen readers already have the page's own scrolling. */}
        <div
          aria-hidden
          className="-my-2 hidden cursor-grab touch-none py-2 select-none active:cursor-grabbing lg:block"
          onPointerDown={onRailDown}
          onPointerMove={onRailMove}
          onPointerUp={onRailUp}
          onPointerCancel={onRailUp}
        >
          <div ref={rail} className="relative flex h-4 gap-1.25">
            {TICKS.map((_, i) => (
              <span key={i} className="w-px bg-rule" />
            ))}
            <span
              ref={marker}
              className="absolute -inset-y-0.5 left-0 w-7 border border-fg bg-ground"
              style={{ transform: "translateX(calc(var(--progress, 0) * 146px))" }}
            />
          </div>
        </div>

        <nav aria-label="Sections" className="hidden h-scroll:block">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {LINKS.map((l) => (
              <li key={l.id}>
                {/* plain anchors: Next's Link aligns a section to its nearest
                    edge, which on a sideways page may not be its start */}
                <a
                  href={`/#${l.id}`}
                  aria-current={active === l.id ? "location" : undefined}
                  className="underline-offset-4 hover:underline aria-[current]:underline"
                >
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="h-scroll:hidden"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={openMenu}
        >
          Menu
        </button>
      </header>

      <dialog
        ref={menu}
        aria-label="Menu"
        className="menu"
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClose={() => setMenuOpen(false)}
      >
        <div className="label flex items-center justify-between px-5 py-4">
          <span className="brand">{PERSON.name}</span>
          <button type="button" onClick={closeMenu}>
            Close
          </button>
        </div>

        <nav aria-label="Sections" className="menu-sections">
          <ol>
            {LINKS.map((l, i) => (
              <li key={l.id} className="swap-mask">
                <a
                  href={`/#${l.id}`}
                  aria-current={active === l.id ? "location" : undefined}
                  className="menu-link"
                  style={{ "--i": i } as CSSProperties}
                  // the page moves to the section behind the menu as it lifts away
                  onClick={() => closeMenu()}
                >
                  <span className="label menu-number">{String(i + 1).padStart(2, "0")}</span>
                  {l.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ul className="menu-foot label">
          {CORNER_LINKS.map((l) => (
            <li key={l.name}>
              <a href={l.href} className="link">
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </dialog>

      {/* stepped aside on Contact, which has the same links in full */}
      <div
        className={`label pointer-events-none fixed inset-x-0 bottom-0 z-10 hidden items-end justify-between px-8 py-5 transition-opacity duration-500 h-scroll:flex ${
          active === "contact" ? "opacity-0" : ""
        }`}
        // hidden links can't be clicked or tabbed to either
        inert={active === "contact"}
      >
        <p>
          {PERSON.role}
          <br />
          {PERSON.location}
        </p>
        <ul className="pointer-events-auto text-right">
          {CORNER_LINKS.map((l) => (
            <li key={l.name}>
              <a href={l.href} className="underline-offset-4 hover:underline">
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

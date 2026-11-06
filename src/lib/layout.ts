// The site scrolls sideways only where that stays usable. Narrow or short
// windows, which include phones and a desktop browser zoomed far in, get a
// normal vertical page. Keep this in step with the h-scroll variant in
// globals.css.
export const HORIZONTAL_QUERY = "(min-width: 768px) and (min-height: 600px)";

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

declare module '*.css';

// SmoothScroll publishes its Lenis instance so the menu can hold the page
// still while the sheet is down. Only the two methods the menu calls are
// declared.
interface Window {
  __lenis?: { stop: () => void; start: () => void };
}

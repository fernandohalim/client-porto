// One eased scroll position for the whole page. HorizontalScroll owns the motion and
// registers it here, so anything else that moves the page (the header rail) eases the
// same way instead of jumping.

type Glide = (x: number, rate?: number) => void;

let glide: Glide | null = null;

export const registerGlide = (fn: Glide | null) => {
  glide = fn;
};

/** `rate` is how quickly it closes the gap, per millisecond; higher follows more tightly */
export const glideTo = (x: number, rate?: number) => {
  if (glide) glide(x, rate);
  else window.scrollTo({ left: x, behavior: "instant" });
};

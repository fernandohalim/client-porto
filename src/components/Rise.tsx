import type { CSSProperties } from "react";

// A heading's letters rise into place one after another. Screen readers get the
// plain sentence; the split letters are hidden from them.
export default function Rise({ text }: { text: string }) {
  const words = text.split(" ");
  const starts = words.map((_, i) => words.slice(0, i).join("").length);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="rise">
        {words.map((word, w) => (
          <span key={w}>
            <span className="rise-word">
              {[...word].map((letter, l) => (
                <span
                  key={l}
                  className="rise-letter"
                  style={{ "--i": starts[w] + l } as CSSProperties}
                >
                  {letter}
                </span>
              ))}
            </span>{" "}
          </span>
        ))}
      </span>
    </>
  );
}

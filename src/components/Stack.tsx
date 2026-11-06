"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { STACK, STACK_GROUPS } from "@/content/portfolio";
import Rise from "./Rise";

// One run of a row has to be wider than its window, or the loop shows its seam; short
// groups are repeated until they reach about this many letters.
const MIN_CHARS = 36;

const runFor = (items: string[]) => {
  const chars = items.join("").length + items.length * 3;
  const times = Math.max(1, Math.ceil(MIN_CHARS / chars));
  return { items: Array.from({ length: times }, () => items).flat(), chars: chars * times };
};

// Each group is one slow line of names drifting sideways, the rows turning opposite
// ways. Pointing at a row holds it still and lifts the name under the cursor. The
// rows only drift while the section is on screen.
export default function Stack() {
  const section = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const seen = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <section
      ref={section}
      id="stack"
      className="panel stack"
      data-running={running || undefined}
    >
      <div className="head">
        <h2 data-drift className="display reveal">
          <Rise text="Stack" />
        </h2>
        <p className="reveal lede">{STACK.intro}</p>
      </div>

      <div className="stack-rows reveal">
        {STACK_GROUPS.map((g, i) => {
          const run = runFor(g.items);
          return (
            <div key={g.name} className="stack-row">
              <h3 className="stack-label label">{g.name}</h3>
              <div className="stack-window">
                <div
                  className="stack-track"
                  data-dir={i % 2 ? "right" : "left"}
                  // the same speed on every row, however long its run
                  style={{ "--chars": run.chars } as CSSProperties}
                >
                  {/* the run twice over, so sliding by one run loops without a jump;
                      only the first is read out */}
                  {[0, 1].map((copy) => (
                    <ul key={copy} aria-hidden={copy === 1 || undefined} className="stack-run">
                      {run.items.map((name, k) => (
                        <li
                          key={k}
                          className="stack-name"
                          // repeats exist only to fill the row
                          aria-hidden={(copy === 0 && k >= g.items.length) || undefined}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

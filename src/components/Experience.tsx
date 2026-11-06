"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { EXPERIENCE } from "@/content/portfolio";
import Rise from "./Rise";

// The roles as slim bands stacked one above another, each a dimmed picture with the
// year it began set large inside. Choosing one makes its band taller, so it stands as
// the title of that role, and the details open underneath. The newest starts open;
// choosing the open one again folds it away, so all can be closed.
export default function Experience() {
  const roles = EXPERIENCE.roles;
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <section id="experience" className="panel">
      <div className="head">
        <h2 data-drift className="display reveal">
          <Rise text="Experience" />
        </h2>
        <p className="reveal lede">{EXPERIENCE.intro}</p>
      </div>

      <ol className="xp-bands reveal">
        {roles.map((r, i) => (
          <li key={r.company} className="xp-item" data-open={open === i || undefined}>
            <h3>
              <button
                type="button"
                className="xp-band"
                aria-expanded={open === i}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <Image src={r.image} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" />
                {/* a blurred copy over the picture, faded rather than un-blurred: animating
                    the blur itself repaints every frame and stuttered */}
                <Image
                  src={r.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="xp-blur"
                />
                <span aria-hidden className="xp-year">
                  {r.years.split(" ")[0]}
                </span>
                <span className="xp-band-meta label">
                  <span>{r.role}</span>
                  <span>
                    {r.short} · {r.years}
                  </span>
                </span>
              </button>
            </h3>

            <div id={`${id}-${i}`} className="xp-detail" inert={open !== i}>
              <div className="xp-detail-clip">
                <div className="xp-detail-body">
                  <p className="label swap-mask">
                    <span className="xp-line">
                      <a href={r.linkedin} target="_blank" rel="noreferrer" className="link">
                        {r.company}
                      </a>{" "}
                      · {r.type} · {r.date}
                    </span>
                  </p>
                  <p className="lede swap-mask">
                    <span className="xp-line">{r.summary}</span>
                  </p>
                  <ul className="xp-points">
                    {r.points.map((p) => (
                      <li key={p} className="swap-mask">
                        <span className="xp-line">{p}</span>
                      </li>
                    ))}
                  </ul>
                  {r.projects && (
                    <p className="label swap-mask">
                      <span className="xp-line">Projects from here: {r.projects.join(" · ")}</span>
                    </p>
                  )}
                  <p className="label swap-mask">
                    <span className="xp-line">{r.stack.join(" · ")}</span>
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

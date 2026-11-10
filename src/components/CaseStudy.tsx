import Image from "next/image";
import type { CaseImage, CaseSection, CaseStudy as Study } from "@/content/cases";

const SHAPES = {
  wide: {
    ratio: "16 : 10",
    pixels: "2400 × 1500",
    sizes: "(min-width: 1280px) 1150px, 92vw",
  },
  detail: {
    ratio: "4 : 3",
    pixels: "1600 × 1200",
    sizes: "(min-width: 1280px) 570px, (min-width: 768px) 46vw, 92vw",
  },
};

function Figure({ image, shape }: { image: CaseImage; shape: keyof typeof SHAPES }) {
  const s = SHAPES[shape];
  return (
    <figure className="case-figure">
      <div className="case-frame" data-shape={shape} data-empty={!image.src || undefined}>
        {image.src ? (
          <Image src={image.src} alt={image.alt} fill sizes={s.sizes} />
        ) : (
          // no picture yet: the frame says what fits here
          <p aria-hidden className="label">
            {s.ratio} — {s.pixels}
          </p>
        )}
      </div>
      {image.caption && <figcaption className="label">{image.caption}</figcaption>}
    </figure>
  );
}

function Sections({ sections }: { sections: CaseSection[] }) {
  return (
    <div className="case-sections">
      {sections.map((s) => (
        <section key={s.heading} className="case-section">
          <h4 className="label">{s.heading}</h4>
          <div className="case-body">
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// What sits under an opened project. The long form is read top to bottom with the
// pictures between its sections; the brief sets its three sections side by side.
export default function CaseStudy({
  study,
  title,
  facts,
}: {
  study: Study;
  title: string;
  /** from the project itself: stack, and year or status */
  facts: { label: string; value: string }[];
}) {
  const long = study.kind === "long";
  const [wide, ...pair] = study.images.slice(0, 3);
  // the pair of details sits halfway through the long form
  const before = long ? study.sections.slice(0, 2) : study.sections;
  const after = long ? study.sections.slice(2) : [];
  const name = long ? "Case study" : "About this project";

  return (
    <article className="case" data-kind={study.kind} aria-label={`${title}: ${name.toLowerCase()}`}>
      <header className="case-head">
        <h3 className="label">{name}</h3>
        <dl className="case-facts">
          {[...study.facts, ...facts].map((f) => (
            <div key={f.label}>
              <dt className="label">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {study.lede && <p className="case-lede">{study.lede}</p>}
      {long && wide && <Figure image={wide} shape="wide" />}
      <Sections sections={before} />
      {!long && wide && <Figure image={wide} shape="wide" />}
      {pair.length > 0 && (
        <div className="case-pair">
          {pair.map((image, i) => (
            <Figure key={i} image={image} shape="detail" />
          ))}
        </div>
      )}
      {after.length > 0 && <Sections sections={after} />}
    </article>
  );
}

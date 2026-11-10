// ─────────────────────────────────────────────────────────────────────────────
// Case studies, shown under a project once it's opened (scroll down in the view).
//
// Two shapes share one type:
//   "long"  — Selected work. A lede, four sections, three pictures.
//   "brief" — Freelance. The same three short sections for every client, one picture.
//
// Everything below is placeholder text that says what belongs in its place. To write
// a real one, swap `longCase()` / `briefCase()` in portfolio.ts for an object of the
// same shape, or pass the parts you have: `longCase({ lede: "…", sections: […] })`.
//
// Pictures (all optional; an empty slot draws a labelled frame of the right shape):
//   cover      4:5    1600 × 2000   `image` in portfolio.ts — the slat and the opened view
//   images[0]  16:10  2400 × 1500   the wide shot
//   images[1]  4:3    1600 × 1200   a detail, set beside images[2]
//   images[2]  4:3    1600 × 1200
// Files go in /public; use a new filename when replacing one, since optimized
// images are cached by URL.
// ─────────────────────────────────────────────────────────────────────────────

export type CaseImage = {
  /** leave out to draw the labelled placeholder frame */
  src?: string;
  /** what the picture shows, for screen readers */
  alt: string;
  caption?: string;
};

export type CaseSection = { heading: string; body: string[] };

export type CaseStudy = {
  kind: "long" | "brief";
  /** stack and year or status are added from the project itself */
  facts: { label: string; value: string }[];
  /** the opening paragraph, in larger type; long only */
  lede?: string;
  sections: CaseSection[];
  /** up to three: [0] wide 16:10, then [1] and [2] as a 4:3 pair */
  images: CaseImage[];
};

const TODO = "To fill in";

export const longCase = (parts: Partial<Omit<CaseStudy, "kind">> = {}): CaseStudy => ({
  kind: "long",
  facts: [
    { label: "Role", value: "Design and build, solo" },
    { label: "Timeline", value: TODO },
    { label: "Platform", value: TODO },
  ],
  lede:
    "Placeholder. Open with what this is and who it's for, in two or three sentences: what it does, where it runs, and the one thing that sets it apart from the obvious alternative.",
  sections: [
    {
      heading: "The problem",
      body: [
        "Placeholder. Describe the situation before the project existed. What was annoying, slow or missing, and for whom? A concrete moment works better than a general statement.",
        "Then say why the existing options didn't cover it, and what a good answer would need to do. This is the bar the rest of the page is measured against.",
      ],
    },
    {
      heading: "Approach",
      body: [
        "Placeholder. Lay out the main decisions and what each was chosen over: the stack, the data model, what runs where. One or two real trade-offs are worth more than a list of features.",
        "Mention anything you deliberately left out, and why. Scope that was cut on purpose says as much as what was built.",
      ],
    },
    {
      heading: "The hard part",
      body: [
        "Placeholder. Pick the one problem that took the longest, and walk through it: what went wrong first, what you tried, and what finally held. This is the section people remember.",
        "If there's a number that shows it worked, such as a timing, a size or an error rate, put it here.",
      ],
    },
    {
      heading: "Outcome",
      body: [
        "Placeholder. Where the project stands now: who uses it, what it replaced, what changed for them. Close with what you'd do differently next time.",
      ],
    },
  ],
  images: [
    { alt: "", caption: "Placeholder — the main screen, shown whole" },
    { alt: "", caption: "Placeholder — a detail worth a closer look" },
    { alt: "", caption: "Placeholder — a second detail, or the same screen in another state" },
  ],
  ...parts,
});

export const briefCase = (parts: Partial<Omit<CaseStudy, "kind">> = {}): CaseStudy => ({
  kind: "brief",
  facts: [
    { label: "Role", value: TODO },
    { label: "Scope", value: TODO },
  ],
  sections: [
    {
      heading: "The brief",
      body: [
        "Placeholder. What the client asked for and why they needed it, in two or three sentences.",
      ],
    },
    {
      heading: "What I built",
      body: [
        "Placeholder. What was delivered: the pages or modules, what the client can manage themselves, and anything that had to connect to a system they already had.",
      ],
    },
    {
      heading: "Outcome",
      body: [
        "Placeholder. How it's used today, or why it was retired. One fact is enough.",
      ],
    },
  ],
  images: [{ alt: "", caption: "Placeholder — the site or system, shown whole" }],
  ...parts,
});

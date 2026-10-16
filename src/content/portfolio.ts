// ─────────────────────────────────────────────────────────────────────────────
// Every word and number the portfolio shows, in one place. The plain website
// (/site) and the desert's section cards both read from here, so the two can
// never say different things.
// ─────────────────────────────────────────────────────────────────────────────

export const PERSON = {
  name: "Fernando Halim",
  role: "Fullstack developer",
  location: "West Jakarta, ID",
  email: "fernandohalim26@gmail.com",
  github: "https://github.com/fernandohalim",
};

export const HERO = {
  headline: "Real-time fraud systems by day. Products I own after hours.",
  shipped: "In production: 17 projects shipped",
  availability: "Available for work",
};

/* ── about ──────────────────────────────────────────────────────────────── */

export const ABOUT = {
  lede:
    "I build software at two very different scales — fraud detection for interbank payment networks, and products small enough that I own every decision in them.",
  body:
    "By day I write Java and Spring Boot services that score interbank transactions in real time, where a missed millisecond is a missed transaction. After hours I build and ship my own products end-to-end — data model through easing curve. The first taught me rigor; the second is where the rigor gets a personality.",
  stats: [
    { value: "17", label: "Projects shipped" },
    { value: "8", label: "Clients served" },
    { value: "5", label: "Case studies written" },
    { value: "4", label: "Years building" },
    { value: "22", label: "Technologies in rotation" },
    { value: "3", label: "Roles held" },
  ],
};

/* ── selected work ──────────────────────────────────────────────────────── */

export type Project = {
  title: string;
  /** where each case study will live again (/projects/<slug>) once rebuilt */
  slug: string;
  blurb: string;
  stack: string[];
  year: string;
};

export const WORK = {
  intro:
    "Products I designed, built and shipped on my own — each one documented end to end as a case study.",
  projects: [
    {
      title: "lūme",
      slug: "lume",
      blurb: "Spotify miniplayer that samples cover art for its glow",
      stack: ["Tauri", "Rust"],
      year: "2026",
    },
    {
      title: "nest.",
      slug: "nest",
      blurb: "AI receipt scanning with a group settlement engine",
      stack: ["Next", "Gemini"],
      year: "2026",
    },
    {
      title: "Tempo",
      slug: "tempo",
      blurb: "Desktop clock widget — timer, alarm, stopwatch",
      stack: ["Electron", "React"],
      year: "2026",
    },
    {
      title: "Piggy Wallet",
      slug: "piggy-wallet",
      blurb: "Offline-first expense tracker with a budget system",
      stack: ["Next", "IDB"],
      year: "2026",
    },
    {
      title: "noted.",
      slug: "noted",
      blurb: "Offline-first markdown editor with 3-way merge",
      stack: ["Next", "IDB"],
      year: "2026",
    },
  ] as Project[],
  openSource: {
    title: "Open source",
    blurb: "Pixel-art converters, Go log tooling and the smaller utilities — all on GitHub.",
    cta: "More on GitHub",
  },
};

/* ── stack ──────────────────────────────────────────────────────────────── */

export const STACK_GROUPS = [
  { name: "Languages", items: ["Java", "TypeScript", "Go", "Rust", "Python", "C#"] },
  { name: "Services", items: ["Spring Boot", "Express", "Node"] },
  {
    name: "Interface",
    items: ["Next.js", "Tailwind", "Framer Motion", "Electron", "Flutter", "React Native"],
  },
  { name: "Data", items: ["Oracle SQL", "Redis", "MySQL", "Supabase", "Firebase"] },
  { name: "Workflow", items: ["Git", "Maven"] },
];

export const STACK_TOTAL = STACK_GROUPS.reduce((n, g) => n + g.items.length, 0);

export const STACK = {
  intro: `${STACK_TOTAL} technologies in rotation, grouped by the job they do rather than by how well I know them.`,
};

/* ── experience ─────────────────────────────────────────────────────────── */

export const EXPERIENCE = {
  intro:
    "Three years across a payments processor, a freelance studio and an agency floor — the throughline is shipping things other people depend on.",
  roles: [
    {
      role: "Java Application Developer",
      company: "PT Rintis Sejahtera",
      date: "Oct 2024 — Now",
      type: "Full-time",
      stack: ["Java", "Spring Boot", "Redis", "Oracle"],
      points: [
        "Real-time fraud detection microservices for interbank transaction networks.",
        "Complex database operations across massive volumes of financial records.",
      ],
      active: true,
      linkedin: "https://www.linkedin.com/company/pt-rintis-sejahtera/",
    },
    {
      role: "Fullstack Developer",
      company: "WEBin",
      date: "Feb 2023 — Now",
      type: "Freelance studio",
      stack: ["Next.js", "React", "Node", "Go"],
      points: [
        "End-to-end custom builds for B2B clients — system design through deployment.",
        "Clean, documented APIs and responsive product interfaces.",
      ],
      active: true,
      linkedin: "https://www.linkedin.com/company/91073950",
    },
    {
      role: "Frontend Developer",
      company: "PT Overo Digital Global",
      date: "Aug 2022 — Jan 2023",
      type: "Hybrid",
      stack: ["React", "Tailwind", "Flutter"],
      points: ["Client-facing web and cross-platform mobile interfaces with the UI/UX team."],
      active: false,
      linkedin: "https://www.linkedin.com/company/overo-global-technologies/",
    },
  ],
  why: {
    title: "Why it matters",
    body:
      "The day job runs at a scale I could never simulate alone — millions of transactions, latency budgets in milliseconds, no forgiving path for a bad query. Everything I know about writing software that holds up came from there.",
  },
};

/* ── freelance ──────────────────────────────────────────────────────────── */

export type ClientKind = "live" | "internal" | "prelaunch" | "archived";

export const CLIENT_STATUS: Record<ClientKind, string> = {
  live: "Live",
  internal: "Internal only",
  prelaunch: "Pre-launch",
  archived: "Discontinued",
};

export const FREELANCE = {
  intro:
    "Commissioned work for studios, developers and small businesses — delivered end to end, from system design through deployment.",
  clients: [
    {
      title: "PT Ciputra Development Tbk - The Forestine",
      blurb: "Property marketing site",
      stack: ["Next", "Tailwind"],
      year: "2026",
      kind: "live",
      href: "https://forestine.id",
    },
    {
      title: "Handy and Sharon",
      blurb: "Wedding invitation site with RSVP handling",
      stack: ["Next", "Firestore"],
      year: "2026",
      kind: "live",
      href: "https://handpickedforshar.com",
    },
    {
      title: "Nenggala Academy",
      blurb: "Student portal and marketing site",
      stack: ["Next", "Express"],
      year: "2026",
      kind: "prelaunch",
    },
    {
      title: "PT Maju Jaya Arkananta",
      blurb: "Company profile and catalogue website with CMS",
      stack: ["CRA", "Go"],
      year: "2024",
      kind: "live",
      href: "https://hydraulicpump.co.id",
    },
    {
      title: "PT Jasplast Sukses Bersama",
      blurb: "Internal financial record system",
      stack: ["CRA", "Express"],
      year: "2024",
      kind: "internal",
    },
    {
      title: "PT Argotehnik Kreasindo Abadi",
      blurb: "Web-based operational ERP",
      stack: ["CRA", "Express"],
      year: "2024",
      kind: "internal",
    },
    {
      title: "Rawa Belong Florist Community",
      blurb: "Marketplace mobile application and website",
      stack: ["Flutter", "Express"],
      year: "2023",
      kind: "archived",
    },
    {
      title: "PT Loyalty Development - LeSeen",
      blurb: "Company profile website",
      stack: ["CRA", "Tailwind"],
      year: "2023",
      kind: "archived",
    },
  ] as {
    title: string;
    blurb: string;
    stack: string[];
    year: string;
    kind: ClientKind;
    href?: string;
  }[],
};

/* ── contact ────────────────────────────────────────────────────────────── */

export const CONTACT = {
  heading: "Got something you want built properly?",
  body:
    "A project, a question about the work, or just a hello — the inbox is always open, and replies come on Jakarta hours.",
  links: [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/fernando-halimm" },
    { name: "GitHub", href: "https://github.com/fernandohalim" },
    { name: "WhatsApp", href: "https://wa.me/6289606366647" },
    { name: "Résumé", href: "/fernando_halim_cv.pdf" },
  ],
};

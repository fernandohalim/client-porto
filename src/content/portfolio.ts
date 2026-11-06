// ─────────────────────────────────────────────────────────────────────────────
// Every word and number the portfolio shows, in one place.
// ─────────────────────────────────────────────────────────────────────────────

export const PERSON = {
  name: "Fernando Halim",
  role: "Fullstack developer",
  location: "West Jakarta, ID",
  email: "fernandohalim26@gmail.com",
  github: "https://github.com/fernandohalim",
};

export const HERO = {
  // no-break spaces keep "end to end" on one line
  headline: "Careful software, end to end.",
  availability: "Available for work",
};

/* ── about ──────────────────────────────────────────────────────────────── */

export const ABOUT = {
  lede:
    "I'm Fernando, a fullstack developer in West Jakarta. I've been building software for about four years: for a payments company, for clients, and for myself.",
  body:
    "At work I write Java and Spring Boot services that check interbank transfers for fraud as they happen. They have to be fast, and they can't be wrong. Outside work I take on freelance projects and build my own apps, usually doing all of it myself, from the database to the small animations.",
};

/* ── selected work ──────────────────────────────────────────────────────── */

export type Project = {
  title: string;
  /** where each case study will live again (/projects/<slug>) once rebuilt */
  slug: string;
  /** swap for a real picture when there is one */
  image: string;
  blurb: string;
  stack: string[];
  year: string;
};

export const WORK = {
  intro:
    "Products I designed, built and shipped on my own.",
  projects: [
    {
      title: "lūme",
      image: "/placeholders/work-lume.jpg",
      slug: "lume",
      blurb: "Spotify miniplayer that samples cover art for its glow",
      stack: ["Tauri", "Rust"],
      year: "2026",
    },
    {
      title: "nest.",
      image: "/placeholders/work-nest.jpg",
      slug: "nest",
      blurb: "AI receipt scanning with a group settlement engine",
      stack: ["Next", "Gemini"],
      year: "2026",
    },
    {
      title: "Tempo",
      image: "/placeholders/work-tempo.jpg",
      slug: "tempo",
      blurb: "Desktop clock widget — timer, alarm, stopwatch",
      stack: ["Electron", "React"],
      year: "2026",
    },
    {
      title: "Piggy Wallet",
      image: "/placeholders/work-piggy-wallet.jpg",
      slug: "piggy-wallet",
      blurb: "Offline-first expense tracker with a budget system",
      stack: ["Next", "IDB"],
      year: "2026",
    },
    {
      title: "noted.",
      image: "/placeholders/work-noted.jpg",
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
    items: [
      "Next.js",
      "Tailwind",
      "Framer Motion",
      "Electron",
      "Tauri",
      "Flutter",
      "React Native",
    ],
  },
  { name: "Data", items: ["Oracle SQL", "Redis", "MySQL", "Supabase", "Firebase"] },
  { name: "Workflow", items: ["Git", "Maven"] },
];

export const STACK_TOTAL = STACK_GROUPS.reduce((n, g) => n + g.items.length, 0);

export const STACK = {
  intro: "The tools I use at work and on my own projects, grouped by the job they do.",
};

/* ── experience ─────────────────────────────────────────────────────────── */

export const EXPERIENCE = {
  intro:
    "Four years across a startup, a three-person studio and a national payments network. The studio work carried on after I joined payments.",
  // newest first
  roles: [
    {
      short: "Rintis",
      /** a stand-in behind the band, by choice not a photo of the place */
      image: "/placeholders/xp-rintis.jpg",
      role: "Fullstack Developer",
      focus: "Fraud detection systems",
      company: "PT Rintis Sejahtera",
      date: "Oct 2024 — Now",
      years: "2024 — Now",
      type: "Full-time",
      summary:
        "Rintis runs a national payment network, and every transaction that passes through it has to be checked. I build the fraud detection systems that do the checking.",
      points: [
        "Built the aggregator and fetcher services that collect every transaction going through the network in real time: 400 to 1,000 a second on average, on services built to handle 30,000 to 70,000.",
        "Rebuilt older services in modern Java and Spring Boot.",
        "Worked out the logic for spotting and handling anomalous transaction data.",
        "Helped bring in new engineering standards across the company, built on Spring and Redis.",
      ],
      stack: ["Java", "Spring Boot", "Redis", "Oracle"],
      linkedin: "https://www.linkedin.com/company/pt-rintis-sejahtera/",
    },
    {
      short: "WEBin",
      image: "/placeholders/xp-webin.jpg",
      role: "Fullstack Developer",
      focus: "Client projects, end to end",
      company: "WEBin",
      date: "Feb 2023 — Now",
      years: "2023 — Now",
      type: "Freelance studio",
      summary:
        "A studio of three people, so everyone does a bit of everything. Alongside building, I take part in the decisions with clients and test what we ship.",
      points: [
        "Work on every stage of a project: scoping with the client, system design, frontend, backend, testing and deployment.",
        "Share the product and technical decisions, since there's no one else to hand them to.",
      ],
      /** titles from FREELANCE.clients that came through the studio */
      projects: [
        "Nenggala Academy",
        "PT Maju Jaya Arkananta",
        "Rawa Belong Florist Community",
        "PT Loyalty Development - LeSeen",
      ],
      stack: ["Next.js", "React", "Node", "Go"],
      linkedin: "https://www.linkedin.com/company/91073950",
    },
    {
      short: "Overo",
      image: "/placeholders/xp-overo.jpg",
      role: "Frontend Developer",
      focus: "Web and mobile interfaces",
      company: "PT Overo Digital Global",
      date: "Aug 2022 — Jan 2023",
      years: "2022 — 2023",
      type: "Hybrid",
      summary:
        "My first developer job, on the frontend team of a young startup. We ran several projects at once with not much structure, and I started with no experience, so most of what I took away was skill.",
      points: [
        "Built interfaces for a payroll system and a banking system.",
        "Worked across web in React and Tailwind, and mobile in Flutter, with the UI/UX team.",
      ],
      stack: ["React", "Tailwind", "Flutter"],
      linkedin: "https://www.linkedin.com/company/overo-global-technologies/",
    },
  ] as {
    short: string;
    image: string;
    role: string;
    focus: string;
    company: string;
    date: string;
    years: string;
    type: string;
    summary: string;
    points: string[];
    projects?: string[];
    stack: string[];
    linkedin: string;
  }[],
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
    "Sites and systems I've built for clients, some through a small studio and some on my own. I usually handle all of it, from the database to the deploy.",
  clients: [
    {
      title: "PT Ciputra Development Tbk - The Forestine",
      image: "/placeholders/client-the-forestine.jpg",
      blurb: "Marketing site for a Ciputra residential project",
      stack: ["Next", "Tailwind"],
      year: "2026",
      kind: "live",
      href: "https://forestine.id",
    },
    {
      title: "Handy and Sharon",
      image: "/placeholders/client-handy-and-sharon.jpg",
      blurb: "Wedding invitation site where guests can RSVP",
      stack: ["Next", "Firestore"],
      year: "2026",
      kind: "live",
      href: "https://handpickedforshar.com",
    },
    {
      title: "Nenggala Academy",
      image: "/placeholders/client-nenggala-academy.jpg",
      blurb: "Student portal and marketing site",
      stack: ["Next", "Express"],
      year: "2026",
      kind: "prelaunch",
    },
    {
      title: "PT Maju Jaya Arkananta",
      image: "/placeholders/client-maju-jaya.jpg",
      blurb: "Company profile and product catalogue the client updates themselves",
      stack: ["CRA", "Go"],
      year: "2024",
      kind: "live",
      href: "https://hydraulicpump.co.id",
    },
    {
      title: "PT Jasplast Sukses Bersama",
      image: "/placeholders/client-jasplast.jpg",
      blurb: "Internal system for the company's financial records",
      stack: ["CRA", "Express"],
      year: "2024",
      kind: "internal",
    },
    {
      title: "PT Argotehnik Kreasindo Abadi",
      image: "/placeholders/client-argotehnik.jpg",
      blurb: "ERP the team uses for day-to-day operations",
      stack: ["CRA", "Express"],
      year: "2024",
      kind: "internal",
    },
    {
      title: "Rawa Belong Florist Community",
      image: "/placeholders/client-rawa-belong.jpg",
      blurb: "Marketplace app and website for a florist community",
      stack: ["Flutter", "Express"],
      year: "2023",
      kind: "archived",
    },
    {
      title: "PT Loyalty Development - LeSeen",
      image: "/placeholders/client-leseen.jpg",
      blurb: "Company profile site",
      stack: ["CRA", "Tailwind"],
      year: "2023",
      kind: "archived",
    },
  ] as {
    title: string;
    image: string;
    blurb: string;
    stack: string[];
    year: string;
    kind: ClientKind;
    href?: string;
  }[],
};

/* ── about, in numbers ─────────────────────────────────────────────────── */

// Counted from the lists above, so the numbers stay true as projects come and go.
export const ABOUT_STATS = [
  { value: String(FREELANCE.clients.length), label: "Freelance clients" },
  { value: String(WORK.projects.length), label: "Products of my own" },
  {
    value: String(FREELANCE.clients.filter((c) => c.kind === "live").length),
    label: "Client sites live now",
  },
  { value: "2022", label: "Building since" },
];

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

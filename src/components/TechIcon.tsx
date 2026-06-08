// minimal monoline tech-stack icons, all rendered in the same green palette
// so the skills section reads as a cohesive matrix rather than a sticker board.
// each icon hints at the brand silhouette without copying the official mark.

type TechKey =
  | "java"
  | "spring-boot"
  | "typescript"
  | "javascript"
  | "next"
  | "react"
  | "tailwind"
  | "oracle-sql"
  | "redis"
  | "git"
  | "go"
  | "node"
  | "express"
  | "flutter"
  | "react-native"
  | "mysql"
  | "firebase"
  | "maven";

const SIZE = 28;

const wrap = {
  width: SIZE,
  height: SIZE,
  viewBox: "0 0 28 28",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STROKE = "#22201c";
const STROKE_DIM = "#bd6a4a";

function Java() {
  // coffee cup with steam
  return (
    <svg {...wrap}>
      <path
        d="M9 5 Q9 3 11 4 M13 5 Q13 3 15 4 M17 5 Q17 3 19 4"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
      />
      <path
        d="M7 8 L21 8 L20 19 Q20 22 17 22 L11 22 Q8 22 8 19 Z"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M21 11 Q24 12 24 15 Q24 18 21 18"
        stroke={STROKE}
        strokeWidth="1.4"
      />
    </svg>
  );
}

function SpringBoot() {
  // stylized leaf
  return (
    <svg {...wrap}>
      <path
        d="M5 23 Q5 8 22 5 Q22 18 12 22 Q8 24 5 23 Z"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path d="M9 19 Q14 13 19 11" stroke={STROKE_DIM} strokeWidth="1.2" />
    </svg>
  );
}

function TypeScript() {
  return (
    <svg {...wrap}>
      <rect
        x="3"
        y="3"
        width="22"
        height="22"
        rx="2"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M8 13 L15 13 M11.5 13 L11.5 21"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M16 17 Q16 21 19 21 Q22 21 22 18 Q22 16 19 15 Q16 14 16 12 Q16 9 19 9 Q22 9 22 11"
        stroke={STROKE}
        strokeWidth="1.4"
      />
    </svg>
  );
}

function JavaScript() {
  return (
    <svg {...wrap}>
      <rect
        x="3"
        y="3"
        width="22"
        height="22"
        rx="2"
        stroke={STROKE_DIM}
        strokeWidth="1.4"
      />
      <path
        d="M11 12 L11 19 Q11 21 9 21 Q7 21 7 19"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M21 13 Q21 11 18 11 Q15 11 15 13 Q15 15 18 15.5 Q21 16 21 18 Q21 21 18 21 Q15 21 15 19"
        stroke={STROKE}
        strokeWidth="1.4"
      />
    </svg>
  );
}

function Next() {
  return (
    <svg {...wrap}>
      <circle cx="14" cy="14" r="11" stroke={STROKE} strokeWidth="1.4" />
      <path d="M9 9 L9 19" stroke={STROKE} strokeWidth="1.4" />
      <path d="M9 9 L19 19" stroke={STROKE} strokeWidth="1.4" />
      <path d="M19 9 L19 16" stroke={STROKE} strokeWidth="1.4" />
    </svg>
  );
}

function React() {
  return (
    <svg {...wrap}>
      <circle cx="14" cy="14" r="2" fill={STROKE} />
      <ellipse
        cx="14"
        cy="14"
        rx="11"
        ry="4"
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <ellipse
        cx="14"
        cy="14"
        rx="11"
        ry="4"
        stroke={STROKE}
        strokeWidth="1.2"
        transform="rotate(60 14 14)"
      />
      <ellipse
        cx="14"
        cy="14"
        rx="11"
        ry="4"
        stroke={STROKE}
        strokeWidth="1.2"
        transform="rotate(120 14 14)"
      />
    </svg>
  );
}

function Tailwind() {
  // two flowing waves
  return (
    <svg {...wrap}>
      <path
        d="M3 12 Q7 6 11 9 Q15 12 19 9 Q23 6 25 9"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M3 18 Q7 12 11 15 Q15 18 19 15 Q23 12 25 15"
        stroke={STROKE_DIM}
        strokeWidth="1.4"
      />
    </svg>
  );
}

function OracleSQL() {
  // database cylinder
  return (
    <svg {...wrap}>
      <ellipse cx="14" cy="6" rx="9" ry="3" stroke={STROKE} strokeWidth="1.4" />
      <path
        d="M5 6 L5 22 Q5 25 14 25 Q23 25 23 22 L23 6"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <ellipse
        cx="14"
        cy="13"
        rx="9"
        ry="3"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
      />
      <ellipse
        cx="14"
        cy="20"
        rx="9"
        ry="3"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function Redis() {
  // stacked diamond layers
  return (
    <svg {...wrap}>
      <path d="M14 4 L24 9 L14 14 L4 9 Z" stroke={STROKE} strokeWidth="1.3" />
      <path d="M4 14 L14 19 L24 14" stroke={STROKE_DIM} strokeWidth="1.3" />
      <path d="M4 19 L14 24 L24 19" stroke={STROKE_DIM} strokeWidth="1.3" />
    </svg>
  );
}

function Git() {
  // branch graph
  return (
    <svg {...wrap}>
      <circle cx="7" cy="14" r="2.5" stroke={STROKE} strokeWidth="1.4" />
      <circle cx="21" cy="7" r="2.5" stroke={STROKE} strokeWidth="1.4" />
      <circle cx="21" cy="21" r="2.5" stroke={STROKE} strokeWidth="1.4" />
      <path d="M9 13 Q15 9 19 8" stroke={STROKE_DIM} strokeWidth="1.4" />
      <path d="M9 15 Q15 19 19 20" stroke={STROKE_DIM} strokeWidth="1.4" />
    </svg>
  );
}

function Go() {
  // simplified gopher-ish silhouette
  return (
    <svg {...wrap}>
      <ellipse
        cx="14"
        cy="15"
        rx="9"
        ry="8"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <circle cx="11" cy="13" r="1.4" fill={STROKE} />
      <circle cx="17" cy="13" r="1.4" fill={STROKE} />
      <path d="M11 6 L11 10 M17 6 L17 10" stroke={STROKE} strokeWidth="1.4" />
      <path d="M12 18 L16 18" stroke={STROKE_DIM} strokeWidth="1.2" />
    </svg>
  );
}

function Node() {
  return (
    <svg {...wrap}>
      <path
        d="M14 3 L24 9 L24 19 L14 25 L4 19 L4 9 Z"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M11 11 L11 17 Q11 19 13 19 Q15 19 15 17 L15 11"
        stroke={STROKE}
        strokeWidth="1.3"
      />
      <path
        d="M17 17 Q17 19 19 19 Q21 19 21 17 Q21 15 19 14.5 Q17 14 17 12 Q17 11 19 11"
        stroke={STROKE_DIM}
        strokeWidth="1.3"
      />
    </svg>
  );
}

function Express() {
  // brackets + slash
  return (
    <svg {...wrap}>
      <path d="M8 8 L4 14 L8 20" stroke={STROKE} strokeWidth="1.5" />
      <path d="M20 8 L24 14 L20 20" stroke={STROKE} strokeWidth="1.5" />
      <path d="M16 7 L12 21" stroke={STROKE_DIM} strokeWidth="1.4" />
    </svg>
  );
}

function Flutter() {
  // layered triangles
  return (
    <svg {...wrap}>
      <path d="M16 4 L4 16 L8 20 L20 8 Z" stroke={STROKE} strokeWidth="1.4" />
      <path d="M20 16 L13 23 L20 23 Z" stroke={STROKE_DIM} strokeWidth="1.4" />
    </svg>
  );
}

function ReactNative() {
  return (
    <svg {...wrap}>
      <rect
        x="9"
        y="3"
        width="10"
        height="22"
        rx="2"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <circle cx="14" cy="14" r="1.6" fill={STROKE} />
      <ellipse
        cx="14"
        cy="14"
        rx="6"
        ry="2.5"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
      />
      <ellipse
        cx="14"
        cy="14"
        rx="6"
        ry="2.5"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
        transform="rotate(60 14 14)"
      />
    </svg>
  );
}

function MySQL() {
  // dolphin-ish silhouette
  return (
    <svg {...wrap}>
      <path
        d="M3 18 Q8 11 14 13 Q21 15 24 8 Q23 18 14 22 Q8 24 3 18 Z"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <circle cx="9" cy="17" r="0.8" fill={STROKE_DIM} />
    </svg>
  );
}

function Firebase() {
  // flame
  return (
    <svg {...wrap}>
      <path
        d="M14 3 Q9 9 9 14 Q4 18 8 24 Q14 26 20 24 Q24 18 19 14 Q14 12 14 3 Z"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path d="M12 14 Q14 18 17 16" stroke={STROKE_DIM} strokeWidth="1.3" />
    </svg>
  );
}

function Maven() {
  // feather
  return (
    <svg {...wrap}>
      <path
        d="M5 23 L13 15 Q19 9 23 5 Q23 14 17 19 Q12 23 5 23 Z"
        stroke={STROKE}
        strokeWidth="1.4"
      />
      <path
        d="M9 19 L17 11 M11 21 L19 13"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
      />
    </svg>
  );
}

const REGISTRY: Record<TechKey, React.ComponentType> = {
  java: Java,
  "spring-boot": SpringBoot,
  typescript: TypeScript,
  javascript: JavaScript,
  next: Next,
  react: React,
  tailwind: Tailwind,
  "oracle-sql": OracleSQL,
  redis: Redis,
  git: Git,
  go: Go,
  node: Node,
  express: Express,
  flutter: Flutter,
  "react-native": ReactNative,
  mysql: MySQL,
  firebase: Firebase,
  maven: Maven,
};

export default function TechIcon({ variant }: { variant: TechKey }) {
  const Component = REGISTRY[variant];
  return <Component />;
}

export type { TechKey };

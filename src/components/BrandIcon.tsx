// unified brand iconography for both companies (experience timeline)
// and projects (project cards). every icon is a monoline svg in the
// same green/zinc palette as TechIcon, designed by interpreting the
// real logo into a terminal-friendly geometric abstraction.

type BrandKey =
  | "rintis"
  | "overo"
  | "webin"
  | "maju-jaya"
  | "leseen"
  | "nest"
  | "rawa-belong"
  | "company-x-erp"
  | "company-x-finance";

const STROKE = "#22201c";
const STROKE_DIM = "#bd6a4a";

const baseProps = {
  viewBox: "0 0 56 56",
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-full h-full",
};

// circle with motion stripes (left) + soaring eagle silhouette (right)
function Rintis() {
  return (
    <svg {...baseProps}>
      <circle cx="28" cy="28" r="22" stroke={STROKE} strokeWidth="1.5" />
      {/* speed/motion stripes converging from left */}
      <path d="M11 19 L20 19" stroke={STROKE_DIM} strokeWidth="1.4" />
      <path d="M9 23 L24 23" stroke={STROKE_DIM} strokeWidth="1.4" />
      <path d="M8 28 L26 28" stroke={STROKE} strokeWidth="1.6" />
      <path d="M9 33 L24 33" stroke={STROKE_DIM} strokeWidth="1.4" />
      <path d="M11 37 L20 37" stroke={STROKE_DIM} strokeWidth="1.4" />
      {/* eagle silhouette — angular wings */}
      <path
        d="M28 30 L32 24 L36 28 L40 22 L44 26 L48 22"
        stroke={STROKE}
        strokeWidth="1.6"
      />
    </svg>
  );
}

// stylized "O" with a wedge-cut accent on the upper-right (overo's signature)
function Overo() {
  return (
    <svg {...baseProps}>
      {/* main O ring — 3/4 of the circle */}
      <path d="M28 10 A18 18 0 1 0 46 28" stroke={STROKE} strokeWidth="2.5" />
      {/* the wedge edge — the cut */}
      <path
        d="M28 10 L46 28"
        stroke={STROKE_DIM}
        strokeWidth="1.4"
        strokeDasharray="2 2"
      />
      {/* inner counter */}
      <circle cx="28" cy="28" r="9" stroke={STROKE_DIM} strokeWidth="1.5" />
      {/* the wedge accent dot */}
      <circle cx="38" cy="18" r="1.6" fill={STROKE} />
    </svg>
  );
}

// parallelogram "slash" frame containing a face profile silhouette
function WebIn() {
  return (
    <svg {...baseProps}>
      {/* parallelogram (the slash shape from the logo) */}
      <path
        d="M22 12 L46 12 L38 44 L14 44 Z"
        stroke={STROKE_DIM}
        strokeWidth="1.5"
      />
      {/* face profile facing right — forehead, nose bridge, nose tip, lips, chin */}
      <path
        d="M28 18 Q33 18 33 22 L33 25 Q35 26 33 28 L33 30 Q33 33 30 33 L28 33 L26 38"
        stroke={STROKE}
        strokeWidth="1.6"
      />
      {/* back of head curve */}
      <path d="M28 18 Q24 19 24 24" stroke={STROKE} strokeWidth="1.4" />
    </svg>
  );
}

// rhombus diamond with internal M-monogram strokes (maju jaya)
function MajuJaya() {
  return (
    <svg {...baseProps}>
      {/* skewed rhombus outline */}
      <path
        d="M14 18 L42 8 L42 38 L14 48 Z"
        stroke={STROKE}
        strokeWidth="1.5"
      />
      {/* three vertical bars forming the M */}
      <path d="M20 14 L20 36" stroke={STROKE} strokeWidth="1.6" />
      <path d="M28 11 L28 33" stroke={STROKE} strokeWidth="1.6" />
      <path d="M36 8 L36 30" stroke={STROKE} strokeWidth="1.6" />
      {/* connector strokes */}
      <path d="M20 14 L36 8" stroke={STROKE_DIM} strokeWidth="1.3" />
      <path d="M20 36 L36 30" stroke={STROKE_DIM} strokeWidth="1.3" />
    </svg>
  );
}

// circle with an S-curve dividing it (leseen)
function LeSeen() {
  return (
    <svg {...baseProps}>
      <circle cx="28" cy="28" r="20" stroke={STROKE} strokeWidth="2" />
      {/* the signature S curve through the middle */}
      <path
        d="M28 10 Q42 16 28 28 Q14 40 28 46"
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* dot accents on either side */}
      <circle cx="14" cy="20" r="1.2" fill={STROKE_DIM} />
      <circle cx="42" cy="36" r="1.2" fill={STROKE_DIM} />
    </svg>
  );
}

// monoline chick + egg shell (nest's mascot)
function Nest() {
  return (
    <svg {...baseProps}>
      {/* egg shell base with cracked top edge */}
      <path
        d="M12 32 Q12 46 28 46 Q44 46 44 32"
        stroke={STROKE_DIM}
        strokeWidth="1.5"
      />
      {/* jagged crack pattern */}
      <path
        d="M12 32 L16 36 L20 32 L24 36 L28 32 L32 36 L36 32 L40 36 L44 32"
        stroke={STROKE_DIM}
        strokeWidth="1.4"
      />
      {/* chick body */}
      <circle cx="28" cy="22" r="9" stroke={STROKE} strokeWidth="1.6" />
      {/* tuft */}
      <path d="M27 13 L27 10 M29 13 L29 10" stroke={STROKE} strokeWidth="1.4" />
      {/* eyes */}
      <circle cx="25" cy="21" r="0.9" fill={STROKE} />
      <circle cx="31" cy="21" r="0.9" fill={STROKE} />
      {/* beak */}
      <path
        d="M27 24 L29 24 L28 26 Z"
        stroke={STROKE}
        strokeWidth="1.2"
        fill={STROKE}
        fillOpacity="0.5"
      />
    </svg>
  );
}

// floral abstract — rawa belong flower community
function RawaBelong() {
  return (
    <svg {...baseProps}>
      <circle cx="28" cy="28" r="3" fill={STROKE} />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="28"
          cy="14"
          rx="4"
          ry="10"
          stroke={STROKE}
          strokeWidth="1.4"
          opacity="0.85"
          transform={`rotate(${deg} 28 28)`}
        />
      ))}
      <circle
        cx="28"
        cy="28"
        r="22"
        stroke={STROKE_DIM}
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.4"
      />
    </svg>
  );
}

// internal grid + connected nodes (company x ERP)
function CompanyXErp() {
  return (
    <svg {...baseProps}>
      <rect
        x="8"
        y="8"
        width="40"
        height="40"
        rx="2"
        stroke={STROKE_DIM}
        strokeWidth="1.5"
      />
      <path
        d="M8 22 L48 22 M8 36 L48 36 M22 8 L22 48 M36 8 L36 48"
        stroke={STROKE_DIM}
        strokeWidth="1"
        opacity="0.6"
      />
      <circle cx="22" cy="22" r="2" fill={STROKE} />
      <circle cx="36" cy="22" r="2" fill={STROKE} opacity="0.5" />
      <circle cx="22" cy="36" r="2" fill={STROKE} opacity="0.5" />
      <circle cx="36" cy="36" r="2" fill={STROKE} />
      <path
        d="M22 22 L36 36 M36 22 L22 36"
        stroke={STROKE}
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

// ledger bars + ascending trend line (company x finance)
function CompanyXFinance() {
  return (
    <svg {...baseProps}>
      <path d="M10 44 L46 44" stroke={STROKE_DIM} strokeWidth="1.5" />
      <path d="M10 12 L10 44" stroke={STROKE_DIM} strokeWidth="1.5" />
      <rect
        x="14"
        y="32"
        width="6"
        height="12"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
      />
      <rect
        x="22"
        y="26"
        width="6"
        height="18"
        stroke={STROKE_DIM}
        strokeWidth="1.2"
      />
      <rect
        x="30"
        y="20"
        width="6"
        height="24"
        stroke={STROKE}
        strokeWidth="1.6"
      />
      <rect
        x="38"
        y="14"
        width="6"
        height="30"
        stroke={STROKE}
        strokeWidth="1.6"
      />
      <path
        d="M14 36 L24 28 L34 22 L44 16"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeDasharray="2 2"
        opacity="0.7"
      />
      <circle cx="44" cy="16" r="2" fill={STROKE} />
    </svg>
  );
}

const REGISTRY: Record<BrandKey, React.ComponentType> = {
  rintis: Rintis,
  overo: Overo,
  webin: WebIn,
  "maju-jaya": MajuJaya,
  leseen: LeSeen,
  nest: Nest,
  "rawa-belong": RawaBelong,
  "company-x-erp": CompanyXErp,
  "company-x-finance": CompanyXFinance,
};

export default function BrandIcon({ variant }: { variant: BrandKey }) {
  const Component = REGISTRY[variant];
  return <Component />;
}

export type { BrandKey };

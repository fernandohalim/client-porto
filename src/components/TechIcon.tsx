import type { IconType } from "react-icons";
import {
  SiSpringboot,
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiRedis,
  SiGit,
  SiGo,
  SiNodedotjs,
  SiExpress,
  SiFlutter,
  SiMysql,
  SiFirebase,
  SiApachemaven,
  SiRust,
  SiSupabase,
  SiPython,
  SiElectron,
  SiFramer,
} from "react-icons/si";
import { FaJava, FaDatabase } from "react-icons/fa6";
import { TbBrandCSharp } from "react-icons/tb";

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
  | "maven"
  | "rust"
  | "supabase"
  | "python"
  | "csharp"
  | "electron"
  | "framer-motion";

const REGISTRY: Record<TechKey, IconType> = {
  java: FaJava,
  "spring-boot": SiSpringboot,
  typescript: SiTypescript,
  javascript: SiJavascript,
  next: SiNextdotjs,
  react: SiReact,
  tailwind: SiTailwindcss,
  "oracle-sql": FaDatabase,
  redis: SiRedis,
  git: SiGit,
  go: SiGo,
  node: SiNodedotjs,
  express: SiExpress,
  flutter: SiFlutter,
  "react-native": SiReact,
  mysql: SiMysql,
  firebase: SiFirebase,
  maven: SiApachemaven,
  rust: SiRust,
  supabase: SiSupabase,
  python: SiPython,
  csharp: TbBrandCSharp,
  electron: SiElectron,
  "framer-motion": SiFramer,
};

const COLORS: Record<TechKey, string> = {
  java: "#E76F00",
  "spring-boot": "#6DB33F",
  typescript: "#3178C6",
  javascript: "#E6B400",
  next: "#1a1a1a",
  react: "#3FB9D6",
  tailwind: "#0BA5C0",
  "oracle-sql": "#C74634",
  redis: "#DC382D",
  git: "#F05032",
  go: "#00ACD7",
  node: "#3C8E3C",
  express: "#1a1a1a",
  flutter: "#02569B",
  "react-native": "#3FB9D6",
  mysql: "#4479A1",
  firebase: "#F57C00",
  maven: "#C71A36",
  rust: "#CE422B",
  supabase: "#3FCF8E",
  python: "#3776AB",
  csharp: "#68217A",
  electron: "#47848F",
  "framer-motion": "#0055FF",
};

// mono = silhouette mode: renders in currentColor so the parent's
// text color drives it (used by the Stack hover reveal).
export default function TechIcon({
  variant,
  mono = false,
}: {
  variant: TechKey;
  mono?: boolean;
}) {
  const Icon = REGISTRY[variant];
  return (
    <Icon
      className="w-full h-full"
      color={mono ? "currentColor" : COLORS[variant]}
    />
  );
}

export type { TechKey };

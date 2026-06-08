import { GeistMono } from "geist/font/mono";

// noted is an all-monospace product — load Geist Mono here (server component,
// the safe place for font imports) and let the case-study page inherit it.
export default function NotedCaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={GeistMono.className}>{children}</div>;
}

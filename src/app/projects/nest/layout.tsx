import { GeistSans } from "geist/font/sans";

// nest's brand sans — loaded here (server component) so the page inherits it.
export default function NestCaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={GeistSans.className}>{children}</div>;
}

import { Plus_Jakarta_Sans } from "next/font/google";

// piggy wallet's brand sans — loaded here (server component) so the page inherits it.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function PiggyWalletCaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={jakarta.className}>{children}</div>;
}

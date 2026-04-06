"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar"; // adjust path if needed
import CommandPalette from "./CommandPalette"; // adjust path if needed
import Footer from "./Footer"; // adjust path if needed

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // check if we are on the nest case study page
  const isNestPage = pathname?.startsWith("/projects/nest");

  // dynamically swap the global body styles!
  const globalStyles = isNestPage
    ? "bg-[#fdfbf7] text-stone-800 selection:bg-emerald-200 selection:text-emerald-900"
    : "bg-black text-white selection:bg-green-500/30";

  return (
    <div className={`min-h-screen flex flex-col ${globalStyles}`}>
      {!isNestPage && <Navbar />}
      {!isNestPage && <CommandPalette />}

      {/* this will be your page content (either portfolio or nest) */}
      <div className="flex-grow">{children}</div>

      {!isNestPage && <Footer />}
    </div>
  );
}

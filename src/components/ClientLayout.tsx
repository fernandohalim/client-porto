"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar";
import CommandPalette from "./CommandPalette";
import Footer from "./Footer";
import PageTransition from "@/utilities/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import ScrollProgress from "@/utilities/ScrollProgress";
import Cursor from "@/utilities/Cursor";
import SmoothScroll from "@/utilities/SmoothScroll";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNestPage = pathname?.startsWith("/projects/nest");
  const isNotedPage = pathname?.startsWith("/projects/noted");
  const isCaseStudy = isNestPage || isNotedPage;

  const globalStyles = isNestPage
    ? "bg-[#fdfbf7] text-stone-800 selection:bg-emerald-200 selection:text-emerald-900"
    : isNotedPage
      ? "bg-[#0a0a0a] text-[#e5e5e5] selection:bg-[#d97757] selection:text-[#0a0a0a]"
      : "bg-bone text-ink selection:bg-ink selection:text-bone";

  return (
    <div
      id="global-layout"
      className={`min-h-screen flex flex-col transition-colors duration-700 ${globalStyles}`}
    >
      <Cursor />
      <SmoothScroll />
      {!isCaseStudy && <ScrollProgress />}
      <AnimatePresence>
        {!isCaseStudy && (
          <motion.div
            key="navbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isCaseStudy && (
          <motion.div
            key="cmd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <CommandPalette />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grow relative z-10">
        <PageTransition>{children}</PageTransition>
      </div>

      <AnimatePresence>
        {!isCaseStudy && (
          <motion.div
            key="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

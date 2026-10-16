import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Experience from "@/components/Experience";
import Freelance from "@/components/Freelance";
import Contact from "@/components/Contact";

// Section order is also a ground rhythm — coal, white, slab, white, coal,
// white, coal — so no two adjacent sections share a background and every
// section break reads as a seam without needing a rule to mark it.
export default function Home() {
  return (
    <main className="bg-white text-ink">
      <Hero />
      <About />
      <Work />
      <Stack />
      <Experience />
      <Freelance />
      <Contact />
    </main>
  );
}

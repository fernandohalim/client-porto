import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Experience from "@/components/Experience";
import Freelance from "@/components/Freelance";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
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

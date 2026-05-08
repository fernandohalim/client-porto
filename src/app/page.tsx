import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import FadeUp from "@/utilities/FadeUp";

export default function Home() {
  return (
    <main className="bg-black text-white selection:bg-green-500/30 overflow-hidden">
      <div id="hero" />
      <FadeUp delay={0.1}>
        <Hero />
      </FadeUp>

      <div id="projects" />
      <FadeUp delay={0.1}>
        <Projects />
      </FadeUp>

      <div id="experience" />
      <FadeUp delay={0.1}>
        <Experience />
      </FadeUp>

      <div id="skills" />
      <FadeUp delay={0.1}>
        <Skills />
      </FadeUp>

      <FadeUp delay={0.1}>
        <Contact />
      </FadeUp>
    </main>
  );
}

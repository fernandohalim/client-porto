import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import FadeUp from "@/utilities/FadeUp";

export default function Home() {
  return (
    <main className="bg-black text-white selection:bg-green-500/30 overflow-hidden">
      <div id="hero"></div>
      <FadeUp delay={0.1}>
        <Hero />
      </FadeUp>

      <div id="skills"></div>
      <FadeUp delay={0.1}>
        <Skills />
      </FadeUp>

      <div id="experience"></div>
      <FadeUp delay={0.1}>
        <Experience />
      </FadeUp>

      <div id="projects">
        <FadeUp delay={0.1}>
          <Projects />
        </FadeUp>
      </div>

      <div id="footer">
        <FadeUp delay={0.1}>
          <Footer />
        </FadeUp>
      </div>
    </main>
  );
}

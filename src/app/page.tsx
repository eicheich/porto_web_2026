import { Nav, DepthGauge, Hero, PlaygroundSection, ProjectsSection, AboutSection, ContactSection } from "@/components/portfolio";

export default function Home() {
  return (
    <>
      <Nav />
      <DepthGauge />
      <main>
        <Hero />
        <PlaygroundSection />
        <ProjectsSection />
        <AboutSection />
      </main>
      <ContactSection />
    </>
  );
}

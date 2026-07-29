import { Hero } from "@/features/hero/hero";
import { AboutSection } from "@/features/home/about-section";
import { ExperienceSection } from "@/features/home/experience-section";
import { ProjectsSection } from "@/features/home/projects-section";
import { ArchitectureSection } from "@/features/home/architecture-section";
import { PublicationsSection } from "@/features/home/publications-section";
import { EcosystemSection } from "@/features/home/ecosystem-section";
import { AchievementsSection } from "@/features/home/achievements-section";
import { ContactSection } from "@/features/home/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ArchitectureSection />
      <PublicationsSection />
      <EcosystemSection />
      <AchievementsSection />
      <ContactSection />
    </>
  );
}

import type { Metadata } from "next";
import { experience } from "@/content/experience";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";
import { ExperienceTimeline } from "@/features/experience/experience-timeline";

export const metadata: Metadata = {
  title: "Experience",
  description: "An interactive timeline of the systems I've built and owned.",
};

export default function ExperiencePage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Experience"
        title="An interactive timeline of the systems I've built and owned."
        description="Every entry expands into the same fixed template — overview, architecture, responsibilities, challenges, impact, technologies, metrics — so nothing is a highlight reel."
      />
      {experience.length > 0 ? (
        <ExperienceTimeline roles={experience} />
      ) : (
        <EmptyState message="Experience entries pending — see docs/content/INTAKE.md" />
      )}
    </PageContainer>
  );
}

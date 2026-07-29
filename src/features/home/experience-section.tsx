import { Briefcase } from "lucide-react";
import { experience } from "@/content/experience";
import { EmptyState } from "@/components/empty-state";
import { ExperienceTimeline } from "@/features/experience/experience-timeline";
import { SectionShell } from "./section-shell";

export function ExperienceSection() {
  return (
    <SectionShell
      id="experience"
      eyebrow="Experience"
      title="An interactive timeline of the systems I've built and owned."
      description="Every entry expands into the same fixed template — overview, architecture, responsibilities, challenges, impact, technologies, metrics — so nothing is a highlight reel."
      icon={Briefcase}
      tone="tint"
    >
      {experience.length > 0 ? (
        <ExperienceTimeline roles={experience} />
      ) : (
        <EmptyState message="Experience entries pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

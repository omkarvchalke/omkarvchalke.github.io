import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";
import { ProjectExplorer } from "@/features/projects/project-explorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies, not cards — problem, architecture, tradeoffs, and impact for every project.",
};

export default function ProjectsPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Projects"
        title="Case studies, not cards."
        description="Every project follows the same template — problem, architecture, tradeoffs, metrics, lessons — so they stay comparable instead of becoming a highlight reel."
      />
      {projects.length > 0 ? (
        <ProjectExplorer projects={projects} />
      ) : (
        <EmptyState message="Projects pending — see docs/content/INTAKE.md" />
      )}
    </PageContainer>
  );
}

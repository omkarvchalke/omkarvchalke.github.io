import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "System Architecture Gallery",
  description: "Interactive diagrams of every major system I've built.",
};

export default function ArchitectureGalleryPage() {
  const diagrammed = projects.filter((p) => p.hasArchitectureDiagram);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="System Architecture Gallery"
        title="Interactive diagrams of every major system."
        description="Services, APIs, queues, databases, and cloud — hover any component for what it actually does."
      />
      {diagrammed.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {diagrammed.map((project, i) => (
            <Reveal key={project.slug} delay={i * 60}>
              <Link
                href={`/architecture/${project.slug}`}
                className="group border-border bg-card hover:border-primary flex h-full flex-col gap-3 rounded-lg border p-6 transition-colors"
              >
                <h3 className="group-hover:text-primary font-medium">
                  {project.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {project.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState message="Architecture diagrams pending — see docs/content/INTAKE.md" />
      )}
    </PageContainer>
  );
}

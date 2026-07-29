"use client";

import { projects } from "@/content/projects";
import { EmptyState } from "@/components/empty-state";
import { Expandable, ExpandChevron } from "@/components/expandable";
import { Reveal } from "@/components/reveal";
import { DiagramCanvas } from "@/features/architecture/diagram-canvas";
import { SectionShell } from "./section-shell";

export function ArchitectureSection() {
  const diagrammed = projects.filter(
    (p) => p.hasArchitectureDiagram && p.diagram
  );

  return (
    <SectionShell
      id="architecture"
      eyebrow="System Architecture Gallery"
      title="Interactive diagrams of every major system."
      description="Services, APIs, queues, databases, and cloud — hover any component for what it actually does."
    >
      {diagrammed.length > 0 ? (
        <div className="flex flex-col gap-4">
          {diagrammed.map((project, i) => (
            <Reveal key={project.slug} delay={i * 60}>
              <Expandable
                id={`architecture-${project.slug}`}
                header={(open) => (
                  <div className="flex w-full items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {project.summary}
                      </p>
                    </div>
                    <ExpandChevron open={open} />
                  </div>
                )}
              >
                {project.diagram && <DiagramCanvas diagram={project.diagram} />}
              </Expandable>
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState message="Architecture diagrams pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

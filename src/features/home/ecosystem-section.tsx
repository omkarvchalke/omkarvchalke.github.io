import { technologies } from "@/content/technologies";
import { technologyCooccurrence } from "@/content/graph";
import { EmptyState } from "@/components/empty-state";
import { EcosystemGraph } from "@/features/ecosystem/ecosystem-graph";
import { SectionShell } from "./section-shell";

export function EcosystemSection() {
  return (
    <SectionShell
      id="ecosystem"
      eyebrow="Technology Ecosystem"
      title="How everything connects."
      description="Edges here aren't curated — they're computed from technologies that actually shipped together in the same project or role. Hover a node."
    >
      {technologies.length > 0 ? (
        <EcosystemGraph
          technologies={technologies}
          edges={technologyCooccurrence()}
        />
      ) : (
        <EmptyState message="Technology graph pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

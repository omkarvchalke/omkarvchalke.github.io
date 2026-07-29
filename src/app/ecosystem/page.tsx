import type { Metadata } from "next";
import { technologies } from "@/content/technologies";
import { technologyCooccurrence } from "@/content/graph";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";
import { EcosystemGraph } from "@/features/ecosystem/ecosystem-graph";

export const metadata: Metadata = {
  title: "Technology Ecosystem",
  description:
    "An interactive graph of how every technology connects to real projects and roles.",
};

export default function EcosystemPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Technology Ecosystem"
        title="How everything connects."
        description="Edges here aren't curated — they're computed from technologies that actually shipped together in the same project or role. Hover a node."
      />
      {technologies.length > 0 ? (
        <EcosystemGraph
          technologies={technologies}
          edges={technologyCooccurrence()}
        />
      ) : (
        <EmptyState message="Technology graph pending — see docs/content/INTAKE.md" />
      )}
    </PageContainer>
  );
}

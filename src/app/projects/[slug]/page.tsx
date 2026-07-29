import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content";
import { PageContainer } from "@/components/page-container";
import { ProjectDetail } from "@/features/projects/project-detail";

// Static export (see next.config.ts) requires every dynamic route's params
// enumerated at build time — this stays wired to the content graph so it
// needs no changes once Phase 5 content lands.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <PageContainer>
      <ProjectDetail project={project} />
    </PageContainer>
  );
}

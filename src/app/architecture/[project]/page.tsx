import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/content";
import { PageContainer } from "@/components/page-container";
import { DiagramCanvas } from "@/features/architecture/diagram-canvas";

export function generateStaticParams() {
  return projects
    .filter((project) => project.hasArchitectureDiagram)
    .map((project) => ({ project: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project: string }>;
}): Promise<Metadata> {
  const { project: slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} architecture`,
    description: `Component-level architecture diagram for ${project.name}.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project: slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project || !project.diagram) notFound();

  return (
    <PageContainer>
      <div className="mb-8 flex flex-col gap-4">
        <Link
          href="/architecture"
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 font-mono text-xs"
        >
          <ArrowLeft className="size-3.5" />
          Architecture Gallery
        </Link>
        <h1 className="text-3xl font-semibold sm:text-4xl">{project.name}</h1>
        <p className="text-muted-foreground max-w-2xl">{project.summary}</p>
      </div>
      <DiagramCanvas diagram={project.diagram} />
    </PageContainer>
  );
}

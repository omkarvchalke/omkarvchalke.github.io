import { PagePlaceholder } from "@/components/page-placeholder";
import { projects } from "@/content";

export function generateStaticParams() {
  return projects
    .filter((project) => project.hasArchitectureDiagram)
    .map((project) => ({ project: project.slug }));
}

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Architecture"
      title="Component-level diagram for this project."
      phase="Phase 5"
    />
  );
}

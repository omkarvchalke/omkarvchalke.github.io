import { PagePlaceholder } from "@/components/page-placeholder";
import { projects } from "@/content";

// Static export (see next.config.ts) requires every dynamic route's params
// enumerated at build time — this stays wired to the content graph so it
// needs no changes once Phase 5 content lands.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Project"
      title="Full case study."
      phase="Phase 5"
    />
  );
}

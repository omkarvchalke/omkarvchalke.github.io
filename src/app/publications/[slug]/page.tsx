import { PagePlaceholder } from "@/components/page-placeholder";
import { publications } from "@/content";

export function generateStaticParams() {
  return publications.map((publication) => ({ slug: publication.slug }));
}

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Publication"
      title="Abstract, methods, and the project it came from."
      phase="Phase 5"
    />
  );
}

import Link from "next/link";
import type { Project } from "@/content/types";
import { technologiesForProject } from "@/content/graph";
import { Reveal } from "@/components/reveal";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const tech = technologiesForProject(project.slug).slice(0, 4);

  return (
    <Reveal delay={(index % 6) * 60}>
      <Link
        href={`/projects/${project.slug}`}
        className="group border-border bg-card hover:border-primary flex h-full flex-col gap-4 rounded-lg border p-6 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="group-hover:text-primary font-medium">
            {project.name}
          </h3>
          {project.depth === "full" && (
            <span className="border-primary/30 bg-primary/10 text-primary shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase">
              Case study
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {tech.map((t) => (
            <span
              key={t.slug}
              className="border-border text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-[11px]"
            >
              {t.name}
            </span>
          ))}
        </div>
      </Link>
    </Reveal>
  );
}

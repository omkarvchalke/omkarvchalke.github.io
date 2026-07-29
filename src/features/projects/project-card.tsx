import Link from "next/link";
import type { Project } from "@/content/types";
import { technologiesForProject } from "@/content/graph";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const tech = technologiesForProject(project.slug).slice(0, 4);
  const isFull = project.depth === "full";

  return (
    <Reveal delay={(index % 6) * 60}>
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "surface-card group border-border flex h-full flex-col gap-4 rounded-lg border p-6",
          !isFull && "accent-copper"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="group-hover:text-primary font-medium transition-colors duration-300">
            {project.name}
          </h2>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase",
              isFull
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-copper/30 bg-copper/10 text-copper"
            )}
          >
            {isFull ? "Case study" : "Overview"}
          </span>
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

"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Discipline, Project } from "@/content/types";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  backend: "Backend",
  cloud: "Cloud",
  data: "Data",
  ai: "AI",
  research: "Research",
  frontend: "Frontend",
  architecture: "Architecture",
  databases: "Databases",
  "open-source": "Open Source",
};

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState<Discipline | null>(null);

  const disciplinesInUse = useMemo(() => {
    const set = new Set<Discipline>();
    projects.forEach((p) => p.disciplines.forEach((d) => set.add(d)));
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q);
      const matchesDiscipline =
        !discipline || p.disciplines.includes(discipline);
      return matchesQuery && matchesDiscipline;
    });
  }, [projects, query, discipline]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="border-border bg-card focus-visible:border-primary w-full rounded-md border py-2 pr-3 pl-9 text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setDiscipline(null)}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
              discipline === null
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {disciplinesInUse.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDiscipline(d === discipline ? null : d)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                discipline === d
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {DISCIPLINE_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState message="No projects match that search or filter." />
      )}
    </div>
  );
}

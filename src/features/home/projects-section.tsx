"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { projects } from "@/content/projects";
import { technologiesForProject, experienceForProject } from "@/content/graph";
import type { Discipline, Project } from "@/content/types";
import { EmptyState } from "@/components/empty-state";
import { Expandable, ExpandChevron } from "@/components/expandable";
import { Reveal } from "@/components/reveal";
import { GitHubIcon } from "@/components/brand-icons";
import { SectionShell } from "./section-shell";
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

function Prose({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
        {title}
      </h4>
      <p className="text-muted-foreground text-sm text-pretty">{body}</p>
    </div>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
        {title}
      </h4>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="text-muted-foreground flex gap-2 text-sm">
            <span className="bg-border mt-2 size-1 shrink-0 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectBody({ project }: { project: Project }) {
  const tech = technologiesForProject(project.slug);
  const relatedExperience = experienceForProject(project.slug);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Prose title="Problem" body={project.problem} />
      <Prose title="Architecture" body={project.architecture} />
      <Prose title="API flow" body={project.apiFlow} />
      <Prose title="Deployment" body={project.deployment} />
      <BulletList title="Challenges" items={project.challenges} />
      <BulletList title="Tradeoffs" items={project.tradeoffs} />
      <BulletList title="Lessons learned" items={project.lessons} />

      {project.metrics.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
            Metrics
          </h4>
          <dl className="flex flex-col gap-2">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="border-border flex items-baseline justify-between gap-3 border-b pb-1.5"
              >
                <dt className="text-muted-foreground text-xs">{m.label}</dt>
                <dd className="text-primary font-mono text-sm tabular-nums">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:col-span-2">
        <div className="flex flex-wrap gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="glow-ring-emerald bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              Live demo
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="border-border hover:border-primary hover:text-primary hover:bg-primary/5 inline-flex h-9 items-center gap-1.5 rounded-md border px-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              <GitHubIcon className="size-4" />
              Source
            </a>
          )}
          {project.hasArchitectureDiagram && (
            <a
              href={`#architecture-${project.slug}`}
              className="border-border hover:border-copper hover:text-copper hover:bg-copper/5 inline-flex h-9 items-center gap-1.5 rounded-md border px-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              View architecture diagram ↓
            </a>
          )}
        </div>

        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tech.map((t) => (
              <a
                key={t.slug}
                href={`#${t.slug}`}
                className="border-border text-muted-foreground hover:border-primary hover:text-primary rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors"
              >
                {t.name}
              </a>
            ))}
          </div>
        )}

        {relatedExperience.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {relatedExperience.map((e) => (
              <a
                key={e.slug}
                href={`#experience-${e.slug}`}
                className="text-primary text-sm hover:underline"
              >
                Grew out of: {e.role} · {e.company} →
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState<Discipline | null>(null);

  const disciplinesInUse = useMemo(() => {
    const set = new Set<Discipline>();
    projects.forEach((p) => p.disciplines.forEach((d) => set.add(d)));
    return Array.from(set);
  }, []);

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
  }, [query, discipline]);

  return (
    <SectionShell
      id="work"
      eyebrow="Projects"
      title="Case studies, not cards."
      description="Every project follows the same template — problem, architecture, tradeoffs, metrics, lessons. Click one to expand it."
    >
      {projects.length === 0 ? (
        <EmptyState message="Projects pending — see docs/content/INTAKE.md" />
      ) : (
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
            <div className="flex flex-col gap-4">
              {filtered.map((project, i) => {
                const isFull = project.depth === "full";
                return (
                  <Reveal key={project.slug} delay={(i % 6) * 60}>
                    <Expandable
                      id={`project-${project.slug}`}
                      className={!isFull ? "accent-copper" : undefined}
                      header={(open) => (
                        <div className="flex w-full items-start justify-between gap-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="font-medium">{project.name}</h3>
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase",
                                  isFull
                                    ? "border-primary/30 bg-primary/10 text-primary"
                                    : "border-copper/30 bg-copper/10 text-copper"
                                )}
                              >
                                {isFull ? "Case study" : "Overview"}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {project.summary}
                            </p>
                          </div>
                          <ExpandChevron open={open} />
                        </div>
                      )}
                    >
                      <ProjectBody project={project} />
                    </Expandable>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <EmptyState message="No projects match that search or filter." />
          )}
        </div>
      )}
      <p className="text-muted-foreground mt-6 font-mono text-xs">
        Or browse the{" "}
        <a href="#ecosystem" className="text-primary hover:underline">
          Technology Ecosystem
        </a>{" "}
        graph to see what shipped together.
      </p>
    </SectionShell>
  );
}

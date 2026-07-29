import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import type { Project } from "@/content/types";
import { technologiesForProject, experienceForProject } from "@/content/graph";
import { GitHubIcon } from "@/components/brand-icons";
import { Reveal } from "@/components/reveal";

function Prose({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-copper font-mono text-xs tracking-[0.14em] uppercase">
        {title}
      </h2>
      <p className="text-foreground/90 text-pretty">{body}</p>
    </section>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-copper font-mono text-xs tracking-[0.14em] uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-muted-foreground flex gap-2.5 text-sm">
            <span className="bg-border mt-2 size-1 shrink-0 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const tech = technologiesForProject(project.slug);
  const relatedExperience = experienceForProject(project.slug);

  return (
    <article className="flex flex-col gap-14">
      <Reveal>
        <header className="flex flex-col gap-5">
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 font-mono text-xs"
          >
            <ArrowLeft className="size-3.5" />
            All projects
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {project.name}
            </h1>
            {project.depth === "full" && (
              <span className="border-primary/30 bg-primary/10 text-primary rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase">
                Case study
              </span>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="bg-primary text-primary-foreground hover:bg-primary/85 inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium"
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
                className="border-border hover:border-primary hover:text-primary inline-flex h-9 items-center gap-1.5 rounded-md border px-3.5 text-sm font-medium"
              >
                <GitHubIcon className="size-4" />
                Source
              </a>
            )}
            {project.hasArchitectureDiagram && (
              <Link
                href={`/architecture/${project.slug}`}
                className="border-border hover:border-primary hover:text-primary inline-flex h-9 items-center gap-1.5 rounded-md border px-3.5 text-sm font-medium"
              >
                Architecture diagram
              </Link>
            )}
          </div>
        </header>
      </Reveal>

      <div className="grid gap-14 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-10">
          <Reveal delay={60}>
            <Prose title="Problem" body={project.problem} />
          </Reveal>
          <Reveal delay={90}>
            <Prose title="Architecture" body={project.architecture} />
          </Reveal>
          <Reveal delay={120}>
            <Prose title="API flow" body={project.apiFlow} />
          </Reveal>
          <Reveal delay={150}>
            <Prose title="Deployment" body={project.deployment} />
          </Reveal>
          <Reveal delay={180}>
            <BulletList title="Challenges" items={project.challenges} />
          </Reveal>
          <Reveal delay={210}>
            <BulletList title="Tradeoffs" items={project.tradeoffs} />
          </Reveal>
          <Reveal delay={240}>
            <BulletList title="Lessons learned" items={project.lessons} />
          </Reveal>

          {project.screenshots && project.screenshots.length > 0 && (
            <Reveal delay={270}>
              <section className="flex flex-col gap-3">
                <h2 className="text-copper font-mono text-xs tracking-[0.14em] uppercase">
                  Screenshots
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.screenshots.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element -- static export, no image loader
                    <img
                      key={src}
                      src={src}
                      alt={`${project.name} screenshot`}
                      className="border-border rounded-md border"
                    />
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </div>

        <Reveal delay={90} className="flex flex-col gap-8">
          <aside className="flex flex-col gap-8">
            {tech.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                  Tech stack
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {tech.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/ecosystem#${t.slug}`}
                      className="border-border text-muted-foreground hover:border-primary hover:text-primary rounded-md border px-2 py-0.5 font-mono text-[11px]"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {project.database && (
              <div className="flex flex-col gap-1.5">
                <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                  Database
                </h2>
                <p className="text-muted-foreground text-sm">
                  {project.database}
                </p>
              </div>
            )}

            {project.infrastructure && (
              <div className="flex flex-col gap-1.5">
                <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                  Infrastructure
                </h2>
                <p className="text-muted-foreground text-sm">
                  {project.infrastructure}
                </p>
              </div>
            )}

            {project.metrics.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                  Metrics
                </h2>
                <dl className="flex flex-col gap-2">
                  {project.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="border-border flex items-baseline justify-between gap-3 border-b pb-2"
                    >
                      <dt className="text-muted-foreground text-xs">
                        {m.label}
                      </dt>
                      <dd className="text-primary font-mono text-sm tabular-nums">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {relatedExperience.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                  Grew out of
                </h2>
                {relatedExperience.map((e) => (
                  <Link
                    key={e.slug}
                    href="/experience"
                    className="text-primary text-sm hover:underline"
                  >
                    {e.role} · {e.company}
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </Reveal>
      </div>
    </article>
  );
}

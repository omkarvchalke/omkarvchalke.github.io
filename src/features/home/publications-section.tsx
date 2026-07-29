"use client";

import { ArrowUpRight, FileText } from "lucide-react";
import { publications } from "@/content/publications";
import { projectForPublication, getTechnology } from "@/content/graph";
import { EmptyState } from "@/components/empty-state";
import { Expandable, ExpandChevron } from "@/components/expandable";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "./section-shell";

export function PublicationsSection() {
  return (
    <SectionShell
      id="publications"
      eyebrow="Publications"
      title="Research, written up properly."
      description="Abstract, problem, methods, and the project each publication came out of."
    >
      {publications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {publications.map((pub, i) => {
            const tech = pub.techSlugs.map(getTechnology).filter(Boolean);
            const relatedProject = projectForPublication(pub.slug);
            return (
              <Reveal key={pub.slug} delay={i * 60}>
                <Expandable
                  id={`publication-${pub.slug}`}
                  header={(open) => (
                    <div className="flex w-full items-start justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <h3 className="flex items-center gap-2 font-medium">
                          <FileText className="text-muted-foreground size-4" />
                          {pub.title}
                        </h3>
                        <p className="text-muted-foreground max-w-2xl text-sm">
                          {pub.abstract}
                        </p>
                      </div>
                      <ExpandChevron open={open} />
                    </div>
                  )}
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
                        Problem
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {pub.problem}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
                        Methods
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {pub.methods}
                      </p>
                    </div>
                    {tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tech.map((t) => (
                          <a
                            key={t!.slug}
                            href={`#${t!.slug}`}
                            className="border-border text-muted-foreground hover:border-primary hover:text-primary rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors"
                          >
                            {t!.name}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4">
                      {pub.pdfUrl && (
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="glow-ring-emerald bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 w-fit items-center gap-1.5 rounded-md px-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                        >
                          Read PDF
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      )}
                      {relatedProject && (
                        <span className="text-sm">
                          Related project:{" "}
                          <a
                            href={`#project-${relatedProject.slug}`}
                            className="text-primary hover:underline"
                          >
                            {relatedProject.name} →
                          </a>
                        </span>
                      )}
                    </div>
                    <pre className="border-border bg-background overflow-x-auto rounded-md border p-4 font-mono text-xs text-pretty whitespace-pre-wrap">
                      {pub.citation}
                    </pre>
                  </div>
                </Expandable>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <EmptyState message="Publications pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { publications } from "@/content";
import { projectForPublication, getTechnology } from "@/content/graph";
import { PageContainer } from "@/components/page-container";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return publications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publication = publications.find((p) => p.slug === slug);
  if (!publication) return {};
  return {
    title: publication.title,
    description: publication.abstract,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publication = publications.find((p) => p.slug === slug);
  if (!publication) notFound();

  const tech = publication.techSlugs.map(getTechnology).filter(Boolean);
  const relatedProject = projectForPublication(publication.slug);

  return (
    <PageContainer>
      <article className="mx-auto flex max-w-3xl flex-col gap-10">
        <Reveal>
          <div className="flex flex-col gap-4">
            <Link
              href="/publications"
              className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 font-mono text-xs"
            >
              <ArrowLeft className="size-3.5" />
              All publications
            </Link>
            <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
              {publication.title}
            </h1>
            {publication.pdfUrl && (
              <a
                href={publication.pdfUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="glow-ring-emerald bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-fit items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              >
                Read PDF
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={60}>
          <section className="flex flex-col gap-3">
            <h2 className="text-copper font-mono text-xs tracking-[0.14em] uppercase">
              Abstract
            </h2>
            <p className="text-foreground/90 text-pretty">
              {publication.abstract}
            </p>
          </section>
        </Reveal>

        <Reveal delay={90}>
          <section className="flex flex-col gap-3">
            <h2 className="text-copper font-mono text-xs tracking-[0.14em] uppercase">
              Problem
            </h2>
            <p className="text-muted-foreground text-pretty">
              {publication.problem}
            </p>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section className="flex flex-col gap-3">
            <h2 className="text-copper font-mono text-xs tracking-[0.14em] uppercase">
              Methods
            </h2>
            <p className="text-muted-foreground text-pretty">
              {publication.methods}
            </p>
          </section>
        </Reveal>

        {tech.length > 0 && (
          <Reveal delay={150}>
            <section className="flex flex-col gap-3">
              <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {tech.map((t) => (
                  <span
                    key={t!.slug}
                    className="border-border text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-[11px]"
                  >
                    {t!.name}
                  </span>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {relatedProject && (
          <Reveal delay={180}>
            <section className="flex flex-col gap-3">
              <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                Related project
              </h2>
              <Link
                href={`/projects/${relatedProject.slug}`}
                className="text-primary text-sm hover:underline"
              >
                {relatedProject.name} →
              </Link>
            </section>
          </Reveal>
        )}

        <Reveal delay={210}>
          <section className="flex flex-col gap-3">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              Citation
            </h2>
            <pre className="border-border bg-card text-muted-foreground overflow-x-auto rounded-md border p-4 font-mono text-xs whitespace-pre-wrap">
              {publication.citation}
            </pre>
          </section>
        </Reveal>
      </article>
    </PageContainer>
  );
}

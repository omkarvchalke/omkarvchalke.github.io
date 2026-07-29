import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { publications } from "@/content/publications";
import { getTechnology } from "@/content/graph";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Publications",
  description: "Research, written up properly.",
};

export default function PublicationsPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Publications"
        title="Research, written up properly."
        description="Abstract, problem, methods, and the project each publication came out of."
      />
      {publications.length > 0 ? (
        <div className="divide-border border-border flex flex-col divide-y border-y">
          {publications.map((pub, i) => {
            const tech = pub.techSlugs.map(getTechnology).filter(Boolean);
            return (
              <Reveal key={pub.slug} delay={i * 60}>
                <Link
                  href={`/publications/${pub.slug}`}
                  className="group hover:bg-primary/[0.04] relative flex flex-col gap-3 py-6 pl-5 transition-colors duration-300"
                >
                  <span className="bg-border group-hover:bg-primary absolute top-0 left-0 h-full w-[3px] rounded-full transition-all duration-300 group-hover:shadow-[0_0_12px_var(--primary)]" />
                  <h2 className="group-hover:text-primary flex items-center gap-2 font-medium transition-colors duration-300">
                    <FileText className="text-muted-foreground size-4" />
                    {pub.title}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl text-sm">
                    {pub.abstract}
                  </p>
                  {tech.length > 0 && (
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
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <EmptyState message="Publications pending — see docs/content/INTAKE.md" />
      )}
    </PageContainer>
  );
}

import type { Metadata } from "next";
import { about } from "@/content/about";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "How I got into engineering, and how I think about building software.",
};

const CATEGORY_STYLES: Record<
  (typeof about)["timeline"][number]["category"],
  string
> = {
  education: "text-copper",
  career: "text-primary",
  research: "text-muted-foreground",
};

export default function AboutPage() {
  const hasStory = about.story.trim().length > 0;
  const hasPhilosophy = about.philosophy.trim().length > 0;
  const hasTimeline = about.timeline.length > 0;

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="About"
        title="How I got here, and how I think about building software."
        description="Not a resume — the reasoning behind the work. The full career timeline lives on the Experience page."
      />

      <div className="grid max-w-3xl gap-16">
        <Reveal>
          <section className="flex flex-col gap-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              The story
            </h2>
            {hasStory ? (
              <p className="text-foreground/90 text-lg text-pretty">
                {about.story}
              </p>
            ) : (
              <EmptyState message="Story pending — see docs/content/INTAKE.md" />
            )}
          </section>
        </Reveal>

        <Reveal delay={60}>
          <section className="flex flex-col gap-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              Philosophy
            </h2>
            {hasPhilosophy ? (
              <p className="text-foreground/90 text-lg text-pretty">
                {about.philosophy}
              </p>
            ) : (
              <EmptyState message="Philosophy pending — see docs/content/INTAKE.md" />
            )}
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section className="flex flex-col gap-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              Timeline
            </h2>
            {hasTimeline ? (
              <ol className="border-border flex flex-col gap-6 border-l pl-6">
                {about.timeline.map((entry) => (
                  <li key={`${entry.date}-${entry.title}`} className="relative">
                    <span className="bg-primary absolute top-1.5 -left-[27px] size-2 rounded-full" />
                    <span
                      className={cn(
                        "font-mono text-xs uppercase",
                        CATEGORY_STYLES[entry.category]
                      )}
                    >
                      {entry.date} · {entry.category}
                    </span>
                    <h3 className="mt-1 font-medium">{entry.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {entry.description}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState message="Timeline pending — see docs/content/INTAKE.md" />
            )}
          </section>
        </Reveal>
      </div>
    </PageContainer>
  );
}

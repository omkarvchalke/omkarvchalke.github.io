import type { Metadata } from "next";
import { Award } from "lucide-react";
import { achievements } from "@/content/achievements";
import { PageContainer } from "@/components/page-container";
import { SectionHeader } from "@/components/section-header";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Notable milestones and recognitions.",
};

export default function AchievementsPage() {
  return (
    <PageContainer>
      <SectionHeader eyebrow="Achievements" title="Notable milestones." />
      {achievements.length > 0 ? (
        <ul className="divide-border border-border flex flex-col divide-y border-y">
          {achievements.map((achievement, i) => (
            <Reveal
              as="li"
              key={achievement.slug}
              delay={i * 60}
              className="flex items-start gap-4 py-5"
            >
              <Award className="text-primary mt-0.5 size-4 shrink-0" />
              <div className="flex flex-1 flex-col gap-1">
                <h2 className="font-medium">
                  {achievement.url ? (
                    <a
                      href={achievement.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:text-primary hover:underline"
                    >
                      {achievement.title}
                    </a>
                  ) : (
                    achievement.title
                  )}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {achievement.description}
                </p>
              </div>
              <span className="text-muted-foreground shrink-0 font-mono text-xs">
                {achievement.date}
              </span>
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState message="Achievements pending — see docs/content/INTAKE.md" />
      )}
    </PageContainer>
  );
}

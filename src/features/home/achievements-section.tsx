import { Award } from "lucide-react";
import { achievements } from "@/content/achievements";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "./section-shell";

export function AchievementsSection() {
  return (
    <SectionShell
      id="achievements"
      eyebrow="Achievements"
      title="Notable milestones."
      icon={Award}
    >
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
                <h3 className="font-medium">
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
                </h3>
                <p className="text-muted-foreground text-sm">
                  {achievement.description}
                </p>
              </div>
              {achievement.date && (
                <span className="text-muted-foreground shrink-0 font-mono text-xs">
                  {achievement.date}
                </span>
              )}
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState message="Achievements pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

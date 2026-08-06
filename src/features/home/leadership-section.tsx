import { Handshake } from "lucide-react";
import { leadership } from "@/content/leadership";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "./section-shell";

export function LeadershipSection() {
  return (
    <SectionShell
      id="leadership"
      eyebrow="Leadership"
      title="Where I've contributed beyond my own codebase."
      description="Mentorship, community, and team roles outside of shipped projects."
      icon={Handshake}
      tone="tint"
    >
      {leadership.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {leadership.map((entry, i) => (
            <Reveal
              key={entry.slug}
              delay={i * 60}
              className="border-border flex flex-col gap-2 rounded-lg border p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-copper font-mono text-[11px] tracking-[0.08em] uppercase">
                  {entry.category}
                </span>
                {entry.dateRange && (
                  <span className="text-muted-foreground shrink-0 font-mono text-xs">
                    {entry.dateRange}
                  </span>
                )}
              </div>
              <h3 className="font-medium">
                {entry.role} · {entry.organization}
              </h3>
              {entry.description.length === 1 ? (
                <p className="text-muted-foreground text-sm text-pretty">
                  {entry.description[0]}
                </p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {entry.description.map((line) => (
                    <li
                      key={line}
                      className="text-muted-foreground flex gap-2 text-sm"
                    >
                      <span className="bg-border mt-2 size-1 shrink-0 rounded-full" />
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState message="Leadership entries pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

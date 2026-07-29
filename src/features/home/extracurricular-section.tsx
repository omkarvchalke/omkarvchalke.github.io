import { Compass } from "lucide-react";
import { extracurricular } from "@/content/extracurricular";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";
import { SectionShell } from "./section-shell";

export function ExtraCurricularSection() {
  return (
    <SectionShell
      id="extracurricular"
      eyebrow="Extra-Curricular"
      title="Outside of work and code."
      description="Interests and activities that don't show up in a case study."
      icon={Compass}
    >
      {extracurricular.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {extracurricular.map((entry, i) => (
            <Reveal
              key={entry.slug}
              delay={i * 60}
              className="border-border flex flex-col gap-2 rounded-lg border p-5"
            >
              <span className="text-copper font-mono text-[11px] tracking-[0.08em] uppercase">
                {entry.category}
              </span>
              <h3 className="font-medium">{entry.title}</h3>
              <p className="text-muted-foreground text-sm text-pretty">
                {entry.description}
              </p>
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState message="Extra-curricular entries pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

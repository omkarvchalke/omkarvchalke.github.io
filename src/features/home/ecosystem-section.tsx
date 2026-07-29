import { Share2 } from "lucide-react";
import { technologies } from "@/content/technologies";
import { technologyCooccurrence } from "@/content/graph";
import type { Technology, TechnologyCategory } from "@/content/types";
import { EmptyState } from "@/components/empty-state";
import { TechBadge } from "@/components/tech-badge";
import { EcosystemGraph } from "@/features/ecosystem/ecosystem-graph";
import { SectionShell } from "./section-shell";

const CATEGORY_LABELS: Record<TechnologyCategory, string> = {
  language: "Languages",
  framework: "Frameworks",
  database: "Databases",
  infrastructure: "Infrastructure",
  platform: "Platforms",
  tooling: "Tooling",
};

const CATEGORY_ORDER: TechnologyCategory[] = [
  "language",
  "framework",
  "database",
  "infrastructure",
  "platform",
  "tooling",
];

function groupByCategory(items: Technology[]) {
  const map = new Map<TechnologyCategory, Technology[]>();
  for (const t of items) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  return map;
}

export function EcosystemSection() {
  const grouped = groupByCategory(technologies);

  return (
    <SectionShell
      id="ecosystem"
      eyebrow="Technology Ecosystem"
      title="How everything connects."
      description="Edges here aren't curated — they're computed from technologies that actually shipped together in the same project or role. Hover a node."
      icon={Share2}
      tone="tint"
    >
      {technologies.length > 0 ? (
        <div className="flex flex-col gap-10">
          <EcosystemGraph
            technologies={technologies}
            edges={technologyCooccurrence()}
          />

          <div className="flex flex-col gap-4">
            <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              Quick reference
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORY_ORDER.map((category) => {
                const items = grouped.get(category);
                if (!items || items.length === 0) return null;
                return (
                  <div key={category} className="flex flex-col gap-2">
                    <h4 className="text-copper font-mono text-[11px] tracking-[0.08em] uppercase">
                      {CATEGORY_LABELS[category]}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((t) => (
                        <TechBadge
                          key={t.slug}
                          technology={t}
                          href={`#${t.slug}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState message="Technology graph pending — see docs/content/INTAKE.md" />
      )}
    </SectionShell>
  );
}

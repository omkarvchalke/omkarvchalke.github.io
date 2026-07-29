"use client";

import { useState } from "react";
import type { Experience } from "@/content/types";
import { getTechnology, projectsForExperience } from "@/content/graph";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

function formatRange(start: string, end?: string) {
  const fmt = (iso: string) => {
    const [y, m] = iso.split("-");
    const date = new Date(Number(y), Number(m ?? 1) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  return `${fmt(start)} – ${end ? fmt(end) : "Present"}`;
}

const FIELDS: {
  key: keyof Pick<
    Experience,
    "overview" | "architecture" | "challenges" | "responsibilities" | "impact"
  >;
  label: string;
}[] = [
  { key: "overview", label: "Overview" },
  { key: "architecture", label: "Architecture" },
  { key: "responsibilities", label: "Responsibilities" },
  { key: "challenges", label: "Challenges" },
  { key: "impact", label: "Impact" },
];

function EntryDetail({ value }: { value: string | string[] | undefined }) {
  if (!value || value.length === 0) return null;
  if (typeof value === "string") {
    return <p className="text-muted-foreground text-sm">{value}</p>;
  }
  return (
    <ul className="flex flex-col gap-1.5">
      {value.map((item) => (
        <li key={item} className="text-muted-foreground flex gap-2 text-sm">
          <span className="bg-border mt-2 size-1 shrink-0 rounded-full" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ExperienceEntry({ role, index }: { role: Experience; index: number }) {
  const [open, setOpen] = useState(false);
  const tech = role.techSlugs.map(getTechnology).filter(Boolean);
  const relatedProjects = projectsForExperience(role.slug);

  return (
    <Reveal
      as="li"
      id={`experience-${role.slug}`}
      delay={index * 60}
      className="relative scroll-mt-20 pl-6"
    >
      <span
        className={cn(
          "absolute top-6 -left-[7px] size-3 rounded-full border-2 transition-all duration-300",
          open
            ? "border-primary bg-primary shadow-[0_0_16px_-2px_var(--primary)]"
            : "border-border bg-background"
        )}
      />
      <div className="surface-panel border-border rounded-lg border">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-4 p-5 text-left"
        >
          <div>
            <h3 className="font-medium">{role.role}</h3>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs">
              {role.company} · {formatRange(role.startDate, role.endDate)}
            </p>
          </div>
          <span
            className={cn(
              "text-muted-foreground mt-1 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open && "rotate-45"
            )}
            aria-hidden
          >
            +
          </span>
        </button>

        <div
          className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="border-border grid gap-6 border-t p-5 sm:grid-cols-2">
              {FIELDS.map(({ key, label }) => {
                const value = role[key];
                if (!value || (Array.isArray(value) && value.length === 0))
                  return null;
                return (
                  <div key={key} className="flex flex-col gap-2">
                    <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
                      {label}
                    </h4>
                    <EntryDetail value={value} />
                  </div>
                );
              })}

              {role.metrics.length > 0 && (
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
                    Metrics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="border-border rounded-md border px-2.5 py-1 font-mono text-xs"
                      >
                        {m.label}:{" "}
                        <span className="text-primary">{m.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tech.length > 0 && (
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
                    Technologies
                  </h4>
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
                </div>
              )}

              {relatedProjects.length > 0 && (
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <h4 className="text-copper font-mono text-[11px] tracking-[0.1em] uppercase">
                    Related projects
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {relatedProjects.map((p) => (
                      <a
                        key={p.slug}
                        href={`#project-${p.slug}`}
                        className="text-primary text-sm hover:underline"
                      >
                        {p.name} →
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function ExperienceTimeline({ roles }: { roles: Experience[] }) {
  return (
    <ol className="border-border flex flex-col gap-5 border-l">
      {roles.map((role, i) => (
        <ExperienceEntry key={role.slug} role={role} index={i} />
      ))}
    </ol>
  );
}

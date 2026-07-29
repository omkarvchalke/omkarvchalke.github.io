"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Technology } from "@/content/types";
import {
  experienceUsingTechnology,
  projectsUsingTechnology,
  publicationsUsingTechnology,
} from "@/content/graph";
import { useGraphHover } from "@/lib/use-graph-hover";
import { cn } from "@/lib/utils";

function polar(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.round((50 + radius * Math.sin(rad)) * 10000) / 10000,
    y: Math.round((50 - radius * Math.cos(rad)) * 10000) / 10000,
  };
}

interface EcosystemGraphProps {
  technologies: Technology[];
  edges: [string, string][];
}

export function EcosystemGraph({ technologies, edges }: EcosystemGraphProps) {
  const { active, setActive, bind } = useGraphHover<string>();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && technologies.some((t) => t.slug === hash)) {
      setActive(hash);
    }
  }, [technologies, setActive]);

  const positions = new Map(
    technologies.map((t, i) => [
      t.slug,
      polar((360 / technologies.length) * i, 42),
    ])
  );

  const neighbors = new Set<string>();
  if (active) {
    edges.forEach(([a, b]) => {
      if (a === active) neighbors.add(b);
      if (b === active) neighbors.add(a);
    });
  }

  const activeTech = active
    ? technologies.find((t) => t.slug === active)
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="border-border bg-card relative aspect-square rounded-lg border">
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {edges.map(([a, b]) => {
            const pa = positions.get(a);
            const pb = positions.get(b);
            if (!pa || !pb) return null;
            const lit = active === a || active === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke="currentColor"
                strokeWidth={lit ? 0.35 : 0.15}
                className={cn(lit ? "text-primary" : "text-border")}
                opacity={active && !lit ? 0.15 : 0.5}
              />
            );
          })}
        </svg>

        {technologies.map((tech) => {
          const p = positions.get(tech.slug)!;
          const lit = active === tech.slug || neighbors.has(tech.slug);
          return (
            <button
              key={tech.slug}
              type="button"
              {...bind(tech.slug)}
              id={tech.slug}
              aria-label={tech.name}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 p-1.5"
            >
              <span
                className={cn(
                  "size-2 rounded-full border transition-all duration-200",
                  lit
                    ? "border-primary bg-primary scale-125"
                    : "border-border bg-background",
                  active && !lit && "opacity-30"
                )}
              />
              <span
                className={cn(
                  "font-mono text-[10px] whitespace-nowrap transition-opacity duration-200",
                  lit ? "text-foreground" : "text-muted-foreground opacity-70",
                  active && !lit && "opacity-20"
                )}
              >
                {tech.name}
              </span>
            </button>
          );
        })}
      </div>

      <aside className="border-border bg-card rounded-lg border p-5">
        {activeTech ? (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-copper font-mono text-[11px] tracking-[0.08em] uppercase">
                {activeTech.category}
              </span>
              <h3 className="font-medium">{activeTech.name}</h3>
            </div>
            <RelatedList
              label="Projects"
              items={projectsUsingTechnology(activeTech.slug).map((p) => ({
                key: p.slug,
                label: p.name,
                href: `/projects/${p.slug}`,
              }))}
            />
            <RelatedList
              label="Experience"
              items={experienceUsingTechnology(activeTech.slug).map((e) => ({
                key: e.slug,
                label: `${e.role} · ${e.company}`,
                href: "/experience",
              }))}
            />
            <RelatedList
              label="Publications"
              items={publicationsUsingTechnology(activeTech.slug).map((p) => ({
                key: p.slug,
                label: p.title,
                href: `/publications/${p.slug}`,
              }))}
            />
          </div>
        ) : (
          <p className="text-muted-foreground font-mono text-xs">
            Hover or focus a technology to see where it&apos;s used.
          </p>
        )}
      </aside>
    </div>
  );
}

function RelatedList({
  label,
  items,
}: {
  label: string;
  items: { key: string; label: string; href: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-muted-foreground font-mono text-[11px] tracking-[0.08em] uppercase">
        {label}
      </h4>
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="text-primary text-sm hover:underline"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  disciplineEdges,
  disciplineNodes,
  type DisciplineNode,
} from "@/content/disciplines";
import { experienceByDiscipline, projectsByDiscipline } from "@/content/graph";
import type { Discipline } from "@/content/types";
import { cn } from "@/lib/utils";

const RADIUS: Record<DisciplineNode["ring"], number> = {
  core: 29,
  extended: 44,
};

function polarToPercent(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  // Rounded to 4dp: Math.sin/cos can differ in their last bit between the
  // server's V8 and the client's, which otherwise serializes to a different
  // string on each side and trips a hydration mismatch.
  return {
    x: Math.round((50 + radius * Math.sin(rad)) * 10000) / 10000,
    y: Math.round((50 - radius * Math.cos(rad)) * 10000) / 10000,
  };
}

const positions = new Map(
  disciplineNodes.map((n) => [n.slug, polarToPercent(n.angle, RADIUS[n.ring])])
);

function neighborsOf(slug: Discipline): Set<Discipline> {
  const set = new Set<Discipline>();
  for (const [a, b] of disciplineEdges) {
    if (a === slug) set.add(b);
    if (b === slug) set.add(a);
  }
  return set;
}

interface NodeEcosystemProps {
  name: string;
}

export function NodeEcosystem({ name }: NodeEcosystemProps) {
  const [active, setActive] = useState<Discipline | null>(null);
  const neighbors = useMemo(
    () => (active ? neighborsOf(active) : new Set<Discipline>()),
    [active]
  );

  const isLit = (slug: Discipline) => active === slug || neighbors.has(slug);

  const activeNode = active
    ? disciplineNodes.find((n) => n.slug === active)
    : null;
  const activeCounts = active
    ? {
        projects: projectsByDiscipline(active).length,
        experience: experienceByDiscipline(active).length,
      }
    : null;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg select-none">
      {/* Soft glow behind the center — brightens when a node is active,
          so the graph reads as reacting, not just static wiring. */}
      <div
        aria-hidden
        className={cn(
          "absolute top-1/2 left-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-500",
          active ? "opacity-80" : "opacity-40"
        )}
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {/* Ambient flowing data paths — the brief's "background feels alive"
            requirement, not decoration: slow, low-opacity, purposeful. */}
        <g fill="none">
          <path
            d="M -10,20 C 20,5 40,35 55,15 S 90,10 110,25"
            strokeWidth="0.4"
            strokeDasharray="2 3"
            className="text-primary/[0.18] animate-flow"
            stroke="currentColor"
          />
          <path
            d="M -10,75 C 25,90 45,60 65,80 S 95,95 110,78"
            strokeWidth="0.4"
            strokeDasharray="2 3"
            className="text-copper/[0.16] animate-flow [animation-delay:-4s]"
            stroke="currentColor"
          />
        </g>

        {/* spokes: center to every node */}
        {disciplineNodes.map((node) => {
          const p = positions.get(node.slug)!;
          const lit = isLit(node.slug) || active === node.slug;
          return (
            <line
              key={`spoke-${node.slug}`}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              className={cn(
                "transition-all duration-300",
                lit ? "text-primary animate-dash-flow" : "text-border"
              )}
              stroke="currentColor"
              strokeWidth={lit ? 0.45 : 0.25}
              opacity={active && !lit ? 0.2 : 1}
            />
          );
        })}

        {/* curated inter-discipline adjacency */}
        {disciplineEdges.map(([a, b]) => {
          const pa = positions.get(a)!;
          const pb = positions.get(b)!;
          const lit = active === a || active === b;
          return (
            <line
              key={`edge-${a}-${b}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              className={cn(
                "transition-all duration-300",
                lit ? "text-primary animate-dash-flow" : "text-border"
              )}
              stroke="currentColor"
              strokeWidth={lit ? 0.4 : 0.2}
              opacity={active && !lit ? 0.12 : 0.6}
            />
          );
        })}
      </svg>

      {/* center: the name */}
      <div className="absolute inset-0 flex items-center justify-center px-16 text-center">
        <span
          className={cn(
            "font-heading text-xl leading-tight font-semibold text-balance transition-transform duration-300 sm:text-2xl",
            active && "scale-105"
          )}
        >
          {name}
        </span>
      </div>

      {/* discipline nodes */}
      {disciplineNodes.map((node) => {
        const p = positions.get(node.slug)!;
        const lit = isLit(node.slug);
        const isActive = active === node.slug;
        return (
          <button
            key={node.slug}
            type="button"
            onMouseEnter={() => setActive(node.slug)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(node.slug)}
            onBlur={() => setActive(null)}
            aria-label={node.label}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-full p-2"
          >
            <span className="relative flex size-2.5 items-center justify-center">
              {isActive && (
                <span
                  aria-hidden
                  className="bg-primary animate-pulse-glow absolute inline-flex size-full rounded-full blur-[3px]"
                />
              )}
              <span
                className={cn(
                  "relative size-2.5 rounded-full border transition-all duration-300",
                  lit
                    ? "border-primary bg-primary scale-125"
                    : "border-border bg-card",
                  active && !lit && "opacity-30"
                )}
              />
            </span>
            <span
              className={cn(
                "w-16 text-center font-mono text-[10px] leading-tight tracking-wide transition-all duration-300",
                lit
                  ? "text-foreground opacity-100"
                  : "text-muted-foreground opacity-70",
                active && !lit && "opacity-20"
              )}
            >
              {node.label}
            </span>
          </button>
        );
      })}

      {/* live count readout for the active node — 0 today, wired for Phase 5 */}
      <div
        aria-live="polite"
        className="absolute inset-x-0 bottom-0 flex justify-center"
      >
        <span
          className={cn(
            "text-muted-foreground font-mono text-[11px] transition-opacity duration-200",
            activeNode ? "opacity-100" : "opacity-0"
          )}
        >
          {activeNode &&
            activeCounts &&
            `${activeCounts.projects} project${activeCounts.projects === 1 ? "" : "s"} · ${activeCounts.experience} role${activeCounts.experience === 1 ? "" : "s"}`}
        </span>
      </div>
    </div>
  );
}

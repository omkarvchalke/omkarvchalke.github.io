"use client";

import {
  Cloud,
  Database,
  ExternalLink,
  Layers,
  Monitor,
  Server,
  Waypoints,
  Zap,
} from "lucide-react";
import type { ArchitectureDiagram, DiagramNodeKind } from "@/content/types";
import { useGraphHover } from "@/lib/use-graph-hover";
import { cn } from "@/lib/utils";

const KIND_META: Record<
  DiagramNodeKind,
  { icon: typeof Server; label: string }
> = {
  client: { icon: Monitor, label: "Client" },
  api: { icon: Waypoints, label: "API" },
  service: { icon: Server, label: "Service" },
  queue: { icon: Layers, label: "Queue" },
  database: { icon: Database, label: "Database" },
  cache: { icon: Zap, label: "Cache" },
  cloud: { icon: Cloud, label: "Cloud" },
  external: { icon: ExternalLink, label: "External" },
};

export function DiagramCanvas({ diagram }: { diagram: ArchitectureDiagram }) {
  const { active, bind } = useGraphHover<string>();
  const nodeById = new Map(diagram.nodes.map((n) => [n.id, n]));
  const activeNode = active ? nodeById.get(active) : null;

  const connected = new Set<string>();
  if (active) {
    diagram.edges.forEach((e) => {
      if (e.from === active) connected.add(e.to);
      if (e.to === active) connected.add(e.from);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="border-border bg-card relative aspect-[4/3] rounded-lg border">
        <svg
          viewBox="0 0 100 75"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {diagram.edges.map((edge) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            const lit = active === edge.from || active === edge.to;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y * 0.75}
                x2={to.x}
                y2={to.y * 0.75}
                stroke="currentColor"
                strokeWidth={lit ? 0.4 : 0.25}
                className={cn(
                  "transition-all duration-200",
                  lit ? "text-primary" : "text-border"
                )}
                opacity={active && !lit ? 0.25 : 0.8}
              />
            );
          })}
        </svg>

        {diagram.nodes.map((node) => {
          const meta = KIND_META[node.kind];
          const Icon = meta.icon;
          const lit = active === node.id || connected.has(node.id);
          return (
            <button
              key={node.id}
              type="button"
              {...bind(node.id)}
              aria-label={node.label}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-md p-2 transition-opacity",
                active && !lit && "opacity-30"
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-md border transition-colors",
                  lit
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="text-muted-foreground font-mono text-[10px] whitespace-nowrap">
                {node.label}
              </span>
            </button>
          );
        })}
      </div>

      <aside className="border-border bg-card rounded-lg border p-5">
        {activeNode ? (
          <div className="flex flex-col gap-2">
            <span className="text-copper font-mono text-[11px] tracking-[0.08em] uppercase">
              {KIND_META[activeNode.kind].label}
            </span>
            <h3 className="font-medium">{activeNode.label}</h3>
            <p className="text-muted-foreground text-sm">
              {activeNode.description}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground font-mono text-xs">
            Hover or focus a component to see what it does.
          </p>
        )}
      </aside>
    </div>
  );
}

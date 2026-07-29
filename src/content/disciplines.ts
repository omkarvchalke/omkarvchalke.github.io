import type { Discipline } from "./types";

/**
 * The hero's node ecosystem (Phase 4). Positions are hand-placed on two
 * rings, not evenly auto-distributed — "core" disciplines sit closer to the
 * center than "extended" ones, so radius itself carries meaning instead of
 * being a decorative circle. Angles are in degrees, 0 = due north (top),
 * clockwise.
 */
export interface DisciplineNode {
  slug: Discipline;
  label: string;
  ring: "core" | "extended";
  angle: number;
}

export const disciplineNodes: DisciplineNode[] = [
  { slug: "backend", label: "Backend", ring: "core", angle: 0 },
  { slug: "cloud", label: "Cloud", ring: "core", angle: 80 },
  { slug: "data", label: "Data Engineering", ring: "core", angle: 155 },
  { slug: "frontend", label: "Frontend", ring: "core", angle: 240 },
  { slug: "architecture", label: "Architecture", ring: "core", angle: 305 },
  { slug: "databases", label: "Databases", ring: "extended", angle: 35 },
  {
    slug: "ai",
    label: "Artificial Intelligence",
    ring: "extended",
    angle: 115,
  },
  { slug: "research", label: "Research", ring: "extended", angle: 190 },
  { slug: "open-source", label: "Open Source", ring: "extended", angle: 270 },
];

/**
 * Curated adjacency — which disciplines actually relate to which in
 * practice — not a full mesh. A full 9-node mesh (36 edges) would read as
 * noise; this is a deliberate map of real professional adjacency.
 */
export const disciplineEdges: [Discipline, Discipline][] = [
  ["backend", "databases"],
  ["backend", "cloud"],
  ["backend", "architecture"],
  ["backend", "open-source"],
  ["cloud", "architecture"],
  ["data", "databases"],
  ["data", "ai"],
  ["ai", "research"],
  ["frontend", "backend"],
  ["architecture", "data"],
];

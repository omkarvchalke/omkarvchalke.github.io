/**
 * The content graph (Phase 1 §5.2): Project / Experience / Technology /
 * Publication are modeled once as typed, relation-linked entities. Every
 * page (hero nodes, Projects index, Tech Ecosystem graph, Architecture
 * Gallery, Experience timeline) is a rendering of this same data, filtered
 * or joined differently — not separately hand-written per page.
 */

export type Discipline =
  | "backend"
  | "cloud"
  | "data"
  | "ai"
  | "research"
  | "frontend"
  | "architecture"
  | "databases"
  | "open-source";

export type TechnologyCategory =
  | "language"
  | "framework"
  | "database"
  | "infrastructure"
  | "platform"
  | "tooling";

export interface Technology {
  slug: string;
  name: string;
  category: TechnologyCategory;
  disciplines: Discipline[];
}

export interface Metric {
  label: string;
  value: string;
}

/**
 * Fixed case-study template (Phase 1 §5.4). Keeping every project
 * structurally identical is what lets graph relations (tech ↔ project ↔
 * experience) stay consistent instead of ad hoc.
 */
export interface Project {
  slug: string;
  name: string;
  summary: string;
  problem: string;
  architecture: string;
  techSlugs: string[];
  database?: string;
  infrastructure?: string;
  apiFlow?: string;
  deployment?: string;
  challenges: string[];
  tradeoffs: string[];
  metrics: Metric[];
  lessons: string[];
  screenshots?: string[];
  demoUrl?: string;
  githubUrl?: string;
  hasArchitectureDiagram: boolean;
  disciplines: Discipline[];
  relatedExperienceSlugs?: string[];
  /** Full case study (all fields authored) vs. a lighter index entry — see
   * Phase 1 §Decisions on the 6+ project count/depth tradeoff. */
  depth: "full" | "light";
}

export interface Experience {
  slug: string;
  company: string;
  role: string;
  startDate: string; // ISO yyyy-mm
  endDate?: string; // undefined = present
  overview: string;
  architecture?: string;
  challenges: string[];
  responsibilities: string[];
  impact: string[];
  techSlugs: string[];
  disciplines: Discipline[];
  metrics: Metric[];
  screenshots?: string[];
  relatedProjectSlugs?: string[];
}

export interface Publication {
  slug: string;
  title: string;
  abstract: string;
  problem: string;
  methods: string;
  techSlugs: string[];
  citation: string;
  pdfUrl?: string;
  relatedProjectSlug?: string;
  images?: string[];
}

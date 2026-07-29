import {
  BarChart3,
  Blocks,
  Boxes,
  Brain,
  Cloud,
  CloudCog,
  Code2,
  Database,
  FlaskConical,
  GitBranch,
  HardDrive,
  MonitorSmartphone,
  Server,
  ServerCog,
  Wrench,
} from "lucide-react";
import type { Discipline, TechnologyCategory } from "@/content/types";

type IconComponent = React.ComponentType<{ className?: string }>;

/** One icon per technology category — used on tech badges so a scan of a
 * project's stack reads shape-first (database vs. framework vs. platform)
 * instead of requiring every name to be read individually. */
export const TECH_CATEGORY_ICONS: Record<TechnologyCategory, IconComponent> = {
  language: Code2,
  framework: Blocks,
  database: Database,
  infrastructure: Server,
  platform: Cloud,
  tooling: Wrench,
};

/** One icon per discipline — used on the Projects filter chips. */
export const DISCIPLINE_ICONS: Record<Discipline, IconComponent> = {
  backend: ServerCog,
  cloud: CloudCog,
  data: BarChart3,
  ai: Brain,
  research: FlaskConical,
  frontend: MonitorSmartphone,
  architecture: Boxes,
  databases: HardDrive,
  "open-source": GitBranch,
};

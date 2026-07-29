import type { Technology } from "@/content/types";
import { TECH_CATEGORY_ICONS } from "./category-icons";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  technology: Technology;
  /** Anchor href (e.g. `#slug` into the Ecosystem graph) — renders a plain
   * span instead when omitted, for contexts with no matching target. */
  href?: string;
  className?: string;
}

export function TechBadge({ technology, href, className }: TechBadgeProps) {
  const Icon = TECH_CATEGORY_ICONS[technology.category];
  const classes = cn(
    "border-border text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px]",
    href && "hover:border-primary hover:text-primary transition-colors",
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        <Icon className="size-3" aria-hidden />
        {technology.name}
      </a>
    );
  }

  return (
    <span className={classes}>
      <Icon className="size-3" aria-hidden />
      {technology.name}
    </span>
  );
}

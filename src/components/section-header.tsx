interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** lucide icons and our hand-rolled brand SVGs (e.g. GitHubIcon) both
   * fit this shape, so either can be passed here. */
  icon?: React.ComponentType<{ className?: string }>;
}

/** The one heading pattern every major section uses (Phase 2 §05 Fig
 * pattern) — eyebrow, heading, optional description — kept as a single
 * component so it can't silently drift per page. The icon badge gives each
 * of the site's nine sections a distinct visual anchor instead of every
 * one opening with an identical text-only header. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex items-start gap-4">
      {Icon && (
        <span className="border-primary/25 bg-primary/10 text-primary hidden size-11 shrink-0 items-center justify-center rounded-lg border sm:flex">
          <Icon className="size-5" />
        </span>
      )}
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase">
          <span className="bg-primary inline-block h-px w-3" />
          {eyebrow}
        </span>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground max-w-2xl text-pretty">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

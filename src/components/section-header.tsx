interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/** The one heading pattern every major section uses (Phase 2 §05 Fig
 * pattern) — eyebrow, heading, optional description — kept as a single
 * component so it can't silently drift per page. */
export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-3">
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
  );
}

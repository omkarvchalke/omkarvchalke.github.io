interface PagePlaceholderProps {
  eyebrow: string;
  title: string;
  phase: string;
}

/** Structural stand-in for routes not yet built — real content and layout
 * land in Phase 4 (Home) / Phase 5 (everything else). Confirms routing,
 * fonts, and tokens work end to end before any page is designed. */
export function PagePlaceholder({
  eyebrow,
  title,
  phase,
}: PagePlaceholderProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
        {eyebrow}
      </span>
      <h1 className="max-w-xl text-4xl font-semibold text-balance">{title}</h1>
      <span className="border-border text-muted-foreground rounded-md border px-3 py-1 font-mono text-xs">
        {phase}
      </span>
    </main>
  );
}

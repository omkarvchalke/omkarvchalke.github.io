interface EmptyStateProps {
  message: string;
}

/** The honest zero-content state — used instead of fake placeholder cards
 * everywhere the content graph is still empty pending real data. */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="border-border rounded-lg border border-dashed px-6 py-16 text-center">
      <p className="text-muted-foreground font-mono text-sm">{message}</p>
    </div>
  );
}

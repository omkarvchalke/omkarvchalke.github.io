import { SectionHeader } from "@/components/section-header";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Alternates a near-imperceptible background tint between sections —
   * enough to give the single-scroll page rhythm without introducing a
   * visible "band" (still just the same neutral palette). */
  tone?: "base" | "tint";
  children: React.ReactNode;
}

/** One consistent section wrapper (id for the nav anchor, scroll-mt for the
 * sticky nav offset, a divider rhythm) used by every section on the
 * single-scroll page. */
export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  icon,
  tone = "base",
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "border-border scroll-mt-20 border-t py-20 sm:py-24",
        tone === "tint" && "bg-card/40"
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          icon={icon}
        />
        {children}
      </div>
    </section>
  );
}

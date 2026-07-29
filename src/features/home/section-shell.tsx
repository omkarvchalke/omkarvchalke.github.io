import { SectionHeader } from "@/components/section-header";

interface SectionShellProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
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
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className="border-border scroll-mt-20 border-t py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        {children}
      </div>
    </section>
  );
}

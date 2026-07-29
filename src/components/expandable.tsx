"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ExpandableProps {
  header: (open: boolean) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Anchor id — also makes the item auto-expand when a same-page link
   * navigates to it (e.g. a project's "View architecture diagram ↓"
   * pointing at `#architecture-<slug>`), not just scroll to its header. */
  id?: string;
}

/** Shared accordion shell (header button + grid-rows expand) — the pattern
 * Experience entries used, now reused for Projects and Architecture on the
 * single-scroll page so long-form content stays collapsed by default
 * instead of making the page enormous. */
export function Expandable({
  header,
  children,
  className,
  id,
}: ExpandableProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const checkHash = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [id]);

  return (
    <div
      id={id}
      className={cn(
        "surface-panel border-border scroll-mt-20 rounded-lg border",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        {header(open)}
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-border border-t p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ExpandChevron({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "text-muted-foreground mt-1 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        open && "rotate-45"
      )}
      aria-hidden
    >
      +
    </span>
  );
}

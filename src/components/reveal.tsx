"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms — pass index * 60 from a list for a cascading reveal. */
  delay?: number;
  /** Render as this element instead of a wrapping div — required inside
   * <ul>/<ol> (pass "li"), where a wrapping div breaks list semantics
   * (axe: "list must only directly contain li"). */
  as?: "div" | "li";
  /** Anchor target for same-page cross-links (e.g. "experience-<slug>"). */
  id?: string;
}

/**
 * Scroll-triggered fade-up, once per element (Phase 2 §04 motion table:
 * "scroll into view" → "reading sequence, one idea at a time", 400-520ms,
 * ease-out-eng curve — cubic-bezier(0.16,1,0.3,1), used as a Tailwind
 * arbitrary value rather than a named `ease-*`/`duration-*` utility: Tailwind
 * v4 doesn't pick up custom non-numeric keys added to those two theme
 * namespaces (verified — `--duration-fast`/`--ease-out-eng` registered as
 * theme variables but generated no matching utility class). Shared here so
 * every page's list/grid gets the same reveal rhythm instead of each one
 * reinventing an IntersectionObserver.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  id,
}: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      id={id}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0",
        className
      )}
    >
      {children}
    </Tag>
  );
}

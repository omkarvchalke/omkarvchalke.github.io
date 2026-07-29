"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "./scroll-progress";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Architecture" },
  { id: "publications", label: "Publications" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "achievements", label: "Achievements" },
  { id: "leadership", label: "Leadership" },
  { id: "extracurricular", label: "Extra-Curricular" },
  { id: "contact", label: "Contact" },
];

export function SiteNav() {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Scroll-spy: everything lives on one page now, so "active" means
  // "currently in view" rather than "current route". A thin trigger band
  // just below the sticky nav decides which section counts as current.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <ScrollProgress />
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        <a
          href="#"
          className="shrink-0 font-mono text-sm font-medium tracking-wide"
        >
          OVC
        </a>
        <ul className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] sm:gap-1 sm:[mask-image:none]">
          {LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id} className="relative shrink-0">
                <a
                  href={`#${link.id}`}
                  className={cn(
                    "hover:bg-primary/5 relative rounded-md px-2.5 py-2 text-sm whitespace-nowrap transition-all duration-300 sm:px-3",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden
                      className="bg-primary absolute right-2.5 -bottom-[1px] left-2.5 h-px shadow-[0_0_8px_var(--primary)] sm:right-3 sm:left-3"
                    />
                  )}
                </a>
              </li>
            );
          })}
          <li aria-hidden className="w-2 shrink-0" />
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}

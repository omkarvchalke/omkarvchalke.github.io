"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/projects", label: "Work" },
  { href: "/architecture", label: "Architecture" },
  { href: "/publications", label: "Publications" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/github", label: "GitHub" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        <Link
          href="/"
          className="shrink-0 font-mono text-sm font-medium tracking-wide"
        >
          OVC
        </Link>
        <ul className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] sm:gap-1 sm:[mask-image:none]">
          {LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} className="relative shrink-0">
                <Link
                  href={link.href}
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
                </Link>
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

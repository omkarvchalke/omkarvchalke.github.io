"use client";

import { useEffect, useState } from "react";

/** Thin progress bar tracking scroll position through the single-scroll
 * page — a small but purposeful cue for "how much is left," which matters
 * more now that the whole site is one continuous document. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="bg-border/40 absolute inset-x-0 bottom-0 h-[2px] overflow-hidden">
      <div
        className="bg-primary h-full shadow-[0_0_8px_var(--primary)] transition-[width] duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

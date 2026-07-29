"use client";

import { useState } from "react";

/** Shared hover/focus-to-highlight behavior for every node graph in the
 * site (hero disciplines, Tech Ecosystem, Architecture diagrams) — the
 * visual layout differs per page, this is just the interaction state. */
export function useGraphHover<T extends string>() {
  const [active, setActive] = useState<T | null>(null);

  function bind(id: T) {
    return {
      onMouseEnter: () => setActive(id),
      onMouseLeave: () => setActive(null),
      onFocus: () => setActive(id),
      onBlur: () => setActive(null),
    };
  }

  return { active, setActive, bind };
}

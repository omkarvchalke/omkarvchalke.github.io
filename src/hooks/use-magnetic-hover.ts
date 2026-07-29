"use client";

import { useEffect, useRef } from "react";

/** Nudges an element a few pixels toward the cursor while hovered, then
 * springs back on leave — a restrained pull on primary CTAs, not a cursor
 * replacement. Off entirely for prefers-reduced-motion and any pointer
 * that isn't a mouse (touch has no hover to magnetize toward). Mutates
 * the DOM node directly via ref rather than React state so tracking stays
 * smooth at mousemove frequency. */
export function useMagneticHover<T extends HTMLElement>(
  strength = 0.3,
  max = 10
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-max, Math.min(max, dx * strength));
      const y = Math.max(-max, Math.min(max, dy * strength));
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const handleLeave = () => {
      el.style.transform = "";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength, max]);

  return ref;
}

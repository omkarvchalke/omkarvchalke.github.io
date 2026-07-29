"use client";

import type { AnchorHTMLAttributes } from "react";
import { useMagneticHover } from "@/hooks/use-magnetic-hover";

type MagneticLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/** A plain anchor with a restrained magnetic-hover pull applied — split
 * into its own client component so pages that render a CTA don't need to
 * become client components just to get the effect. */
export function MagneticLink({ children, ...props }: MagneticLinkProps) {
  const ref = useMagneticHover<HTMLAnchorElement>();
  return (
    <a ref={ref} {...props}>
      {children}
    </a>
  );
}

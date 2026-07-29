import type { MetadataRoute } from "next";

// Update NEXT_PUBLIC_SITE_URL once the real domain/GitHub Pages URL is
// known (see docs/planning/phase-3-project-structure.md — basePath is
// computed at deploy time from the repo name).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://omkarvchalke.github.io";

// Required for metadata route handlers under `output: "export"` — Next
// can't infer static-ability for these the way it does for page.tsx.
export const dynamic = "force-static";

// Single-page site (see docs/planning/phase-9-single-page.md) — everything
// lives at "/", so there's only one URL to list. Section anchors
// (#work, #contact, ...) aren't separate documents and don't belong in a
// sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date() }];
}

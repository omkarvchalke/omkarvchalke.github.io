import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { publications } from "@/content/publications";

// Update NEXT_PUBLIC_SITE_URL once the real domain/GitHub Pages URL is
// known (see docs/planning/phase-3-project-structure.md — basePath is
// computed at deploy time from the repo name).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://omkarvchalke.github.io";

// Required for metadata route handlers under `output: "export"` — Next
// can't infer static-ability for these the way it does for page.tsx.
export const dynamic = "force-static";

const STATIC_ROUTES = [
  "",
  "/about",
  "/experience",
  "/projects",
  "/architecture",
  "/publications",
  "/ecosystem",
  "/github",
  "/achievements",
  "/resume",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const projectEntries = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  const architectureEntries = projects
    .filter((p) => p.hasArchitectureDiagram)
    .map((p) => ({
      url: `${SITE_URL}/architecture/${p.slug}`,
      lastModified: new Date(),
    }));

  const publicationEntries = publications.map((p) => ({
    url: `${SITE_URL}/publications/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticEntries,
    ...projectEntries,
    ...architectureEntries,
    ...publicationEntries,
  ];
}

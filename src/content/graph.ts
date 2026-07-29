import { technologies } from "./technologies";
import { projects } from "./projects";
import { experience } from "./experience";
import { publications } from "./publications";
import type { Discipline, Technology } from "./types";

/**
 * Relation queries over the content graph. These are what every
 * cross-linked view (hero nodes, Tech Ecosystem, Architecture Gallery,
 * "related" rails on a project/experience/publication page) calls into —
 * there is no per-page duplicated relation logic.
 */

export function getTechnology(slug: string): Technology | undefined {
  return technologies.find((t) => t.slug === slug);
}

export function projectsUsingTechnology(slug: string) {
  return projects.filter((p) => p.techSlugs.includes(slug));
}

export function experienceUsingTechnology(slug: string) {
  return experience.filter((e) => e.techSlugs.includes(slug));
}

export function publicationsUsingTechnology(slug: string) {
  return publications.filter((p) => p.techSlugs.includes(slug));
}

export function technologiesForProject(slug: string): Technology[] {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return [];
  return project.techSlugs
    .map(getTechnology)
    .filter((t): t is Technology => Boolean(t));
}

export function experienceForProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project?.relatedExperienceSlugs) return [];
  return experience.filter((e) =>
    project.relatedExperienceSlugs?.includes(e.slug)
  );
}

export function projectsForExperience(slug: string) {
  const role = experience.find((e) => e.slug === slug);
  if (!role?.relatedProjectSlugs) return [];
  return projects.filter((p) => role.relatedProjectSlugs?.includes(p.slug));
}

export function projectForPublication(slug: string) {
  const publication = publications.find((p) => p.slug === slug);
  if (!publication?.relatedProjectSlug) return undefined;
  return projects.find((p) => p.slug === publication.relatedProjectSlug);
}

export function featuredProjects() {
  return projects.filter((p) => p.depth === "full");
}

/** Powers the hero node ecosystem's hover counts (Phase 4). */
export function projectsByDiscipline(discipline: Discipline) {
  return projects.filter((p) => p.disciplines.includes(discipline));
}

export function experienceByDiscipline(discipline: Discipline) {
  return experience.filter((e) => e.disciplines.includes(discipline));
}

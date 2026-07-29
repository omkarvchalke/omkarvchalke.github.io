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

/**
 * Powers the Technology Ecosystem graph: which technologies actually get
 * used together, computed from real project/experience tech stacks rather
 * than curated by hand (unlike the hero's discipline adjacency, this isn't
 * editorial — it's derived from the data).
 */
export function technologyCooccurrence(): [string, string][] {
  const pairs = new Set<string>();
  const result: [string, string][] = [];
  const addFromGroup = (slugs: string[]) => {
    for (let i = 0; i < slugs.length; i++) {
      for (let j = i + 1; j < slugs.length; j++) {
        const key = [slugs[i], slugs[j]].sort().join("::");
        if (!pairs.has(key)) {
          pairs.add(key);
          result.push([slugs[i], slugs[j]]);
        }
      }
    }
  };
  projects.forEach((p) => addFromGroup(p.techSlugs));
  experience.forEach((e) => addFromGroup(e.techSlugs));
  return result;
}

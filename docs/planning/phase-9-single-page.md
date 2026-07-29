# Phase 9 — Single-Page Pivot

Status: implemented, supersedes the multi-page structure built in Phases 3–8.

---

## 1. The ask, and the tradeoff flagged before building it

You asked what a single-page portfolio would look like. The honest tradeoff, given verbatim before implementing: a true single-page version means folding all 7 project case studies (each already a full page — Problem/Architecture/Challenges/Tradeoffs/Metrics/Lessons/diagram), Publications, and the live GitHub dashboard into one scroll, which buries the depth built in Phases 5–8 and gives up per-project shareable/SEO URLs (a recruiter or you linking someone directly to `/projects/illiniassist-ai`) — an explicit Phase 1 goal. Offered a middle ground (richer homepage narrative + links out to the still-separate deep pages). You confirmed you wanted the full collapse regardless: "yes make everything in single scroll."

## 2. What actually changed

- `src/app/page.tsx` went from a thin Hero-only page to assembling Hero + nine sections (`src/features/home/*-section.tsx`).
- All 13 route files under `src/app/` (`about/`, `experience/`, `projects/` + `[slug]`, `architecture/` + `[project]`, `publications/` + `[slug]`, `ecosystem/`, `github/`, `achievements/`, `resume/`, `contact/`) were deleted. Their content and logic moved into the corresponding `*-section.tsx`, mostly by reusing the same feature components (`ExperienceTimeline`, `EcosystemGraph`, `GitHubDashboard`, `ContactForm`, `DiagramCanvas`) directly rather than rewriting them.
- Now-orphaned components were deleted rather than left as dead code: `ProjectCard`, `ProjectDetail`, `ProjectExplorer`, `PageContainer`.
- `SiteNav` changed from route links + `usePathname()` active-state matching to `#anchor` links + an `IntersectionObserver`-based scroll-spy, since there's no route to compare against anymore.
- A shared `<Expandable>` accordion (`src/components/expandable.tsx`) was extracted from the pattern `ExperienceEntry` already used, and applied to Projects and Architecture — a genuinely important design call, not just a refactor: a single page with 7 full case studies and 4 interactive diagrams permanently unfolded would be an unusable ~20,000px scroll. Collapsed-by-default with click-to-expand keeps "everything on one page" true without making the page itself unusable.
- Cross-links (project ↔ its architecture diagram, project ↔ the experience it grew out of, tech badge ↔ its Ecosystem graph node) became same-page `#anchor` links instead of `next/link` route links. `Expandable` additionally listens for the `hashchange` event so clicking "View architecture diagram ↓" doesn't just scroll to a collapsed header — it opens it too.
- `sitemap.ts` dropped from ~15 URLs (every project/publication/architecture page) to one — `/`.

## 3. Two real bugs this surfaced, not just refactor risk

**Server/Client boundary violation.** `architecture-section.tsx` and `publications-section.tsx` passed a function prop (`header={(open) => ...}`) into `<Expandable>`, a Client Component, without being Client Components themselves. This isn't valid in the App Router — functions can't cross the server→client serialization boundary — and it failed the build outright (`Functions cannot be passed directly to Client Components`), not silently. Fixed by adding `"use client"` to both files, matching the pattern `projects-section.tsx` already used correctly.

**Heading hierarchy, again.** Collapsing eleven pages (each with its own `<h1>` via `SectionHeader`) into one page broke the one-`<h1>`-per-page rule the moment `SectionHeader` kept emitting `<h1>` for every section. Every heading level nested below it needed to shift down by exactly one: `SectionHeader` h1→h2; each section's item-level heading (project/publication/experience-entry name) h2→h3 or h3→h4 depending on how deeply it was already nested; the diagram/ecosystem "active node" aside headings needed _different_ target levels from each other specifically because they're mounted in different contexts now — `EcosystemGraph`'s aside sits directly under its section's `<h2>` (needs `<h3>`), while `DiagramCanvas`'s aside is nested inside an Architecture accordion's `<h3>` header (needs `<h4>`). Verified with a full `@axe-core/playwright` scan in both the default (all-collapsed) and fully-expanded (every accordion clicked open) states, both themes: zero violations either way.

## 4. What this cost, honestly

- **No per-project or per-publication URL.** Nothing to share except the one homepage link plus an anchor fragment (`omkarvchalke.github.io/#project-illiniassist-ai`), which isn't a real, independently-indexable page for search engines the way `/projects/illiniassist-ai` was.
- **`sitemap.xml` carries one URL.** Search engines have one page to rank instead of ~15 individually-relevant ones.
- **First Load JS is heavier** (~226kB vs. the old homepage's ~140kB) since every section's client component ships on the one page instead of being split across routes — still a reasonable budget for a static portfolio, but worth knowing this traded some code-splitting for the single-scroll experience.
- **In exchange:** zero dynamic routes left in the app at all, which means the Phase 3–8 caveat ("`npm run build` fails until at least one project and publication exist") is now structurally impossible to hit — the static export always succeeds regardless of content state.

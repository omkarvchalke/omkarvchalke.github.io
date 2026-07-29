# OVC Portfolio

A portfolio engineered like a product, not a template — a single-page, single-scroll site where every section (About, Experience, Projects, Architecture, Publications, Ecosystem, GitHub, Achievements, Contact) is cross-linked through one content graph (Project ↔ Technology ↔ Experience ↔ Publication), so the site reads as a connected engineering knowledge base rather than a stack of disconnected sections.

Design rationale lives in [`docs/planning/`](docs/planning) — Phases 1–9 (research/IA, design system, project structure, homepage, remaining pages, motion, SEO/accessibility, a visual richness pass, and the single-page pivot) are all implemented in this repo. **About/Experience/Achievements/Publications content is explicit, clearly-bracketed placeholder** (e.g. `[Company Name]`) pending the real thing via [`docs/content/INTAKE.md`](docs/content/INTAKE.md) — **Projects and Technologies are real**, sourced directly from the GitHub repos at `github.com/omkarvchalke`.

## Stack

| Concern    | Choice                                                        | Why                                                                                                                                  |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Framework  | Next.js 15 (App Router), React 19, TypeScript                 | Pinned to 15 per the brief even though `create-next-app@latest` currently resolves to 16                                             |
| Styling    | Tailwind CSS v4 (CSS-first `@theme`)                          | Design tokens (Phase 2) live as CSS custom properties, no JS config file                                                             |
| Components | shadcn/ui (`base-nova` style, Base UI primitives)             | Copy-in components themed entirely through our CSS variables — no separate component palette to maintain                             |
| Motion     | `motion` (Framer Motion's current package name)               |                                                                                                                                      |
| Icons      | lucide-react (+ two hand-rolled brand SVGs — see below)       |                                                                                                                                      |
| Forms      | react-hook-form + zod                                         |                                                                                                                                      |
| Theme      | next-themes, `defaultTheme="dark"`, `enableSystem`            | Dark-first per the brief; light theme fully specified and reachable via the nav's theme toggle (`src/features/nav/theme-toggle.tsx`) |
| Deployment | Static export (`output: "export"`) → GitHub Pages via Actions | See [Static hosting](#static-hosting)                                                                                                |

`lucide-react`'s current major version dropped brand/logo glyphs (GitHub, LinkedIn, etc.) — `src/components/brand-icons.tsx` has two small inline SVGs for those instead of pulling in a separate icon package.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run typecheck
npm run lint
npm run format:check   # `npm run format` to write
npm run build      # static export, output in /out
```

## Single-page architecture

Everything lives at `/` — there is no client-side routing, no separate pages per section. `src/app/page.tsx` assembles the Hero plus eight sections in order:

```
src/features/home/
  section-shell.tsx        shared wrapper: id anchor, scroll-mt offset, heading
  about-section.tsx  experience-section.tsx  projects-section.tsx
  architecture-section.tsx  publications-section.tsx  ecosystem-section.tsx
  achievements-section.tsx  contact-section.tsx
```

- **Nav is scroll-spy, not routing**: `src/features/nav/site-nav.tsx` watches each section with an `IntersectionObserver` and highlights whichever one is currently in view; every link is a plain `#anchor`, not a Next.js route.
- **Long content collapses by default**: Projects (7 full case studies) and Architecture (4 interactive diagrams) use a shared `<Expandable>` accordion (`src/components/expandable.tsx`) so the page doesn't force a 20,000px scroll by default — click a project to expand its full Problem/Architecture/Challenges/Tradeoffs/Metrics/Lessons template in place.
- **Cross-links jump _and_ expand**: a project's "View architecture diagram ↓" points at `#architecture-<slug>` — `Expandable` listens for `hashchange` and auto-opens the matching accordion instead of just scrolling to a collapsed header. Experience entries, publications, and ecosystem tech nodes all have matching anchor ids for the same reason.
- **One `<h1>`** (the hero headline) — every section heading is `<h2>`, with content inside stepping down sequentially (`<h3>`, `<h4>`) instead of each section restarting its own heading hierarchy, since there's only one document now, not eleven.

This replaced an earlier multi-page version (Phases 3–8, still described in `docs/planning/phase-3-project-structure.md` through `phase-8`) after Phase 9 traded per-project deep-linking/SEO for a single continuous scroll — see `docs/planning/phase-9-single-page.md` for the tradeoff and why it was made anyway.

## Architecture: the content graph

Every entity (`Project`, `Experience`, `Technology`, `Publication`, `Achievement`) is defined once in [`src/content`](src/content) with typed relations (`techSlugs`, `relatedProjectSlugs`, `disciplines`, …). Sections don't own content — they query the graph:

```
src/content/
  types.ts          entity shapes + relation fields (incl. ArchitectureDiagram)
  disciplines.ts     the hero's discipline nodes + curated adjacency edges
  projects.ts  experience.ts  technologies.ts  publications.ts  achievements.ts  about.ts
  graph.ts          relation queries (projectsUsingTechnology, technologyCooccurrence, etc.)
  index.ts          barrel export
```

The hero node ecosystem, Tech Ecosystem graph, Architecture Gallery, and every cross-link between sections all read from these same arrays — there is no duplicated content anywhere. **7 projects and 23 technologies are real**, pulled from the actual READMEs at `github.com/omkarvchalke` (see the comment at the top of `src/content/projects.ts`); About/Experience/Achievements/Publications are explicit bracketed placeholders (`[Company Name]`) pending [`docs/content/INTAKE.md`](docs/content/INTAKE.md).

Since there are no dynamic routes anymore (single page, no `[slug]` segments), the static export always builds successfully regardless of content state — the Phase 3–8 caveat about `generateStaticParams` requiring at least one entry no longer applies.

## Static hosting

GitHub Pages has no Node runtime, so the whole app is statically exported (`next.config.ts`, `output: "export"`, `images.unoptimized: true`). Consequences, decided in Phase 3 and built out in Phase 5:

- **Contact form is client-side only**, posting to an optional `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` (e.g. a Formspree endpoint) with a `mailto:` fallback when unset — so it works with zero configuration and upgrades cleanly once a real endpoint exists.
- **Résumé** is folded into the Contact section: `src/features/home/contact-section.tsx` checks `fs.existsSync` for `public/resume.pdf` at build time (a Server Component, unlike the rest of that section) and renders a real download button once that file exists.
- **basePath is computed at deploy time**, not hardcoded — see `.github/workflows/deploy.yml`. A repo named `<owner>.github.io` deploys to the domain root; any other repo name deploys as a project page at `<owner>.github.io/<repo>` with `NEXT_BASE_PATH` set accordingly.
- **`NEXT_PUBLIC_SITE_URL`** should be set once the real domain is known — it feeds `metadataBase`, the sitemap, and robots.txt (`src/app/sitemap.ts`, `src/app/robots.ts`). Defaults to `https://omkarvchalke.github.io` (a reasonable guess given the confirmed GitHub username).

## SEO & accessibility

- `src/app/sitemap.ts` / `robots.ts` — generated at build time (`export const dynamic = "force-static"`, required for metadata route handlers under static export). The sitemap lists a single URL now — section anchors aren't separate documents.
- `src/app/opengraph-image.tsx` — a branded, on-token social share image generated via `next/og` at build time.
- Full `@axe-core/playwright` scan across the single page, in both its default (all accordions collapsed) and fully-expanded states, both themes: **zero violations**. Getting there required a real heading-level pass — with everything on one page there's only one `<h1>` (the hero), so every section title became `<h2>` and everything nested inside had to step down consistently (`<h3>`, `<h4>`) instead of each section restarting its own hierarchy the way per-page `<h1>`s allowed.
- Keyboard navigation verified (tab order, visible focus rings, `Expandable`'s `aria-expanded`) across the hero's node graph, every accordion, and the contact form.

## CI/CD

- **`.github/workflows/ci.yml`** — every push/PR to `main`: typecheck → lint → format check → build.
- **`.github/workflows/deploy.yml`** — every push to `main`: build with the correct basePath, `.nojekyll` (so GitHub Pages serves the `_next/` asset directory instead of swallowing it via Jekyll), then deploy via `actions/deploy-pages`.

## Design tokens

Colors, type scale, and spacing are defined in `src/app/globals.css` under Tailwind v4's `@theme` block, translated from the Phase 2 design system ([`docs/planning/phase-2-design-system.html`](docs/planning/phase-2-design-system.html)). Brand tokens (`--copper`, `--copper-soft`) sit alongside the shadcn semantic contract (`--primary`, `--card`, `--border`, …) so every shadcn component is themed automatically. A Phase 8 visual-richness pass added a matte grain texture, `.surface-card`/`.surface-panel` (gradient + shadow + hover lift), and glow-ring accents — all plain CSS classes in `globals.css`, not Tailwind theme extensions.

**Motion is the one exception to "everything is a Tailwind token"**, and worth knowing about: Tailwind v4 doesn't pick up custom non-numeric keys added to the `--duration-*`/`--ease-*` theme namespaces the way it does for `--color-*`/`--font-*` (confirmed empirically — `--duration-fast`/`--ease-out-eng` registered as CSS variables but generated no matching utility class, so every transition using them was silently snapping instantly instead of animating). Motion values are therefore Tailwind arbitrary values inline at each call site (`duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`) rather than named utilities — see the comment in `src/components/reveal.tsx`. The actual values (120/200/320/520/900ms, the two eases) still match the Phase 2 spec; only the mechanism differs from what Phase 2/3 originally described.

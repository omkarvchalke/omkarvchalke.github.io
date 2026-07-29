# OVC Portfolio

A portfolio engineered like a product, not a template — a single Next.js app driven by one content graph (Project ↔ Technology ↔ Experience ↔ Publication) so the site reads as a connected engineering knowledge base rather than a stack of static sections.

Design rationale lives in [`docs/planning/`](docs/planning) — Phase 1 (research, IA, content strategy) and Phase 2 (design system) are approved; this repo implements Phase 3 (project structure, tech decisions, GitHub workflow) onward.

## Stack

| Concern    | Choice                                                        | Why                                                                                                      |
| ---------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router), React 19, TypeScript                 | Pinned to 15 per the brief even though `create-next-app@latest` currently resolves to 16                 |
| Styling    | Tailwind CSS v4 (CSS-first `@theme`)                          | Design tokens (Phase 2) live as CSS custom properties, no JS config file                                 |
| Components | shadcn/ui (`base-nova` style, Base UI primitives)             | Copy-in components themed entirely through our CSS variables — no separate component palette to maintain |
| Motion     | `motion` (Framer Motion's current package name)               |                                                                                                          |
| Icons      | lucide-react                                                  |                                                                                                          |
| Forms      | react-hook-form + zod                                         |                                                                                                          |
| Theme      | next-themes, `defaultTheme="dark"`, `enableSystem`            | Dark-first per the brief, light theme fully specified and available via system preference                |
| Deployment | Static export (`output: "export"`) → GitHub Pages via Actions | See [Static hosting](#static-hosting)                                                                    |

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run typecheck
npm run lint
npm run format:check   # `npm run format` to write
npm run build      # static export, output in /out
```

## Architecture: the content graph

Every entity (`Project`, `Experience`, `Technology`, `Publication`) is defined once in [`src/content`](src/content) with typed relations (`techSlugs`, `relatedProjectSlugs`, …). Pages don't own content — they query the graph:

```
src/content/
  types.ts        entity shapes + relation fields
  projects.ts      experience.ts      technologies.ts      publications.ts
  graph.ts        relation queries (projectsUsingTechnology, etc.)
  index.ts        barrel export
```

The hero node ecosystem, Tech Ecosystem graph, Architecture Gallery, and every "related" rail all read from the same four arrays — there is no per-page duplicated content. **Content arrays are intentionally empty right now**; real projects/experience/publications land in Phase 5.

### A note on dynamic routes + static export

`/projects/[slug]`, `/architecture/[project]`, and `/publications/[slug]` use `generateStaticParams()` wired to the content graph. **`npm run build` will fail** with `Page "/projects/[slug]" is missing "generateStaticParams()"` until at least one entry exists in the corresponding content file — this is intentional Next.js behavior for `output: "export"` (a dynamic route that resolves to zero pages has no server to fall back to for unknown params), not a bug. It was verified working with a temporary fixture during Phase 3; CI will go green as soon as Phase 5 adds real content. `/about`, `/experience`, `/projects`, `/architecture`, `/publications`, `/ecosystem`, `/github`, `/achievements`, `/resume`, `/contact` are all static and build today.

## Static hosting

GitHub Pages has no Node runtime, so the whole app is statically exported (`next.config.ts`, `output: "export"`, `images.unoptimized: true`). Two consequences, decided in Phase 3:

- **Contact form & GitHub Activity dashboard are client-side only.** The contact form posts to a third-party form endpoint (e.g. Formspree); GitHub Activity calls GitHub's public REST/GraphQL API directly from the browser. No backend to own.
- **basePath is computed at deploy time**, not hardcoded — see `.github/workflows/deploy.yml`. A repo named `<owner>.github.io` deploys to the domain root; any other repo name deploys as a project page at `<owner>.github.io/<repo>` with `NEXT_BASE_PATH` set accordingly.

## CI/CD

- **`.github/workflows/ci.yml`** — every push/PR to `main`: typecheck → lint → format check → build.
- **`.github/workflows/deploy.yml`** — every push to `main`: build with the correct basePath, `.nojekyll` (so GitHub Pages serves the `_next/` asset directory instead of swallowing it via Jekyll), then deploy via `actions/deploy-pages`.

## Design tokens

Colors, type scale, spacing, and motion tokens are defined in `src/app/globals.css` under Tailwind v4's `@theme` block, translated 1:1 from the Phase 2 design system ([`docs/planning/phase-2-design-system.html`](docs/planning/phase-2-design-system.html)). Brand tokens (`--copper`, `--copper-soft`) sit alongside the shadcn semantic contract (`--primary`, `--card`, `--border`, …) so every shadcn component is themed automatically.

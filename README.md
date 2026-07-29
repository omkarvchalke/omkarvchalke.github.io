# OVC Portfolio

A portfolio engineered like a product, not a template — a single Next.js app driven by one content graph (Project ↔ Technology ↔ Experience ↔ Publication) so the site reads as a connected engineering knowledge base rather than a stack of static sections.

Design rationale lives in [`docs/planning/`](docs/planning) — Phases 1–8 (research/IA, design system, project structure, homepage, remaining pages, motion, SEO/accessibility, and this final pass) are all implemented in this repo. **Content is intentionally empty** — every page renders an honest empty state until real projects/experience/publications are filled in via [`docs/content/INTAKE.md`](docs/content/INTAKE.md).

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

## Pages

Every route in the brief's site map is a real, functional page today — not a wireframe:

| Route                                      | Status                                                                                                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                        | Hero: node-ecosystem graph of disciplines, headline, CTAs                                                                                                 |
| `/about`                                   | Story/philosophy/timeline — empty state until content lands                                                                                               |
| `/experience`                              | Expandable timeline (Fig 5.5 pattern) — empty state                                                                                                       |
| `/projects`, `/projects/[slug]`            | Search/filter index + full case-study template — empty state                                                                                              |
| `/architecture`, `/architecture/[project]` | Gallery index + interactive component diagram with hover tooltips — empty state                                                                           |
| `/publications`, `/publications/[slug]`    | Abstract list + detail page — empty state                                                                                                                 |
| `/ecosystem`                               | Technology graph, edges **computed** from real tech co-occurrence (not curated) — empty state                                                             |
| `/github`                                  | **Live today** — real client-side data from the public GitHub API (profile, stats, contribution chart, language breakdown, pinned repos, recent activity) |
| `/achievements`                            | List — empty state                                                                                                                                        |
| `/resume`                                  | Checks `public/resume.pdf` at build time; shows a real download/preview UI once that file exists, an honest pending state until then                      |
| `/contact`                                 | Validated form (react-hook-form + zod); posts to `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` if set, otherwise falls back to a prefilled `mailto:` link           |

"Empty state" pages are fully built and will render real content automatically the moment `src/content/*.ts` is populated — no code changes needed, see [Architecture: the content graph](#architecture-the-content-graph).

## Architecture: the content graph

Every entity (`Project`, `Experience`, `Technology`, `Publication`, `Achievement`) is defined once in [`src/content`](src/content) with typed relations (`techSlugs`, `relatedProjectSlugs`, `disciplines`, …). Pages don't own content — they query the graph:

```
src/content/
  types.ts          entity shapes + relation fields (incl. ArchitectureDiagram)
  disciplines.ts     the hero's discipline nodes + curated adjacency edges
  projects.ts  experience.ts  technologies.ts  publications.ts  achievements.ts  about.ts
  graph.ts          relation queries (projectsUsingTechnology, technologyCooccurrence, etc.)
  index.ts          barrel export
```

The hero node ecosystem, Tech Ecosystem graph, Architecture Gallery, GitHub dashboard cross-links, and every "related" rail all read from the same arrays — there is no per-page duplicated content. **Content arrays are intentionally empty right now** — see [`docs/content/INTAKE.md`](docs/content/INTAKE.md) for the fill-in template that maps directly onto this schema.

### A note on dynamic routes + static export

`/projects/[slug]`, `/architecture/[project]`, and `/publications/[slug]` use `generateStaticParams()` wired to the content graph. **`npm run build` will fail** with `Page "/publications/[slug]" is missing "generateStaticParams()"` until at least one entry exists in the corresponding content file — this is intentional Next.js behavior for `output: "export"` (a dynamic route that resolves to zero pages has no server to fall back to for unknown params), not a bug. Verified working (and re-verified through Phase 5–7's component work) with temporary fixture content each time; CI will go green as soon as real content lands. Every other route builds and passes today.

## Static hosting

GitHub Pages has no Node runtime, so the whole app is statically exported (`next.config.ts`, `output: "export"`, `images.unoptimized: true`). Consequences, decided in Phase 3 and built out in Phase 5:

- **Contact form is client-side only**, posting to an optional `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` (e.g. a Formspree endpoint) with a `mailto:` fallback when unset — so it works with zero configuration and upgrades cleanly once a real endpoint exists.
- **GitHub Activity is client-side only**, hitting `api.github.com` directly from the browser with a 5-minute `sessionStorage` cache to stay within the 60 req/hr unauthenticated rate limit. The contribution calendar specifically isn't in the public REST API without an auth token, so it renders via a third-party SVG service (`ghchart.rshah.org`) with a graceful fallback if that's ever unreachable — swappable later for a build-time authenticated fetch if preferred.
- **basePath is computed at deploy time**, not hardcoded — see `.github/workflows/deploy.yml`. A repo named `<owner>.github.io` deploys to the domain root; any other repo name deploys as a project page at `<owner>.github.io/<repo>` with `NEXT_BASE_PATH` set accordingly.
- **`NEXT_PUBLIC_SITE_URL`** should be set once the real domain is known — it feeds `metadataBase`, the sitemap, and robots.txt (`src/app/sitemap.ts`, `src/app/robots.ts`). Defaults to `https://omkarvchalke.github.io` (a reasonable guess given the confirmed GitHub username).

## SEO & accessibility (Phase 7)

- `src/app/sitemap.ts` / `robots.ts` — generated at build time (`export const dynamic = "force-static"`, required for metadata route handlers under static export — Next can't infer static-ability for these the way it does for `page.tsx`).
- `src/app/opengraph-image.tsx` — a branded, on-token social share image generated via `next/og` at build time (not a static asset to maintain by hand).
- Per-page `<title>`s use a shared template (`%s — Omkar Vilas Chalke`) declared once in the root layout instead of every page repeating the suffix.
- Verified with `@axe-core/playwright` across all 11 top-level routes plus the three dynamic detail pages (seeded with temporary fixture content, then reverted) — zero violations. One real finding fixed along the way: the homepage had no `<main>` landmark because `PageContainer` rendered its own `<main>` per-page while the hero didn't use `PageContainer` at all; moved the single `<main>` landmark to the root layout instead.
- Keyboard navigation verified (tab order, visible focus rings) on the hero's node graph and the contact form.

## CI/CD

- **`.github/workflows/ci.yml`** — every push/PR to `main`: typecheck → lint → format check → build.
- **`.github/workflows/deploy.yml`** — every push to `main`: build with the correct basePath, `.nojekyll` (so GitHub Pages serves the `_next/` asset directory instead of swallowing it via Jekyll), then deploy via `actions/deploy-pages`.

## Design tokens

Colors, type scale, and spacing are defined in `src/app/globals.css` under Tailwind v4's `@theme` block, translated from the Phase 2 design system ([`docs/planning/phase-2-design-system.html`](docs/planning/phase-2-design-system.html)). Brand tokens (`--copper`, `--copper-soft`) sit alongside the shadcn semantic contract (`--primary`, `--card`, `--border`, …) so every shadcn component is themed automatically.

**Motion is the one exception**, and worth knowing about: Tailwind v4 doesn't pick up custom non-numeric keys added to the `--duration-*`/`--ease-*` theme namespaces the way it does for `--color-*`/`--font-*` (confirmed empirically — `--duration-fast`/`--ease-out-eng` registered as CSS variables but generated no matching utility class, so every transition using them was silently snapping instantly instead of animating). Motion values are therefore Tailwind arbitrary values inline at each call site (`duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`) rather than named utilities — see the comment in `src/components/reveal.tsx`. The actual values (120/200/320/520/900ms, the two eases) still match the Phase 2 spec; only the mechanism differs from what Phase 2/3 originally described.

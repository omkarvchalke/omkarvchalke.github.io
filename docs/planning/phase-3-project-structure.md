# Phase 3 — Project Structure, Tech Decisions, Dependencies, GitHub Workflow

Status: DRAFT — awaiting approval before Phase 4 (Homepage)

This phase produced a working scaffold, not just a document — see the repo root. This file records the _why_ behind what's there.

---

## 1. Framework version: pinned to Next.js 15, not "latest"

`npx create-next-app@latest` currently resolves to Next 16. The brief's tech stack explicitly names Next.js 15 + React 19. Rather than silently drifting onto whatever "latest" means today, the scaffold is pinned (`create-next-app@15`), giving Next 15.5.22 / React 19.1.0 — matching the brief exactly. Revisit this pin deliberately later if there's a reason to move to 16; don't let it happen as a side effect of a fresh install.

## 2. shadcn/ui generated a newer contract than expected — used it as-is

Running `shadcn init` today scaffolds the current `base-nova` style on `@base-ui/react` primitives (not the Radix-based `new-york`/`default` styles from shadcn's earlier eras), with components themed entirely through CSS custom properties (`bg-primary`, `border-border`, etc.) rather than hardcoded classes. This is the tool's current recommended baseline, so Phase 3 uses it as generated rather than fighting it — our Phase 2 palette was remapped onto shadcn's semantic variable contract (`--primary`, `--card`, `--border`, `--ring`, …) instead of inventing a parallel token system, so every future `npx shadcn add <component>` is themed automatically with zero extra work.

## 3. Dark-first, implemented via `next-themes` + shadcn's `.dark` class contract

shadcn's generated components already reference `dark:` Tailwind utility variants in a few places (e.g. input translucency in the outline button variant), gated by `@custom-variant dark (&:is(.dark *))`. Rather than inventing a separate `data-theme` mechanism (which the Phase 2 _artifact_ used, under different constraints — no app framework, no shadcn contract to honor), the real app uses the standard, fully-compatible pattern: `next-themes` applies a `.dark` class to `<html>`, `defaultTheme="dark"` makes dark the default experience per the brief, and `enableSystem` still respects a user whose OS is set to light. `:root` holds the light palette (fallback), `.dark` holds the primary dark palette — same values as the Phase 2 artifact, just re-expressed in shadcn's slot names.

## 4. The content graph is real code, not a plan

`src/content/` implements the Phase 1 §5.2 data model directly: `types.ts` defines `Project` / `Experience` / `Technology` / `Publication` with relation fields (`techSlugs`, `relatedProjectSlugs`, `relatedExperienceSlugs`, `relatedProjectSlug`), and `graph.ts` implements the actual relation queries (`projectsUsingTechnology`, `experienceForProject`, `projectForPublication`, …). This is the single piece of infrastructure every "everything is connected" requirement in the brief depends on — hero nodes, Tech Ecosystem, Architecture Gallery, and cross-link rails all read the same four arrays instead of each page owning its own content.

Content arrays are **intentionally empty** — populating them with real projects/experience/publications is Phase 5, not Phase 3. Filling them with placeholder-but-plausible entries now would risk something fabricated surviving into the shipped site.

## 5. Static export + the empty-content build caveat

GitHub Pages has no server runtime, so `next.config.ts` sets `output: "export"` (Phase 1's deferred "static hosting gap" question, now resolved: **client-side only** — contact form via a third-party endpoint, GitHub Activity via client-side calls to GitHub's public API; no serverless function to own).

One real consequence discovered while wiring this up: `/projects/[slug]`, `/architecture/[project]`, and `/publications/[slug]` use `generateStaticParams()` against the (currently empty) content arrays, and **Next intentionally fails the build** when a dynamic route resolves to zero pages under static export — there's no server left to handle an unrecognized param at request time, so it refuses to ship a route that can never be reached. Verified this is expected (not a config mistake) by temporarily seeding one fixture entry per array and confirming a clean build end to end, then reverting to empty. Practical effect: `npm run build` and CI's `verify` job will stay red until Phase 5 adds at least one project and one publication. That's expected, documented in the README, and not a Phase 3 defect.

## 6. Dependencies installed and why

| Package                                                                                            | Role                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`, `react`, `react-dom`                                                                       | pinned to 15 / 19 per brief                                                                                                                                                             |
| `tailwindcss` v4, `@tailwindcss/postcss`                                                           | CSS-first design tokens                                                                                                                                                                 |
| `shadcn`, `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` | component layer, installed by `shadcn init`                                                                                                                                             |
| `lucide-react`                                                                                     | icons (brief)                                                                                                                                                                           |
| `motion`                                                                                           | Framer Motion's current npm name — brief lists "Framer Motion" and "Motion" as if separate; they're the same library under its current name                                             |
| `next-themes`                                                                                      | dark-first theming without a hydration flash (§3 above)                                                                                                                                 |
| `react-hook-form`, `zod`, `@hookform/resolvers`                                                    | contact form (brief)                                                                                                                                                                    |
| `prettier`, `prettier-plugin-tailwindcss`                                                          | not in the brief's list explicitly, added because ESLint alone doesn't format, and Tailwind class order matters for readability once components get dense — dev-only, zero runtime cost |

`npm audit` reports 12 high-severity findings, all in dev-only tooling transitively required by `eslint-config-next` (a `brace-expansion` ReDoS in `eslint`'s dependency chain, similarly for `postcss`'s tooling path). These don't ship to the production bundle. `npm audit fix --force` would downgrade `eslint-config-next` to a pre-canary version and break linting — not worth it for a dev-time-only, non-exploitable-in-this-context finding. Worth re-checking when `eslint-config-next` cuts a fixed release.

## 7. Folder architecture

```
src/
  app/            routes only — thin, currently placeholder pages proving the
                   site map + generateStaticParams wiring; real UI is Phase 4/5
  components/
    ui/           shadcn primitives (bash: `npx shadcn add <name>`)
    theme-provider.tsx
    page-placeholder.tsx   (temporary — deleted once real pages land)
  content/        the content graph (§4)
  features/       reserved for feature-first composed UI (hero graph, tech
                   ecosystem graph, architecture gallery, timeline, etc.) —
                   empty until Phase 4/5 populate it
  lib/            utils.ts (shadcn's cn() helper)
  hooks/          reserved, empty
```

`app/` stays thin by design — route files import from `features/` and `content/`, they don't contain feature logic themselves. This is the "feature-first" architecture the brief asks for, applied concretely rather than left as a description.

## 8. GitHub workflow

Two workflows, split by concern:

- **`ci.yml`** — every push/PR to `main`: typecheck, lint, format check, build. This is the fast feedback loop for any branch/PR.
- **`deploy.yml`** — every push to `main`: rebuilds (with the correct `basePath`, computed from the repo name rather than hardcoded — see README §Static hosting), stamps `.nojekyll` so GitHub Pages doesn't swallow the `_next/` asset directory, then deploys via `actions/deploy-pages`.

Both will fail until Phase 5 per §5 — this is expected for the first several pushes and stops being true the moment real content lands.

## 9. What's deliberately not done yet

- No git commits made — repo is initialized locally; pushing/first commit is a discrete action to confirm with you, not bundled into scaffolding.
- No GitHub remote configured (repo doesn't exist on GitHub yet) — `deploy.yml`'s basePath logic is written to work correctly whenever that repo is created, whatever it's named.
- `features/` and `hooks/` are empty — populated as Phase 4/5 need them, not pre-built speculatively.

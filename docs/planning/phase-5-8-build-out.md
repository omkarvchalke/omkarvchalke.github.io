# Phases 5–8 — Remaining Pages, Motion, SEO/Accessibility, Final Verification

Status: implemented. You asked to build everything through to completion and supply real content yourself afterward, so these four phases were done in one pass rather than gated individually — this doc records what happened and why, in place of separate stop-and-approve write-ups.

---

## 1. Scope decision

"Build everything" was read as: every route gets a real, functional UI (not a wireframe), wired to the Phase 3 content graph, with honest empty states wherever content doesn't exist yet — never fabricated placeholder bios. Two pages don't need to wait for content at all and are genuinely live today:

- **`/github`** — real client-side data from the public GitHub API for `omkarvchalke`.
- **`/resume`** — checks `public/resume.pdf` at build time and renders a real download/preview UI the moment that file exists.

## 2. Schema additions (Phase 5)

- `Achievement` type + `src/content/achievements.ts` — the site map calls for an Achievements page; the graph didn't have an entity for it.
- `ArchitectureDiagram` (`DiagramNode`/`DiagramEdge`) added to `Project` — the brief's Architecture Gallery needs per-component data (services/APIs/queues/databases/cloud + descriptions), not just a boolean flag.
- `Experience.disciplines` — added so Experience can be highlighted from the hero's discipline nodes the same way Project already could.
- `technologyCooccurrence()` in `graph.ts` — the Tech Ecosystem page's edges are **computed** from which technologies actually shipped together in a project or role, not hand-curated like the hero's discipline adjacency. Deliberately different mechanisms for two different kinds of truth: the hero's disciplines are a fixed, known taxonomy where editorial judgment about "core vs. extended" is meaningful; the technology list is open-ended and personal, so inventing curated edges there would just be guessing.

## 3. Shared primitives before pages

Built once, reused everywhere, to avoid nine slightly-different implementations of the same pattern: `SectionHeader`, `Reveal` (scroll-triggered fade-up), `useGraphHover` (the hover/focus-to-highlight state machine behind the hero, Ecosystem, and Architecture graphs), `EmptyState`, `PageContainer`.

## 4. What got caught by actually running it (not just typechecking)

Per the standing instruction to verify UI changes in a real browser, every page was crawled with a headless browser and checked for console errors; the graph-heavy and data-dependent pages were additionally exercised with temporary fixture content (seeded, verified, reverted — same pattern as Phase 3's `generateStaticParams` check) since they'd otherwise never render anything with zero real content. This caught real bugs that typecheck/lint couldn't:

1. **GitHub dashboard showed "Pushed 0 commits" for every push.** GitHub's public events API often omits the `commits` array for privacy but still reports an accurate `size` field — was only reading `commits.length`. Fixed to prefer `payload.size`.
2. **Missing `aria-label` on architecture diagram nodes** — inconsistent with the hero/Ecosystem graphs, caught by a Playwright locator failing, not by lint.
3. **Motion tokens silently did nothing.** Attempted to consolidate ad hoc `duration-200`/`ease-[cubic-bezier(...)]` values into named Tailwind utilities (`duration-fast`, `ease-out-eng`) via `@theme`, matching what Phase 2's artifact modeled. Empirically verified after the fact (`getComputedStyle(...).transitionDuration`) that Tailwind v4 doesn't generate utility classes from custom non-numeric keys added to the `--duration-*`/`--ease-*` namespaces — the CSS variables registered, but no matching class did, meaning every transition silently snapped instantly instead of animating. This would have been a real, sitewide regression to the brief's motion requirements if it had shipped unverified. Reverted to the original working arbitrary-value syntax; documented in `src/components/reveal.tsx` and the README so nobody reintroduces the same fix.
4. **`sitemap.ts`/`robots.ts`/`opengraph-image.tsx` 500'd** — metadata route handlers need `export const dynamic = "force-static"` under `output: "export"`; Next can't infer static-ability for these the way it does for `page.tsx`. Fixed on all three.
5. **Homepage failed an axe-core scan** (`landmark-one-main`) — `PageContainer` rendered its own `<main>` per page, but the hero doesn't use `PageContainer`, so the homepage had no `<main>` landmark at all. Fixed by moving the single `<main>` to the root layout instead of repeating it per page — the more correct pattern regardless.
6. **Mobile nav bugs** (carried over from Phase 4, re-confirmed still relevant): theme toggle pushed off-screen, nav links clipping mid-word with no scroll affordance. Already fixed in Phase 4; re-verified here.

Full accessibility scan (`@axe-core/playwright`) across all 11 top-level routes plus the three dynamic detail pages (with fixture content): **zero violations** after the landmark fix.

## 5. SEO (Phase 7)

- `src/app/sitemap.ts`, `robots.ts` — generated from the same content graph (empty today, includes real project/publication URLs automatically once populated).
- `src/app/opengraph-image.tsx` — branded share-card image generated at build time via `next/og`, using the Phase 2 palette directly rather than a hand-maintained static asset. Uses a generic sans-serif fallback rather than the site's actual Geist font (next/og doesn't pick up `next/font` automatically) — a minor known gap, not pursued further given time/value tradeoff.
- Title template (`%s — Omkar Vilas Chalke`) centralized in the root layout; removed the duplicated suffix from 12 individual page files.

## 6. What's still genuinely pending

- All real content (About story, Experience, Projects, Publications, Achievements, resume PDF, technologies) — see `docs/content/INTAKE.md`.
- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` env vars — both have working defaults/fallbacks, but should be set once the real domain and a real form endpoint exist.
- OG image font fidelity (uses fallback sans-serif, not Geist).
- The `npm run build` / CI caveat from Phase 3 — still true, still expected, still documented.

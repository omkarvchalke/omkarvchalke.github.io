# Phase 1 — Research, Information Architecture & Content Strategy

Status: DRAFT — awaiting approval before Phase 2 (Design System)

---

## 1. Research

### 1.1 What "premium engineering product" actually means (competitive teardown)

Every reference site in the brief earns its "premium" feeling from **restraint**, not decoration. Pulling out the transferable principles (not the visual skin):

| Reference       | What it's actually doing                                                                                           | What we borrow                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Linear**      | Motion is a state-change signal, never idle decoration. Near-zero color palette, one accent used sparingly.        | Motion-as-information rule; single accent discipline                                                                |
| **Stripe**      | Dense technical content made scannable via strong type hierarchy + diagrams that explain systems, not screenshots. | Docs-style content architecture for Projects/Architecture Gallery                                                   |
| **Apple**       | Whitespace as a status symbol. One idea per viewport.                                                              | Section pacing, generous margins                                                                                    |
| **Raycast**     | Command-driven, keyboard-first interaction model even on a marketing site.                                         | Optional keyboard navigation for power users (recruiters skimming fast, engineers exploring deep)                   |
| **Arc Browser** | Playful but purposeful micro-interactions; every hover teaches you something about the object.                     | Hover = "tell me more," never hover = "look, it moves"                                                              |
| **GitHub**      | Contribution graph as proof-of-work, not decoration. Data made humane.                                             | GitHub Activity dashboard tone                                                                                      |
| **Notion**      | Everything is an object with relations (pages link to pages).                                                      | The "knowledge graph" content model — projects/tech/experience/publications as linked entities, not siloed sections |
| **Figma**       | Canvas metaphor — you explore spatially, not just scroll.                                                          | System Architecture Gallery interaction model                                                                       |

**Synthesis, not collage:** the unifying idea across all of them is that _the interface is a byproduct of a well-modeled data structure_, not a skin applied after the fact. That's the actual design principle this site should follow — which is why Section 4 (Content Strategy) proposes a single content graph rather than per-page hardcoded content.

### 1.2 How the audience actually behaves (UX research grounding)

- **Recruiters (non-technical):** F-pattern scan, ~10–20 seconds on first visit. They look for: role-fit keywords, a title they can paste into an ATS note, a resume download, a way to contact. They will _not_ explore a graph unprompted — they need the hero to work as a static comprehension moment even before any interaction happens.
- **Hiring managers / engineering leads:** Read the headline, then jump straight to Experience or Projects looking for scope of ownership and impact metrics. They skim architecture diagrams for judgment quality (did this person make sane tradeoffs), not for technology name-dropping.
- **Staff/principal engineers (peer review, e.g. during interview loop prep):** Actively hostile to fluff. They will click into System Architecture Gallery, GitHub Activity, and Publications specifically to find something to challenge you on. This persona is the one who "explores the graph."
- **Implication:** the site needs **two coherent reading modes** — a fast linear pass (hero → proof points → CTA) for the 80% who never touch the graph, and a deep exploratory mode (the knowledge graph) for the 20% who do. Both must work from the same data, and the linear mode must not feel crippled if someone never interacts with a single node.

---

## 2. Personas

### Persona A — "Skimming Recruiter" (primary, optimize for speed)

- Non-technical, sourcing 40+ profiles/day.
- Goal: confirm role fit in <20s, grab resume, note contact info.
- Needs: unambiguous positioning statement (no jargon soup), visible tech keywords, resume CTA above the fold, no required interaction to get the basics.

### Persona B — "Evaluating Hiring Manager" (primary, optimize for credibility)

- Technical, mid-to-senior, evaluating for a specific open role.
- Goal: verify real ownership and impact, not just tech exposure.
- Needs: Experience section with scope/impact/metrics per role, 2–3 project case studies deep enough to demonstrate decision-making, not just "I used X."

### Persona C — "Peer Engineer / Interview Loop Prep" (secondary, optimize for depth)

- Staff/principal level, technically skeptical.
- Goal: find something worth asking about; assess architectural judgment and code quality.
- Needs: System Architecture Gallery, GitHub Activity, tradeoffs and lessons-learned content, publications if applicable.

### Persona D — "Founder / Startup CTO" (secondary, optimize for breadth signal)

- Wants a generalist who can own a system end-to-end (infra → data → app → deploy).
- Needs: the "unified systems builder" narrative to land explicitly — this persona is _why_ the brief rejects narrow titles.

_(Deferred: "Academic collaborator" persona for Publications — only elevate this if you actually have publications to show. Flagging as an open question below.)_

---

## 3. UX Goals

1. **10-second comprehension.** Hero alone (headline + subhead + node ecosystem, no interaction required) must communicate "builds complete systems" without scrolling or hovering.
2. **Two valid reading paths, one data source.** Linear scroll works standalone; graph exploration is additive, never load-bearing for basic comprehension.
3. **Progressive disclosure everywhere.** Every dense section (Experience, Projects, Architecture) shows a compact summary by default; depth is opt-in via expand/click, never dumped all at once.
4. **Every entity is cross-linked.** Hovering/clicking a technology, project, role, or publication surfaces its related entities elsewhere in the graph. This is the single hardest technical requirement and the site's actual differentiator — everything else is executional.
5. **Motion communicates state, not mood.** No animation ships without a stated reason (see Phase 6 gate: every animation must map to an information change — hover reveals relation, scroll reveals sequence, expand reveals depth).
6. **Accessible parity for graph interactions.** Hover-driven UI (hero nodes, tech graph) must have a keyboard/focus and touch (tap) equivalent — this is a real design problem to solve in Phase 2/6, not an afterthought.
7. **Fast by construction.** Server Components + static generation for content, client-side interactivity scoped only to the graph/motion layers. Target Lighthouse ≥98 is a design constraint, not just a QA checkbox — it rules out heavy client bundles, unoptimized custom fonts, and animation libraries loaded globally.

---

## 4. Site Map

```
/
├── (hero lives here — not a separate route)
├── /about
├── /experience
│     └── expandable entries (no separate route; deep-link via #anchor per company)
├── /projects
│     └── /projects/[slug]              → full case study
├── /architecture                        → System Architecture Gallery (index)
│     └── /architecture/[project]        → interactive diagram per project
├── /publications
│     └── /publications/[slug]
├── /ecosystem                           → Technology Ecosystem graph
├── /github                              → GitHub Activity dashboard
├── /achievements
├── /resume                              → view + download (PDF)
└── /contact
```

**Navigation model:** persistent minimal top nav (Work · Architecture · Publications · Ecosystem · GitHub · Contact) + the hero graph as an alternate entry point on `/`. Nav stays identical across linear and exploratory modes so neither persona gets lost.

**Cross-link mesh (the actual site map, conceptually):**

```
Project ──uses──► Technology ◄──uses── Experience
   │                    ▲                   │
   │                relatedTo               │
   ▼                    │                   ▼
Architecture Diagram     Publication ──about──┘
```

This graph is the real information architecture. Routes above are just _views_ into it.

---

## 5. Content Strategy

### 5.1 Core positioning

Headline stays outcome-first, title-free (per brief): _"I build scalable software, intelligent data platforms, and AI-powered applications."_ Every section reinforces "complete systems," never a single-discipline label. Avoid the words "Software Engineer / Data Engineer / AI Engineer" as identity labels anywhere in body copy — they're allowed only inside keyword lists (skills, filters) where recruiters' ATS-brain needs them for search.

### 5.2 Single content-graph model (architectural decision, not just content)

Instead of writing content per-page, model four entity types once:

- `Project` — problem, architecture, stack[], infra, apiFlow, deployment, challenges[], tradeoffs[], metrics[], lessons[], relatedTech[], relatedExperience[]
- `Experience` — company, role, overview, architecture, challenges[], responsibilities[], impact[], tech[], metrics[], relatedProjects[]
- `Technology` — name, category, relatedProjects[], relatedExperience[], relatedPublications[]
- `Publication` — abstract, problem, methods, tech[], citation, relatedProject

Every page (Projects index, Architecture Gallery, Tech Ecosystem graph, hero nodes, Experience timeline) is a **rendering** of this same underlying dataset filtered/joined differently. This is what makes "everything feels connected" true structurally instead of just visually. (This becomes a concrete data-layer decision in Phase 3 — likely typed content in `/content/*.ts` or MDX+frontmatter, TBD there.)

### 5.3 Voice

Precise, engineering-first, no marketing adjectives ("cutting-edge," "passionate," "revolutionary" are banned words). Sentences read like a well-written PR description: what the problem was, what was built, what tradeoff was made, what the measured result was.

### 5.4 Per-project case-study template (keeps every project structurally identical so the graph relations stay consistent)

Problem → Architecture → Tech Stack → Database → Infrastructure → API Flow → Deployment → Challenges → Tradeoffs → Metrics → Lessons Learned → Screenshots/Demo/GitHub/Diagram.

### 5.5 Open inputs needed from you before content-heavy phases (not needed for Phase 2/3, but flagging now)

- Real resume/experience details (companies, roles, dates, metrics)
- Project list with enough detail to fill the template above (3–6 flagship projects recommended — depth beats count)
- Publications, if any exist (if not, we should quietly de-scope that nav item rather than ship an empty section — recommend deciding this before Phase 4)
- GitHub username, LinkedIn URL, contact email, resume PDF
- Architecture diagram source detail for 2–3 flagship projects (enough to build the interactive gallery honestly)

None of this blocks Phase 2 (Design System) or Phase 3 (Project Structure) — both are content-agnostic. It will block Phase 4 (Homepage copy) and Phase 5 (Projects/Experience/Publications content).

---

## Decisions (resolved)

1. **Publications:** confirmed real publications exist — Publications stays a first-class nav item and section.
2. **Flagship project count: 6+.** Noted risk: 6+ full case studies (each with Problem/Architecture/Stack/DB/Infra/API Flow/Deployment/Challenges/Tradeoffs/Metrics/Lessons) is a lot of high-quality writing to sustain without any entry reading as filler — the exact thing that would make this feel like "a portfolio" again instead of a curated systems narrative. **Recommended tiering to keep the "premium not portfolio" bar:** 3–4 projects get the _full_ case-study treatment (all fields, architecture diagram, demo), the remaining go in as _lighter entries_ (Problem, Architecture summary, Stack, Metrics, GitHub link) in the same Projects index/filter system, upgradable to full case studies later. This preserves depth-over-count without hiding any project. Will proceed with your "6+, full depth" instruction as given, but flagging this now since it's exactly the kind of choice the brief asked me to challenge — revisit if content prep starts to feel thin on any entry.
3. **Static hosting gap (Contact form + GitHub Activity data source):** deferred to Phase 3 tech-decisions as requested.

---

**Next:** Phase 2 — Design System (typography, spacing, color tokens, motion principles, component library, wireframes). Will not start until this phase is approved.

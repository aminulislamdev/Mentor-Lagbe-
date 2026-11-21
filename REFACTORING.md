# MentorLagbe Client — Refactoring Audit

**Scope:** `MentorLagbe-Client/my-app` (Next.js frontend only). Backend is out of scope and does not exist in this repo (`MentorLagbe-Server/` is empty; `mwntorLagbe-Docs/docs.txt` is the assignment brief).
**Method:** full source read (every `.tsx`/`.ts`/`.css` file via direct read or structured sub-audit), cross-file reference greps for every shared export, line-count inventory. `node_modules/`, `.next/`, `.env` were not inspected.
**Constraint:** audit only — no source files were modified to produce this document.
**Confidence legend:** **[Confirmed]** = verified by direct reference-count greps or full-file read. **[Potential]** = flagged for review, not yet proven.

---

## 1. Project overview

| Metric | Value |
|---|---|
| Framework | Next.js 16.4.6 (App Router, Turbopack, `cacheComponents`) |
| UI | React 19.3, Tailwind CSS v4, shadcn-style primitives + `@base-ui/react` Button |
| Auth | `better-auth` client wired (`lib/auth.ts` ships an **empty** config; `api/auth/[...all]` route exists) — non-functional by construction **[Confirmed]** |
| Data | Static, hardcoded mock data inside page files; `fetchFeaturedTuitions()` is the only data path and it always falls back to embedded mocks |
| Routes | 21 app routes (public / dashboard student·tutor·admin / auth / payment ceremonies) |
| Source size | ~18,200 lines across 62 source files (74 files incl. lockfile/docs/assets) |
| Tests / CI | None **[Confirmed]** |
| Git | 20 local commits, working tree has 3 intentionally uncommitted files |

What this project is: a **visually complete, interactive UI demo** with production-grade page design and zero runtime data. Every list, receipt, KPI and feed is hand-written fiction. That is a deliberate assignment posture, not a bug — but it shapes every refactoring recommendation below: **extract first, consolidate second, delete last.**

---

## 2. Current folder structure

```text
my-app/
├── app/                         # App Router routes only — 26 page/layout files, all oversized
│   ├── layout.tsx               # root: fonts, metadata, Suspense-wrapped Navbar + Footer
│   ├── page.tsx                 # home (server) — hero/subjects/pipeline/stats/testimonials/pricing CTA
│   ├── globals.css              # Tailwind v4 @theme + oatmeal palette tokens (light/dark)
│   ├── error.tsx · loading.tsx · not-found.tsx   # root boundaries (1 each)
│   ├── api/auth/[...all]/route.ts                # better-auth handler (no DB behind it)
│   ├── about/ · tuitions/ · tuitions/[id]/ · pricing/ · sign-in/ · sign-up/
│   ├── payment/success · payment/cancel/
│   └── dashboard/{student,tutor,admin,profile}/…  13 pages, 4 segment layouts
├── components/
│   ├── navbar.tsx · footer.tsx · theme-toggle.tsx
│   ├── tuition-card.tsx · tuition-card-skeleton.tsx
│   ├── ui/{button,input,label,checkbox,separator}.tsx
│   └── dashboard/{dashboard-shell,nav-config,sidebar,topbar,shared}.tsx
├── lib/{auth,auth-client,tuition-service,utils}.ts
├── types/tuition.ts             # declared but bypassed by page-local dossiers **[Confirmed]**
├── docs/COMPONENT_GUIDE.md      # accurate today; will drift once decomposition starts
├── public/                      # 5 create-next-app default SVGs (all unreferenced) **[Confirmed]**
└── config: next.config.ts · tsconfig.json · eslint.config.mjs · components.json · package.json
```

No `hooks/`, no `services/`, no `mocks/`, no `features/`. Everything lives either inside route files or in two component folders.

---

## 3. Important files and responsibilities

One line each. **(S)** server component, **(c)** client component.

### 3.1 Root & boundaries
| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root shell: Geist fonts, metadata, `<Navbar/>` in a `<Suspense>` fallback, `<main>`, `<Footer/>` |
| `app/error.tsx` | Root error boundary with reset — the only error UI in the app |
| `app/loading.tsx` | Root loading spinner (unused by most routes: none suspense a data fetch) |
| `app/not-found.tsx` | 404 page with return-home CTA |
| `app/globals.css` | Palette + shadcn token layer (`--background:#D9CBB5`, `--foreground:#344C43`, sidebar tokens) |
| `app/api/auth/[...all]/route.ts` | `toNextJsHandler(auth)` — reachable but backed by an empty auth config **[Confirmed]** |

### 3.2 Public surface
| File | Responsibility |
|---|---|
| `app/page.tsx` **(S)** | Home: hero, subjects strip, pipeline, stats, testimonials, pricing tiers — the only route wired to `fetchFeaturedTuitions()` |
| `app/tuitions/page.tsx` | Browse catalog: hardcoded 8-dossier dataset + client filter/sort/paginate state |
| `app/tuitions/[id]/page.tsx` | Dossier detail with apply modal; **hardcoded to record `tui-001`; any other param silently falls back to it** **[Confirmed]** |
| `app/pricing/page.tsx` | Pricing: comparison matrix, FAQ accordion, Stripe-simulation modal — biggest file in the repo |
| `app/about/page.tsx` | Founder letter, board-verification pipeline, charter, FAQ |
| `app/sign-in/page.tsx` | "Night Study" themed form — fake submit (`preventDefault`) **[Confirmed]** |
| `app/sign-up/page.tsx` | "Enrollment Charter" themed form, role picker, password strength meter — fake submit **[Confirmed]** |
| `app/payment/success/page.tsx` | "Confirmation Ceremony" — static receipt, `CopyField` for the fake transaction id, role toggle for benefits |
| `app/payment/cancel/page.tsx` | "The Pause" — static reassurance page, zero state |

### 3.3 Dashboard chassis
| File | Responsibility |
|---|---|
| `components/dashboard/nav-config.ts` | `ROLE_CONFIG` registry (nav/taglines/badges per role) + `getRouteMeta()` for breadcrumbs |
| `components/dashboard/sidebar.tsx` | Sticky rail + mobile drawer; role-aware links; renders `SOON` disabled row for admin Transactions |
| `components/dashboard/topbar.tsx` | Breadcrumb + title, decorative search field, notifications dot, account menu (My Profile / Logout) |
| `components/dashboard/dashboard-shell.tsx` | Composes sidebar+topbar; owns collapse/drawer state; closes drawer on route change |
| `components/dashboard/shared.tsx` | The seven shared primitives (`IndexPanel`, `StatusChip`, `Monogram`, `EmptyState`, `Colophon`, `StickyRail`, `CopyField`) — healthy, well-documented |
| `app/dashboard/*/layout.tsx` ×4 | 9-line segment wiring of `<DashboardShell role=…>` — fine as-is |

### 3.4 Dashboard pages
| File | Responsibility |
|---|---|
| `dashboard/student/page.tsx` **(S)** | Scholar's Almanac overview: ledger stats, journey arc, insights, rhythm chart, timeline, tuition slips |
| `dashboard/student/my-applications/page.tsx` | "Post Room" ledger: 6 mock applications, filter/sort/search, withdraw flow |
| `dashboard/tutor/page.tsx` **(S)** | Mentor's Register overview: earnings SVG chart, telemetry, applicants, listings, sprint board |
| `dashboard/tutor/post-tuition/page.tsx` | Tuition creation form; fake publish; Free-plan quota notice is static copy |
| `dashboard/tutor/my-tuitions/page.tsx` | Portfolio: 6 mock listings, seat gauge, undo-delete, activate/close toggle |
| `dashboard/tutor/applicants/page.tsx` | Review desk: 9 mock applicants, accept/reject dialogs (dialog lacks Escape handling) **[Confirmed]** |
| `dashboard/tutor/settings/page.tsx` | Settings: general/availability/notifications/security/appearance/plan sections; local-state only |
| `dashboard/admin/page.tsx` | Command Center: KPIs, SVG RegistrationChart/RevenueBars/Donut, moderation queue (live local state), activity feed |
| `dashboard/admin/users/page.tsx` | Member registry: 12 mock members, filters, dossier, Role Writ reassignment dialog (Escape+scroll-lock) |
| `dashboard/admin/tuitions/page.tsx` | Moderation queue: 8 mock submissions, Ruling dialog (Escape+scroll-lock) |
| `dashboard/profile/page.tsx` | Identity Desk: persona editor, completion ring, save/cancel (local state only) |

### 3.5 Shared & library
| File | Responsibility |
|---|---|
| `components/navbar.tsx` | Public nav: better-auth `useSession()` read (fails silently — no backend), mobile menu, profile dropdown, role-aware dashboard link, theme toggle |
| `components/footer.tsx` | 4 link columns + social icons (X/LinkedIn/GitHub) + newsletter-ish strip |
| `components/theme-toggle.tsx` | useSyncExternalStore theme switcher (used by navbar) |
| `components/tuition-card.tsx` | **Only** used by home grid (8 files reference `TuitionCard`? — verified: exactly 2 refs incl. its own file) **[Confirmed]** |
| `components/tuition-card-skeleton.tsx` | Skeleton for the card grid — **0 importers** **[Confirmed]** |
| `components/ui/button.tsx` | base-ui Button with cva variants; imported by 8 files |
| `components/ui/input.tsx` · `label.tsx` · `checkbox.tsx` | Form primitives with `hasError`/`required` props; used by auth + dashboard forms |
| `components/ui/separator.tsx` | Separator primitive — **0 importers** **[Confirmed]** |
| `lib/tuition-service.ts` | `fetchFeaturedTuitions()` + 6-item embedded fallback — home-only |
| `lib/auth.ts` / `auth-client.ts` | Empty `betterAuth({})`; client with `window.location.origin` baseURL |
| `lib/utils.ts` | Re-exports `cn` from the npm `cn` package |
| `types/tuition.ts` | Canonical `Tuition` type — bypassed: catalog pages declare their own `TuitionDossier` (twice, divergently) **[Confirmed]** |

---

## 4. Oversized files ranked by priority

Priority = refactoring urgency (size × responsibility count × duplication). All are >500 lines mixing data + styles + sub-components + page JSX.

| # | File | Lines | Responsibilities crammed in |
|---|---|---|---|
| P0 | `app/pricing/page.tsx` | 937 | matrix data + category types + FAQ data + audience anchors + dual Pro cards + feature table + benefits articles + checkout-sim modal |
| P0 | `app/dashboard/tutor/applicants/page.tsx` | 926 | data + status meta + filters + index list + selection rail + DecisionDialog + verdict bar |
| P0 | `app/dashboard/tutor/my-tuitions/page.tsx` | 908 | data + seat gauge + portfolio beam + undo banner + index list + proof rail + empty states |
| P0 | `app/dashboard/admin/tuitions/page.tsx` | 907 | data + status meta + index ledger + ruling sheet + RulingDialog + verdict ledger |
| P1 | `app/sign-up/page.tsx` | 844 | data (OATHS/CONTENTS) + 9 sub-components + 2 role flows + strength meter + SealPanel |
| P1 | `app/tuitions/[id]/page.tsx` | 803 | data(1 record) + metadata bar + docket aside + apply modal + related strip |
| P1 | `app/dashboard/tutor/settings/page.tsx` | 799 | SECTIONS registry + Toggle + ThemePreview + 6 settings panels |
| P1 | `app/tuitions/page.tsx` | 741 | 8-dossier dataset + categories + filter logic + card JSX + pagination |
| P2 | `app/page.tsx` | 722 | 8 marketing sections + 3 data consts (server) |
| P2 | `app/dashboard/student/my-applications/page.tsx` | 705 | data + envelope card + stamps + filters + Pigeonhole empty state |
| P2 | `components/navbar.tsx` | 527 | session read + mobile menu + dropdown + role links + sign-out — 3 responsibilities |
| P3 | everything else | 300–660 | acceptable for now; decompose opportunistically |

Rule of thumb applied: >600 lines with ≥3 concerns = decompose; 300–600 = leave unless touched; <300 = leave.

---

## 5. Duplication & dead code (evidence-backed)

### 5.1 Confirmed duplication
1. **`const xxxStyles = \`…\`` scoped CSS blocks in 15 files** (`studyStyles`, `charterStyles`, `ceremonyStyles`, `pauseStyles`, `terminalStyles`, `portfolioStyles`, `registryStyles`, `almanacStyles`, `identityStyles`, `settingsStyles`, `publishStyles`, `studioStyles` ×3 files …). Same pattern: page-injected `<style>` with keyframes (`rise`, `stamp`, `dialog-in`, `seal-pop`) re-declared with near-identical values in multiple pages.
2. **Field-label / well-input class strings duplicated** in 5 files: `fieldLabel` + `wellField` in `profile`, `post-tuition`, `tutor/settings`; `wellInput` in `sign-in`; `underlineInput` in `sign-up` — same Tailwind recipes, retyped.
3. **Currency formatters duplicated**: `fmtFee` in `my-applications` & `admin/tuitions`; `fmtSalary` in `applicants` & `my-tuitions` — identical bodies (`৳` + `toLocaleString("en-IN")`).
4. **`STATUS_META`-shaped maps** in 4 files (`my-applications`, `tutor/applicants`, `admin/tuitions`, plus `APPROVAL_META` in `my-tuitions`) — same `{ label, tone, icon(escape-hatch classes) }` structure for pending/accepted/rejected triples.
5. **Two `cn` import conventions**: `components/ui/*` import `cn` from the npm `cn` package; ~30 other files import from `@/lib/utils` (which re-exports the same npm package). Functionally identical, architecturally confusing **[Confirmed]**.
6. **`TuitionDossier` interface declared twice** (`app/tuitions/page.tsx` and `app/tuitions/[id]/page.tsx`) with diverging fields; canonical `types/tuition.ts` unused by both **[Confirmed]**.
7. **24 hotlinked Unsplash banners** in markup, 8 raw `<img>` tags with `eslint-disable` — duplicated loading pattern, no optimization, no remote allowlist **[Confirmed]**.
8. **Colophon/back-link footers** — now unified via `Colophon` (good); remaining bespoke colophons on `student/page` and both payment pages are deliberate identity exceptions **[Confirmed]**.

### 5.2 Potentially unused (needs verification before deletion — do NOT delete blindly)
1. `components/tuition-card-skeleton.tsx` — **0 importers** **[Confirmed]**; candidate for wiring into `app/loading.tsx` or `/tuitions` loading state, or deletion.
2. `components/ui/separator.tsx` — **0 importers** **[Confirmed]**; also the most generic primitive, keep-or-delete decision pending.
3. `public/{next,vercel,window,globe,file}.svg` — 0 references **[Confirmed]** create-next-app defaults.
4. `@better-auth/mongo-adapter` — 0 import references anywhere **[Confirmed]** unused dependency.
5. `shadcn` — listed as a **runtime dependency**; it is the shadcn CLI, never imported **[Confirmed]**; belongs in devDependencies or nowhere.
6. `types/tuition.ts` — imported by `lib/tuition-service.ts` only; bypassed by the catalog pages (§5.1.6). Not dead, but structurally bypassed **[Confirmed]**.
7. `lib/auth-client.ts`/`useSession` — used only by navbar; the entire better-auth client path powers nothing functional (**§6.5**).
8. `app/loading.tsx` — rendered only on suspense boundaries that never suspend; home fetches with fallback data, other routes fetch nothing **[Potential]**.

### 5.3 Inconsistency notes
- `student/page.tsx` and `tutor/page.tsx` are **server components**; every other interactive page is `"use client"` — inconsistent data strategy by accident rather than design.
- Admin users/tuitions dialogs implement Escape + scroll-lock; `DecisionDialog` in `tutor/applicants` does not — a11y drift between sibling dialogs.
- `alert("Tuition dossier link copied…")` in `tuitions/[id]` vs the polished `CopyField` pattern elsewhere — one ad-hoc call left behind.
- `identityStyles` in `profile/page.tsx` defines classes but the JSX references `settings-serif`, which is **not defined anywhere** — stale dead class **[Confirmed]**.
- `next.config.ts` sets `experimental.agentFeedback: true` — not a documented Next 16 option **[Potential]**; remove or justify.
- Layout `<Suspense>` fallback around Navbar is uncommitted working-tree state predating the audit.

---

## 6. Current architecture problems

1. **No data layer.** 15+ files embed their datasets inline (6–12 hand-written entities each). No `lib/mocks`, no repository interface, no single place to swap mock→API later.
2. **Pages are god-components.** Every route mixes ≥4 of: data, scoped CSS, sub-components, filter logic, dialog implementations, and the page JSX. Line counts are a symptom, not the disease.
3. **Types declared but bypassed.** `types/tuition.ts` is canonical on paper; two divergent `TuitionDossier` copies are authoritative in practice — schema drift is scheduled, not hypothetical.
4. **Design tokens exist, then get ignored.** `globals.css` defines `--primary` etc.; pages hardcode 100+ hex literals (`#C98B6D` appears nowhere in the token layer) — palette changes now require sed across 26 files.
5. **Auth theatre.** `lib/auth.ts` exports `betterAuth({})` with no adapter, no secret, no DB; `navbar` calls `useSession()` and renders a signed-in identity; sign-in/sign-up submit nothing; the `/api/auth` route answers `GET /api/auth/get-session` with an error state at best. The UI proves nothing. Either wire it or wall it off honestly.
6. **No shared dialog/overlay primitive.** Four hand-rolled modals with diverging Escape/scroll-lock/backdrop/focus behavior (see §5.3).
7. **No loading/error boundaries per segment.** Root-only; dashboards and payment pages have no `error.tsx` — one render exception blanks the whole route group.
8. **Unoptimized remote images.** 24 Unsplash hotlinks + 8 `<img>` + no `images.remotePatterns` + 8 suppressed lint warnings — exactly the class of issue `next/image` exists for.
9. **Doc drift risk.** `docs/COMPONENT_GUIDE.md` (accurate now) + `README.md` (create-next-app boilerplate, wrong project name) — docs do not describe this app.
10. **Hygiene debt in working tree.** `tsconfig.tsbuildinfo` present in the project root (untracked), `components/ui/separator.tsx` committed? — no: uncommitted, unused. `implementation.md` intentionally uncommitted.

---

## 7. Recommended professional folder structure

Principles: **routes stay thin; features own their parts; one canonical type; mocks live in one place; no premature abstraction.**

```text
src-free layout (keep `app/` at root):

my-app/
├── app/                        # ROUTES ONLY — thin pages (<150 lines each)
│   ├── layout.tsx  error.tsx  loading.tsx  not-found.tsx  globals.css
│   ├── page.tsx                # composition of <HomeHero/> <SubjectStrip/> …
│   ├── about/page.tsx
│   ├── tuitions/page.tsx       # filters state + <CatalogGrid/>
│   ├── tuitions/[id]/page.tsx  # data lookup + <Dossier/> <ApplyModal/>
│   ├── pricing/page.tsx
│   ├── sign-in/page.tsx  sign-up/page.tsx
│   ├── payment/success/page.tsx  payment/cancel/page.tsx
│   └── dashboard/<role>/page.tsx + layout.tsx (unchanged chassis)
│
├── components/
│   ├── ui/                     # primitives only (button, input, label, checkbox) — delete separator or wire it
│   ├── dashboard/              # chassis + shared.tsx (as today)
│   ├── marketing/              # public-page sections shared by ≥2 marketing pages
│   │   ├── masthead.tsx        # eyebrow + display headline + aside pattern
│   │   ├── ticker.tsx          # marquee ticker (shared by admin + payment success)
│   │   └── colophon.tsx        # if/when a public variant of the dashboard colophon is needed
│   ├── pricing/                # everything only /pricing uses (split the 937-line god-page)
│   │   ├── pricing-hero.tsx  audience-anchors.tsx  pro-tiers.tsx
│   │   ├── feature-ledger.tsx  membership-benefits.tsx  pricing-faq.tsx
│   │   ├── final-cta.tsx  checkout-modal.tsx
│   ├── enrollment/             # sign-up parts (OathSlab, SealPanel, PasswordInput, StrengthMeter…)
│   ├── night-study/            # sign-in parts (PasswordWell, HangingBookmark, CornerTick)
│   ├── catalog/                # tuitions parts (TuitionDossier types, FilterBar, DossierCard, Pagination)
│   ├── admin/                  # admin parts (RulingDialog, RegistrationChart, RevenueBars, DistributionDonut…)
│   ├── tutor/                  # tutor parts (SeatGauge, EarningsChart, DecisionDialog, ProofRail…)
│   └── student/                # student parts (Envelope, PostageStamp, EmptyPigeonhole…)
│
├── lib/
│   ├── mocks/                  # ONE file per domain, typed against types/
│   │   ├── tuitions.ts  applications.ts  members.ts  submissions.ts
│   │   ├── listings.ts  receipt.ts  kpis.ts
│   ├── services/
│   │   └── tuition-service.ts  # fetchFeaturedTuitions (existing) — reads mocks when API absent
│   ├── hooks/                  # only hooks shared by ≥2 pages
│   │   ├── use-escape-close.ts  use-scroll-lock.ts  use-copy-to-clipboard.ts
│   ├── formatters.ts           # fmtFee / fmtSalary / fmtDhakaDate (single source)
│   ├── ui-maps.ts              # shared STATUS_META-style tone maps (if ≥2 consumers)
│   ├── auth.ts  auth-client.ts # unchanged, or deleted per §8 Phase 6 decision
│   └── utils.ts                # cn (keep single convention: "@/lib/utils" everywhere)
│
├── types/                      # canonical domain types
│   ├── tuition.ts              # keep; delete page-local dossiers
│   ├── application.ts  member.ts  submission.ts  receipt.ts
│
├── styles/                     # ONLY if scoped-CSS blocks survive consolidation
│   └── shared-keyframes.css    # rise/stamp/dialog-in/seal-pop, imported once in globals.css
│
└── docs/                       # README rewritten; COMPONENT_GUIDE kept current; this file
```

Notes:
- **No barrel exports** (`index.ts`) anywhere — import by file path; matches the project's existing "one shared file, no mystery" rule.
- `components/<feature>/` folders are allowed to be small; the rule is *cohesion* (only that page's parts), not size for size's sake.
- Mock data moves out of JSX files into `lib/mocks/*` **unchanged in shape** — the refactor must not re-author content.

---

## 8. Step-by-step refactoring roadmap

Each phase ends green (`tsc` + `eslint` + browser spot-check). No phase mixes concerns. No phase changes visuals.

### Phase 0 — Baseline (0.5 day)
1. Record current visual state: viewport screenshots of all 22 routes (post-refactor comparison set).
2. Add `typecheck` script; confirm `eslint .` clean; freeze file additions.

### Phase 1 — Deletions & dependency hygiene (0.5 day, independent)
3. Delete confirmed-unused: `components/ui/separator.tsx`, `components/tuition-card-skeleton.tsx` (or wire skeleton into `/tuitions` loading — pick one), `public/*.svg` defaults, `README.md` boilerplate rewrite.
4. Move `shadcn` to devDependencies (or remove); remove `@better-auth/mongo-adapter` or leave with a tracked issue; `tsconfig.tsbuildinfo` → `.gitignore` if missing.

### Phase 2 — Canonical types (0.5 day, **blocks 3 & 4**)
5. Expand `types/` (`Tuition` + `Application`, `Member`, `Submission`, `Receipt`); delete both `TuitionDossier` copies; retype catalog pages.

### Phase 3 — Mock extraction (1 day, **blocks 4**)
6. Move every inline dataset to `lib/mocks/*.ts` typed by Phase 2; pages import instead of declare. Zero JSX changes beyond imports.
7. Consolidate `fmtFee`/`fmtSalary` into `lib/formatters.ts`; delete 5 local copies.
8. Consolidate the 8 `STATUS_META`-style maps into `lib/ui-maps.ts` only where ≥2 pages share them.

### Phase 4 — Decomposition of god-pages (2–3 days, **after 3**)
9. `pricing` → `components/pricing/*` (9 files). 10. `sign-up` → `components/enrollment/*` (~7 files).
11. `tuitions/[id]` → lookup + `Dossier` + `ApplyModal` (**also fix param-ignored bug**: unknown id → `notFound()`).
12. `tuitions/page` → `FilterBar` + `CatalogCard` (decide: reuse `TuitionCard` or retire it — one card component must win).
13. `applicants`, `my-tuitions`, `admin/tuitions`, `admin/users`, `student/my-applications` → extract `DecisionDialog`/`RulingDialog`/filtering hooks; keep index+rail layouts page-local.
14. `page.tsx` (home) → `components/marketing/home-*` sections (hero/pipeline/stats/testimonials).

### Phase 5 — Cross-cutting UI consolidation (1 day, mostly independent)
15. Extract `ui-dialog.tsx` (Escape + scroll-lock + backdrop + focus return); adopt in 4 existing dialogs; bring `DecisionDialog` up to parity.
16. Extract `use-escape-close`, `use-scroll-lock`, `use-copy-to-clipboard`; replace inline navbar/admin implementations.
17. Move duplicated keyframe strings into `globals.css` (or `styles/shared-keyframes.css` imported once); delete per-page `xxxStyles` blocks whose only purpose is keyframes; delete dead `settings-serif` reference.
18. `alert()` → reuse `CopyField`/inline check feedback in `[id]`.

### Phase 6 — Platform honesty (1 day, independent)
19. **Auth decision** (pick one, document it): (a) wire better-auth for real (adapter + Mongo + session flow), or (b) strip to honest UI-only: remove `useSession()` from navbar, render static identity, drop `/api/auth` route and `better-auth` client deps. (b) matches current UI posture; (a) is required for production.
20. `next/image` + `images.remotePatterns` for Unsplash **or** accept raw `<img>` and delete the 8 `eslint-disable` comments by configuring `@next/next/no-img-element` off intentionally — choose consciously.
21. Per-segment `error.tsx` for `dashboard/` and `payment/`; `loading.tsx` for `/tuitions` and dashboards or remove root `loading.tsx` if never suspended.
22. Remove/justify `experimental.agentFeedback`; review `cacheComponents` + `partialPrefetching` against intended dynamism.
23. Rewrite `README.md` for this project; regenerate `docs/COMPONENT_GUIDE.md` if decomposition introduces new shared parts.

**Total: ~6–7 days solo, ~4 days in pairs.** No phase reorders without revisiting §9 dependencies.

---

## 9. Dependencies between refactoring tasks

```text
Phase 2 (types) ──► Phase 3 (mocks) ──► Phase 4 (page decomposition)
Phase 1 (deletions)      independent ────────────────────────────►
Phase 5 (dialogs/hooks/styles) ──independent, but MUST land before Phase 4's
                                 dialog-bearing pages finish (12–13)
Phase 6 (auth/images/config)    independent; blocks "production-ready" claims only

Hard blockers: Phase 4 must not precede Phase 3 (imports into moved mock files
would have to be rewritten twice). Phase 4 items 11–13 must not precede Phase 5.15.
Decisions that gate work: 8 (card winner), 19 (auth posture), 20 (image strategy).
```

---

## 10. Risk assessment

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Visual regression from page decomposition | **High** | High | Phase-0 screenshot baseline; visual diff per page after each extraction; pages keep byte-identical JSX class strings during moves |
| `TuitionCard` vs catalog-card unification deletes beloved design | **High** | Medium | Phase 4.12 decision is explicitly *user-reviewed*, not agent-chosen |
| Deleting "unused" files that are secretly referenced (e.g., dynamically imported) | Medium | Low | Verified via whole-tree grep for symbol AND filename; skeleton/separator deletions still re-verified after Phase 0 build |
| Mock→service swap changes rendered output (shape mismatch) | Medium | Medium | Phase 3 keeps mock shape byte-identical; type checker is the safety net (strict mode on) |
| Auth stripping breaks navbar rendering | Medium | Medium | Phase 6.19 done behind manual navbar walkthrough (signed-out/signed-in visual states) |
| Unsplash hotlinks break offline/CI builds | Medium | High today | Phase 6.20; otherwise `<img>` suppresses nothing at build time |
| `[id]` fallback masks real bugs; "fixing" it changes perceived behavior | Low | — | Unknown id → `notFound()` is *more* correct; note in PR description |
| `next.config.ts` flag removal breaks dev HMR | Low | Low | Remove one flag per commit; verify dev boot |
| Doc drift (`COMPONENT_GUIDE` vs code) after decomposition | Low | High | Guide updated in same PR as each extraction |
| Loss of uncommitted user work (`app/layout.tsx` Suspense, `implementation.md`) | **High** | Low | Audit never touched them; Phases must treat these as read-only inputs |

**Bottom line:** the codebase is stylistically rich but structurally undifferentiated — one author, one pass, ~18k lines, zero extraction discipline beyond the recent `shared.tsx` work. The riskiest part is not any file; it is doing everything in one sweep. Do it in the phases above.

---

## Appendix A — Verified reference counts (this audit)

| Export | Refs | Definition |
|---|---|---|
| `Colophon` | 15 files | `components/dashboard/shared.tsx` |
| `StickyRail` | 4 | same |
| `IndexPanel` | 4 | same |
| `Monogram` | 5 | same |
| `StatusChip` | 3 | same |
| `EmptyState` | 3 | same |
| `CopyField` | 2 | same |
| `Button` | 8 | `components/ui/button.tsx` |
| `Input` | 11 | `components/ui/input.tsx` |
| `Label` | 5 | `components/ui/label.tsx` |
| `Checkbox` | 3 | `components/ui/checkbox.tsx` |
| `Separator` | 0 | `components/ui/separator.tsx` |
| `TuitionCardSkeleton` | 0 | `components/tuition-card-skeleton.tsx` |
| `@better-auth/mongo-adapter` | 0 | package.json dependency |
| default SVGs in `public/` | 0 | 5 create-next-app assets |

Confirmed defects (file:line): `tuitions/[id]/page.tsx` param fallback (~L131-133) · `alert()` (~L201) · dead class `settings-serif` (`profile/page.tsx`) · `DecisionDialog` missing Escape (`tutor/applicants/page.tsx`) · hardcoded `/dashboard/student/settings` (removed in cebd44b) · admin transactions 404 (now `soon`-disabled).

*End of audit. Awaiting approval before any refactoring begins.*

---

## Task log

### Task 1 — Removed confirmed-unused dead files (COMPLETE)
- **Deleted (7 tracked files):** `public/next.svg`, `public/vercel.svg`, `public/globe.svg`, `public/window.svg`, `public/file.svg` (create-next-app defaults, 0 refs), `components/tuition-card-skeleton.tsx` (0 importers), and **`components/ui/separator.tsx`** (untracked; 0 importers; backed up to approved temp storage before deletion — recoverable if ever needed).
- **Kept deliberately:** `README.md` rewrite, `package.json`/lockfile hygiene (`shadcn`, `@better-auth/mongo-adapter`), `tsconfig.tsbuildinfo` ignore entry — separate tasks, separate approvals.
- **No application source code was modified.** No Git operations beyond working-tree deletion (nothing staged, nothing committed).
- **Verified:** whole-tree reference greps = 0 in source; `tsc --noEmit` exit 0; `eslint .` clean; `npm run build` compiled successfully; routes `/`, `/tuitions`, `/dashboard/admin` re-checked live (no errors, no overflow).
- **Note:** `implementation.md` still mentions `separator.tsx` and `tuition-card-skeleton.tsx` as historical record — left untouched per task constraint.
- **Audit items resolved:** §5.2 items 1–3 (skeleton, separator, public SVGs); §8 Phase 1 partially (deletions done; dependency hygiene pending Task 2 approval).

### Task 2 — Canonical Tuition types (COMPLETE)
- **Phase 1 investigation:** `types/tuition.ts` was the only types file; it is the API DTO used by `lib/tuition-service.ts` → `TuitionCard` (home featured grid) and was not bypassed itself. The problem was two page-local `TuitionDossier` interfaces with **the same name but incompatible fields** (`id` vs `_id`, `rating` required vs optional, nested `tutor` sub-object in details, missing `classLevel` vs `academicTier`), so they could not be merged — they were renamed, not unified.
- **Changes (3 files):**
  1. `types/tuition.ts` — `Tuition` unchanged (API contract preserved). Added `CatalogTuition` (verbatim browse-page shape; `rating`/`reviewCount` remain **required**) and `TuitionDetailDossier` (verbatim details-page shape, nested `tutor{}` intact). Byte-identical bodies verified by automated diff of the interface blocks.
  2. `app/tuitions/page.tsx` — removed local interface; `import type { CatalogTuition }`; annotation re-pointed. No JSX/data/styling changes.
  3. `app/tuitions/[id]/page.tsx` — removed local interface; `import type { TuitionDetailDossier }`; annotation re-pointed. `DOSSIER_RECORD` is read-only for typing; `[id]` param fallback left untouched as instructed.
- **Verified:** `tsc --noEmit` exit 0 · `eslint .` clean · `npm run build` route table identical (22 routes + auth API) · `/tuitions` renders all 8 catalog cards · `/tuitions/tui-001` renders the dossier · 0 console errors on both routes · full diff reviewed (only the 3 files above changed, besides pre-existing `app/layout.tsx` and Task 1 deletions).
- **Not done / deferred by design:** merging the three types, fixing `[id]` route-param handling, `TuitionCore` base, mock extraction, Application/Member/Submission domains, `declined` vs `rejected` union reconciliation — all await separate approval.
- **Audit items resolved:** §5.1.6 (dual `TuitionDossier` declarations); §6 problem 3 (types declared but bypassed) — partially: canonical home now exists for the tuition domain; Application/Member/Payment families remain for future tasks.

### Task 3 — Server Authentication Foundation (COMPLETE)
- **Server files changed (4):**
  1. `MentorLagbe-Server/utils/jwt.js` — Made JWKS_URL, JWT_ISSUER, JWT_AUDIENCE configurable via environment variables (with localhost fallbacks). Kept `verifyToken()` using `jose`'s `jwtVerify` against BetterAuth's JWKS endpoint. No hardcoded credentials.
  2. `MentorLagbe-Server/middleware/auth.middleware.js` (NEW) — `authMiddleware` extracts Bearer token, verifies via `verifyToken()`, attaches payload to `req.user`. Returns 401 for missing/invalid/expired tokens. Also exports `verifyStudent`, `verifyTutor`, `verifyAdmin` role-checking middleware (403 for wrong role).
  3. `MentorLagbe-Server/routes/auth.js` (NEW) — `GET /api/auth/me` protected test endpoint. Verifies token via `authMiddleware`, then looks up user in `users` collection (Mongoose `User.findById`) to confirm existence and return current role/plan. Returns 401 if user not found in DB.
  4. `MentorLagbe-Server/index.js` — Mounts auth routes at `/api/auth` via `app.use("/api/auth", authRoutes)`.
- **No password authentication system created** — BetterAuth (client side) handles signup/login/passwords. Server only verifies JWTs issued by BetterAuth.
- **Verified:** `node --check` passes on all 4 files. Server starts successfully (MongoDB connected, port 8000). Live-tested: `GET /api/health` → 200; `GET /api/auth/me` no token → 401; invalid token → 401; malformed header → 401.
- **No Git operations** (nothing staged, nothing committed). `app/layout.tsx` and `implementation.md` untouched.

### Task 1.1 — Database-backed Role Authorization (COMPLETE)
- **Server file changed (1):**
  1. `MentorLagbe-Server/middleware/auth.middleware.js` — Updated all three role middlewares to use `req.dbUser.role` (MongoDB source of truth) instead of `req.user.role` (JWT payload).
     - `verifyStudent`: checks `req.dbUser.role !== "student"` → 403
     - `verifyTutor`: checks `req.dbUser.role !== "tutor"` → 403
     - `verifyAdmin`: checks `req.dbUser.role !== "admin"` → 403
     - Missing `req.dbUser` → 401 "Unauthorized: User not found in database"
     - No additional MongoDB queries in role middlewares (reuses `req.dbUser` from `authMiddleware`)
- **Verified:** `node --check` passes. All 8 test scenarios pass (student→student 200, tutor→tutor 200, admin→admin 200, student→tutor 403, student→admin 403, tutor→admin 403, JWT-stale-role/DB-role-wins 200, missing-dbUser 401).
- **No Git operations** (nothing staged, nothing committed).
- **Pending approval for next task** (Tuition APIs or Application APIs).

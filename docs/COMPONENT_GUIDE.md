# MentorLagbe — Component Guide

The short answer to "where does this component live and should I reuse it?"
Read this before creating a new component. It exists so the codebase stays
small and predictable: **few files, obvious ownership, no barrels.**

## The rules (read first)

1. **One shared file for shared UI.** `components/dashboard/shared.tsx` holds
   the only seven shared dashboard primitives. Do not create
   `components/dashboard/*.tsx` files per component.
2. **No barrel files.** Nothing is exported through an `index.ts`. Import
   directly from the file that defines the component.
3. **Page-local by default.** If a component is used by exactly one page and
   encodes that page's identity, it stays in that page file. Extraction is a
   response to duplication, not to style.
4. **Styling is copied, not eyeballed.** Shared components carry the exact
   classes from their best page implementation. If you change a shared
   component, change it once here — never fork it page-side.
5. **If it exceeds ~60 lines or needs data-fetching**, it doesn't belong in
   `shared.tsx`. Move it into its page file or the chassis.

## Folder map

```text
app/                         # routes only
  dashboard/
    layout.tsx               # (root dashboard group has none) 
    student/layout.tsx       # DashboardShell role="student" + page
    tutor/layout.tsx         # DashboardShell role="tutor"
    admin/layout.tsx         # DashboardShell role="admin"
    profile/layout.tsx       # DashboardShell role="tutor" (hero persona)
components/
  ui/                        # atomic form primitives (button, input, label, checkbox)
  dashboard/
    nav-config.ts            # ROLE_CONFIG registry + getRouteMeta()
    sidebar.tsx              # role-aware sidebar + mobile off-canvas drawer
    topbar.tsx               # breadcrumb, search, notifications, identity
    dashboard-shell.tsx      # <DashboardShell role=…> chassis (client)
    shared.tsx               # THE seven shared dashboard primitives
lib/utils.ts                 # cn() helper
```

## The chassis (constant across dashboards)

### `components/dashboard/nav-config.ts`
Single registry. Drives sidebar, topbar and every dashboard route's title
matching. Never duplicate a nav list in a page — read it from here.

- `ROLE_CONFIG[role]` → `tagline`, `roleBadge`, `plan`, `userName`,
  `initials`, `home`, `nav[]` (`{ label, href, icon }`).
- `getRouteMeta(pathname, role)` → `{ title, crumbs }` for the topbar.
  Longest prefix match wins, so `/dashboard/student/my-applications`
  resolves correctly instead of collapsing into Overview.

**Adding a route:** add the `NavItem` in the right role's `nav` array.
Title, breadcrumb and sidebar link all update from one edit.

**Known gaps (intentional, UI-only for now):** the admin sidebar lists
`/dashboard/admin/transactions` (in the assignment spec) as a disabled
`soon: true` item — it renders a `SOON` chip instead of navigating to the
unbuilt route. The out-of-spec student Settings item was removed entirely.
Wire the transactions page and flip `soon` off (or leave the item disabled)
when the backend lands.

### `components/dashboard/sidebar.tsx`
Desktop sticky rail (`collapse` toggle) + mobile off-canvas drawer.
Reads `ROLE_CONFIG`; active link detection via `usePathname()`.
Closes on route change and Escape; drawer is `aria-hidden` when closed.

### `components/dashboard/topbar.tsx`
Breadcrumb (`Dashboard / <page>`), page title, search field with focus
shortcut hint, notification bell (dot badge), identity chip with role plan
tagline. Collapse toggle for the sidebar lives here.

### `components/dashboard/dashboard-shell.tsx`
`<DashboardShell role="student" | "tutor" | "admin">{children}</DashboardShell>`.
Client component. Owns sidebar collapse + drawer open state; closes the
drawer on pathname change (state adjusted during render, not in an effect).
Each role's `layout.tsx` renders exactly this and nothing else.

## `components/dashboard/shared.tsx` — the seven primitives

Import from `@/components/dashboard/shared`, never re-implement page-side.

### `IndexPanel`
Ink-black terminal frame, champagne tab header. Admin family (the "Trust
Office"). Replaces the three identical `TerminalPanel` copies that used to
live in the admin pages.

```tsx
<IndexPanel tab="THE MEMBER INDEX" meta={`${visible.length} on view`}>
  …
</IndexPanel>
```

| Prop        | Type              | Notes                                        |
|-------------|-------------------|----------------------------------------------|
| `tab`       | `string`          | ALL-CAPS tab title                           |
| `meta`      | `string?`         | Right-hand mono note, hidden below `sm`      |
| `children`  | `ReactNode`       | Panel body (`p-4`)                           |
| `className` | `string?`         | Grid span classes, e.g. `lg:col-span-7`      |

Used in: `admin/page.tsx`, `admin/users/page.tsx`, `admin/tuitions/page.tsx`.

### `StatusChip`
Bordered uppercase pill for approval states, applicant verdicts, role
badges and plan labels. Five tones: `sage` (good/approved), `terracotta`
(pending/warning), `rose` (rejected), `pine` (neutral ink), `gold`
(premium/pro).

```tsx
<StatusChip tone="terracotta" icon={CalendarDays}>Pending Review</StatusChip>
```

| Prop        | Type                          | Notes                                |
|-------------|-------------------------------|--------------------------------------|
| `tone`      | `"sage" \| "terracotta" \| "rose" \| "pine" \| "gold"` | required |
| `icon`      | `LucideIcon?`                 | Leading glyph, `size-3.5`            |
| `children`  | `ReactNode`                   | Uppercase copy                       |

Tone maps live page-side in `STATUS_META`/`ROLE_META` (`.tone` strings) —
the chip itself stays generic.

Used in: `admin/users/page.tsx`, `admin/tuitions/page.tsx`.

### `Monogram`
Circular initials avatar, ink fill, champagne border. Decorative —
`aria-hidden` by design (the adjacent name carries identity).

| `size` | diameter | text  |
|--------|----------|-------|
| `sm`   | 28px     | 10px  |
| `md`   | 36px     | 9px   |
| `lg`   | 44px     | 10px  |
| `xl`   | 56px     | 13px  |
| `2xl`  | 64px     | lg    |

```tsx
<Monogram initials="NI" size="2xl" />
```

Used in: `admin/users/page.tsx`, `admin/tuitions/page.tsx`.

### `EmptyState`
Dashed "nothing here" frame with icon, Georgia serif headline, mono
explanation and a single action button. `tone="paper"` (default; warm
cream panel, pine copy) for the Almanac/Register pages; `tone="terminal"`
(dark fill, champagne button) for the admin ink panels.

```tsx
<EmptyState
  Icon={Inbox}
  tone="terminal"
  title={<>The studio is <span className="italic text-[#C9A25E]">clear.</span></>}
  description="No submission matches your filters."
  actionLabel="Clear the desk"
  onAction={resetAll}
/>
```

| Prop          | Type                                   | Notes                     |
|---------------|----------------------------------------|---------------------------|
| `Icon`        | `LucideIcon`                           | `size-11`                 |
| `title`       | `ReactNode`                            | Georgia, italic allowed   |
| `description` | `ReactNode`                            | Mono, uppercase, tracked  |
| `actionLabel` | `string`                               | Button copy               |
| `onAction`    | `() => void`                           | Usually filter reset      |
| `tone`        | `"paper" \| "terminal"`                | Defaults to `paper`       |

Used in: `tutor/applicants/page.tsx`, `admin/tuitions/page.tsx`.
Not used for the bespoke pigeonhole illustration in
`student/my-applications/page.tsx` — that empty state carries a one-off
engraved-pigeonhole figure and stays page-local on purpose.

### `Colophon`
Dashboard page footer: arrow + back link left, mono note right, 2px top
rule. `tone="warm"` (default; pine rule) or `tone="ink"` (admin; ink rule).

```tsx
<Colophon backHref="/dashboard/tutor" backLabel="Back to the Register">
  <span>Ledger closes 21 Nov</span>
</Colophon>
```

Children render inside the right-hand mono row (wrap in
`inline-flex items-center gap-1.5`).

Used in: `tutor/page.tsx`, `tutor/settings/page.tsx`,
`tutor/my-tuitions/page.tsx`, `tutor/applicants/page.tsx`,
`student/my-applications/page.tsx`, `profile/page.tsx`, and the three admin
pages (`tone="ink"`). Kept page-local: `student/page.tsx` (custom
guarantee-ledger footer) and the two payment pages (dark ceremonial
colophons).

### `StickyRail`
`aside` wrapper applying the app-wide sticky offset (`lg:top-[136px]`) to
right-hand proof/selection sheets. Pass `ariaLabelledby` when the rail owns
a labelled heading.

```tsx
<StickyRail ariaLabelledby="proof-heading" className="lg:col-span-5">…</StickyRail>
```

Used in: `tutor/post-tuition/page.tsx`, `tutor/my-tuitions/page.tsx` (×2),
`tutor/applicants/page.tsx`.

### `CopyField`
Copy-to-clipboard row for short values (transaction references, invoice
IDs). Check-icon feedback for 1.8s; `aria-label="Copy {label}"`.

```tsx
<CopyField value={CONFIRMATION.transactionId} label="Transaction ID" />
```

Used in: `payment/success/page.tsx`.

## When NOT to extract

These stay page-local — they are identity, not reuse:

- **SeatGauge / portfolio beams / ruling ledgers** — one-off data visuals
  tied to a page's data model.
- **SealPanel / OathSlab / HangingBookmark** — ceremony devices unique to
  sign-up, sign-in and payment pages.
- **EmptyPigeonhole** — engraved pigeonhole figure unique to my-applications.
- **SVG charts** — hand-tuned viewBoxes; a generic chart wrapper would fit
  nothing.
- **The payment ceremony colophons** — different palette, different voice.

## Conventions

- **Typography floors:** body copy ≥15px; mono microcopy ≥9px
  (`10px` preferred, tracked uppercase); `sm:` pairs must be ≥ base pair
  (never shrink text on larger screens). Heading hierarchy is serif
  display + mono eyebrow, always distinguishable.
- **Focus states:** every interactive shared component has
  `focus-visible:outline` with the page's accent color.
- **Decorative vs. semantic:** icons/monograms are `aria-hidden`;
  meaningful controls always get `aria-label` or visible text.
- **`cn()` merges:** from `@/lib/utils` (note: several older `ui/*` files
  import the npm `cn` package instead — both work, leave them alone).
- **No page copy in `shared.tsx`.** If a string is page-specific, it is a
  prop.

## Checklist before adding to `shared.tsx`

- [ ] Used by ≥2 pages (or an obvious platform-wide pattern)
- [ ] No data fetching, no route knowledge, no page-specific copy
- [ ] Styling identical to the best existing page implementation
- [ ] Under ~60 lines
- [ ] Documented here and exported with a typed props interface

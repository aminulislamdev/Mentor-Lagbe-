# DESIGN.md — MentorLagbe Design System

> **Stack**: Next.js (App Router), Tailwind CSS v4, shadcn/ui, Lucide React
> **Purpose**: Concise reference for the current UI, color, typography, spacing, component, layout, and responsive conventions. The canonical token values live in `app/globals.css`; this document summarizes them.

---

## 1. Brand & Visual Concept — "The Modern Academic Atelier"

MentorLagbe is a warm, editorial, academic EdTech interface — *a bespoke library atelier meets a sharp developer command center*. It deliberately avoids sterile pure-white SaaS and noisy classified-portal styling.

**Signature motifs**
- **Hairline structure**: 1px dividers/borders (`--border`, ~`rgba(52,76,67,0.15–0.16)`) evoking archival ledger sheets.
- **Warm grounding**: sand/oatmeal canvas (`#D9CBB5`), never pure `#FFFFFF` as the main page background.
- **Editorial asymmetry**: 60/40 or 70/30 splits, pinned sidebars, offset bands instead of monotonous 3-col grids.
- **Ledger / dossier metaphors**: tuitions render as structured *Academic Batches & Mentorship Dossiers* (subject tag, fee, metadata strip, status seal).
- **Calm motion** + branded compass mark; **modern X icon** (never the legacy Twitter bird).

---

## 2. Color System

### 2.1 Core palette (light / default)

| Role | Hex | Token / usage |
| :--- | :--- | :--- |
| Canvas background | `#D9CBB5` | `bg-background`; body |
| Surface / card | `#EFE7DC` | `bg-card`, `bg-popover` |
| Surface alt / muted | `#E4D5BE` | `bg-secondary`, `bg-muted`, table heads, hover |
| Text & headings | `#344C43` | `text-foreground` (deep forest pine) |
| Muted text | `#4A695C` | `text-muted-foreground` (pine light) |
| Brand / primary action | `#668B78` | `bg-primary`, `text-primary`, active states (sage) |
| Primary foreground | `#FFFFFF` | `text-primary-foreground` |
| Primary hover/pressed | `#537363` | sage dark |
| Accent / Pro / pending | `#B87959` | `bg-accent`, `text-accent`, `border-accent` (terracotta) |
| Accent hover | `#9F6446` | terracotta dark |
| Accent foreground | `#FFFFFF` | `text-accent-foreground` |
| Destructive / rejected | `#A34343` | `bg-destructive`, red.500/600 tints |
| Hairline border | `rgba(52,76,67,0.15–0.16)` | `border-border` |
| Input border | `rgba(52,76,67,0.20)` | `border-input` |
| Focus ring | `#668B78` | `ring-ring`, `ring-2 ring-offset-1` |
| Charts | `#668B78 #B87959 #344C43 #4A695C #E4D5BE` | `chart-1…5` |
| Sidebar tokens | `#EFE7DC` surface, `#344C43` fg, `#668B78` active, `#E4D5BE` accent | `sidebar-*` tokens |

**Named vs. arbitrary usage.** Use semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `bg-accent`, `border-border`, `ring-ring`) where available; many components apply palette hex directly via Tailwind arbitrary values (`bg-[#D9CBB5]`, `text-[#344C43]`, `border-[#344C43]/15`, `bg-[#668B78]/15`, `bg-[#B87959]/15`). Keep one convention per component.

### 2.2 Semantic status

- **Approved / active / paid**: `bg-[#668B78]/15 text-[#344C43] border border-[#668B78]/30`
- **Pending / in review**: `bg-[#B87959]/15 text-[#8A4F32] border border-[#B87959]/30`
- **Rejected / cancelled / closed**: `bg-[#A34343]/15 text-[#732626] border border-[#A34343]/30`
- **Pro / accent badge**: `bg-[#344C43] text-[#EFE7DC] border border-[#B87959]/40`

Domain values: `approvalStatus: pending|approved|rejected`, `isActive`, application `pending|accepted|rejected`, `plan: free|pro`, `role: student|tutor|admin`, payment `paid`. Currency `৳` (BDT) for fees, USD for Stripe subscription pricing.

### 2.3 Dark theme ("Nocturne")

`.dark` class on `<html>`, toggled by theme control. No pitch black.

| Token | Light | Dark |
| :--- | :--- | :--- |
| background | `#D9CBB5` | `#1A2823` |
| foreground | `#344C43` | `#EFE7DC` |
| card / popover | `#EFE7DC` | `#243630` |
| primary | `#668B78` | `#7AA890` |
| accent | `#B87959` | `#C98B6D` |
| muted / secondary | `#E4D5BE` | `#243630` / `#2D423B` |
| muted-foreground | `#4A695C` | `rgba(217,203,181,0.75)` |
| destructive | `#A34343` | `#C45555` |
| border / input | `rgba(52,76,67,0.16/0.20)` | `rgba(217,203,181,0.15/0.20)` |
| ring | `#668B78` | `#7AA890` |

Dashboards share the shell and tokens but may apply scoped role accents/styling (e.g. student "almanac", tutor "studio", admin "terminal"); preserve the shared palette and terminal-inspired admin direction.

---

## 3. Typography

- **Body / UI**: **Geist Sans** (`--font-geist-sans`, `font-sans`); base ~15px, line-height 1.5–1.6; muted ~13–14px; captions ~11–12px uppercase tracked.
- **Mono**: **Geist Mono** (`--font-geist-mono`, `font-mono`) for fees `৳`, numbers, dates, IDs, badges, eyebrow labels, and data tables; small uppercase with `tracking-wider`/`tracking-widest`.
- **Display / headings**: editorial serif in scoped sections (system **Georgia / Times New Roman** fallback); semibold/bold; `tracking-tight`. `--font-heading` maps to `--font-sans`; don't require external fonts.
- **Hierarchy** (responsive; scale up at `sm`/`lg`):
  - H1 hero ~36px → 48px → 60px; tight `leading`
  - H2 ~32–40px; H3 ~20–24px; H4 ~16–18px
  - Body 15px; muted 13–14px; caption/badge 11–12px uppercase mono

Keep long titles wrapping cleanly; truncate secondary metadata (`truncate`, `line-clamp`) without clipping primary content.

---

## 4. Spacing, Radius & Borders

- **8px base grid**; Tailwind scale. Micro `4/8px`, component padding `16/24/32px`, section rhythm `py-8` dashboards, `py-20`→`py-28` landing.
- **Gutters**: 16px mobile, 24/32px tablet, 32–64px desktop; containers centered `mx-auto`.
- **Containers**: content `max-w-7xl` (1280px), longform/tuition `max-w-5xl`, auth `max-w-md`/50-50 split, dashboard fluid `max-w-[1600px]`.
- **Radius**: `--radius: 0.75rem`; `rounded-xl`, `rounded-2xl` for cards; buttons `rounded-xl` (not full pills).
- **Borders**: hairline 1px (`border-border`); 2px accent top rule optional; no heavy shadows.

---

## 5. Components

Shared UI in `components/ui` (shadcn-style): **Button**, **Input**, **Textarea**, **Label**, **Checkbox**, **Avatar**. Reusable dashboard/common components live in `components/dashboard` & `components/common`. `cn()` merges Tailwind.

**Buttons** — intentional, tactile; `active:scale-[0.98]`, hover `-translate-y-0.5` on cards:
- *Primary* `bg-primary` → `#537363`, text `primary-foreground`
- *Dark brand* `bg-[#344C43]` → `#263831`, text `#D9CBB5`
- *Accent / Pro* `bg-accent` (`#B87959`) → `#9F6446`
- *Ghost / outline* transparent, `border`, hover `bg-card`
- Sizes ~44px tap height on mobile; full-width primary on narrow forms.

**Form inputs** — surface `#EFE7DC`, `border-input`, top-aligned uppercase label (`text-xs font-semibold tracking-wider`), focus `ring-2 ring-primary ring-offset-1`, inline `text-xs text-red-700` error + `border-destructive`, full-width on mobile.

**Cards / dossiers** — `bg-card`, hairline border, optional 2px top accent, subject tag mono, `৳` price lockup, equal grid heights in card grids.

**Data tables** — `bg-card` container `overflow-hidden rounded-2xl`, head `#E4D5BE`-tinted mono uppercase, row hover, `border-b` dividers, row `truncate`/`min-w-0`. **On mobile wrap tables in `overflow-x-auto` or stack to card-list**; never clip.

**Status badges** — semantic status classes (§2.2), small uppercase mono; role + plan chips (`[STUDENT]`, `[TUTOR • PRO]`, `[ADMIN]`).

**Dialogs / modals** — `bg-card`, hairline frame, fits viewport, scrollable body, safe top/bottom spacing, close control, `Cancel` + primary action. Apply-tuition modal collects phone, schedule, note.

**Navbar** (`components/navbar.tsx`) — grounded ribbon, `bg-background/85 backdrop-blur-md border-b border-border/80`, logo + tagline, `Home · Browse Tuitions · Pricing · About`, auth-state right side (`Sign In` + `Sign Up`, or role badge + avatar + dropdown + Sign Out); **mobile hamburger → drawer**. Conditional public footer; hidden on dashboard.

**Footer** (`components/footer.tsx`) — deep pine, `#D9CBB5`/`#EFE7DC`, brand + contact + nav columns, social **modern X**, bottom bar + Stripe/BetterAuth seal. Conditional (`ConditionalFooter`, hidden on `/dashboard`).

**Dashboard shell** (`components/dashboard`) — `DashboardShell`, `Sidebar`, `nav-config`, `shared`, `studio`/`studioStyles`, `cn`. Fluid canvas `max-w-[1600px]`; rendered sidebar is deep-pine `#344C43` + `#EFE7DC`, active `#EFE7DC/10`, accent `#B87959`/`#C98B6D` (distinct from the `sidebar-*` CSS tokens); `px-4 sm:px-6 lg:px-8`. Roles: `student | tutor | admin`.

---

## 6. Layouts

- **Public pages**: max-width content, hero asymmetry, responsive `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, clear CTAs, real backend data for listings.
- **Auth**: editorial split (deep-pine left / sand right) on desktop, single column on mobile.
- **Tuitions list**: search + filters, responsive grid, server-side pagination, empty/loading states.
- **Tuition detail**: two-column (content + sticky booking docket); sticky CTA; mobile stacked; apply action role-aware (student applies; tutor/admin disabled; unauthenticated → sign in).
- **Dashboards**: `DashboardShell` + `Sidebar` + top bar; KPI grids; listings/applicants/users/tuitions/transactions tables; shared `Colophon`/`IndexPanel`/`EmptyState`.
- **Pricing / payment**: Free vs Pro matrix (Student Pro $10, Tutor Pro $15); checkout → Stripe; `/payment/success`, `/payment/cancel`.

---

## 7. Responsive Guidelines

**Breakpoints** (Tailwind defaults): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Mobile-first; unprefixed = mobile base, layer `sm/md/lg/xl`. `viewport: width=device-width, initial-scale=1`.

**Mobile (<640px)**
- No unwanted horizontal page scrolling; no fixed widths that overflow; `min-w-0` on flex/grid children.
- Single-column stacks; cards full width; tables `overflow-x-auto` or card-stack; sticky bottom CTAs where useful.
- Navbar hamburger + drawer; dashboard sidebar collapses to a drawer/toggle; hide non-essential chrome.
- Forms fit screen; full-width inputs; labels above; comfortable tap targets (≥32–44px); dialogs ≤ viewport (max-width, scroll, `overflow` containment).
- Images scale (`w-full`, `h-auto`, `object-cover`); no distortion; no clipped/overlapping text.
- Responsive type scales up at `sm`/`lg`.

**Tablet (640–1023px)** — 2-column balanced grids; sidebar compact/toggle; usable tables/forms; balanced dashboard spacing; nav fully working.

**Desktop (≥1024px)** — preserve design; multi-column editorial grids; persistent sidebar; `max-w-*` containers (avoid over-stretch); consistent spacing/alignment.

**Prohibited** — pure-white main canvas; blue/purple SaaS gradients; legacy Twitter bird; mismatched card heights in a grid; mobile tables that clip/overflow (use `overflow-x-auto`/cards); fixed px widths that break small screens; disabling reduced-motion.

---

## 8. Motion & State Handling

- `transition-all duration-200 ease-out`; card hover `-translate-y-1` + border tone; button `active:scale-[0.98]`.
- Honor `@media (prefers-reduced-motion: reduce)`.
- **Loading**: skeleton `bg-muted/… animate-pulse rounded-xl`; branded spinner; explicit loading states (not silent zeros).
- **Empty**: warm empty state + reset/next action. **Error**: `error.tsx` / `not-found.tsx`; 404 archival sheet + primary recovery; retry on error.
- **404** message + `Return to Academic Catalog`; **500** retry + diagnostics id. Toasts via **Sonner** (`Toaster`).

---

## 9. Accessibility

- WCAG AA contrast minimum; pine-on-sand & sage CTAs keep ≥4.5:1; don't rely on color alone for status.
- Keyboard navigable; visible `focus-visible:ring-2 ring-primary` on all interactive elements.
- Real `<label htmlFor>`, matching ids; `aria-invalid` + `aria-describedby` on errors; `aria-label` on icon buttons; modern **X** icon; `aria-hidden` on decorative SVG.
- `role="dialog"` + close; landmarks (`header/nav/main/footer/aside`); alt text on images; `prefers-reduced-motion`.

---

## 10. Data & Content Truth

Prefer real backend data; no hardcoded user content. Consistent **empty / loading / error** states. Real values for names, tuitions, applications, stats, transactions; `৳`/USD formatting; honest status seals (e.g. "Pending", "Approved", "Cancelled — no charge"). `not-found` for unknown routes.

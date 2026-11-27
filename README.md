<div align="center">

# MentorLagbe — Client

The Next.js frontend for **MentorLagbe**, a role-aware tuition and mentorship marketplace for Bangladesh.  
Students browse and apply to listings. Tutors publish and manage them. Admins moderate everything.

**Live:** [mentor-lagbe-c.vercel.app](https://mentor-lagbe-c.vercel.app) &nbsp;|&nbsp; **API:** [mentor-lagbe-s.vercel.app](https://mentor-lagbe-s.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Architecture Overview](#architecture-overview)
8. [Authentication & Roles](#authentication--roles)
9. [API Layer](#api-layer)
10. [Theme System](#theme-system)
11. [Internationalization](#internationalization)
12. [Component Library](#component-library)
13. [Known Limitations](#known-limitations)
14. [Contributing](#contributing)
15. [License](#license)
16. [Contact](#contact)

---

## Features

### Public pages
- Browse approved, active tuition listings with search, subject, class level, Online/Offline mode, and fee-range filters
- Tuition detail page
- About and Pricing pages
- Light / dark / system theme — no flash on load, no hydration mismatch

### Students
- Dashboard summary: total, pending, and accepted application counts
- Apply to a tuition (phone, preferred schedule, optional note)
- View all submitted applications and withdraw a pending one
- Edit profile: name, phone number, bio, and avatar
- Upgrade to Student Pro via Stripe Checkout

### Tutors
- Dashboard summary: listing counts (total / approved / active), total applicants
- Create a tuition listing (title, subject, class level, mode, location, monthly fee, days per week, banner image, description)
- Edit and delete own listings; toggle a listing active or closed
- Listings start as `pending` — admin approval is required before they appear publicly
- Free plan: maximum 2 active listings; Pro plan: unlimited
- View all applicants across own listings; accept or reject each application
- Edit profile; upload images (avatar, banner) via the server-side ImgBB proxy
- Upgrade to Tutor Pro via Stripe Checkout

### Admins
- Dashboard summary: users, tuitions, applications, and revenue (Stripe) across the platform
- User management: search, filter by role, change role, delete user
- Tuition moderation: approve, reject, or revert a listing to pending
- Application ledger: view all applications across all tuitions
- Send notifications to all users, students only, or tutors only
- View the full payment/transaction history
- Settings: language, timezone, and notification preferences (admin-scoped)

---

## Tech Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| Framework | Next.js (App Router) | ^16.4.6 |
| UI runtime | React | 19.3.0 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | 4.3.3 |
| Animations | tw-animate-css | ^1.4.0 |
| Component primitives | shadcn/ui | ^4.23.0 |
| Base UI | @base-ui/react | ^1.9.0 |
| Icons | lucide-react | ^1.75.0 |
| Charts | Recharts | ^3.11.0 |
| Toasts | Sonner | ^2.0.8 |
| Auth | BetterAuth | ^1.7.25 |
| Payments | @stripe/stripe-js | ^10.3.0 |
| Fonts | Geist, Noto Sans Bengali (via next/font) | — |
| Linting | ESLint | ^9 |

---

## Project Structure

```
my-app/
├── app/                            # Next.js App Router
│   ├── (auth)/                     # Auth pages (no shared layout)
│   │   ├── sign-in/                # Email + Google sign-in
│   │   ├── sign-up/                # Registration
│   │   └── callback/               # OAuth redirect handler
│   ├── api/                        # Next.js Route Handlers (BetterAuth endpoints)
│   ├── dashboard/
│   │   ├── admin/                  # Admin-only pages
│   │   │   ├── layout.tsx          # Admin shell + role guard
│   │   │   ├── page.tsx            # Dashboard overview
│   │   │   ├── users/              # User management
│   │   │   ├── tuitions/           # Listing moderation
│   │   │   ├── notifications/      # Send notifications
│   │   │   ├── transactions/       # Payment ledger
│   │   │   └── settings/           # Admin preferences (fully translated)
│   │   ├── tutor/                  # Tutor-only pages
│   │   │   ├── layout.tsx          # Tutor shell + role guard
│   │   │   ├── page.tsx            # Dashboard overview
│   │   │   ├── my-tuitions/        # Manage own listings
│   │   │   ├── post-tuition/       # Create a new listing
│   │   │   ├── applicants/         # Manage incoming applications
│   │   │   └── settings/           # Tutor preferences
│   │   └── student/                # Student-only pages
│   │       ├── layout.tsx          # Student shell + role guard
│   │       ├── page.tsx            # Dashboard overview
│   │       ├── my-applications/    # View and withdraw applications
│   │       └── settings/           # Student preferences
│   ├── tuitions/                   # Public listing browse + detail
│   ├── about/                      # Public about page
│   ├── pricing/                    # Public pricing page
│   ├── checkout/                   # Stripe checkout redirect
│   ├── payment/                    # Payment success / cancel landing
│   ├── layout.tsx                  # Root layout (fonts, theme pre-paint, HtmlLangSync)
│   ├── globals.css                 # Tailwind imports + CSS token definitions
│   ├── loading.tsx                 # Root loading UI
│   ├── error.tsx                   # Root error boundary
│   └── not-found.tsx               # 404 page
│
├── components/
│   ├── ui/                         # Base primitives (Avatar, Button, Input, Label, Textarea, Checkbox)
│   ├── common/                     # Shared page-level pieces
│   │   ├── dashboard-section.tsx   # Section header with numeral
│   │   ├── error-state.tsx         # Error display
│   │   ├── filter-bar.tsx          # Search + filter controls
│   │   ├── form-field.tsx          # Labelled input wrapper
│   │   ├── loading-state.tsx       # Spinner / skeleton
│   │   ├── panel.tsx               # Card panel
│   │   └── stat-card.tsx           # Dashboard count card
│   ├── dashboard/                  # Dashboard chrome
│   │   ├── sidebar.tsx             # Navigation sidebar
│   │   ├── topbar.tsx              # Top navigation bar
│   │   ├── dashboard-shell.tsx     # Layout wrapper
│   │   ├── role-guard.tsx          # Client-side role check component
│   │   ├── nav-config.ts           # Sidebar link definitions per role
│   │   └── shared.tsx              # Shared dashboard pieces (Colophon, etc.)
│   ├── navbar.tsx                  # Public navigation bar
│   ├── conditional-footer.tsx      # Footer (hidden on dashboard routes)
│   ├── footer.tsx                  # Footer markup
│   ├── html-lang-sync.tsx          # Syncs <html lang="…"> to saved language setting
│   ├── notification-bell.tsx       # Notification bell with unread badge
│   ├── theme-toggle.tsx            # Light / dark / system toggle button
│   └── tuition-card.tsx            # Tuition listing card
│
└── lib/
    ├── api.ts                      # apiFetch, apiGet, uploadImage, createCheckoutSession
    ├── api-types.ts                # All shared TypeScript types (Role, Plan, Application, etc.)
    ├── auth.ts                     # BetterAuth server config (email/password + Google + JWT plugin)
    ├── auth-client.ts              # BetterAuth React client (useSession, signIn, signOut)
    ├── auth-token.ts               # JWT cache: getJwt, clearJwtCache
    ├── theme.ts                    # applyTheme, useTheme, themeScript (no-flash pre-paint)
    ├── stripe.ts                   # Stripe client initialisation
    ├── tuition-service.ts          # Tuition API helpers
    ├── utils.ts                    # cn() and other utilities
    ├── adapters.ts                 # Data adapter helpers
    ├── hooks/                      # Custom React hooks
    │   └── use-user-settings.ts    # Fetch and PATCH /api/users/me settings
    └── i18n/                       # Internationalisation
        ├── en.ts                   # English dictionary
        ├── bn.ts                   # Bangla dictionary
        ├── types.ts                # TranslationKey union type
        ├── index.ts                # getDictionary / localeFromSetting / t
        └── use-locale.ts           # useLocale hook
```

---

## Getting Started

### Prerequisites

- **Node.js** LTS 20+ (no `engines` field is set; `@types/node: ^20`)
- **npm** (a `package-lock.json` is present)
- A running instance of **MentorLagbe-Server** — local or the deployed API

### 1. Clone the repository

```bash
git clone <REPO_URL>
cd MentorLagbe-Client/my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in this directory. See [Environment Variables](#environment-variables) for the full table.

### 4. Run the development server

```bash
npm run dev
```

The app is available at **http://localhost:3000**.

---

## Environment Variables

Create `.env.local` and populate the following variables. Never commit this file.

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Express server, e.g. `http://localhost:8000` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of this Next.js app — used by BetterAuth for the JWKS and redirect URLs |
| `MONGODB_URI` | Yes | MongoDB connection string — shared with the server so BetterAuth and Express read the same `users` collection |
| `BETTER_AUTH_URL` | Yes | BetterAuth base URL (usually the same as `NEXT_PUBLIC_APP_URL`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID (for Google sign-in) |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (server-side usage for checkout and webhook) |

> `NEXT_PUBLIC_*` variables are embedded in the browser bundle. Never put secrets in them.

---

## Available Scripts

| Script | Command | What it does |
| :--- | :--- | :--- |
| Development server | `npm run dev` | Starts Next.js with Turbopack (hot reload) |
| Production build | `npm run build` | Compiles and optimises for production |
| Production server | `npm start` | Serves the production build |
| Lint | `npm run lint` | Runs ESLint across all source files |

---

## Architecture Overview

```
Browser
  │
  ├── Next.js App Router (RSC by default)
  │     ├── Public routes   → app/(auth), app/tuitions, app/about, app/pricing
  │     └── Dashboard routes→ app/dashboard/{admin,tutor,student}/**
  │
  ├── BetterAuth (runs on Next.js Route Handlers under app/api/auth/*)
  │     └── Issues JWT → stored in BetterAuth session cookie
  │
  ├── lib/auth-token.ts  — exchanges the session cookie for a short-lived JWT
  │     └── 5-minute in-memory cache; force-refreshes on 401
  │
  └── lib/api.ts (apiFetch)
        └── Attaches Bearer token → fetch → Express API (NEXT_PUBLIC_API_URL)
```

**Data flow for a protected page:**

1. User signs in via BetterAuth (email/password or Google).
2. BetterAuth sets a session cookie and can issue a JWT via its `jwt()` plugin.
3. `getJwt()` (`lib/auth-token.ts`) calls `GET /api/auth/token` to exchange the cookie for the JWT, caching it for 5 minutes.
4. `apiFetch` / `apiGet` attach `Authorization: Bearer <token>` to every request to the Express API.
5. On a 401, the cache is cleared and the token is refreshed once automatically.

---

## Authentication & Roles

Authentication is provided by [BetterAuth](https://better-auth.com/). The server configuration (`lib/auth.ts`) sets up:

- **Email and password** sign-in and sign-up
- **Google OAuth** via `socialProviders`
- The `jwt()` plugin so the Express API can verify tokens via JWKS without sharing a secret

The Express API reads `users.role` from MongoDB on **every request** — a role change takes effect immediately without requiring the user to sign out.

| Role | Dashboard route | Access |
| :--- | :--- | :--- |
| `student` | `/dashboard/student` | Browse listings, apply, manage own applications |
| `tutor` | `/dashboard/tutor` | Create and manage listings, review applicants |
| `admin` | `/dashboard/admin` | Full platform moderation and analytics |

Role guards are enforced at two levels:

1. **Server**: middleware (`middleware.ts`) blocks unauthenticated requests to `/dashboard/*`.
2. **Client**: each `app/dashboard/{role}/layout.tsx` reads the session and redirects if the role does not match.

---

## API Layer

All calls to the Express API go through `lib/api.ts`.

```ts
import { apiFetch, apiGet, ApiError } from "@/lib/api"

// Authenticated GET — unwraps { success, data } → T
const tuitions = await apiGet<Tuition[]>("/api/tuitions/mine")

// Authenticated PATCH with a body
await apiFetch("/api/users/me", {
  method: "PATCH",
  body: { name: "Ahmed" },
})

// Public GET — no token needed
const listing = await apiGet<Tuition>(`/api/tuitions/${id}`, { auth: false })

// Error handling
try {
  await apiFetch("/api/tuitions", { method: "POST", body: data })
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.message)
  }
}
```

| Feature | Detail |
| :--- | :--- |
| JWT attachment | Automatic via `getJwt()` when `auth: true` (default) |
| Token cache | 5-minute in-memory cache in `lib/auth-token.ts` |
| Auto-retry | One retry after `clearJwtCache()` on a 401 |
| Envelope unwrapping | `{ success, data, pagination?, message? }` → `ApiResult<T>` |
| Typed errors | `ApiError` with `.status` and `.message` |

---

## Theme System

The theme system lives entirely in `lib/theme.ts`. It does **not** use a provider library.

- **Pre-paint script** (`app/layout.tsx`, `<head>`): reads `localStorage["theme"]`, adds `.dark` to `<html>`, and sets `color-scheme` before the first paint — no flash, no hydration mismatch.
- **`applyTheme(mode)`**: toggles `.dark`, sets `color-scheme`, and persists to `localStorage`. Safe to call from any component or event handler.
- **`useTheme()`**: returns `{ isDark, mode, applyTheme }`. Uses `useSyncExternalStore` to listen to `MutationObserver` (in-tab) and `storage` events (cross-tab).

Three modes are supported: `"light"`, `"dark"`, `"system"` (follows OS preference).

The dark variant in `globals.css` uses Tailwind's `.dark` class strategy:

```css
@custom-variant dark (&:is(.dark *));
```

---

## Internationalization

Supported languages and their locale codes:

| Code | Label |
| :--- | :--- |
| `en-US` | English (US) |
| `bn-BD` | বাংলা (Bangla) |

The user's choice is persisted in `users.settings.language` via `PATCH /api/users/me`. The `useLocale()` hook reads it and returns a typed `t(key)` function.

**Adding a new string:**

1. Add the key and English value to `lib/i18n/en.ts`.
2. Add the same key with the Bangla translation to `lib/i18n/bn.ts`.
3. The `TranslationKey` type in `lib/i18n/types.ts` updates automatically — the TypeScript compiler will catch any missing or wrong keys.

**What is currently translated:** The admin Settings page (`app/dashboard/admin/settings/page.tsx`) is fully wired to `useLocale()`. All other pages use hardcoded English strings.

---

## Component Library

### Primitives (`components/ui/`)

Small, unstyled-then-styled building blocks: `Avatar`, `Button`, `Checkbox`, `Input`, `Label`, `Textarea`. Styled with `cn()` and Tailwind utility classes.

### Common pieces (`components/common/`)

| Component | Purpose |
| :--- | :--- |
| `DashboardSection` | Section heading with numeral prefix |
| `Panel` | Card-style container |
| `StatCard` | Dashboard KPI card (label + count) |
| `FilterBar` | Search input and dropdown filters |
| `FormField` | Labelled, error-aware input wrapper |
| `LoadingState` | Spinner / skeleton placeholder |
| `ErrorState` | Error message with retry option |

### Design tokens (`globals.css`)

| Token | Light value | Purpose |
| :--- | :--- | :--- |
| `--foreground` | `#344C43` | Forest green — primary text |
| `--primary` | `#668B78` | Muted green — primary interactive |
| `--card` | `#EFE7DC` | Warm paper — card background |
| `--background` | `#D9CBB5` | Warm sand — page background |
| `--accent` (editorial) | `#B87959` | Copper — accent and decorative |

Typography: **Geist** (sans-serif, body), **Geist Mono** (monospace, metadata), **Noto Sans Bengali** (Bengali script). All loaded via `next/font/google` with `display: swap`.

---

## Known Limitations

The following items are verified in code and are not yet fully implemented.

| Item | File |
| :--- | :--- |
| **Change Password button** — renders but no API endpoint is called on click | `app/dashboard/admin/settings/page.tsx` |
| **Active Sessions panel** — shows one hardcoded "This Device / Active now" entry; no real session-listing API is called | `app/dashboard/admin/settings/page.tsx` |
| **Maintenance mode** and **Registration open** toggles — `useState` only, never sent to the server | `app/dashboard/admin/settings/page.tsx` |
| **UI-only notification rows** — "New Student Registration" and "System Updates" items have no backend field; their state is local and not persisted | `app/dashboard/admin/settings/page.tsx` |
| **Tutor and Student settings pages** — not audited; likely have the same UI-only limitations as the admin page | `app/dashboard/tutor/settings/`, `app/dashboard/student/settings/` |
| **i18n coverage** — only the admin Settings page is translated; all other pages use hardcoded English strings | `lib/i18n/` |

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/<name>`
2. Keep each commit focused on one file or concern.
3. Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`, `test:`
4. Run `npm run lint` before pushing.
5. Open a pull request with a short description of what changed and why.

**Code conventions:**

- Prefer Server Components; add `"use client"` only when the component needs browser APIs or React state.
- Use `cn()` for conditional Tailwind classes.
- Use `ApiError` from `lib/api.ts` for all API error handling — do not create ad-hoc error shapes.
- All new translation strings must be added to both `en.ts` and `bn.ts` with the same key.

---

## 📄 License

Licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## Contact

If you have any questions or encounter any issues, feel free to reach out through the following channels or open an issue.

- **Name:** Aminul Islam
- **Email:** [aminulislam424842@gmail.com](mailto:aminulislam424842@gmail.com)
- **GitHub:** [GitHub Profile](https://github.com/aminulislamdev)
- **LinkedIn:** [LinkedIn Profile](https://www.linkedin.com/in/aminulislamjs/)
- **WhatsApp:** [Contact on WhatsApp](https://wa.me/8801709150885)
- **Portfolio:** [Visit Portfolio](https://aminul-seven.vercel.app/)
- **Issue Tracker:** [Report an Issue](https://github.com/aminulislamdev/Mentor-Lagbe-Client/issues)

# DESIGN.md — MentorLagbe Design System & Visual Identity

> **Version**: 1.0.0  
> **Target Platform**: Next.js 15+ (App Router), Tailwind CSS v4 / v3, Shadcn UI, Lucide React  
> **Document Purpose**: Authoritative visual design specification, token catalog, and UX guidelines for the MentorLagbe platform.

---

## 1. Brand Identity & Visual Concept: "The Modern Academic Atelier"

### 1.1 The Brand Thesis
Most modern EdTech platforms suffer from one of two extremes:
1. **The Corporate SaaS Cliché**: Sterile pure-white backgrounds (`#FFFFFF`), neon blue/purple gradients, generic pill badges, and floating glassmorphism cards.
2. **The Outdated Classified Portal**: Dense, unstyled text tables with noisy ads, harsh contrast, and zero emotional resonance.

**MentorLagbe** rejects both. It adopts the visual concept of **"The Modern Academic Atelier"** (বাতিঘর / The Scholar's Workshop). It merges the quiet dignity of a bespoke British/Oxford library atelier with the razor-sharp functional speed of a modern developer command center.

### 1.2 Signature Design Motifs
- **Architectural Framing & Hairline Dividers**: Crisp `1px` structural borders (`rgba(52, 76, 67, 0.15)`) evoke archival ledger sheets and technical draughtsmanship.
- **Warm Canvas Grounding**: A global warm sand/oatmeal canvas (`#D9CBB5`) that reduces eye strain, eliminates sterile glare, and establishes immediate material warmth.
- **Editorial Asymmetry**: Sections feature dynamic layout weight shifts (e.g., 60/40 splits, horizontal editorial bands, pinned sidebar ledgers) rather than monotonous repetitive 3-column grids.
- **Physical Ledger & Dossier Metaphors**: Tuition listings are rendered not as playful toy cards, but as curated **"Academic Batches & Mentorship Dossiers"** with structured metadata strips, crisp typography, and dignified status seals.

---

## 2. Color & Typography Systems

### 2.1 The Master Color Palette

```
  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
  │     PRIMARY     │   │   BACKGROUND    │   │   DARK ACCENT   │   │     ACCENT      │
  │     #668B78     │   │     #D9CBB5     │   │     #344C43     │   │     #B87959     │
  │   (Sage Green)  │   │  (Warm Oatmeal) │   │  (Forest Pine)  │   │   (Terracotta)  │
  └─────────────────┘   └─────────────────┘   └─────────────────┘   └─────────────────┘
```

#### Color Application Hierarchy

| Token Name | Hex Code | Tailwind Custom Token | Role & Strict Usage Rules |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#D9CBB5` | `bg-sand-canvas` | Global page body background. Must never be overridden by pure white (`#FFFFFF`) on main page viewports. |
| **Surface Cream** | `#EFE7DC` | `bg-sand-surface` | Primary elevated surface for cards, modal dialogs, dashboard panels, and input backgrounds. |
| **Surface Alt / Muted** | `#E4D5BE` | `bg-sand-subtle` | Secondary surfaces, table headers, hover highlights, and input borders. |
| **Dark Accent (Core Text)**| `#344C43` | `text-pine-deep` | Main headlines (`h1`-`h4`), dark buttons, navigation bar background, footer surface, and high-emphasis body text. |
| **Dark Accent Light** | `#4A695C` | `text-pine-light` | Secondary body text, sub-captions, and inactive tab links. |
| **Primary (Brand Action)** | `#668B78` | `bg-sage-primary` | Primary action CTAs (*Apply Now*, *Save*, *Confirm*), active tabs, progress meters, and success states. |
| **Primary Hover** | `#537363` | `bg-sage-dark` | Hover and active pressed state for primary action buttons. |
| **Accent (Highlight)** | `#B87959` | `text-terra-accent` | Pro Plan tags, high-priority notifications, "Pending" status badges, featured tags, and star ratings. |
| **Accent Hover** | `#9F6446` | `bg-terra-dark` | Hover state for accent buttons and Pro upgrade triggers. |
| **Hairline Border** | `rgba(52, 76, 67, 0.16)` | `border-pine-hairline` | Ubiquitous 1px divider for grid items, card outlines, table borders, and modal frames. |

### 2.2 Semantic Status System
Status indicators must strictly adhere to contextual, low-saturation tones that harmonize with `#D9CBB5`:
- **Approved / Active / Paid**: `bg-[#668B78]/15 text-[#344C43] border border-[#668B78]/30`
- **Pending / In Review**: `bg-[#B87959]/15 text-[#8A4F32] border border-[#B87959]/30`
- **Rejected / Cancelled / Closed**: `bg-[#A34343]/15 text-[#732626] border border-[#A34343]/30`
- **Pro Tier Badge**: `bg-[#344C43] text-[#EFE7DC] border border-[#B87959]/40` with an accent dot in `#B87959`.

### 2.3 Typography Scale & Font Pairing
- **Display & Headings**: A refined, modern serif or editorial grotesque (e.g., **`Newsreader`**, **`Playfair Display`**, or high-character **`Cabinet Grotesk` / `Plus Jakarta Sans`**).
- **Body & Functional UI**: **`Inter`** or **`Geist Sans`**. Highly legible at 12px–15px in dense data tables and form inputs.
- **Numbers, Fees & Badges**: **`Geist Mono`** or **`JetBrains Mono`** for tuition prices (`৳ 4,500/mo`), dates, and transaction IDs.

```text
H1 (Hero Headline)       : 44px - 56px / 1.1 line-height / Bold (700) / tracking-tight
H2 (Section Headline)    : 32px - 40px / 1.2 line-height / SemiBold (600) / tracking-tight
H3 (Sub-headers & Cards) : 20px - 24px / 1.3 line-height / SemiBold (600)
H4 (Panel Headers)       : 16px - 18px / 1.4 line-height / Medium (500)
Body (Default)           : 15px / 1.6 line-height / Regular (400)
Body Muted               : 13px - 14px / 1.5 line-height / Regular (400)
Caption / Badge / Data   : 11px - 12px / 1.4 line-height / Medium (500) / uppercase mono
```

---

## 3. Layout, Spacing, Grids & Responsive Rules

### 3.1 Spacing Scale & Rhythm
We follow an **8-point base grid** with proportional fractional scales:
- Micro spacing (badges, pill tags): `4px` (`gap-1`), `8px` (`gap-2`)
- Component internal padding: `16px` (`p-4`), `24px` (`p-6`), `32px` (`p-8`)
- Container gutters: `16px` (Mobile), `32px` (Tablet), `64px` (Desktop)
- Section vertical rhythm: `80px` (`py-20`) to `112px` (`py-28`) for landing pages; `32px` (`py-8`) for dashboard views.

### 3.2 Maximum Container Widths
- Standard Content: `max-w-7xl` (`1280px`) centered with `mx-auto px-4 sm:px-6 lg:px-8`.
- Editorial Longform / Tuition Details: `max-w-5xl` (`1024px`) for optimal reading line-lengths.
- Auth Flow Panels: `max-w-md` (`448px`) or structured split-screen `50vw / 50vw`.
- Dashboard Workspace: Full-width fluid container with `max-w-[1600px]` to maximize table real estate.

### 3.3 Responsive Breakpoint Logic
- **Mobile (< 640px)**:
  - Single column stacks.
  - Sticky bottom action bars for critical CTAs (e.g., "Apply for Tuition" on details view).
  - Collapsible off-canvas mobile drawer for Navbar and Dashboard Sidebar.
  - Data tables render in card-list mode or clean horizontal swipe containers (`overflow-x-auto`).
- **Tablet (640px – 1024px)**:
  - 2-column asymmetric arrangements.
  - Dashboard sidebar collapses into a compact icon rail (64px width) or toggle overlay.
- **Desktop (1024px+)**:
  - Full multi-column asymmetrical editorial grids.
  - Fixed 260px dashboard sidebar with persistent scroll-state.

---

## 4. Design of Core UI Components

### 4.1 Buttons
Buttons must look intentional and tactile, avoiding flat pastel pills.

```text
[Primary Action Button]
  - Background: #668B78 (Sage Green)
  - Text: #FFFFFF (White) or #EFE7DC (Cream)
  - Border: 1px solid rgba(52, 76, 67, 0.2)
  - Radius: rounded-xl (12px) - not full rounded pills
  - Hover: bg-[#537363], slight lift: -translate-y-0.5, shadow-sm
  - Active: translate-y-0

[Dark Brand Button]
  - Background: #344C43 (Forest Pine)
  - Text: #D9CBB5 (Warm Oatmeal)
  - Radius: rounded-xl
  - Hover: bg-[#263831]

[Accent / Pro Upgrade Button]
  - Background: #B87959 (Terracotta)
  - Text: #FFFFFF
  - Hover: bg-[#9F6446]

[Ghost / Outline Button]
  - Background: transparent
  - Text: #344C43
  - Border: 1px solid rgba(52, 76, 67, 0.25)
  - Hover: bg-[#EFE7DC]
```

### 4.2 Form Inputs & Controls
- **Input Background**: `#EFE7DC` (Soft Sand Cream) to contrast subtly against the `#D9CBB5` page canvas.
- **Input Borders**: `1px solid rgba(52, 76, 67, 0.20)`.
- **Focus Ring**: `ring-2 ring-[#668B78] ring-offset-1 ring-offset-[#D9CBB5] border-[#668B78]`.
- **Labeling**: Top-aligned, uppercase tracking (`text-xs font-semibold tracking-wider text-[#344C43]`).
- **Validation Errors**: Clear inline text (`text-xs text-red-700 mt-1`) with input border turning `border-red-600`.

### 4.3 Cards: The "Academic Dossier" Pattern
Avoid generic floating white boxes with big blurry drop shadows.
- **Background**: `#EFE7DC` (Soft Sand Cream).
- **Border**: `1px solid rgba(52, 76, 67, 0.15)`.
- **Top Accent Line**: Optional 2px top border in `#668B78` or `#B87959` indicating status or subject group.
- **Card Header**: Subject tag in monospace font (`text-xs font-mono uppercase tracking-widest text-[#B87959]`).
- **Price Tag**: Distinct numeric lockup (`font-mono font-bold text-lg text-[#344C43]`).

### 4.4 Data Tables (Dashboard & Admin)
- **Container**: `bg-[#EFE7DC] border border-[#344C43]/15 rounded-2xl overflow-hidden`.
- **Table Head**: `bg-[#E4D5BE]/60 text-[#344C43] font-mono text-xs uppercase tracking-wider py-3.5 px-4`.
- **Row Styling**: Alternating subtle hover state (`hover:bg-[#E4D5BE]/30 transition-colors`).
- **Dividers**: `border-b border-[#344C43]/10`.

---

## 5. Unique Navbar & Footer Architecture

### 5.1 The Archival Header (Navbar)
Instead of a floating detached pill or generic white bar, MentorLagbe uses a **grounded architectural ribbon**:
- **Background**: Glass-milled `#D9CBB5`/90 backdrop blur (`backdrop-blur-md border-b border-[#344C43]/15`).
- **Left**:
  - Distinct typographic logo: **MentorLagbe** in bold serif text, paired with a miniature architectural compass/quill emblem in `#344C43`.
- **Center**:
  - Horizontal editorial link strip: `Home`, `Browse Tuitions`, `Pricing & Plans`, `How It Works`.
  - Inactive link: `text-[#344C43]/80 hover:text-[#344C43]`.
  - Active indicator: A discreet 2px underline in `#668B78` rather than bulky pill backgrounds.
- **Right (Dynamic State)**:
  - *Unauthenticated*: Subtle text button "Sign In" + tactile Sage button "Join as Tutor / Student".
  - *Authenticated*:
    - Role Badge chip (e.g., `[TUTOR • PRO]` in `#B87959` or `[STUDENT]` in `#668B78`).
    - User avatar with hairline `#344C43` ring.
    - Dropdown menu framed in `#EFE7DC` with direct links to `/dashboard/[role]`, `/dashboard/profile`, and a styled Sign Out action.

### 5.2 The Monolithic Footer
The footer acts as an anchor of institutional solidity:
- **Background**: Deep Forest Pine (`#344C43`), creating an intentional visual terminus at the page bottom.
- **Text & Links**: `#D9CBB5` for body links; `#EFE7DC` for section titles.
- **Brand Column**: Logo in `#EFE7DC`, mission tagline, and direct contact desk (Email, Phone, Dhaka Office).
- **Social Media Icons**: Rendered cleanly in `#D9CBB5` hover transitions. **Mandatory: Use the official modern X icon** (`<svg>` / Lucide `Twitter` updated to modern X silhouette). Never render the old bird icon.
- **Bottom Bar**: Copyright line, Terms of Service, and a subtle "Secured by Stripe & BetterAuth" seal.

---

## 6. Landing Page Visual Direction (`/`)

### 6.1 Section 1: The Asymmetric Hero Atelier
- **Left Column (60% Desktop)**:
  - Small eyebrow tag: `[ EDTECH & MENTORSHIP PLATFORM ]` in mono font with `#B87959` bullet.
  - Dominant Headline: *"Personalized Academic Mentorship, Structured for High Achievement."*
  - Supporting narrative: 2 balanced paragraphs in Deep Pine text explaining subject-wise batch matching in Bangladesh and beyond.
  - Action Block: Dual CTAs ("Explore Approved Tuitions" in `#668B78` + "Apply as an Instructor" in `#344C43` outline) + quick live counter (*"500+ Verified Sessions Available"*).
- **Right Column (40% Desktop)**:
  - **"Live Mentorship Index Card"**: An elevated layered dossier preview displaying an active Physics / IELTS mentorship batch card with verified tutor tag, subject badge, weekly schedule, and instant apply trigger.

### 6.2 Section 2: Dynamic Featured Tuitions
- **Headline**: "Featured Tuition Batches" with a filter teaser.
- **Layout**: Exactly 6 dynamic cards fetched from MongoDB (`approvalStatus === 'approved'` & `isActive === true`).
- **Visual Uniformity**: Strict identical height and width (`h-[380px]` card architecture).
- **Card Structure**:
  1. Top banner photo (ImgBB uploaded or curated placeholder) with aspect ratio `16:9`.
  2. Subject pill (`#B87959`/15) + Mode tag (`Online` / `Offline` in `#668B78`/15).
  3. Class Level & Title (`h3 font-semibold line-clamp-1 text-[#344C43]`).
  4. Tutor info row (Avatar, Name, Location).
  5. Bottom Ledger: Monthly Fee in bold mono font + "View Details" arrow button.

### 6.3 Section 3: "How MentorLagbe Works" (The 4-Stage Ledger)
Instead of 3 cartoon icons in floating circles, display an **interconnected architectural pipeline**:
1. *Step 01: Discover & Filter* (Filter by subject, level, and location).
2. *Step 02: Review Credentials* (Inspect tutor syllabus, class days, and batch capacity).
3. *Step 03: Direct Application* (Submit student note and preferred schedule).
4. *Step 04: Confirmed Mentorship* (Tutor acceptance and batch onboarding).

### 6.4 Section 4: Academic Disciplines & Verified Proof
- Curated subject chips (Mathematics, Physics, Chemistry, Programming & CS, English & IELTS, Commerce).
- Counter stats board styled as an archival scoreboard: Total Active Batches, Verified Tutors, Student Success Rate.
- Authentic student and parent testimonial snippets styled as physical review notes on `#EFE7DC` index cards.

### 6.5 Section 5: Transparent Subscription Tiers
- Side-by-side presentation of **Free** vs. **Pro** plans for both Tutors ($15) and Students ($10).
- Highlight Pro benefits with `#B87959` checkmarks and direct "Subscribe via Stripe" triggers.

---

## 7. Browse Tuitions & Tuition Details Page Designs

### 7.1 Browse Tuitions (`/tuitions`)
- **Top Control Bar**:
  - Broad search bar with embedded magnifying icon searching by Title or Subject.
  - Multi-select dropdown strip: **Subject** (All, Math, Physics, etc.), **Class Level** (Class 9, HSC, Undergrad, etc.), **Mode** (`All`, `Online`, `Offline`).
- **Layout**:
  - Filter summary bar showing active count ("Showing 12 approved tuitions").
  - Responsive 3-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - Empty State: Handled with a warm illustration and "Reset Filters" action.
- **Server-Side Pagination**:
  - Clean numbered ledger pagination bar at the bottom (`[Previous] [ 1 ] [ 2 ] [ 3 ] [Next]`).

### 7.2 Tuition Details (`/tuitions/[id]`)
- **Header Banner**: Full-width high-resolution banner image uploaded by the tutor, framed with subtle rounded corners and `1px` border.
- **Two-Column Split (70% Content / 30% Sticky Booking Docket)**:
  - **Left (Syllabus & Details)**:
    - Detailed Title, Subject, Class Level, Days per week, and Location/Mode.
    - Long-form markdown formatted tuition description and curriculum scope.
    - Verified Tutor Profile Card: Tutor name, bio, verified status badge, and contact email.
  - **Right (Sticky Action Docket)**:
    - Fixed card in `#EFE7DC` summarizing Monthly Fee in prominent mono font.
    - Class mode indicator (Live Online / In-person Offline).
    - **Student Apply Form / Modal Trigger**:
      - If user is a **Student**: Prominent "Apply for This Tuition" button opening the application modal (collecting Phone, Schedule, Note).
      - If user is a **Tutor** or **Admin**: Button is cleanly disabled with a polite message: *"Only registered students can apply for tuition sessions."*
      - If user is **Unauthenticated**: Button prompts login with return URL redirection.

---

## 8. Authentication Flows: Sign In & Sign Up

### 8.1 Visual Atmosphere
Auth pages feature an **Editorial Split View** on desktop:
- **Left Column (45%)**: Deep Forest Pine (`#344C43`) canvas with a stylized inspirational quote about mentorship, geometric line-art diagram of the student-mentor loop, and security assurance badges.
- **Right Column (55%)**: Warm Sand canvas (`#D9CBB5`) containing the clean, centered auth card in `#EFE7DC`.

### 8.2 Sign Up (`/sign-up`)
- **Role Selector Tabs**:
  - Toggle switch between `I am a Student` and `I am a Tutor`.
  - Selected tab highlighted with `#668B78` and clear role description.
- **Input Fields**: Full Name, Email Address, Password (with strength indicator), Role confirmation.
- **Submission**: Tactile primary button "Create Free Account" + subtle Google Social Sign-In option.

### 8.3 Sign In (`/sign-in`)
- Email & Password fields with "Forgot password?" link.
- Smooth error toast alerts powered by Sonner for invalid credentials.
- Automatic role-based redirection to respective dashboards upon success.

---

## 9. Dashboard Design System (Student, Tutor, Admin)

### 9.1 Unified Dashboard Shell
- **Full-Width Canvas**: Eliminates narrow boxed frames, extending gracefully across wide monitors.
- **Sidebar Navigation**:
  - Surface: `#344C43` (Deep Forest Pine).
  - Active Item: `#668B78` surface with `#EFE7DC` text.
  - Inactive Item: `#D9CBB5`/70 text with hover lift.
  - Bottom Widget: User profile pill with subscription tag (`FREE` or `PRO`) and instant Logout.
- **Top Utility Bar**:
  - Mobile hamburger toggle button.
  - Current page title & breadcrumbs in `#344C43`.
  - Direct "Upgrade to Pro" shortcut button if user is on Free plan.

### 9.2 Student Dashboard (`/dashboard/student`)
- **Overview**: 4 compact KPI stat widgets:
  1. *Total Applied Tuitions* (Count)
  2. *Accepted Enrollments* (Count in `#668B78` green)
  3. *Pending Applications* (Count in `#B87959` terracotta)
  4. *Active Membership Tier* (`Free Plan` / `Pro Plan`)
- **My Applications (`/my-applications`)**:
  - Comprehensive data table detailing: Tuition Title, Tutor Name & Email, Fee, Applied Date, Status Badge.
  - Interactive Action: A prominent **"Cancel Application"** button active *strictly while status is `pending`*.

### 9.3 Tutor Dashboard (`/dashboard/tutor`)
- **Overview**: 4 KPI stat widgets:
  1. *Total Tuitions Posted*
  2. *Active & Approved Batches*
  3. *Total Applicants Received*
  4. *Plan Status* (with post quota tracker: *"1 of 2 Free posts used"* or *"Pro Unlimited"*).
- **Post a Tuition (`/post-tuition`)**:
  - ImgBB Direct Image File Upload dropzone with instant preview thumbnail.
  - Structured fields: Subject, Class Level, Mode, Days/Week, Monthly Fee, Location, Description.
  - Automatic quota check warning if Free user attempts to submit a 3rd listing.
- **My Tuitions (`/my-tuitions`)**:
  - Full CRUD control table: Title, Subject, Fee, Admin Approval Status (`pending`, `approved`, `rejected`), Active Toggle (`Active` vs. `Closed`), Edit Modal, Delete Modal.
- **Manage Applicants (`/applicants`)**:
  - Student candidate roster displaying: Student Name, Email, Phone, Preferred Schedule, Note, Tuition Batch.
  - Direct Action Buttons: "Accept" (turns green) and "Reject" (turns red).

### 9.4 Admin Dashboard (`/dashboard/admin`)
- **Overview**: High-level platform health indicators:
  1. *Total Registered Users*
  2. *Total Tutors vs Students*
  3. *Pending Tuition Approvals* (Actionable alert count)
  4. *Stripe Gross Revenue* (Formatted in USD/BDT)
- **User Management (`/users`)**:
  - Searchable user table with instant role switching dropdown (`student`, `tutor`, `admin`).
- **Tuition Approval Queue (`/tuitions`)**:
  - Moderation queue listing pending posts with full preview.
  - One-click "Approve" (publishes to `/tuitions`) and "Reject" triggers.
- **Transactions (`/transactions`)**:
  - Financial ledger recording User Name, Email, Role, Plan, Amount, Currency, Stripe Session ID, and Payment Timestamp.

---

## 10. Pricing & Payment System (`/pricing`, `/payment/*`)

### 10.1 Plan Matrix
A unified, high-clarity comparison table:

| Dimension | Student Free | Student Pro ($10) | Tutor Free | Tutor Pro ($15) |
| :--- | :--- | :--- | :--- | :--- |
| **Listing / Post Quota** | N/A | N/A | Max 2 Tuitions | **Unlimited Tuitions** |
| **Tuition Applications** | Standard | **Priority Placement** | Standard | Standard |
| **Platform Badge** | Standard | **Verified Student** | Standard | **Gold Pro Tutor Badge** |
| **Support SLA** | Community | Priority Email | Community | Dedicated Hotline |

### 10.2 Stripe Integration Flow
- Clicking "Upgrade with Stripe" opens a secure Stripe Checkout session.
- Payment Status Pages:
  - `/payment/success`: Confetti / victory seal animation, receipt reference, and automatic redirect to user's updated dashboard.
  - `/payment/cancel`: Thoughtful cancellation notification with a "Try Again" trigger.

---

## 11. Light & Dark Themes

### 11.1 The Light Theme (Primary Atelier Canvas)
- Base Canvas: `#D9CBB5` (Warm Sand)
- Surfaces: `#EFE7DC` (Soft Cream)
- Text & Headings: `#344C43` (Forest Pine)
- Action: `#668B78` (Sage Green)
- Accents: `#B87959` (Terracotta)

### 11.2 The Nocturne / Dark Theme (Scholar's Study at Midnight)
In dark mode, MentorLagbe avoids harsh pitch-black (`#000000`). Instead, it transitions into a rich, deep botanical library tone:
- Base Canvas: `#1A2823` (Midnight Pine)
- Elevated Surfaces: `#243630` (Deep Forest Slate)
- Surface Borders: `rgba(217, 203, 181, 0.15)`
- Primary Text & Headings: `#EFE7DC` (Warm Parchment)
- Secondary Text: `#D9CBB5`/75 (Muted Sand)
- Brand Action: `#7AA890` (Brightened Sage Green for dark-ground contrast)
- Accent: `#C98B6D` (Brightened Terracotta)

---

## 12. Micro-Interactions, Transitions & State Handlers

### 12.1 Motion & Hover Guidelines
- Transitions must feel swift and organic: `transition-all duration-200 ease-out`.
- Card Hover: Gentle vertical lift (`-translate-y-1`) accompanied by border tone shift (`border-[#668B78]/40`).
- Button Click: Micro-scale compression (`active:scale-[0.98]`).

### 12.2 Skeleton & Loading States (`loading.tsx`)
- Skeletons use a soft pulse effect matching the warm palette:
  - `bg-[#E4D5BE]/60 animate-pulse rounded-xl`.
  - Custom branded spinner utilizing the rotating geometric atelier compass.

### 12.3 Error Boundaries & Not-Found (`error.tsx`, `not-found.tsx`)
- **404 Not Found**: Styled as an "Archival Index Not Found" sheet with a clear message and a bold `#668B78` button: *"Return to Academic Catalog"*.
- **500 Error Boundary**: Friendly message with an instant "Try Reloading" button and diagnostics ID.

---

## 13. Accessibility (a11y) & Usability Standards

1. **Color Contrast Ratios**:
   - Deep Forest Pine (`#344C43`) on Warm Sand (`#D9CBB5`) achieves a contrast ratio of **6.2:1** (exceeds WCAG AAA for large text, AA for normal text).
   - Sage Green (`#668B78`) buttons with white or dark text must maintain a minimum **4.5:1** contrast ratio.
2. **Keyboard Navigation**:
   - All interactive elements must show a distinct, accessible focus ring (`focus-visible:ring-2 focus-visible:ring-[#668B78]`).
3. **Form Accessibility**:
   - All inputs possess associated `<label>` tags with matching `htmlFor` attributes.
   - Screen readers receive clear `aria-invalid` and `aria-describedby` tokens on error states.
4. **Motion Safety**:
   - Honor user OS preference for reduced motion (`@media (prefers-reduced-motion: reduce)`).

---

## 14. Consistency Guardrails & Prohibited Anti-Patterns

### ⛔ Strictly Prohibited Design Patterns:
1. **Never use `#FFFFFF` as the main landing page background.** The platform must feel grounded in `#D9CBB5`.
2. **Never use generic blue or purple SaaS gradients.** All gradients, if any, must be subtle shifts between `#D9CBB5` and `#EFE7DC`.
3. **Never use the legacy Twitter bird icon.** Always render the modern X icon.
4. **Never create mismatched card heights.** All tuition cards within a grid must have locked, equal dimensions.
5. **Never permit free tutors to post more than 2 listings.** Backend and frontend validation must be visually communicated.
6. **Never allow tutors or admins to apply for tuitions.** Application buttons must be disabled or replaced with informational copy.
7. **Never build mobile tables that clip or overflow.** Always wrap tables with `overflow-x-auto` or stack into cards.

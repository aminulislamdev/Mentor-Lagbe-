import Link from "next/link"
import {
  Compass,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Code2,
  Languages,
  TrendingUp,
  ShieldCheck,
  CalendarDays,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  Quote,
} from "lucide-react"
import { fetchFeaturedTuitions } from "@/lib/tuition-service"
import { TuitionCard } from "@/components/tuition-card"

const TOP_SUBJECTS = [
  { name: "Higher Mathematics", icon: Calculator, query: "Mathematics", count: "48 Batches" },
  { name: "Physics & Mechanics", icon: Atom, query: "Physics", count: "36 Batches" },
  { name: "Organic Chemistry", icon: FlaskConical, query: "Chemistry", count: "29 Batches" },
  { name: "Biology & Genetics", icon: Dna, query: "Biology", count: "22 Batches" },
  { name: "Programming & Web", icon: Code2, query: "Programming", count: "19 Batches" },
  { name: "IELTS & English Lab", icon: Languages, query: "IELTS", count: "31 Batches" },
  { name: "Commerce & Finance", icon: TrendingUp, query: "Commerce", count: "16 Batches" },
]

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Discover & Filter",
    desc: "Search verified listings by subject, academic class level, mode (Online vs. Offline), and monthly fee budget.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Review Credentials",
    desc: "Examine the tutor's syllabus, days per week, location details, verified credentials, and real student feedback.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "Direct Application",
    desc: "Submit your preferred weekly schedule and learning goals directly to the tutor with zero middleman confusion.",
    icon: CalendarDays,
  },
  {
    step: "04",
    title: "Confirmed Mentorship",
    desc: "Receive real-time tutor approval, get batch orientation instructions, and commence your structured learning sessions.",
    icon: Award,
  },
]

const TESTIMONIALS = [
  {
    name: "Shadman Sakib",
    role: "HSC 2025 Candidate • Notre Dame College",
    subject: "Higher Mathematics",
    quote:
      "Tanvir Sir's calculus batch completely transformed my confidence. The weekly problem-solving sheets and derivations made board questions feel second nature.",
    rating: 5,
  },
  {
    name: "Ayesha Noor",
    role: "University Graduate • IBA, DU",
    subject: "IELTS Band 8.0 Mentorship",
    quote:
      "The 1-on-1 speaking evaluation and writing lab feedback gave me the exact corrections I needed. My score jumped from 6.5 to an 8.0 overall in just 6 weeks.",
    rating: 5,
  },
  {
    name: "Engr. Mahmudul Hasan",
    role: "Parent • Dhanmondi, Dhaka",
    subject: "Class 10 Physics",
    quote:
      "As a parent, finding a trustworthy physics mentor nearby was frustrating until MentorLagbe. We reviewed the tutor's profile, applied in minutes, and started sessions that week.",
    rating: 5,
  },
]

export default async function Home() {
  const featuredTuitions = await fetchFeaturedTuitions()

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─────────────────────────────────────────────────────────────
          1. ASYMMETRIC HERO ATELIER (Section 1)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-border/80">
        {/* Subtle architectural background grid accents */}
        <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:linear-gradient(to_right,rgba(52,76,67,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,76,67,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left 7 Columns: Editorial Headline & Narrative */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/80 text-foreground text-xs font-mono tracking-wider uppercase shadow-2xs backdrop-blur-sm">
                <span className="size-2 rounded-full bg-[#B87959] animate-pulse" />
                <span>Smart Tuition & Academic Mentorship</span>
              </div>

              {/* Dominant Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
                Personalized Academic Mentorship,{" "}
                <span className="text-primary italic font-serif">
                  Structured
                </span>{" "}
                for High Achievement.
              </h1>

              {/* Supporting Editorial Paragraphs */}
              <div className="space-y-3 max-w-2xl text-base sm:text-lg text-foreground/80 leading-relaxed font-sans">
                <p>
                  Connecting qualified tutors who offer subject-wise batches or 1-on-1 guidance with students looking for dedicated academic excellence in Bangladesh and beyond.
                </p>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Search verified mentors filtered strictly by subject, class level, mode (Online vs. Offline), and monthly fee budget. No hidden fees or cumbersome agencies.
                </p>
              </div>

              {/* Action Buttons & Fast Link */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/tuitions"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-[#537363] text-white font-semibold text-base shadow-sm transition-all duration-200 active:scale-98 group cursor-pointer"
                >
                  <span>Explore Approved Tuitions</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/sign-up?role=tutor"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card hover:bg-card/90 text-foreground border border-border hover:border-primary/50 font-semibold text-base shadow-2xs transition-all duration-200"
                >
                  <GraduationCap className="size-4 text-primary" />
                  <span>Join as an Instructor</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-border/80 flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  <span>500+ Verified Batches</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#B87959]" />
                  <span>Admin-Moderated Tutors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  <span>4.9 / 5.0 Average Rating</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: The Live Mentorship Index Dossier Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5 transition-all">
                {/* Header Tag */}
                <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-primary" />
                    <span className="font-mono text-xs uppercase tracking-widest font-semibold text-foreground">
                      Featured Batch Dossier
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-[#B87959]/15 text-[#B87959] dark:text-[#C98B6D] font-semibold border border-[#B87959]/30">
                    Enrolling Now
                  </span>
                </div>

                {/* Hero Card Visual Preview */}
                <div className="relative rounded-2xl overflow-hidden h-48 mb-4 bg-muted border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
                    alt="Higher Mathematics Batch"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-[#344C43]/90 backdrop-blur-md border border-white/20">
                      Higher Mathematics
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#668B78]/90 backdrop-blur-md border border-white/20">
                      Offline Batch
                    </span>
                  </div>
                </div>

                {/* Batch Specifications */}
                <div className="space-y-3">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    HSC Higher Mathematics & Differential Calculus Batch
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-sans">
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-background/60 border border-border/60">
                      <GraduationCap className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">HSC (Class 11-12)</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-background/60 border border-border/60">
                      <CalendarDays className="size-3.5 text-primary shrink-0" />
                      <span>3 Days / Week</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-background/60 border border-border/60">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">Dhanmondi, Dhaka</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-background/60 border border-border/60">
                      <Clock className="size-3.5 text-primary shrink-0" />
                      <span>Sat, Mon, Wed 4 PM</span>
                    </div>
                  </div>

                  {/* Tutor strip */}
                  <div className="pt-2 flex items-center justify-between border-t border-border/70 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/20 text-primary font-mono font-bold flex items-center justify-center border border-primary/30">
                        T
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Tanvir Ahmed, M.Sc</p>
                        <p className="text-[11px] text-muted-foreground font-mono">BUET Mathematics</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">Fee</span>
                      <span className="font-mono text-base font-bold text-foreground">৳ 4,500</span>
                    </div>
                  </div>

                  {/* CTA link */}
                  <Link
                    href="/tuitions/tui-001"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>View Batch & Apply</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CURATED ACADEMIC DISCIPLINES (Top Subjects Strip)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-12 border-b border-border/80 bg-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#B87959] font-semibold">
                Academic Disciplines
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-1">
                Explore Batches by Subject
              </h2>
            </div>
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              <span>View full directory</span>
              <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {TOP_SUBJECTS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.query}
                  href={`/tuitions?subject=${item.query}`}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border hover:border-primary/60 hover:bg-card/90 shadow-2xs transition-all duration-200 text-center"
                >
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {item.count}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. DYNAMIC FEATURED TUITIONS (Section 2 - 6 Latest Listings)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                <Sparkles className="size-3.5" />
                <span>Verified Admissions</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Featured Tuition Batches
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Browse our latest approved academic batches with qualified mentors across Dhaka, Chittagong, and online.
              </p>
            </div>

            <Link
              href="/tuitions"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/50 text-xs font-semibold text-foreground transition-colors self-start sm:self-auto shadow-2xs"
            >
              <span>Explore All Approved Tuitions</span>
              <ArrowRight className="size-3.5 text-primary" />
            </Link>
          </div>

          {/* 6 Equal-Dimension Dynamic Cards Grid */}
          {featuredTuitions.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <h3 className="font-heading text-lg font-bold text-foreground">
                No approved batches are listed yet
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                New tuitions appear here as soon as an admin approves them.
              </p>
              <Link
                href="/sign-up?role=tutor"
                className="mt-5 inline-flex px-5 py-2.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Post the first batch
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTuitions.map((tuition) => (
                <TuitionCard key={tuition._id} tuition={tuition} />
              ))}
            </div>
          )}

          {/* Bottom Banner Strip */}
          <div className="mt-12 p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">
                Are you looking for a specific class level or neighborhood?
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use our server-side search to filter by HSC, SSC, O/A Levels, and Online/Offline mode.
              </p>
            </div>
            <Link
              href="/tuitions"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              Search All Tuitions
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HOW IT WORKS: 4-STAGE ARCHITECTURAL PIPELINE (Section 3)
      ────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-border/80 bg-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B87959] font-semibold">
              The MentorLagbe Architecture
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              How MentorLagbe Works
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A transparent, structured workflow connecting parents and students with vetted educators in four clear steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {WORKFLOW_STEPS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col p-6 rounded-2xl bg-card border border-border shadow-2xs hover:border-primary/50 transition-colors"
                >
                  {/* Step Monospace Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-3xl font-extrabold text-[#344C43]/20 dark:text-[#EFE7DC]/20">
                      {item.step}
                    </span>
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. PLATFORM STATISTICS: ARCHIVAL SCOREBOARD (Section 4)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#344C43] text-[#EFE7DC] p-8 sm:p-12 shadow-xl relative overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              <div className="text-center pt-4 lg:pt-0">
                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#EFE7DC] block">
                  1,250+
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D9CBB5]/70 mt-2 block">
                  Enrolled Students
                </span>
              </div>

              <div className="text-center pt-4 lg:pt-0 lg:pl-8">
                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#668B78] block">
                  320+
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D9CBB5]/70 mt-2 block">
                  Verified Mentors
                </span>
              </div>

              <div className="text-center pt-4 lg:pt-0 lg:pl-8">
                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#B87959] block">
                  99.2%
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D9CBB5]/70 mt-2 block">
                  Session Satisfaction
                </span>
              </div>

              <div className="text-center pt-4 lg:pt-0 lg:pl-8">
                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#EFE7DC] block">
                  ৳ 0
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D9CBB5]/70 mt-2 block">
                  Application Surcharges
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. VERIFIED TESTIMONIALS (Section 4 continued)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-b border-border/80 bg-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
              Verified Experiences
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              What Students & Parents Say
            </h2>
            <p className="text-sm text-muted-foreground">
              Real feedback from students and parents enrolled in our approved tuition batches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col p-6 rounded-2xl bg-card border border-border shadow-2xs relative"
              >
                <Quote className="size-8 text-primary/20 mb-3" />

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {t.role}
                    </p>
                  </div>

                  <span className="font-mono text-[11px] font-semibold text-[#B87959] px-2 py-0.5 rounded-md bg-[#B87959]/10 border border-[#B87959]/20">
                    {t.subject}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PRICING & PRO UPGRADES (Section 5)
      ────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B87959] font-semibold">
              Stripe Subscription System
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Transparent Membership Tiers
            </h2>
            <p className="text-sm text-muted-foreground">
              Get started for free or upgrade with Stripe to unlock unlimited listings, verified badges, and priority booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student Free */}
            <div className="flex flex-col p-6 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Student
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mt-1">
                Standard Free
              </h3>
              <div className="my-4">
                <span className="font-mono text-3xl font-extrabold text-foreground">$0</span>
                <span className="text-xs text-muted-foreground"> / lifetime</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Full search and application capabilities for individual students.
              </p>
              <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Browse all approved tuitions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Apply for unlimited batches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Real-time status tracking</span>
                </li>
              </ul>
              <Link
                href="/sign-up?role=student"
                className="mt-auto w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-card text-center text-xs font-semibold text-foreground transition-colors"
              >
                Join as Student
              </Link>
            </div>

            {/* Student Pro ($10) */}
            <div className="flex flex-col p-6 rounded-2xl bg-card border-2 border-primary shadow-md relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-primary text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                Priority
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                Student Pro
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mt-1">
                Fast-Track Scholar
              </h3>
              <div className="my-4">
                <span className="font-mono text-3xl font-extrabold text-foreground">$10</span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Priority placement in tutor candidate queues and verified student seal.
              </p>
              <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Top-of-queue application priority</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Verified Student Pro profile badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Early batch booking notices</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="mt-auto w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-[#537363] text-white text-center text-xs font-semibold shadow-xs transition-colors"
              >
                Subscribe via Stripe ($10)
              </Link>
            </div>

            {/* Tutor Free */}
            <div className="flex flex-col p-6 rounded-2xl bg-card border border-border shadow-2xs">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Tutor
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mt-1">
                Starter Instructor
              </h3>
              <div className="my-4">
                <span className="font-mono text-3xl font-extrabold text-foreground">$0</span>
                <span className="text-xs text-muted-foreground"> / lifetime</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Perfect for tutors testing the platform with up to two listings.
              </p>
              <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Post up to 2 tuition listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Applicant management dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Direct ImgBB banner upload</span>
                </li>
              </ul>
              <Link
                href="/sign-up?role=tutor"
                className="mt-auto w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-card text-center text-xs font-semibold text-foreground transition-colors"
              >
                Join as Tutor
              </Link>
            </div>

            {/* Tutor Pro ($15) */}
            <div className="flex flex-col p-6 rounded-2xl bg-card border-2 border-[#B87959] shadow-md relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#B87959] text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                Unlimited
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#B87959] font-semibold">
                Tutor Pro
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mt-1">
                Master Instructor
              </h3>
              <div className="my-4">
                <span className="font-mono text-3xl font-extrabold text-foreground">$15</span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Unlimited tuition posts, Gold verified badge, and maximum student reach.
              </p>
              <ul className="space-y-2.5 text-xs text-foreground/80 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#B87959]" />
                  <span><strong>Unlimited</strong> tuition batches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#B87959]" />
                  <span>Gold Pro Tutor badge & trust seal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#B87959]" />
                  <span>Featured listing placement priority</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="mt-auto w-full py-2.5 px-4 rounded-xl bg-[#B87959] hover:bg-[#9F6446] text-white text-center text-xs font-semibold shadow-xs transition-colors"
              >
                Subscribe via Stripe ($15)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. CALL TO ACTION TERMINUS
      ────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-background/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
            Join The Academic Atelier
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight max-w-2xl mx-auto">
            Ready to find your ideal tutor or launch your tuition batch?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Get started in under 2 minutes. Whether you are aiming for board exams or mentoring the next generation, MentorLagbe is built for you.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tuitions"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-[#537363] text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Browse Approved Tuitions
            </Link>
            <Link
              href="/sign-up?role=tutor"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground text-sm font-semibold transition-colors"
            >
              Post a Tuition as Tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

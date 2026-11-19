"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  Compass,
  MapPin,
  CalendarDays,
  Clock,
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Code2,
  Languages,
  TrendingUp,
  Stethoscope,
  CheckCircle2,
} from "lucide-react"

interface TuitionDossier {
  id: string
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  location: string
  monthlyFee: number
  daysPerWeek: number
  scheduleTime: string
  seatsRemaining: number
  bannerImage: string
  description: string
  tutorName: string
  tutorTitle: string
  tutorInitials: string
  rating: number
  reviewCount: number
  syllabusTags: string[]
}

const ALL_TUITIONS: TuitionDossier[] = [
  {
    id: "tui-001",
    title: "HSC Higher Mathematics & Differential Calculus Batch",
    subject: "Mathematics",
    classLevel: "HSC (Class 11-12)",
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 4500,
    daysPerWeek: 3,
    scheduleTime: "Sat, Mon, Wed 4:00 PM",
    seatsRemaining: 3,
    bannerImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    description:
      "Comprehensive weekly batch focused on differential calculus, vectors, and coordinate geometry with board exam problem solving and weekly assessments.",
    tutorName: "Tanvir Ahmed, M.Sc",
    tutorTitle: "BUET Mathematics • 7 yrs teaching",
    tutorInitials: "TA",
    rating: 4.9,
    reviewCount: 38,
    syllabusTags: ["Calculus", "Vectors", "Board Test Papers", "Formula Bank"],
  },
  {
    id: "tui-002",
    title: "Quantum Physics, Optics & Derivations Masterclass",
    subject: "Physics",
    classLevel: "Class 10 / SSC",
    mode: "Online",
    location: "Google Meet & Miro Whiteboard",
    monthlyFee: 3800,
    daysPerWeek: 2,
    scheduleTime: "Fri, Sat 7:00 PM",
    seatsRemaining: 5,
    bannerImage:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",
    description:
      "Interactive digital physics lab with weekly simulation experiments, mathematical derivations, and past 10 years question bank breakdowns.",
    tutorName: "Dr. Samia Rahman",
    tutorTitle: "DU Physics • Ph.D Researcher",
    tutorInitials: "SR",
    rating: 4.95,
    reviewCount: 52,
    syllabusTags: ["Optics", "Thermodynamics", "Derivations", "Virtual Labs"],
  },
  {
    id: "tui-003",
    title: "Full-Stack Web Engineering & Modern Next.js Mentorship",
    subject: "Programming",
    classLevel: "Undergraduate / Career",
    mode: "Online",
    location: "Discord & GitHub Code Reviews",
    monthlyFee: 6000,
    daysPerWeek: 3,
    scheduleTime: "Sun, Tue, Thu 9:00 PM",
    seatsRemaining: 2,
    bannerImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description:
      "Production-grade web engineering batch covering TypeScript, Next.js App Router, Tailwind CSS, REST APIs, and portfolio capstone building.",
    tutorName: "Abrar Fahad",
    tutorTitle: "Lead Full-Stack Engineer",
    tutorInitials: "AF",
    rating: 5.0,
    reviewCount: 64,
    syllabusTags: ["TypeScript", "Next.js 15", "PostgreSQL", "PR Reviews"],
  },
  {
    id: "tui-004",
    title: "IELTS Academic Band 8.0 Comprehensive & Speaking Lab",
    subject: "IELTS",
    classLevel: "University / Higher Studies",
    mode: "Online",
    location: "Live Interactive Classroom",
    monthlyFee: 5200,
    daysPerWeek: 3,
    scheduleTime: "Mon, Wed, Fri 8:00 PM",
    seatsRemaining: 4,
    bannerImage:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    description:
      "Targeted preparation covering all 4 modules: Writing Task 1 & 2 rubrics, 1-on-1 speaking evaluations, reading skimming techniques, and listening drills.",
    tutorName: "Nafis Kamal",
    tutorTitle: "CELTA Certified • Band 8.5 Scorer",
    tutorInitials: "NK",
    rating: 4.88,
    reviewCount: 45,
    syllabusTags: ["Writing Rubrics", "Speaking Mock", "Lexical Resource", "Listening Drills"],
  },
  {
    id: "tui-005",
    title: "Organic Chemistry Mechanisms & Biochemical Pathways",
    subject: "Chemistry",
    classLevel: "HSC (Class 11-12)",
    mode: "Offline",
    location: "Uttara Sector 7, Dhaka",
    monthlyFee: 4200,
    daysPerWeek: 3,
    scheduleTime: "Sun, Tue, Thu 5:00 PM",
    seatsRemaining: 6,
    bannerImage:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    description:
      "Simplifying reaction mechanisms, IUPAC nomenclature, and stoichiometry equations with structured problem sets and handwritten formula sheets.",
    tutorName: "Maliha Hossain, B.Sc",
    tutorTitle: "DU Applied Chemistry",
    tutorInitials: "MH",
    rating: 4.92,
    reviewCount: 29,
    syllabusTags: ["Reaction Mechanisms", "Stereochemistry", "IUPAC", "Formulas"],
  },
  {
    id: "tui-006",
    title: "Molecular Biology, Human Physiology & Genetics Mastery",
    subject: "Biology",
    classLevel: "Class 9-10 (SSC)",
    mode: "Online",
    location: "Live Interactive Whiteboard",
    monthlyFee: 3500,
    daysPerWeek: 2,
    scheduleTime: "Tue, Thu 6:30 PM",
    seatsRemaining: 8,
    bannerImage:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
    description:
      "Visual diagram-oriented learning covering cellular respiration, human circulatory systems, genetics problem solving, and diagram drawing techniques.",
    tutorName: "Dr. Rubel Karim",
    tutorTitle: "DMC MBBS • Biology Mentor",
    tutorInitials: "RK",
    rating: 4.85,
    reviewCount: 31,
    syllabusTags: ["Human Physiology", "Genetics", "Diagram Labs", "Board Mocks"],
  },
  {
    id: "tui-007",
    title: "Microeconomics, Macro Policy & Financial Accounting",
    subject: "Commerce",
    classLevel: "HSC & O/A Levels",
    mode: "Offline",
    location: "Banani Road 11, Dhaka",
    monthlyFee: 4000,
    daysPerWeek: 3,
    scheduleTime: "Sat, Mon, Wed 6:00 PM",
    seatsRemaining: 5,
    bannerImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    description:
      "Balancing financial ledgers, journal entries, macro trade policies, and elasticity calculations with real-world case studies and past paper mocks.",
    tutorName: "Zaid Chowdhury",
    tutorTitle: "ACCA Affiliated • IBA Finance",
    tutorInitials: "ZC",
    rating: 4.9,
    reviewCount: 24,
    syllabusTags: ["Balance Sheets", "Cost Accounting", "Macro Policies", "Case Studies"],
  },
  {
    id: "tui-008",
    title: "Medical Admission Chemistry & Biology Rapid Prep Batch",
    subject: "Medical Prep",
    classLevel: "Admission Candidates",
    mode: "Offline",
    location: "Farmgate, Dhaka",
    monthlyFee: 5500,
    daysPerWeek: 4,
    scheduleTime: "Sat, Sun, Tue, Thu 3:00 PM",
    seatsRemaining: 2,
    bannerImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    description:
      "Intensive 10,000 MCQ bank drilling, negative marking strategy mastery, rapid-fire daily recall quizzes, and full-length OMR sheet mock simulations.",
    tutorName: "Dr. Farhana Yasmin",
    tutorTitle: "SSMC MBBS • Medical Mentor",
    tutorInitials: "FY",
    rating: 4.97,
    reviewCount: 78,
    syllabusTags: ["10K MCQ Bank", "Negative Marking", "OMR Mocks", "Rapid Recall"],
  },
]

const CATEGORIES = [
  { name: "All Subjects", icon: BookOpen },
  { name: "Mathematics", icon: Calculator },
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
  { name: "Programming", icon: Code2 },
  { name: "IELTS", icon: Languages },
  { name: "Commerce", icon: TrendingUp },
  { name: "Medical Prep", icon: Stethoscope },
]

export default function BrowseTuitionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All Subjects")
  const [selectedMode, setSelectedMode] = React.useState<"all" | "Online" | "Offline">("all")
  const [selectedLevel, setSelectedLevel] = React.useState("all")
  const [selectedBudget, setSelectedBudget] = React.useState("all")
  const [currentPage, setCurrentPage] = React.useState(1)

  // Filter realistic items
  const filteredTuitions = React.useMemo(() => {
    return ALL_TUITIONS.filter((t) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesQuery =
          t.title.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.tutorName.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
        if (!matchesQuery) return false
      }

      // Category
      if (selectedCategory !== "All Subjects" && t.subject !== selectedCategory) {
        return false
      }

      // Mode
      if (selectedMode !== "all" && t.mode !== selectedMode) {
        return false
      }

      // Class level
      if (selectedLevel !== "all") {
        if (!t.classLevel.toLowerCase().includes(selectedLevel.toLowerCase())) {
          return false
        }
      }

      // Budget
      if (selectedBudget === "under-4000" && t.monthlyFee >= 4000) return false
      if (selectedBudget === "4000-5000" && (t.monthlyFee < 4000 || t.monthlyFee > 5000)) return false
      if (selectedBudget === "above-5000" && t.monthlyFee <= 5000) return false

      return true
    })
  }, [searchQuery, selectedCategory, selectedMode, selectedLevel, selectedBudget])

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Subjects")
    setSelectedMode("all")
    setSelectedLevel("all")
    setSelectedBudget("all")
    setCurrentPage(1)
  }

  const activeFiltersCount =
    (selectedCategory !== "All Subjects" ? 1 : 0) +
    (selectedMode !== "all" ? 1 : 0) +
    (selectedLevel !== "all" ? 1 : 0) +
    (selectedBudget !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
      {/* ─────────────────────────────────────────────────────────────
          1. CREATIVE EDITORIAL PAGE HEADER
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/80 bg-card/40 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="absolute inset-0 pointer-events-none opacity-15 [background-image:linear-gradient(to_right,rgba(52,76,67,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,76,67,0.15)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-mono tracking-wider uppercase text-foreground shadow-2xs">
                <Compass className="size-3.5 text-primary" />
                <span>Academic Catalog • Volume 2026</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-[#B87959] font-bold">Approved Listings</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                The Tuition & Mentorship{" "}
                <span className="text-primary italic font-serif">Ledger</span>.
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Discover verified subject-wise batches, olympiad masterclasses, and 1-on-1 mentorship programs moderated by our academic board.
              </p>
            </div>

            {/* Quick Archival Badge */}
            <div className="flex items-center gap-3 self-start lg:self-auto p-3 rounded-2xl bg-card border border-border shadow-2xs font-mono text-xs">
              <div className="flex size-9 rounded-xl bg-primary/10 text-primary items-center justify-center font-bold">
                {filteredTuitions.length}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {filteredTuitions.length} Batches Enrolling
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Zero Application Surcharge
                </p>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. SUBJECT CATEGORIES STRIP (Tactile Tokens)
          ────────────────────────────────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t border-border/70 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.name
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.name)
                    setCurrentPage(1)
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-2xs ${
                    isSelected
                      ? "bg-primary text-white border border-primary shadow-xs"
                      : "bg-card hover:bg-card/90 text-foreground border border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className={`size-3.5 ${isSelected ? "text-white" : "text-primary"}`} />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SEARCH & MULTI-FILTER CONTROL BAR
      ────────────────────────────────────────────────────────────── */}
      <section className="sticky top-18 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md py-4 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by subject, title, tutor name, or neighborhood..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-card border border-border shadow-2xs">
                {(["all", "Online", "Offline"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setSelectedMode(mode)
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
                      selectedMode === mode
                        ? "bg-primary text-white font-semibold shadow-2xs"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {mode === "all" ? "All Modes" : mode}
                  </button>
                ))}
              </div>

              {/* Class Level Dropdown */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-2xs"
                >
                  <option value="all">All Class Levels</option>
                  <option value="Class 9-10">Class 9-10 (SSC)</option>
                  <option value="HSC">HSC (Class 11-12)</option>
                  <option value="O/A Levels">O/A Levels</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Admission">Admission Candidates</option>
                </select>
              </div>

              {/* Fee Budget Filter */}
              <div className="relative">
                <select
                  value={selectedBudget}
                  onChange={(e) => {
                    setSelectedBudget(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-2xs"
                >
                  <option value="all">Monthly Budget: All</option>
                  <option value="under-4000">Under ৳4,000</option>
                  <option value="4000-5000">৳4,000 – ৳5,000</option>
                  <option value="above-5000">Above ৳5,000</option>
                </select>
              </div>

              {/* Reset Filters CTA if any active */}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-destructive/20 text-destructive bg-destructive/10 hover:bg-destructive/15 transition-colors cursor-pointer font-medium"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. EDITORIAL TUITION DOSSIER LISTINGS
      ────────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/70 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-primary" />
            <span>
              Displaying <strong className="text-foreground">{filteredTuitions.length}</strong> verified batch dossiers
            </span>
          </div>

          <span className="hidden sm:inline-block">
            Sorted by: <strong>Academic Board Approval Date</strong>
          </span>
        </div>

        {/* Empty Search State */}
        {filteredTuitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-card border border-border my-6">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Compass className="size-8" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              No Tuition Batches Match Your Query
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">
              We couldn&apos;t find any approved batches matching the selected filters. Try broadening your criteria or reset the search.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* The Editorial Dossier Card Stack */
          <div className="space-y-5">
            {filteredTuitions.map((t) => {
              const isOnline = t.mode === "Online"
              return (
                <article
                  key={t.id}
                  className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-primary/50 transition-all duration-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Left Column: Dossier Media & Badges (4 cols) */}
                    <div className="lg:col-span-4 relative rounded-xl overflow-hidden h-48 sm:h-52 bg-muted border border-border/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.bannerImage}
                        alt={t.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#344C43]/90 text-[#EFE7DC] border border-white/20 backdrop-blur-md">
                          {t.subject}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-1 rounded-md backdrop-blur-md border ${
                            isOnline
                              ? "bg-[#668B78]/90 text-white border-white/20"
                              : "bg-[#B87959]/90 text-white border-white/20"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isOnline ? "bg-emerald-300 animate-pulse" : "bg-amber-200"
                            }`}
                          />
                          {t.mode}
                        </span>
                      </div>

                      {/* Bottom Banner Stats */}
                      <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-xs font-mono">
                        <div className="flex items-center gap-1">
                          <Sparkles className="size-3 text-amber-300 fill-amber-300" />
                          <span>{t.rating.toFixed(2)}</span>
                          <span className="text-white/70">({t.reviewCount})</span>
                        </div>

                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-black/60 border border-white/20">
                          {t.seatsRemaining} seats left
                        </span>
                      </div>
                    </div>

                    {/* Middle Column: Editorial Content & Syllabus (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        <GraduationCap className="size-3.5 text-primary" />
                        <span>{t.classLevel}</span>
                      </div>

                      <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {t.title}
                      </h2>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {t.description}
                      </p>

                      {/* Syllabus Topic Chips */}
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {t.syllabusTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background/80 border border-border text-foreground/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Tutor Credential Lockup */}
                      <div className="pt-2 flex items-center gap-2.5 text-xs">
                        <div className="size-8 rounded-full bg-primary/20 text-primary font-mono font-bold flex items-center justify-center border border-primary/30 shrink-0">
                          {t.tutorInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate flex items-center gap-1.5">
                            <span>{t.tutorName}</span>
                            <CheckCircle2 className="size-3 text-primary inline" />
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate font-mono">
                            {t.tutorTitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Ledger Fee, Schedule & Action (3 cols) */}
                    <div className="lg:col-span-3 lg:border-l lg:border-border/80 lg:pl-6 space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/70 flex flex-col justify-between h-full">
                      <div className="space-y-2 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5 text-primary shrink-0" />
                          <span>{t.daysPerWeek} Days / Week</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{t.scheduleTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{t.location}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/80">
                        <div className="flex items-baseline justify-between lg:block">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase block">
                            Monthly Tuition Fee
                          </span>
                          <span className="font-mono text-2xl font-bold text-foreground">
                            ৳ {t.monthlyFee.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              / mo
                            </span>
                          </span>
                        </div>

                        <Link
                          href={`/tuitions/${t.id}`}
                          className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                          <span>Inspect Dossier & Apply</span>
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            5. DISTINCTIVE ARCHIVAL PAGINATION RIBBON (UI Only)
        ────────────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-muted-foreground">
            Archive Page <strong className="text-foreground">0{currentPage}</strong> of <strong>03</strong> • Showing 8 of 24 listings
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border bg-card hover:bg-card/90 text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`size-9 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-white border border-primary shadow-xs"
                    : "bg-card border border-border hover:border-primary/50 text-foreground shadow-2xs"
                }`}
              >
                0{page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === 3}
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border bg-card hover:bg-card/90 text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Editorial Assistance Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B87959] font-bold">
              Need A Customized Batch?
            </span>
            <h3 className="font-heading text-xl font-bold text-foreground">
              Are you seeking 1-on-1 private mentorship for admission tests?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our registered tutors accommodate personalized schedules. Submit an inquiry through any tutor dossier or contact our academic desk.
            </p>
          </div>

          <Link
            href="/sign-up?role=student"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Create Student Account
          </Link>
        </div>
      </main>
    </div>
  )
}

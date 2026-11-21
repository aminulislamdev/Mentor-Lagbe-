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
  CheckCircle2,
  RefreshCw,
} from "lucide-react"
import { useApi, useDebouncedValue } from "@/lib/hooks/use-api"
import { initials, formatFee, weeklyPace, formatDate, toQueryString } from "@/lib/adapters"
import type { Tuition } from "@/lib/api-types"

// Subjects the seeded catalogue actually uses.
const CATEGORIES = [
  { name: "All Subjects", icon: BookOpen },
  { name: "Mathematics", icon: Calculator },
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
  { name: "English", icon: Languages },
  { name: "IELTS", icon: Languages },
  { name: "Programming", icon: Code2 },
  { name: "Accounting", icon: TrendingUp },
]

// Exact values stored in the tuitions collection (the API matches exactly).
const CLASS_LEVELS = ["HSC", "SSC", "Admission", "Undergraduate", "Class 9", "Career"]

const BUDGETS = [
  { value: "all", label: "Monthly Budget: All" },
  { value: "under-4000", label: "Under ৳4,000" },
  { value: "4000-5000", label: "৳4,000 – ৳5,000" },
  { value: "above-5000", label: "Above ৳5,000" },
]

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "fee_asc", label: "Fee: low to high" },
  { value: "fee_desc", label: "Fee: high to low" },
]

const PAGE_SIZE = 6

export default function BrowseTuitionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All Subjects")
  const [selectedMode, setSelectedMode] = React.useState<"all" | "Online" | "Offline">("all")
  const [selectedLevel, setSelectedLevel] = React.useState("all")
  const [selectedBudget, setSelectedBudget] = React.useState("all")
  const [sort, setSort] = React.useState("newest")
  const [currentPage, setCurrentPage] = React.useState(1)

  // Typing should not fire one request per keystroke.
  const debouncedSearch = useDebouncedValue(searchQuery)

  // Filters live in the query string, so the server does the filtering,
  // sorting and pagination (Challenge 1) instead of the browser.
  const query = React.useMemo(() => {
    const budget =
      selectedBudget === "under-4000"
        ? { maxFee: 3999 }
        : selectedBudget === "4000-5000"
          ? { minFee: 4000, maxFee: 5000 }
          : selectedBudget === "above-5000"
            ? { minFee: 5001 }
            : {}

    return toQueryString({
      search: debouncedSearch.trim() || undefined,
      subject: selectedCategory === "All Subjects" ? undefined : selectedCategory,
      mode: selectedMode === "all" ? undefined : selectedMode,
      classLevel: selectedLevel === "all" ? undefined : selectedLevel,
      sort,
      limit: PAGE_SIZE,
      page: currentPage,
      ...budget,
    })
  }, [debouncedSearch, selectedCategory, selectedMode, selectedLevel, selectedBudget, sort, currentPage])

  const { data, pagination, loading, error, refetch } = useApi<Tuition[]>(
    `/api/tuitions?${query}`
  )

  const tuitions = data ?? []
  const total = pagination?.total ?? 0
  const totalPages = Math.max(pagination?.totalPages ?? 1, 1)

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Subjects")
    setSelectedMode("all")
    setSelectedLevel("all")
    setSelectedBudget("all")
    setSort("newest")
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
                {loading && !data ? "…" : total}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {total} {total === 1 ? "Batch" : "Batches"} Enrolling
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
                  onClick={() => {
                    setSearchQuery("")
                    setCurrentPage(1)
                  }}
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
                  {CLASS_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
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
                  {BUDGETS.map((budget) => (
                    <option key={budget.value} value={budget.value}>
                      {budget.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-2xs"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
              {loading && !data ? (
                "Loading listings…"
              ) : (
                <>
                  Displaying <strong className="text-foreground">{tuitions.length}</strong> of{" "}
                  <strong className="text-foreground">{total}</strong> verified batch dossiers
                </>
              )}
            </span>
          </div>

          <span className="hidden sm:inline-block">
            Sorted by: <strong>{SORTS.find((option) => option.value === sort)?.label}</strong>
          </span>
        </div>

        {/* The API could not be reached */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-card border border-destructive/30 my-6">
            <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
              <RefreshCw className="size-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Could Not Load The Catalogue
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-5 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {!error && loading && !data && (
          <div className="space-y-5" aria-hidden="true">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 animate-pulse"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-4 h-48 sm:h-52 rounded-xl bg-muted" />
                  <div className="lg:col-span-5 space-y-3">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </div>
                  <div className="lg:col-span-3 space-y-3">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-8 w-32 rounded bg-muted" />
                    <div className="h-9 w-full rounded-xl bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!error && !loading && tuitions.length === 0 ? (
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
            {tuitions.map((t) => {
              const isOnline = t.mode === "Online"
              return (
                <article
                  key={t._id}
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
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="size-3 text-emerald-300" />
                          <span>Board approved</span>
                        </span>

                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-black/60 border border-white/20">
                          {formatDate(t.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Middle Column: Editorial Content (5 cols) */}
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

                      {/* Tutor Lockup */}
                      <div className="pt-2 flex items-center gap-2.5 text-xs">
                        <div className="size-8 rounded-full bg-primary/20 text-primary font-mono font-bold flex items-center justify-center border border-primary/30 shrink-0">
                          {initials(t.tutorName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate flex items-center gap-1.5">
                            <span>{t.tutorName}</span>
                            <CheckCircle2 className="size-3 text-primary inline" />
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate font-mono">
                            {weeklyPace(t.daysPerWeek)} · {t.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Ledger Fee, Schedule & Action (3 cols) */}
                    <div className="lg:col-span-3 lg:border-l lg:border-border/80 lg:pl-6 space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/70 flex flex-col justify-between h-full">
                      <div className="space-y-2 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5 text-primary shrink-0" />
                          <span>{weeklyPace(t.daysPerWeek)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">Listed {formatDate(t.createdAt)}</span>
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
                            {formatFee(t.monthlyFee)}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              / mo
                            </span>
                          </span>
                        </div>

                        <Link
                          href={`/tuitions/${t._id}`}
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
            5. ARCHIVAL PAGINATION RIBBON
        ────────────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-muted-foreground">
            Archive Page <strong className="text-foreground">0{currentPage}</strong> of{" "}
            <strong>0{totalPages}</strong> • Showing {tuitions.length} of {total} listings
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border bg-card hover:bg-card/90 text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
                {String(page).padStart(2, "0")}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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

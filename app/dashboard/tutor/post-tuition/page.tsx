"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Crown,
  Info,
  Link2,
  MapPin,
  Minus,
  Plus,
  Save,
  SendHorizontal,
  Sparkles,
  Upload,
  ArrowLeft,
  ArrowRight,
  Eye,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { StickyRail } from "@/components/dashboard/shared"

// ─── Realistic placeholder values ────────────────────────────────────────────

type BannerTone = "pine" | "terra" | "sage"

const BANNER_TONES: Record<BannerTone, { bg: string; ink: string; stamp: string }> = {
  pine: { bg: "#1E3A2F", ink: "#9DBFA9", stamp: "#C98B6D" },
  terra: { bg: "#B87959", ink: "#F7EDE1", stamp: "#1E3A2F" },
  sage: { bg: "#4A695C", ink: "#F2ECDF", stamp: "#C98B6D" },
}

const STUDENT_FIT_CHIPS = ["BUET-bound", "DU-bound", "Medical-bound", "Repeaters welcome", "First principles only", "Admission marathon"]

// ─── Scoped publish-desk styles ──────────────────────────────────────────────

const publishStyles = `
  .publish-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .publish-root ::selection { background: #B87959; color: #1E3A2F; }

  @keyframes publish-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .publish-rise { animation: publish-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes publish-stamp-idle {
    0%, 100% { transform: rotate(-9deg); }
    50%      { transform: rotate(-7deg); }
  }
  .publish-stamp-idle { animation: publish-stamp-idle 4s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .publish-rise, .publish-stamp-idle { animation: none !important; }
  }
`

// ─── Section shell (folder-tab ledger header) ────────────────────────────────

function DeskSection({
  index,
  title,
  hint,
  children,
}: {
  index: string
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={`desk-${index}`} className="relative border border-[#344C43]/25 bg-[#EFE7DC] shadow-[4px_5px_0_rgba(52,76,67,0.13)]">
      <span className="absolute -top-[13px] left-4 inline-flex h-[26px] items-center gap-2 border border-[#344C43] bg-[#344C43] px-3 font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-[#EFE7DC]">
        <span className="text-[#C98B6D]">{index}</span>
        {title}
      </span>
      {hint && (
        <p className="absolute -top-[11px] right-4 hidden font-mono text-[7px] uppercase tracking-[0.22em] text-[#344C43]/55 sm:block">
          {hint}
        </p>
      )}
      <div className="p-4 pt-6 sm:p-6 sm:pt-7">{children}</div>
    </section>
  )
}

const fieldLabel = "font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60"
const wellField =
  "h-11 w-full rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] px-3 text-[13px] text-[#344C43] outline-none transition-all placeholder:text-[#344C43]/35 hover:border-[#344C43]/45 focus:border-[#668B78] focus:bg-[#EFE7DC] focus:ring-2 focus:ring-[#668B78]/20"
const areaField =
  "w-full resize-none rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] px-3 py-2.5 text-[13px] leading-relaxed text-[#344C43] outline-none transition-all placeholder:text-[#344C43]/35 hover:border-[#344C43]/45 focus:border-[#668B78] focus:bg-[#EFE7DC] focus:ring-2 focus:ring-[#668B78]/20"

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PostTuitionPage() {
  const [form, setForm] = useState({
    title: "HSC Physics — The Integration Finals",
    pitch: "Six weeks. Twelve scholars. One syllabus, zero mercy — integration by parts decoded from first principles.",
    subject: "Physics",
    classLevel: "HSC (2026 batch)",
    mode: "Offline" as "Online" | "Offline",
    daysPerWeek: 2,
    fit: new Set<string>(["BUET-bound", "First principles only"]),
    requirements:
      "HSC '26 candidates who finished Algebra II and Vectors without flinching — comfortable with limits, hungry for proofs, allergic to rote.",
    location: "Dhanmondi 27, Dhaka — Studio № 3",
    batchSize: "12 (front bench first)",
    fee: "4500",
    cycle: "Monthly",
    schedule: "Fri & Sat · 6:00 PM — 90 minutes",
    bannerTone: "pine" as BannerTone,
  })

  const [draftSaved, setDraftSaved] = useState(false)
  const [published, setPublished] = useState(false)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleFit = (chip: string) =>
    setForm((prev) => {
      const next = new Set(prev.fit)
      if (next.has(chip)) next.delete(chip)
      else next.add(chip)
      return { ...prev, fit: next }
    })

  const tone = BANNER_TONES[form.bannerTone]

  const selectClass = cn(
    wellField,
    "appearance-none pr-9"
  )

  return (
    <div className="publish-root relative text-[#344C43]">
      <style>{publishStyles}</style>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">

        {/* ══ MASTHEAD — the publisher's desk ═════════════════════════════ */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#344C43] pb-5 sm:pb-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#B87959] sm:text-[10px]">
              [ The Publisher&rsquo;s Desk — Galley Proof № 007 ]
            </p>
            <h1
              className="publish-rise publish-serif mt-2.5 font-black leading-[0.92] tracking-[-0.035em] text-[#344C43]"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 6vw, 4.5rem)" } as React.CSSProperties}
            >
              Ink a new
              <span className="block">
                <span className="italic text-[#668B78]">batch.</span>
                <span aria-hidden="true" className="text-[#B87959]">.</span>
              </span>
            </h1>
            <p className="publish-rise mt-3 max-w-[52ch] text-sm leading-relaxed text-[#344C43]/80" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
              Six proof sections between you and a live listing. Set the type,
              check the galley, stamp the banner — the board reads everything
              within two working days.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-1.5 border border-[#C98B6D]/50 bg-[#B87959]/10 px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#B87959]">
              <Crown aria-hidden="true" className="size-3.5" strokeWidth={2} />
              Tutor Pro · Unlimited Ink
            </span>
            <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#344C43]/50">
              Avg. board approval — 2 days
            </span>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          {/* ══ LEFT — the proof (form, six sections) ═════════════════════ */}
          <form
            className="space-y-6 lg:col-span-7"
            onSubmit={(e) => e.preventDefault()}
            noValidate
            aria-label="Create a new tuition listing"
          >
            {/* 01 — Tuition Overview */}
            <DeskSection index="01" title="Tuition Overview" hint="The masthead line">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="f-title" className={cn(fieldLabel, "mb-1.5")}>
                    Batch Title <span className="text-[#B87959]">*</span>
                  </Label>
                  <Input
                    id="f-title"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. HSC Physics — The Integration Finals"
                    className={cn(wellField, "publish-serif text-[15px] font-bold")}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="f-pitch" className={cn(fieldLabel, "mb-1.5")}>
                    The Hook <span className="text-[#B87959]">*</span>
                  </Label>
                  <textarea
                    id="f-pitch"
                    rows={2}
                    value={form.pitch}
                    onChange={(e) => set("pitch", e.target.value)}
                    placeholder="One sentence a parent can't scroll past."
                    className={areaField}
                  />
                  <p className="mt-1.5 text-right font-mono text-[7px] uppercase tracking-[0.2em] text-[#344C43]/40">
                    {form.pitch.length} / 140 characters — make every one earn its keep
                  </p>
                </div>
              </div>
            </DeskSection>

            {/* 02 — Subject & Academic Details */}
            <DeskSection index="02" title="Subject & Academic Details" hint="The syllabus spine">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="f-subject" className={cn(fieldLabel, "mb-1.5")}>Subject</Label>
                  <div className="relative">
                    <select
                      id="f-subject"
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      className={selectClass}
                    >
                      {["Physics", "Higher Maths", "Chemistry", "Biology", "ICT", "English", "Accounting", "Economics"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="f-class" className={cn(fieldLabel, "mb-1.5")}>Class Level</Label>
                  <div className="relative">
                    <select
                      id="f-class"
                      value={form.classLevel}
                      onChange={(e) => set("classLevel", e.target.value)}
                      className={selectClass}
                    >
                      {["HSC (2026 batch)", "HSC (2025 repeaters)", "SSC (2027 batch)", "Admission — BUET/DU/Medical", "O-Level", "A-Level"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <span className={fieldLabel}>Days per Week</span>
                  <div className="mt-1.5 flex h-11 items-stretch border border-[#344C43]/25 bg-[#F2ECDF]">
                    <button
                      type="button"
                      onClick={() => set("daysPerWeek", Math.max(1, form.daysPerWeek - 1))}
                      aria-label="Fewer days per week"
                      className="flex w-11 items-center justify-center border-r border-[#344C43]/20 text-[#344C43]/70 transition-colors hover:bg-[#EFE7DC] hover:text-[#344C43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#668B78]"
                    >
                      <Minus className="size-4" strokeWidth={2.25} />
                    </button>
                    <span aria-live="polite" className="flex flex-1 flex-col items-center justify-center">
                      <span className="publish-serif text-lg font-black leading-none text-[#344C43]">{form.daysPerWeek}</span>
                      <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-[#344C43]/50">days / week</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => set("daysPerWeek", Math.min(7, form.daysPerWeek + 1))}
                      aria-label="More days per week"
                      className="flex w-11 items-center justify-center border-l border-[#344C43]/20 text-[#344C43]/70 transition-colors hover:bg-[#EFE7DC] hover:text-[#344C43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#668B78]"
                    >
                      <Plus className="size-4" strokeWidth={2.25} />
                    </button>
                  </div>
                </div>
                <div>
                  <span id="mode-label" className={fieldLabel}>Mode of Teaching</span>
                  <div role="group" aria-labelledby="mode-label" className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {(["Online", "Offline"] as const).map((m) => {
                      const active = form.mode === m
                      return (
                        <button
                          key={m}
                          type="button"
                          aria-pressed={active}
                          onClick={() => set("mode", m)}
                          className={cn(
                            "flex h-11 items-center justify-center border font-mono text-[9px] font-bold uppercase tracking-[0.24em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]",
                            active
                              ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[3px_3px_0_#B87959]"
                              : "border-[#344C43]/25 bg-[#F2ECDF] text-[#344C43]/60 hover:border-[#344C43]/55 hover:text-[#344C43]"
                          )}
                        >
                          {m}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </DeskSection>

            {/* 03 — Student Requirements */}
            <DeskSection index="03" title="Student Requirements" hint="Who deserves the seat">
              <div>
                <Label htmlFor="f-reqs" className={cn(fieldLabel, "mb-1.5")}>The Scholar Profile</Label>
                <textarea
                  id="f-reqs"
                  rows={2}
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                  placeholder="Name the scholar you teach best — marks, hunger, habits."
                  className={areaField}
                />
                <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Quick-fit chips">
                  {STUDENT_FIT_CHIPS.map((chip) => {
                    const active = form.fit.has(chip)
                    return (
                      <button
                        key={chip}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleFit(chip)}
                        className={cn(
                          "rounded-full border px-2.5 py-1.5 font-mono text-[7.5px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]",
                          active
                            ? "border-[#668B78] bg-[#668B78]/15 text-[#4A695C]"
                            : "border-[#344C43]/25 bg-transparent text-[#344C43]/55 hover:border-[#668B78]/60 hover:text-[#4A695C]"
                        )}
                      >
                        {chip}
                      </button>
                    )
                  })}
                </div>
              </div>
            </DeskSection>

            {/* 04 — Location & Teaching Preferences */}
            <DeskSection index="04" title="Location & Teaching Preferences" hint="Where the desk is">
              <div className="grid gap-4 sm:grid-cols-5">
                <div className="sm:col-span-3">
                  <Label htmlFor="f-location" className={cn(fieldLabel, "mb-1.5")}>Location / Link</Label>
                  <div className="relative">
                    <MapPin aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#668B78]" strokeWidth={1.75} />
                    <Input
                      id="f-location"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="Dhanmondi 27, Dhaka — or paste your meet link"
                      className={cn(wellField, "pl-9")}
                    />
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[7px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/50">
                    {form.mode === "Online" ? (
                      <><Link2 aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />Online batch — link auto-enclosed in every admission letter</>
                    ) : (
                      <><MapPin aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />Offline batch — scholars receive the studio address on acceptance</>
                    )}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="f-seats" className={cn(fieldLabel, "mb-1.5")}>Batch Size</Label>
                  <div className="relative">
                    <select
                      id="f-seats"
                      value={form.batchSize}
                      onChange={(e) => set("batchSize", e.target.value)}
                      className={selectClass}
                    >
                      {["6 (intimate)", "12 (front bench first)", "16 (standard hall)", "20 (max registry)"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </DeskSection>

            {/* 05 — Salary & Schedule */}
            <DeskSection index="05" title="Salary & Schedule" hint="The brass tacks">
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <Label htmlFor="f-fee" className={cn(fieldLabel, "mb-1.5")}>Monthly Fee</Label>
                  <div className="relative">
                    <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-base font-bold text-[#668B78]">৳</span>
                    <Input
                      id="f-fee"
                      inputMode="numeric"
                      value={form.fee}
                      onChange={(e) => set("fee", e.target.value.replace(/[^\d,]/g, ""))}
                      className={cn(wellField, "pl-8 font-mono font-bold tabular-nums")}
                      aria-describedby="fee-hint"
                    />
                  </div>
                  <p id="fee-hint" className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.2em] text-[#344C43]/50">
                    Market median — ৳4,500
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <Label htmlFor="f-cycle" className={cn(fieldLabel, "mb-1.5")}>Cycle</Label>
                  <div className="relative">
                    <select
                      id="f-cycle"
                      value={form.cycle}
                      onChange={(e) => set("cycle", e.target.value)}
                      className={selectClass}
                    >
                      {["Monthly", "Per session", "Term (3 months)"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
                  </div>
                </div>
                <div className="sm:col-span-5">
                  <Label htmlFor="f-schedule" className={cn(fieldLabel, "mb-1.5")}>Sessions &amp; Timing</Label>
                  <Input
                    id="f-schedule"
                    value={form.schedule}
                    onChange={(e) => set("schedule", e.target.value)}
                    placeholder="Fri & Sat · 6:00 PM"
                    className={wellField}
                  />
                </div>
              </div>
            </DeskSection>

            {/* 06 — Tuition Banner Upload */}
            <DeskSection index="06" title="Tuition Banner Upload" hint="The face of the batch">
              <div className="grid gap-4 sm:grid-cols-5">
                {/* Dropzone */}
                <div
                  className="sm:col-span-3 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#344C43]/30 bg-[#F2ECDF] px-4 py-6 text-center transition-colors hover:border-[#668B78]/60"
                  role="button"
                  tabIndex={0}
                  aria-label="Upload banner artwork (decorative only in this preview)"
                >
                  <Upload aria-hidden="true" className="size-6 text-[#668B78]" strokeWidth={1.75} />
                  <p className="font-mono text-[9px] font-bold uppercase leading-relaxed tracking-[0.22em] text-[#344C43]">
                    Drop banner here<br />
                    <span className="font-medium text-[#344C43]/55">or browse files</span>
                  </p>
                  <p className="font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/45">
                    PNG · JPG · 1600 × 640 · ≤ 5 MB<br />Warm tones photograph best
                  </p>
                </div>
                {/* Tone picker */}
                <div className="sm:col-span-2">
                  <span id="tone-label" className={fieldLabel}>Or set the board tone</span>
                  <div role="group" aria-labelledby="tone-label" className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {(Object.keys(BANNER_TONES) as BannerTone[]).map((t) => {
                      const active = form.bannerTone === t
                      const tConf = BANNER_TONES[t]
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={active}
                          aria-label={`Banner tone ${t}`}
                          onClick={() => set("bannerTone", t)}
                          className={cn(
                            "flex h-16 flex-col items-center justify-center gap-1 border transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]",
                            active ? "border-[#344C43] shadow-[3px_3px_0_#B87959]" : "border-[#344C43]/25 opacity-70 hover:opacity-100"
                          )}
                          style={{ backgroundColor: tConf.bg }}
                        >
                          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.24em]" style={{ color: tConf.ink }}>
                            {t}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/50">
                    <Sparkles aria-hidden="true" className="size-3 text-[#B87959]" strokeWidth={2} />
                    Studio default applies to all listings
                  </p>
                </div>
              </div>
            </DeskSection>
          </form>

          {/* ══ RIGHT — the galley (sticky rail) ══════════════════════════ */}
          <StickyRail className="space-y-5 lg:col-span-5">
            {/* Free Plan listing-limit notice */}
            <div className="relative border border-[#B87959]/50 bg-[#B87959]/10 py-4 pl-5 pr-4" role="note" aria-label="Free plan listing limit">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[#B87959]" />
              <div className="flex items-start gap-3">
                <Crown aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#B87959]" strokeWidth={1.75} />
                <div>
                  <p className="font-mono text-[8px] font-bold uppercase leading-snug tracking-[0.26em] text-[#B87959]">
                    Free Plan — 2 Active Listings Max
                  </p>
                  <p className="mt-1.5 text-[12px] leading-snug text-[#344C43]/85">
                    Free mentors may hold <strong>two live batches</strong> at a time. Your studio
                    publishes as <strong>Tutor Pro — unlimited listings</strong>, verified seal and
                    the featured index.
                  </p>
                  <Link href="/pricing" className="mt-2 inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#B87959] underline decoration-[#B87959]/40 underline-offset-4 transition-colors hover:text-[#96603F]">
                    Compare plans
                    <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Final proof — live banner preview */}
            <figure className="border border-[#344C43]/30 bg-[#EFE7DC] p-4 shadow-[6px_7px_0_rgba(52,76,67,0.16)]">
              <figcaption className="flex items-center justify-between gap-3 border-b border-[#344C43]/20 pb-2">
                <span className="flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#344C43]/60">
                  <Eye aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />
                  Final Proof — Live Galley
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#344C43]/45">
                  ML-1025 · Draft
                </span>
              </figcaption>

              {/* The banner itself */}
              <div
                className="mt-3 aspect-[16/9] w-full overflow-hidden border border-[#243630] p-4 sm:p-5"
                style={{ backgroundColor: tone.bg, backgroundImage: "radial-gradient(circle at 85% 15%, rgba(242,237,223,0.10) 0%, transparent 50%)" }}
                role="img"
                aria-label={`Banner preview for ${form.title}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="publish-stamp-idle inline-block border-2 border-dashed px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.3em]"
                      style={{ borderColor: tone.stamp, color: tone.stamp }}
                    >
                      {form.subject}
                    </span>
                    <span className="font-mono text-[7px] uppercase leading-relaxed tracking-[0.24em] text-right" style={{ color: tone.ink, opacity: 0.75 }}>
                      {form.mode} · {form.daysPerWeek}× / wk
                    </span>
                  </div>
                  <p className="publish-serif text-[1.35rem] font-black leading-[1.02] tracking-tight sm:text-2xl" style={{ color: tone.ink }}>
                    {form.title || "Untitled batch"}
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <span className="font-mono text-[7px] uppercase leading-relaxed tracking-[0.18em]" style={{ color: tone.ink, opacity: 0.85 }}>
                      Dr. Nasrin Islam · <BadgeCheck aria-hidden="true" className="inline size-3 align-[-2px]" /> Verified
                    </span>
                    <span className="shrink-0 font-mono text-[9px] font-bold tracking-[0.14em]" style={{ color: tone.stamp }}>
                      ৳{form.fee || "0"}/mo
                    </span>
                  </div>
                </div>
              </div>

              {/* Proof ledger lines */}
              <dl className="mt-3 divide-y divide-[#344C43]/15 border-y border-[#344C43]/20 font-mono text-[8px] uppercase tracking-[0.18em]">
                {[
                  ["Level", form.classLevel],
                  ["Schedule", form.schedule],
                  ["Seats", form.batchSize],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-1.5">
                    <dt className="text-[#344C43]/50">{k}</dt>
                    <dd className="truncate font-semibold text-[#344C43]">{v}</dd>
                  </div>
                ))}
              </dl>
            </figure>

            {/* Save / publish actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => { setDraftSaved(true); setPublished(false) }}
                className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-sm border border-[#344C43]/35 bg-transparent font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#344C43] transition-all hover:border-[#344C43] hover:bg-[#EFE7DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
              >
                {draftSaved && !published ? (
                  <>
                    <CheckCircle2 aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={2} />
                    Draft saved to your desk
                  </>
                ) : (
                  <>
                    <Save aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={1.75} />
                    Save Draft
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setPublished(true); setDraftSaved(false) }}
                className={cn(
                  "group flex h-13 w-full items-center justify-center gap-2.5 rounded-sm border px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.28em] transition-all duration-200",
                  published
                    ? "border-[#668B78] bg-[#668B78] text-[#F2ECDF]"
                    : "border-[#A6683F]/60 bg-[#B87959] text-[#1E3A2F] shadow-[5px_5px_0_#344C43] hover:-translate-y-0.5 hover:bg-[#C98B6D] hover:shadow-[7px_7px_0_#344C43]"
                )}
              >
                {published ? (
                  <>
                    <CheckCircle2 aria-hidden="true" className="size-5" strokeWidth={2} />
                    Queued for the board
                  </>
                ) : (
                  <>
                    <SendHorizontal aria-hidden="true" className="size-5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
                    Publish Tuition
                  </>
                )}
              </button>
              <p className="flex items-center justify-center gap-1.5 pt-0.5 text-center font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/45">
                <Info aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />
                {published
                  ? "The board reads every submission — avg. 2 days"
                  : "Publishing as Tutor Pro — no listing cap applies"}
              </p>
            </div>

            {/* Fine print / back link */}
            <p className="flex items-center justify-between gap-3 border-t border-[#344C43]/20 pt-3 font-mono text-[7px] uppercase tracking-[0.22em] text-[#344C43]/50">
              <Link href="/dashboard/tutor/my-tuitions" className="group inline-flex items-center gap-1.5 font-bold text-[#344C43] transition-colors hover:text-[#B87959]">
                <ArrowLeft aria-hidden="true" className="size-3 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.5} />
                My Tuitions
              </Link>
              <span>Drafts live on your desk</span>
            </p>
          </StickyRail>
        </div>
      </div>
    </div>
  )
}

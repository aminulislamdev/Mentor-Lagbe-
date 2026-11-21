"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Compass,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Bookmark,
  BookOpen,
  AlertCircle,
  X,
  Send,
  ArrowUpRight,
  FileText,
  BadgeCheck,
  Loader2,
} from "lucide-react"
import { useApi } from "@/lib/hooks/use-api"
import { apiFetch, ApiError } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import type { Tuition } from "@/types/tuition"

export default function RedesignedTuitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  // API থেকে ডাটা ফেচ করা (টোকেন ছাড়া)
  const { data: tuition, loading, error } = useApi<Tuition>(`/api/tuitions/${params.id}`)

  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [showApplyModal, setShowApplyModal] = React.useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form states
  const [studentPhone, setStudentPhone] = React.useState("")
  const [preferredSlot, setPreferredSlot] = React.useState("Standard Batch Time")
  const [learnerGoals, setLearnerGoals] = React.useState("")

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error("Please sign in as a student to apply.")
      router.push("/sign-in")
      return
    }

    setIsSubmitting(true)
    try {
      await apiFetch("/api/applications", {
        method: "POST",
        body: {
          tuitionId: tuition?._id,
          studentPhone,
          preferredSchedule: preferredSlot,
          studentNote: learnerGoals,
        },
      })
      setApplicationSubmitted(true)
      toast.success("Application submitted successfully!")
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error("Failed to submit application")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowApplyModal(false)
    setTimeout(() => {
      setApplicationSubmitted(false)
      setStudentPhone("")
      setLearnerGoals("")
    }, 300)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-primary mb-4" />
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Loading Dossier...</p>
      </div>
    )
  }

  if (error || !tuition) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <AlertCircle className="size-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Dossier Not Found</h1>
        <p className="text-muted-foreground mb-6">This tuition listing may have been closed or removed by the board.</p>
        <Link href="/tuitions" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold">
          Return to Catalog
        </Link>
      </div>
    )
  }

  // ডাটাবেসের ডাটাকে UI-এর জন্য ম্যাপ করা
  const tutorInitials = tuition.tutorName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  const isOnline = tuition.mode === "Online"

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-24 selection:bg-primary/20 selection:text-foreground">
      {/* Header */}
      <header className="border-b border-border/80 bg-card/60 backdrop-blur-md pt-6 pb-8 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-6 border-b border-border/60 text-xs font-mono">
            <Link href="/tuitions" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Catalog Index</span>
              <span className="text-border">/</span>
              <span className="text-primary uppercase tracking-wider">{tuition.subject}</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                <FileText className="size-3 text-primary" />
                <span>Ref: ML-{tuition._id.slice(-4).toUpperCase()}</span>
              </span>

              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${isBookmarked ? "bg-[#B87959]/15 border-[#B87959]/40 text-[#B87959]" : "bg-card border-border hover:border-primary/40 text-foreground"
                  }`}
              >
                <Bookmark className={`size-3.5 ${isBookmarked ? "fill-[#B87959]" : ""}`} />
                <span className="hidden md:inline">{isBookmarked ? "Cataloged" : "Save Batch"}</span>
              </button>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md bg-[#344C43] text-[#EFE7DC] border border-[#344C43]/40 shadow-2xs">
                  {tuition.subject}
                </span>
                <span className="font-mono text-xs font-semibold px-3 py-1 rounded-md bg-primary/15 text-primary border border-primary/30">
                  {tuition.classLevel}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-md bg-card border border-border text-foreground">
                  <span className={`size-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span>{tuition.mode} Delivery</span>
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                {tuition.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
              <div className="relative h-72 sm:h-96 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tuition.bannerImage} alt={tuition.title} className="size-full object-cover filter contrast-[1.03]" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 flex flex-wrap items-center justify-between gap-3 text-white font-mono text-xs">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 backdrop-blur-md">
                    <MapPin className="size-3.5 text-primary" />
                    <span>{tuition.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#344C43]/90 border border-white/20 backdrop-blur-md text-[#EFE7DC]">
                    <ShieldCheck className="size-3.5 text-[#B87959]" />
                    <span>Moderated Academic Program</span>
                  </span>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <h2 className="font-heading text-lg font-bold text-foreground">Weekly Rhythm & Contact Hours</h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{tuition.daysPerWeek} Days / Week</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: tuition.daysPerWeek }).map((_, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-card border border-border shadow-2xs">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87959] font-bold block mb-1">Session 0{idx + 1}</span>
                    <h3 className="font-heading text-base font-bold text-foreground">Scheduled Session</h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1">Time coordinated with tutor</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <BookOpen className="size-4 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">Manifesto & Teaching Pedagogy</h2>
              </div>
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xs leading-relaxed text-sm sm:text-base text-foreground/90 font-sans space-y-4">
                <p className="whitespace-pre-wrap">{tuition.description}</p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="size-4 text-primary" />
                  <h2 className="font-heading text-lg font-bold text-foreground">Instructor Monograph</h2>
                </div>
                <span className="font-mono text-xs text-[#B87959] font-bold">Verified Academic Faculty</span>
              </div>
              <div className="p-6 sm:p-8 rounded-3xl bg-[#344C43] text-[#EFE7DC] shadow-lg relative overflow-hidden space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="size-20 rounded-2xl bg-white/10 text-[#EFE7DC] border border-white/20 font-mono text-2xl font-bold flex items-center justify-center shrink-0">
                    {tutorInitials}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-2xl font-bold text-[#EFE7DC]">{tuition.tutorName}</h3>
                      <BadgeCheck className="size-5 text-[#B87959]" />
                    </div>
                    <p className="font-mono text-xs text-[#D9CBB5]/80">Mentor at MentorLagbe</p>
                    <p className="font-mono text-xs text-[#668B78] font-semibold">{tuition.tutorEmail}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sticky Docket */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-7 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87959] font-bold block">Tuition Subscription</span>
                  <span className="font-mono text-xs text-foreground font-semibold">{tuition.daysPerWeek * 4} Sessions / Month</span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-[#668B78]/15 text-primary font-bold">Active Intake</span>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-muted-foreground block">Monthly Tuition Investment</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-extrabold text-foreground">৳ {tuition.monthlyFee.toLocaleString()}</span>
                  <span className="font-mono text-xs text-muted-foreground">/ month</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/80 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Class Frequency:</span>
                  <span className="font-semibold text-foreground">{tuition.daysPerWeek} Days / Week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Venue:</span>
                  <span className="font-semibold text-primary">{tuition.mode} Batch</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Approval Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Board Approved</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="w-full py-4 px-5 rounded-2xl bg-primary hover:bg-[#537363] text-white font-semibold text-sm shadow-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Enrollment Application</span>
                  <ArrowUpRight className="size-4" />
                </button>
                <p className="text-center font-mono text-[10px] text-muted-foreground">Free application • Tutor confirms seat placement within 24 hours</p>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-foreground/80 flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">Applications are reserved exclusively for students. You can monitor or cancel pending submissions directly inside your dashboard.</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground">
            <button type="button" onClick={closeModal} className="absolute top-5 right-5 size-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="size-4" />
            </button>

            {applicationSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="size-16 rounded-2xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="size-8" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Enrollment Request Dispatched</span>
                <h3 className="font-heading text-2xl font-bold text-foreground">Application Logged</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your seat reservation request for <strong>{tuition.title}</strong> has been saved with status <span className="font-mono text-[#B87959] font-bold">Pending</span>.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-[#537363] transition-colors cursor-pointer">Done</button>
                  <Link href="/dashboard/student/my-applications" className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-background text-xs font-semibold text-foreground transition-colors">View in Dashboard</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="border-b border-border/80 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#B87959] font-bold">Official Student Application</span>
                  <h3 className="font-heading text-xl font-bold text-foreground mt-0.5">Apply for {tuition.subject}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Faculty: {tuition.tutorName} • Monthly: ৳{tuition.monthlyFee.toLocaleString()}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-mono uppercase font-semibold text-foreground block mb-1">Direct Student Phone *</label>
                    <input type="tel" required value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} placeholder="+880 17XX-XXXXXX" className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="font-mono uppercase font-semibold text-foreground block mb-1">Schedule Preference</label>
                    <select value={preferredSlot} onChange={(e) => setPreferredSlot(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                      <option value="Standard Batch Time">Standard Batch Time</option>
                      <option value="Alternative Evening">Alternative Evening Slot</option>
                      <option value="Weekend Mornings">Weekend Mornings Focus</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono uppercase font-semibold text-foreground block mb-1">Academic Objectives & Note</label>
                    <textarea rows={3} value={learnerGoals} onChange={(e) => setLearnerGoals(e.target.value)} placeholder="Mention your target board examination, current marks..." className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border/80 flex items-start gap-2 text-[11px] text-muted-foreground">
                  <AlertCircle className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Your submission creates an entry with status <strong>Pending</strong>. You can cancel it before acceptance.</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-card cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                    <span>{isSubmitting ? "Submitting..." : "Submit to Faculty"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
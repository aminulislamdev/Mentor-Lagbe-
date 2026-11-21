"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ImagePlus, Loader2, Plus, ShieldCheck, Trash2, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch, ApiError, uploadImage } from "@/lib/api"
import { useApi } from "@/lib/hooks/use-api"
import { StudioBoard, StudioNotice, studioStyles } from "@/components/dashboard/studio"
import { Colophon } from "@/components/dashboard/shared"
import { formatFee } from "@/lib/adapters"
import type { TutorStats, Tuition } from "@/lib/api-types"

const FIELD_GROUP = "grid gap-4 sm:grid-cols-2"
const FULL = "sm:col-span-2"

interface FormState {
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  location: string
  monthlyFee: string
  daysPerWeek: string
  bannerImage: string
  description: string
}

const EMPTY: FormState = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "2",
  bannerImage: "",
  description: "",
}

export default function PostTuitionPage() {
  const router = useRouter()
  const stats = useApi<TutorStats>("/api/dashboard/stats")

  const [form, setForm] = React.useState<FormState>(EMPTY)
  const [uploading, setUploading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({})

  const set = <K extends keyof FormState>(field: K) => (value: FormState[K]) =>
    setForm((previous) => ({ ...previous, [field]: value }))

  const isPro = stats.data?.plan === "pro"
  const atFreeLimit = !isPro && (stats.data?.activeTuitions ?? 0) >= 2

  const pickBanner = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      set("bannerImage")(url)
      toast.success("Banner uploaded to ImgBB")
    } catch (cause) {
      toast.error(cause instanceof ApiError ? cause.message : "Could not upload the image")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}

    if (!form.title.trim()) next.title = "A title is required"
    if (!form.subject.trim()) next.subject = "Add the subject"
    if (!form.classLevel.trim()) next.classLevel = "Add the class level"
    if (!form.location.trim()) next.location = "Add a location"
    if (!form.description.trim()) next.description = "Describe the batch"
    if (!form.bannerImage) next.bannerImage = "Upload a banner image"

    const fee = Number(form.monthlyFee)
    if (!Number.isFinite(fee) || fee < 0) next.monthlyFee = "Enter a monthly fee"

    const days = Number(form.daysPerWeek)
    if (!Number.isFinite(days) || days < 1 || days > 7) next.daysPerWeek = "Between 1 and 7"

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      toast.error("Please fix the highlighted fields")
      return
    }

    setSaving(true)
    try {
      await apiFetch<Tuition>("/api/tuitions", {
        method: "POST",
        body: {
          title: form.title,
          subject: form.subject,
          classLevel: form.classLevel,
          mode: form.mode,
          location: form.location,
          monthlyFee: Number(form.monthlyFee),
          daysPerWeek: Number(form.daysPerWeek),
          bannerImage: form.bannerImage,
          description: form.description,
        },
      })
      toast.success("Tuition posted — it is pending board approval")
      router.push("/dashboard/tutor/my-tuitions")
    } catch (cause) {
      toast.error(cause instanceof ApiError ? cause.message : "Could not post the tuition")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="studio-root min-h-screen bg-[#F2EDDF] text-[#1E3A2F]">
      <style>{studioStyles}</style>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b-2 border-[#344C43] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#B87959]">
              [ The Mentor&rsquo;s Register — New Listing ]
            </p>
            <h1 className="studio-serif mt-2 text-3xl font-black tracking-tight text-[#344C43] sm:text-4xl">
              Open a <span className="italic text-[#668B78]">new batch</span>.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#344C43]/70">
              Post the details and a banner. The board reviews every listing before it appears in the
              public catalogue.
            </p>
          </div>

          <Linkish onClick={() => router.push("/dashboard/tutor/my-tuitions")}>
            Back to my listings
          </Linkish>
        </div>

        {atFreeLimit && (
          <div className="mt-5">
            <StudioNotice
              tone="warning"
              title="Free plan limit reached"
              action={
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#B87959] text-[#1E3A2F] hover:bg-[#C98B6D]"
                  onClick={() => router.push("/pricing")}
                >
                  See Pro
                </Button>
              }
            >
              Your plan allows two active listings. Close an existing batch before posting another.
            </StudioNotice>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-8" noValidate>
            <StudioBoard tab="Compose the listing" note="All fields required">
              <div className="grid gap-5">
                <div className={FIELD_GROUP}>
                  <div className={FULL}>
                    <Label htmlFor="title" required>
                      Batch title
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(event) => set("title")(event.target.value)}
                      placeholder="HSC Higher Mathematics — Calculus & Vectors"
                      hasError={Boolean(errors.title)}
                      aria-invalid={Boolean(errors.title)}
                    />
                    {errors.title && <p className="mt-1 text-[11px] text-[#A34343]">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="subject" required>
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(event) => set("subject")(event.target.value)}
                      placeholder="Mathematics"
                      hasError={Boolean(errors.subject)}
                    />
                    {errors.subject && <p className="mt-1 text-[11px] text-[#A34343]">{errors.subject}</p>}
                  </div>

                  <div>
                    <Label htmlFor="classLevel" required>
                      Class level
                    </Label>
                    <Input
                      id="classLevel"
                      value={form.classLevel}
                      onChange={(event) => set("classLevel")(event.target.value)}
                      placeholder="HSC"
                      hasError={Boolean(errors.classLevel)}
                    />
                    {errors.classLevel && <p className="mt-1 text-[11px] text-[#A34343]">{errors.classLevel}</p>}
                  </div>

                  <div>
                    <Label htmlFor="mode" required>
                      Mode
                    </Label>
                    <select
                      id="mode"
                      value={form.mode}
                      onChange={(event) => set("mode")(event.target.value as FormState["mode"])}
                      className="flex h-10 w-full rounded-md border border-[rgba(52,76,67,0.20)] bg-[#EFE7DC] px-3 text-sm text-[#344C43] outline-none transition-all focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="location" required>
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(event) => set("location")(event.target.value)}
                      placeholder="Dhanmondi, Dhaka — or Online (Zoom)"
                      hasError={Boolean(errors.location)}
                    />
                    {errors.location && <p className="mt-1 text-[11px] text-[#A34343]">{errors.location}</p>}
                  </div>

                  <div>
                    <Label htmlFor="monthlyFee" required>
                      Monthly fee (৳)
                    </Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      min={0}
                      step={100}
                      value={form.monthlyFee}
                      onChange={(event) => set("monthlyFee")(event.target.value)}
                      placeholder="4500"
                      hasError={Boolean(errors.monthlyFee)}
                    />
                    {errors.monthlyFee && <p className="mt-1 text-[11px] text-[#A34343]">{errors.monthlyFee}</p>}
                  </div>

                  <div>
                    <Label htmlFor="daysPerWeek" required>
                      Days per week
                    </Label>
                    <Input
                      id="daysPerWeek"
                      type="number"
                      min={1}
                      max={7}
                      value={form.daysPerWeek}
                      onChange={(event) => set("daysPerWeek")(event.target.value)}
                      hasError={Boolean(errors.daysPerWeek)}
                    />
                    {errors.daysPerWeek && <p className="mt-1 text-[11px] text-[#A34343]">{errors.daysPerWeek}</p>}
                  </div>

                  <div className={FULL}>
                    <Label htmlFor="description" required>
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      rows={5}
                      value={form.description}
                      onChange={(event) => set("description")(event.target.value)}
                      placeholder="What the batch covers, how sessions run, what students should bring…"
                      hasError={Boolean(errors.description)}
                    />
                    {errors.description && <p className="mt-1 text-[11px] text-[#A34343]">{errors.description}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#344C43]/20 pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/50">
                    Saved as <strong className="text-[#B87959]">pending</strong> until the board approves
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/tutor/my-tuitions")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving || uploading || atFreeLimit}>
                      {saving ? (
                        <>
                          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                          Posting…
                        </>
                      ) : (
                        <>
                          <Plus aria-hidden="true" className="size-4" />
                          Post tuition
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </StudioBoard>
          </form>

          {/* Right rail */}
          <div className="space-y-8 lg:col-span-4">
            <StudioBoard tab="Banner image" note="ImgBB">
              {form.bannerImage ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.bannerImage}
                    alt="Banner preview"
                    className="h-40 w-full border border-[#344C43]/25 object-cover"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-[#344C43]/55">
                      Hosted on ImgBB
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => set("bannerImage")("")}
                    >
                      <Trash2 aria-hidden="true" className="size-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="banner"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[#344C43]/35 bg-[#FCFAF2] px-4 py-8 text-center transition-colors hover:border-[#B87959] hover:bg-[#B87959]/5"
                >
                  {uploading ? (
                    <Loader2 aria-hidden="true" className="size-7 animate-spin text-[#B87959]" />
                  ) : (
                    <UploadCloud aria-hidden="true" className="size-7 text-[#B87959]" strokeWidth={1.5} />
                  )}
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#344C43]">
                    {uploading ? "Uploading…" : "Choose an image"}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#344C43]/45">
                    jpeg · png · webp · max 5 MB
                  </span>
                  <input
                    id="banner"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={pickBanner}
                    disabled={uploading}
                  />
                </label>
              )}

              {errors.bannerImage && (
                <p className="mt-2 text-[11px] text-[#A34343]">{errors.bannerImage}</p>
              )}
            </StudioBoard>

            <StudioBoard tab="After you submit">
              <ol className="space-y-3">
                {[
                  { icon: ImagePlus, text: "Your banner is stored on ImgBB; only the URL is saved here." },
                  { icon: ShieldCheck, text: "An admin reviews the listing before it appears publicly." },
                  { icon: Plus, text: "You can edit or close it any time from My Tuitions." },
                ].map((step) => (
                  <li key={step.text} className="flex gap-2.5">
                    <step.icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#B87959]" strokeWidth={1.75} />
                    <span className="text-xs leading-relaxed text-[#344C43]/75">{step.text}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-4 border-t border-[#344C43]/20 pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/50">
                {isPro
                  ? "Pro plan — unlimited listings."
                  : `Free plan — ${stats.data?.activeTuitions ?? 0} of 2 active listings used.`}
              </p>
            </StudioBoard>

            {form.monthlyFee && Number(form.monthlyFee) > 0 && (
              <StudioBoard tab="Fee preview" note={isPro ? "Pro" : "Free"}>
                <p className="studio-serif text-4xl font-black tracking-tight text-[#344C43]">
                  {formatFee(Number(form.monthlyFee))}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/50">
                  per student, per month · {form.daysPerWeek || "0"} days a week
                </p>
              </StudioBoard>
            )}
          </div>
        </div>

        <Colophon backHref="/dashboard/tutor" backLabel="Back to the studio">
          <span>Listing is created as pending</span>
        </Colophon>
      </div>
    </div>
  )
}

/** Small text link used in the header (kept local so the page has no extra deps). */
function Linkish({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 shrink-0 items-center gap-2 border border-[#344C43]/40 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43] transition-colors hover:bg-[#344C43]/5"
    >
      {children}
    </button>
  )
}

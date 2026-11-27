"use client"

import { useState, type FormEvent } from "react"
import { Megaphone, Send, Radio, Stamp, ScrollText, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Audience = "all" | "students" | "tutors"

const AUDIENCE_OPTIONS: Array<{ value: Audience; label: string; registry: string }> = [
  { value: "all", label: "All", registry: "Student + Tutor" },
  { value: "students", label: "Students", registry: "Student Registry" },
  { value: "tutors", label: "Tutors", registry: "Tutor Registry" },
]

const DISPATCH_REF = "ML-DSP-2026-0042"

const DISPATCH_STYLES = `
  .tp-root ::selection { background: #C9A25E; color: #10181A; }
  .tp-serif { font-family: Georgia, 'Times New Roman', Times, serif; }
  .tp-paper {
    background-color: #FCFAF2;
    background-image:
      radial-gradient(rgba(16,24,26,0.05) 1px, transparent 1px);
    background-size: 7px 7px;
  }
  .tp-canvas {
    background-color: #F1EDE2;
    background-image: radial-gradient(rgba(16,24,26,0.055) 1px, transparent 1px);
    background-size: 8px 8px;
  }
  .tp-lined {
    background-image:
      linear-gradient(transparent 0, transparent 27px, rgba(16,24,26,0.10) 28px);
    background-size: 100% 28px;
    background-position: 0 7px;
  }
  .tp-torn-edge {
    clip-path: polygon(
      0 0, 100% 0, 100% calc(100% - 8px),
      96% 100%, 92% calc(100% - 8px), 88% 100%, 84% calc(100% - 8px), 80% 100%,
      76% calc(100% - 8px), 72% 100%, 68% calc(100% - 8px), 64% 100%, 60% calc(100% - 8px), 56% 100%,
      52% calc(100% - 8px), 48% 100%, 44% calc(100% - 8px), 40% 100%, 36% calc(100% - 8px), 32% 100%,
      28% calc(100% - 8px), 24% 100%, 20% calc(100% - 8px), 16% 100%, 12% calc(100% - 8px), 8% 100%, 4% calc(100% - 8px), 0 100%
    );
  }
  @keyframes tp-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
  .tp-blink { animation: tp-blink 1.4s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .tp-blink { animation: none; }
  }
`

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<Audience>("all")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    const trimmedTitle = title.trim()
    const trimmedMessage = message.trim()

    if (!trimmedTitle || !trimmedMessage) {
      setSent(false)
      setError("A notice needs both a title and a message before it can be sealed.")
      return
    }

    setError("")
    setSent(false)
    setLoading(true)

    // Simulated dispatch — no API call.
    window.setTimeout(() => {
      setLoading(false)
      setTitle("")
      setMessage("")
      setAudience("all")
      setSent(true)
    }, 2000)
  }

  return (
    <div className="tp-root tp-canvas relative min-h-screen text-[#10181A]">
      <style>{DISPATCH_STYLES}</style>

      {/* ══ MASTHEAD — ink-black with champagne ══ */}
      <header className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#10181A] text-[#EDE8DA]">
        <div className="mx-auto max-w-275 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#C9A25E]">
              <Megaphone aria-hidden="true" className="size-3.5" strokeWidth={2} />
              [ THE TRUST OFFICE ]
            </p>
            <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#EDE8DA]/55">
              <span aria-hidden="true" className="tp-blink inline-block size-2 rounded-full bg-[#C9A25E]" />
              Transmission Line Open
            </span>
          </div>

          <h1 className="tp-serif mt-4 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            The Dispatch <span className="italic text-[#C9A25E]">Desk</span>.
          </h1>
          <p className="mt-3 max-w-2xl font-mono text-sm text-[#EDE8DA]/70">
            Wire a notice directly to the student and tutor registries.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#EDE8DA]/50">
            <span className="border border-[#C9A25E]/40 px-2 py-1 text-[#C9A25E]">Dispatch Ref · {DISPATCH_REF}</span>
            <span className="hidden border border-[#EDE8DA]/20 px-2 py-1 sm:inline">Registry · Admin Trust Office</span>
            <span className="hidden border border-[#EDE8DA]/20 px-2 py-1 md:inline">Class · Internal Broadcast</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-190 px-4 py-10 sm:px-6 lg:px-8">
        {/* ══ DISPATCH SLIP ══ */}
        <section className="tp-paper tp-torn-edge relative border border-[#10181A]/30 pb-8 shadow-[8px_10px_0_rgba(16,24,26,0.30)]">
          {/* postal stamp accent */}
          <Stamp
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-3 size-8 rotate-12 text-[#C9A25E]"
            strokeWidth={1.5}
          />

          <div className="flex items-center justify-between gap-3 border-b border-dashed border-[#10181A]/30 px-5 py-3">
            <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#10181A]/60">
              <ScrollText aria-hidden="true" className="size-3.5 text-[#C9A25E]" strokeWidth={2} />
              Registry Slip · Compose Broadcast
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#10181A]/45">No. {DISPATCH_REF}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6 px-5 py-6">
            {/* ── Title ── */}
            <div>
              <Label htmlFor="dispatch-title" className="mb-2 text-[#10181A]/65">
                Notification Title
              </Label>
              <Input
                id="dispatch-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Platform Maintenance"
                autoComplete="off"
                required
                aria-invalid={!!error}
                className={cn(
                  "tp-serif h-12 rounded-none border-0 border-b-2 border-dashed border-[#10181A]/35 bg-transparent px-0",
                  "text-lg font-bold tracking-tight text-[#10181A] placeholder:font-normal placeholder:text-[#10181A]/35",
                  "focus-visible:border-[#C9A25E] focus-visible:ring-0 focus-visible:ring-offset-0",
                  "dark:bg-transparent dark:text-[#10181A]"
                )}
              />
            </div>

            {/* ── Audience stamps ── */}
            <fieldset>
              <legend className="mb-3 block font-mono text-[10px] font-medium uppercase tracking-widest text-[#10181A]/65">
                Target Audience
              </legend>
              <div className="grid grid-cols-3 gap-3">
                {AUDIENCE_OPTIONS.map((opt) => {
                  const selected = audience === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setAudience(opt.value)}
                      className={cn(
                        "group flex flex-col items-center gap-1 border px-2 py-3 text-center transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFAF2]",
                        "motion-safe:hover:-translate-y-0.5 active:scale-[0.98]",
                        selected
                          ? "rotate-[-4deg] border-2 border-[#C9A25E] bg-[#C9A25E]/10 shadow-[3px_3px_0_#10181A]"
                          : "border-[#10181A]/25 bg-[#FCFAF2] hover:border-[#10181A]/55"
                      )}
                    >
                      <span className={cn("font-mono text-xs font-bold uppercase tracking-[0.2em]", selected ? "text-[#7A6A35]" : "text-[#10181A]")}>
                        {opt.label}
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#10181A]/50">{opt.registry}</span>
                      <span aria-hidden="true" className={cn("mt-0.5 font-mono text-[9px]", selected ? "text-[#C9A25E]" : "text-transparent")}>
                        ● SELECTED
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* ── Message (lined paper) ── */}
            <div>
              <Label htmlFor="dispatch-message" className="mb-2 text-[#10181A]/65">
                Message
              </Label>
              <Textarea
                id="dispatch-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the notice in full…"
                rows={7}
                required
                aria-invalid={!!error}
                className={cn(
                  "tp-lined min-h-45 resize-y rounded-none border border-[#10181A]/25 bg-[#FCFAF2] px-3 py-2 font-mono",
                  "leading-7 text-[#10181A] placeholder:text-[#10181A]/35",
                  "focus-visible:border-[#C9A25E] focus-visible:ring-1 focus-visible:ring-[#C9A25E]/30",
                  "dark:bg-[#FCFAF2] dark:text-[#10181A]"
                )}
              />
            </div>

            {/* ── Feedback ── */}
            {error && (
              <p role="alert" className="border-l-2 border-[#A34343] bg-[#A34343]/8 px-3 py-2 font-mono text-xs text-[#732626]">
                {error}
              </p>
            )}
            {sent && !error && (
              <p role="status" className="flex items-center gap-2 border-l-2 border-[#668B78] bg-[#668B78]/10 px-3 py-2 font-mono text-xs text-[#4A695C]">
                <ShieldCheck aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />
                Transmission recorded · notice queued for dispatch.
              </p>
            )}

            {/* ── Seal & Dispatch ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#10181A]/45">
                <Radio aria-hidden="true" className="size-3.5 text-[#C9A25E]" strokeWidth={2} />
                {loading ? "Transmitting on secure line…" : "Secure line ready"}
              </p>

              <Button
                type="submit"
                disabled={loading}
                aria-disabled={loading}
                className={cn(
                  "h-12 w-full rounded-sm border border-[#D8C9A3]/50 bg-[#10181A] px-6 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#EDE8DA]",
                  "shadow-[4px_4px_0_#C9A25E] transition-all duration-200 hover:bg-[#1c2a25] hover:shadow-[6px_6px_0_#C9A25E]",
                  "motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0_#C9A25E]",
                  "disabled:opacity-70 disabled:pointer-events-none sm:w-auto"
                )}
              >
                <Send aria-hidden="true" className="size-4" strokeWidth={2} />
                {loading ? "Dispatching..." : "Seal & Dispatch"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

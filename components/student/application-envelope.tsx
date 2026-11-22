"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDate, formatFee } from "@/lib/adapters"
import type { Application, ApplicationStatus } from "@/lib/api-types"
import {
  ChevronRight,
  ArrowRight,
  Feather,
  Phone,
  Mail,
  CalendarDays,
  Wallet,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react"

export type AppStatus = ApplicationStatus

export const STATUS_META: Record<
  AppStatus,
  { label: string; sub: string; Icon: typeof Hourglass }
> = {
  pending: { label: "Pending", sub: "Sealed", Icon: Hourglass },
  accepted: { label: "Accepted", sub: "Seal broken", Icon: CheckCircle2 },
  rejected: { label: "Declined", sub: "Returned", Icon: XCircle },
}

export function applicationRef(application: Application): string {
  return `#AP-${application._id.slice(-4).toUpperCase()}`
}

export function applicationReply(application: Application): string {
  if (application.status === "accepted") {
    return "The tutor accepted this application. Your seat is confirmed."
  }
  if (application.status === "rejected") {
    return "The tutor declined this application. You can apply to another tuition."
  }
  return "Awaiting the tutor's reply."
}

export function PostageStamp({ status }: { status: AppStatus }) {
  const meta = STATUS_META[status]
  const tone =
    status === "accepted"
      ? "border-[#668B78] text-[#4A695C] bg-[#668B78]/10"
      : status === "pending"
        ? "border-[#B87959] text-[#B87959] bg-[#B87959]/10"
        : "border-[#344C43]/50 text-[#344C43]/60 bg-[#344C43]/5"

  return (
    <div
      className={cn(
        "postroom-stamp relative flex w-24 rotate-[-12deg] flex-col items-center border-2 border-dashed px-2 py-2.5 sm:w-28",
        tone
      )}
      style={{ "--stamp-delay": "0.15s" } as React.CSSProperties}
      aria-label={`Status: ${meta.label}`}
    >
      <meta.Icon aria-hidden="true" className="size-5 sm:size-6" strokeWidth={1.75} />
      <span className="mt-1 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.24em] sm:text-[10px]">
        {meta.label}
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase leading-none tracking-[0.2em] opacity-75">
        {meta.sub}
      </span>
    </div>
  )
}

export function Postmark({ date }: { date: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-16 top-1/2 hidden size-24 -translate-y-1/2 rotate-[-16deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#344C43]/35 text-center md:flex"
    >
      <span className="font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/50">
        Dhaka Post
        <br />
        {date}
      </span>
    </div>
  )
}

export function Envelope({
  app,
  expanded,
  onToggle,
  onWithdraw,
  withdrawing,
}: {
  app: Application
  expanded: boolean
  onToggle: () => void
  onWithdraw: () => void
  withdrawing: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const meta = STATUS_META[app.status]
  const ref = applicationRef(app)
  const applied = formatDate(app.appliedAt)
  const panelId = `panel-${app._id}`

  return (
    <article
      className="group relative border border-[#344C43]/30 bg-[#EFE7DC] shadow-[4px_5px_0_rgba(52,76,67,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#344C43]/55 hover:shadow-[6px_8px_0_rgba(52,76,67,0.18)]"
      aria-label={`Application ${ref} — ${app.tuitionTitle}, ${meta.label}`}
    >
      <Postmark date={applied} />

      <div className="grid grid-cols-[3.25rem_1fr_auto] items-stretch sm:grid-cols-[4.5rem_1fr_auto]">
        <div className="flex flex-col items-center justify-center gap-1 border-r border-dashed border-[#344C43]/30 px-1 py-4">
          <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#344C43]/70 sm:text-[10px]">
            {ref.replace("#", "")}
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-[#B87959]" />
          <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-[#344C43]/45 sm:text-[10px]">
            {applied}
          </span>
        </div>

        <div className="min-w-0 px-3 py-4 sm:px-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#344C43]/45 sm:text-[10px]">
            To the Desk of — {app.subject}
          </p>
          <h3 className="postroom-serif mt-1 truncate text-base font-black leading-tight tracking-tight text-[#344C43] sm:text-lg">
            {app.tuitionTitle}
          </h3>
          <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.18em] text-[#B87959] sm:text-[10px]">
            {app.tutorEmail}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#344C43]/60 sm:text-[10px]">
            <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />{app.preferredSchedule}</span>
            <span className="inline-flex items-center gap-1.5"><Wallet aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} /><span className="font-bold text-[#344C43]">{formatFee(app.monthlyFee)}<span className="font-normal opacity-70"> / mo</span></span></span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 border-l border-dashed border-[#344C43]/30 px-2 py-3 sm:px-5">
          <PostageStamp status={app.status} />
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#344C43]/60 underline decoration-[#B87959]/50 decoration-2 underline-offset-4 transition-colors hover:text-[#B87959] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] sm:text-[10px]"
          >
            {expanded ? "Close" : "Details"}
            <ChevronRight aria-hidden="true" className={cn("size-3 transition-transform duration-200", expanded && "rotate-90")} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {expanded && (
        <div
          id={panelId}
          className="grid gap-4 border-t border-dashed border-[#344C43]/30 bg-[#F2ECDF]/70 px-4 py-4 sm:grid-cols-3 sm:gap-6 sm:px-6"
        >
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#B87959]">
              <Feather aria-hidden="true" className="size-3" strokeWidth={2} />
              Your Envelope
            </p>
            <p className="postroom-serif mt-1.5 text-[12px] italic leading-snug text-[#344C43]/90">
              “{app.studentNote?.trim() || "No note was attached to this letter."}”
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#668B78]">
              <Mail aria-hidden="true" className="size-3" strokeWidth={2} />
              The Reply
            </p>
            <p className="postroom-serif mt-1.5 text-[12px] italic leading-snug text-[#344C43]/90">
              {applicationReply(app)}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/50">
              <Phone aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />
              {app.studentPhone}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 border-t border-[#344C43]/15 pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#344C43]/55">
              Actions
            </p>
            <Link
              href={`/tuitions/${app.tuitionId}`}
              className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#344C43] underline decoration-[#668B78] decoration-2 underline-offset-4 transition-colors hover:text-[#4A695C]"
            >
              View tuition
              <ArrowRight aria-hidden="true" className="size-3" strokeWidth={2.5} />
            </Link>

            {app.status === "pending" ? (
              confirming ? (
                <div className="w-full border border-[#A34343]/40 bg-[#A34343]/5 p-2">
                  <p className="font-mono text-[9px] font-bold uppercase leading-snug tracking-[0.18em] text-[#A34343]">
                    Tear up this letter?
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      disabled={withdrawing}
                      onClick={() => {
                        onWithdraw()
                        setConfirming(false)
                      }}
                      className="h-7 rounded-sm border border-[#A34343]/50 bg-[#A34343] px-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#EFE7DC] hover:bg-[#8f3838]"
                    >
                      {withdrawing ? "Tearing…" : "Yes, tear it"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={withdrawing}
                      onClick={() => setConfirming(false)}
                      className="h-7 rounded-sm px-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#344C43]/70 hover:text-[#344C43]"
                    >
                      Keep
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={withdrawing}
                  onClick={() => setConfirming(true)}
                  className="h-auto px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#A34343] hover:bg-[#A34343]/10"
                >
                  Withdraw
                </Button>
              )
            ) : (
              <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/50">
                {app.status === "accepted" ? "Enrolled — see your Almanac" : "Returned — but the ledger remembers"}
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
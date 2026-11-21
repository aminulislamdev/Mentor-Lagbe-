"use client"

// Shared building blocks for the tutor studio pages (overview, my-tuitions,
// applicants, post-tuition). One definition keeps the three pages identical
// instead of copying the same CSS and panel markup into each file.

import * as React from "react"
import { cn } from "@/lib/utils"

export const studioStyles = `
  .studio-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .studio-root ::selection { background: #B87959; color: #1E3A2F; }

  @keyframes studio-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .studio-rise { animation: studio-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes studio-glow-pulse {
    0%, 100% { box-shadow: 0 0 22px 0 rgba(201, 139, 109, 0.3); }
    50%      { box-shadow: 0 0 34px 4px rgba(201, 139, 109, 0.48); }
  }
  .studio-cta-glow { animation: studio-glow-pulse 4.5s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .studio-rise, .studio-cta-glow { animation: none !important; }
  }
`

/** Folder-tab panel used across the studio pages. */
export function StudioBoard({
  tab,
  note,
  children,
  className,
}: {
  tab: string
  note?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "relative border border-[#344C43]/25 bg-[#EFE7DC] shadow-[5px_6px_0_rgba(52,76,67,0.13)]",
        className
      )}
    >
      <span className="absolute -top-[13px] left-4 inline-flex h-[26px] items-center border border-[#344C43] bg-[#344C43] px-3 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#EFE7DC]">
        {tab}
      </span>
      {note && (
        <p className="absolute -top-[11px] right-4 hidden max-w-[45%] truncate font-mono text-[9px] uppercase tracking-[0.24em] text-[#344C43]/55 sm:block">
          {note}
        </p>
      )}
      <div className="p-4 pt-6 sm:p-5 sm:pt-6">{children}</div>
    </section>
  )
}

/** Square KPI card with a mono label, serif value and a one-line hint. */
export function Kpi({
  label,
  value,
  hint,
  Icon,
}: {
  label: string
  value: React.ReactNode
  hint: string
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}) {
  return (
    <div className="relative border border-[#344C43]/25 bg-[#EFE7DC] p-4 shadow-[4px_5px_0_rgba(52,76,67,0.12)]">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#344C43]/60">
          {label}
        </p>
        <Icon aria-hidden="true" className="size-4 shrink-0 text-[#B87959]" strokeWidth={1.75} />
      </div>
      <p className="studio-serif mt-2 text-4xl font-black leading-none tracking-tight text-[#344C43]">
        {value}
      </p>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/50">{hint}</p>
    </div>
  )
}

/** Small inline notice used for errors and plan limits. */
export function StudioNotice({
  tone,
  title,
  children,
  action,
}: {
  tone: "error" | "warning"
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
}) {
  const isError = tone === "error"

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-3 border p-4 sm:flex-row sm:items-center",
        isError ? "border-[#A34343]/35 bg-[#A34343]/8" : "border-[#B87959]/45 bg-[#B87959]/10"
      )}
    >
      <div>
        <p
          className={cn(
            "font-mono text-[10px] font-bold uppercase tracking-[0.24em]",
            isError ? "text-[#A34343]" : "text-[#B87959]"
          )}
        >
          {title}
        </p>
        {children && <p className="mt-1 text-xs text-[#344C43]/70">{children}</p>}
      </div>
      {action}
    </div>
  )
}

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DashboardSectionProps {
  id?: string
  numeral: string
  title: string
  subtitle?: string
  /** `profile` (identity desk) or `settings` (tutor settings). */
  variant?: "profile" | "settings"
  className?: string
}

export function DashboardSection({
  id,
  numeral,
  title,
  subtitle,
  variant = "profile",
  className,
}: DashboardSectionProps) {
  if (variant === "settings") {
    return (
      <div className={cn("flex flex-wrap items-baseline justify-between gap-3 border-b border-[#344C43]/20 pb-3", className)}>
        <h2 id={id} className="flex items-baseline gap-3">
          <span aria-hidden="true" className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#B87959]">
            {numeral}
          </span>
          <span className="settings-serif text-2xl font-black tracking-tight text-[#344C43] sm:text-3xl">
            {title}
          </span>
        </h2>
        {subtitle && (
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#344C43]/55">{subtitle}</p>
        )}
      </div>
    )
  }

  return (
    <h2
      id={id}
      className={cn(
        "flex items-baseline justify-between gap-3 border-b border-[#344C43]/20 pb-2",
        className
      )}
    >
      <span className="flex items-baseline gap-3">
        <span aria-hidden="true" className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#B87959]">
          {numeral}
        </span>
        <span className="identity-serif text-2xl font-black tracking-tight text-[#344C43]">
          {title}
        </span>
      </span>
      {subtitle && (
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#344C43]/55">{subtitle}</span>
      )}
    </h2>
  )
}
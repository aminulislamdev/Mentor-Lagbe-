import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingStateProps {
  /** Mono status text shown under the spinner. */
  message?: string
  /** `warm` (pine on cream) or `ink` (gold on dark). */
  tone?: "warm" | "ink"
  /** Vertical padding class, e.g. "py-20" or "py-12". */
  className?: string
}

export function LoadingState({
  message = "Loading…",
  tone = "warm",
  className,
}: LoadingStateProps) {
  const dark = tone === "ink"
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <div className="text-center">
        <div
          className={cn(
            "mx-auto h-8 w-8 rounded-full border-2 animate-spin",
            dark
              ? "border-[#D8C9A3]/30 border-t-[#C9A25E]"
              : "border-[#344C43]/30 border-t-[#B87959]"
          )}
        />
        <p
          className={cn(
            "mt-3 font-mono text-[10px] uppercase tracking-[0.2em]",
            dark ? "text-[#D8C9A3]/60" : "text-[#344C43]/60"
          )}
        >
          {message}
        </p>
      </div>
    </div>
  )
}
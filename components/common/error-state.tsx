import * as React from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ErrorStateProps {
  /** Main error title. */
  title?: string
  /** Error detail message. */
  message?: string
  /** Retry callback. */
  onRetry?: () => void
  /** `warm` (pine) or `ink` (gold on dark). */
  tone?: "warm" | "ink"
  /** Vertical padding class. */
  className?: string
}

export function ErrorState({
  title = "The desk could not be opened.",
  message,
  onRetry,
  tone = "warm",
  className,
}: ErrorStateProps) {
  const dark = tone === "ink"
  return (
    <div
      className={cn(
        "flex items-center justify-center py-20",
        className
      )}
    >
      <div className="text-center">
        <p
          className={cn(
            "font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
            dark ? "text-[#A34343]" : "text-[#A34343]"
          )}
        >
          {title}
        </p>
        {message && (
          <p
            className={cn(
              "mt-1 font-mono text-[9px] uppercase tracking-[0.18em]",
              dark ? "text-[#F2EDDF]/50" : "text-[#344C43]/60"
            )}
          >
            {message}
          </p>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "mt-3 inline-flex h-9 items-center rounded-sm border px-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-all hover:bg-opacity-10",
              dark
                ? "border-[#C9A25E]/50 bg-transparent text-[#C9A25E] hover:bg-[#C9A25E]/10"
                : "border-[#344C43] bg-[#344C43] text-[#F2EDDF] hover:bg-[#2A3E36]"
            )}
          >
            <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5" strokeWidth={2} />
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
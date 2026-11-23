"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("App error boundary caught:", error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[70vh] px-4 py-20 text-center">
      <div className="size-16 sm:size-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-sm mb-6">
        <AlertTriangle className="size-8 sm:size-10" />
      </div>

      <span className="font-mono text-sm sm:text-base uppercase tracking-widest text-destructive font-bold">
        Diagnostics Alert
      </span>

      <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-2 mb-4 leading-tight">
        Unexpected Execution Exception
      </h1>

      <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
        We encountered a temporary disruption while processing this request. Your data remains safe.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-sm sm:text-base font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="size-5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground text-sm sm:text-base font-semibold shadow-2xs transition-colors"
        >
          <Home className="size-5 text-primary" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}
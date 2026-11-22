import * as React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  label: string
  value: React.ReactNode
  delta?: string
  dir?: "up" | "down"
  note?: string
  className?: string
}

export function StatCard({ label, value, delta, dir = "up", note, className }: StatCardProps) {
  return (
    <div className={cn("flex flex-col gap-1 px-4 py-4 text-center sm:py-5", className)}>
      <p className="font-mono text-[9px] font-bold uppercase leading-snug tracking-[0.18em] text-[#D8C9A3]/75">
        {label}
      </p>
      <p className="terminal-serif text-2xl font-black leading-none tracking-tight text-[#F2EDDF] sm:text-3xl">
        {value}
      </p>
      {(delta || note) && (
        <p className="flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#F2EDDF]/50">
          {dir === "up" ? (
            <ArrowUpRight aria-hidden="true" className="size-3 text-[#7AA890]" strokeWidth={2.5} />
          ) : (
            <ArrowDownRight aria-hidden="true" className="size-3 text-[#C98B6D]" strokeWidth={2.5} />
          )}
          {delta && <span className={dir === "up" ? "text-[#9DBFA9]" : "text-[#E0A57E]"}>{delta}</span>}
          {note && <span className="hidden xl:inline">· {note}</span>}
        </p>
      )}
    </div>
  )
}
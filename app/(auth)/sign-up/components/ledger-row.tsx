import * as React from "react"
import { cn } from "@/lib/utils"

export const underlineInput =
  "h-12 rounded-none border-0 border-b-2 border-[#344C43]/25 bg-transparent px-0 text-base text-[#344C43] placeholder:text-[#344C43]/30 shadow-none transition-colors focus:border-[#B87959] focus:bg-[#EFE7DC]/70 focus:ring-0 dark:border-[#EFE7DC]/20 dark:text-[#EFE7DC] dark:placeholder:text-[#EFE7DC]/25 dark:focus:border-[#C98B6D] dark:focus:bg-[#EFE7DC]/5 sm:text-lg"

export function LedgerRow({
  index,
  children,
  className,
}: {
  index: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[2rem_1fr] sm:grid-cols-[2.5rem_1fr] gap-x-4 sm:gap-x-5 border-t border-[#344C43]/20 py-5 dark:border-[#EFE7DC]/12",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pt-6 font-mono text-xs sm:text-sm font-medium tracking-widest text-[#B87959]"
      >
        {index}
      </span>
      <div>{children}</div>
    </div>
  )
}
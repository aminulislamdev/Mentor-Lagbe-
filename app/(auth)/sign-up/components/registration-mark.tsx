import { cn } from "@/lib/utils"

export function RegistrationMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none font-mono text-xl leading-none text-[#344C43]/30 dark:text-[#EFE7DC]/20",
        className
      )}
    >
      +
    </span>
  )
}
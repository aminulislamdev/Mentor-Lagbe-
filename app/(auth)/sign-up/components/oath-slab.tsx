import { GraduationCap, Presentation } from "lucide-react"
import { cn } from "@/lib/utils"
import { OATHS, type Role } from "./oaths"
import { ChosenStamp } from "./chosen-stamp"

export function OathSlab({
  role,
  selected,
  onSelect,
}: {
  role: Role
  selected: boolean
  onSelect: (r: Role) => void
}) {
  const data = OATHS[role]
  const Icon = role === "student" ? GraduationCap : Presentation

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(role)}
      className={cn(
        "group relative flex flex-col overflow-visible rounded-sm border p-6 sm:p-7 text-left transition-all duration-300 ease-out",
        "focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#344C43] dark:focus-visible:outline-[#EFE7DC]",
        selected
          ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[10px_10px_0_0_#B87959] -translate-y-1"
          : "border-[#344C43]/30 bg-[#EFE7DC]/70 text-[#344C43] shadow-[0_0_0_0_rgba(0,0,0,0)] hover:-translate-y-1.5 hover:border-[#344C43]/60 hover:bg-[#EFE7DC] hover:shadow-[8px_8px_0_0_rgba(52,76,67,0.28)]"
      )}
    >
      {selected && <ChosenStamp />}

      <span
        aria-hidden="true"
        className={cn(
          "charter-serif pointer-events-none absolute right-4 top-2 select-none text-8xl sm:text-9xl font-black leading-none transition-colors duration-300",
          selected ? "text-[#EFE7DC]/10" : "text-[#344C43]/8"
        )}
      >
        {data.oath}
      </span>

      <span
        className={cn(
          "font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em]",
          selected ? "text-[#B87959]" : "text-[#B87959]"
        )}
      >
        {data.kicker}
      </span>

      <span className="mt-5 flex items-end gap-4">
        <span
          className={cn(
            "flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            selected
              ? "border-[#668B78]/50 bg-[#668B78]/20 text-[#9DBFA9]"
              : "border-[#344C43]/25 bg-[#D9CBB5]/60 text-[#344C43] group-hover:border-[#668B78]/60 group-hover:text-[#4A695C]"
          )}
        >
          <Icon className="size-7 sm:size-8" strokeWidth={1.5} />
        </span>
        <span
          className={cn(
            "charter-serif text-[1.8rem] sm:text-3xl md:text-4xl font-black leading-[1.05] tracking-tight",
            selected ? "text-[#EFE7DC]" : "text-[#344C43]"
          )}
        >
          {data.headline}
        </span>
      </span>

      <ul className="mt-6 space-y-2">
        {data.clauses.map((clause) => (
          <li
            key={clause}
            className={cn(
              "flex items-baseline gap-2 font-mono text-[11px] sm:text-xs leading-snug",
              selected ? "text-[#EFE7DC]/75" : "text-[#344C43]/70"
            )}
          >
            <span className="text-[#B87959]">§</span>
            <span>{clause}</span>
          </li>
        ))}
      </ul>

      <span
        className={cn(
          "mt-6 border-t pt-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em]",
          selected
            ? "border-[#EFE7DC]/15 text-[#EFE7DC]/50"
            : "border-[#344C43]/15 text-[#344C43]/50"
        )}
      >
        {data.footer}
      </span>
    </button>
  )
}
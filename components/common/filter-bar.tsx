import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  placeholder?: string
  searchId?: string
  className?: string
  inputClassName?: string
  children?: React.ReactNode
}

export function FilterBar({
  searchValue,
  onSearchChange,
  placeholder = "Search…",
  searchId,
  className,
  inputClassName,
  children,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {onSearchChange !== undefined && (
        <label className="relative min-w-[12rem] flex-1">
          <span className="sr-only">Search</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45"
            strokeWidth={1.75}
          />
          <Input
            id={searchId}
            type="text"
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className={cn("h-9 rounded-sm pl-9 text-[12px]", inputClassName)}
          />
        </label>
      )}
      {children}
    </div>
  )
}
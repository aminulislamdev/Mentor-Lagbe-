"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "cn"

export interface CheckboxProps {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  className?: string
  label?: React.ReactNode
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({
  id,
  checked,
  defaultChecked = false,
  disabled,
  className,
  label,
  onCheckedChange,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  const handleToggle = () => {
    if (disabled) return
    const next = !isChecked
    if (!isControlled) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-2.5 cursor-pointer select-none group",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div className="relative mt-0.5 shrink-0">
        {/* Hidden native input for accessibility */}
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          disabled={disabled}
          onChange={handleToggle}
          className="sr-only"
        />
        {/* Visual box */}
        <div
          onClick={handleToggle}
          className={cn(
            "size-4 rounded flex items-center justify-center transition-all duration-150",
            "border",
            isChecked
              ? "bg-[#668B78] border-[#668B78] dark:bg-[#7AA890] dark:border-[#7AA890]"
              : "bg-[#EFE7DC] border-[rgba(52,76,67,0.30)] dark:bg-[#1E2E29] dark:border-[rgba(122,168,144,0.25)]",
            "group-focus-within:ring-2 group-focus-within:ring-[#668B78]/30",
            className
          )}
        >
          <Check
            className={cn(
              "size-2.5 stroke-[3] text-white dark:text-[#1A2823] transition-all duration-150",
              isChecked ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
            strokeWidth={3}
          />
        </div>
      </div>
      {label && (
        <span className="text-sm text-[#344C43]/75 dark:text-[#E8DFD0]/60 leading-snug">
          {label}
        </span>
      )}
    </label>
  )
}

export { Checkbox }

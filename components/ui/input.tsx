import * as React from "react"
import { cn } from "cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

function Input({ className, type, hasError, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base structure
        "flex h-10 w-full rounded-md px-3 py-2 text-sm transition-all outline-none",
        // Background & border — brand surface
        "bg-[#EFE7DC] border border-[rgba(52,76,67,0.20)]",
        // Text
        "text-[#344C43] placeholder:text-[#344C43]/40",
        // Dark mode
        "dark:bg-[#1E2E29] dark:border-[rgba(122,168,144,0.20)] dark:text-[#E8DFD0] dark:placeholder:text-[#E8DFD0]/30",
        // Focus
        "focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20",
        "dark:focus:border-[#7AA890] dark:focus:ring-[#7AA890]/20",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Error state
        hasError && "border-[#A34343] focus:border-[#A34343] focus:ring-[#A34343]/20",
        // File input reset
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }

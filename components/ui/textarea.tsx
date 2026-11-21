import * as React from "react"
import { cn } from "cn"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

function Textarea({ className, hasError, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full resize-y rounded-md px-3 py-2 text-sm transition-all outline-none",
        "bg-[#EFE7DC] border border-[rgba(52,76,67,0.20)]",
        "text-[#344C43] placeholder:text-[#344C43]/40",
        "dark:bg-[#1E2E29] dark:border-[rgba(122,168,144,0.20)] dark:text-[#E8DFD0] dark:placeholder:text-[#E8DFD0]/30",
        "focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20",
        "dark:focus:border-[#7AA890] dark:focus:ring-[#7AA890]/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-[#A34343] focus:border-[#A34343] focus:ring-[#A34343]/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

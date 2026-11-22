import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const wellField =
  "h-11 w-full rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] px-3 text-[13px] text-[#344C43] outline-none transition-all placeholder:text-[#344C43]/35 hover:border-[#344C43]/45 focus:border-[#668B78] focus:bg-[#EFE7DC] focus:ring-2 focus:ring-[#668B78]/20"

const fieldLabel = "font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60"

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  htmlFor: string
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  inputClassName?: string
}

export function FormField({
  label,
  htmlFor,
  icon: Icon,
  inputClassName,
  className,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className={cn(fieldLabel, "mb-1.5 block")}>
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#668B78]"
            strokeWidth={1.75}
          />
        )}
        <Input
          id={htmlFor}
          className={cn(wellField, Icon && "pl-9", inputClassName)}
          {...inputProps}
        />
      </div>
    </div>
  )
}
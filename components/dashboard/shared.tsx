/**
 * MentorLagbe — Shared Dashboard Components
 * ─────────────────────────────────────────────────────────────
 * One file, seven small components. Read top to bottom.
 *
 * Components:
 *   IndexPanel   — ink-black terminal frame with champagne tab header (admin family)
 *   StatusChip   — small bordered status pill with sage / terracotta / rose / pine / gold tones
 *   Monogram     — circular initials avatar, five sizes
 *   EmptyState   — dashed "nothing here" frame with icon, title, copy and an action
 *   Colophon     — page-footer strip: back-link + mono note (used in every dashboard page)
 *   StickyRail   — `lg:sticky lg:top-[136px]` wrapper for right-hand proof/selection sheets
 *   CopyField    — copy-to-clipboard value row (keyboard-accessible, check feedback)
 *
 * Conventions:
 *   • No page-specific strings, data or business logic in this file.
 *   • Styling is copied from the best existing implementations — do not eyeball it, keep it identical.
 *   • If you need a new tone, add it here; do not fork the component.
 *   • If a component grows beyond ~60 lines or needs data-fetching, move it to its own page file.
 */

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── IndexPanel ──────────────────────────────────────────────────────────────
// Used by the admin "Trust Office" pages. Replaces the identical
// `TerminalPanel` copies that previously lived in admin/page.tsx,
// admin/tuitions/page.tsx and admin/users/page.tsx.

export interface IndexPanelProps {
  /** Small ALL-CAPS tab title, e.g. "THE MEMBER INDEX" */
  tab: string
  /** Optional right-hand mono note, hidden below `sm` */
  meta?: string
  children: React.ReactNode
  className?: string
}

export function IndexPanel({ tab, meta, children, className }: IndexPanelProps) {
  return (
    <section
      className={cn(
        "border border-[#10181A]/30 bg-[#FCFAF2] shadow-[5px_6px_0_rgba(16,24,26,0.16)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#10181A] bg-[#10181A] px-3 py-1.5">
        <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]">
          {tab}
        </h2>
        {meta && (
          <p className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-[#FCFAF2]/45 sm:block">
            {meta}
          </p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

// ─── StatusChip ──────────────────────────────────────────────────────────────
// Border + tinted background pill used for approval states, applicant verdicts,
// role badges and plan labels. Pass `icon` for a leading glyph.

export type StatusTone = "sage" | "terracotta" | "rose" | "pine" | "gold"

export interface StatusChipProps {
  tone: StatusTone
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
  className?: string
}

const TONE_STYLES: Record<StatusTone, string> = {
  sage: "border-[#668B78]/55 bg-[#668B78]/10 text-[#4A695C]",
  terracotta: "border-[#B87959]/55 bg-[#B87959]/10 text-[#B87959]",
  rose: "border-[#A34343]/45 bg-[#A34343]/10 text-[#A34343]",
  pine: "border-[#10181A]/45 bg-[#10181A]/5 text-[#10181A]/70",
  gold: "border-[#C9A25E]/60 bg-[#C9A25E]/20 text-[#7A6A35]",
}

export function StatusChip({ tone, icon: Icon, children, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em]",
        TONE_STYLES[tone],
        className
      )}
    >
      {Icon && <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />}
      {children}
    </span>
  )
}

// ─── Monogram ────────────────────────────────────────────────────────────────
// Circular initials avatar. Sizes: sm (7), md (9), lg (11), xl (14), 2xl (16).

export type MonogramSize = "sm" | "md" | "lg" | "xl" | "2xl"

export interface MonogramProps {
  initials: string
  size?: MonogramSize
  className?: string
}

const SIZE_STYLES: Record<MonogramSize, string> = {
  sm: "size-7 text-[8px]",
  md: "size-9 text-[9px]",
  lg: "size-11 text-[10px]",
  xl: "size-14 text-[13px]",
  "2xl": "size-16 text-lg",
}

export function Monogram({ initials, size = "lg", className }: MonogramProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-[#C9A25E]/60 bg-[#10181A] font-mono font-bold text-[#D8C9A3] transition-colors",
        SIZE_STYLES[size],
        className
      )}
    >
      {initials}
    </span>
  )
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
// Dashed frame with icon, serif headline, mono explanation and one action.
// `tone` switches between the warm paper pages (cream fill) and the ink
// terminal panels (dark fill).

export interface EmptyStateProps {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: React.ReactNode
  description: React.ReactNode
  actionLabel: string
  onAction: () => void
  tone?: "paper" | "terminal"
  className?: string
}

export function EmptyState({ Icon, title, description, actionLabel, onAction, tone = "paper", className }: EmptyStateProps) {
  const dark = tone === "terminal"
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center gap-3 border border-dashed px-6 py-12 text-center",
        dark
          ? "border-[#D8C9A3]/30 bg-[#1E2A24]/60 text-[#F2EDDF]"
          : "border-[#344C43]/30 bg-[#EFE7DC]/50 text-[#344C43]",
        className
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-11", dark ? "text-[#C9A25E]" : "text-[#B87959]")}
        strokeWidth={1.5}
      />
      <p
        className="text-2xl font-black tracking-tight sm:text-3xl"
        style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
      >
        <span className={dark ? "text-[#F2EDDF]" : "text-[#344C43]"}>
          {title}
        </span>
      </p>
      <p className={cn(
        "max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em]",
        dark ? "text-[#F2EDDF]/60" : "text-[#344C43]/60"
      )}>
        {description}
      </p>
      <button
        type="button"
        onClick={onAction}
        className={cn(
          "mt-1 h-11 rounded-sm border px-5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A]",
          dark
            ? "border-[#D8C9A3]/55 bg-[#D8C9A3] text-[#10181A] hover:bg-[#EDE8DA]"
            : "border-[#10181A] bg-[#10181A] text-[#D8C9A3] hover:bg-[#1E2A24]"
        )}
      >
        {actionLabel}
      </button>
    </div>
  )
}

// ─── Colophon ────────────────────────────────────────────────────────────────
// Shared dashboard-page footer: back-link on the left, mono note on the right.

export interface ColophonProps {
  backHref: string
  backLabel: string
  children?: React.ReactNode
  className?: string
  /** `warm` (tutor/student dashboards) or `ink` (admin trust-office) */
  tone?: "warm" | "ink"
}

export function Colophon({ backHref, backLabel, children, className, tone = "warm" }: ColophonProps) {
  const dark = tone === "ink"
  return (
    <footer
      className={cn(
        "mt-6 flex flex-col items-start justify-between gap-3 border-t-2 pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.24em] sm:flex-row sm:items-center sm:text-[10px]",
        dark ? "border-[#10181A] text-[#10181A]/60" : "border-[#344C43] text-[#344C43]/60",
        className
      )}
    >
      <Link
        href={backHref}
        className={cn(
          "group inline-flex items-center gap-1.5 font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          dark ? "text-[#10181A] hover:text-[#B87959] hover:outline-[#10181A] focus-visible:outline-[#10181A]" : "text-[#344C43] hover:text-[#B87959] focus-visible:outline-[#344C43]"
        )}
      >
        <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.5} />
        {backLabel}
      </Link>
      <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1">
        {children}
      </div>
    </footer>
  )
}

// ─── StickyRail ──────────────────────────────────────────────────────────────
// Right-hand sheet wrapper with the shared sticky offset used across dashboards.

export function StickyRail({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <aside className={cn("lg:sticky lg:top-[136px]", className)}>
      {children}
    </aside>
  )
}

// ─── CopyField ───────────────────────────────────────────────────────────────
// Copy-to-clipboard value row with check feedback. Used on payment screens;
// keep the value short (transaction IDs, invoice numbers).

export interface CopyFieldProps {
  value: string
  label: string
  className?: string
}

export function CopyField({ value, label, className }: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard unavailable — still show feedback; user can select the text.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className={cn(
        "group flex w-full items-center justify-between gap-3 border border-[#C9A25E]/35 bg-[#10181A]/60 px-3 py-2 text-left transition-all hover:border-[#C9A25E]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]",
        className
      )}
    >
      <span className="truncate font-mono text-[11px] font-bold tracking-tight text-[#D8C9A3]">
        {value}
      </span>
      {copied ? (
        <Check aria-hidden="true" className="size-4 shrink-0 text-[#9DBFA9]" strokeWidth={2.5} />
      ) : (
        <Copy aria-hidden="true" className="size-4 shrink-0 text-[#C9A25E]/70 transition-all group-hover:text-[#C9A25E]" strokeWidth={1.75} />
      )}
    </button>
  )
}

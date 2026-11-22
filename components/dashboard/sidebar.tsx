"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, LogOut, Sparkles, X } from "lucide-react"
import { ROLE_CONFIG, type DashboardIdentity, type DashboardRole } from "@/components/dashboard/nav-config"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  role: DashboardRole
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
  identity?: DashboardIdentity
}

// ─── Shared nav renderer ─────────────────────────────────────────────────────

function NavItems({
  role,
  collapsed,
  onNavigate,
}: {
  role: DashboardRole
  collapsed: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const cfg = ROLE_CONFIG[role]

  const bestHref = [...cfg.nav]
    .filter(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <ul className="space-y-1">
      {cfg.nav.map((item, i) => {
        const Icon = item.icon
        if (item.soon) {
          return (
            <li key={item.href}>
              <span
                aria-disabled="true"
                title={collapsed ? `${item.label} — coming soon` : "Coming soon — the page is not built yet"}
                className="group relative flex h-11 cursor-not-allowed items-center gap-3 rounded-sm border-l-2 border-transparent px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EFE7DC]/28"
              >
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-[18px] shrink-0 text-[#EFE7DC]/22" />
                {!collapsed && (
                  <>
                    <span className="min-w-0 truncate">{item.label}</span>
                    <span className="ml-auto inline-flex items-center rounded-sm border border-[#C98B6D]/40 bg-[#C98B6D]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#C98B6D]/85">
                      Soon
                    </span>
                  </>
                )}
              </span>
            </li>
          )
        }
        const active = item.href === bestHref
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex h-11 items-center gap-3 rounded-sm border-l-2 border-transparent px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]",
                collapsed && "justify-center px-0",
                active
                  ? "border-[#B87959] bg-[#EFE7DC]/10 text-[#EFE7DC]"
                  : "text-[#EFE7DC]/55 hover:bg-[#EFE7DC]/5 hover:text-[#EFE7DC]"
              )}
            >
              <Icon
                aria-hidden="true"
                strokeWidth={1.75}
                className={cn(
                  "size-[18px] shrink-0 transition-colors duration-200",
                  active ? "text-[#C98B6D]" : "text-[#7AA890]/70 group-hover:text-[#9DBFA9]"
                )}
              />
              {!collapsed && (
                <>
                  <span className="min-w-0 truncate">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ml-auto text-[10px] tabular-nums transition-colors",
                      active ? "text-[#C98B6D]/80" : "text-[#EFE7DC]/22 group-hover:text-[#EFE7DC]/40"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Brand block ─────────────────────────────────────────────────────────────

function BrandBlock({ collapsed, role }: { collapsed: boolean; role: DashboardRole }) {
  const cfg = ROLE_CONFIG[role]
  return (
    <div className={cn("flex items-center gap-3 border-b border-[#EFE7DC]/10 px-5 py-5", collapsed && "justify-center px-2")}>
      <Link
        href="/"
        className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98B6D] rounded-sm"
        aria-label="MentorLagbe home"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-[#7AA890]/30 bg-[#243630] transition-colors group-hover:border-[#C98B6D]/50">
          <Compass aria-hidden="true" className="size-5 text-[#9DBFA9] transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
        </span>
        {!collapsed && (
          <span className="flex min-w-0 flex-col">
            <span className="font-heading text-lg font-bold leading-none tracking-tight text-[#EFE7DC]">
              Mentor<span className="text-[#7AA890]">Lagbe</span>
              <span className="text-[#B87959]">.</span>
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-[#C98B6D]">
              {cfg.tagline}
            </span>
          </span>
        )}
      </Link>
    </div>
  )
}

// ─── Identity card ───────────────────────────────────────────────────────────

function IdentityCard({
  role,
  collapsed,
  identity,
}: {
  role: DashboardRole
  collapsed: boolean
  identity?: DashboardIdentity
}) {
  const cfg = ROLE_CONFIG[role]

  const userName = identity?.userName ?? cfg.userName
  const initials = identity?.initials ?? cfg.initials
  const plan = identity?.plan ?? cfg.plan
  const image = identity?.image

  const avatarElement = (sizeClass: string) => (
    <Avatar className={cn("border-2 border-[#B87959]/70 bg-[#16241F]", sizeClass)}>
      {image && <AvatarImage src={image} alt={userName} className="object-cover" />}
      <AvatarFallback className="bg-[#16241F] font-mono text-[10px] font-bold text-[#EFE7DC]">
        {initials}
      </AvatarFallback>
    </Avatar>
  )

  if (collapsed) {
    return (
      <div className="border-b border-[#EFE7DC]/10 px-2 py-4" title={userName}>
        <div className="mx-auto flex justify-center">
          {avatarElement("size-8")}
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-[#EFE7DC]/10 p-4">
      <div className="flex items-center gap-3 rounded-sm border border-[#EFE7DC]/10 bg-[#243630]/60 p-3">
        {avatarElement("size-11")}
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold tracking-tight text-[#EFE7DC]">
            {userName}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-sm border border-[#7AA890]/40 bg-[#668B78]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#9DBFA9]">
              {cfg.roleBadge}
            </span>
            <span className="inline-flex items-center rounded-sm border border-[#B87959]/45 bg-[#B87959]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#C98B6D]">
              {plan}
            </span>
          </span>
        </span>
      </div>
    </div>
  )
}

// ─── Sidebar body (shared by desktop rail + mobile drawer) ───────────────────

function SidebarBody({
  role,
  collapsed,
  onNavigate,
  identity,
}: {
  role: DashboardRole
  collapsed: boolean
  onNavigate?: () => void
  identity?: DashboardIdentity
}) {
  return (
    <div
      className="relative flex h-full flex-col bg-[#344C43] text-[#EFE7DC]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 120% 60% at 0% 0%, rgba(184,121,89,0.12) 0%, transparent 55%), radial-gradient(rgba(217,203,181,0.055) 1px, transparent 1.3px)",
        backgroundSize: "auto, 22px 22px",
      }}
    >
      {/* Giant registration watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-3 select-none font-serif text-[8.5rem] font-black leading-none text-[#EFE7DC]/[0.045]"
      >
        №
      </span>

      <BrandBlock collapsed={collapsed} role={role} />
      <IdentityCard role={role} collapsed={collapsed} identity={identity} />

      {/* Navigation */}
      <nav aria-label="Dashboard" className={cn("flex-1 overflow-y-auto px-3 py-4", collapsed && "px-2")}>
        {!collapsed && (
          <p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.34em] text-[#EFE7DC]/35">
            The Index
          </p>
        )}
        <NavItems role={role} collapsed={collapsed} onNavigate={onNavigate} />
      </nav>

      {/* Bottom actions */}
      <div className={cn("relative border-t border-[#EFE7DC]/10 p-3", collapsed && "p-2")}>
        {/* Scholar Pro sliver (expanded only) */}
        {!collapsed && (
          <Link
            href="/pricing"
            onClick={onNavigate}
            className="group mb-3 flex items-center justify-between gap-3 rounded-sm border border-[#C98B6D]/35 bg-[#B87959]/10 px-3 py-2 transition-colors hover:border-[#C98B6D]/60 hover:bg-[#B87959]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]"
          >
            <span className="flex items-center gap-2">
              <Sparkles aria-hidden="true" className="size-3.5 text-[#C98B6D]" strokeWidth={1.75} />
              <span className="font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.18em] text-[#EFE7DC]/80">
                Scholar Pro<br />
                <span className="font-medium text-[#C98B6D]">Pin your queue — $10</span>
              </span>
            </span>
            <span aria-hidden="true" className="font-mono text-[10px] text-[#C98B6D] transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        )}

        <ul className="space-y-1">
          {/* ✅ শুধু Logout বাটন রাখা হয়েছে, Settings এবং Back to Website বাদ দেওয়া হয়েছে */}
          <li>
            <button
              type="button"
              title={collapsed ? "Logout (UI only)" : undefined}
              aria-label={collapsed ? "Logout" : undefined}
              className={cn(
                "group flex h-10 w-full items-center gap-3 rounded-sm px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#EFE7DC]/55 transition-all hover:bg-[#B87959]/10 hover:text-[#E0A57E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]",
                collapsed && "justify-center px-0"
              )}
            >
              <LogOut aria-hidden="true" className="size-[17px] shrink-0 text-[#B87959]/80 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={1.75} />
              {!collapsed && <span>Logout</span>}
            </button>
          </li>
        </ul>

        {!collapsed && (
          <p className="mt-2 border-t border-[#EFE7DC]/8 px-2 pt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#EFE7DC]/28">
            Est. MMXXVI — Dhaka · Folio ML-REG-002
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Sidebar: desktop rail + mobile drawer ───────────────────────────────────

export function Sidebar({ role, collapsed, mobileOpen, onCloseMobile, identity }: SidebarProps) {
  // Close the mobile drawer on Escape
  React.useEffect(() => {
    if (!mobileOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseMobile()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [mobileOpen, onCloseMobile])

  // Prevent body scroll while the drawer is open
  React.useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop rail */}
      <aside
        id="dashboard-sidebar"
        aria-label="Student dashboard sidebar"
        className={cn(
          "sticky top-[72px] hidden h-[calc(100vh-72px)] shrink-0 self-start transition-[width] duration-300 ease-out lg:block",
          collapsed ? "w-[4.75rem]" : "w-72"
        )}
      >
        <SidebarBody role={role} collapsed={collapsed} identity={identity} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden" role="presentation">
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 cursor-default bg-[#16241F]/70 backdrop-blur-[2px]"
          />
          {/* Drawer */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            id="dashboard-sidebar-mobile"
            className="fixed inset-y-0 left-0 z-50 w-[19rem] max-w-[88vw] shadow-2xl"
          >
            <button
              type="button"
              onClick={onCloseMobile}
              autoFocus
              aria-label="Close navigation"
              className="absolute right-3 top-4 z-10 rounded-sm p-2 text-[#EFE7DC]/70 transition-colors hover:bg-[#EFE7DC]/10 hover:text-[#EFE7DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]"
            >
              <X className="size-5" strokeWidth={2} />
            </button>
            <SidebarBody role={role} collapsed={false} onNavigate={onCloseMobile} identity={identity} />
          </div>
        </div>
      )}
    </>
  )
}
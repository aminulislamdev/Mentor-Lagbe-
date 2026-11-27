"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  PanelLeft,
  Search,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react"
import { ROLE_CONFIG, getRouteMeta, type DashboardIdentity, type DashboardRole } from "@/components/dashboard/nav-config"
import { NotificationBell } from "@/components/notification-bell"
import { cn } from "@/lib/utils"

interface TopbarProps {
  role: DashboardRole
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenMobile: () => void
  identity?: DashboardIdentity
}

export function Topbar({ role, collapsed, onToggleCollapse, onOpenMobile, identity }: TopbarProps) {
  const pathname = usePathname()
  const meta = getRouteMeta(pathname, role)
  const cfg = ROLE_CONFIG[role]

  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close the profile menu on outside click / Escape
  React.useEffect(() => {
    if (!menuOpen) return
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen])

  // Close the menu whenever the route changes (adjust state during render)
  const [prevPathname, setPrevPathname] = React.useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-[72px] z-30 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-3 backdrop-blur-md sm:gap-4 sm:px-5">
      {/* Sidebar toggle — mobile drawer vs desktop rail */}
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open dashboard navigation"
        aria-controls="dashboard-sidebar-mobile"
        className="flex size-10 items-center justify-center rounded-sm border border-[#344C43]/25 bg-[#EFE7DC]/70 text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] lg:hidden"
      >
        <PanelLeft className="size-5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        aria-controls="dashboard-sidebar"
        className="hidden size-10 items-center justify-center rounded-sm border border-[#344C43]/25 bg-[#EFE7DC]/70 text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] lg:flex"
      >
        <PanelLeft
          className={cn("size-5 transition-transform duration-300", collapsed && "rotate-180")}
          strokeWidth={1.75}
        />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.26em] text-[#344C43]/55 sm:text-[10px]">
          {meta.crumbs.map((crumb, i) => {
            const isLast = i === meta.crumbs.length - 1
            return (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight aria-hidden="true" className="size-3 text-[#B87959]" strokeWidth={2} />}
                <li className="min-w-0">
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="transition-colors hover:text-[#B87959]">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-[#344C43]">
                      {crumb.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            )
          })}
        </ol>
        <p
          className="mt-0.5 hidden truncate text-[15px] font-black leading-none tracking-tight text-[#344C43] md:block"
          style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
        >
          {meta.title}
        </p>
      </nav>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Search — UI only */}
        <label htmlFor="dashboard-search" className="relative hidden md:block">
          <span className="sr-only">Search the dashboard (decorative)</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45"
            strokeWidth={1.75}
          />
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search batches, dossiers, people…"
            className="h-10 w-44 rounded-sm border border-[#344C43]/25 bg-[#EFE7DC]/80 pl-9 pr-9 text-[12px] text-[#344C43] outline-none transition-all placeholder:text-[#344C43]/40 hover:border-[#344C43]/40 focus:w-56 focus:border-[#668B78] focus:bg-[#EFE7DC] focus:ring-2 focus:ring-[#668B78]/20 lg:w-52 lg:focus:w-64"
          />
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-[3px] border border-[#344C43]/25 bg-[#F2ECDF] font-mono text-[10px] font-bold text-[#344C43]/55"
          >
            /
          </kbd>
        </label>

        {/* Notifications — dynamic (GET /api/notifications + PATCH read; role-filtered server-side) */}
        <NotificationBell />

        {/* Avatar + dropdown — UI only */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="topbar-user-menu"
            aria-label="Account menu"
            className="flex items-center gap-1.5 rounded-sm border border-[#344C43]/25 bg-[#EFE7DC]/70 p-1 pr-1.5 transition-all hover:border-[#668B78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
          >
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-full border border-[#B87959]/60 bg-[#344C43] font-mono text-[10px] font-bold text-[#EFE7DC]"
            >
              {identity?.initials ?? cfg.initials}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn("size-3.5 text-[#344C43]/60 transition-transform duration-200", menuOpen && "rotate-180")}
              strokeWidth={2}
            />
          </button>

          {menuOpen && (
            <div
              id="topbar-user-menu"
              role="menu"
              aria-label="Account"
              className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] shadow-[6px_8px_0_rgba(52,76,67,0.22)]"
            >
              <div className="border-b border-[#344C43]/15 bg-[#EFE7DC]/60 px-4 py-3">
                <p className="text-[13px] font-semibold tracking-tight text-[#344C43]">{identity?.userName ?? cfg.userName}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/55">
                  {cfg.roleBadge} · Plan: <span className="text-[#B87959]">{identity?.plan ?? cfg.plan}</span>
                </p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/dashboard/profile"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-[12px] font-medium text-[#344C43] transition-colors hover:bg-[#EFE7DC] hover:text-[#4A695C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#668B78]"
                >
                  <User aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={1.75} />
                  My Profile
                </Link>
              </div>
              <div className="border-t border-[#344C43]/15 p-1.5">
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-[12px] font-medium text-[#B87959] transition-colors hover:bg-[#B87959]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#B87959]"
                >
                  <LogOut aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Logout
                  <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-[#B87959]/60">UI only</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

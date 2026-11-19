"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import type { DashboardRole } from "@/components/dashboard/nav-config"

/**
 * Reusable dashboard chassis for all MentorLagbe roles.
 * Navbar (root layout) → shell (topbar + sidebar) → role page.
 * Each role page brings its own accent identity; the chassis stays constant.
 */
export function DashboardShell({
  role,
  children,
}: {
  role: DashboardRole
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  // Close the mobile drawer whenever the route changes (adjust state during render)
  const [prevPathname, setPrevPathname] = React.useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-w-0 items-stretch bg-[#F2ECDF]">
      <Sidebar
        role={role}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          role={role}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main
          className="min-w-0 flex-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(52,76,67,0.06) 31px, rgba(52,76,67,0.06) 32px)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

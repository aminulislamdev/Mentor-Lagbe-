"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import type { DashboardRole } from "@/components/dashboard/nav-config"
import { useSession } from "@/lib/auth-client"
import { initials } from "@/lib/adapters"

/** "pro" → "Pro", "free" → "Free", anything unknown → "Free". */
function planLabel(plan: string | undefined): string {
  if (plan === "pro") return "Pro"
  if (plan === "admin") return "Admin"
  return "Free"
}

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

  // Real identity, so the shell never contradicts the page. While the session
  // is still loading the components keep their demo placeholder.
  const { data: session } = useSession()
  const signedInUser = session?.user as
    | { name?: string; plan?: string }
    | undefined

  const identity = signedInUser?.name
    ? {
        userName: signedInUser.name,
        initials: initials(signedInUser.name),
        plan: planLabel(signedInUser.plan),
      }
    : undefined

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
        identity={identity}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          role={role}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onOpenMobile={() => setMobileOpen(true)}
          identity={identity}
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

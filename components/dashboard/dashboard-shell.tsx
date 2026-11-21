"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import type { DashboardRole } from "@/components/dashboard/nav-config"
import { useSession } from "@/lib/auth-client"
import { initials } from "@/lib/adapters"
import { PanelLeft } from "lucide-react"

function planLabel(plan: string | undefined): string {
  if (plan === "pro") return "Pro"
  if (plan === "admin") return "Admin"
  return "Free"
}

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

  const [prevPathname, setPrevPathname] = React.useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop fixed rail + mobile drawer) */}
      <Sidebar
        role={role}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        identity={identity}
      />

      {/* Main content area beside sidebar */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile hamburger button (shown only on small screens) */}
        <div className="sticky top-[72px] z-30 flex h-14 items-center gap-3 border-b border-[#344C43]/20 bg-[#F2ECDF]/90 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open dashboard navigation"
            aria-controls="dashboard-sidebar-mobile"
            className="flex size-10 items-center justify-center rounded-sm border border-[#344C43]/25 bg-[#EFE7DC]/70 text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C]"
          >
            <PanelLeft className="size-5" strokeWidth={1.75} />
          </button>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">
            Dashboard
          </span>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 hidden lg:block">
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex size-10 items-center justify-center rounded-sm border border-[#344C43]/25 bg-[#EFE7DC]/70 text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C]"
            >
              <PanelLeft
                className={`size-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                strokeWidth={1.75}
              />
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
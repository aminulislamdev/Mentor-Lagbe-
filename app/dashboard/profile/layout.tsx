"use client"

import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useSession } from "@/lib/auth-client"
import type { DashboardRole } from "@/components/dashboard/nav-config"

export default function ProfileDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  if (isPending) {
    return <div className="p-8 text-center">Loading...</div>
  }

  const role = ((session?.user as { role?: string } | undefined)?.role || "student").toLowerCase() as DashboardRole
  if (!session?.user) {
    router.push("/sign-in")
    return null
  }

  return <DashboardShell role={role}>{children}</DashboardShell>
}
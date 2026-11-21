"use client"

import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import type { DashboardRole } from "@/components/dashboard/nav-config"

export function RoleGuard({
  role,
  children,
}: {
  role: DashboardRole
  children: React.ReactNode
}) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  if (isPending) return <div className="p-8 text-center">Loading...</div>

  const userRole = ((session?.user as { role?: string } | undefined)?.role || "").toLowerCase()
  if (!session?.user) {
    router.push("/sign-in")
    return null
  }
  if (userRole !== role) {
    // Redirect to correct dashboard
    const target =
      userRole === "admin"
        ? "/dashboard/admin"
        : userRole === "tutor"
        ? "/dashboard/tutor"
        : "/dashboard/student"
    router.push(target)
    return null
  }
  return <>{children}</>
}
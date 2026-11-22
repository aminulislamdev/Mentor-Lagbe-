"use client"

import { useEffect } from "react"
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

  // Redirect only — children are always rendered so Next.js can validate them.
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  const role = (
    (session?.user as { role?: string } | undefined)?.role || "student"
  ).toLowerCase() as DashboardRole

  return (
    <DashboardShell role={role}>
      {children}
    </DashboardShell>
  )
}
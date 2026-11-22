"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useSession } from "@/lib/auth-client"

export default function StudentDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/sign-in")
      } else {
        const userRole = (session.user as { role?: string }).role
        if (userRole !== "student") {
          router.replace(userRole === "tutor" ? "/dashboard/tutor" : "/dashboard/admin")
        }
      }
    }
  }, [isPending, session, router])

  return (
    <DashboardShell role="student">
      {children}
    </DashboardShell>
  )
}
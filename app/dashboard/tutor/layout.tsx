"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useSession } from "@/lib/auth-client"

export default function TutorDashboardLayout({
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
        if (userRole !== "tutor") {
          router.replace(userRole === "admin" ? "/dashboard/admin" : "/dashboard/student")
        }
      }
    }
  }, [isPending, session, router])

  return (
    <DashboardShell role="tutor">
      {children}
    </DashboardShell>
  )
}
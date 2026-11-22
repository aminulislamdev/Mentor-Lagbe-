"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useSession } from "@/lib/auth-client"

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // ✅ Redirect logic moved to useEffect to prevent "Dropped Segment" error
  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/sign-in")
      } else {
        const userRole = (session.user as { role?: string }).role
        if (userRole !== "admin") {
          // অ্যাডমিন না হলে তাকে তার নিজের ড্যাশবোর্ডে পাঠিয়ে দেবে
          router.replace(userRole === "tutor" ? "/dashboard/tutor" : "/dashboard/student")
        }
      }
    }
  }, [isPending, session, router])

  // ✅ Children are always rendered so Next.js can validate them
  return (
    <DashboardShell role="admin">
      {children}
    </DashboardShell>
  )
}
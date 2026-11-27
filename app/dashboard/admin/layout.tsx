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

  // Redirect source of truth (kept as-is).
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

  const isAdmin = !!session?.user && (session.user as { role?: string }).role === "admin"
  const isAuthorized = !isPending && isAdmin

  // While the session is loading, render a simple loading indicator — not children.
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  // Not signed in, or not an admin: render nothing (redirect handled by useEffect).
  if (!isAdmin) {
    return null
  }

  if (isAuthorized) {
    return (
      <DashboardShell role="admin">
        {children}
      </DashboardShell>
    )
  }

  return null
}

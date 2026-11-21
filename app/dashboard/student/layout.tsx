import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"

export default function StudentDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RoleGuard role="student">
      <DashboardShell role="student">{children}</DashboardShell>
    </RoleGuard>
  )
}
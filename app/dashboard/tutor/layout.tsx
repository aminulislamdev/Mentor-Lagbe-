import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"

export default function TutorDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RoleGuard role="tutor">
      <DashboardShell role="tutor">{children}</DashboardShell>
    </RoleGuard>
  )
}
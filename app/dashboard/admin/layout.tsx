import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RoleGuard role="admin">
      <DashboardShell role="admin">{children}</DashboardShell>
    </RoleGuard>
  )
}
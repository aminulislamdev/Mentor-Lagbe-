import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function StudentDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardShell role="student">{children}</DashboardShell>
}

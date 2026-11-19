import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function TutorDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardShell role="tutor">{children}</DashboardShell>
}

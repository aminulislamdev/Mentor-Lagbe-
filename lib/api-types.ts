// Types for every response the Express API returns.
//
// The server answers with one envelope everywhere:
//   { success: true, data, pagination?, message? }
//   { success: false, error, ...extra }
// so these types describe the payloads, not the HTTP plumbing.

import type { Tuition } from "@/types/tuition"

export type { Tuition }

export type Role = "student" | "tutor" | "admin"
export type Plan = "free" | "pro"
export type ApprovalStatus = "pending" | "approved" | "rejected"
export type ApplicationStatus = "pending" | "accepted" | "rejected"

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiSuccess<T> {
  success: true
  data: T
  pagination?: Pagination
  message?: string
}

export interface ApiFailure {
  success: false
  error: string
  [key: string]: unknown
}

/**
 * Persistent user preferences (matches the backend `settings` object on the
 * users collection). `notifications` keys match `settings.notifications.*`.
 */
export interface UserSettings {
  language: string
  timezone: string
  mode: string
  days: string[]
  evenings: boolean
  notifications: {
    applicant: boolean
    status: boolean
    approval: boolean
    announcements: boolean
    subscription: boolean
  }
}

/** Mirrors the users collection as `/api/auth/me` and the profile route expose it. */
export interface CurrentUser {
  id: string
  name: string
  email: string
  role: Role
  plan: Plan
  image?: string | null
  phone?: string | null
  bio?: string | null
  createdAt?: string
  settings?: UserSettings | null
}

export interface Application {
  _id: string
  tuitionId: string
  tuitionTitle: string
  subject: string
  monthlyFee: number
  tutorEmail: string
  studentName: string
  studentEmail: string
  studentPhone: string
  preferredSchedule: string
  studentNote?: string
  status: ApplicationStatus
  appliedAt: string
  createdAt?: string
}

/** Response of `GET /api/auth/me` — the one endpoint outside the envelope. */
export interface MeResponse {
  user: CurrentUser
}

export interface StudentStats {
  role: "student"
  plan: Plan
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
}

export interface TutorStats {
  role: "tutor"
  plan: Plan
  totalTuitions: number
  approvedTuitions: number
  activeTuitions: number
  totalApplicants: number
}

export interface AdminStats {
  role: "admin"
  totalUsers: number
  totalStudents: number
  totalTutors: number
  totalAdmins?: number
  totalTuitions: number
  pendingTuitions: number
  approvedTuitions: number
  totalApplications: number
  totalRevenue?: number
}

export interface PaymentTransaction {
  _id: string
  userEmail: string
  userName: string
  userRole: string
  planName: string
  amount: number
  currency: string
  transactionId: string
  stripeSessionId?: string
  paymentStatus: string
  paidAt?: string
  createdAt?: string
}

export type DashboardStats = StudentStats | TutorStats | AdminStats

export interface UploadResult {
  url: string
  thumb?: string
  deleteUrl?: string
}

/** Query the public catalogue accepts. */
export interface TuitionQuery {
  search?: string
  subject?: string
  classLevel?: string
  mode?: "Online" | "Offline"
  minFee?: number
  maxFee?: number
  sort?: "newest" | "fee_asc" | "fee_desc"
  page?: number
  limit?: number
}

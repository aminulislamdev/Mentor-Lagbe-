export interface Tuition {
  _id: string
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  location: string
  monthlyFee: number
  daysPerWeek: number
  bannerImage: string
  description: string
  tutorName: string
  tutorEmail: string
  approvalStatus: "pending" | "approved" | "rejected"
  isActive: boolean
  createdAt: string
  rating?: number
  reviewCount?: number
}

// ─── Tuition shapes that are structurally distinct from the API DTO ──────────
// Kept as three separate types on purpose: CatalogTuition and TuitionDetailDossier
// serve presentation layers and are NOT interchangeable with Tuition. Do not merge.

/** Browse-catalog record (`app/tuitions`) as currently rendered — verbatim shape. */
export interface CatalogTuition {
  id: string
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  location: string
  monthlyFee: number
  daysPerWeek: number
  scheduleTime: string
  seatsRemaining: number
  bannerImage: string
  description: string
  tutorName: string
  tutorTitle: string
  tutorInitials: string
  rating: number
  reviewCount: number
  syllabusTags: string[]
}

/** Dossier detail record (`app/tuitions/[id]`) as currently rendered — verbatim shape. */
export interface TuitionDetailDossier {
  id: string
  referenceCode: string
  title: string
  subtitle: string
  subject: string
  academicTier: string
  mode: "Online" | "Offline"
  venue: string
  monthlyInvestment: number
  feePerSession: number
  sessionsPerMonth: number
  daysPerWeek: number
  weeklyPace: string
  scheduleSchedule: { day: string; time: string }[]
  seatAllocation: { total: number; occupied: number; remaining: number }
  bannerImage: string
  manifesto: string
  pedagogicalFocus: { title: string; syllabus: string }[]
  learnerProfile: string[]
  tutor: {
    name: string
    credential: string
    institution: string
    facultyNote: string
    tenure: string
    alumniBadge: string
    rating: number
    reviewsTotal: number
    batchesCompleted: number
    responseCommitment: string
    directEmail: string
    initials: string
  }
}

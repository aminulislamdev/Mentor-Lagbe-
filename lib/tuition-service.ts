import { Tuition } from "@/types/tuition"

export const FEATURED_TUITIONS_FALLBACK: Tuition[] = [
  {
    _id: "tui-001",
    title: "HSC Higher Mathematics & Differential Calculus Batch",
    subject: "Mathematics",
    classLevel: "HSC (Class 11-12)",
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 4500,
    daysPerWeek: 3,
    bannerImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    description:
      "Comprehensive weekly batch focused on mastering calculus, vectors, and coordinate geometry with weekly chapter assessments and board exam problem solving.",
    tutorName: "Tanvir Ahmed, M.Sc",
    tutorEmail: "tanvir.math@mentorlagbe.com",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-02-10T10:00:00.000Z",
    rating: 4.9,
    reviewCount: 38,
  },
  {
    _id: "tui-002",
    title: "Quantum Physics & Newtonian Mechanics (English Version)",
    subject: "Physics",
    classLevel: "Class 10 / SSC",
    mode: "Online",
    location: "Online (Google Meet & Miro)",
    monthlyFee: 3800,
    daysPerWeek: 2,
    bannerImage:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",
    description:
      "Interactive digital physics lab with weekly simulation experiments, derivation derivations, and past 10 years question bank breakdowns.",
    tutorName: "Dr. Samia Rahman",
    tutorEmail: "samia.physics@mentorlagbe.com",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-02-12T14:30:00.000Z",
    rating: 4.95,
    reviewCount: 52,
  },
  {
    _id: "tui-003",
    title: "Full-Stack Web Development & Modern React/Next.js Mentorship",
    subject: "Programming",
    classLevel: "Undergraduate / Career",
    mode: "Online",
    location: "Live Discord & Code Reviews",
    monthlyFee: 6000,
    daysPerWeek: 3,
    bannerImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description:
      "Production-grade web engineering batch covering TypeScript, Next.js App Router, Tailwind CSS, REST APIs, and portfolio capstone building.",
    tutorName: "Abrar Fahad",
    tutorEmail: "abrar.dev@mentorlagbe.com",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-02-15T09:15:00.000Z",
    rating: 5.0,
    reviewCount: 64,
  },
  {
    _id: "tui-004",
    title: "IELTS Academic Band 8.0 Comprehensive Intensive & Speaking Lab",
    subject: "IELTS",
    classLevel: "Higher Studies / University",
    mode: "Online",
    location: "Online Interactive Sessions",
    monthlyFee: 5200,
    daysPerWeek: 3,
    bannerImage:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    description:
      "Targeted preparation covering all 4 modules: Writing Task 1 & 2 rubrics, 1-on-1 speaking mock evaluations, reading skimming techniques, and listening drills.",
    tutorName: "Nafis Kamal (CELTA)",
    tutorEmail: "nafis.ielts@mentorlagbe.com",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-02-18T16:00:00.000Z",
    rating: 4.88,
    reviewCount: 45,
  },
  {
    _id: "tui-005",
    title: "Organic Chemistry Mechanisms & Biochemical Pathway Analysis",
    subject: "Chemistry",
    classLevel: "HSC (Class 11-12)",
    mode: "Offline",
    location: "Uttara Sector 7, Dhaka",
    monthlyFee: 4200,
    daysPerWeek: 3,
    bannerImage:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    description:
      "Simplifying reaction mechanisms, IUPAC nomenclature, and stoichiometry equations with structured problem sets and handwritten formula sheets.",
    tutorName: "Maliha Hossain, B.Sc",
    tutorEmail: "maliha.chem@mentorlagbe.com",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-02-20T11:20:00.000Z",
    rating: 4.92,
    reviewCount: 29,
  },
  {
    _id: "tui-006",
    title: "Molecular Biology, Human Physiology & Genetics Mastery",
    subject: "Biology",
    classLevel: "Class 9-10 (SSC)",
    mode: "Online",
    location: "Live Interactive Classroom",
    monthlyFee: 3500,
    daysPerWeek: 2,
    bannerImage:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
    description:
      "Visual diagram-oriented learning covering cellular respiration, human circulatory systems, genetics problem solving, and diagram drawing techniques.",
    tutorName: "Dr. Rubel Karim",
    tutorEmail: "rubel.bio@mentorlagbe.com",
    approvalStatus: "approved",
    isActive: true,
    createdAt: "2026-02-22T08:45:00.000Z",
    rating: 4.85,
    reviewCount: 31,
  },
]

export async function fetchFeaturedTuitions(): Promise<Tuition[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/api/tuitions?limit=6&approvalStatus=approved&isActive=true`, {
        next: { revalidate: 60 },
      })
      if (response.ok) {
        const json = await response.json()
        const data = Array.isArray(json) ? json : json.data || json.tuitions
        if (Array.isArray(data) && data.length > 0) {
          return data.slice(0, 6)
        }
      }
    } catch {
      // Backend not running yet or unreachable, use realistic fallback
    }
  }

  return FEATURED_TUITIONS_FALLBACK
}

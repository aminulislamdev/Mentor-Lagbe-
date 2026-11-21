export type Role = "student" | "tutor"

export const CONTENTS = [
  { numeral: "I.", title: "Declaration of Intent", note: "your oath", href: "#article-1" },
  { numeral: "II.", title: "The Inscription", note: "≈ 2 min", href: "#article-2" },
  { numeral: "III.", title: "The Seal", note: "confirmed", href: "#article-3" },
]

export const OATHS: Record<
  Role,
  {
    kicker: string
    oath: string
    headline: string
    clauses: string[]
    footer: string
    cta: string
    namePlaceholder: string
  }
> = {
  student: {
    kicker: "Oath 01 — For those who seek",
    oath: "I",
    headline: "I seek a mentor.",
    clauses: [
      "Verified, credentialed mentors only.",
      "One tap to apply — zero middlemen.",
      "Your application, always within sight.",
    ],
    footer: "SSC · HSC · A-Level · IELTS · Admission",
    cta: "Inscribe me — I'm a Scholar",
    namePlaceholder: "Rafi Ahmed Chowdhury",
  },
  tutor: {
    kicker: "Oath 02 — For those who share",
    oath: "II",
    headline: "I share what I know.",
    clauses: [
      "Publish 2 batches free — unlimited with Pro.",
      "A clean applicant pipeline, not inbox noise.",
      "Your rate, your hours, your terms.",
    ],
    footer: "Educators · BUET & DU scholars · Alums",
    cta: "Inscribe me — I'm a Mentor",
    namePlaceholder: "Dr. Nasrin Islam",
  },
}

export const METRICS = [
  { value: "2,400+", label: "Verified mentors" },
  { value: "12,000+", label: "Scholars inscribed" },
  { value: "99.2%", label: "Satisfaction" },
]

export const ATTESTED_FEATS = ["Free to join", "No credit card", "Verified profiles"]
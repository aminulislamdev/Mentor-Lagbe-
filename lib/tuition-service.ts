import type { Tuition } from "@/types/tuition"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Latest approved + active listings for the home page.
 *
 * Runs on the server (the home page is a Server Component), so no token is
 * needed. A failed request returns an empty list rather than throwing: the home
 * page then renders its empty state instead of breaking the whole landing page.
 */
export async function fetchFeaturedTuitions(limit = 6): Promise<Tuition[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/tuitions?limit=${limit}&sort=newest`,
      { cache: "no-store" }
    )

    if (!response.ok) return []

    const json = (await response.json()) as { data?: Tuition[] }
    const rows = Array.isArray(json.data) ? json.data : []

    return rows.slice(0, limit)
  } catch {
    return []
  }
}

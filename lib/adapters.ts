// Small presentation helpers shared by the pages.
// Everything here is derived from real API fields — no invented numbers.

/** "Tanvir Ahmed" → "TA", "Madonna" → "MA". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatFee(value: number): string {
  return `৳${value.toLocaleString("en-IN")}`
}

export function weeklyPace(daysPerWeek: number): string {
  return `${daysPerWeek} ${daysPerWeek === 1 ? "day" : "days"} / week`
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return "—"

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/** Turns a filter object into a query string, dropping empty values. */
export function toQueryString(
  params: Record<string, string | number | undefined | null>
): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    search.set(key, String(value))
  }

  return search.toString()
}

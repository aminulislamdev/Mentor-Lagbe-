import Link from "next/link"
import { Compass, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[70vh] px-4 py-20 text-center">
      <div className="size-16 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm mb-6">
        <Compass className="size-8" />
      </div>

      <span className="font-mono text-xs uppercase tracking-widest text-[#B87959] font-bold">
        Error 404 • Dossier Missing
      </span>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-3">
        Academic Record Not Found
      </h1>

      <p className="max-w-md text-sm text-muted-foreground leading-relaxed mb-8">
        The tuition listing, page, or mentorship record you are looking for does not exist or has been relocated within our catalog.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Return to Home Catalog</span>
      </Link>
    </div>
  )
}

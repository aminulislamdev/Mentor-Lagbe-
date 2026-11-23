import Link from "next/link"
import { Compass, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[70vh] px-4 py-20 text-center">
      <div className="size-16 sm:size-20 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm mb-6">
        <Compass className="size-8 sm:size-10" />
      </div>

      <span className="font-mono text-sm sm:text-base uppercase tracking-widest text-[#B87959] font-bold">
        Error 404 • Dossier Missing
      </span>

      <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-2 mb-4 leading-tight">
        Academic Record Not Found
      </h1>

      <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
        The tuition listing, page, or mentorship record you are looking for does not exist or has been relocated within our catalog.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-sm sm:text-base font-semibold shadow-xs transition-colors"
      >
        <ArrowLeft className="size-5" />
        <span>Return to Home Catalog</span>
      </Link>
    </div>
  )
}
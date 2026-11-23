import { Compass } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      <div className="relative flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-card border border-border shadow-md">
        <Compass className="size-8 sm:size-10 text-primary animate-spin animation-duration-[2.5s]" />
        <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-[#B87959] ring-2 ring-background animate-ping" />
      </div>

      <p className="mt-5 font-mono text-sm sm:text-base uppercase tracking-widest text-muted-foreground font-semibold text-center">
        Loading Academic Catalog...
      </p>
    </div>
  )
}
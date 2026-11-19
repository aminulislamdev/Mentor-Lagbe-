import { Compass } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      <div className="relative flex size-14 items-center justify-center rounded-2xl bg-card border border-border shadow-md">
        <Compass className="size-7 text-primary animate-spin [animation-duration:2.5s]" />
        <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-[#B87959] ring-2 ring-background animate-ping" />
      </div>

      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground font-semibold">
        Loading Academic Catalog...
      </p>
    </div>
  )
}

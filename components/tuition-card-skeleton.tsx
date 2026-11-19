export function TuitionCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden shadow-2xs animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-44 w-full bg-muted/70" />

      {/* Content Body Skeleton */}
      <div className="flex flex-1 flex-col p-5">
        <div className="h-3 w-28 bg-muted/80 rounded mb-2" />
        <div className="h-5 w-4/5 bg-muted/90 rounded mb-2" />
        <div className="h-3 w-full bg-muted/60 rounded mb-1" />
        <div className="h-3 w-3/4 bg-muted/60 rounded mb-4" />

        <div className="mt-auto pt-3.5 border-t border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-muted/80" />
            <div className="h-3 w-20 bg-muted/80 rounded" />
          </div>
          <div className="h-3 w-16 bg-muted/70 rounded" />
        </div>

        <div className="mt-4 pt-3.5 border-t border-border/80 flex items-center justify-between">
          <div>
            <div className="h-3 w-16 bg-muted/60 rounded mb-1" />
            <div className="h-5 w-24 bg-muted/90 rounded" />
          </div>
          <div className="h-8 w-20 bg-muted/80 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { CalendarDays, MapPin, Sparkles, ArrowUpRight, GraduationCap } from "lucide-react"
import { Tuition } from "@/types/tuition"

interface TuitionCardProps {
  tuition: Tuition
}

export function TuitionCard({ tuition }: TuitionCardProps) {
  const isOnline = tuition.mode.toLowerCase() === "online"

  return (
    <article className="group flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
      {/* Banner Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tuition.bannerImage}
          alt={tuition.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Subject Badge */}
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#344C43]/90 text-[#EFE7DC] backdrop-blur-md border border-white/10 shadow-xs">
            {tuition.subject}
          </span>

          {/* Mode Pill */}
          <span
            className={`inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-md backdrop-blur-md border shadow-xs ${isOnline
                ? "bg-[#668B78]/90 text-white border-white/20"
                : "bg-[#B87959]/90 text-white border-white/20"
              }`}
          >
            <span
              className={`size-1.5 rounded-full ${isOnline ? "bg-emerald-300 animate-pulse" : "bg-amber-200"
                }`}
            />
            {tuition.mode}
          </span>
        </div>

        {/* Rating overlay bottom left of banner */}
        {tuition.rating && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white text-sm font-mono font-medium drop-shadow-sm">
            <Sparkles className="size-4 text-amber-300 fill-amber-300" />
            <span>{tuition.rating.toFixed(1)}</span>
            <span className="text-white/70">({tuition.reviewCount || 12})</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Class Level Sub-label */}
        <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground uppercase tracking-wider mb-2">
          <GraduationCap className="size-4 text-primary" />
          <span>{tuition.classLevel}</span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {tuition.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-2">
          {tuition.description}
        </p>

        {/* Tutor & Location Row */}
        <div className="mt-4 pt-3.5 border-t border-border/70 flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-8 rounded-full bg-primary/20 text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-primary/30">
              {tuition.tutorName.charAt(0)}
            </div>
            <span className="font-medium text-foreground truncate">
              {tuition.tutorName}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-muted-foreground ml-2">
            <MapPin className="size-3.5 text-primary" />
            <span className="truncate max-w-30 sm:max-w-35">{tuition.location}</span>
          </div>
        </div>

        {/* Bottom Ledger & Action Trigger */}
        <div className="mt-4 pt-3.5 border-t border-border/80 flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xs sm:text-sm font-mono text-muted-foreground">
              <CalendarDays className="size-3.5 text-primary" />
              <span>{tuition.daysPerWeek} days / week</span>
            </div>
            <span className="font-mono text-xl sm:text-2xl font-bold text-foreground mt-0.5">
              ৳ {tuition.monthlyFee.toLocaleString()}{" "}
              <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                / month
              </span>
            </span>
          </div>

          <Link
            href={`/tuitions/${tuition._id}`}
            className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold text-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200 shadow-2xs shrink-0"
            aria-label={`View details for ${tuition.title}`}
          >
            <span>Details</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
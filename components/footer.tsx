import Link from "next/link"
import { Compass, Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react"

// Modern official X logo icon (strictly NOT the deprecated bird)
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.86 18.5V10.1H5.06v8.4h2.8z" />
    </svg>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="w-full bg-[#344C43] text-[#D9CBB5] border-t border-[#344C43]/20 pt-16 pb-10 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-[#EFE7DC] group-hover:bg-[#668B78] transition-colors">
                <Compass className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-tight text-[#EFE7DC]">
                  Mentor<span className="text-[#668B78]">Lagbe</span>
                  <span className="text-[#B87959] ml-0.5">.</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#D9CBB5]/70 -mt-0.5">
                  Academic Atelier
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#D9CBB5]/80 leading-relaxed max-w-sm">
              MentorLagbe is Bangladesh&apos;s smart tuition discovery and 1-on-1 mentorship platform. Connecting verified tutors offering subject-wise batches with students seeking personalized academic guidance.
            </p>

            <div className="pt-2 flex items-center gap-3 text-[#D9CBB5]">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow MentorLagbe on X"
                className="flex size-9 items-center justify-center rounded-xl bg-white/5 hover:bg-[#668B78] hover:text-white border border-white/10 transition-all duration-200"
              >
                <XIcon className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
                className="flex size-9 items-center justify-center rounded-xl bg-white/5 hover:bg-[#668B78] hover:text-white border border-white/10 transition-all duration-200"
              >
                <LinkedInIcon className="size-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
                className="flex size-9 items-center justify-center rounded-xl bg-white/5 hover:bg-[#668B78] hover:text-white border border-white/10 transition-all duration-200"
              >
                <GitHubIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Nav Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#EFE7DC] font-semibold">
              Explore Batches
            </h4>
            <ul className="space-y-2 text-sm text-[#D9CBB5]/80">
              <li>
                <Link
                  href="/tuitions"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Browse Tuitions
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions?subject=Mathematics"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Higher Math Batches
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions?subject=Physics"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Physics Masterclasses
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions?subject=Programming"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Computer Science Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions?subject=IELTS"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  IELTS Band 8.0 Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Platform & Pricing */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#EFE7DC] font-semibold">
              Memberships
            </h4>
            <ul className="space-y-2 text-sm text-[#D9CBB5]/80">
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Pro Plans & Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Tutor Pro ($15 / mo)
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Student Pro ($10 / mo)
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up?role=tutor"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Apply as a Tutor
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up?role=student"
                  className="hover:text-[#EFE7DC] hover:underline underline-offset-4 transition-colors"
                >
                  Register as Student
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#EFE7DC] font-semibold">
              Contact Desk
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D9CBB5]/80">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 text-[#668B78] shrink-0 mt-0.5" />
                <span>Road 27, Dhanmondi R/A, Dhaka 1209, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-[#668B78] shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-[#668B78] shrink-0" />
                <span>support@mentorlagbe.com</span>
              </li>
              <li className="pt-2 flex items-center gap-1.5 text-[11px] text-[#B87959] font-mono font-medium">
                <ShieldCheck className="size-3.5" />
                <span>Verified Bangladesh EdTech</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Terminus Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D9CBB5]/60">
          <p>© 2026 MentorLagbe. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Crafted with <Heart className="size-3 text-[#B87959] fill-[#B87959]" /> for educators
            </span>
            <span>•</span>
            <span className="font-mono text-[10px]">Secured by Stripe & BetterAuth</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

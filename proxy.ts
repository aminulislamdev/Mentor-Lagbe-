// proxy.ts
import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // ১. Authenticated routes (Dashboard & Profile)
  // লগইন ছাড়া কেউ ড্যাশবোর্ডে ঢুকতে পারবে না
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      const url = new URL("/sign-in", request.url)
      // লগইন করার পর যেন আগের পেজে ফিরে আসতে পারে
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  // ২. Guest only routes (Sign In / Sign Up)
  // লগইন থাকা অবস্থায় কেউ যেন সাইন-ইন বা সাইন-আপে ঢুকতে না পারে
  if (sessionCookie && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // ৩. Public routes (/, /tuitions, /pricing) স্বাভাবিকভাবে কাজ করবে
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
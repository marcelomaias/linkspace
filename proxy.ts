import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const protectedRoutes = ['/dashboard', '/profile']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/signup']

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  if (!isProtected && !isAdmin && !isAuthRoute) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Not logged in → redirect to login
  if (!session && (isProtected || isAdmin)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logged in → redirect away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Not admin → block admin routes
  if (session && isAdmin && session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

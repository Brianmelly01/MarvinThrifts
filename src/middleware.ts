import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'fallback-dev-secret-change-in-production',
  })

  const { pathname } = req.nextUrl
  const isLoggedIn = !!token
  const role = token?.role as string | undefined
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'

  // Protect /admin — redirect to login if not admin
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=/admin', req.url))
    }
  }

  // Protect /account — redirect to login if not authenticated
  if (pathname.startsWith('/account') && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${pathname}`, req.url))
  }

  // Redirect logged-in users away from /auth pages (except /auth/error or /auth/forgot-password)
  if (
    pathname.startsWith('/auth') &&
    !pathname.includes('error') &&
    !pathname.includes('forgot-password') &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|manifest\\.json).*)',
  ],
}

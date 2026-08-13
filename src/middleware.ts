import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isAccountRoute = nextUrl.pathname.startsWith('/account')
  const isAuthRoute = nextUrl.pathname.startsWith('/auth')

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=/admin', nextUrl))
    }
  }

  // Protect account routes
  if (isAccountRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login?callbackUrl=/account', nextUrl))
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn && !nextUrl.pathname.includes('error')) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|manifest.json).*)',
  ],
}

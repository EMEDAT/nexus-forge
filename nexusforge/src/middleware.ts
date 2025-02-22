// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    console.log('Middleware executing for path:', req.nextUrl.pathname)
    const isAuth = req.nextauth.token
    console.log('Auth token present:', !!isAuth)
    
    const isAccessingDashboard = req.nextUrl.pathname.startsWith('/(dashboard)/dashboard')
    console.log('Accessing dashboard:', isAccessingDashboard)

    if (isAccessingDashboard && !isAuth) {
      console.log('Unauthorized dashboard access, redirecting to login')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    console.log('Access granted, proceeding to next middleware')
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Authorization check, token present:', !!token)
        return !!token
      }
    },
  }
)

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/(roles)/:role/dashboard',
    '/(roles)/:role/dashboard/:path*',
    '/profile/:path*',
    '/projects/:path*',
    '/mentorship/:path*',
  ]
}
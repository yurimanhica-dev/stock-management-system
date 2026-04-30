import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Check if user is trying to access a protected route
  const isProtectedRoute = [
    '/products',
    '/sales',
    '/reports',
    '/admin',
  ].some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check if user is admin trying to access /admin
  if (request.nextUrl.pathname.startsWith('/admin') && token) {
    // This will be verified by the page component itself
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/products/:path*',
    '/sales/:path*',
    '/reports/:path*',
    '/admin/:path*',
  ],
}

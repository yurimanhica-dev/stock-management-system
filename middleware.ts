import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware to protect routes
  // Auth is handled on the client side and in API routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/products/:path*',
    '/sales/:path*',
    '/reports/:path*',
  ],
}

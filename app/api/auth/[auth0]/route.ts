import { NextResponse } from 'next/server'

// Placeholder Auth0 routes
// In production, implement proper Auth0 integration

export async function GET() {
  return NextResponse.json({
    status: 'Auth0 endpoints configured',
    endpoints: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      callback: '/api/auth/callback',
    },
  })
}

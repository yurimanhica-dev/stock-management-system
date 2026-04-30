import { jwtVerify } from 'jose'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const secret = new TextEncoder().encode(process.env.AUTH0_CLIENT_SECRET || '')

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple auth check - in production use proper JWT verification
    const token = authHeader.substring(7)

    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'Database URL not configured' },
        { status: 500 }
      )
    }

    const db = neon(dbUrl)

    // For now, create a basic user entry
    // In production, verify the token and extract user info
    const user = {
      email: 'user@example.com',
      sub: 'auth0|default',
      name: 'User',
    }

    const existingUser = await db`
      SELECT id FROM users WHERE auth0_id = ${user.sub}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ user: existingUser[0], isNew: false })
    }

    const newUser = await db`
      INSERT INTO users (auth0_id, email, name, role)
      VALUES (${user.sub}, ${user.email}, ${user.name}, 'sales_person')
      RETURNING id, auth0_id, email, name, role
    `

    return NextResponse.json({ user: newUser[0], isNew: true })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}

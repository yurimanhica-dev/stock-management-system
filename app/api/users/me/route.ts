import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'Database URL not configured' },
        { status: 500 }
      )
    }

    const db = neon(dbUrl)

    // Get first user for demo purposes
    // In production, extract user ID from JWT token
    const users = await db`
      SELECT id, auth0_id, email, name, role FROM users LIMIT 1
    `

    if (users.length === 0) {
      // Create a default user for testing
      const newUser = await db`
        INSERT INTO users (auth0_id, email, name, role)
        VALUES ('auth0|default', 'demo@example.com', 'Demo User', 'event_manager')
        RETURNING id, auth0_id, email, name, role
      `
      return NextResponse.json(newUser[0])
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error('Error getting user:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}

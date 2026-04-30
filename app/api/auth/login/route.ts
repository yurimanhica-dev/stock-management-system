import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password obrigatórios' },
        { status: 400 }
      )
    }

    // Get user from database
    const users = await sql`SELECT * FROM users WHERE email = ${email}`

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Utilizador não encontrado' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Verify password (simple comparison for demo)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Password incorreta' },
        { status: 401 }
      )
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Utilizador inativo' },
        { status: 401 }
      )
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await sql`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
    `

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

// Get SQL instance
function getSql() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('Database URL not configured')
  }
  return neon(dbUrl)
}

// Helper to verify admin
async function verifyAdmin(token: string) {
  try {
    const sql = getSql()
    const sessions = await sql`
      SELECT u.id, u.role FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `

    if (sessions.length === 0 || sessions[0].role !== 'admin') {
      return null
    }

    return sessions[0]
  } catch {
    return null
  }
}

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const admin = await verifyAdmin(token)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const sql = getSql()
    const users = await sql`
      SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar utilizadores' },
      { status: 500 }
    )
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const admin = await verifyAdmin(token)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const sql = getSql()

    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email já registado' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await sql`
      INSERT INTO users (name, email, password, role, is_active)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, true)
      RETURNING id, name, email, role, is_active, created_at
    `

    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Erro ao criar utilizador' },
      { status: 500 }
    )
  }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const admin = await verifyAdmin(token)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { id, name, email, password, role, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID do utilizador é obrigatório' },
        { status: 400 }
      )
    }

    const sql = getSql()

    let updateQuery = `UPDATE users SET `
    const updates: string[] = []
    const params: any[] = []

    if (name) {
      updates.push(`name = ${name}`)
    }
    if (email) {
      updates.push(`email = ${email}`)
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updates.push(`password = ${hashedPassword}`)
    }
    if (role) {
      updates.push(`role = ${role}`)
    }
    if (is_active !== undefined) {
      updates.push(`is_active = ${is_active}`)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      )
    }

    const updated = await sql`
      UPDATE users 
      SET name = COALESCE(${name || null}, name),
          email = COALESCE(${email || null}, email),
          role = COALESCE(${role || null}, role),
          is_active = COALESCE(${is_active !== undefined ? is_active : null}, is_active)
      WHERE id = ${id}
      RETURNING id, name, email, role, is_active, created_at
    `

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Utilizador não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar utilizador' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const admin = await verifyAdmin(token)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do utilizador é obrigatório' },
        { status: 400 }
      )
    }

    // Prevent admin from deleting themselves
    if (parseInt(userId) === admin.id) {
      return NextResponse.json(
        { error: 'Não pode deletar a sua própria conta' },
        { status: 400 }
      )
    }

    const sql = getSql()
    await sql`DELETE FROM users WHERE id = ${parseInt(userId)}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar utilizador' },
      { status: 500 }
    )
  }
}

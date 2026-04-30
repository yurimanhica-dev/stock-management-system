import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Helper to verify admin
async function verifyAdmin(token: string) {
  try {
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

    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email já existe' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO users (name, email, password, role, is_active)
      VALUES (${name}, ${email}, ${password}, ${role}, true)
      RETURNING id, name, email, role, is_active
    `

    return NextResponse.json(result[0], { status: 201 })
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

    const { id, name, email, role, is_active, password } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
    }

    let updateQuery = `UPDATE users SET name = '${name}', email = '${email}', role = '${role}', is_active = ${is_active}`
    if (password) {
      updateQuery += `, password = '${password}'`
    }
    updateQuery += ` WHERE id = ${id} RETURNING id, name, email, role, is_active`

    const result = await sql([updateQuery])

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar utilizador' },
      { status: 500 }
    )
  }
}

// DELETE - Remove user
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

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
    }

    // Prevent deleting yourself
    if (id === admin.id) {
      return NextResponse.json(
        { error: 'Não pode deletar a sua própria conta' },
        { status: 400 }
      )
    }

    await sql`DELETE FROM users WHERE id = ${id}`

    return NextResponse.json({ message: 'Utilizador deletado' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar utilizador' },
      { status: 500 }
    )
  }
}

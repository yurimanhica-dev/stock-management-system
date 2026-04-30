import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sku = request.nextUrl.searchParams.get('sku')

    if (!sku) {
      return NextResponse.json({ error: 'SKU is required' }, { status: 400 })
    }

    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'Database URL not configured' },
        { status: 500 }
      )
    }

    const db = neon(dbUrl)

    const result = await db`
      SELECT id FROM products WHERE sku = ${sku}
    `

    return NextResponse.json({ exists: result.length > 0 })
  } catch (error) {
    console.error('Error checking SKU:', error)
    return NextResponse.json(
      { error: 'Failed to check SKU' },
      { status: 500 }
    )
  }
}

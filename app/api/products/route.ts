import { db } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET all products
export async function GET() {
  try {
    const allProducts = await db.select().from(products)
    return NextResponse.json(allProducts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, sku, description, unitPrice, stockQuantity } = body

    if (!name || !sku || !unitPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newProduct = await db
      .insert(products)
      .values({
        name,
        sku,
        description: description || null,
        unitPrice: parseFloat(unitPrice),
        stockQuantity: parseInt(stockQuantity) || 0,
      })
      .returning()

    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

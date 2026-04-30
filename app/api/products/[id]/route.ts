import { db } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
    return NextResponse.json(product[0] || null)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { name, sku, description, unitPrice, stockQuantity, imageUrl, category } = body

    const updated = await db
      .update(products)
      .set({
        name: name || undefined,
        sku: sku || undefined,
        description: description !== undefined ? description : undefined,
        unitPrice: unitPrice ? parseFloat(unitPrice) : undefined,
        stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity) : undefined,
        imageUrl: imageUrl || undefined,
        category: category || undefined,
      })
      .where(eq(products.id, id))
      .returning()

    return NextResponse.json(updated[0] || null)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await db.delete(products).where(eq(products.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

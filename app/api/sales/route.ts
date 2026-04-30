import { db } from '@/lib/db/client'
import { sales, saleItems, products } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET all sales with items
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    let query = db.select().from(sales).orderBy(desc(sales.saleDate))

    const allSales = await query

    // Get items for each sale
    const salesWithItems = await Promise.all(
      allSales.map(async (sale) => {
        const items = await db
          .select()
          .from(saleItems)
          .where(eq(saleItems.saleId, sale.id))

        return { ...sale, items }
      })
    )

    return NextResponse.json(salesWithItems)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 })
  }
}

// POST - Create a new sale with items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, notes } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Sale must have at least one item' },
        { status: 400 }
      )
    }

    // Calculate total
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + parseFloat(item.subtotal),
      0
    )

    // Create sale
    const newSale = await db
      .insert(sales)
      .values({
        totalAmount: totalAmount.toString(),
        notes: notes || null,
      })
      .returning()

    const saleId = newSale[0].id

    // Create sale items and update stock
    for (const item of items) {
      await db.insert(saleItems).values({
        saleId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        subtotal: parseFloat(item.subtotal),
      })

      // Update product stock
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))

      if (product[0]) {
        const newStock = product[0].stockQuantity - item.quantity
        await db
          .update(products)
          .set({ stockQuantity: newStock })
          .where(eq(products.id, item.productId))
      }
    }

    return NextResponse.json(newSale[0], { status: 201 })
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    )
  }
}

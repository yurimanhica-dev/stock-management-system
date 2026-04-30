import { db } from '@/lib/db/client'
import { sales, saleItems, products } from '@/lib/db/schema'
import { eq, sql, and, gte, lte } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // Parse date to get start and end of day
    const startDate = new Date(`${date}T00:00:00Z`)
    const endDate = new Date(`${date}T23:59:59Z`)

    // Get all sales for the day with their items
    const daySales = await db
      .select()
      .from(sales)
      .where(and(gte(sales.saleDate, startDate), lte(sales.saleDate, endDate)))

    // Get all sale items for the day
    const daySaleItems = await db
      .select({
        productId: saleItems.productId,
        quantity: saleItems.quantity,
        unitPrice: saleItems.unitPrice,
        subtotal: saleItems.subtotal,
        productName: products.name,
        imageUrl: products.imageUrl,
      })
      .from(saleItems)
      .innerJoin(products, eq(saleItems.productId, products.id))
      .innerJoin(sales, eq(saleItems.saleId, sales.id))
      .where(and(gte(sales.saleDate, startDate), lte(sales.saleDate, endDate)))

    // Get current stock
    const currentStock = await db.select().from(products)

    // Aggregate data by product
    const productSummary = new Map()

    daySaleItems.forEach((item) => {
      if (!productSummary.has(item.productId)) {
        productSummary.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          imageUrl: item.imageUrl,
          quantitySold: 0,
          totalValue: 0,
        })
      }

      const summary = productSummary.get(item.productId)
      summary.quantitySold += item.quantity
      summary.totalValue += parseFloat(item.subtotal as string)
    })

    // Calculate totals
    const totalSalesCount = daySales.length
    const totalRevenue = daySales.reduce(
      (sum, sale) => sum + parseFloat(sale.totalAmount as string),
      0
    )

    const reportData = {
      date,
      totalSalesCount,
      totalRevenue,
      productsSold: Array.from(productSummary.values()),
      currentStock: currentStock.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.stockQuantity,
        unitPrice: p.unitPrice,
      })),
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error fetching daily report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily report' },
      { status: 500 }
    )
  }
}

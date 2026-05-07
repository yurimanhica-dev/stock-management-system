import { db } from "@/lib/db/client";
import { products, saleItems, sales } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET all sales with items
export async function GET(request: NextRequest) {
  try {
    const allSales = await db
      .select()
      .from(sales)
      .orderBy(desc(sales.saleDate));

    const salesWithItems = await Promise.all(
      allSales.map(async (sale) => {
        const items = await db
          .select()
          .from(saleItems)
          .where(eq(saleItems.saleId, sale.id));

        return { ...sale, items };
      }),
    );

    return NextResponse.json(salesWithItems);
  } catch (error) {
    console.error("GET sales error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 },
    );
  }
}

// POST - Create sale (FIXED)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, notes } = body;

    if (!items?.length) {
      return NextResponse.json(
        { error: "Sale must have at least one item" },
        { status: 400 },
      );
    }

    // 💰 TOTAL
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + Number(item.subtotal),
      0,
    );

    // 🧾 CREATE SALE
    const newSale = await db
      .insert(sales)
      .values({
        userId: null,
        totalAmount: totalAmount.toFixed(2),
        notes: notes || null,
      })
      .returning();

    const saleId = newSale[0].id;

    // 🔥 PREPARE ALL ITEMS (CORRETO)
    const saleItemsData = [];

    for (const item of items) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!product.length) continue;

      const currentStock = product[0].stockQuantity;
      const newStock = currentStock - item.quantity;

      // 🚨 STOCK CHECK
      if (newStock < 0) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${item.productName}` },
          { status: 400 },
        );
      }

      // snapshot
      saleItemsData.push({
        saleId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        subtotal: item.subtotal.toString(),
        snapshot: {
          productId: item.productId,
          productName: item.productName,
          imageUrl: item.imageUrl ?? null,
          unitPrice: Number(item.unitPrice),
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
        },
        notes: item.notes || null,
      });

      // update stock
      await db
        .update(products)
        .set({ stockQuantity: newStock })
        .where(eq(products.id, item.productId));
    }

    // 🚀 SINGLE INSERT (CORRETO + sem overload error)
    await db.insert(saleItems).values(saleItemsData);

    return NextResponse.json(newSale[0], { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);

    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 },
    );
  }
}

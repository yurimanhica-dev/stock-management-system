import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

// GET all products
export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      sku,
      description,
      unitPrice,
      stockQuantity,
      imageUrl,
      category,
    } = body;

    if (!name || !sku || !unitPrice || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newProduct = await db
      .insert(products)
      .values({
        name,
        sku,
        description: description || null,
        unitPrice: parseFloat(unitPrice).toString(),
        stockQuantity: parseInt(stockQuantity) || 0,
        imageUrl,
        category: category || null,
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
